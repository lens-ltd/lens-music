import { useCallback, useRef, useState } from "react";
import store from "store";
import { API_URL } from "@/constants/environments.constants";

/** Max % while bytes are still uploading to the API (server → Cloudinary happens after). */
const UPLOAD_BYTES_PROGRESS_CAP = 90;

export type TrackAudioUploadPhase = "sending" | "finalizing" | null;

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

const useTrackAudioUpload = () => {
  const [state, setState] = useState<UploadState>(initialState);
  const xhrRef = useRef<XMLHttpRequest | null>(null);

  const uploadAudio = useCallback(
    (trackId: string, file: File): Promise<unknown> =>
      new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhrRef.current = xhr;

        setState({
          progress: 0,
          phase: "sending",
          isUploading: true,
          isComplete: false,
          error: null,
        });

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable && event.total > 0) {
            const ratio = event.loaded / event.total;
            const capped = Math.round(ratio * UPLOAD_BYTES_PROGRESS_CAP);
            const phase: TrackAudioUploadPhase =
              ratio >= 1 ? "finalizing" : "sending";
            setState((prev) => ({
              ...prev,
              progress: Math.min(capped, UPLOAD_BYTES_PROGRESS_CAP),
              phase,
            }));
          } else {
            setState((prev) => ({
              ...prev,
              progress: Math.min(Math.max(prev.progress, 8), 15),
              phase: "sending",
            }));
          }
        };

        xhr.upload.onload = () => {
          if (xhr.readyState !== XMLHttpRequest.DONE) {
            setState((prev) => ({
              ...prev,
              phase: "finalizing",
              progress: Math.max(prev.progress, UPLOAD_BYTES_PROGRESS_CAP),
            }));
          }
        };

        xhr.onload = () => {
          xhrRef.current = null;

          if (xhr.status >= 200 && xhr.status < 300) {
            let data: unknown;
            try {
              data = JSON.parse(xhr.responseText);
            } catch {
              data = xhr.responseText;
            }

            setState((prev) => ({
              ...prev,
              progress: 100,
              phase: null,
              isUploading: false,
              isComplete: true,
            }));
            resolve(data);
          } else {
            let message = "Upload failed.";
            try {
              const body = JSON.parse(xhr.responseText);
              message = body?.message || message;
            } catch {
              /* use default */
            }

            setState((prev) => ({
              ...prev,
              phase: null,
              isUploading: false,
              error: message,
            }));
            reject(new Error(message));
          }
        };

        xhr.onerror = () => {
          xhrRef.current = null;
          const message = "Network error during upload.";
          setState((prev) => ({
            ...prev,
            phase: null,
            isUploading: false,
            error: message,
          }));
          reject(new Error(message));
        };

        xhr.onabort = () => {
          xhrRef.current = null;
          setState(initialState);
        };

        const formData = new FormData();
        formData.append("file", file);

        xhr.open("POST", `${API_URL}/tracks/${trackId}/audio`);

        const token = store.get("token") as string | undefined;
        if (token) {
          xhr.setRequestHeader("authorization", `Bearer ${token}`);
        }

        xhr.send(formData);
      }),
    [],
  );

  const abort = useCallback(() => {
    xhrRef.current?.abort();
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
