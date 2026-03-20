import { Column, Entity, Index } from 'typeorm';
import { AbstractEntity } from './abstract.entity';

@Entity('password_reset_tokens')
@Index(['userId'], { unique: true })
@Index(['token'], { unique: true })
export class PasswordResetToken extends AbstractEntity {
  @Column({ name: 'user_id', type: 'uuid', nullable: false })
  userId!: string;

  @Column({ name: 'token', type: 'varchar', length: 255, nullable: false })
  token!: string;

  @Column({ name: 'expires_at', type: 'timestamp', nullable: false })
  expiresAt!: Date;
}
