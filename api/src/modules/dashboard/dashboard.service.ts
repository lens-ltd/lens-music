import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReleaseStatus, ReleaseType } from '../../constants/release.constants';
import { ReleaseDeliveryStatus } from '../../constants/store.constants';
import { Release } from '../../entities/release.entity';
import { ReleaseStore } from '../../entities/release-store.entity';
import { Track } from '../../entities/track.entity';
import { UUID } from '../../types/common.types';
import {
  DashboardActionItemDto,
  DashboardReleaseDto,
  DashboardSummaryDto,
} from './dto/dashboard-summary.dto';

type CountRow<TStatus extends string> = {
  status: TStatus;
  count: string;
};

type RecentReleaseRow = {
  id: string;
  title: string;
  coverArtUrl: string | null;
  type: ReleaseType | null;
  digitalReleaseDate: string | null;
  status: ReleaseStatus;
  trackCount: string;
  storeCount: string;
  updatedAt: Date | string;
};

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Release)
    private readonly releaseRepository: Repository<Release>,
    @InjectRepository(Track)
    private readonly trackRepository: Repository<Track>,
    @InjectRepository(ReleaseStore)
    private readonly releaseStoreRepository: Repository<ReleaseStore>,
  ) {}

  async getSummary(userId: UUID): Promise<DashboardSummaryDto> {
    const today = new Date();
    const upcomingEnd = new Date(today);
    upcomingEnd.setUTCDate(upcomingEnd.getUTCDate() + 30);

    const todayDate = today.toISOString().slice(0, 10);
    const upcomingEndDate = upcomingEnd.toISOString().slice(0, 10);

    const [
      totals,
      trackTotal,
      pipelineRows,
      deliveryRows,
      recentReleaseRows,
      reviewFeedbackRows,
      failedDeliveryRows,
    ] = await Promise.all([
      this.releaseRepository
        .createQueryBuilder('release')
        .select('COUNT(release.id)', 'releases')
        .addSelect(
          'COUNT(release.id) FILTER (WHERE release.status = :liveStatus)',
          'liveReleases',
        )
        .addSelect(
          `COUNT(release.id) FILTER (
            WHERE release.digitalReleaseDate BETWEEN :todayDate AND :upcomingEndDate
          )`,
          'upcomingReleases',
        )
        .where('release.createdById = :userId', { userId })
        .setParameters({
          liveStatus: ReleaseStatus.LIVE,
          todayDate,
          upcomingEndDate,
        })
        .getRawOne<{
          releases: string;
          liveReleases: string;
          upcomingReleases: string;
        }>(),
      this.trackRepository
        .createQueryBuilder('track')
        .innerJoin('track.release', 'release')
        .where('release.createdById = :userId', { userId })
        .getCount(),
      this.releaseRepository
        .createQueryBuilder('release')
        .select('release.status', 'status')
        .addSelect('COUNT(release.id)', 'count')
        .where('release.createdById = :userId', { userId })
        .groupBy('release.status')
        .getRawMany<CountRow<ReleaseStatus>>(),
      this.releaseStoreRepository
        .createQueryBuilder('releaseStore')
        .innerJoin('releaseStore.release', 'release')
        .select('releaseStore.deliveryStatus', 'status')
        .addSelect('COUNT(releaseStore.id)', 'count')
        .where('release.createdById = :userId', { userId })
        .groupBy('releaseStore.deliveryStatus')
        .getRawMany<CountRow<ReleaseDeliveryStatus>>(),
      this.getRecentReleases(userId),
      this.releaseRepository
        .createQueryBuilder('release')
        .select('release.id', 'releaseId')
        .addSelect('release.title', 'releaseTitle')
        .addSelect('release.reviewNotes', 'reviewNotes')
        .addSelect('release.updatedAt', 'updatedAt')
        .where('release.createdById = :userId', { userId })
        .andWhere('release.status = :status', { status: ReleaseStatus.DRAFT })
        .andWhere("release.reviewNotes IS NOT NULL AND BTRIM(release.reviewNotes) <> ''")
        .orderBy('release.updatedAt', 'DESC')
        .limit(6)
        .getRawMany<{
          releaseId: string;
          releaseTitle: string;
          reviewNotes: string;
          updatedAt: Date | string;
        }>(),
      this.releaseStoreRepository
        .createQueryBuilder('releaseStore')
        .innerJoin('releaseStore.release', 'release')
        .select('release.id', 'releaseId')
        .addSelect('release.title', 'releaseTitle')
        .addSelect('COUNT(releaseStore.id)', 'failedCount')
        .addSelect('MAX(releaseStore.updatedAt)', 'updatedAt')
        .where('release.createdById = :userId', { userId })
        .andWhere('releaseStore.deliveryStatus = :status', {
          status: ReleaseDeliveryStatus.FAILED,
        })
        .groupBy('release.id')
        .addGroupBy('release.title')
        .orderBy('MAX(releaseStore.updatedAt)', 'DESC')
        .limit(6)
        .getRawMany<{
          releaseId: string;
          releaseTitle: string;
          failedCount: string;
          updatedAt: Date | string;
        }>(),
    ]);

    const releasePipeline = this.zeroFillCounts(
      Object.values(ReleaseStatus),
      pipelineRows,
    );
    const deliveryByStatus = this.zeroFillCounts(
      Object.values(ReleaseDeliveryStatus),
      deliveryRows,
    );
    const deliveryTotal = deliveryByStatus.reduce(
      (sum, item) => sum + item.count,
      0,
    );
    const delivered =
      deliveryByStatus.find(
        (item) => item.status === ReleaseDeliveryStatus.DELIVERED,
      )?.count ?? 0;

    const actionItems: DashboardActionItemDto[] = [
      ...reviewFeedbackRows.map((row) => ({
        id: `review-${row.releaseId}`,
        releaseId: row.releaseId,
        releaseTitle: row.releaseTitle,
        kind: 'REVIEW_FEEDBACK' as const,
        message: row.reviewNotes,
        updatedAt: this.toIsoString(row.updatedAt),
      })),
      ...failedDeliveryRows.map((row) => {
        const failedCount = Number(row.failedCount);
        return {
          id: `delivery-${row.releaseId}`,
          releaseId: row.releaseId,
          releaseTitle: row.releaseTitle,
          kind: 'DELIVERY_FAILED' as const,
          message: `${failedCount} store ${failedCount === 1 ? 'delivery' : 'deliveries'} failed`,
          updatedAt: this.toIsoString(row.updatedAt),
        };
      }),
    ]
      .sort(
        (left, right) =>
          new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime(),
      )
      .slice(0, 6);

    return {
      generatedAt: new Date().toISOString(),
      totals: {
        releases: Number(totals?.releases ?? 0),
        tracks: trackTotal,
        liveReleases: Number(totals?.liveReleases ?? 0),
        upcomingReleases: Number(totals?.upcomingReleases ?? 0),
      },
      releasePipeline,
      deliveryHealth: {
        total: deliveryTotal,
        deliveredRate:
          deliveryTotal === 0
            ? 0
            : Math.round((delivered / deliveryTotal) * 1000) / 10,
        byStatus: deliveryByStatus,
      },
      recentReleases: recentReleaseRows.map((row) =>
        this.normalizeRecentRelease(row),
      ),
      actionItems,
    };
  }

  private getRecentReleases(userId: UUID): Promise<RecentReleaseRow[]> {
    return this.releaseRepository
      .createQueryBuilder('release')
      .leftJoin('release.tracks', 'track')
      .leftJoin('release.releaseStores', 'releaseStore')
      .select('release.id', 'id')
      .addSelect('release.title', 'title')
      .addSelect('release.coverArtUrl', 'coverArtUrl')
      .addSelect('release.type', 'type')
      .addSelect('release.digitalReleaseDate', 'digitalReleaseDate')
      .addSelect('release.status', 'status')
      .addSelect('COUNT(DISTINCT track.id)', 'trackCount')
      .addSelect('COUNT(DISTINCT releaseStore.id)', 'storeCount')
      .addSelect('release.updatedAt', 'updatedAt')
      .where('release.createdById = :userId', { userId })
      .groupBy('release.id')
      .orderBy('release.updatedAt', 'DESC')
      .limit(6)
      .getRawMany<RecentReleaseRow>();
  }

  private zeroFillCounts<TStatus extends string>(
    statuses: TStatus[],
    rows: CountRow<TStatus>[],
  ): Array<{ status: TStatus; count: number }> {
    const counts = new Map(rows.map((row) => [row.status, Number(row.count)]));
    return statuses.map((status) => ({ status, count: counts.get(status) ?? 0 }));
  }

  private normalizeRecentRelease(row: RecentReleaseRow): DashboardReleaseDto {
    return {
      id: row.id,
      title: row.title,
      coverArtUrl: row.coverArtUrl,
      type: row.type,
      digitalReleaseDate: row.digitalReleaseDate,
      status: row.status,
      trackCount: Number(row.trackCount),
      storeCount: Number(row.storeCount),
      updatedAt: this.toIsoString(row.updatedAt),
    };
  }

  private toIsoString(value: Date | string): string {
    return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
  }
}
