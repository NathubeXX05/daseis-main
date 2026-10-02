import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HeartHandshake,
  X,
  Coins,
  Receipt,
  Sparkles,
  CheckCircle2,
  BookOpen,
  Gift,
  Building2,
  TreePine,
  ExternalLink
} from 'lucide-react';
import clsx from 'clsx';

interface DimeSimulatorModalProps {
  open: boolean;
  onClose: () => void;
  annualDividends: number;
  totalVal: number;
}

const CHARITY_CAUSES = [
  {
    id: 'caritas',
    name: 'Secours Catholique - Caritas France',
    mission: 'Lutte contre la précarité et accueil des personnes isolées',
    taxDeductionRate: 0.75, // Coluche 75%
    icon: HeartHandshake
  },
  {
    id: 'aed',
    name: 'Aide à l\'Église en Détresse (AED)',
    mission: 'Secours d\'urgence aux chrétiens persécutés dans le monde',
    taxDeductionRate: 0.66,
    icon: Building2
  },
  {
    id: 'auteuil',
    name: 'Apprentis d\'Auteuil',
    mission: 'Éducation, insertion et protection de la jeunesse en difficulté',
    taxDeductionRate: 0.75,
    icon: BookOpen
  },
  {
    id: 'laudato_agro',
    name: 'Fonds Écologie Intégrale & Laudato Si\'',
    mission: 'Agroécologie paysanne, reforestation et accès à l\'eau potable',
    taxDeductionRate: 0.66,
    icon: TreePine
  }
];

