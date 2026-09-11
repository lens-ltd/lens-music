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
      className="flex min-w-0 flex-col justify-between card-framed p-4 min-h-[120px] sm:p-5"
      aria-label={title}
    >
      <header className="mb-2 flex items-center justify-between gap-3">
        <span className="type-eyebrow">
          {title}
        </span>
        <span className="text-lg text-(--slate)">
          <FontAwesomeIcon icon={icon} />
        </span>
      </header>
      <span
        className="type-metric"
        aria-live="polite"
      >
        {value}
      </span>
      {change !== undefined && (
        <span
          className={`flex items-center gap-1 text-xs font-normal mt-1 ${
            change >= 0 ? 'text-(--signal)' : 'text-(--danger)'
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
