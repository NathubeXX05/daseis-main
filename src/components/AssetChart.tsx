import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import { PricePoint } from '../actions';

interface AssetChartProps {
  data: PricePoint[];
  currency?: string;
  isPositive?: boolean;
  height?: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  currency?: string;
  basePrice?: number;
}

function CustomTooltip({ active, payload, label, currency = '€', basePrice }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const currentPrice = payload[0].value as number;
    const diff = basePrice ? currentPrice - basePrice : 0;
    const diffPct = basePrice ? (diff / basePrice) * 100 : 0;
    const isUp = diff >= 0;

    return (
      <div className="bg-panel px-3.5 py-2.5 rounded-none border border-white/10 text-xs font-sans text-white">
        <div className="text-slate-400 font-mono text-xs mb-1">{label}</div>
        <div className="text-base font-semibold font-mono text-white leading-tight">
          {currentPrice.toFixed(2)} {currency}
        </div>
        {basePrice !== undefined && (
          <div className="flex items-center gap-1 font-mono text-xs font-semibold mt-1">
            <span className={isUp ? 'text-emerald-400' : 'text-rose-400'}>
              {isUp ? '+' : ''}{diff.toFixed(2)}{currency} ({isUp ? '+' : ''}{diffPct.toFixed(2)}%)
            </span>
          </div>
        )}
      </div>
    );
  }
  return null;
}

export function AssetChart({
  data,
  currency = '€',
  isPositive = true,
  height = 190
}: AssetChartProps) {
  if (!data || data.length === 0) return null;

  const prices = data.map(d => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const padding = (maxPrice - minPrice) * 0.1 || 1;
  const domainMin = Math.max(0, Math.floor((minPrice - padding) * 10) / 10);
  const domainMax = Math.ceil((maxPrice + padding) * 10) / 10;

  const strokeColor = isPositive ? '#1f6b4f' : '#a4332f';
  const gradientId = `emerald-chart-gradient-${isPositive ? 'pos' : 'neg'}`;
  const basePrice = data[0]?.price;

  return (
    <div className="w-full select-none" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 8, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={strokeColor} stopOpacity={0.24} />
              <stop offset="80%" stopColor={strokeColor} stopOpacity={0.02} />
              <stop offset="100%" stopColor={strokeColor} stopOpacity={0} />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: '#94a3b8', fontFamily: 'monospace' }}
            interval="preserveStartEnd"
            minTickGap={35}
          />

          <YAxis
            domain={[domainMin, domainMax]}
            orientation="right"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: '#94a3b8', fontFamily: 'monospace' }}
            tickFormatter={(val: number) => val.toFixed(1)}
            width={38}
          />

          <Tooltip
            content={<CustomTooltip currency={currency} basePrice={basePrice} />}
            cursor={{
              stroke: '#9aa3b2',
              strokeWidth: 1.5,
              strokeDasharray: '3 3'
            }}
          />

          <Area
            type="monotone"
            dataKey="price"
            stroke={strokeColor}
            strokeWidth={2.5}
            fill={`url(#${gradientId})`}
            activeDot={{
              r: 5,
              fill: strokeColor,
              stroke: '#ffffff',
              strokeWidth: 2.5
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
