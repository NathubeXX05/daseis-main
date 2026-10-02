import React, { useState, useMemo } from 'react';
import { DollarSign, TrendingUp, ShieldCheck, Plus, Sparkles, ArrowUpRight, Coins, HelpCircle } from 'lucide-react';
import { Asset } from '../actions';
import clsx from 'clsx';

interface TopDividendsRankingProps {
  onSelectAsset?: (asset: Partial<Asset>) => void;
  onAddAsset?: (isin: string) => void;
}

interface HighYieldAsset {
  isin: string;
  ticker: string;
  name: string;
  sector: string;
  price: number;
  currency: string;
  dividendYieldPct: number;
  dseScore: number;
  paymentFreq: string;
  peaEligible: boolean;
  growth5yPct: number;
  note: string;
}

const HIGH_YIELD_CATALOG: HighYieldAsset[] = [
  {
    isin: 'FR0000131104',
    ticker: 'BNP',
    name: 'BNP Paribas S.A.',
    sector: 'Finance & Banque Européenne',
    price: 68.40,
    currency: '€',
    dividendYieldPct: 6.72,
    dseScore: 78,
    paymentFreq: 'Annuelle',
    peaEligible: true,
    growth5yPct: 52.4,
    note: 'Numéro 1 des dividendes du CAC 40 avec politique de distribution généreuse.'
  },
  {
    isin: 'FR0000120628',
    ticker: 'CS',
    name: 'AXA S.A.',
    sector: 'Assurance & Prévoyance Solidaire',
    price: 36.80,
    currency: '€',
    dividendYieldPct: 5.65,
    dseScore: 82,
    paymentFreq: 'Annuelle',
    peaEligible: true,
    growth5yPct: 68.1,
    note: 'Exclusion totale du tabac et des armes controversées depuis 2016.'
  },
  {
    isin: 'FR0000120578',
    ticker: 'SAN',
    name: 'Sanofi S.A.',
    sector: 'Santé & Vaccins Humains',
    price: 88.20,
    currency: '€',
    dividendYieldPct: 4.25,
    dseScore: 88,
    paymentFreq: 'Annuelle',
    peaEligible: true,
    growth5yPct: 29.8,
    note: 'Dividende en hausse ininterrompue depuis 29 années consécutives (Aristocrate du dividende).'
  },
  {
    isin: 'FR0000120644',
    ticker: 'BN',
    name: 'Danone S.A.',
    sector: 'Alimentation Saine & Nourricière',
    price: 63.50,
    currency: '€',
    dividendYieldPct: 3.45,
    dseScore: 92,
    paymentFreq: 'Annuelle',
    peaEligible: true,
    growth5yPct: 24.5,
    note: 'Entreprise à Mission pionnière, alignée avec le respect de la création et du vivant.'
  },
  {
    isin: 'FR0010531553',
    ticker: 'PROCL',
    name: 'Proclero Éthique & Partage Euro',
    sector: 'Fonds éthique',
    price: 132.50,
    currency: '€',
    dividendYieldPct: 3.20,
    dseScore: 98,
    paymentFreq: 'Annuelle',
    peaEligible: true,
    growth5yPct: 42.0,
    note: 'Mécanisme de partage DSE : reversement direct aux congrégations et séminaires.'
  },
  {
    isin: 'FR0000120073',
    ticker: 'AI',
    name: 'Air Liquide S.A.',
    sector: 'Gaz Médicaux & Hydrogène Vert',
    price: 170.52,
    currency: '€',
    dividendYieldPct: 2.65,
    dseScore: 94,
    paymentFreq: 'Annuelle + Attribution gratuite',
    peaEligible: true,
    growth5yPct: 78.5,
    note: 'Attribution gratuite de 1 action pour 10 détenues tous les 2 ans (+10% fidélité).'
  },
  {
    isin: 'FR0000121972',
    ticker: 'SU',
    name: 'Schneider Electric S.E.',
    sector: 'Efficacité Énergétique & Écologie',
    price: 242.80,
    currency: '€',
    dividendYieldPct: 2.15,
    dseScore: 96,
    paymentFreq: 'Annuelle',
    peaEligible: true,
    growth5yPct: 154.2,
    note: 'Croissance explosive du capital : championne mondiale Clean200 de Laudato si\'.'
  }
];

