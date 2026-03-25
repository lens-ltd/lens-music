import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Unique,
} from "typeorm";
import { AbstractEntity } from "./abstract.entity";
import { UUID } from "../types/common.types";
import { Release } from "./release.entity";
import { Lyrics } from "./lyrics.entity";
import { AudioFile } from "./audio-file.entity";
import { TrackContributor } from "./track-contributor.entity";
import { ReleaseParentalAdvisory } from "../constants/release.constants";
import { SoundRecordingType } from "../constants/ddex.constants";

export enum TrackStatus {
  DRAFT = "DRAFT",
  VALIDATED = "VALIDATED",
  READY = "READY",
  DELIVERED = "DELIVERED",
  LIVE = "LIVE",
  TAKENDOWN = "TAKENDOWN",
}

@Entity("tracks")
@Unique(["releaseId", "discNumber", "trackNumber"])
export class Track extends AbstractEntity {
  // RELEASE ID
  @Column({ name: "release_id", nullable: false, type: "uuid" })
  releaseId!: UUID;

  // TITLE
  @Column({ name: "title", type: "varchar", length: 500, nullable: false })
  title!: string;

  // TITLE VERSION
  @Column({ name: "title_version", type: "varchar", length: 255, nullable: true })
  titleVersion?: string;

  // ISRC
  @Column({ name: "isrc", type: "char", length: 12, nullable: true, unique: true })
  isrc?: string;

  // ISWC
  @Column({ name: "iswc", type: "varchar", length: 20, nullable: true })
  iswc?: string;

  // DISC NUMBER
  @Column({ name: "disc_number", type: "integer", nullable: false, default: 1 })
  discNumber!: number;

  // TRACK NUMBER
  @Column({ name: "track_number", type: "integer", nullable: false })
  trackNumber!: number;

  // DURATION (MILLISECONDS)
  @Column({ name: "duration_ms", type: "integer", nullable: false })
  durationMs!: number;

  // BPM
  @Column({ name: "bpm", type: "numeric", precision: 6, scale: 2, nullable: true })
  bpm?: string;

  // MUSICAL KEY
  @Column({ name: "musical_key", type: "varchar", length: 10, nullable: true })
  musicalKey?: string;

  // PARENTAL ADVISORY
  @Column({
    name: "parental_advisory",
    type: "enum",
    enum: ReleaseParentalAdvisory,
    nullable: false,
    default: ReleaseParentalAdvisory.NOT_EXPLICIT,
  })
  parentalAdvisory!: ReleaseParentalAdvisory;

  // PRIMARY LANGUAGE
  @Column({ name: "primary_language", type: "varchar", length: 5, nullable: true })
  primaryLanguage?: string;

  // PREVIEW START (MILLISECONDS)
  @Column({ name: "preview_start_ms", type: "integer", nullable: true })
  previewStartMs?: number;

  // BONUS TRACK FLAG
  @Column({ name: "is_bonus_track", type: "boolean", nullable: false, default: false })
  isBonusTrack!: boolean;

  // HIDDEN TRACK FLAG
  @Column({ name: "is_hidden_track", type: "boolean", nullable: false, default: false })
  isHiddenTrack!: boolean;

  // INSTRUMENTAL FLAG
  @Column({ name: "is_instrumental", type: "boolean", nullable: false, default: false })
  isInstrumental!: boolean;

  // AUDIO LANGUAGE (distinct from primaryLanguage which is lyrics language)
  @Column({ name: "audio_language", type: "varchar", length: 5, nullable: true })
  audioLanguage?: string;

  // C LINE YEAR
  @Column({ name: "c_line_year", type: "integer", nullable: true })
  cLineYear?: number;

  // C LINE OWNER
  @Column({ name: "c_line_owner", type: "varchar", length: 255, nullable: true })
  cLineOwner?: string;

  // P LINE YEAR
  @Column({ name: "p_line_year", type: "integer", nullable: true })
  pLineYear?: number;

  // P LINE OWNER
  @Column({ name: "p_line_owner", type: "varchar", length: 255, nullable: true })
  pLineOwner?: string;

  // SOUND RECORDING TYPE (DDEX)
  @Column({
    name: "sound_recording_type",
    type: "enum",
    enum: SoundRecordingType,
    nullable: false,
    default: SoundRecordingType.MUSICAL_WORK_SOUND_RECORDING,
  })
  soundRecordingType!: SoundRecordingType;

  // PREVIEW DURATION (MILLISECONDS)
  @Column({ name: "preview_duration_ms", type: "integer", nullable: true })
  previewDurationMs?: number;

  // STATUS
  @Column({
    name: "status",
    type: "enum",
    enum: TrackStatus,
    nullable: false,
    default: TrackStatus.DRAFT,
  })
  status!: TrackStatus;

  // RELEASE
  @ManyToOne(() => Release, (release) => release.tracks, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "release_id" })
  release!: Release;

  // LYRICS
  @OneToMany(() => Lyrics, (lyrics) => lyrics.track)
  lyrics!: Lyrics[];

  // AUDIO FILES
  @OneToMany(() => AudioFile, (audioFile) => audioFile.track)
  audioFiles!: AudioFile[];

  // TRACK CONTRIBUTORS
  @OneToMany(() => TrackContributor, (trackContributor) => trackContributor.track)
  trackContributors!: TrackContributor[];
}
