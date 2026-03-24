import { ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@/components/inputs/Button';
import { dashboardArrowIcon } from '../dashboard.data';

const DashboardLinkButton = ({ children }: { children: ReactNode }) => (
  <Button styled={false}>
    <span className="flex items-center gap-2 text-[12px] text-[color:var(--lens-blue)] transition-all duration-200 hover:gap-3">
      {children}
      <FontAwesomeIcon icon={dashboardArrowIcon} className="text-[10px]" />
    </span>
  </Button>
);

export default DashboardLinkButton;
