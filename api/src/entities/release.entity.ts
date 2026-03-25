import { Column, Entity, OneToMany, Unique } from "typeorm";
import { AbstractEntity } from "./abstract.entity";
import { Track } from "./track.entity";
import { ReleaseNavigationFlow } from "./release-navigation-flow.entity";
import { ReleaseGenre } from "./release-genre.entity";
import { ReleaseStore } from "./release-store.entity";
import { ReleaseLabel } from "./release-label.entity";
import { Deal } from "./deal.entity";
import {
  ReleaseParentalAdvisory,
  ReleaseRightsLine,
  ReleaseStatus,
  ReleaseType,
} from "../constants/release.constants";

@Entity("releases")
@Unique([
  "title",
  "digitalReleaseDate",
  "originalReleaseDate",
  "preorderDate",
  "productionYear",
  "version",
])
export class Release extends AbstractEntity {
  // TITLE
  @Column({ name: "title", type: "varchar", length: 500, nullable: false })
  title!: string;

  // UPC
  @Column({
    name: "upc",
    type: "varchar",
    length: 14,
    nullable: true,
    unique: true,
  })
  upc?: string;

  // VERSION
  @Column({ name: "version", type: "varchar", length: 255, nullable: true })
  version?: string;

  // COVER ART
  @Column({
    name: "cover_art_url",
    type: "varchar",
    length: 1024,
    nullable: true,
  })
  coverArtUrl?: string;

  @Column({ name: "cover_art_width", type: "integer", nullable: true })
  coverArtWidth?: number;

  @Column({ name: "cover_art_height", type: "integer", nullable: true })
  coverArtHeight?: number;

  // PRODUCTION YEAR
  @Column({ name: "production_year", type: "integer", nullable: true })
  productionYear: number;

  // CATALOG NUMBER
  @Column({
    name: "catalog_number",
    type: "varchar",
    length: 50,
    nullable: true,
  })
  catalogNumber?: string;

  // TITLE VERSION
  @Column({
    name: "title_version",
    type: "varchar",
    length: 255,
    nullable: true,
  })
  titleVersion?: string;

  // RELEASE TYPE
  @Column({
    name: "type",
    type: "enum",
    enum: ReleaseType,
    nullable: true,
    default: ReleaseType.ALBUM,
  })
  type?: ReleaseType;

  // PRIMARY LANGUAGE
  @Column({
    name: "primary_language",
    type: "varchar",
    length: 5,
    nullable: true,
  })
  primaryLanguage?: string;

  // C LINE
  @Column({ name: "c_line", type: "jsonb", nullable: true })
  cLine?: ReleaseRightsLine | null;

  // P LINE
  @Column({ name: "p_line", type: "jsonb", nullable: true })
  pLine?: ReleaseRightsLine | null;

  // ORIGINAL RELEASE DATE
  @Column({ name: "original_release_date", type: "date", nullable: true })
  originalReleaseDate?: string;

  // DIGITAL RELEASE DATE
  @Column({ name: "digital_release_date", type: "date", nullable: true })
  digitalReleaseDate?: string;

  // PREORDER DATE
  @Column({ name: "preorder_date", type: "date", nullable: true })
  preorderDate?: string;

  // PARENTAL ADVISORY
  @Column({
    name: "parental_advisory",
    type: "enum",
    enum: ReleaseParentalAdvisory,
    nullable: false,
    default: ReleaseParentalAdvisory.NOT_EXPLICIT,
  })
  parentalAdvisory!: ReleaseParentalAdvisory;

  // STATUS
  @Column({
    name: "status",
    type: "enum",
    enum: ReleaseStatus,
    nullable: false,
    default: ReleaseStatus.DRAFT,
  })
  status!: ReleaseStatus;

  // METADATA LANGUAGE
  @Column({
    name: "metadata_language",
    type: "varchar",
    length: 5,
    nullable: true,
  })
  metadataLanguage?: string;

  // TERRITORIES
  @Column({
    name: "territories",
    type: "jsonb",
    nullable: true,
    default: () => "'[]'",
  })
  territories?: string[];

  // TRACKS
  @OneToMany(() => Track, (track) => track.release)
  tracks!: Track[];

  // RELEASE NAVIGATION FLOWS
  @OneToMany(
    () => ReleaseNavigationFlow,
    (releaseNavigationFlow) => releaseNavigationFlow.release,
  )
  releaseNavigationFlows!: ReleaseNavigationFlow[];

  // RELEASE GENRES
  @OneToMany(() => ReleaseGenre, (releaseGenre) => releaseGenre.release)
  genres!: ReleaseGenre[];
  // RELEASE STORES
  @OneToMany(() => ReleaseStore, (releaseStore) => releaseStore.release)
  releaseStores!: ReleaseStore[];

  // RELEASE LABELS
  @OneToMany(() => ReleaseLabel, (releaseLabel) => releaseLabel.release)
  releaseLabels!: ReleaseLabel[];

  // DEALS
  @OneToMany(() => Deal, (deal) => deal.release)
  deals!: Deal[];

  // GRid (Global Release Identifier)
  @Column({ name: "grid", type: "varchar", length: 18, nullable: true, unique: true })
  grid?: string;

  // COVER ART CHECKSUM (SHA-256)
  @Column({ name: "cover_art_checksum_sha256", type: "char", length: 64, nullable: true })
  coverArtChecksumSha256?: string;

  // COVER ART FILE SIZE (BYTES)
  @Column({ name: "cover_art_file_size_bytes", type: "bigint", nullable: true })
  coverArtFileSizeBytes?: number;

  // DESCRIPTION
  @Column({ name: "description", type: "text", nullable: true })
  description?: string;

  // KEYWORDS
  @Column({ name: "keywords", type: "jsonb", nullable: true, default: () => "'[]'" })
  keywords?: string[];

  // MARKETING COMMENT
  @Column({ name: "marketing_comment", type: "text", nullable: true })
  marketingComment?: string;
}
