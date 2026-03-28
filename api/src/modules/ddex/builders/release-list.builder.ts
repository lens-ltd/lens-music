import { XMLBuilder } from 'xmlbuilder2/lib/interfaces';
import { ErnContext } from '../interfaces/ern-context.interface';
import {
  formatDdexDate,
  PARENTAL_ADVISORY_TO_DDEX,
} from '../helpers/ern-xml.helper';
import { RELEASE_TYPE_TO_DDEX_VALUE } from '../../../constants/ddex-release.constants';
import { mapGenreNameToDdex } from '../../../constants/ddex-genre.constants';
import { CONTRIBUTOR_ROLE_TO_DDEX_MAP } from '../../../constants/ddex.constants';
import { ContributorRole } from '../../../constants/contributor.constants';
import { ReleaseGenreType } from '../../../constants/release.constants';
import { ReleaseLabelType } from '../../../constants/release-label.constants';

const DISPLAY_ARTIST_ROLES = new Set<ContributorRole>([
  ContributorRole.PRIMARY_ARTIST,
  ContributorRole.FEATURED_ARTIST,
]);

/**
 * Builds the <ReleaseList> section of the ERN NewReleaseMessage.
 * Contains the album-level release (R0) and per-track releases (R1, R2…).
 */
export function buildReleaseList(parent: XMLBuilder, ctx: ErnContext): void {
  const releaseList = parent.ele('ReleaseList');

  buildAlbumRelease(releaseList, ctx);

  for (let i = 0; i < ctx.tracks.length; i++) {
    buildTrackRelease(releaseList, ctx, i);
  }
}

function buildAlbumRelease(releaseList: XMLBuilder, ctx: ErnContext): void {
  const release = ctx.release;
  const rel = releaseList.ele('Release');

  // Release ID
  const relId = rel.ele('ReleaseId');
  if (release.upc) {
    relId.ele('ICPN').txt(release.upc);
  }
  if (release.grid) {
    relId.ele('GRid').txt(release.grid);
  }
  if (release.catalogNumber) {
    relId
      .ele('CatalogNumber')
      .att('Namespace', `DPID:${ctx.senderDpid}`)
      .txt(release.catalogNumber);
  }

  rel.ele('ReleaseReference').txt(ctx.refs.getAlbumReleaseRef());

  const refTitle = rel.ele('ReferenceTitle');
  refTitle.ele('TitleText').txt(release.title);
  if (release.titleVersion) {
    refTitle.ele('SubTitle').txt(release.titleVersion);
  }

  // Resource references (all sound recordings + cover image)
  const resRefList = rel.ele('ReleaseResourceReferenceList');
  for (let i = 1; i <= ctx.tracks.length; i++) {
    resRefList.ele('ReleaseResourceReference').txt(`A${i}`);
  }
  if (release.coverArtUrl) {
    resRefList.ele('ReleaseResourceReference').txt('I1');
  }

  // Release type
  if (release.type) {
    rel.ele('ReleaseType').txt(RELEASE_TYPE_TO_DDEX_VALUE[release.type]);
  }

  // Details by territory
  const details = rel.ele('ReleaseDetailsByTerritory');
  details.ele('TerritoryCode').txt('Worldwide');

  // Display artist name (constructed from primary + featured artists)
  const displayArtistName = buildDisplayArtistName(ctx);
  if (displayArtistName) {
    details.ele('DisplayArtistName').txt(displayArtistName);
  }

  // Display artists with references
  const sortedContributors = [...ctx.releaseContributors].sort(
    (a, b) => (a.sequenceNumber ?? 999) - (b.sequenceNumber ?? 999),
  );

  let displaySeq = 0;
  for (const rc of sortedContributors) {
    if (!rc.contributor || !DISPLAY_ARTIST_ROLES.has(rc.role)) continue;
    displaySeq++;
    const da = details.ele('DisplayArtist');
    da.ele('PartyReference').txt(
      ctx.refs.getOrCreatePartyRef(rc.contributorId),
    );
    da.ele('DisplayArtistRole').txt(CONTRIBUTOR_ROLE_TO_DDEX_MAP[rc.role]);
    da.ele('SequenceNumber').txt(String(displaySeq));
  }

  // Label
  const primaryLabel = ctx.releaseLabels.find(
    rl => rl.type === ReleaseLabelType.PRIMARY,
  );
  if (primaryLabel?.label) {
    details.ele('LabelName').txt(primaryLabel.label.name);
  }

  // Title
  const formalTitle = details.ele('Title');
  formalTitle.att('TitleType', 'FormalTitle');
  formalTitle.ele('TitleText').txt(release.title);

  // Genre
  const primaryGenre = ctx.genres.find(g => g.type === ReleaseGenreType.PRIMARY);
  if (primaryGenre?.genre) {
    const genre = details.ele('Genre');
    genre.ele('GenreText').txt(mapGenreNameToDdex(primaryGenre.genre.name));
  }
  const secondaryGenre = ctx.genres.find(g => g.type === ReleaseGenreType.SECONDARY);
  if (secondaryGenre?.genre) {
    const genre = details.ele('Genre');
    genre.ele('GenreText').txt(mapGenreNameToDdex(secondaryGenre.genre.name));
  }

  // Parental warning
  details.ele('ParentalWarningType').txt(
    PARENTAL_ADVISORY_TO_DDEX[release.parentalAdvisory],
  );

  // Resource group (track sequencing)
  const resourceGroup = details.ele('ResourceGroup');
  for (let i = 0; i < ctx.tracks.length; i++) {
    const track = ctx.tracks[i];
    const item = resourceGroup.ele('ResourceGroupContentItem');
    item.ele('SequenceNumber').txt(String(i + 1));
    item.ele('ResourceType').txt('SoundRecording');
    item.ele('ReleaseResourceReference').txt(`A${i + 1}`);

    if (track.discNumber > 1) {
      item.ele('GroupingInfo').txt(`Disc ${track.discNumber}`);
    }
  }
  // Link cover image
  if (release.coverArtUrl) {
    resourceGroup.ele('LinkedReleaseResourceReference').txt('I1');
  }

  // P-Line
  if (release.pLine) {
    const pLine = rel.ele('PLine');
    pLine.ele('Year').txt(String(release.pLine.year));
    pLine.ele('PLineText').txt(release.pLine.owner);
  }

  // C-Line
  if (release.cLine) {
    const cLine = rel.ele('CLine');
    cLine.ele('Year').txt(String(release.cLine.year));
    cLine.ele('CLineText').txt(release.cLine.owner);
  }

  // Dates
  if (release.digitalReleaseDate) {
    rel.ele('GlobalReleaseDate').txt(formatDdexDate(release.digitalReleaseDate));
  }
  if (release.originalReleaseDate) {
    rel.ele('GlobalOriginalReleaseDate').txt(
      formatDdexDate(release.originalReleaseDate),
    );
  }
}

