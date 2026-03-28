const ISO_3166_ALPHA2 = new Set([
  'AD','AE','AF','AG','AI','AL','AM','AO','AQ','AR','AS','AT','AU','AW','AX','AZ',
  'BA','BB','BD','BE','BF','BG','BH','BI','BJ','BL','BM','BN','BO','BQ','BR','BS',
  'BT','BV','BW','BY','BZ','CA','CC','CD','CF','CG','CH','CI','CK','CL','CM','CN',
  'CO','CR','CU','CV','CW','CX','CY','CZ','DE','DJ','DK','DM','DO','DZ','EC','EE',
  'EG','EH','ER','ES','ET','FI','FJ','FK','FM','FO','FR','GA','GB','GD','GE','GF',
  'GG','GH','GI','GL','GM','GN','GP','GQ','GR','GS','GT','GU','GW','GY','HK','HM',
  'HN','HR','HT','HU','ID','IE','IL','IM','IN','IO','IQ','IR','IS','IT','JE','JM',
  'JO','JP','KE','KG','KH','KI','KM','KN','KP','KR','KW','KY','KZ','LA','LB','LC',
  'LI','LK','LR','LS','LT','LU','LV','LY','MA','MC','MD','ME','MF','MG','MH','MK',
  'ML','MM','MN','MO','MP','MQ','MR','MS','MT','MU','MV','MW','MX','MY','MZ','NA',
  'NC','NE','NF','NG','NI','NL','NO','NP','NR','NU','NZ','OM','PA','PE','PF','PG',
  'PH','PK','PL','PM','PN','PR','PS','PT','PW','PY','QA','RE','RO','RS','RU','RW',
  'SA','SB','SC','SD','SE','SG','SH','SI','SJ','SK','SL','SM','SN','SO','SR','SS',
  'ST','SV','SX','SY','SZ','TC','TD','TF','TG','TH','TJ','TK','TL','TM','TN','TO',
  'TR','TT','TV','TW','TZ','UA','UG','UM','US','UY','UZ','VA','VC','VE','VG','VI',
  'VN','VU','WF','WS','YE','YT','ZA','ZM','ZW',
]);

/**
 * Normalize a territory code for DDEX.
 * Handles the "Worldwide" special case and validates ISO 3166-1 alpha-2 codes.
 */
export function normalizeTerritoryCode(code: string): string {
  const trimmed = code.trim();
  const upper = trimmed.toUpperCase();

  if (upper === 'WORLDWIDE' || upper === 'WW') {
    return 'Worldwide';
  }

  return upper;
}

/**
 * Check if a territory code is valid (ISO 3166-1 alpha-2 or "Worldwide").
 */
export function isValidTerritoryCode(code: string): boolean {
  const normalized = normalizeTerritoryCode(code);
  return normalized === 'Worldwide' || ISO_3166_ALPHA2.has(normalized);
}

/**
 * Normalize an array of territory codes, filtering out invalid ones.
 * Returns ['Worldwide'] if the array is empty or contains only 'Worldwide'.
 */
export function normalizeTerritories(codes: string[]): string[] {
  if (!codes || codes.length === 0) return ['Worldwide'];

  const normalized = codes
    .map(normalizeTerritoryCode)
    .filter(c => c === 'Worldwide' || ISO_3166_ALPHA2.has(c));

  if (normalized.length === 0) return ['Worldwide'];
  if (normalized.includes('Worldwide')) return ['Worldwide'];

  return normalized;
}
