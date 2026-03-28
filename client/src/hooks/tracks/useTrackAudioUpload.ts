import { useCallback, useRef, useState } from "react";
import store from "store";
import { API_URL, CLOUDINARY_CLOUD_NAME } from "@/constants/environments.constants";
import {
  AudioMetadata,
  computeSha256,
  extractAudioMetadata,
} from "@/utils/audioMetadata";

const MAX_AUDIO_SIZE_BYTES = 50 * 1024 * 1024;

/** Progress reserved for the register-with-backend step after Cloudinary upload. */
const CLOUDINARY_PROGRESS_CAP = 95;

export type TrackAudioUploadPhase = "uploading" | "registering" | null;

type UploadState = {
  progress: number;
  phase: TrackAudioUploadPhase;
  isUploading: boolean;
  isComplete: boolean;
  error: string | null;
};

const initialState: UploadState = {
  progress: 0,
  phase: null,
  isUploading: false,
  isComplete: false,
  error: null,
};

interface SignatureResponse {
  data: {
    signature: string;
    timestamp: number;
    cloudName: string;
    apiKey: string;
    folder: string;
  };
}

interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  bytes: number;
  duration?: number;
  format?: string;
  resource_type: string;
}

const useTrackAudioUpload = () => {
  const [state, setState] = useState<UploadState>(initialState);
  const xhrRef = useRef<XMLHttpRequest | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const getAuthHeaders = (): Record<string, string> => {
    const token = store.get("token") as string | undefined;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["authorization"] = `Bearer ${token}`;
    }
    return headers;
  };

  const fetchSignature = async (
    trackId: string,
    signal: AbortSignal,
  ): Promise<SignatureResponse["data"]> => {
    const response = await fetch(`${API_URL}/tracks/${trackId}/audio/sign`, {
      headers: getAuthHeaders(),
      signal,
    });

    if (!response.ok) {
      let message = "Failed to get upload signature.";
      try {
        const body = await response.json();
        message = body?.message || message;
      } catch {
        /* use default */
      }
      throw new Error(message);
    }

    const json = (await response.json()) as SignatureResponse;
    return json.data;
  };

  const uploadToCloudinary = (
    file: File,
    signature: SignatureResponse["data"],
  ): Promise<CloudinaryUploadResponse> =>
    new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhrRef.current = xhr;

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && event.total > 0) {
          const ratio = event.loaded / event.total;
          const capped = Math.round(ratio * CLOUDINARY_PROGRESS_CAP);
          setState((prev) => ({
            ...prev,
            progress: Math.min(capped, CLOUDINARY_PROGRESS_CAP),
          }));
        }
      };

      xhr.onload = () => {
        xhrRef.current = null;

        if (xhr.status >= 200 && xhr.status < 300) {
          let data: CloudinaryUploadResponse;
          try {
            data = JSON.parse(xhr.responseText) as CloudinaryUploadResponse;
          } catch {
            reject(new Error("Invalid response from Cloudinary."));
            return;
          }
          resolve(data);
        } else {
          let message = "Upload to Cloudinary failed.";
          try {
            const body = JSON.parse(xhr.responseText);
            message = body?.error?.message || message;
          } catch {
            /* use default */
          }
          reject(new Error(message));
        }
      };

      xhr.onerror = () => {
        xhrRef.current = null;
        reject(new Error("Network error during upload."));
      };

      xhr.onabort = () => {
        xhrRef.current = null;
        reject(new Error("Upload aborted."));
      };

      const cloudName = signature.cloudName || CLOUDINARY_CLOUD_NAME;
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", signature.apiKey);
      formData.append("timestamp", String(signature.timestamp));
      formData.append("signature", signature.signature);
      formData.append("folder", signature.folder);

      xhr.open(
        "POST",
        `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
      );
      xhr.send(formData);
    });

  const registerWithBackend = async (
    trackId: string,
    cloudinaryResult: CloudinaryUploadResponse,
    originalName: string,
    signal: AbortSignal,
    audioMeta: AudioMetadata,
    checksumSha256: string,
  ): Promise<unknown> => {
    const response = await fetch(
      `${API_URL}/tracks/${trackId}/audio/register`,
      {
        method: "POST",
        headers: getAuthHeaders(),
        signal,
        body: JSON.stringify({
          secureUrl: cloudinaryResult.secure_url,
          publicId: cloudinaryResult.public_id,
          bytes: cloudinaryResult.bytes,
          durationMs:
            audioMeta.durationMs ??
            (cloudinaryResult.duration
              ? Math.round(cloudinaryResult.duration * 1000)
              : undefined),
          sampleRate: audioMeta.sampleRate,
          bitDepth: audioMeta.bitDepth,
          channels: audioMeta.channels,
          checksumSha256,
          format: cloudinaryResult.format,
          originalName,
        }),
      },
    );

    if (!response.ok) {
      let message = "File uploaded but could not be saved. Please try again.";
      try {
        const body = await response.json();
        message = body?.message || message;
      } catch {
        /* use default */
      }
      throw new Error(message);
    }

    return response.json();
  };

  const uploadAudio = useCallback(
    async (trackId: string, file: File): Promise<unknown> => {
      if (!file.type.startsWith("audio/")) {
        throw new Error("Only audio files are allowed.");
      }

      if (file.size > MAX_AUDIO_SIZE_BYTES) {
        throw new Error("Audio file size must be 50MB or less.");
      }

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      setState({
        progress: 0,
        phase: "uploading",
        isUploading: true,
        isComplete: false,
        error: null,
      });

      try {
        // Step 1: Get signed upload params from backend
        const signature = await fetchSignature(
          trackId,
          abortController.signal,
        );

        // Step 2: Upload to Cloudinary + extract metadata in parallel
        const metadataPromise = extractAudioMetadata(file);
        const checksumPromise = computeSha256(file);
        const cloudinaryResult = await uploadToCloudinary(file, signature);
        const [audioMeta, checksumSha256] = await Promise.all([
          metadataPromise,
          checksumPromise,
        ]);

        // Step 3: Register the uploaded file with our backend
        setState((prev) => ({
          ...prev,
          phase: "registering",
          progress: CLOUDINARY_PROGRESS_CAP,
        }));

        const result = await registerWithBackend(
          trackId,
          cloudinaryResult,
          file.name,
          abortController.signal,
          audioMeta,
          checksumSha256,
        );

        setState({
          progress: 100,
          phase: null,
          isUploading: false,
          isComplete: true,
          error: null,
        });

        abortControllerRef.current = null;
        return result;
      } catch (error) {
        abortControllerRef.current = null;

        if ((error as Error).name === "AbortError") {
          setState(initialState);
          return;
        }

        const message =
          error instanceof Error ? error.message : "Upload failed.";
        setState((prev) => ({
          ...prev,
          phase: null,
          isUploading: false,
          error: message,
        }));
        throw error;
      }
    },
    [],
  );

  const abort = useCallback(() => {
    xhrRef.current?.abort();
    abortControllerRef.current?.abort();
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    uploadAudio,
    abort,
    reset,
    progress: state.progress,
    phase: state.phase,
    isUploading: state.isUploading,
    isComplete: state.isComplete,
    error: state.error,
  };
};

export default useTrackAudioUpload;
