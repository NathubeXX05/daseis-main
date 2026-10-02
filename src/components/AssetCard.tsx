import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import { Asset } from '../actions';
import { PriceAlert } from '../types/alerts';

interface AssetCardProps {
  asset: Asset;
  onSelect: (asset: Asset) => void;
  onTrade?: (asset: Asset) => void;
  onReallocate?: (asset: Asset) => void;
  onRemove?: (isin: string) => void;
  alerts?: PriceAlert[];
  onOpenAlertModal?: (asset: Asset) => void;
}

// Même grille que l'en-tête de colonnes dans App.tsx
export const PORTFOLIO_GRID =
  'md:grid md:grid-cols-[minmax(0,2.4fr)_1.1fr_0.7fr_0.8fr_1.1fr_12rem] md:items-center md:gap-4';

const STATUS = {
  compatible: { label: 'Compatible', text: 'text-emerald-600' },
  warning: { label: 'À examiner', text: 'text-amber-600' },
  non_compatible: { label: 'Incompatible', text: 'text-rose-600' }
} as const;

export function AssetCard({
  asset,
  onSelect,
  onTrade,
  onReallocate,
  onRemove,
  alerts = [],
  onOpenAlertModal
}: AssetCardProps) {
  const status = STATUS[asset.status];
  const isPositive = asset.change_1d_pct >= 0;
  const assetAlerts = alerts.filter(a => a.isin === asset.isin);
  const triggered = assetAlerts.find(a => a.triggered);
  const active = assetAlerts.find(a => !a.triggered);
  const stop = (fn?: () => void) => (e: React.MouseEvent) => {
    e.stopPropagation();
    fn?.();
  };

  return (
    // L'animation ne sert qu'à montrer qu'une ligne apparaît ou disparaît.
    <motion.li
      layout="position"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      transition={{ duration: 0.2 }}
      onClick={() => onSelect(asset)}
      className={clsx(
        'list-none border-b border-gray-200 py-4 px-1 cursor-pointer hover:bg-gray-50 space-y-2 md:space-y-0 transition-colors',
        PORTFOLIO_GRID
      )}
    >
      {triggered && (
        <p className="md:col-span-full text-sm text-amber-600 bg-amber-50 p-2 rounded">
          Seuil atteint : {triggered.direction === 'above' ? '≥' : '≤'}{' '}
          {triggered.targetPrice.toFixed(2)} {asset.currency}.{' '}
          <button type="button" className="underline cursor-pointer font-semibold" onClick={stop(() => onOpenAlertModal?.(asset))}>
            Gérer l'alerte
          </button>
        </p>
      )}

      <div className="min-w-0">
        <h3 className="font-medium text-slate-900 truncate">{asset.name}</h3>
        <p className="text-xs text-slate-500 truncate">
          {asset.ticker} · {asset.isin} · {asset.asset_type}
        </p>
      </div>

      <div className="tabular-nums text-sm">
        <span className="text-slate-800">{asset.current_price.toFixed(2)} {asset.currency}</span>{' '}
        <span className={clsx('text-xs', isPositive ? 'text-emerald-600' : 'text-rose-600')}>
          {isPositive ? '+' : ''}{asset.change_1d_pct.toFixed(2)} %
        </span>
      </div>

      <div className="tabular-nums text-sm text-slate-800">
        <span className="md:hidden text-xs text-slate-500">Score DSE </span>
        {asset.catholic.dse_score}
        <span className="text-slate-500">/100</span>
      </div>

      <div className="tabular-nums text-sm text-slate-800">
        <span className="md:hidden text-xs text-slate-500">Dividende </span>
        {asset.key_info.dividend_yield_pct.toFixed(1)} %
      </div>

      <div className={clsx('inline-flex items-center gap-2 text-sm font-medium', status.text)}>
        <span className="w-2 h-2 rounded-full bg-current" />
        {status.label}
      </div>

      <div className="flex items-center gap-2 md:justify-end">
        {onTrade && (
          <button
            onClick={stop(() => onTrade(asset))}
            className="px-3 py-1.5 bg-accent hover:bg-accent-hover text-on-accent text-xs font-medium rounded-md cursor-pointer shadow-sm"
          >
            Négocier
          </button>
        )}
        {asset.status !== 'compatible' && onReallocate && (
          <button
            onClick={stop(() => onReallocate(asset))}
            className="px-2 py-1.5 text-xs text-slate-700 underline underline-offset-4 cursor-pointer hover:text-blue-600"
            title="Remplacer par une alternative compatible"
          >
            Réallouer
          </button>
        )}
        {onOpenAlertModal && (
          <button
            type="button"
            onClick={stop(() => onOpenAlertModal(asset))}
            className={clsx('p-1.5 cursor-pointer transition-colors', active ? 'text-blue-600' : 'text-slate-400 hover:text-blue-600')}
            title={active ? `Alerte : ${active.direction === 'above' ? '≥' : '≤'} ${active.targetPrice.toFixed(2)} ${asset.currency}` : 'Créer une alerte de cours'}
            aria-label="Alerte de cours"
          >
            <Bell className="w-4 h-4" />
          </button>
        )}
        {onRemove && (
          <button
            type="button"
            onClick={stop(() => onRemove(asset.isin))}
            className="p-1.5 text-slate-400 hover:text-rose-600 cursor-pointer transition-colors"
            title={`Retirer ${asset.name}`}
            aria-label={`Retirer ${asset.name}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.li>
  );
}
