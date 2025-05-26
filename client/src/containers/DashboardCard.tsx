import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: IconDefinition;
  color?: string;
}

const DashboardCard = ({
  title,
  value,
  icon,
  color = '#f8fafc',
}: DashboardCardProps) => {
  return (
    <section
      className="flex flex-col justify-between p-5 rounded-2xl shadow-lg backdrop-blur-md border border-gray-200/40 min-w-[180px] min-h-[120px] transition-transform hover:scale-[1.03] hover:shadow-xl bg-white"
      style={{ background: color }}
      aria-label={title}
    >
      <header className="flex items-center justify-between mb-2">
        <span className="text-gray-500 text-xs font-medium uppercase tracking-wide">
          {title}
        </span>
        <span className="text-2xl opacity-70">
          <FontAwesomeIcon icon={icon} />
        </span>
      </header>
      <span
        className="text-3xl font-bold text-gray-900 drop-shadow-sm"
        aria-live="polite"
      >
        {value}
      </span>
    </section>
  );
};

export default DashboardCard;
