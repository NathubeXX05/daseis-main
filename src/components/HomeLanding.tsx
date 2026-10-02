import React from 'react';
import clsx from 'clsx';
import { ASSETS_DATABASE } from '../actions';
import { PerformanceComparator } from './PerformanceComparator';
import { TopDividendsRanking } from './TopDividendsRanking';

interface HomeLandingProps {
  onGoToDashboard: () => void;
  onOpenDimeSimulator: () => void;
  onOpenAuth: () => void;
  onSelectAsset?: (isin: string) => void;
  onAddAsset?: (isin: string) => void;
}

// Couleurs écrites dans la convention du thème : text-white = texte principal,
// text-slate-400 = texte secondaire, text-emerald-400 = positif, etc.
const VERDICT = {
  compatible: { label: 'Compatible', text: 'text-emerald-400' },
  warning: { label: 'À examiner', text: 'text-amber-400' },
  non_compatible: { label: 'Incompatible', text: 'text-rose-400' }
} as const;

const CRITERIA = [
  ['Respect de la vie', "Exclusion des émetteurs liés à l'avortement, à la recherche sur l'embryon humain et à l'euthanasie."],
  ['Écologie intégrale', "Inspirée de Laudato si' : part des énergies fossiles, intensité carbone, atteintes à l'eau et aux milieux."],
  ['Justice du travail', "Salaires, sécurité, travail des enfants, relations avec les fournisseurs."],
  ['Gouvernance', "Écarts de rémunération, transparence fiscale, présence dans des paradis fiscaux."]
];

const LIMITS = [
  ["Ce n'est pas l'avis de l'Église", "Homonobus applique sa propre grille, inspirée de la doctrine sociale. Il n'est affilié ni à la Conférence des évêques ni au Saint-Siège."],
  ["Ce n'est pas un conseil en investissement", "Nous n'indiquons ni quoi acheter ni quand. Tout placement comporte un risque de perte en capital."],
  ['Les données peuvent être fausses', "Si vous trouvez une erreur, signalez-la : elle sera corrigée et la correction sera datée."]
];

const th = 'py-2.5 px-3 text-right text-xs font-medium text-slate-400 border-b border-white/10';
const td = 'py-3.5 px-3 text-right tabular-nums border-b border-white/10';