function buildTrackRelease(
  releaseList: XMLBuilder,
  ctx: ErnContext,
  trackIndex: number,
): void {
  const track = ctx.tracks[trackIndex];
  const trackReleaseRef = ctx.refs.getNextTrackReleaseRef();
  const soundRecordingRef = `A${trackIndex + 1}`;

  const rel = releaseList.ele('Release');

  // Release ID (track-level uses ISRC)
  if (track.isrc) {
    const relId = rel.ele('ReleaseId');
    relId.ele('ISRC').txt(track.isrc);
  }

  rel.ele('ReleaseReference').txt(trackReleaseRef);

  const refTitle = rel.ele('ReferenceTitle');
  refTitle.ele('TitleText').txt(track.title);
  if (track.titleVersion) {
    refTitle.ele('SubTitle').txt(track.titleVersion);
  }

  const resRefList = rel.ele('ReleaseResourceReferenceList');
  resRefList.ele('ReleaseResourceReference').txt(soundRecordingRef);

  rel.ele('ReleaseType').txt('TrackRelease');

  // Details by territory
  const details = rel.ele('ReleaseDetailsByTerritory');
  details.ele('TerritoryCode').txt('Worldwide');

  // Track-level display artist
  const trackContributors = ctx.trackContributorsMap.get(track.id) || [];
  const sorted = [...trackContributors].sort(
    (a, b) => (a.sequenceNumber ?? 999) - (b.sequenceNumber ?? 999),
  );

  let displaySeq = 0;
  for (const tc of sorted) {
    if (!tc.contributor || !DISPLAY_ARTIST_ROLES.has(tc.role)) continue;
    displaySeq++;
    const da = details.ele('DisplayArtist');
    da.ele('PartyReference').txt(
      ctx.refs.getOrCreatePartyRef(tc.contributorId),
    );
    da.ele('DisplayArtistRole').txt(CONTRIBUTOR_ROLE_TO_DDEX_MAP[tc.role]);
    da.ele('SequenceNumber').txt(String(displaySeq));
  }

  const formalTitle = details.ele('Title');
  formalTitle.att('TitleType', 'FormalTitle');
  formalTitle.ele('TitleText').txt(track.title);

  details.ele('ParentalWarningType').txt(
    PARENTAL_ADVISORY_TO_DDEX[track.parentalAdvisory],
  );

  // Track-level P-Line
  if (track.pLineYear && track.pLineOwner) {
    const pLine = rel.ele('PLine');
    pLine.ele('Year').txt(String(track.pLineYear));
    pLine.ele('PLineText').txt(track.pLineOwner);
  }

  // Track-level C-Line
  if (track.cLineYear && track.cLineOwner) {
    const cLine = rel.ele('CLine');
    cLine.ele('Year').txt(String(track.cLineYear));
    cLine.ele('CLineText').txt(track.cLineOwner);
  }
}

/**
 * Construct display artist name from release contributors.
 * Format: "Artist1 feat. Artist2" for primary + featured artists.
 */
function buildDisplayArtistName(ctx: ErnContext): string {
  const sorted = [...ctx.releaseContributors]
    .filter(rc => rc.contributor && DISPLAY_ARTIST_ROLES.has(rc.role))
    .sort((a, b) => (a.sequenceNumber ?? 999) - (b.sequenceNumber ?? 999));

  const primary = sorted.filter(rc => rc.role === ContributorRole.PRIMARY_ARTIST);
  const featured = sorted.filter(rc => rc.role === ContributorRole.FEATURED_ARTIST);

  const primaryNames = primary.map(
    rc => rc.contributor.displayName || rc.contributor.name,
  );
  const featuredNames = featured.map(
    rc => rc.contributor.displayName || rc.contributor.name,
  );

  let name = primaryNames.join(', ');
  if (featuredNames.length > 0) {
    name += ` feat. ${featuredNames.join(', ')}`;
  }

  return name;
}
