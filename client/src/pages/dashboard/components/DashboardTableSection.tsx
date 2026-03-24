import { ColumnDef } from '@tanstack/react-table';
import Table from '@/components/table/Table';
import DashboardSection from './DashboardSection';
import DashboardLinkButton from './DashboardLinkButton';

const dashboardTableRowClassName =
  'border-[color:var(--lens-sand)] hover:bg-[color:var(--lens-sand)]/15';

const dashboardTableHeaderCellClassName =
  'px-5 py-3 text-[10px] font-normal uppercase tracking-[0.15em] text-[color:var(--lens-ink)]/45';

const dashboardTableCellClassName = 'px-5 py-3.5 text-[12px]';

interface DashboardTableSectionProps<TData, TValue> {
  title: string;
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
}

const DashboardTableSection = <TData, TValue>({
  title,
  data,
  columns,
}: DashboardTableSectionProps<TData, TValue>) => (
  <DashboardSection
    title={title}
    action={<DashboardLinkButton>View all</DashboardLinkButton>}
    overflowHidden
    bodyClassName="p-0"
  >
    <Table
      columns={columns}
      data={data}
      showPagination={false}
      rowClassName={dashboardTableRowClassName}
      containerClassName="rounded-none border-0"
      headerCellClassName={dashboardTableHeaderCellClassName}
      cellClassName={dashboardTableCellClassName}
    />
  </DashboardSection>
);

export default DashboardTableSection;
