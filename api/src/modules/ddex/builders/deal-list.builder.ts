import { XMLBuilder } from 'xmlbuilder2/lib/interfaces';
import { ErnContext } from '../interfaces/ern-context.interface';
import {
  formatDdexDate,
  COMMERCIAL_MODEL_TO_DDEX,
  USE_TYPE_TO_DDEX,
} from '../helpers/ern-xml.helper';
import { normalizeTerritories } from '../helpers/ern-territory.helper';

/**
 * Builds the <DealList> section of the ERN NewReleaseMessage.
 */
export function buildDealList(parent: XMLBuilder, ctx: ErnContext): void {
  const dealList = parent.ele('DealList');

  for (const deal of ctx.deals) {
    const releaseDeal = dealList.ele('ReleaseDeal');

    // All deals reference the album-level release (R0)
    releaseDeal.ele('DealReleaseReference').txt(ctx.refs.getAlbumReleaseRef());

    const dealEl = releaseDeal.ele('Deal');
    const terms = dealEl.ele('DealTerms');

    // Commercial model
    terms.ele('CommercialModelType').txt(
      COMMERCIAL_MODEL_TO_DDEX[deal.commercialModelType],
    );

    // Usage
    const usage = terms.ele('Usage');
    usage.ele('UseType').txt(USE_TYPE_TO_DDEX[deal.useType]);

    // Territories
    const territories = normalizeTerritories(deal.territories);
    for (const territory of territories) {
      terms.ele('TerritoryCode').txt(territory);
    }

    // Excluded territories
    if (deal.excludedTerritories && deal.excludedTerritories.length > 0) {
      const excluded = normalizeTerritories(deal.excludedTerritories);
      for (const territory of excluded) {
        terms.ele('ExcludedTerritoryCode').txt(territory);
      }
    }

    // Price information
    if (deal.priceAmount && deal.priceCurrency) {
      const priceInfo = terms.ele('PriceInformation');
      priceInfo
        .ele('WholesalePricePerUnit')
        .att('CurrencyCode', deal.priceCurrency)
        .txt(String(deal.priceAmount));
    }

    // Validity period
    const validity = terms.ele('ValidityPeriod');
    validity.ele('StartDate').txt(formatDdexDate(deal.startDate));
    if (deal.endDate) {
      validity.ele('EndDate').txt(formatDdexDate(deal.endDate));
    }

    // Pre-order date
    if (deal.preorderDate) {
      terms.ele('PreOrderReleaseDate').txt(formatDdexDate(deal.preorderDate));
    }

    // Rights controllers (from all tracks)
    const emittedControllers = new Set<string>();
    for (const [, controllers] of ctx.trackRightsControllersMap) {
      for (const trc of controllers) {
        const entityId = trc.contributorId || trc.labelId || trc.id;
        if (emittedControllers.has(entityId)) continue;
        emittedControllers.add(entityId);

        const rc = terms.ele('RightsController');
        rc.ele('PartyReference').txt(
          ctx.refs.getOrCreatePartyRef(entityId),
        );
        rc.ele('RightsControllerRole').txt('RightsController');

        if (trc.rightSharePercentage) {
          rc.ele('RightSharePercentage').txt(String(trc.rightSharePercentage));
        }
      }
    }
  }
}
