import { FC } from 'react';
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
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

const DashboardChart: FC<DashboardChartProps> = ({
  data,
  dataKey,
  height = '90%',
  width = '100%',
  type = 'natural',
  vertical = false,
  strokeWidth = 2,
  fill = '#e5e7eb',
}) => {
  return (
    <ResponsiveContainer height={height} width={width}>
      <ComposedChart
        compact
        data={data}
        style={{ borderRadius: '1rem', overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={fill} stopOpacity={0.8} />
            <stop offset="100%" stopColor="#f1f5f9" stopOpacity={0.3} />
          </linearGradient>
        </defs>
        <Area
          connectNulls
          dataKey="value"
          fill="url(#chartGradient)"
          stackId={1}
          fillOpacity={1}
          strokeWidth={strokeWidth}
          stroke="#60a5fa"
          type={type || 'natural'}
          style={{ filter: 'drop-shadow(0 4px 16px rgba(96,165,250,0.10))' }}
        />
        <XAxis
          dataKey={dataKey}
          tick={{ fontSize: 12, fill: '#6b7280' }}
          axisLine={false}
          tickLine={false}
        />
        <Legend
          wrapperStyle={{ paddingTop: 8, fontSize: 13, color: '#374151' }}
          iconType="circle"
        />
        <YAxis
          allowDataOverflow
          tickSize={10}
          tickMargin={20}
          tick={{ fontSize: 12, fill: '#6b7280' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            background: 'rgba(255,255,255,0.95)',
            borderRadius: '1rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            border: 'none',
            color: '#222',
            fontSize: 13,
          }}
          itemStyle={{ color: '#60a5fa' }}
          cursor={{ fill: 'rgba(96,165,250,0.08)' }}
        />
        <CartesianGrid
          strokeDasharray={'5 5'}
          y={0}
          vertical={vertical}
          stroke="#e5e7eb"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default DashboardChart;
