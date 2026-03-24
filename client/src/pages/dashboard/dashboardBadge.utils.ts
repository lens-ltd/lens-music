import { ReleaseStatus, TrackStatus } from './dashboard.data';
import { DashboardBadgeTone } from './components/DashboardBadge';

const trackStatusTone: Record<TrackStatus, DashboardBadgeTone> = {
  Active: 'primary',
  Rising: 'accent',
  Declining: 'muted',
};

const releaseStatusTone: Record<ReleaseStatus, DashboardBadgeTone> = {
  Live: 'primary',
  Pending: 'accent',
  Scheduled: 'muted',
};

export const getTrackStatusTone = (status: TrackStatus) => trackStatusTone[status];

export const getReleaseStatusTone = (status: ReleaseStatus) =>
  releaseStatusTone[status];
