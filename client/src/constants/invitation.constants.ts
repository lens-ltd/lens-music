export const INVITATION_STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'REQUESTED', label: 'Requested' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'FAILED', label: 'Failed' },
  { value: 'REVOKED', label: 'Revoked' },
  { value: 'COMPLETED', label: 'Completed' },
] as const;
