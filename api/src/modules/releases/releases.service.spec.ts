import { BadRequestException } from '@nestjs/common';
import { ReleaseService } from './releases.service';
import { Release } from '../../entities/release.entity';
import { TrackStatus } from '../../entities/track.entity';
import {
  ReleaseGenreType,
  ReleaseStatus,
  ReleaseType,
} from '../../constants/release.constants';
import { ContributorRole } from '../../constants/contributor.constants';
import { AuthUser } from '../../common/decorators/current-user.decorator';
import { UUID } from '../../types/common.types';

const RELEASE_ID = '00000000-0000-0000-0000-000000000001' as UUID;
const STORE_ID = '00000000-0000-0000-0000-0000000000a1' as UUID;
const USER: AuthUser = { id: '00000000-0000-0000-0000-0000000000u1' as UUID, email: 'artist@lens.test' };

const futureDate = (days: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

/** A release that passes every rule in `validateReleaseContent`. */
const buildValidRelease = (): Release =>
  ({
    id: RELEASE_ID,
    title: 'First light',
    type: ReleaseType.SINGLE,
    status: ReleaseStatus.DRAFT,
    primaryLanguage: 'en',
    metadataLanguage: 'en',
    cLine: { year: 2026, owner: 'Artist' },
    pLine: { year: 2026, owner: 'Artist' },
    coverArtUrl: 'https://res.cloudinary.com/x/cover.jpg',
    coverArtWidth: 3000,
    coverArtHeight: 3000,
    coverArtChecksumSha256: 'a'.repeat(64),
    coverArtFileSizeBytes: 1024,
    originalReleaseDate: futureDate(10),
    digitalReleaseDate: futureDate(10),
    productionYear: 2026,
    territories: [],
    releaseStores: [
      { storeId: STORE_ID, store: { name: 'Spotify', ddexPartyId: 'PADPIDA2011021601H' } },
    ],
    tracks: [
      {
        id: 'track-1',
        title: 'Intro',
        status: TrackStatus.VALIDATED,
        trackContributors: [{ role: ContributorRole.SONGWRITER }],
      },
    ],
    genres: [{ type: ReleaseGenreType.PRIMARY }],
  }) as unknown as Release;

const setup = (release: Release) => {
  const releaseRepository = {
    findOne: jest.fn().mockResolvedValue(release),
    save: jest.fn().mockImplementation(async (r: Release) => r),
  };
  const releaseContributorRepository = {
    findOne: jest.fn().mockResolvedValue({ role: ContributorRole.PRIMARY_ARTIST }),
  };
  const dealRepository = {
    find: jest.fn().mockResolvedValue([{ storeId: null, territories: ['RW'], excludedTerritories: [] }]),
  };
  const trackRightsControllerRepository = { exist: jest.fn().mockResolvedValue(true) };
  const catalogAccess = { assertCanWriteRelease: jest.fn().mockResolvedValue(release) };
  const emailService = { sendEmail: jest.fn() };

  const service = new ReleaseService(
    releaseRepository as never,
    releaseContributorRepository as never,
    {} as never,
    {} as never,
    {} as never,
    dealRepository as never,
    trackRightsControllerRepository as never,
    {} as never,
    emailService as never,
    catalogAccess as never,
  );

  return { service, releaseRepository, releaseContributorRepository, dealRepository, trackRightsControllerRepository };
};

describe('ReleaseService validation', () => {
  it('marks a complete release as VALIDATED', async () => {
    const { service, releaseRepository } = setup(buildValidRelease());

    const result = await service.validateRelease(RELEASE_ID, USER);

    expect(result.errors).toEqual([]);
    expect(result.valid).toBe(true);
    expect(releaseRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({ status: ReleaseStatus.VALIDATED }),
    );
  });

  it('reports missing metadata and does not save', async () => {
    const release = buildValidRelease();
    release.primaryLanguage = undefined as never;
    release.coverArtUrl = undefined as never;
    release.pLine = null;
    const { service, releaseRepository } = setup(release);

    const result = await service.validateRelease(RELEASE_ID, USER);

    expect(result.valid).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        'Primary language is required',
        'Cover art is required',
        'P-line (year and owner) is required',
      ]),
    );
    expect(releaseRepository.save).not.toHaveBeenCalled();
  });

  it('rejects cover art that is too small or not square', async () => {
    const release = buildValidRelease();
    release.coverArtWidth = 1400;
    release.coverArtHeight = 1500;
    const { service } = setup(release);

    const { errors } = await service.validateRelease(RELEASE_ID, USER);

    expect(errors).toEqual(
      expect.arrayContaining([
        'Cover art must be at least 3000x3000 pixels',
        'Cover art must have a square aspect ratio',
      ]),
    );
  });

  it('enforces date ordering', async () => {
    const release = buildValidRelease();
    release.digitalReleaseDate = futureDate(10) as never;
    release.preorderDate = futureDate(20) as never;
    release.originalReleaseDate = futureDate(30) as never;
    const { service } = setup(release);

    const { errors } = await service.validateRelease(RELEASE_ID, USER);

    expect(errors).toEqual(
      expect.arrayContaining([
        'Preorder date must be before the digital release date',
        'Original release date must not be after the digital release date',
      ]),
    );
  });

  it('requires the digital release date to be in the future', async () => {
    const release = buildValidRelease();
    release.originalReleaseDate = '2020-01-01' as never;
    release.digitalReleaseDate = '2020-01-01' as never;
    const { service } = setup(release);

    const { errors } = await service.validateRelease(RELEASE_ID, USER);

    expect(errors).toContain('Digital release date must be in the future');
  });

  it('enforces the track count for the release type', async () => {
    const release = buildValidRelease();
    release.type = ReleaseType.EP;
    const { service } = setup(release);

    const { errors } = await service.validateRelease(RELEASE_ID, USER);

    expect(errors).toContain('A ep must have at least 4 track(s), but has 1');
  });

  it('requires writer credits, rights and a primary artist', async () => {
    const release = buildValidRelease();
    (release.tracks[0] as { trackContributors: unknown[] }).trackContributors = [];
    const { service, releaseContributorRepository, trackRightsControllerRepository } = setup(release);
    releaseContributorRepository.findOne.mockResolvedValue(null);
    trackRightsControllerRepository.exist.mockResolvedValue(false);

    const { errors } = await service.validateRelease(RELEASE_ID, USER);

    expect(errors).toEqual(
      expect.arrayContaining([
        'Track "Intro" must have at least one songwriter, composer, or lyricist',
        'Track "Intro" must have at least one rights controller with MAKING_AVAILABLE_RIGHT',
        'At least one primary artist contributor is required',
      ]),
    );
  });

  it('requires a deal covering every selected store', async () => {
    const { service, dealRepository } = setup(buildValidRelease());
    dealRepository.find.mockResolvedValue([
      { storeId: 'another-store', territories: [], excludedTerritories: [] },
    ]);

    const { errors } = await service.validateRelease(RELEASE_ID, USER);

    expect(errors).toContain(
      'No active deal covers store "Spotify" (add a global deal or a deal for this store)',
    );
  });
});

describe('ReleaseService review transitions', () => {
  it('moves a valid release to REVIEW on submit', async () => {
    const { service, releaseRepository } = setup(buildValidRelease());

    const result = await service.submitRelease(RELEASE_ID, USER);

    expect(result.valid).toBe(true);
    expect(releaseRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({ status: ReleaseStatus.REVIEW }),
    );
  });

  it.each([ReleaseStatus.DRAFT, ReleaseStatus.APPROVED, ReleaseStatus.LIVE])(
    'refuses to approve a release in %s',
    async (status) => {
      const release = buildValidRelease();
      release.status = status;
      const { service } = setup(release);

      await expect(service.approveRelease(RELEASE_ID, USER)).rejects.toBeInstanceOf(
        BadRequestException,
      );
    },
  );
});
