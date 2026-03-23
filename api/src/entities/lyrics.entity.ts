import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { Track } from './track.entity';
import { UUID } from '../types/common.types';

@Entity()
export class Lyrics extends AbstractEntity {
  // CONTENT
  @Column({ type: 'jsonb' })
  content: { time?: number; text: string }[];

  // TRACK ID
  @Column({ name: 'track_id', nullable: false, type: 'uuid' })
  trackId!: UUID;

  // TRACK
  @ManyToOne(() => Track, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'track_id' })
  track!: Track;

  // LANGUAGE
  @Column({
    name: 'language',
    nullable: false,
    type: 'varchar',
    default: 'en',
  })
  language!: string;
}
