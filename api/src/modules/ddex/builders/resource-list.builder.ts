import { XMLBuilder } from 'xmlbuilder2/lib/interfaces';
import { ErnContext } from '../interfaces/ern-context.interface';
import { msToIsoDuration, SOUND_RECORDING_TYPE_TO_DDEX } from '../helpers/ern-xml.helper';
import {
  CONTRIBUTOR_ROLE_TO_DDEX_MAP,
  AUDIO_FILE_TYPE_TO_DDEX_CODEC,
} from '../../../constants/ddex.constants';
import { ContributorRole } from '../../../constants/contributor.constants';
import { Track } from '../../../entities/track.entity';
import { TrackContributor } from '../../../entities/track-contributor.entity';

const DISPLAY_ARTIST_ROLES = new Set<ContributorRole>([
  ContributorRole.PRIMARY_ARTIST,
  ContributorRole.FEATURED_ARTIST,
]);

/**
 * Builds the <ResourceList> section (SoundRecordings + Image).
 */
export function buildResourceList(parent: XMLBuilder, ctx: ErnContext): void {
  const resourceList = parent.ele('ResourceList');

  // Sound Recordings — one per track
  for (const track of ctx.tracks) {
    buildSoundRecording(resourceList, track, ctx);
  }

  // Image — cover art
  if (ctx.release.coverArtUrl) {
    buildCoverImage(resourceList, ctx);
  }
}

function buildSoundRecording(
  resourceList: XMLBuilder,
  track: Track,
  ctx: ErnContext,
): void {
  const sr = resourceList.ele('SoundRecording');
  const resourceRef = ctx.refs.getNextSoundRecordingRef();

  sr.ele('SoundRecordingType').txt(
    SOUND_RECORDING_TYPE_TO_DDEX[track.soundRecordingType],
  );

  if (track.isrc) {
    const srId = sr.ele('SoundRecordingId');
    srId.ele('ISRC').txt(track.isrc);
  }

  sr.ele('ResourceReference').txt(resourceRef);

  const refTitle = sr.ele('ReferenceTitle');
  refTitle.ele('TitleText').txt(track.title);
  if (track.titleVersion) {
    refTitle.ele('SubTitle').txt(track.titleVersion);
  }

  sr.ele('Duration').txt(msToIsoDuration(track.durationMs));

  if (track.isInstrumental) {
    sr.ele('IsInstrumental').txt('true');
  }

  // SoundRecordingDetailsByTerritory
  const details = sr.ele('SoundRecordingDetailsByTerritory');
  details.ele('TerritoryCode').txt('Worldwide');

  const title = details.ele('Title');
  title.att('TitleType', 'FormalTitle');
  title.ele('TitleText').txt(track.title);

  // Display Artists & Resource Contributors
  const trackContributors = ctx.trackContributorsMap.get(track.id) || [];
  const sortedContributors = [...trackContributors].sort(
    (a, b) => (a.sequenceNumber ?? 999) - (b.sequenceNumber ?? 999),
  );

  let displayArtistSeq = 0;
  for (const tc of sortedContributors) {
    if (!tc.contributor || !DISPLAY_ARTIST_ROLES.has(tc.role)) continue;
    displayArtistSeq++;
    const da = details.ele('DisplayArtist');
    da.ele('PartyReference').txt(
      ctx.refs.getOrCreatePartyRef(tc.contributorId),
    );
    da.ele('DisplayArtistRole').txt(CONTRIBUTOR_ROLE_TO_DDEX_MAP[tc.role]);
    da.ele('SequenceNumber').txt(String(displayArtistSeq));
  }

  let contributorSeq = 0;
  for (const tc of sortedContributors) {
    if (!tc.contributor || DISPLAY_ARTIST_ROLES.has(tc.role)) continue;
    contributorSeq++;
    const rc = details.ele('ResourceContributor');
    rc.ele('PartyReference').txt(
      ctx.refs.getOrCreatePartyRef(tc.contributorId),
    );
    rc.ele('ResourceContributorRole').txt(CONTRIBUTOR_ROLE_TO_DDEX_MAP[tc.role]);
    rc.ele('SequenceNumber').txt(String(contributorSeq));
  }

  // P-Line
  if (track.pLineYear && track.pLineOwner) {
    const pLine = details.ele('PLine');
    pLine.ele('Year').txt(String(track.pLineYear));
    pLine.ele('PLineText').txt(track.pLineOwner);
  }

  // Technical details from primary audio file
  const primaryAudio = track.audioFiles?.find(af => af.isPrimary)
    || track.audioFiles?.[0];

  if (primaryAudio) {
    const tech = details.ele('TechnicalSoundRecordingDetails');
    tech.ele('TechnicalResourceDetailsReference').txt(`T_${resourceRef}`);

    const codec = AUDIO_FILE_TYPE_TO_DDEX_CODEC[primaryAudio.fileType];
    if (codec) {
      tech.ele('AudioCodecType').txt(codec);
    }
    if (primaryAudio.sampleRate) {
      tech.ele('SamplingRate').txt(String(primaryAudio.sampleRate));
    }
    if (primaryAudio.bitDepth) {
      tech.ele('BitsPerSample').txt(String(primaryAudio.bitDepth));
    }
    tech.ele('NumberOfChannels').txt(String(primaryAudio.channels));

    if (primaryAudio.fileSizeBytes || primaryAudio.checksumSha256) {
      const file = tech.ele('File');
      const pathParts = primaryAudio.storagePath.split('/');
      file.ele('FileName').txt(pathParts[pathParts.length - 1]);
      file.ele('FilePath').txt(primaryAudio.storagePath);

      if (primaryAudio.fileSizeBytes) {
        file.ele('FileSize').txt(String(primaryAudio.fileSizeBytes));
      }

      if (primaryAudio.checksumSha256) {
        const hash = file.ele('HashSum');
        hash.ele('HashSum').txt(primaryAudio.checksumSha256);
        hash.ele('HashSumAlgorithmType').txt('SHA256');
      }
    }
  }
}

