import {
  isValidGRid,
  isValidIso3166Alpha2,
  isValidIso639Language,
  isValidIsni,
  isValidIswc,
  isValidUpc,
} from './releases.helper';
import { releaseStoreHasDealCoverage } from './deals.helper';
import { UUID } from '../types/common.types';

describe('isValidUpc', () => {
  it.each(['036000291452', '4006381333931'])('accepts %s', (upc) => {
    expect(isValidUpc(upc)).toBe(true);
  });

  it.each(['036000291453', 'LNS2026483', '12345', ''])('rejects %s', (upc) => {
    expect(isValidUpc(upc)).toBe(false);
  });
});

describe('code format validators', () => {
  it('validates ISO codes', () => {
    expect(isValidIso3166Alpha2('rw')).toBe(true);
    expect(isValidIso3166Alpha2('XX')).toBe(false);
    expect(isValidIso639Language('en')).toBe(true);
  });

  it('validates GRid, ISWC and ISNI', () => {
    expect(isValidGRid('A12425GABC1234002M')).toBe(true);
    expect(isValidGRid('A1242')).toBe(false);
    expect(isValidIswc('T-034524680-1')).toBe(true);
    expect(isValidIswc('T-0345246801')).toBe(false);
    expect(isValidIsni('0000 0001 2103 2683')).toBe(true);
    expect(isValidIsni('0000-0001')).toBe(false);
  });
});

describe('releaseStoreHasDealCoverage', () => {
  const store = 'store-a' as UUID;

  it('is covered by a global deal', () => {
    expect(releaseStoreHasDealCoverage(store, [{ storeId: null }])).toBe(true);
  });

  it('is covered by a deal for that store', () => {
    expect(releaseStoreHasDealCoverage(store, [{ storeId: store }])).toBe(true);
  });

  it('is not covered by a deal for another store', () => {
    expect(releaseStoreHasDealCoverage(store, [{ storeId: 'store-b' as UUID }])).toBe(false);
  });
});