export function HomeLanding({
  onGoToDashboard,
  onOpenDimeSimulator,
  onOpenAuth,
  onAddAsset
}: HomeLandingProps) {
  const assets = Object.values(ASSETS_DATABASE);
  const sorted = [...assets].sort((a, b) => b.catholic.dse_score - a.catholic.dse_score);
  const sample = [...sorted.slice(0, 2), ...sorted.slice(-2)].filter(
    (a, i, arr) => arr.findIndex(b => b.isin === a.isin) === i
  );

  // Updated class names for professional theme
  const th = 'py-2.5 px-3 text-right text-xs font-medium text-slate-500 border-b border-gray-200';
  const td = 'py-3.5 px-3 text-right tabular-nums border-b border-gray-200';

  return (
    <div className="font-sans text-slate-800">
      <section className="pt-14 sm:pt-20 pb-14 max-w-3xl">
        <h1 className="font-serif text-4xl sm:text-5xl leading-[1.12] text-slate-900">
          Savoir ce que contient votre épargne, à la lumière de la doctrine sociale de l'Église.
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-slate-600 max-w-2xl">
          Homonobus note vos actions et vos fonds sur quatre critères et montre, ligne par ligne,
          ce qui pose question. La méthode est publique et chaque note peut être contestée.
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
          <button
            onClick={onGoToDashboard}
            className="px-6 py-3 bg-accent hover:bg-accent-hover text-on-accent text-sm font-medium rounded-sm cursor-pointer transition-colors"
          >
            Analyser mon portefeuille
          </button>
          <button
            onClick={onOpenDimeSimulator}
            className="text-sm underline underline-offset-4 text-slate-700 hover:text-slate-900 cursor-pointer transition-colors"
          >
            Calculer ma dîme sur dividendes
          </button>
        </div>
      </section>

      {/* Extrait réel de la base : l'objet central du produit */}
      <section className="pb-20">
        <div className="flex flex-wrap justify-between gap-2 border-t border-gray-200 pt-3 text-sm text-slate-500">
          <span><strong className="font-semibold text-slate-900">Extrait de la base</strong> — {assets.length} actifs analysés</span>
          <span>Notes sur 100</span>
        </div>
        <div className="overflow-x-auto table-container">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr>
                <th className={clsx(th, 'text-left pl-0')}>Ligne</th>
                <th className={th}>Vie</th>
                <th className={th}>Écologie</th>
                <th className={th}>Travail</th>
                <th className={th}>Gouvernance</th>
                <th className={th}>Score</th>
                <th className={th}>Dividende</th>
                <th className={clsx(th, 'text-left')}>Verdict</th>
              </tr>
            </thead>
            <tbody>
              {sample.map(a => {
                const v = VERDICT[a.status];
                const p = a.catholic.pillars;
                return (
                  <tr key={a.isin}>
                    <td className={clsx(td, 'text-left pl-0')}>
                      <span className="block text-slate-900">{a.name}</span>
                      <span className="block text-xs text-slate-500">{a.isin}</span>
                    </td>
                    <td className={td}>{Math.round(p.bioethics)}</td>
                    <td className={td}>{Math.round(p.environmental)}</td>
                    <td className={td}>{Math.round(p.social_solidarity)}</td>
                    <td className={td}>{Math.round(p.governance)}</td>
                    <td className={clsx(td, 'font-semibold text-slate-900')}>{a.catholic.dse_score}</td>
                    <td className={td}>{a.key_info.dividend_yield_pct.toFixed(1)} %</td>
                    <td className={clsx(td, 'text-left')}>
                      <span className={clsx('inline-flex items-center gap-2', v.text)}>
                        <span className="w-2 h-2 rounded-full bg-current" />
                        {v.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Un fonds peut bien performer en Bourse et être jugé incompatible : les deux informations
          restent séparées.
        </p>
      </section>

      <section className="py-20 border-t border-gray-200">
        <h2 className="font-serif text-3xl text-slate-900 max-w-xl">Quatre critères, notés séparément</h2>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-8">
          {CRITERIA.map(([t, d]) => (
            <div key={t} className="border-t border-gray-200 pt-4">
              <h3 className="font-semibold text-slate-900 mb-1.5">{t}</h3>
              <p className="text-sm leading-relaxed text-slate-600">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="pb-20"><PerformanceComparator onExplorePortfolio={onGoToDashboard} /></section>
      <section className="pb-20"><TopDividendsRanking onAddAsset={onAddAsset} /></section>

      <section className="py-20 border-t border-gray-200">
        <h2 className="font-serif text-3xl text-slate-900 max-w-xl">Ce que le score ne dit pas</h2>
        <div className="mt-10 grid md:grid-cols-3 gap-x-10 gap-y-8">
          {LIMITS.map(([t, d]) => (
            <div key={t} className="border-t border-gray-200 pt-4">
              <h3 className="font-semibold text-slate-900 mb-1.5">{t}</h3>
              <p className="text-sm leading-relaxed text-slate-600">{d}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap items-center gap-x-7 gap-y-4">
          <button
            onClick={onGoToDashboard}
            className="px-6 py-3 bg-accent hover:bg-accent-hover text-on-accent text-sm font-medium rounded-sm cursor-pointer transition-colors"
          >
            Ouvrir le tableau de bord
          </button>
          <button onClick={onOpenAuth} className="text-sm underline underline-offset-4 text-slate-700 hover:text-slate-900 cursor-pointer transition-colors">
            Se connecter
          </button>
        </div>
      </section>

      <footer className="pt-8 pb-12 border-t border-gray-200 text-xs leading-relaxed text-slate-500 max-w-3xl">
        <p className="font-semibold text-slate-900 mb-1">Homonobus</p>
        <p>
          Outil d'analyse extra-financière à titre informatif. Il ne constitue ni une recommandation
          d'achat ou de vente, ni un conseil en investissement personnalisé. Tout investissement
          comporte un risque de perte en capital ; les performances passées ne préjugent pas des
          performances futures.
        </p>
      </footer>
    </div>
  );
}
