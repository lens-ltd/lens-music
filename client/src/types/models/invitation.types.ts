import { AbstractEntity } from "./index.types";

export enum InvitationStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  REVOKED = 'REVOKED',
  FAILED = 'FAILED',
}

export interface UserInvitation extends AbstractEntity {
  email: string;
  token: string;
  expiresAt: string;
  status: InvitationStatus;
  completedAt?: Date;
}