function buildCoverImage(resourceList: XMLBuilder, ctx: ErnContext): void {
  const image = resourceList.ele('Image');
  const imageRef = ctx.refs.getNextImageRef();

  image.ele('ImageType').txt('FrontCoverImage');

  const imageId = image.ele('ImageId');
  imageId
    .ele('ProprietaryId')
    .att('Namespace', `DPID:${ctx.senderDpid}`)
    .txt(`${ctx.release.id}_cover`);

  image.ele('ResourceReference').txt(imageRef);

  const details = image.ele('ImageDetailsByTerritory');
  details.ele('TerritoryCode').txt('Worldwide');

  const tech = details.ele('TechnicalImageDetails');
  tech.ele('TechnicalResourceDetailsReference').txt(`T_${imageRef}`);
  tech.ele('ImageCodecType').txt('JPEG');

  if (ctx.release.coverArtHeight) {
    tech.ele('ImageHeight').txt(String(ctx.release.coverArtHeight));
  }
  if (ctx.release.coverArtWidth) {
    tech.ele('ImageWidth').txt(String(ctx.release.coverArtWidth));
  }

  if (ctx.release.coverArtFileSizeBytes || ctx.release.coverArtChecksumSha256) {
    const file = tech.ele('File');
    file.ele('FileName').txt('cover.jpg');

    if (ctx.release.coverArtFileSizeBytes) {
      file.ele('FileSize').txt(String(ctx.release.coverArtFileSizeBytes));
    }

    if (ctx.release.coverArtChecksumSha256) {
      const hash = file.ele('HashSum');
      hash.ele('HashSum').txt(ctx.release.coverArtChecksumSha256);
      hash.ele('HashSumAlgorithmType').txt('SHA256');
    }
  }
}
