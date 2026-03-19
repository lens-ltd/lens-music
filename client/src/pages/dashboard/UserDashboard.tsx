import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMusic,
  faDownload,
  faDollarSign,
  faHeadphones,
  faArrowRight,
  faWaveSquare,
} from '@fortawesome/free-solid-svg-icons';
import {
  faSpotify,
  faApple,
  faYoutube,
  faAmazon,
} from '@fortawesome/free-brands-svg-icons';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Button from '../../components/inputs/Button';
import UserLayout from '../../containers/UserLayout';
import DashboardChart from '../../components/graphs/DashboardChart';
import DashboardCard from '../../containers/DashboardCard';
import AddArtist from '../artists/AddArtist';

// ── Animation variants ──────────────────────────────────────────────────────
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

// ── Chart datasets ──────────────────────────────────────────────────────────
const STREAMS_DATA = [
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

const DOWNLOADS_DATA = [
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

const REVENUE_DATA = [
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

const CHART_DATASETS = [STREAMS_DATA, DOWNLOADS_DATA, REVENUE_DATA];

// ── Stat cards ──────────────────────────────────────────────────────────────
const dashboardCards = [
  { title: 'Total Streams',    value: '1,234,567', icon: faMusic,       change: 12.4,  color: '#ffffff' },
  { title: 'Total Downloads',  value: '89,123',    icon: faDownload,    change: -3.1,  color: '#ffffff' },
  { title: 'Revenue',          value: '$12,345',   icon: faDollarSign,  change: 8.7,   color: '#ffffff' },
  { title: 'Active Listeners', value: '47,820',    icon: faHeadphones,  change: 21.0,  color: '#ffffff' },
];

// ── Platform distribution ───────────────────────────────────────────────────
const platformData = [
  { name: 'Spotify',        icon: faSpotify,    percentage: 41, color: '#1DB954' },
  { name: 'Apple Music',    icon: faApple,      percentage: 28, color: '#FC3C44' },
  { name: 'YouTube Music',  icon: faYoutube,    percentage: 17, color: '#FF0000' },
  { name: 'Amazon Music',   icon: faAmazon,     percentage: 9,  color: '#00A8E0' },
  { name: 'Tidal',          icon: faWaveSquare, percentage: 5,  color: '#20618d' },
];

// ── Top tracks ──────────────────────────────────────────────────────────────
type TrackStatus = 'Active' | 'Rising' | 'Declining';

interface TopTrack {
  rank: number;
  title: string;
  artist: string;
  streams: string;
  downloads: string;
  revenue: string;
  status: TrackStatus;
}

const topTracks: TopTrack[] = [
  { rank: 1, title: 'Midnight Signal',  artist: 'Aria Nova',     streams: '312,445', downloads: '18,220', revenue: '$2,841', status: 'Active'    },
  { rank: 2, title: 'Blue Frequency',   artist: 'The Lens Trio', streams: '198,302', downloads: '9,410',  revenue: '$1,623', status: 'Rising'    },
  { rank: 3, title: 'Glass City',       artist: 'Aria Nova',     streams: '154,891', downloads: '7,804',  revenue: '$1,211', status: 'Active'    },
  { rank: 4, title: 'Fading Resonance', artist: 'Solo Fold',     streams: '98,120',  downloads: '3,901',  revenue: '$740',   status: 'Declining' },
  { rank: 5, title: 'After the Static', artist: 'The Lens Trio', streams: '72,809',  downloads: '2,605',  revenue: '$511',   status: 'Rising'    },
];

const statusConfig: Record<TrackStatus, { label: string; className: string }> = {
  Active:    { label: 'Active',    className: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
  Rising:    { label: 'Rising',    className: 'bg-blue-50 text-blue-700 border border-blue-200' },
  Declining: { label: 'Declining', className: 'bg-red-50 text-red-500 border border-red-200' },
};

const StatusBadge = ({ status }: { status: TrackStatus }) => {
  const { label, className } = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-medium ${className}`}
    >
      {label}
    </span>
  );
};

// ── Chart navigations ───────────────────────────────────────────────────────
const chartNavigations = [
  { label: 'Streams' },
  { label: 'Downloads' },
  { label: 'Revenue' },
];

// ── Component ───────────────────────────────────────────────────────────────
const UserDashboard = () => {
  const [selectedButton, setSelectedButton] = useState(0);
  const streamingData = CHART_DATASETS[selectedButton];

  return (
    <UserLayout>
      <main className="flex flex-col gap-6 w-full">

        {/* Page header */}
        <header className="flex items-end justify-between">
          <div>
            <h1 className="font-serif text-[22px] font-bold text-gray-900 leading-tight">
              Overview
            </h1>
            <p className="text-[12px] text-gray-400 mt-0.5">
              Track your catalog performance
            </p>
          </div>
          <span className="bg-white border border-gray-200 rounded-full text-[11px] text-gray-500 px-3 py-1 font-medium">
            Jan 2025 – Dec 2025
          </span>
        </header>

        {/* Stat cards */}
        <motion.section
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {dashboardCards.map((card, index) => (
            <motion.div key={index} variants={cardVariants}>
              <DashboardCard
                title={card.title}
                value={card.value}
                icon={card.icon}
                color={card.color}
                change={card.change}
              />
            </motion.div>
          ))}
        </motion.section>

        {/* Chart row */}
        <section className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">

          {/* Chart card */}
          <motion.figure
            className="bg-white rounded-2xl border border-gray-200/60 shadow-sm p-5 flex flex-col gap-4"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4, ease: 'easeOut' }}
          >
            <header className="flex items-center justify-between flex-wrap gap-3">
              <h2 className="font-semibold text-[15px] text-gray-800">
                Streaming Overview
              </h2>
              <nav className="flex gap-2">
                {chartNavigations.map((nav, index) => (
                  <Button
                    key={index}
                    primary={selectedButton === index}
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedButton(index);
                    }}
                  >
                    {nav.label}
                  </Button>
                ))}
              </nav>
            </header>
            <div className="flex-1 min-h-[280px]">
              <DashboardChart
                data={streamingData}
                dataKey="month"
                height="100%"
                width="100%"
                fill="#20618d"
                strokeWidth={2}
                areaFillMode="gradient"
                showGrid={true}
                showYAxis={true}
              />
            </div>
          </motion.figure>

          {/* Platform distribution panel */}
          <motion.aside
            className="bg-white rounded-2xl border border-gray-200/60 shadow-sm p-5 flex flex-col gap-5"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4, ease: 'easeOut' }}
          >
            <header>
              <h2 className="font-semibold text-[15px] text-gray-800">
                Platform Distribution
              </h2>
              <p className="text-[11px] text-gray-400 mt-0.5">Last 12 months</p>
            </header>

            <ul className="flex flex-col gap-4">
              {platformData.map((platform, i) => (
                <motion.li
                  key={platform.name}
                  className="flex flex-col gap-1.5"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.07, duration: 0.35 }}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-[12px] text-gray-700 font-medium">
                      <FontAwesomeIcon
                        icon={platform.icon}
                        style={{ color: platform.color }}
                        className="text-[13px] w-3.5"
                      />
                      {platform.name}
                    </span>
                    <span className="text-[11px] text-gray-400 font-medium">
                      {platform.percentage}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: platform.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${platform.percentage}%` }}
                      transition={{
                        delay: 0.45 + i * 0.07,
                        duration: 0.6,
                        ease: 'easeOut',
                      }}
                    />
                  </div>
                </motion.li>
              ))}
            </ul>

            <footer className="mt-auto pt-3 border-t border-gray-100">
              <Button styled={false}>
                <span className="flex items-center gap-2 text-[12px] text-primary hover:gap-3 transition-all duration-200">
                  See all platforms
                  <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
                </span>
              </Button>
            </footer>
          </motion.aside>
        </section>

        {/* Top Tracks table */}
        <motion.section
          className="bg-white rounded-2xl border border-gray-200/60 shadow-sm overflow-hidden"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.4, ease: 'easeOut' }}
        >
          <header className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-[15px] text-gray-800">
              Top Tracks Performance
            </h2>
            <Button styled={false}>
              <span className="flex items-center gap-2 text-[12px] text-primary hover:gap-3 transition-all duration-200">
                View all
                <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
              </span>
            </Button>
          </header>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-[10px] font-medium text-gray-400 uppercase tracking-wider">#</th>
                  <th className="text-left px-5 py-3 text-[10px] font-medium text-gray-400 uppercase tracking-wider">Track</th>
                  <th className="text-right px-5 py-3 text-[10px] font-medium text-gray-400 uppercase tracking-wider">Streams</th>
                  <th className="text-right px-5 py-3 text-[10px] font-medium text-gray-400 uppercase tracking-wider hidden sm:table-cell">Downloads</th>
                  <th className="text-right px-5 py-3 text-[10px] font-medium text-gray-400 uppercase tracking-wider">Revenue</th>
                  <th className="text-center px-5 py-3 text-[10px] font-medium text-gray-400 uppercase tracking-wider hidden md:table-cell">Status</th>
                </tr>
              </thead>
              <tbody>
                {topTracks.map((track, i) => (
                  <motion.tr
                    key={track.rank}
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50/70 transition-colors duration-150"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + i * 0.05 }}
                  >
                    <td className="px-5 py-3.5 text-[12px] text-gray-300 font-medium w-8">
                      {track.rank}
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-[13px] font-medium text-gray-800 leading-tight">
                        {track.title}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{track.artist}</p>
                    </td>
                    <td className="px-5 py-3.5 text-right text-[12px] text-gray-600 tabular-nums">
                      {track.streams}
                    </td>
                    <td className="px-5 py-3.5 text-right text-[12px] text-gray-600 tabular-nums hidden sm:table-cell">
                      {track.downloads}
                    </td>
                    <td className="px-5 py-3.5 text-right text-[12px] font-semibold text-gray-800 tabular-nums">
                      {track.revenue}
                    </td>
                    <td className="px-5 py-3.5 text-center hidden md:table-cell">
                      <StatusBadge status={track.status} />
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.section>

      </main>
      <AddArtist />
    </UserLayout>
  );
};

export default UserDashboard;
