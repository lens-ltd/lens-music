import { Column, Entity, Index } from 'typeorm';
import { InvitationStatus } from '../constants/invitation.constants';
import { AbstractEntity } from './abstract.entity';

@Entity('user_invitations')
@Index(['email'], { unique: true })
@Index(['token'], { unique: true })
export class UserInvitation extends AbstractEntity {
  @Column({ name: 'name', type: 'varchar', length: 255, nullable: true })
  name!: string | null;

  @Column({ name: 'email', type: 'varchar', length: 255, nullable: false })
  email!: string;

  @Column({ name: 'phone_number', type: 'varchar', length: 255, nullable: true })
  phoneNumber!: string | null;

  @Column({ name: 'token', type: 'varchar', length: 255, nullable: true })
  token!: string | null;

  @Column({ name: 'expires_at', type: 'timestamp', nullable: true })
  expiresAt!: Date | null;

  @Column({
    name: 'status',
    type: 'varchar',
    length: 32,
    default: InvitationStatus.PENDING,
  })
  status!: InvitationStatus;

  @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
  completedAt!: Date | null;
}
