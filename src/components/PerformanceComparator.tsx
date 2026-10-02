import React, { useState, useMemo } from 'react';
import { TrendingUp, ShieldAlert, Award, ArrowRight, Zap, CheckCircle2, DollarSign, BarChart3 } from 'lucide-react';
import clsx from 'clsx';

interface PerformanceComparatorProps {
  onExplorePortfolio?: () => void;
}

export function PerformanceComparator({ onExplorePortfolio }: PerformanceComparatorProps) {
  const [initialCapital, setInitialCapital] = useState<number>(10000);
  const [years, setYears] = useState<number>(5);

  // Taux de rendement annualisés moyens (CAGR historique dividendes réinvestis)
  const RATES = {
    livretA: 0.030, // 3.0% net
    cac40: 0.078,   // 7.8% brut
    dseEthics: 0.114 // 11.4% (Compounders éthiques de haute qualité : Schneider, Air Liquide, etc.)
  };

  const calculateFinalAmount = (capital: number, rate: number, horizon: number) => {
    return capital * Math.pow(1 + rate, horizon);
  };

  const results = useMemo(() => {
    const livretAFinal = calculateFinalAmount(initialCapital, RATES.livretA, years);
    const cac40Final = calculateFinalAmount(initialCapital, RATES.cac40, years);
    const dseFinal = calculateFinalAmount(initialCapital, RATES.dseEthics, years);

    const dseGain = dseFinal - initialCapital;
    const livretAGain = livretAFinal - initialCapital;
    const cac40Gain = cac40Final - initialCapital;

    const outperformanceVsLivretA = dseFinal - livretAFinal;
    const outperformanceVsCac40 = dseFinal - cac40Final;

    return {
      livretAFinal,
      cac40Final,
      dseFinal,
      dseGain,
      livretAGain,
      cac40Gain,
      outperformanceVsLivretA,
      outperformanceVsCac40
    };
  }, [initialCapital, years]);

  const maxVal = results.dseFinal;

  return (
    <div className="bg-panel border border-gray-200 p-5 sm:p-7 rounded-lg card">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-5 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-emerald-100 border border-emerald-200 text-emerald-700 font-mono text-xs font-bold rounded">
              Simulation
            </span>
            <span className="text-slate-500 text-xs">·</span>
            <span className="text-slate-500 text-xs font-mono">Performance & Intérêts Composés</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-emerald-600" />
            Portefeuille DSE vs Livret A vs CAC 40
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl font-sans">
            Simulation illustrative, sur des hypothèses de rendement annuel constant. Non garantie : les performances passées ne préjugent pas des performances futures.
          </p>
        </div>

        {/* Inputs Panel */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-white border border-gray-200 p-2.5 rounded-md">
            <span className="text-xs font-mono text-slate-500 block mb-1">Capital Initial :</span>
            <div className="flex items-center gap-1">
              <span className="text-emerald-600 font-mono font-bold">€</span>
              <input
                type="number"
                value={initialCapital}
                onChange={(e) => setInitialCapital(Math.max(1000, Number(e.target.value) || 0))}
                step={1000}
                className="w-24 bg-transparent text-slate-900 font-mono font-bold text-sm focus:outline-none"
              />
            </div>
          </div>

          <div className="bg-white border border-gray-200 p-2.5 rounded-md">
            <span className="text-xs font-mono text-slate-500 block mb-1">Horizon de placement :</span>
            <div className="flex items-center gap-1 font-mono text-xs">
              {[1, 3, 5, 10].map(h => (
                <button
                  key={h}
                  onClick={() => setYears(h)}
                  className={clsx(
                    'px-2 py-0.5 border cursor-pointer transition-all rounded',
                    years === h
                      ? 'bg-emerald-600 text-white font-bold border-emerald-600'
                      : 'border-gray-200 text-slate-600 hover:text-slate-900 hover:bg-gray-50'
                  )}
                >
                  {h} an{h > 1 ? 's' : ''}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {/* 1. Livret A */}
        <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-slate-600">
              1. Livret A Bancaire
            </span>
            <span className="text-xs font-mono px-1.5 py-0.2 bg-slate-100 text-slate-600 border border-slate-200 rounded">
              3.0 % / an
            </span>
          </div>

          <div className="text-2xl font-semibold font-mono text-slate-700">
            {results.livretAFinal.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} €
          </div>
          <div className="text-xs font-mono text-slate-500 mt-0.5">
            Gain net : +{results.livretAGain.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} €
          </div>

          <div className="w-full bg-gray-200 h-2 mt-3 rounded overflow-hidden">
            <div
              className="bg-slate-500 h-full transition-all duration-500"
              style={{ width: `${(results.livretAFinal / maxVal) * 100}%` }}
            />
          </div>

          <p className="text-xs text-slate-500 mt-3 font-sans leading-snug">
            <strong>Plafonné à 22 950 €</strong>. Avec l'inflation réelle (~2.5% à 3.5%), votre pouvoir d'achat stagne ou diminue.
          </p>
        </div>

        {/* 2. CAC 40 Classique */}
        <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-slate-600">
              2. CAC 40 Standard
            </span>
            <span className="text-xs font-mono px-1.5 py-0.2 bg-amber-100 text-amber-600 border border-amber-200 rounded">
              ~7.8 % / an
            </span>
          </div>

          <div className="text-2xl font-semibold font-mono text-amber-700">
            {results.cac40Final.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} €
          </div>
          <div className="text-xs font-mono text-amber-600/80 mt-0.5">
            Gain net : +{results.cac40Gain.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} €
          </div>

          <div className="w-full bg-gray-200 h-2 mt-3 rounded overflow-hidden">
            <div
              className="bg-amber-500 h-full transition-all duration-500"
              style={{ width: `${(results.cac40Final / maxVal) * 100}%` }}
            />
          </div>

          <p className="text-xs text-slate-500 mt-3 font-sans leading-snug">
            L'indice inclut des secteurs que le filtre DSE exclut (armement, tabac, énergies fossiles).
          </p>
        </div>

        {/* 3. Portefeuille Homonobus DSE */}
        <div className="bg-gradient-to-b from-blue-50 to-white border-2 border-emerald-500 p-4 rounded-lg shadow-sm relative">
          <div className="absolute -top-3 right-3 bg-emerald-600 text-white font-mono font-semibold text-xs px-2 py-0.5 shadow-lg rounded">
            Hypothèse haute
          </div>

          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-emerald-400">
              3. Portefeuille DSE Catholique
            </span>
            <span className="text-xs font-mono px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
              11,4 % / an (hypothèse)
            </span>
          </div>

          <div className="text-3xl font-semibold font-mono text-emerald-700">
            {results.dseFinal.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} €
          </div>
          <div className="text-xs font-mono text-emerald-600 font-semibold mt-0.5">
            Gain net : +{results.dseGain.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} €
          </div>

          <div className="w-full bg-gray-200 h-2 mt-3 rounded overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-all duration-500"
              style={{ width: '100%' }}
            />
          </div>

          <div className="mt-3 pt-2 border-t border-emerald-200 flex items-center justify-between text-xs font-mono">
            <span className="text-emerald-700">Surplus vs Livret A :</span>
            <span className="text-emerald-600 font-semibold">
              +{results.outperformanceVsLivretA.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} €
            </span>
          </div>
        </div>
      </div>

      {/* Why it outperforms box */}
      <div className="mt-6 p-4 bg-white border border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans rounded-lg">
        <div className="flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-900 block mb-0.5">Moins d'exposition aux controverses</span>
            <span className="text-slate-600 leading-relaxed">
              Écarter les entreprises exposées à des controverses peut réduire certains risques, sans garantir une meilleure performance.
            </span>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-900 block mb-0.5">Entreprises de l'économie réelle</span>
            <span className="text-slate-600 leading-relaxed">
              Air Liquide, Schneider Electric ou L'Oréal occupent des positions de marché solides. Cela ne préjuge pas de leurs résultats futurs.
            </span>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-900 block mb-0.5">Dividendes réinvestis</span>
            <span className="text-slate-600 leading-relaxed">
              Les dividendes trimestriels et annuels sont réinjectés automatiquement pour démultiplier les intérêts composés d'année en année.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
