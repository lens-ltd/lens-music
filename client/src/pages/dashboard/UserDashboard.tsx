import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../../components/inputs/Button';
import DashboardChart from '../../components/graphs/DashboardChart';
import UserLayout from '../../containers/UserLayout';
import DashboardCard from '../../containers/DashboardCard';
import AddArtist from '../artists/AddArtist';
import DashboardSection from './components/DashboardSection';
import DashboardTableSection from './components/DashboardTableSection';
import MetricBarList from './components/MetricBarList';
import PlatformDistributionPanel from './components/PlatformDistributionPanel';
import {
  cardVariants,
  CHART_DATASETS,
  chartNavigations,
  containerVariants,
  dashboardCards,
  recentActivity,
  recentReleases,
  revenueBreakdown,
  topTerritories,
  topTracks,
} from './dashboard.data';
import {
  recentReleaseColumns,
  topTrackColumns,
} from './dashboardTableColumns';

const UserDashboard = () => {
  const [selectedButton, setSelectedButton] = useState(0);
  const streamingData = CHART_DATASETS[selectedButton];

  return (
    <UserLayout>
      <main className="flex w-full flex-col gap-4 sm:gap-5 lg:gap-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1
              className="text-[20px] leading-tight text-[color:var(--lens-ink)] sm:text-[22px]"
              style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
            >
              Overview
            </h1>
            <p className="mt-0.5 text-[12px] font-normal text-[color:var(--lens-ink)]/50">
              Track your catalog performance
            </p>
          </div>
          <span className="w-fit rounded-full border border-[color:var(--lens-sand)] px-3 py-1 text-[10px] font-normal uppercase tracking-[0.12em] text-[color:var(--lens-ink)]/55 sm:text-[11px]">
            Jan 2025 – Dec 2025
          </span>
        </header>

        <motion.section
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {dashboardCards.map((card) => (
            <motion.div key={card.title} variants={cardVariants}>
              <DashboardCard
                title={card.title}
                value={card.value}
                icon={card.icon}
                change={card.change}
              />
            </motion.div>
          ))}
        </motion.section>

        <section className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4, ease: 'easeOut' }}
          >
            <DashboardSection
              title="Streaming Overview"
              action={
                <nav className="flex flex-wrap gap-2 sm:justify-start">
                  {chartNavigations.map((navigation, index) => (
                    <Button
                      key={navigation.label}
                      primary={selectedButton === index}
                      className="min-w-[96px] flex-1 sm:min-w-0 sm:flex-none"
                      onClick={(event) => {
                        event.preventDefault();
                        setSelectedButton(index);
                      }}
                    >
                      {navigation.label}
                    </Button>
                  ))}
                </nav>
              }
              bodyClassName="min-h-[260px] px-4 pb-4 pt-3 sm:min-h-[300px] sm:px-5 sm:pb-5 sm:pt-4 md:min-h-[320px]"
              className="h-full"
            >
              <div className="h-full min-h-[220px] sm:min-h-[250px] md:min-h-[280px]">
                <DashboardChart
                  data={streamingData}
                  dataKey="month"
                  height="100%"
                  width="100%"
                  fill="rgb(31, 98, 142)"
                  strokeWidth={2}
                  areaFillMode="solid"
                  showGrid
                  showYAxis
                />
              </div>
            </DashboardSection>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4, ease: 'easeOut' }}
          >
            <PlatformDistributionPanel />
          </motion.div>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4, ease: 'easeOut' }}
          >
            <DashboardSection label="Top Markets" title="Territories" className="h-full">
              <MetricBarList rows={topTerritories} valueKey="percentage" />
            </DashboardSection>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38, duration: 0.4, ease: 'easeOut' }}
          >
            <DashboardSection label="Revenue" title="Breakdown" className="h-full">
              <MetricBarList rows={revenueBreakdown} valueKey="amount" />
            </DashboardSection>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.41, duration: 0.4, ease: 'easeOut' }}
          >
            <DashboardSection label="Activity" title="Recent" className="h-full">
              <ul className="flex flex-col gap-4">
                {recentActivity.map((item, index) => (
                  <motion.li
                    key={item.text}
                    className="flex gap-3"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.46 + index * 0.06, duration: 0.35 }}
                  >
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--lens-blue)]"
                      aria-hidden
                    />
                    <div className="flex flex-col gap-0.5">
                      <p className="text-[12px] font-normal leading-snug text-[color:var(--lens-ink)]">
                        {item.text}
                      </p>
                      <p className="text-[11px] font-normal text-[color:var(--lens-ink)]/40">
                        {item.time}
                      </p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </DashboardSection>
          </motion.div>
        </section>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.48, duration: 0.4, ease: 'easeOut' }}
        >
          <DashboardTableSection
            title="Top Tracks Performance"
            data={topTracks}
            columns={topTrackColumns}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.4, ease: 'easeOut' }}
        >
          <DashboardTableSection
            title="Recent Releases"
            data={recentReleases}
            columns={recentReleaseColumns}
          />
        </motion.div>
      </main>
      <AddArtist />
    </UserLayout>
  );
};

export default UserDashboard;
