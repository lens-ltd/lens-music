import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Release } from './release.entity';
import { Artist } from './artist.entity';
import { AbstractEntity } from './abstract.entity';

@Entity('release_artists')
export class ReleaseArtist extends AbstractEntity {

  // RELEASE ID
  @Column({ name: 'release_id', nullable: false })
  releaseId!: string;

  // ARTIST ID
  @Column({ name: 'artist_id', nullable: false })
  artistId!: string;

  // RELEASE
  @ManyToOne(() => Release, (release) => release.artists)
  @JoinColumn({ name: 'release_id' })
  release!: Release;

  // ARTIST
  @ManyToOne(() => Artist, (artist) => artist.releases)
  @JoinColumn({ name: 'artist_id' })
  artist!: Artist;
}
