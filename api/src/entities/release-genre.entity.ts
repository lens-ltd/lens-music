import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { Release } from './release.entity';
import { Genre } from './genre.entity';
import { ReleaseGenreType } from '../constants/release.constants';

@Entity('release_genres')
@Unique(['releaseId', 'type'])
export class ReleaseGenre extends AbstractEntity {
  @Column({ name: 'release_id', type: 'uuid', nullable: false })
  releaseId!: string;

  @Column({ name: 'genre_id', type: 'uuid', nullable: false })
  genreId!: string;

  @Column({
    name: 'type',
    type: 'enum',
    enum: ReleaseGenreType,
    nullable: false,
  })
  type!: ReleaseGenreType;

  @ManyToOne(() => Release, (release) => release.genres, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'release_id' })
  release!: Release;

  @ManyToOne(() => Genre, (genre) => genre.releaseGenres, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'genre_id' })
  genre!: Genre;
}
