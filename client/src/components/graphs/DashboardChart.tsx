import { FC, useMemo } from 'react';
import { defineChart, dot, lineY } from '@tanstack/charts';
import { Chart } from '@tanstack/charts/react';
import { scaleLinear } from '@tanstack/charts/scales/linear';
import { scalePoint } from '@tanstack/charts/scales/point';
import { tooltip } from '@tanstack/charts/tooltip';

interface DashboardChartProps {
  data: {
    month: string;
    value: number;
  }[];
  dataKey: string;
  height?: string | number;
  type?:
    | 'basis'
    | 'basisClosed'
    | 'basisOpen'
    | 'linear'
    | 'monotone'
    | 'natural'
    | 'step'
    | 'stepAfter'
    | 'stepBefore';
  vertical?: boolean;
  strokeWidth?: number;
  fill?: string;
  showArea?: boolean;
  showGrid?: boolean;
  showYAxis?: boolean;
  tooltipVariant?: 'default' | 'minimal';
}

/** Mirrors `--signal` in index.css. */
const SIGNAL = 'rgb(31, 98, 142)';

/** TanStack renders into SVG attributes where `var()` does not resolve. */
const resolveColor = (fill: string | undefined) =>
  fill && !fill.startsWith('var(') ? fill : SIGNAL;

const compactNumber = (v: number) =>
  v >= 1000 ? `${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}k` : String(v);

// ── empty state ──────────────────────────────────────────────────────────────
const ChartEmpty: FC<{ label: string }> = ({ label }) => (
  <div className="grid min-h-40 place-items-center rounded-(--radius-card) bg-(--surface) p-6 text-center text-sm text-(--muted)">
    {label}
  </div>
);

// ── chart ────────────────────────────────────────────────────────────────────
const DashboardChart: FC<DashboardChartProps> = ({
  data,
  dataKey,
  height = 220,
  strokeWidth = 2.5,
  fill = SIGNAL,
  showGrid = true,
  showYAxis = true,
}) => {
  const color = resolveColor(fill);
  const rows = useMemo(
    () => data.map((row) => ({ label: String(row[dataKey as keyof typeof row]), value: row.value })),
    [data, dataKey],
  );
  const definition = useMemo(
    () =>
      defineChart({
        marks: [
          lineY(rows, {
            id: 'trend-line',
            x: 'label',
            y: 'value',
            stroke: color,
            strokeWidth,
          }),
          dot(rows, {
            id: 'trend-points',
            x: 'label',
            y: 'value',
            fill: color,
            r: 3,
          }),
        ],
        x: {
          scale: () => scalePoint<string>().padding(0.35),
        },
        y: {
          scale: scaleLinear,
          nice: true,
          grid: showGrid,
          axis: showYAxis
            ? {
                ticks: {
                  format: (value) => compactNumber(Number(value)),
                },
              }
            : false,
        },
        tooltip,
        svgAnimation: true,
      }),
    [rows, color, strokeWidth, showGrid, showYAxis],
  );

  if (!rows.length) return <ChartEmpty label="No data in this range" />;

  return (
    <div>
      <Chart
        definition={definition}
        height={typeof height === 'number' ? height : 220}
        initialWidth={520}
        ariaLabel="Monthly value trend"
        ariaDescription="Exact monthly values are available in the table below the chart."
      />
      <details className="mt-3">
        <summary className="cursor-pointer text-xs font-medium text-(--signal)">
          View exact monthly values
        </summary>
        <div className="mt-2 max-h-56 overflow-auto">
          <table className="w-full border-collapse text-left text-xs">
            <caption className="sr-only">Monthly values</caption>
            <thead className="text-(--muted)">
              <tr>
                <th scope="col" className="py-1.5">
                  Month
                </th>
                <th scope="col" className="py-1.5 text-right">
                  Value
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-t border-(--line-soft)">
                  <th scope="row" className="py-1.5 font-normal">
                    {row.label}
                  </th>
                  <td className="py-1.5 text-right tabular-nums">
                    {row.value.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
};

export default DashboardChart;
