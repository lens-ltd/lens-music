import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { AbstractEntity } from "./abstract.entity";
import { UUID } from "../types/common.types";
import { Track } from "./track.entity";
import { User } from "./user.entity";

export enum AudioFileType {
  ORIGINAL = "ORIGINAL",
  WAV = "WAV",
  FLAC = "FLAC",
  MP3_320 = "MP3_320",
  MP3_128 = "MP3_128",
  AAC = "AAC",
  OGG = "OGG",
}

@Entity("audio_files")
export class AudioFile extends AbstractEntity {
  // TRACK ID
  @Column({ name: "track_id", type: "uuid", nullable: false })
  trackId!: UUID;

  // FILE TYPE
  @Column({
    name: "file_type",
    type: "enum",
    enum: AudioFileType,
    nullable: false,
  })
  fileType!: AudioFileType;

  // STORAGE PATH (Cloudinary secure URL)
  @Column({ name: "storage_path", type: "text", nullable: false })
  storagePath!: string;

  // FILE SIZE BYTES
  @Column({ name: "file_size_bytes", type: "bigint", nullable: true })
  fileSizeBytes?: number;

  // CHECKSUM SHA256
  @Column({ name: "checksum_sha256", type: "char", length: 64, nullable: true })
  checksumSha256?: string;

  // SAMPLE RATE
  @Column({ name: "sample_rate", type: "integer", nullable: true })
  sampleRate?: number;

  // BIT DEPTH
  @Column({ name: "bit_depth", type: "integer", nullable: true })
  bitDepth?: number;

  // CHANNELS
  @Column({ name: "channels", type: "integer", nullable: false, default: 2 })
  channels!: number;

  // DURATION (MILLISECONDS)
  @Column({ name: "duration_ms", type: "integer", nullable: true })
  durationMs?: number;

  // IS PRIMARY
  @Column({ name: "is_primary", type: "boolean", nullable: false, default: false })
  isPrimary!: boolean;

  // UPLOADED AT
  @Column({
    name: "uploaded_at",
    type: "timestamptz",
    nullable: false,
    default: () => "now()",
  })
  uploadedAt!: Date;

  // UPLOADED BY ID
  @Column({ name: "uploaded_by_id", type: "uuid", nullable: true })
  uploadedById?: UUID;

  /**
   * RELATIONS
   */

  // TRACK
  @ManyToOne(() => Track, (track) => track.audioFiles, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "track_id" })
  track!: Track;

  // UPLOADED BY
  @ManyToOne(() => User, {
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
    nullable: true,
  })
  @JoinColumn({ name: "uploaded_by_id" })
  uploadedBy?: User;
}
