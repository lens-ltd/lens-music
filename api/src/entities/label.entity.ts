import {
  Column,
  Entity,
  Unique,
} from 'typeorm';
import { countriesList } from '../constants/location.constant';
import { AbstractEntity } from './abstract.entity';

@Entity('labels')
@Unique(['id'])
export class Label extends AbstractEntity {
  // NAME
  @Column({ name: 'name', length: 255, type: 'varchar', nullable: false })
  name: string;

  // EMAIL
  @Column({ length: 255, type: 'varchar', nullable: true })
  email: string;

  // DESCRIPTION
  @Column({ name: 'description', length: 255, type: 'varchar', nullable: true })
  description: string;

  // COUNTRY
  @Column({
    name: 'country',
    type: 'enum',
    enum: countriesList.map((country) => country.code),
    nullable: false,
    default: 'RW',
  })
  country?: string;

  // DDEX PARTY ID
  @Column({ name: 'ddex_party_id', type: 'varchar', length: 50, nullable: true })
  ddexPartyId?: string;
}
