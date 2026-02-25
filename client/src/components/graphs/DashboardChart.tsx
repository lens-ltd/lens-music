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
}

// ── custom tooltip ─────────────────────────────────────────────────────────────
const EditorialTooltip: FC<TooltipProps<number, string>> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const val = payload[0].value ?? 0;

  return (
    <figure
      style={{
        background: 'rgb(16,14,9)',
        borderRadius: '10px',
        padding: '10px 16px',
        border: 'none',
        boxShadow: '0 8px 24px rgba(16,14,9,0.18)',
        minWidth: '100px',
        margin: 0,
      }}
      aria-label={`${label}: ${val}`}
    >
      <figcaption
        style={{
          fontFamily: "'Poppins', system-ui, sans-serif",
          fontSize: '10px',
          fontWeight: 600,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.45)',
          marginBottom: '4px',
          display: 'block',
        }}
      >
        {label}
      </figcaption>
      <p
        style={{
          fontFamily: "'Libre Baskerville', Georgia, serif",
          fontSize: '20px',
          fontWeight: 700,
          color: 'white',
          lineHeight: 1,
          margin: 0,
          letterSpacing: '-0.01em',
        }}
      >
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
  fill = 'rgb(31,98,142)',
}) => {
  const gradId = 'lensAreaGrad';

  return (
    <ResponsiveContainer height={height} width={width}>
      <ComposedChart
        data={data}
        margin={{ top: 12, right: 4, left: 0, bottom: 0 }}
        style={{ overflow: 'visible' }}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={fill} stopOpacity={0.22} />
            <stop offset="72%"  stopColor={fill} stopOpacity={0.06} />
            <stop offset="100%" stopColor={fill} stopOpacity={0}    />
          </linearGradient>
        </defs>

        <CartesianGrid
          strokeDasharray="1 6"
          vertical={vertical}
          stroke="rgba(16,14,9,0.08)"
          strokeWidth={1}
        />

        <XAxis
          dataKey={dataKey}
          tick={{
            fontSize: 10,
            fill: 'rgba(16,14,9,0.4)',
            fontFamily: "'Poppins', system-ui, sans-serif",
            fontWeight: 500,
          }}
          tickLine={false}
          axisLine={false}
          dy={6}
        />

        <YAxis
          allowDataOverflow
          tickSize={0}
          tickMargin={12}
          tick={{
            fontSize: 10,
            fill: 'rgba(16,14,9,0.35)',
            fontFamily: "'Poppins', system-ui, sans-serif",
            fontWeight: 500,
          }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) =>
            v >= 1000 ? `${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}k` : String(v)
          }
          width={36}
        />

        <Tooltip
          content={<EditorialTooltip />}
          cursor={{
            stroke: fill,
            strokeWidth: 1,
            strokeDasharray: '4 4',
            strokeOpacity: 0.4,
          }}
        />

        <Area
          connectNulls
          dataKey="value"
          fill={`url(#${gradId})`}
          fillOpacity={1}
          strokeWidth={strokeWidth}
          stroke={fill}
          type={type}
          dot={false}
          activeDot={<PulseDot fill={fill} />}
          style={{ filter: `drop-shadow(0 2px 8px rgba(31,98,142,0.18))` }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default DashboardChart;
