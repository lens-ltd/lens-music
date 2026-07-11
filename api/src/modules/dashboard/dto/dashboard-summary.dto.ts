import { ReleaseStatus, ReleaseType } from '../../../constants/release.constants';
import { ReleaseDeliveryStatus } from '../../../constants/store.constants';

export interface DashboardReleaseDto {
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

export interface DashboardActionItemDto {
  id: string;
  releaseId: string;
  releaseTitle: string;
  kind: DashboardActionKind;
  message: string;
  updatedAt: string;
}

export interface DashboardSummaryDto {
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
  recentReleases: DashboardReleaseDto[];
  actionItems: DashboardActionItemDto[];
}
