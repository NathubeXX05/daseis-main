import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ShieldCheck,
  Leaf,
  AlertTriangle,
  X,
  Sparkles,
  TrendingUp,
  RefreshCw,
  CheckCircle2,
  HeartHandshake
} from 'lucide-react';
import { Asset, ASSETS_DATABASE } from '../actions';
import clsx from 'clsx';

interface ReallocationModalProps {
  open: boolean;
  onClose: () => void;
  targetAsset: Asset | null;
  onConfirmReallocation: (oldIsin: string, newIsin: string) => void;
}

export function ReallocationModal({
  open,
  onClose,
  targetAsset,
  onConfirmReallocation
}: ReallocationModalProps) {
  if (!open || !targetAsset) return null;

  let recommendedIsin = 'LU1861134382';
  if (targetAsset.isin === 'LU1861134382') {
    recommendedIsin = 'FR0010531553';
  } else if (targetAsset.isin === 'FR0000120271') {
    recommendedIsin = 'LU1861134382';
  } else if (targetAsset.isin === 'LU0123456789') {
    recommendedIsin = 'FR0010531553';
  }

  const [selectedReplacementIsin, setSelectedReplacementIsin] = useState<string>(recommendedIsin);
  const replacementAsset = ASSETS_DATABASE[selectedReplacementIsin];

  const dseGain = replacementAsset.catholic.dse_score - targetAsset.catholic.dse_score;
  const carbonSaved = Math.max(0, targetAsset.catholic.carbon_intensity_tco2e - replacementAsset.catholic.carbon_intensity_tco2e);

  const availableAlternatives = Object.values(ASSETS_DATABASE).filter(
    a => a.isin !== targetAsset.isin && a.status === 'compatible'
  );

  const handleApply = () => {
    onConfirmReallocation(targetAsset.isin, selectedReplacementIsin);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80"
        />

        {/* Modal content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 10 }}
          className="relative bg-panel border border-white/10 w-full max-w-xl max-h-[90vh] overflow-y-auto z-10 p-6 sm:p-7 font-sans text-slate-100 rounded-none"
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-white/[0.08]">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-950 border border-amber-500/30 text-amber-400 rounded-none">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold tracking-tight text-white">
                  Substitution Éthique en 1-Clic
                </h3>
                <p className="text-xs text-slate-400">
                  Purger les lignes non conformes et réallouer vers une alternative chrétienne
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white bg-white/[0.06] hover:bg-white/[0.12] transition-colors cursor-pointer rounded-none"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="py-4 space-y-4">
            {/* Actif Source (à remplacer) */}
            <div className="p-4 bg-rose-950/40 border border-rose-500/30 rounded-none">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-rose-300 flex items-center gap-1.5 font-mono">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  Ligne actuelle à purger
                </span>
                <span className="font-mono text-slate-400">{targetAsset.isin}</span>
              </div>
              <div className="font-bold text-white text-base">{targetAsset.name}</div>
              <div className="flex items-center gap-4 mt-2 text-xs">
                <div>
                  <span className="text-slate-400">Score DSE : </span>
                  <strong className="text-rose-400 font-mono">{targetAsset.catholic.dse_score}/100</strong>
                </div>
                <div>
                  <span className="text-slate-400">Laudato Si' : </span>
                  <strong className="text-rose-400">{targetAsset.catholic.laudato_si_alignment}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Carbone : </span>
                  <strong className="font-mono text-slate-300">{targetAsset.catholic.carbon_intensity_tco2e} tCO2e</strong>
                </div>
              </div>
            </div>

            {/* Direction Arrow */}
            <div className="flex justify-center -my-2">
              <div className="p-1.5 bg-raised border border-white/[0.1] text-emerald-400 rounded-none">
                <ArrowRight className="w-4 h-4 rotate-90" />
              </div>
            </div>

            {/* Actif Recommandé (Cible) */}
            <div>
              <label className="text-xs font-mono font-bold text-slate-400 block mb-2">
                Alternative compatible DSE :
              </label>

              <div className="space-y-2">
                {availableAlternatives.map(alt => {
                  const isSelected = selectedReplacementIsin === alt.isin;
                  return (
                    <div
                      key={alt.isin}
                      onClick={() => setSelectedReplacementIsin(alt.isin)}
                      className={clsx(
                        'p-4 border cursor-pointer transition-all rounded-none',
                        isSelected
                          ? 'bg-emerald-950 border-emerald-500/60'
                          : 'bg-raised border-white/[0.06] hover:bg-raised'
                      )}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">{alt.name}</span>
                          <span className="text-xs font-mono px-2 py-0.5 bg-emerald-950 text-emerald-300 font-semibold border border-emerald-500/30 rounded-none">
                            {alt.ticker}
                          </span>
                        </div>
                        <span className="font-mono font-semibold text-emerald-400 text-sm">
                          DSE {alt.catholic.dse_score}/100
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1">{alt.impact_description}</p>
                      
                      <div className="flex items-center gap-3 mt-2 text-xs text-slate-400 font-mono">
                        <span className="text-emerald-400 font-semibold">
                          ✓ Dividende : {alt.key_info.dividend_yield_pct}% ({alt.key_info.payment_frequency.split(' ')[0]})
                        </span>
                        <span>· {alt.catholic.episcopal_guidelines.split(' ')[0]}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bilan des Bénéfices de la Réallocation */}
            <div className="p-5 bg-panel border border-emerald-500/40 text-white rounded-none">
              <div className="flex items-center gap-2 text-xs text-emerald-300 font-medium mb-3 pb-2 border-b border-white/[0.08] font-mono">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Impact immédiat de la réallocation sur votre portefeuille
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-raised p-2.5 border border-white/[0.06] rounded-none">
                  <span className="text-xs text-slate-400 block font-mono">Gain DSE</span>
                  <span className="text-xl font-mono font-semibold text-emerald-400 block">
                    +{dseGain} pts
                  </span>
                </div>

                <div className="bg-raised p-2.5 border border-white/[0.06] rounded-none">
                  <span className="text-xs text-slate-400 block font-mono">Filtre Bioéthique</span>
                  <span className="text-xs font-bold text-emerald-300 block mt-1 font-mono">
                    Filtre appliqué
                  </span>
                </div>

                <div className="bg-raised p-2.5 border border-white/[0.06] rounded-none">
                  <span className="text-xs text-slate-400 block font-mono">Carbone Évité</span>
                  <span className="text-sm font-mono font-bold text-white block mt-0.5">
                    -{Math.round(carbonSaved)} tCO2e
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
            <button
              onClick={onClose}
              className="py-2 px-4 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer rounded-none"
            >
              Annuler
            </button>
            <button
              onClick={handleApply}
              className="py-2.5 px-6 bg-accent hover:bg-accent-hover text-on-accent font-bold text-xs transition-all cursor-pointer flex items-center gap-2 rounded-none"
            >
              <CheckCircle2 className="w-4 h-4 text-slate-950" />
              Confirmer la purge & réallouer
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
