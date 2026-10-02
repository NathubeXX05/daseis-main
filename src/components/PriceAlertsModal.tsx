import React, { useState, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  BellRing,
  Plus,
  Trash2,
  RefreshCw,
  X,
  TrendingUp,
  TrendingDown,
  Target,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import clsx from 'clsx';
import { Asset } from '../actions';
import { PriceAlert } from '../types/alerts';

interface PriceAlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolio: Asset[];
  alerts: PriceAlert[];
  preselectedAsset?: Asset | null;
  onAddAlert: (newAlert: Omit<PriceAlert, 'id' | 'createdAt' | 'triggered'>) => void;
  onDeleteAlert: (alertId: string) => void;
  onResetAlert: (alertId: string) => void;
  onSimulateTrigger: (alertId: string) => void;
}

export function PriceAlertsModal({
  isOpen,
  onClose,
  portfolio,
  alerts,
  preselectedAsset,
  onAddAlert,
  onDeleteAlert,
  onResetAlert,
  onSimulateTrigger
}: PriceAlertsModalProps) {
  const [selectedIsin, setSelectedIsin] = useState<string>(
    preselectedAsset ? preselectedAsset.isin : portfolio[0]?.isin || ''
  );
  const [direction, setDirection] = useState<'above' | 'below'>('above');
  const [targetPriceStr, setTargetPriceStr] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');

  // Accessible element IDs for form inputs
  const selectAssetId = useId();
  const targetPriceId = useId();
  const alertNoteId = useId();

  // Keep selected asset in sync when modal opens with preselected asset
  React.useEffect(() => {
    if (preselectedAsset) {
      setSelectedIsin(preselectedAsset.isin);
      // Pre-fill target price with +3% by default
      const defaultTarget = Number((preselectedAsset.current_price * 1.03).toFixed(2));
      setTargetPriceStr(defaultTarget.toString());
      setActiveTab('create');
    } else if (portfolio.length > 0 && !selectedIsin) {
      setSelectedIsin(portfolio[0].isin);
      const defaultTarget = Number((portfolio[0].current_price * 1.03).toFixed(2));
      setTargetPriceStr(defaultTarget.toString());
    }
  }, [preselectedAsset, isOpen]);

  const currentAsset = portfolio.find(a => a.isin === selectedIsin) || portfolio[0];

  const handleAssetChange = (isin: string) => {
    setSelectedIsin(isin);
    const asset = portfolio.find(a => a.isin === isin);
    if (asset) {
      const defaultTarget = Number(
        (asset.current_price * (direction === 'above' ? 1.05 : 0.95)).toFixed(2)
      );
      setTargetPriceStr(defaultTarget.toString());
    }
  };

  const handlePresetClick = (percentChange: number) => {
    if (!currentAsset) return;
    const computed = Number((currentAsset.current_price * (1 + percentChange / 100)).toFixed(2));
    setTargetPriceStr(computed.toString());
    if (percentChange >= 0) {
      setDirection('above');
    } else {
      setDirection('below');
    }
  };

  const handleSubmitCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAsset) return;

    const targetPrice = parseFloat(targetPriceStr);
    if (isNaN(targetPrice) || targetPrice <= 0) return;

    onAddAlert({
      isin: currentAsset.isin,
      assetName: currentAsset.name,
      ticker: currentAsset.ticker,
      targetPrice,
      direction,
      currency: currentAsset.currency,
      currentPriceAtCreation: currentAsset.current_price,
      note: note.trim() || undefined
    });

    setNote('');
    setActiveTab('list');
  };

  const activeAlertsCount = alerts.filter(a => !a.triggered).length;
  const triggeredAlertsCount = alerts.filter(a => a.triggered).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80">
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 8 }}
        className="relative bg-panel border border-white/10 w-full max-w-2xl max-h-[90vh] flex flex-col rounded-none text-slate-100 font-sans"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-panel">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-950 border border-emerald-500/30 flex items-center justify-center rounded-none text-emerald-400">
              <BellRing className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white font-mono">
                  Alertes de Seuil de Cours
                </h2>
                <span className="text-xs font-mono px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                  {activeAlertsCount} actives
                </span>
                {triggeredAlertsCount > 0 && (
                  <span className="text-xs font-mono px-2 py-0.5 bg-amber-950 text-amber-300 border border-amber-500/30">
                    {triggeredAlertsCount} atteinte{triggeredAlertsCount > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Surveillance continue des cibles de réallocation, renforcement ou désengagement
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.1] transition-colors rounded-none cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 bg-panel px-6 text-xs font-mono">
          <button
            onClick={() => setActiveTab('list')}
            className={clsx(
              'py-2.5 px-4 font-bold border-b-2 transition-all cursor-pointer -mb-px flex items-center gap-1.5',
              activeTab === 'list'
                ? 'border-emerald-400 text-white bg-panel'
                : 'border-transparent text-slate-400 hover:text-white'
            )}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Mes Alertes ({alerts.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={clsx(
              'py-2.5 px-4 font-bold border-b-2 transition-all cursor-pointer -mb-px flex items-center gap-1.5',
              activeTab === 'create'
                ? 'border-emerald-400 text-white bg-panel'
                : 'border-transparent text-slate-400 hover:text-white'
            )}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Créer une Alerte</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'create' ? (
            /* CREATE ALERT FORM */
            <form onSubmit={handleSubmitCreate} className="space-y-5">
              {/* Asset Selector */}
              <div>
                <label htmlFor={selectAssetId} className="block text-xs font-mono text-slate-400 mb-1.5">
                  1. Actif à surveiller
                </label>
                {portfolio.length === 0 ? (
                  <p className="text-xs text-amber-400">Aucun actif dans le portefeuille.</p>
                ) : (
                  <select
                    id={selectAssetId}
                    value={selectedIsin}
                    onChange={(e) => handleAssetChange(e.target.value)}
                    className="w-full bg-panel border border-white/10 px-3.5 py-2.5 text-white text-sm font-sans focus:outline-none focus:border-accent rounded-none cursor-pointer"
                  >
                    {portfolio.map(a => (
                      <option key={a.isin} value={a.isin}>
                        {a.name} ({a.ticker}) — Cours actuel : {a.current_price.toFixed(2)} {a.currency}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Current Price Display Banner */}
              {currentAsset && (
                <div className="p-3 bg-panel border border-white/[0.08] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs text-slate-300">
                      Cours de marché en direct :
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-base font-bold text-white">
                      {currentAsset.current_price.toFixed(2)} {currentAsset.currency}
                    </span>
                    <span
                      className={clsx(
                        'text-xs font-mono ml-2 font-bold',
                        currentAsset.change_1d_pct >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      )}
                    >
                      {currentAsset.change_1d_pct >= 0 ? '+' : ''}{currentAsset.change_1d_pct.toFixed(2)}%
                    </span>
                  </div>
                </div>
              )}

              {/* Direction selector */}
              <div>
                <span className="block text-xs font-mono text-slate-400 mb-1.5">
                  2. Condition de déclenchement
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDirection('above')}
                    className={clsx(
                      'p-3 text-left border transition-all cursor-pointer rounded-none',
                      direction === 'above'
                        ? 'bg-emerald-950/60 border-emerald-500/60 text-white'
                        : 'bg-panel border-white/10 text-slate-400 hover:text-white'
                    )}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold font-mono">≥ SEUIL SUPÉRIEUR</span>
                    </div>
                    <span className="text-xs text-slate-400 block leading-tight">
                      Alerte dès que le cours atteint ou dépasse la cible (prise de bénéfice, palier)
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDirection('below')}
                    className={clsx(
                      'p-3 text-left border transition-all cursor-pointer rounded-none',
                      direction === 'below'
                        ? 'bg-amber-950/60 border-amber-500/60 text-white'
                        : 'bg-panel border-white/10 text-slate-400 hover:text-white'
                    )}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingDown className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-bold font-mono">≤ SEUIL INFÉRIEUR</span>
                    </div>
                    <span className="text-xs text-slate-400 block leading-tight">
                      Alerte dès que le cours chute sous la cible (repli, opportunité d'achat chrétien)
                    </span>
                  </button>
                </div>
              </div>

              {/* Target Price Input & Quick presets */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor={targetPriceId} className="text-xs font-mono text-slate-400">
                    3. Prix Cible ({currentAsset?.currency || '€'})
                  </label>
                  <span className="text-xs font-mono text-slate-400">
                    Raccourcis depuis le cours actuel :
                  </span>
                </div>

                {/* Preset Shortcut Buttons */}
                <div className="flex items-center gap-1.5 mb-2 overflow-x-auto pb-1">
                  <button
                    type="button"
                    onClick={() => handlePresetClick(-10)}
                    className="px-2 py-1 bg-white/[0.04] hover:bg-white/[0.1] text-xs font-mono text-slate-300 border border-white/10 cursor-pointer"
                  >
                    -10%
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePresetClick(-5)}
                    className="px-2 py-1 bg-white/[0.04] hover:bg-white/[0.1] text-xs font-mono text-slate-300 border border-white/10 cursor-pointer"
                  >
                    -5%
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePresetClick(-2)}
                    className="px-2 py-1 bg-white/[0.04] hover:bg-white/[0.1] text-xs font-mono text-slate-300 border border-white/10 cursor-pointer"
                  >
                    -2%
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePresetClick(2)}
                    className="px-2 py-1 bg-white/[0.04] hover:bg-white/[0.1] text-xs font-mono text-slate-300 border border-white/10 cursor-pointer"
                  >
                    +2%
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePresetClick(5)}
                    className="px-2 py-1 bg-white/[0.04] hover:bg-white/[0.1] text-xs font-mono text-slate-300 border border-white/10 cursor-pointer"
                  >
                    +5%
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePresetClick(10)}
                    className="px-2 py-1 bg-white/[0.04] hover:bg-white/[0.1] text-xs font-mono text-slate-300 border border-white/10 cursor-pointer"
                  >
                    +10%
                  </button>
                </div>

                <div className="relative">
                  <input
                    id={targetPriceId}
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={targetPriceStr}
                    onChange={(e) => setTargetPriceStr(e.target.value)}
                    placeholder="ex: 155.00"
                    className="w-full bg-panel border border-white/10 px-4 py-3 text-white text-base font-mono focus:outline-none focus:border-accent rounded-none pr-12"
                  />
                  <span className="absolute right-4 top-3 text-sm font-mono text-slate-400">
                    {currentAsset?.currency || '€'}
                  </span>
                </div>

                {currentAsset && targetPriceStr && (
                  <div className="mt-1 text-xs font-mono text-slate-400 flex items-center justify-between">
                    <span>
                      Écart avec le cours actuel :{' '}
                      <strong className="text-white">
                        {((parseFloat(targetPriceStr) - currentAsset.current_price) / currentAsset.current_price * 100).toFixed(2)}%
                      </strong>
                    </span>
                    <span>
                      Différence nette :{' '}
                      <strong className="text-white">
                        {(parseFloat(targetPriceStr) - currentAsset.current_price).toFixed(2)} {currentAsset.currency}
                      </strong>
                    </span>
                  </div>
                )}
              </div>

              {/* Optional note */}
              <div>
                <label htmlFor={alertNoteId} className="block text-xs font-mono text-slate-400 mb-1.5">
                  4. Motif pastoral / d'action (Optionnel)
                </label>
                <input
                  id={alertNoteId}
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="ex: Palier de renforcement pour la communauté, Réallocation solidaire..."
                  className="w-full bg-panel border border-white/10 px-3.5 py-2.5 text-white text-xs font-sans focus:outline-none focus:border-accent rounded-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={!targetPriceStr || parseFloat(targetPriceStr) <= 0}
                  className="flex-1 py-3 px-4 bg-white hover:bg-neutral-200 disabled:opacity-40 text-slate-950 font-bold text-xs font-mono rounded-none transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-slate-950" />
                  <span>Enregistrer l'Alerte de Seuil</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('list')}
                  className="py-3 px-4 bg-raised hover:bg-raised text-slate-400 hover:text-white text-xs font-mono rounded-none cursor-pointer"
                >
                  Annuler
                </button>
              </div>
            </form>
          ) : (
            /* ALERTS LIST VIEW */
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
                <span className="text-xs text-slate-400 font-mono">
                  {alerts.length === 0
                    ? 'Aucune alerte enregistrée.'
                    : `${alerts.length} alerte${alerts.length > 1 ? 's' : ''} configurée${alerts.length > 1 ? 's' : ''}`}
                </span>

                <button
                  type="button"
                  onClick={() => setActiveTab('create')}
                  className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-mono font-bold cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ajouter une alerte</span>
                </button>
              </div>

              {alerts.length === 0 ? (
                <div className="text-center py-12 bg-panel border border-dashed border-white/10 p-6 rounded-none">
                  <Bell className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-50" />
                  <h3 className="text-sm font-bold text-white mb-1">
                    Aucune alerte de seuil active
                  </h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                    Configurez des alertes pour être averti instantanément par notification toast et repère visuel dès qu'un cours atteint votre cible.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('create')}
                    className="py-2 px-4 bg-white text-slate-950 text-xs font-mono font-bold rounded-none hover:bg-neutral-200 cursor-pointer"
                  >
                    + Créer ma première alerte
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {alerts.map((alert) => {
                    const matchedAsset = portfolio.find(a => a.isin === alert.isin);
                    const currentPrice = matchedAsset ? matchedAsset.current_price : alert.currentPriceAtCreation;
                    const diffPct = ((alert.targetPrice - currentPrice) / currentPrice) * 100;

                    return (
                      <div
                        key={alert.id}
                        className={clsx(
                          'p-4 border transition-all rounded-none',
                          alert.triggered
                            ? 'bg-panel border-amber-500/40 '
                            : 'bg-panel border-white/10 hover:border-white/20'
                        )}
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-mono text-xs font-bold text-white">
                                {alert.assetName}
                              </span>
                              <span className="text-xs font-mono px-1.5 py-0.2 bg-white/[0.06] text-slate-300 border border-white/10">
                                {alert.ticker}
                              </span>
                              <span className="text-xs font-mono text-slate-400">
                                {alert.isin}
                              </span>
                            </div>

                            {alert.note && (
                              <p className="text-xs text-slate-300 italic mb-1">
                                « {alert.note} »
                              </p>
                            )}
                          </div>

                          {/* Status Badge */}
                          <div>
                            {alert.triggered ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-950 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold">
                                <Zap className="w-3 h-3 text-amber-400 animate-bounce" />
                                <span>Seuil Atteint</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-xs font-mono">
                                <span className="w-1.5 h-1.5 bg-emerald-400" />
                                <span>En surveillance</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Price Details Bar */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs py-2 px-3 bg-canvas border border-white/[0.06] my-2 font-mono">
                          <div>
                            <span className="text-slate-500 text-xs block">CONDITION</span>
                            <span className="font-bold text-white flex items-center gap-1">
                              {alert.direction === 'above' ? (
                                <>
                                  <TrendingUp className="w-3 h-3 text-emerald-400" />
                                  <span>≥ {alert.targetPrice.toFixed(2)} {alert.currency}</span>
                                </>
                              ) : (
                                <>
                                  <TrendingDown className="w-3 h-3 text-amber-400" />
                                  <span>≤ {alert.targetPrice.toFixed(2)} {alert.currency}</span>
                                </>
                              )}
                            </span>
                          </div>

                          <div>
                            <span className="text-slate-500 text-xs block">COURS ACTUEL</span>
                            <span className="font-bold text-white">
                              {currentPrice.toFixed(2)} {alert.currency}
                            </span>
                          </div>

                          <div>
                            <span className="text-slate-500 text-xs block">ÉCART RESTANT</span>
                            <span
                              className={clsx(
                                'font-bold',
                                Math.abs(diffPct) < 2
                                  ? 'text-amber-400'
                                  : diffPct > 0
                                  ? 'text-emerald-400'
                                  : 'text-slate-300'
                              )}
                            >
                              {diffPct >= 0 ? '+' : ''}{diffPct.toFixed(2)}%
                            </span>
                          </div>

                          <div>
                            <span className="text-slate-500 text-xs block">CRÉATION</span>
                            <span className="text-slate-400 text-xs">
                              {new Date(alert.createdAt).toLocaleDateString('fr-FR', {
                                day: '2-digit',
                                month: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>

                        {/* Action buttons on alert */}
                        <div className="flex items-center justify-between pt-2 text-xs font-mono">
                          {/* Test simulation button */}
                          <button
                            type="button"
                            onClick={() => onSimulateTrigger(alert.id)}
                            className="flex items-center gap-1.5 px-2.5 py-1 bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 hover:text-white transition-colors cursor-pointer border border-white/10"
                            title="Simule instantanément l'atteinte du seuil pour tester la notification et le repère visuel"
                          >
                            <Zap className="w-3 h-3 text-amber-400" />
                            <span>Tester le déclencheur</span>
                          </button>

                          <div className="flex items-center gap-2">
                            {alert.triggered && (
                              <button
                                type="button"
                                onClick={() => onResetAlert(alert.id)}
                                className="flex items-center gap-1 px-2 py-1 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/30 cursor-pointer"
                                title="Réarmer l'alerte"
                              >
                                <RefreshCw className="w-3 h-3" />
                                <span>Réarmer</span>
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => onDeleteAlert(alert.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                              title="Supprimer cette alerte"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-panel flex items-center justify-between text-xs font-mono text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-emerald-400 inline-block rounded-none" />
            <span>Moteur d'alerte actif en arrière-plan</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 bg-white/[0.06] hover:bg-white/[0.12] text-white transition-colors cursor-pointer rounded-none"
          >
            Fermer
          </button>
        </div>
      </motion.div>
    </div>
  );
}
