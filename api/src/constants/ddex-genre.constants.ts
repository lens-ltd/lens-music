/**
 * Partial map from platform genre display names to DDEX-friendly / common AVS labels.
 * Unknown names pass through for UserDefined or future mapping.
 */
export const DDEX_GENRE_NAME_MAP: Record<string, string> = {
  'Hip Hop': 'HipHop',
  'Hip-Hop': 'HipHop',
  'R&B': 'RnB',
  'R & B': 'RnB',
  'Rock': 'Rock',
  'Pop': 'Pop',
  'Electronic': 'Electronic',
  'Dance': 'Dance',
  'Jazz': 'Jazz',
  Classical: 'Classical',
  Country: 'Country',
  Folk: 'Folk',
  Blues: 'Blues',
  Reggae: 'Reggae',
  Latin: 'Latin',
  World: 'World',
  Alternative: 'Alternative',
  Metal: 'Metal',
  Punk: 'Punk',
  Soul: 'Soul',
  Funk: 'Funk',
  Gospel: 'Gospel',
  'Christian & Gospel': 'Gospel',
  Soundtrack: 'Soundtrack',
  Comedy: 'Comedy',
  'Spoken Word': 'SpokenWord',
  Audiobooks: 'Audiobooks',
};

export const mapGenreNameToDdex = (name: string): string => {
  const trimmed = name.trim();
  return DDEX_GENRE_NAME_MAP[trimmed] ?? trimmed;
};
