import React from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip
} from 'recharts';
import { ShieldCheck, Leaf, HeartHandshake, Scale, Award } from 'lucide-react';
import clsx from 'clsx';

export interface PortfolioPillars {
  bioethics: number;
  environmental: number;
  social_solidarity: number;
  governance: number;
}

interface PortfolioPillarsRadarProps {
  pillars: PortfolioPillars;
  benchmarkPillars?: PortfolioPillars;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    const score = item.score;
    const bench = item.benchmark;

    let evaluation = 'Conforme';
    let evalColor = 'text-emerald-300 bg-emerald-950/80 border-emerald-500/30';
    if (score >= 90) {
      evaluation = 'Exemplaire (A+)';
      evalColor = 'text-emerald-300 bg-emerald-950/80 border-emerald-500/40';
    } else if (score >= 70) {
      evaluation = 'Conforme (A)';
      evalColor = 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30';
    } else if (score >= 50) {
      evaluation = 'Sous Vigilance (B)';
      evalColor = 'text-amber-300 bg-amber-950/80 border-amber-500/30';
    } else {
      evaluation = 'Non Conforme (C)';
      evalColor = 'text-rose-300 bg-rose-950/80 border-rose-500/30';
    }

    return (
      <div className="bg-panel px-3.5 py-2.5 border border-white/10 text-xs font-sans min-w-[210px] text-white rounded-none">
        <div className="text-slate-400 font-mono text-xs mb-0.5">
          PILIER CATHOLIQUE
        </div>
        <div className="font-bold text-white text-sm mb-1.5 leading-snug">
          {item.fullName}
        </div>

        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-slate-400">Score Portefeuille :</span>
          <span className="font-mono font-semibold text-emerald-400 text-sm">
            {score} / 100
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 pb-1.5 border-b border-white/[0.08]">
          <span>Indice conventionnel :</span>
          <span className="font-mono text-slate-300">{bench} / 100</span>
        </div>

        <div className="flex items-center justify-between pt-0.5">
          <span className="text-xs text-slate-400">Appréciation :</span>
          <span className={clsx('text-xs font-bold px-2 py-0.5 border rounded-none', evalColor)}>
            {evaluation}
          </span>
        </div>
      </div>
    );
  }
  return null;
}

