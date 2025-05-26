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

@Entity('releases')
@Unique([
  'title',
  'releaseDate',
  'productionYear',
  'userId',
  'labelId',
  'version',
])
export class Release extends AbstractEntity {
  // TITLE
  @Column({ name: 'title', nullable: false })
  title!: string;

  // COVER ART
  @Column({ name: 'cover_art', nullable: true })
  coverArt: string;

  // UPC
  @Column({ name: 'upc', nullable: true })
  upc: string;

  // RELEASE DATE
  @Column({ name: 'release_date', nullable: false })
  releaseDate: string;

  // VERSION
  @Column({ name: 'version', nullable: true })
  version: string;

  // PRODUCTION YEAR
  @Column({ name: 'production_year', nullable: false })
  productionYear: number;

  // CATALOG NUMBER
  @Column({ name: 'catalog_number', nullable: true })
  catalogNumber: string;

  // LABEL ID
  @Column({ name: 'label_id', nullable: true })
  labelId: string;

  // USER ID
  @Column({ name: 'user_id', nullable: false })
  userId: string;

  // LABEL
  @ManyToOne(() => Label, (label) => label.releases, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'label_id' })
  label: Label;

  // USER
  @ManyToOne(() => User, (user) => user.releases, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  // RELEASE ARTISTS
  @OneToMany(() => ReleaseArtist, (releaseArtist) => releaseArtist.release)
  artists: ReleaseArtist[];

  // TRACKS
  @OneToMany(() => Track, (track) => track.release)
  tracks: Track[];
}