export function DimeSimulatorModal({
  open,
  onClose,
  annualDividends,
  totalVal
}: DimeSimulatorModalProps) {
  const [calculationMode, setCalculationMode] = useState<'dividend_pct' | 'capital_pct' | 'custom'>('dividend_pct');
  const [dividendPct, setDividendPct] = useState<number>(10);
  const [capitalPct, setCapitalPct] = useState<number>(0.5);
  const [customAmount, setCustomAmount] = useState<number>(300);
  const [selectedCauseId, setSelectedCauseId] = useState<string>('caritas');
  const [donorType, setDonorType] = useState<'ir' | 'ifi'>('ir');

  if (!open) return null;

  let grossDonation = 0;
  if (calculationMode === 'dividend_pct') {
    grossDonation = (annualDividends * dividendPct) / 100;
  } else if (calculationMode === 'capital_pct') {
    grossDonation = (totalVal * capitalPct) / 100;
  } else {
    grossDonation = customAmount;
  }

  const donationDisplay = Math.max(0, grossDonation);
  const selectedCause = CHARITY_CAUSES.find(c => c.id === selectedCauseId) || CHARITY_CAUSES[0];

  let taxRate = selectedCause.taxDeductionRate;
  if (donorType === 'ifi') {
    taxRate = 0.75;
  }

  const taxReduction = donationDisplay * taxRate;
  const netCost = Math.max(0, donationDisplay - taxReduction);

  const mealsProvided = Math.max(1, Math.round(donationDisplay / 10));
  const studentDays = Math.max(1, Math.round(donationDisplay / 25));
  const treesPlanted = Math.max(1, Math.round(donationDisplay / 15));

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

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 10 }}
          className="relative bg-panel border border-white/10 w-full max-w-xl max-h-[90vh] overflow-y-auto z-10 p-6 sm:p-7 font-sans text-slate-100 rounded-none"
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-white/[0.08]">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-950 border border-emerald-500/30 text-emerald-400 rounded-none">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold tracking-tight text-white">
                  Simulateur de Dîme Éthique & Partage Solidaire
                </h3>
                <p className="text-xs text-slate-400">
                  Fructifier son épargne tout en soutenant l'Église et les plus vulnérables
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

          <div className="py-4 space-y-5">
            {/* Context bar */}
            <div className="p-4 bg-raised border border-white/[0.08] flex items-center justify-between text-xs rounded-none">
              <div>
                <span className="text-slate-400 block font-mono text-xs">VALEUR DU PORTEFEUILLE</span>
                <span className="font-mono font-bold text-white text-sm">
                  {totalVal.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block font-mono text-xs">FLUX DIVIDENDES / AN</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  ~{annualDividends.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} € / an
                </span>
              </div>
            </div>

            {/* Mode de Calcul */}
            <div>
              <label className="text-xs font-mono font-bold text-slate-400 block mb-2">
                Règle de Partage Chrétien
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setCalculationMode('dividend_pct')}
                  className={clsx(
                    'p-3 border text-xs font-semibold text-center transition-all cursor-pointer rounded-none',
                    calculationMode === 'dividend_pct'
                      ? 'bg-emerald-950 border-emerald-500/50 text-white'
                      : 'bg-raised border-white/[0.06] text-slate-400 hover:text-white'
                  )}
                >
                  <Coins className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
                  % Dividendes
                  <span className="block text-xs text-slate-500 font-mono">Dîme biblique (10%)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCalculationMode('capital_pct')}
                  className={clsx(
                    'p-3 border text-xs font-semibold text-center transition-all cursor-pointer rounded-none',
                    calculationMode === 'capital_pct'
                      ? 'bg-emerald-950 border-emerald-500/50 text-white'
                      : 'bg-raised border-white/[0.06] text-slate-400 hover:text-white'
                  )}
                >
                  <Building2 className="w-4 h-4 mx-auto mb-1 text-blue-400" />
                  % Capital
                  <span className="block text-xs text-slate-500 font-mono">Prélèvement annuel</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCalculationMode('custom')}
                  className={clsx(
                    'p-3 border text-xs font-semibold text-center transition-all cursor-pointer rounded-none',
                    calculationMode === 'custom'
                      ? 'bg-emerald-950 border-emerald-500/50 text-white'
                      : 'bg-raised border-white/[0.06] text-slate-400 hover:text-white'
                  )}
                >
                  <Sparkles className="w-4 h-4 mx-auto mb-1 text-amber-400" />
                  Montant Libre
                  <span className="block text-xs text-slate-500 font-mono">Don personnalisé</span>
                </button>
              </div>
            </div>

            {/* Sliders / Inputs */}
            {calculationMode === 'dividend_pct' && (
              <div className="p-4 bg-raised border border-white/[0.08] rounded-none">
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="font-semibold text-slate-300">Pourcentage des dividendes :</span>
                  <span className="font-mono font-semibold text-emerald-400 text-sm">{dividendPct}%</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={dividendPct}
                  onChange={(e) => setDividendPct(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1 font-mono">
                  <span>5% (Symbole)</span>
                  <span className="font-bold text-emerald-400">10% (Dîme classique)</span>
                  <span>20% (Partage fort)</span>
                </div>
              </div>
            )}

            {calculationMode === 'capital_pct' && (
              <div className="p-4 bg-raised border border-white/[0.08] rounded-none">
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="font-semibold text-slate-300">Part du capital annuel :</span>
                  <span className="font-mono font-semibold text-blue-400 text-sm">{capitalPct}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="3.0"
                  step="0.1"
                  value={capitalPct}
                  onChange={(e) => setCapitalPct(Number(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1 font-mono">
                  <span>0.2%</span>
                  <span>1.0%</span>
                  <span>3.0%</span>
                </div>
              </div>
            )}

            {calculationMode === 'custom' && (
              <div>
                <label className="text-xs text-slate-400 block mb-1 font-mono">Montant annuel envisagé (€) :</label>
                <input
                  type="number"
                  min="10"
                  max="50000"
                  step="10"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-raised border border-white/[0.08] font-mono text-sm text-white focus:outline-none focus:border-accent rounded-none"
                />
              </div>
            )}

            {/* Choix de l'œuvre bénéficiaire */}
            <div>
              <label className="text-xs font-mono font-bold text-slate-400 block mb-2">
                Fondation ou Œuvre Chrétienne Bénéficiaire
              </label>
              <div className="space-y-2">
                {CHARITY_CAUSES.map(c => {
                  const Icon = c.icon;
                  const isSelected = selectedCauseId === c.id;
                  return (
                    <div
                      key={c.id}
                      onClick={() => setSelectedCauseId(c.id)}
                      className={clsx(
                        'p-3.5 border flex items-center justify-between cursor-pointer transition-all rounded-none',
                        isSelected
                          ? 'bg-emerald-950 border-emerald-500/50'
                          : 'bg-raised border-white/[0.06] hover:bg-raised'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={clsx('p-2 rounded-none', isSelected ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-white/[0.06] text-slate-300')}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">{c.name}</div>
                          <div className="text-xs text-slate-400">{c.mission}</div>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-emerald-300 bg-emerald-950 px-2 py-0.5 border border-emerald-500/30 rounded-none font-mono">
                        {Math.round(c.taxDeductionRate * 100)}% déductible
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Fiscalité & Coût Réel (Résultat) */}
            <div className="p-5 bg-panel border border-emerald-500/40 text-white rounded-none">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-2 text-xs text-emerald-300 font-medium font-mono">
                  <Receipt className="w-4 h-4" />
                  Synthèse Fiscale & Coût Réel
                </div>
                <div className="flex text-xs bg-canvas border border-white/[0.08] rounded-none">
                  <button
                    onClick={() => setDonorType('ir')}
                    className={clsx('px-2.5 py-1 font-semibold transition-all cursor-pointer rounded-none font-mono', donorType === 'ir' ? 'bg-white text-slate-950' : 'text-slate-400')}
                  >
                    IR ({Math.round(selectedCause.taxDeductionRate * 100)}%)
                  </button>
                  <button
                    onClick={() => setDonorType('ifi')}
                    className={clsx('px-2.5 py-1 font-semibold transition-all cursor-pointer rounded-none font-mono', donorType === 'ifi' ? 'bg-white text-slate-950' : 'text-slate-400')}
                  >
                    IFI (75%)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center mb-4">
                <div>
                  <span className="text-xs text-slate-400 block font-mono">Don Versé</span>
                  <span className="text-lg sm:text-xl font-mono font-bold block text-white">
                    {donationDisplay.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-mono">Réduction d'impôt</span>
                  <span className="text-lg sm:text-xl font-mono font-bold text-emerald-400 block">
                    - {taxReduction.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                  </span>
                </div>
                <div className="bg-raised p-2 border border-white/[0.06] rounded-none">
                  <span className="text-xs text-slate-400 block font-mono">Coût Réel Net</span>
                  <span className="text-lg sm:text-xl font-mono font-semibold text-white block">
                    {netCost.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                  </span>
                </div>
              </div>

              {/* Impact concrets */}
              <div className="pt-3 border-t border-white/[0.08] text-xs text-slate-300">
                <span className="font-semibold block mb-2 text-white">Impact chrétien concret généré par an :</span>
                <div className="grid grid-cols-3 gap-1.5 text-xs">
                  <div className="bg-raised p-2 text-center border border-white/[0.06] rounded-none">
                    <strong className="text-emerald-300 block">{mealsProvided}</strong> repas fraternels
                  </div>
                  <div className="bg-raised p-2 text-center border border-white/[0.06] rounded-none">
                    <strong className="text-emerald-300 block">{studentDays}</strong> jours formation
                  </div>
                  <div className="bg-raised p-2 text-center border border-white/[0.06] rounded-none">
                    <strong className="text-emerald-300 block">{treesPlanted}</strong> arbres Laudato Si'
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
            <span className="text-xs text-slate-500 font-mono">
              * Code Général des Impôts (art. 200 et 978 du CGI).
            </span>
            <button
              onClick={onClose}
              className="py-2.5 px-6 bg-accent hover:bg-accent-hover text-on-accent font-bold text-xs transition-all cursor-pointer rounded-none"
            >
              Enregistrer mes préférences
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
