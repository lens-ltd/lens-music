import {
  faArrowRight,
  faDollarSign,
  faDownload,
  faHeadphones,
  faMusic,
  faWaveSquare,
} from '@fortawesome/free-solid-svg-icons';
import {
  faAmazon,
  faApple,
  faSpotify,
  faYoutube,
} from '@fortawesome/free-brands-svg-icons';

export const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

export const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

export const STREAMS_DATA = [
  { month: 'Jan', value: 210000 },
  { month: 'Feb', value: 185000 },
  { month: 'Mar', value: 242000 },
  { month: 'Apr', value: 298000 },
  { month: 'May', value: 275000 },
  { month: 'Jun', value: 310000 },
  { month: 'Jul', value: 356000 },
  { month: 'Aug', value: 389000 },
  { month: 'Sep', value: 342000 },
  { month: 'Oct', value: 401000 },
  { month: 'Nov', value: 378000 },
  { month: 'Dec', value: 452000 },
];

export const DOWNLOADS_DATA = [
  { month: 'Jan', value: 8200 },
  { month: 'Feb', value: 7100 },
  { month: 'Mar', value: 9400 },
  { month: 'Apr', value: 11200 },
  { month: 'May', value: 10500 },
  { month: 'Jun', value: 12800 },
  { month: 'Jul', value: 14300 },
  { month: 'Aug', value: 15900 },
  { month: 'Sep', value: 13700 },
  { month: 'Oct', value: 16400 },
  { month: 'Nov', value: 15100 },
  { month: 'Dec', value: 18200 },
];

export const REVENUE_DATA = [
  { month: 'Jan', value: 920 },
  { month: 'Feb', value: 810 },
  { month: 'Mar', value: 1050 },
  { month: 'Apr', value: 1340 },
  { month: 'May', value: 1180 },
  { month: 'Jun', value: 1560 },
  { month: 'Jul', value: 1740 },
  { month: 'Aug', value: 1890 },
  { month: 'Sep', value: 1620 },
  { month: 'Oct', value: 2010 },
  { month: 'Nov', value: 1870 },
  { month: 'Dec', value: 2345 },
];

export const CHART_DATASETS = [STREAMS_DATA, DOWNLOADS_DATA, REVENUE_DATA];

export const dashboardCards = [
  { title: 'Total Streams', value: '1,234,567', icon: faMusic, change: 12.4 },
  { title: 'Total Downloads', value: '89,123', icon: faDownload, change: -3.1 },
  { title: 'Revenue', value: '$12,345', icon: faDollarSign, change: 8.7 },
  { title: 'Active Listeners', value: '47,820', icon: faHeadphones, change: 21.0 },
];

export const platformData = [
  { name: 'Spotify', icon: faSpotify, percentage: 41 },
  { name: 'Apple Music', icon: faApple, percentage: 28 },
  { name: 'YouTube Music', icon: faYoutube, percentage: 17 },
  { name: 'Amazon Music', icon: faAmazon, percentage: 9 },
  { name: 'Tidal', icon: faWaveSquare, percentage: 5 },
];

export type TrackStatus = 'Active' | 'Rising' | 'Declining';

export interface TopTrack {
  rank: number;
  title: string;
  artist: string;
  streams: string;
  downloads: string;
  revenue: string;
  status: TrackStatus;
}

export const topTracks: TopTrack[] = [
  { rank: 1, title: 'Midnight Signal', artist: 'Aria Nova', streams: '312,445', downloads: '18,220', revenue: '$2,841', status: 'Active' },
  { rank: 2, title: 'Blue Frequency', artist: 'The Lens Trio', streams: '198,302', downloads: '9,410', revenue: '$1,623', status: 'Rising' },
  { rank: 3, title: 'Glass City', artist: 'Aria Nova', streams: '154,891', downloads: '7,804', revenue: '$1,211', status: 'Active' },
  { rank: 4, title: 'Fading Resonance', artist: 'Solo Fold', streams: '98,120', downloads: '3,901', revenue: '$740', status: 'Declining' },
  { rank: 5, title: 'After the Static', artist: 'The Lens Trio', streams: '72,809', downloads: '2,605', revenue: '$511', status: 'Rising' },
];

export type ReleaseStatus = 'Live' | 'Pending' | 'Scheduled';
export type ReleaseType = 'Single' | 'EP' | 'Album';

export interface RecentRelease {
  title: string;
  artist: string;
  type: ReleaseType;
  releaseDate: string;
  status: ReleaseStatus;
  stores: number;
}

export const recentReleases: RecentRelease[] = [
  { title: 'Midnight Signal', artist: 'Aria Nova', type: 'Single', releaseDate: '12 Dec 2025', status: 'Live', stores: 142 },
  { title: 'Echoes Collected', artist: 'The Lens Trio', type: 'EP', releaseDate: '28 Nov 2025', status: 'Live', stores: 138 },
  { title: 'Glass City', artist: 'Aria Nova', type: 'Single', releaseDate: '05 Jan 2026', status: 'Scheduled', stores: 0 },
  { title: 'Silent Meridian', artist: 'Solo Fold', type: 'Album', releaseDate: '20 Oct 2025', status: 'Live', stores: 145 },
  { title: 'After the Static', artist: 'The Lens Trio', type: 'Single', releaseDate: '15 Jan 2026', status: 'Pending', stores: 0 },
];

export const topTerritories = [
  { name: 'United States', percentage: 34 },
  { name: 'United Kingdom', percentage: 18 },
  { name: 'Germany', percentage: 12 },
  { name: 'France', percentage: 9 },
  { name: 'Brazil', percentage: 8 },
  { name: 'Japan', percentage: 6 },
  { name: 'Other', percentage: 13 },
];

export const revenueBreakdown = [
  { source: 'Streaming royalties', amount: '$9,240', percentage: 75 },
  { source: 'Download sales', amount: '$1,852', percentage: 15 },
  { source: 'Sync licensing', amount: '$864', percentage: 7 },
  { source: 'Other', amount: '$389', percentage: 3 },
];

export const recentActivity = [
  { text: 'Midnight Signal crossed 300k streams', time: '2 hours ago' },
  { text: 'New payout of $1,240 processed', time: '1 day ago' },
  { text: 'Echoes Collected went live on 138 stores', time: '3 days ago' },
  { text: 'Blue Frequency added to Spotify editorial', time: '5 days ago' },
  { text: 'Monthly revenue report available', time: '1 week ago' },
];

export const chartNavigations = [
  { label: 'Streams' },
  { label: 'Downloads' },
  { label: 'Revenue' },
];

export const dashboardArrowIcon = faArrowRight;
