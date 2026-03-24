export enum ReleaseDeliveryStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
}

export const DEFAULT_DSP_STORES = [
  { name: 'Spotify', slug: 'spotify' },
  { name: 'Apple Music', slug: 'apple-music' },
  { name: 'Amazon Music', slug: 'amazon-music' },
  { name: 'Deezer', slug: 'deezer' },
  { name: 'TIDAL', slug: 'tidal' },
  { name: 'YouTube Music', slug: 'youtube-music' },
  { name: 'TikTok', slug: 'tiktok' },
  { name: 'Instagram/Facebook', slug: 'instagram-facebook' },
  { name: 'Pandora', slug: 'pandora' },
  { name: 'SoundCloud', slug: 'soundcloud' },
  { name: 'Boomplay', slug: 'boomplay' },
  { name: 'Audiomack', slug: 'audiomack' },
  { name: 'Anghami', slug: 'anghami' },
  { name: 'Napster', slug: 'napster' },
  { name: 'iHeartRadio', slug: 'iheartradio' },
];
