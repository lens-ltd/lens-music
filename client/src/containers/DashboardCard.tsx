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
  color?: string;
  change?: number;
}

const DashboardCard = ({
  title,
  value,
  icon,
  color = '#f8fafc',
  change,
}: DashboardCardProps) => {
  return (
    <section
      className="flex flex-col justify-between p-5 rounded-2xl shadow-lg backdrop-blur-md border border-gray-200/40 min-w-[180px] min-h-[120px] transition-transform hover:scale-[1.03] hover:shadow-xl bg-white"
      style={{ background: color }}
      aria-label={title}
    >
      <header className="flex items-center justify-between mb-2">
        <span className="text-gray-500 text-xs font-normal uppercase tracking-wide">
          {title}
        </span>
        <span className="text-2xl opacity-70">
          <FontAwesomeIcon icon={icon} />
        </span>
      </header>
      <span
        className="text-3xl font-medium text-gray-900 drop-shadow-sm"
        aria-live="polite"
      >
        {value}
      </span>
      {change !== undefined && (
        <span
          className={`flex items-center gap-1 text-xs font-normal mt-1 ${
            change >= 0 ? 'text-emerald-600' : 'text-red-500'
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
