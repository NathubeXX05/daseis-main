import React, { useState } from 'react';
import { Drawer } from 'vaul';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {
  Asset,
  ReturnPeriods,
  ALL_NEWS,
  AssetNews
} from '../actions';
import { AssetChart } from './AssetChart';
import { DividendHistoryChart } from './DividendHistoryChart';
import {
  Clock,
  Globe,
  ShieldCheck,
  AlertTriangle,
  Leaf,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Layers,
  Newspaper,
  Info,
  X,
  HeartHandshake,
  Shield,
  Cross,
  Coins,
  HandCoins,
  BarChart3,
  Bell,
  ArrowUpRight
} from 'lucide-react';
import clsx from 'clsx';

interface AssetDetailDrawerProps {
  asset: Asset | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTrade?: (asset: Asset) => void;
  onRemove?: (isin: string) => void;
  onOpenAlertModal?: (asset: Asset) => void;
}

type TabType = 'overview' | 'catholic' | 'holdings' | 'news';

const drawerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.04
    }
  }
};

const drawerItemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 24,
      stiffness: 280
    }
  }
};

const tabContentVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      staggerChildren: 0.05,
      delayChildren: 0.02
    }
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: { duration: 0.12 }
  }
};

const statCardVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 22,
      stiffness: 300
    }
  }
};

