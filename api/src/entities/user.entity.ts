import { IsNotEmpty, IsString } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { UserStatus } from '../constants/user.constants';
import { Person } from './person.entity';
import { Role } from './role.entity';
import { UUID } from '../types/common.types';

@Entity()
@Unique(['email', 'phoneNumber'])
export class User extends Person {
  // ASSIGNED ROLE (e.g. SUPER_ADMIN from seeds — drives API permissions on login)
  @Column({ name: 'role_id', type: 'uuid', nullable: true })
  roleId?: UUID;

  @ManyToOne(() => Role, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'role_id' })
  assignedRole?: Role;

  // STATUS
  @Column({ name: 'status', type: 'enum', enum: UserStatus, nullable: false, default: UserStatus.ACTIVE })
  status!: UserStatus;

  // PASSWORD
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @Column({
    name: 'password',
    type: 'varchar',
    length: 255,
    nullable: false,
    select: false,
  })
  password!: string;
}
