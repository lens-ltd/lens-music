import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { STATUSES } from '../constants/artist.constants';
import { User } from './user.entity';
import { ReleaseArtist } from './releaseArtist.entity';
import { AbstractEntity } from './abstract.entity';

@Entity('artists')
export class Artist extends AbstractEntity {
  // NAME
  @Column({ name: 'name', nullable: false })
  name!: string;

  // STATUS
  @Column({
    name: 'status',
    nullable: false,
    type: 'enum',
    enum: Object.values(STATUSES),
    default: STATUSES.ACTIVE,
  })
  status!: string;

  // USER ID
  @Column({ name: 'user_id', nullable: false })
  userId!: string;

  // USER
  @ManyToOne(() => User, (user) => user.artists, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  // RELEASE ARTISTS
  @OneToMany(() => ReleaseArtist, (releaseArtist) => releaseArtist.artist)
  releases: ReleaseArtist[];
}
