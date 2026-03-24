import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  IconDefinition,
  faArrowTrendUp,
  faArrowTrendDown,
} from '@fortawesome/free-solid-svg-icons';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: IconDefinition;
  change?: number;
}

const DashboardCard = ({
  title,
  value,
  icon,
  change,
}: DashboardCardProps) => {
  return (
    <section
      className="flex min-w-0 flex-col justify-between rounded-xl border border-[color:var(--lens-sand)] bg-white p-4 min-h-[120px] sm:p-5"
      aria-label={title}
    >
      <header className="mb-2 flex items-center justify-between gap-3">
        <span className="text-[color:var(--lens-ink)]/55 text-xs font-normal uppercase tracking-[0.15em]">
          {title}
        </span>
        <span className="text-lg text-[color:var(--lens-blue)] opacity-50">
          <FontAwesomeIcon icon={icon} />
        </span>
      </header>
      <span
        className="text-[28px] font-normal text-[color:var(--lens-ink)] sm:text-3xl"
        style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
        aria-live="polite"
      >
        {value}
      </span>
      {change !== undefined && (
        <span
          className={`flex items-center gap-1 text-xs font-normal mt-1 ${
            change >= 0 ? 'text-[color:var(--lens-blue)]' : 'text-[color:var(--lens-ink)]/50'
          }`}
        >
          <FontAwesomeIcon
            icon={change >= 0 ? faArrowTrendUp : faArrowTrendDown}
            className="text-[10px]"
          />
          {change >= 0 ? '+' : ''}
          {change}% vs last month
        </span>
      )}
    </section>
  );
};

export default DashboardCard;
