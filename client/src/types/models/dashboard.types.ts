import { ReleaseStatus, ReleaseType } from './release.types';
import { ReleaseDeliveryStatus } from './releaseStore.types';

export interface DashboardRelease {
  id: string;
  title: string;
  coverArtUrl: string | null;
  type: ReleaseType | null;
  digitalReleaseDate: string | null;
  status: ReleaseStatus;
  trackCount: number;
  storeCount: number;
  updatedAt: string;
}

export type DashboardActionKind = 'REVIEW_FEEDBACK' | 'DELIVERY_FAILED';

export interface DashboardActionItem {
  id: string;
  releaseId: string;
  releaseTitle: string;
  kind: DashboardActionKind;
  message: string;
  updatedAt: string;
}

export interface DashboardSummary {
  generatedAt: string;
  totals: {
    releases: number;
    tracks: number;
    liveReleases: number;
    upcomingReleases: number;
  };
  releasePipeline: Array<{
    status: ReleaseStatus;
    count: number;
  }>;
  deliveryHealth: {
    total: number;
    deliveredRate: number;
    byStatus: Array<{
      status: ReleaseDeliveryStatus;
      count: number;
    }>;
  };
  recentReleases: DashboardRelease[];
  actionItems: DashboardActionItem[];
}

export interface DashboardSummaryResponse {
  message: string;
  data: DashboardSummary;
}