export function TopDividendsRanking({ onAddAsset }: TopDividendsRankingProps) {
  const [investedCapital, setInvestedCapital] = useState<number>(10000);
  const [filterPeaOnly, setFilterPeaOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'yield' | 'dse' | 'growth'>('yield');

  const filteredAssets = useMemo(() => {
    let list = filterPeaOnly ? HIGH_YIELD_CATALOG.filter(a => a.peaEligible) : [...HIGH_YIELD_CATALOG];
    if (sortBy === 'yield') {
      list.sort((a, b) => b.dividendYieldPct - a.dividendYieldPct);
    } else if (sortBy === 'dse') {
      list.sort((a, b) => b.dseScore - a.dseScore);
    } else if (sortBy === 'growth') {
      list.sort((a, b) => b.growth5yPct - a.growth5yPct);
    }
    return list;
  }, [filterPeaOnly, sortBy]);

  const quickAmounts = [5000, 10000, 25000, 50000];

  return (
    <div className="bg-canvas border border-white/10 p-5 sm:p-7 rounded-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-5 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-emerald-100 border border-emerald-200 text-emerald-700 font-mono text-xs font-bold rounded">
              Générateur de Cash & Rente
            </span>
            <span className="text-slate-500 text-xs">·</span>
            <span className="text-slate-500 text-xs font-mono">Classés selon le score DSE</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 flex items-center gap-2">
            <Coins className="w-6 h-6 text-amber-600" />
            Top Rendement Dividendes
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl font-sans">
            Sélection des entreprises chrétiennes et responsables qui versent le plus de liquidités chaque année sur votre compte bancaire.
          </p>
        </div>

        {/* Simulateur de Montant Investi */}
        <div className="bg-white border border-gray-200 p-3 sm:p-4 rounded-lg shadow-sm min-w-[260px]">
          <span className="text-xs font-mono text-slate-500 block mb-1.5">
            Simuler votre investissement
          </span>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-emerald-600 font-mono font-bold text-lg">€</span>
            <input
              type="number"
              value={investedCapital}
              onChange={(e) => setInvestedCapital(Math.max(500, Number(e.target.value) || 0))}
              step={1000}
              className="w-full bg-white border border-gray-200 px-2 py-1 text-slate-900 font-mono font-bold text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md"
            />
          </div>
          <div className="flex items-center gap-1.5">
            {quickAmounts.map(amt => (
              <button
                key={amt}
                onClick={() => setInvestedCapital(amt)}
                className={clsx(
                  'text-xs font-mono px-2 py-0.5 border cursor-pointer transition-all rounded',
                  investedCapital === amt
                    ? 'bg-emerald-100 border-emerald-200 text-emerald-700 font-bold'
                    : 'bg-gray-100 border-gray-200 text-slate-600 hover:text-slate-900 hover:bg-gray-200'
                )}
              >
                {amt / 1000}k€
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filter and Sort Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 py-3 border-b border-gray-200 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-mono text-xs">Trier par :</span>
          <button
            onClick={() => setSortBy('yield')}
            className={clsx(
              'px-2.5 py-1 text-xs font-mono cursor-pointer border rounded transition-all',
              sortBy === 'yield' ? 'bg-amber-100 border-amber-200 text-amber-700 font-bold' : 'border-gray-200 text-slate-600 hover:text-slate-900 hover:bg-gray-50'
            )}
          >
            Rendement Cash (%)
          </button>
          <button
            onClick={() => setSortBy('growth')}
            className={clsx(
              'px-2.5 py-1 text-xs font-mono cursor-pointer border rounded transition-all',
              sortBy === 'growth' ? 'bg-emerald-100 border-emerald-200 text-emerald-700 font-bold' : 'border-gray-200 text-slate-600 hover:text-slate-900 hover:bg-gray-50'
            )}
          >
            Croissance 5 ans
          </button>
          <button
            onClick={() => setSortBy('dse')}
            className={clsx(
              'px-2.5 py-1 text-xs font-mono cursor-pointer border rounded transition-all',
              sortBy === 'dse' ? 'bg-blue-100 border-blue-200 text-blue-700 font-bold' : 'border-gray-200 text-slate-600 hover:text-slate-900 hover:bg-gray-50'
            )}
          >
            Score Moral DSE
          </button>
        </div>

        <label className="flex items-center gap-2 cursor-pointer text-slate-600 text-xs font-mono">
          <input
            type="checkbox"
            checked={filterPeaOnly}
            onChange={(e) => setFilterPeaOnly(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span>Éligible PEA uniquement</span>
        </label>
      </div>

      {/* Assets Table */}
      <div className="overflow-x-auto mt-2 card">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-xs font-mono text-slate-500">
              <th className="py-3 px-3">Entreprise / Fonds</th>
              <th className="py-3 px-3 text-right">Cours</th>
              <th className="py-3 px-3 text-right text-amber-600">Rendement Dividende</th>
              <th className="py-3 px-3 text-right bg-emerald-50 text-emerald-700 font-bold">
                Cash Reçu par an ({investedCapital.toLocaleString('fr-FR')} €)
              </th>
              <th className="py-3 px-3 text-center">Score DSE</th>
              <th className="py-3 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-xs">
            {filteredAssets.map((asset, index) => {
              const annualCash = (investedCapital * asset.dividendYieldPct) / 100;
              const monthlyCash = annualCash / 12;

              return (
                <tr key={asset.isin} className="hover:bg-gray-50 transition-colors group">
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-slate-500 w-4">#{index + 1}</span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {asset.name}
                          </span>
                          <span className="font-mono text-xs px-1 bg-gray-100 text-slate-600 rounded">
                            {asset.ticker}
                          </span>
                          {asset.peaEligible && (
                            <span className="text-xs font-mono px-1 bg-blue-100 text-blue-600 border border-blue-200 rounded">
                              PEA
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-500 block mt-0.5">
                          {asset.sector} · {asset.note}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-3 text-right font-mono font-semibold text-slate-700">
                    {asset.price.toFixed(2)} {asset.currency}
                  </td>

                  <td className="py-3.5 px-3 text-right font-mono">
                    <div className="text-amber-600 font-semibold text-sm">
                      {asset.dividendYieldPct.toFixed(2)} %
                    </div>
                    <span className="text-xs text-slate-500 block">
                      {asset.paymentFreq}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-right font-mono bg-emerald-50">
                    <div className="text-emerald-700 font-semibold text-sm">
                      +{annualCash.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} € / an
                    </div>
                    <span className="text-xs text-emerald-600/70 block">
                      soit ~{monthlyCash.toFixed(0)} € / mois
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-center">
                    <span className={clsx(
                      'inline-block px-2 py-0.5 font-mono text-xs font-bold border rounded',
                      asset.dseScore >= 90 ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-blue-100 text-blue-700 border-blue-200'
                    )}>
                      {asset.dseScore} / 100
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-right">
                    {onAddAsset ? (
                      <button
                        onClick={() => onAddAsset(asset.isin)}
                        className="px-3 py-1.5 bg-accent hover:bg-accent-hover text-on-accent font-mono font-bold text-xs transition-all cursor-pointer rounded-md shadow-sm inline-flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Ajouter</span>
                      </button>
                    ) : (
                      <span className="text-xs text-emerald-600 font-mono font-semibold">
                        Score DSE
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Insight Banner */}
      <div className="mt-4 p-3 bg-white border border-gray-200 flex items-center justify-between text-xs font-sans text-slate-600 rounded-lg">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Règle d'or de la DSE</strong> : Privilégier les dividendes issus d'une réelle création de valeur industrielle durable, et exclure les dividendes issus de la spéculation ou de l'armement.
          </span>
        </div>
      </div>
    </div>
  );
}
