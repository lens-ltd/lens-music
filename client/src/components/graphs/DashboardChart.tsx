import { FC } from 'react';
import {
  Area,
  CartesianGrid,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  TooltipProps,
} from 'recharts';

interface DashboardChartProps {
  data: {
    month: string;
    value: number;
  }[];
  dataKey: string;
  height?: string;
  width?: string;
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
  areaFillMode?: 'gradient' | 'solid' | 'none';
  areaOpacity?: number;
  showGrid?: boolean;
  showYAxis?: boolean;
  tooltipVariant?: 'default' | 'minimal';
}

// ── custom tooltip ─────────────────────────────────────────────────────────────
const EditorialTooltip: FC<TooltipProps<number, string>> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const val = payload[0].value ?? 0;

  return (
    <figure
      className="invert-surface rounded-(--radius-control) px-4 py-2.5 shadow-[var(--shadow-menu)] min-w-[100px] m-0"
      aria-label={`${label}: ${val}`}
    >
      <figcaption className="type-eyebrow mb-1 block">
        {label}
      </figcaption>
      <p className="type-h3 tabular m-0">
        {val.toLocaleString()}
      </p>
    </figure>
  );
};

// ── custom active dot ──────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PulseDot: FC<any> = (props) => {
  const { cx, cy, fill } = props;
  return (
    <g>
      <circle cx={cx} cy={cy} r={10} fill={fill} opacity={0.12} />
      <circle cx={cx} cy={cy} r={5}  fill={fill} opacity={0.25} />
      <circle cx={cx} cy={cy} r={3}  fill={fill} />
      <circle cx={cx} cy={cy} r={1.5} fill="white" />
    </g>
  );
};

// ── chart ──────────────────────────────────────────────────────────────────────
const DashboardChart: FC<DashboardChartProps> = ({
  data,
  dataKey,
  height = '90%',
  width = '100%',
  type = 'natural',
  vertical = false,
  strokeWidth = 2,
  fill = 'var(--lens-blue)',
  showArea = true,
  areaFillMode = 'solid',
  areaOpacity = 0.12,
  showGrid = true,
  showYAxis = true,
  tooltipVariant = 'default',
}) => {
  const areaFillValue =
    !showArea || areaFillMode === 'none' ? 'transparent' : fill;

  return (
    <ResponsiveContainer height={height} width={width}>
      <ComposedChart
        data={data}
        margin={{ top: 12, right: 4, left: 0, bottom: 0 }}
        style={{ overflow: 'visible' }}
      >
        {showGrid && (
          <CartesianGrid
            strokeDasharray="1 6"
            vertical={vertical}
            stroke="var(--line)"
            strokeWidth={1}
          />
        )}

        <XAxis
          dataKey={dataKey}
          tick={{
            fontSize: 12,
            fill: 'var(--muted)',
            fontFamily: "'Poppins', system-ui, sans-serif",
            fontWeight: 400,
          }}
          tickLine={false}
          axisLine={false}
          dy={6}
        />

        {showYAxis && (
          <YAxis
            allowDataOverflow
            tickSize={0}
            tickMargin={12}
            tick={{
              fontSize: 12,
              fill: 'var(--muted)',
              fontFamily: "'Poppins', system-ui, sans-serif",
              fontWeight: 400,
            }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) =>
              v >= 1000 ? `${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}k` : String(v)
            }
            width={36}
          />
        )}

        <Tooltip
          content={<EditorialTooltip />}
          cursor={{
            stroke: fill,
            strokeWidth: 1,
            strokeDasharray: '4 4',
            strokeOpacity: tooltipVariant === 'minimal' ? 0.25 : 0.4,
          }}
        />

        <Area
          connectNulls
          dataKey="value"
          fill={areaFillValue}
          fillOpacity={showArea && areaFillMode !== 'none' ? areaOpacity : 0}
          strokeWidth={strokeWidth}
          stroke={fill}
          type={type}
          dot={false}
          activeDot={<PulseDot fill={fill} />}
          style={undefined}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default DashboardChart;
