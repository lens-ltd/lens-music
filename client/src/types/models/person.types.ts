import type { AbstractEntity } from './index.types';
import type { Gender } from '../../constants/person.constants';

export interface Person extends AbstractEntity {
  name: string;
  email?: string;
  phoneNumber?: string;
  country?: string;
  gender?: Gender;
  dateOfBirth?: Date;
}
