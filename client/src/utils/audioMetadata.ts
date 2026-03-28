import { parseBlob } from "music-metadata";

export interface AudioMetadata {
  sampleRate?: number;
  bitDepth?: number;
  channels?: number;
  durationMs?: number;
}

export async function extractAudioMetadata(
  file: File,
): Promise<AudioMetadata> {
  try {
    const metadata = await parseBlob(file);
    const format = metadata.format;
    return {
      sampleRate:
        typeof format.sampleRate === "number" && Number.isFinite(format.sampleRate)
          ? Math.round(format.sampleRate)
          : undefined,
      bitDepth:
        typeof format.bitsPerSample === "number" &&
        Number.isFinite(format.bitsPerSample)
          ? Math.round(format.bitsPerSample)
          : undefined,
      channels:
        typeof format.numberOfChannels === "number" &&
        Number.isFinite(format.numberOfChannels)
          ? Math.round(format.numberOfChannels)
          : undefined,
      durationMs:
        typeof format.duration === "number" && Number.isFinite(format.duration)
          ? Math.round(format.duration * 1000)
          : undefined,
    };
  } catch {
    return {};
  }
}

export async function computeSha256(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
