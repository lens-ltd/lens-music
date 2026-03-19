import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Unique,
} from 'typeorm';
import { Label } from './label.entity';
import { User } from './user.entity';
import { ReleaseArtist } from './releaseArtist.entity';
import { AbstractEntity } from './abstract.entity';
import { Track } from './track.entity';
import {
  ReleaseParentalAdvisory,
  ReleaseRightsLine,
  ReleaseStatus,
  ReleaseType,
} from '../constants/release.constants';
import { UUID } from '../types/common.types';

@Entity('releases')
@Unique([
  'title',
  'digitalReleaseDate',
  'originalReleaseDate',
  'preorderDate',
  'productionYear',
  'version',
])
export class Release extends AbstractEntity {
  // TITLE
  @Column({ name: 'title', type: 'varchar', length: 500, nullable: false })
  title!: string;

  // UPC
  @Column({ name: 'upc', type: 'varchar', length: 14, nullable: true, unique: true })
  upc?: string;

  // VERSION
  @Column({ name: 'version', type: 'varchar', length: 255, nullable: true })
  version?: string;

  // PRODUCTION YEAR
  @Column({ name: 'production_year', type: 'integer', nullable: true })
  productionYear: number;

  // CATALOG NUMBER
  @Column({ name: 'catalog_number', type: 'varchar', length: 50, nullable: true })
  catalogNumber?: string;

  // TITLE VERSION
  @Column({ name: 'title_version', type: 'varchar', length: 255, nullable: true })
  titleVersion?: string;

  // RELEASE TYPE
  @Column({
    name: 'type',
    type: 'enum',
    enum: ReleaseType,
    nullable: true,
    default: ReleaseType.ALBUM,
  })
  type?: ReleaseType;

  // PRIMARY LANGUAGE
  @Column({ name: 'primary_language', type: 'varchar', length: 5, nullable: true })
  primaryLanguage?: string;

  // C LINE
  @Column({ name: 'c_line', type: 'jsonb', nullable: true })
  cLine?: ReleaseRightsLine | null;

  // P LINE
  @Column({ name: 'p_line', type: 'jsonb', nullable: true })
  pLine?: ReleaseRightsLine | null;

  // ORIGINAL RELEASE DATE
  @Column({ name: 'original_release_date', type: 'date', nullable: true })
  originalReleaseDate?: string;

  // DIGITAL RELEASE DATE
  @Column({ name: 'digital_release_date', type: 'date', nullable: true })
  digitalReleaseDate?: string;

  // PREORDER DATE
  @Column({ name: 'preorder_date', type: 'date', nullable: true })
  preorderDate?: string;

  // PARENTAL ADVISORY
  @Column({
    name: 'parental_advisory',
    type: 'enum',
    enum: ReleaseParentalAdvisory,
    nullable: false,
    default: ReleaseParentalAdvisory.NOT_EXPLICIT,
  })
  parentalAdvisory!: ReleaseParentalAdvisory;

  // STATUS
  @Column({
    name: 'status',
    type: 'enum',
    enum: ReleaseStatus,
    nullable: false,
    default: ReleaseStatus.DRAFT,
  })
  status!: ReleaseStatus;

  // METADATA LANGUAGE
  @Column({ name: 'metadata_language', type: 'varchar', length: 5, nullable: true })
  metadataLanguage?: string;

  // TERRITORIES
  @Column({ name: 'territories', type: 'jsonb', nullable: true, default: () => "'[]'" })
  territories?: string[];

  // CREATED BY ID
  @Column({ name: 'created_by', type: 'uuid', nullable: true })
  createdById?: UUID;

  // CREATED BY
  @ManyToOne(() => User, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'created_by' })
  createdBy?: User | null;

  // TRACKS
  @OneToMany(() => Track, (track) => track.release)
  tracks!: Track[];

  // RELEASE ARTISTS
  @OneToMany(() => ReleaseArtist, (releaseArtist) => releaseArtist.release)
  artists!: ReleaseArtist[];
}