export function PortfolioPillarsRadar({
  pillars,
  benchmarkPillars = { bioethics: 55, environmental: 58, social_solidarity: 54, governance: 62 }
}: PortfolioPillarsRadarProps) {
  const chartData = [
    {
      pillar: 'Bioéthique',
      fullName: 'Bioéthique & Respect de la Vie',
      score: Math.round(pillars.bioethics),
      benchmark: benchmarkPillars.bioethics,
      fullMark: 100
    },
    {
      pillar: 'Laudato Si\'',
      fullName: 'Environnement & Laudato Si\'',
      score: Math.round(pillars.environmental),
      benchmark: benchmarkPillars.environmental,
      fullMark: 100
    },
    {
      pillar: 'Solidarité',
      fullName: 'Solidarité Sociale & Justice',
      score: Math.round(pillars.social_solidarity),
      benchmark: benchmarkPillars.social_solidarity,
      fullMark: 100
    },
    {
      pillar: 'Gouvernance',
      fullName: 'Gouvernance Fraternelle',
      score: Math.round(pillars.governance),
      benchmark: benchmarkPillars.governance,
      fullMark: 100
    }
  ];

  const averageScore = Math.round(
    (pillars.bioethics + pillars.environmental + pillars.social_solidarity + pillars.governance) / 4
  );

  const pillarCards = [
    {
      name: 'Bioéthique',
      fullName: 'Respect Sacré de la Vie',
      score: Math.round(pillars.bioethics),
      icon: ShieldCheck,
      description: 'Zéro avortement, clonage ou recherche embryonnaire'
    },
    {
      name: 'Laudato Si\'',
      fullName: 'Écologie Intégrale',
      score: Math.round(pillars.environmental),
      icon: Leaf,
      description: 'Sauvegarde de la Création & sortie des forages fossiles'
    },
    {
      name: 'Solidarité',
      fullName: 'Justice du Travail',
      score: Math.round(pillars.social_solidarity),
      icon: HeartHandshake,
      description: 'Dignité humaine, salaires décents & justice salariale'
    },
    {
      name: 'Gouvernance',
      fullName: 'Gouvernance Fraternelle',
      score: Math.round(pillars.governance),
      icon: Scale,
      description: 'Modération des écarts, transparence et bien commun'
    }
  ];

  return (
    <div className="bg-panel border border-white/10 p-6 rounded-none">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-white/[0.08]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 rounded-none">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Analyse Radar des 4 Piliers Catholiques
            </h3>
            <p className="text-xs text-slate-400">
              Alignement consolidé selon la Doctrine Sociale de l'Église
            </p>
          </div>
        </div>

        {/* Global Average Badge */}
        <div className="flex items-center gap-2 bg-emerald-950/60 px-3 py-1 border border-emerald-500/30 rounded-none">
          <span className="text-xs font-medium text-emerald-300 font-mono">
            Alignement Global :
          </span>
          <span className="font-mono font-semibold text-emerald-400 text-sm">
            {averageScore}/100
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Radar Chart (Recharts) */}
        <div className="md:col-span-6 h-[250px] select-none flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={chartData} margin={{ top: 12, right: 24, bottom: 12, left: 24 }}>
              <PolarGrid stroke="#d9dde3" strokeDasharray="3 3" />
              <PolarAngleAxis
                dataKey="pillar"
                tick={{ fill: '#121b2b', fontSize: 11, fontWeight: 700, fontFamily: 'inherit' }}
              />
              <PolarRadiusAxis
                angle={45}
                domain={[0, 100]}
                tick={{ fill: '#64748b', fontSize: 9 }}
                stroke="#334155"
              />
              
              {/* Benchmark Radar (conventionnel) */}
              <Radar
                name="Marché conventionnel"
                dataKey="benchmark"
                stroke="#64748b"
                fill="#9aa3b2"
                fillOpacity={0.25}
                strokeDasharray="4 4"
                strokeWidth={1.5}
              />

              {/* Portfolio Radar */}
              <Radar
                name="Mon Portefeuille"
                dataKey="score"
                stroke="#1f6b4f"
                fill="#1f6b4f"
                fillOpacity={0.4}
                strokeWidth={2}
                dot={{
                  r: 3,
                  fill: '#1f6b4f',
                  stroke: '#ffffff',
                  strokeWidth: 1.5
                }}
              />

              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* 4 Pillars Breakdown Cards */}
        <div className="md:col-span-6 grid grid-cols-2 gap-2.5">
          {pillarCards.map(p => {
            const Icon = p.icon;
            const isExcellent = p.score >= 85;
            const isGood = p.score >= 70;

            return (
              <div
                key={p.name}
                className="p-3.5 bg-raised border border-white/[0.08] hover:border-white/[0.15] transition-colors flex flex-col justify-between rounded-none"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      {p.name}
                    </span>
                    <span
                      className={clsx(
                        'text-xs font-mono font-semibold px-1.5 py-0.5 rounded-none',
                        isExcellent
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                          : isGood
                          ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                      )}
                    >
                      {p.score}/100
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-medium leading-tight mb-1">
                    {p.fullName}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-1.5">
                  <div className="w-full bg-raised h-1.5 overflow-hidden rounded-none">
                    <div
                      className={clsx(
                        'h-full transition-all duration-500 rounded-none',
                        isExcellent ? 'bg-emerald-400' : isGood ? 'bg-emerald-500' : 'bg-amber-400'
                      )}
                      style={{ width: `${Math.min(100, Math.max(0, p.score))}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-500 block mt-1 line-clamp-1 font-mono">
                    {p.description}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend footnote */}
      <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/[0.08] text-xs text-slate-400 font-mono">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-emerald-400 inline-block" />
            <span className="text-slate-300 font-medium font-sans">Portefeuille Homonobus (DSE)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-slate-500 inline-block border border-dashed border-slate-400" />
            <span className="text-slate-500 font-medium font-sans">Indice conventionnel</span>
          </div>
        </div>
        <span className="hidden sm:inline text-slate-500 text-xs">
          Méthodologie inspirée de la doctrine sociale de l'Église
        </span>
      </div>
    </div>
  );
}
