import { UUID } from '../common.types';
import { AbstractEntity } from './index.types';
import type { Person } from './person.types';
import type { User } from './user.types';

export { Gender } from '../../constants/person.constants';

export enum ContributorType {
  INDIVIDUAL = 'INDIVIDUAL',
  GROUP = 'GROUP',
  ORCHESTRA = 'ORCHESTRA',
  CHOIR = 'CHOIR',
  OTHER = 'OTHER',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum ContributorVerificationStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  NOT_VERIFIED = 'NOT_VERIFIED',
}

export enum ContributorProfileLinkType {
  WEBSITE = 'WEBSITE',
  FACEBOOK = 'FACEBOOK',
  TWITTER = 'TWITTER',
  INSTAGRAM = 'INSTAGRAM',
  YOUTUBE = 'YOUTUBE',
  SPOTIFY = 'SPOTIFY',
  APPLE_MUSIC = 'APPLE_MUSIC',
  DEEZER = 'DEEZER',
  TIDAL = 'TIDAL',
  AMAZON_MUSIC = 'AMAZON_MUSIC',
  GOOGLE_MUSIC = 'GOOGLE_MUSIC',
  SOUNDCLOUD = 'SOUNDCLOUD',
  TIKTOK = 'TIKTOK',
}

export interface ContributorProfileLink {
  type: ContributorProfileLinkType;
  url?: string;
}

export interface CreateContributorPayload {
  name: string;
  displayName?: string;
  email?: string;
  phoneNumber?: string;
  country?: string;
  gender?: string;
  dateOfBirth?: string;
  profileLinks?: ContributorProfileLink[];
  status?: UserStatus;
  verificationStatus?: ContributorVerificationStatus;
  type?: ContributorType;
  ipn?: string;
  ipi?: string;
  parentContributorId?: string;
}

export interface UpdateContributorPayload extends Partial<CreateContributorPayload> {}

export interface Contributor extends Person {
  displayName?: string;
  verificationStatus: ContributorVerificationStatus;
  verifiedById: string;
  verifiedAt: Date;
  profileLinks?: ContributorProfileLink[];
  status: UserStatus;
  type?: ContributorType;
  ipn?: string;
  ipi?: string;
  verifiedBy: User;
}

export interface ContributorMembership extends AbstractEntity {
  parentContributorId: UUID;
  memberContributorId: UUID;
  parentContributor?: Contributor;
  memberContributor?: Contributor;
}

export interface CreateContributorMembershipPayload {
  parentContributorId: string;
  memberContributorId: string;
}
