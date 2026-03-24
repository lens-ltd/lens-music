import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DashboardSection from './DashboardSection';
import DashboardLinkButton from './DashboardLinkButton';
import { platformData } from '../dashboard.data';

const PlatformDistributionPanel = () => (
  <DashboardSection
    title="Platform Distribution"
    subtitle="Last 12 months"
    action={<DashboardLinkButton>See all platforms</DashboardLinkButton>}
    className="h-full"
  >
    <ul className="flex flex-col gap-3 sm:gap-4">
      {platformData.map((platform, index) => (
        <motion.li
          key={platform.name}
          className="flex flex-col gap-1.5"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 + index * 0.07, duration: 0.35 }}
        >
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-[12px] font-normal text-[color:var(--lens-ink)]">
              <FontAwesomeIcon
                icon={platform.icon}
                className="w-3.5 text-[13px] text-[color:var(--lens-blue)]"
              />
              {platform.name}
            </span>
            <span className="text-[11px] font-normal text-[color:var(--lens-ink)]/45">
              {platform.percentage}%
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-[color:var(--lens-sand)]">
            <motion.div
              className="h-full rounded-full bg-[color:var(--lens-blue)]"
              initial={{ width: 0 }}
              animate={{ width: `${platform.percentage}%` }}
              transition={{
                delay: 0.5 + index * 0.07,
                duration: 0.6,
                ease: 'easeOut',
              }}
            />
          </div>
        </motion.li>
      ))}
    </ul>
  </DashboardSection>
);

export default PlatformDistributionPanel;
