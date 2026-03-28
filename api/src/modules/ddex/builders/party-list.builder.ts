import { XMLBuilder } from 'xmlbuilder2/lib/interfaces';
import { ErnContext } from '../interfaces/ern-context.interface';
import { Contributor } from '../../../entities/contributor.entity';
import { Label } from '../../../entities/label.entity';

/**
 * Builds the <PartyList> section of the ERN NewReleaseMessage.
 *
 * Must be called AFTER ResourceList, ReleaseList, and DealList builders
 * so that all party references have been accumulated in the reference manager.
 */
export function buildPartyList(parent: XMLBuilder, ctx: ErnContext): void {
  const partyList = parent.ele('PartyList');

  // Collect all unique contributors from release + track level
  const contributorsById = new Map<string, Contributor>();

  for (const rc of ctx.releaseContributors) {
    if (rc.contributor) {
      contributorsById.set(rc.contributorId, rc.contributor);
    }
  }

  for (const [, trackContributors] of ctx.trackContributorsMap) {
    for (const tc of trackContributors) {
      if (tc.contributor && !contributorsById.has(tc.contributorId)) {
        contributorsById.set(tc.contributorId, tc.contributor);
      }
    }
  }

  // Emit <Party> for each contributor that has a reference
  for (const [entityId, contributor] of contributorsById) {
    const ref = ctx.refs.getPartyRef(entityId);
    if (!ref) continue;

    const party = partyList.ele('Party');
    party.ele('PartyReference').txt(ref);

    const partyName = party.ele('PartyName');
    partyName.ele('FullName').txt(contributor.displayName || contributor.name);

    if (contributor.isni) {
      party.ele('PartyId').txt(`ISNI:${contributor.isni}`);
    }
    if (contributor.ipi) {
      party.ele('PartyId').txt(`IPI:${contributor.ipi}`);
    }
    if (contributor.ipn) {
      party.ele('PartyId').txt(`IPN:${contributor.ipn}`);
    }
  }

  // Emit <Party> for labels
  for (const rl of ctx.releaseLabels) {
    if (!rl.label) continue;
    const ref = ctx.refs.getPartyRef(rl.labelId);
    if (!ref) continue;

    const party = partyList.ele('Party');
    party.ele('PartyReference').txt(ref);
    party.ele('PartyName').ele('FullName').txt(rl.label.name);

    if (rl.label.ddexPartyId) {
      party.ele('PartyId').txt(rl.label.ddexPartyId);
    }
  }

  // Emit <Party> for rights controllers that are neither contributors nor labels
  for (const [, controllers] of ctx.trackRightsControllersMap) {
    for (const trc of controllers) {
      const entityId = trc.contributorId || trc.labelId || trc.id;
      const ref = ctx.refs.getPartyRef(entityId);
      if (!ref) continue;

      // Skip if already emitted as contributor or label
      if (trc.contributorId && contributorsById.has(trc.contributorId)) continue;
      if (trc.labelId && ctx.releaseLabels.some(rl => rl.labelId === trc.labelId)) continue;

      const party = partyList.ele('Party');
      party.ele('PartyReference').txt(ref);
      party.ele('PartyName').ele('FullName').txt(trc.controllerName);
    }
  }
}
