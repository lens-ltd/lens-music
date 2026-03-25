import { AbstractEntity } from "./index.types";

export enum InvitationStatus {
  REQUESTED = 'REQUESTED',
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  REVOKED = 'REVOKED',
  FAILED = 'FAILED',
}

export interface UserInvitation extends AbstractEntity {
  name?: string | null;
  email: string;
  phoneNumber?: string | null;
  token?: string | null;
  expiresAt?: string | null;
  status: InvitationStatus;
  completedAt?: Date | null;
}
