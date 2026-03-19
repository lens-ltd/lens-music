import type { Person } from './person.types';
import type { User } from './user.types';

export { Gender } from '../../constants/person.constants';

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
}

export interface UpdateContributorPayload extends Partial<CreateContributorPayload> {}

export interface Contributor extends Person {
  displayName?: string;
  verificationStatus: ContributorVerificationStatus;
  verifiedById: string;
  verifiedAt: Date;
  profileLinks?: ContributorProfileLink[];
  status: UserStatus;
  verifiedBy: User;
}
