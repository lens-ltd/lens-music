import { IsNotEmpty, IsString } from 'class-validator';
import { Column, Entity, Unique } from 'typeorm';
import { UserStatus } from '../constants/user.constants';
import { Person } from './person.entity';

@Entity()
@Unique(['email', 'phoneNumber'])
export class User extends Person {
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
