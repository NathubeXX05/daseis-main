import React from 'react';

interface TickerItem {
  ticker: string;
  price: string;
  change: string;
}

// Cours de démonstration : à remplacer par une vraie source de données.
const INDICATIVE: TickerItem[] = [
  { ticker: 'AI', price: '170,52 €', change: '+1,12 %' },
  { ticker: 'SU', price: '242,80 €', change: '+2,30 %' },
  { ticker: 'SAN', price: '88,20 €', change: '+0,45 %' },
  { ticker: 'BN', price: '63,50 €', change: '+0,35 %' }
];

export function OndoTickerMarquee({ onSelectTicker }: { onSelectTicker?: (ticker: string) => void }) {
  return (
    <div className="w-full border-y border-white/10 py-3 flex flex-wrap items-baseline gap-x-8 gap-y-2 text-sm">
      <span className="text-xs text-slate-500">Cours indicatifs (démonstration)</span>
      {INDICATIVE.map(item => (
        <button
          key={item.ticker}
          type="button"
          onClick={() => onSelectTicker?.(item.ticker)}
          className="inline-flex items-baseline gap-2 tabular-nums text-slate-300 hover:text-white cursor-pointer"
        >
          <span className="font-medium text-white">{item.ticker}</span>
          <span>{item.price}</span>
          <span className="text-emerald-400 text-xs">{item.change}</span>
        </button>
      ))}
    </div>
  );
}
