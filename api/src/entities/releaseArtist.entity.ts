import {
  Column,
  Entity,
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

  // RELEASES
  @ManyToOne(() => Release, (release) => release.artists)
  release!: Release;

  // ARTISTS
  @ManyToOne(() => Artist, (artist) => artist.releases)
  artist!: Artist;
}
