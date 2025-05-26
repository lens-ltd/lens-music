import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { AbstractEntity } from "./abstract.entity";
import { UUID } from "../types/common.types";
import { Release } from "./release.entity";
import { Lyrics } from "./lyrics.entity";

@Entity('tracks')
export class Track extends AbstractEntity {

    // TITLE
  @Column({ name: 'title', nullable: false })
  title!: string;

  // DURATION (in seconds)
  @Column({ name: 'duration', nullable: false, type: 'integer' })
  duration!: number;

  // EXPLICIT
  @Column({ name: 'explicit', nullable: false, type: 'boolean', default: false })
  explicit!: boolean;

  // RELEASE ID
  @Column({ name: 'release_id', nullable: false, type: 'uuid' })
  releaseId!: UUID;

  // RELEASE
  @ManyToOne(() => Release, (release) => release.tracks)
  @JoinColumn({ name: 'release_id' })
  release!: Release;

  // ISRC
  @Column({ name: 'isrc', nullable: true, type: 'varchar', unique: true })
  isrc!: string;

  // LYRICS
  @OneToMany(() => Lyrics, (lyrics) => lyrics.track)
  lyrics!: Lyrics[];
}