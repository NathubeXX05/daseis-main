import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';
import { DividendYearPoint } from '../actions';
import { HeartHandshake, TrendingUp, CalendarCheck, ShieldCheck } from 'lucide-react';
import clsx from 'clsx';

interface DividendHistoryChartProps {
  data: DividendYearPoint[];
  currency?: string;
  height?: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  currency?: string;
}

function CustomTooltip({ active, payload, label, currency = '€' }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const item = payload[0].payload as DividendYearPoint;
    const growth = item.growth_pct;
    const isUp = growth !== undefined ? growth >= 0 : true;

    return (
      <div className="bg-panel px-3.5 py-2.5 rounded-none border border-white/10 text-xs font-sans min-w-[170px] text-paper">
        <div className="flex items-center justify-between text-slate-600 font-mono text-xs mb-1">
          <span>Exercice</span>
          <span className="font-bold text-paper">{label}</span>
        </div>
        
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-slate-600 text-xs">Dividende versé :</span>
          <span className="text-base font-semibold font-mono text-emerald-600">
            {item.payout.toFixed(2)} {currency}
          </span>
        </div>

        {growth !== undefined && growth !== 0 && (
          <div className="flex items-center justify-between text-xs font-mono mt-1 pt-1 border-t border-white/[0.08]">
            <span className="text-slate-600">Croissance :</span>
            <span className={clsx('font-bold', isUp ? 'text-emerald-600' : 'text-rose-600')}>
              {isUp ? '+' : ''}{growth.toFixed(1)}%
            </span>
          </div>
        )}

        {item.charity_share && item.charity_share > 0 ? (
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded-none mt-1.5 border border-emerald-500/30 font-mono">
            <HeartHandshake className="w-3 h-3 text-emerald-600 flex-shrink-0" />
            <span>Partage chrétien : <strong>{item.charity_share.toFixed(2)} {currency}</strong> reversés</span>
          </div>
        ) : null}
      </div>
    );
  }
  return null;
}

export function DividendHistoryChart({
  data,
  currency = '€',
  height = 180
}: DividendHistoryChartProps) {
  if (!data || data.length === 0) return null;

  const payouts = data.map(d => d.payout);
  const minPayout = Math.min(...payouts);
  const maxPayout = Math.max(...payouts);
  const domainMax = Math.ceil((maxPayout * 1.15) * 10) / 10;

  // Consistency metrics
  const yearsCount = data.length;
  const firstPayout = data[0].payout;
  const lastPayout = data[data.length - 1].payout;
  const totalGrowthPct = firstPayout > 0 ? ((lastPayout - firstPayout) / firstPayout) * 100 : 0;
  
  // Count consecutive years without drop
  let uninterruptedYears = 1;
  for (let i = data.length - 1; i > 0; i--) {
    if (data[i].payout >= data[i - 1].payout) {
      uninterruptedYears++;
    } else {
      break;
    }
  }

  const averagePayout = (payouts.reduce((a, b) => a + b, 0) / payouts.length).toFixed(2);

  return (
    <div className="space-y-3.5">
      {/* Chart container */}
      <div className="w-full select-none" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 8, left: -20, bottom: 0 }}
          >
            <XAxis
              dataKey="year"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#64748b', fontFamily: 'monospace', fontWeight: 600 }}
            />

            <YAxis
              domain={[0, domainMax]}
              orientation="right"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#94a3b8', fontFamily: 'monospace' }}
              tickFormatter={(val: number) => val.toFixed(1)}
              width={34}
            />

            <Tooltip
              content={<CustomTooltip currency={currency} />}
              cursor={{ fill: 'rgba(241, 245, 249, 0.6)' }}
            />

            <Bar
              dataKey="payout"
              radius={[6, 6, 0, 0]}
              maxBarSize={42}
            >
              {data.map((entry, index) => {
                const isLatest = index === data.length - 1;
                const isNegativeGrowth = entry.growth_pct !== undefined && entry.growth_pct < 0;
                
                let fillColor = '#1f6b4f'; // Emerald default
                if (isNegativeGrowth) fillColor = '#a4332f'; // Rose on cut
                else if (isLatest) fillColor = '#17563f'; // Deep emerald for latest year

                return (
                  <Cell
                    key={`cell-${entry.year}`}
                    fill={fillColor}
                    fillOpacity={isLatest ? 1 : 0.85}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Consistency & Regularity KPIs */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/70 text-center">
        <div className="p-2 rounded-none bg-slate-950 border border-slate-800/80">
          <span className="text-xs text-slate-600 font-medium block">Croissance Totale</span>
          <span className={clsx('text-xs font-mono font-bold', totalGrowthPct >= 0 ? 'text-emerald-300' : 'text-rose-400')}>
            {totalGrowthPct >= 0 ? '+' : ''}{totalGrowthPct.toFixed(1)}%
          </span>
          <span className="text-xs text-slate-600 block mt-0.5">sur {yearsCount} ans</span>
        </div>

        <div className="p-2 rounded-none bg-slate-950 border border-slate-800/80">
          <span className="text-xs text-slate-600 font-medium block">Régularité</span>
          <span className="text-xs font-mono font-bold text-slate-100">
            {uninterruptedYears} {uninterruptedYears > 1 ? 'ans' : 'an'}
          </span>
          <span className="text-xs text-emerald-300 font-semibold block mt-0.5">
            {uninterruptedYears === yearsCount ? '✓ Zéro baisse' : 'Sans réduction'}
          </span>
        </div>

        <div className="p-2 rounded-none bg-slate-950 border border-slate-800/80">
          <span className="text-xs text-slate-600 font-medium block">Moyenne Versée</span>
          <span className="text-xs font-mono font-bold text-slate-100">
            {averagePayout} {currency}
          </span>
          <span className="text-xs text-slate-600 block mt-0.5">par part / an</span>
        </div>
      </div>
    </div>
  );
}