export function AssetDetailDrawer({
  asset,
  open,
  onOpenChange,
  onTrade,
  onRemove,
  onOpenAlertModal
}: AssetDetailDrawerProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<keyof ReturnPeriods>('1m');
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  if (!asset) return null;

  const currentReturn = asset.returns[selectedPeriod];
  const isPositiveReturn = currentReturn >= 0;
  const chartPoints = asset.chart_data[selectedPeriod];

  const relatedNews: AssetNews[] = ALL_NEWS.filter(n => n.isin === asset.isin);

  const periods: { id: keyof ReturnPeriods; label: string }[] = [
    { id: '1j', label: '1J' },
    { id: '1sem', label: '1S' },
    { id: '1m', label: '1M' },
    { id: '3m', label: '3M' },
    { id: '6m', label: '6M' },
    { id: 'ytd', label: 'YTD' },
    { id: '1an', label: '1AN' }
  ];

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/80 z-50 transition-opacity" />
        <Drawer.Content className="bg-panel border-t border-white/10 text-slate-100 flex flex-col h-[92vh] fixed bottom-0 left-0 right-0 z-50 focus:outline-none rounded-none">
          {/* Header Bar */}
          <div className="px-6 py-4 border-b border-white/[0.08] flex items-start justify-between flex-shrink-0">
            <div>
              <div className="flex items-center gap-2 mb-1.5 text-xs">
                <span className="font-mono font-bold px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-xs rounded-none">
                  {asset.ticker}
                </span>
                <span className="font-mono text-slate-400">
                  {asset.isin}
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-slate-400 font-medium">
                  {asset.asset_type}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-white leading-tight">
                {asset.name}
              </h2>
            </div>
            
            <div className="flex items-center gap-2">
              {onTrade && (
                <button
                  type="button"
                  onClick={() => {
                    onTrade(asset);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-accent hover:bg-accent-hover text-on-accent font-mono font-bold text-xs transition-all cursor-pointer rounded-none"
                  title="Négocier cet actif (Ticket d'ordre Broker)"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>Négocier</span>
                </button>
              )}

              {onOpenAlertModal && (
                <button
                  type="button"
                  onClick={() => {
                    onOpenChange(false);
                    onOpenAlertModal(asset);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold transition-all cursor-pointer rounded-none"
                  title="Définir une alerte de seuil de cours"
                >
                  <Bell className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">Alerte de seuil</span>
                </button>
              )}

              <button
                onClick={() => onOpenChange(false)}
                className="p-2 text-slate-400 hover:text-white bg-white/[0.06] hover:bg-white/[0.12] transition-colors cursor-pointer rounded-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Container with Staggered Entrance Animations */}
          <motion.div
            variants={drawerContainerVariants}
            initial="hidden"
            animate="visible"
            className="flex-1 overflow-y-auto px-6 py-5 space-y-6"
          >
            {/* 1. Live Price & Historical Price Chart Bar */}
            <motion.div
              variants={drawerItemVariants}
              className="p-6 bg-panel border border-white/[0.08] rounded-none"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                {/* Price block */}
                <div>
                  <div className="text-3xl sm:text-4xl font-semibold tracking-tight font-mono text-white flex items-baseline gap-2.5">
                    {asset.current_price.toFixed(2)} {asset.currency}
                    <span
                      className={clsx(
                        'text-xs font-semibold px-2 py-0.5 font-mono rounded-none',
                        asset.change_1d_pct >= 0
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                          : 'bg-rose-950 text-rose-300 border border-rose-500/30'
                      )}
                    >
                      {asset.change_1d_pct >= 0 ? '+' : ''}
                      {asset.change_1d_pct.toFixed(2)}% ({asset.change_1d_val >= 0 ? '+' : ''}{asset.change_1d_val.toFixed(2)}{asset.currency})
                    </span>
                  </div>
                </div>

                {/* Market Status & Hours */}
                <div className="flex items-center gap-2 bg-raised px-3.5 py-1.5 border border-white/[0.08] text-xs rounded-none font-mono">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={clsx(
                        'w-2 h-2',
                        asset.market_hours.is_open ? 'bg-emerald-400' : 'bg-amber-400'
                      )}
                    />
                    <span className="font-semibold text-slate-200">
                      {asset.market_hours.is_open ? 'Marché Ouvert' : 'Marché Fermé'}
                    </span>
                  </div>
                  <span className="text-slate-600">|</span>
                  <span className="text-slate-400 flex items-center gap-1 font-medium text-xs">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    {asset.market_hours.exchange} ({asset.market_hours.open}-{asset.market_hours.close})
                  </span>
                </div>
              </div>

              {/* Sparkline chart with entrance */}
              <div className="mt-2 pt-3 border-t border-white/[0.06]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="text-slate-400">Rendement {selectedPeriod.toUpperCase()} :</span>
                    <span
                      className={clsx(
                        'font-bold font-mono',
                        isPositiveReturn ? 'text-emerald-400' : 'text-rose-400'
                      )}
                    >
                      {isPositiveReturn ? '+' : ''}
                      {currentReturn.toFixed(2)}%
                    </span>
                  </div>
                </div>

                <AssetChart
                  data={chartPoints}
                  currency={asset.currency}
                  isPositive={isPositiveReturn}
                  height={200}
                />
              </div>

              {/* Periods Buttons */}
              <div className="flex items-center justify-between gap-1 mt-4 pt-3 border-t border-white/[0.06] bg-panel p-1 border border-white/[0.06] rounded-none">
                {periods.map(p => {
                  const isActive = selectedPeriod === p.id;
                  const val = asset.returns[p.id];
                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPeriod(p.id)}
                      className={clsx(
                        'flex-1 py-1.5 px-2 text-xs font-semibold transition-all relative cursor-pointer rounded-none',
                        isActive
                          ? 'bg-white text-slate-950 font-bold'
                          : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                      )}
                    >
                      <div>{p.label}</div>
                      <div
                        className={clsx(
                          'text-xs font-mono leading-none mt-0.5',
                          isActive
                            ? 'text-emerald-700 font-bold'
                            : val >= 0
                            ? 'text-emerald-400 font-bold'
                            : 'text-rose-400 font-bold'
                        )}
                      >
                        {val >= 0 ? '+' : ''}{val}%
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* 2. Navigation Tabs */}
            <motion.div variants={drawerItemVariants} className="flex border-b border-white/[0.08] gap-6 text-sm">
              {[
                { id: 'overview', label: 'Clés & Risques', icon: Info },
                { id: 'catholic', label: 'Doctrine Sociale & Bioéthique', icon: HeartHandshake },
                { id: 'holdings', label: 'Holdings', icon: Layers },
                { id: 'news', label: `Actualités (${relatedNews.length})`, icon: Newspaper }
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={clsx(
                      'pb-3 font-medium flex items-center gap-1.5 transition-colors relative cursor-pointer rounded-none',
                      isActive ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeTabUnderline"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400"
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </button>
                );
              })}
            </motion.div>

            {/* 3. Staggered Tab Content Container */}
            <AnimatePresence mode="wait">
              {/* TAB CONTENT 1: OVERVIEW & RISQUES */}
              {activeTab === 'overview' && (
                <motion.div
                  key="tab-overview"
                  variants={tabContentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  {/* Risk Profile & SRI */}
                  <motion.div variants={drawerItemVariants}>
                    <h3 className="text-xs font-mono font-bold text-slate-400 mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      Profil de Risque Réglementaire & Rendement
                    </h3>
                    
                    {/* SRI Risk Bar (1 to 7) */}
                    <div className="p-5 bg-panel border border-white/[0.08] mb-4 rounded-none">
                      <div className="flex items-center justify-between mb-2 text-sm">
                        <span className="text-slate-300 font-medium">Indicateur Synthétique de Risque (SRI / DICI)</span>
                        <span className="font-bold text-white font-mono">Niveau {asset.risk.sri_level} / 7</span>
                      </div>
                      <div className="grid grid-cols-7 gap-1.5 h-2.5">
                        {[1, 2, 3, 4, 5, 6, 7].map(lvl => (
                          <div
                            key={lvl}
                            className={clsx(
                              'transition-all rounded-none',
                              lvl <= asset.risk.sri_level
                                ? lvl <= 2
                                  ? 'bg-emerald-400'
                                  : lvl <= 4
                                  ? 'bg-amber-400'
                                  : 'bg-rose-500'
                                : 'bg-raised'
                            )}
                          />
                        ))}
                      </div>
                      <div className="flex justify-between text-xs text-slate-500 mt-1.5 font-mono">
                        <span>Risque modéré (1)</span>
                        <span>Risque élevé (7)</span>
                      </div>
                    </div>

                    {/* Staggered KPIs Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <motion.div variants={statCardVariants} className="p-4 bg-raised border border-white/[0.06] rounded-none">
                        <div className="text-xs text-slate-400 mb-1 font-mono">Volatilité 1A</div>
                        <div className="text-lg font-bold text-white font-mono">{asset.risk.volatility_pct}%</div>
                      </motion.div>
                      <motion.div variants={statCardVariants} className="p-4 bg-raised border border-white/[0.06] rounded-none">
                        <div className="text-xs text-slate-400 mb-1 font-mono">Sharpe</div>
                        <div className="text-lg font-bold text-emerald-400 font-mono">{asset.risk.sharpe_ratio}</div>
                      </motion.div>
                      <motion.div variants={statCardVariants} className="p-4 bg-raised border border-white/[0.06] rounded-none">
                        <div className="text-xs text-slate-400 mb-1 font-mono">Max Drawdown</div>
                        <div className="text-lg font-bold text-rose-400 font-mono">{asset.risk.max_drawdown_pct}%</div>
                      </motion.div>
                      <motion.div variants={statCardVariants} className="p-4 bg-raised border border-white/[0.06] rounded-none">
                        <div className="text-xs text-slate-400 mb-1 font-mono">Bêta</div>
                        <div className="text-lg font-bold text-slate-300 font-mono">{asset.risk.beta}</div>
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Section Rendement du Dividende & Revenus */}
                  <motion.div
                    variants={drawerItemVariants}
                    className="p-6 bg-panel border border-white/10 rounded-none"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 font-mono">
                        <Coins className="w-4 h-4 text-emerald-400" />
                        Rendement du Dividende & Revenus Long Terme
                      </h3>
                      <span className="text-xs font-semibold text-emerald-300 bg-emerald-950 px-2 py-0.5 border border-emerald-500/30 rounded-none font-mono">
                        PRISME CATHOLIQUE
                      </span>
                    </div>

                    {/* Staggered 3 Dividend Metrics Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                      <motion.div variants={statCardVariants} className="p-4 bg-raised border border-white/[0.06] rounded-none">
                        <div className="text-xs text-slate-400 mb-0.5 font-mono">Rendement Dividende</div>
                        <div className="text-2xl font-semibold font-mono text-emerald-400">
                          {asset.key_info.dividend_yield_pct.toFixed(2)}%
                          <span className="text-xs font-sans font-medium text-slate-400 ml-1">/ an</span>
                        </div>
                        <span className="text-xs text-slate-400 block mt-1">
                          {asset.key_info.dividend_yield_pct >= 3.0 ? 'Rendement attractif et soutenable' : 'Rendement modéré orienté croissance'}
                        </span>
                      </motion.div>

                      <motion.div variants={statCardVariants} className="p-4 bg-raised border border-white/[0.06] rounded-none">
                        <div className="text-xs text-slate-400 mb-0.5 font-mono">Fréquence</div>
                        <div className="text-sm font-bold text-white mt-1.5 leading-snug">
                          {asset.key_info.payment_frequency}
                        </div>
                        <span className="text-xs text-slate-400 block mt-1">
                          Calendrier des flux de trésorerie
                        </span>
                      </motion.div>

                      <motion.div variants={statCardVariants} className="p-4 bg-raised border border-white/[0.06] rounded-none">
                        <div className="text-xs text-slate-400 mb-0.5 font-mono">Payout Ratio</div>
                        <div className="text-2xl font-semibold font-mono text-slate-200">
                          {asset.key_info.payout_ratio_pct}%
                        </div>
                        <span className="text-xs text-emerald-400 font-semibold block mt-0.5 font-mono">
                          {asset.key_info.payout_ratio_pct <= 60 ? '✓ Ratio vertueux (réinvestissement)' : 'Distribution élevée'}
                        </span>
                      </motion.div>
                    </div>

                    {/* Analyse Spirituelle & Éthique du Revenu */}
                    <div className="p-4 bg-raised border border-white/[0.08] text-xs text-slate-300 leading-relaxed flex items-start gap-3 mb-5 rounded-none">
                      <HandCoins className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-white block mb-1">
                          Évaluation selon la Doctrine Sociale de l'Église (DSE) :
                        </span>
                        <p className="text-slate-400">
                          {asset.key_info.catholic_income_note}
                        </p>
                      </div>
                    </div>

                    {/* Historique des Dividendes Annuels */}
                    <motion.div variants={drawerItemVariants} className="pt-4 border-t border-white/[0.08]">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1.5">
                          <BarChart3 className="w-4 h-4 text-emerald-400" />
                          <h4 className="text-xs font-bold text-white font-mono">
                            Historique des Versements Annuels
                          </h4>
                        </div>
                        <span className="text-xs font-mono text-slate-400">
                          Par part ({asset.currency})
                        </span>
                      </div>

                      <DividendHistoryChart
                        data={asset.dividend_history}
                        currency={asset.currency}
                        height={180}
                      />
                    </motion.div>
                  </motion.div>

                  {/* Informations Clés */}
                  <motion.div variants={drawerItemVariants}>
                    <h3 className="text-xs font-mono font-bold text-slate-400 mb-3 flex items-center gap-2">
                      <Info className="w-4 h-4 text-emerald-400" />
                      Informations Clés de l'Actif
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <motion.div variants={statCardVariants} className="p-4 bg-raised border border-white/[0.06] flex justify-between rounded-none">
                        <span className="text-slate-400 font-mono text-xs">Encours Total (AUM)</span>
                        <span className="font-semibold text-white font-mono">{asset.key_info.aum}</span>
                      </motion.div>
                      <motion.div variants={statCardVariants} className="p-4 bg-raised border border-white/[0.06] flex justify-between rounded-none">
                        <span className="text-slate-400 font-mono text-xs">Frais de Gestion (TER)</span>
                        <span className="font-semibold text-white font-mono">{asset.key_info.ter_pct}% / an</span>
                      </motion.div>
                      <motion.div variants={statCardVariants} className="p-4 bg-raised border border-white/[0.06] flex justify-between rounded-none">
                        <span className="text-slate-400 font-mono text-xs">Domiciliation</span>
                        <span className="font-semibold text-white">{asset.key_info.domicile}</span>
                      </motion.div>
                      <motion.div variants={statCardVariants} className="p-4 bg-raised border border-white/[0.06] flex justify-between rounded-none">
                        <span className="text-slate-400 font-mono text-xs">Création</span>
                        <span className="font-semibold text-white">{asset.key_info.inception}</span>
                      </motion.div>
                      <motion.div variants={statCardVariants} className="p-4 bg-raised border border-white/[0.06] flex justify-between sm:col-span-2 rounded-none">
                        <span className="text-slate-400 font-mono text-xs">Politique de Partage / Distribution</span>
                        <span className="font-semibold text-white text-right">{asset.key_info.distribution}</span>
                      </motion.div>
                      <motion.div variants={statCardVariants} className="p-4 bg-raised border border-white/[0.06] flex justify-between sm:col-span-2 rounded-none">
                        <span className="text-slate-400 font-mono text-xs">Indice de Référence</span>
                        <span className="font-semibold text-white text-xs text-right truncate max-w-[240px] font-mono">{asset.key_info.benchmark}</span>
                      </motion.div>
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {/* TAB CONTENT 2: DOCTRINE SOCIALE & BIOÉTHIQUE */}
              {activeTab === 'catholic' && (
                <motion.div
                  key="tab-catholic"
                  variants={tabContentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  {/* Score DSE Header */}
                  <motion.div
                    variants={drawerItemVariants}
                    className="p-6 bg-panel border border-emerald-500/30 flex items-center justify-between rounded-none"
                  >
                    <div>
                      <span className="text-xs font-bold text-emerald-400 block mb-1 font-mono">
                        CONFORMITÉ MAGISTÈRE & DOCTRINE SOCIALE
                      </span>
                      <h4 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white flex items-center gap-2 font-mono">
                        Score DSE : {asset.catholic.dse_score} / 100
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Directives :{' '}
                        <span className="font-semibold text-slate-200">
                          {asset.catholic.episcopal_guidelines}
                        </span>
                      </p>
                    </div>

                    <div className="w-16 h-16 bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-semibold text-2xl font-mono rounded-none">
                      {asset.catholic.dse_score}
                    </div>
                  </motion.div>

                  {/* 4 Piliers Catholiques Fondamentaux */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Bioéthique & Respect de la Vie */}
                    <motion.div variants={statCardVariants} className="p-5 bg-raised border border-white/[0.08] rounded-none">
                      <div className="flex items-center gap-2 mb-2">
                        <ShieldCheck className={clsx('w-5 h-5', asset.catholic.bioethics_compliant ? 'text-emerald-400' : 'text-amber-400')} />
                        <h5 className="font-bold text-sm text-white">Respect de la Vie & Bioéthique</h5>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {asset.catholic.bioethics_compliant
                          ? 'Exclusion stricte de l\'avortement, de la recherche sur embryons humains et des armes de destruction massive.'
                          : 'Aucun filtre d\'exclusion bioéthique documenté pour ce véhicule d\'investissement.'}
                      </p>
                    </motion.div>

                    {/* Laudato Si' & Écologie Intégrale */}
                    <motion.div variants={statCardVariants} className="p-5 bg-raised border border-white/[0.08] rounded-none">
                      <div className="flex items-center gap-2 mb-2">
                        <Leaf className="w-5 h-5 text-emerald-400" />
                        <h5 className="font-bold text-sm text-white">Encyclique Laudato Si'</h5>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Alignement : <span className="font-bold text-white">{asset.catholic.laudato_si_alignment}</span>. Sauvegarde de la maison commune et renoncement aux forages fossiles destructeurs.
                      </p>
                    </motion.div>

                    {/* Dignité Humaine & Travail */}
                    <motion.div variants={statCardVariants} className="p-5 bg-raised border border-white/[0.08] rounded-none">
                      <div className="flex items-center gap-2 mb-2">
                        <HeartHandshake className="w-5 h-5 text-blue-400" />
                        <h5 className="font-bold text-sm text-white">Dignité Humaine & Justice</h5>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Score de justice sociale : <span className="font-bold text-white">{asset.catholic.human_dignity_score}/100</span>. Protection des travailleurs, salaires justes et lutte contre le travail des mineurs.
                      </p>
                    </motion.div>

                    {/* Exclusions Morales Catholiques */}
                    <motion.div variants={statCardVariants} className="p-5 bg-raised border border-white/[0.08] rounded-none">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-5 h-5 text-purple-400" />
                        <h5 className="font-bold text-sm text-white">Armement & Vices</h5>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Armes controversées : <span className="font-semibold text-white">{asset.catholic.weapons_excluded ? 'Exclues ✓' : 'Non filtrées'}</span>.
                        <br />
                        Jeux de hasard & tabac : <span className="font-semibold text-white">{asset.catholic.vices_excluded ? 'Exclus ✓' : 'Présents'}</span>.
                      </p>
                    </motion.div>
                  </div>

                  {/* Labels et Agréments */}
                  <motion.div variants={drawerItemVariants}>
                    <span className="text-xs text-slate-400 block mb-2 font-mono">
                      Labels et signatures
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {asset.catholic.labels.map(lbl => (
                        <span
                          key={lbl}
                          className="px-3 py-1 text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-500/30 rounded-none font-mono"
                        >
                          ✓ {lbl}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {/* TAB CONTENT 3: HOLDINGS */}
              {activeTab === 'holdings' && (
                <motion.div
                  key="tab-holdings"
                  variants={tabContentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-3"
                >
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span>Principales entreprises détenues en portefeuille</span>
                    <span>Pondération</span>
                  </div>

                  <div className="space-y-2.5">
                    {asset.holdings.map((h, i) => (
                      <motion.div
                        key={h.ticker + i}
                        variants={statCardVariants}
                        className="p-4 bg-raised border border-white/[0.08] hover:border-white/[0.15] transition-colors rounded-none"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-emerald-300 bg-emerald-950 px-2 py-0.5 border border-emerald-500/30 rounded-none">
                              {h.ticker}
                            </span>
                            <span className="font-semibold text-white text-sm">{h.name}</span>
                          </div>
                          <span className="font-mono font-bold text-white text-sm">
                            {h.weight_pct}%
                          </span>
                        </div>

                        {/* Weight progress bar */}
                        <div className="w-full bg-raised h-1.5 mb-2 overflow-hidden rounded-none">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(h.weight_pct / 10) * 100}%` }}
                            transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.04 }}
                            className="bg-emerald-400 h-1.5 rounded-none"
                          />
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span className="bg-raised px-2 py-0.5 text-slate-300 border border-white/[0.06] text-xs font-medium rounded-none font-mono">
                            {h.sector}
                          </span>
                          <span className="text-slate-400 italic text-right max-w-[240px] truncate">
                            {h.impact}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* TAB CONTENT 4: NEWS */}
              {activeTab === 'news' && (
                <motion.div
                  key="tab-news"
                  variants={tabContentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-3"
                >
                  {relatedNews.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 text-sm">
                      Aucune actualité récente répertoriée pour cet actif.
                    </div>
                  ) : (
                    relatedNews.map(n => (
                      <motion.a
                        key={n.id}
                        variants={statCardVariants}
                        href={n.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-4 bg-raised border border-white/[0.08] hover:border-white/30 transition-all group rounded-none"
                      >
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="font-semibold text-slate-300">{n.source}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500 font-mono">{n.published_at}</span>
                            <span
                              className={clsx(
                                'text-xs font-bold px-2 py-0.5  font-mono rounded-none',
                                n.sentiment === 'positive'
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                                  : n.sentiment === 'warning'
                                  ? 'bg-rose-950 text-rose-300 border border-rose-500/30'
                                  : 'bg-slate-800 text-slate-300'
                              )}
                            >
                              {n.category}
                            </span>
                          </div>
                        </div>

                        <h4 className="font-semibold text-white text-sm group-hover:text-emerald-300 transition-colors mb-1.5 leading-snug">
                          {n.title}
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {n.summary}
                        </p>

                        <div className="mt-2 flex items-center gap-1 text-xs text-emerald-400 font-medium">
                          Consulter l'article complet <ExternalLink className="w-3 h-3" />
                        </div>
                      </motion.a>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Remove from portfolio button if needed */}
            {onRemove && (
              <motion.div variants={drawerItemVariants} className="pt-4 border-t border-white/[0.08]">
                <button
                  onClick={() => {
                    onRemove(asset.isin);
                    onOpenChange(false);
                  }}
                  className="w-full py-3 px-4 text-xs font-semibold text-rose-400 hover:bg-rose-950/40 border border-rose-500/30 transition-all active:scale-[0.98] cursor-pointer rounded-none font-mono"
                >
                  Retirer cet actif de mon portefeuille
                </button>
              </motion.div>
            )}
          </motion.div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
