import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Printer,
  X,
  ShieldCheck,
  Award,
  CheckCircle2,
  Calendar,
  Building,
  Download,
  Share2
} from 'lucide-react';
import { PortfolioItem } from '../actions';
import { PortfolioPillars } from './PortfolioPillarsRadar';
import clsx from 'clsx';

interface CertificateModalProps {
  open: boolean;
  onClose: () => void;
  portfolio: PortfolioItem[];
  dseScore: number;
  grade: string;
  totalVal: number;
  pillars: PortfolioPillars;
  pastoralGuide: 'CEF' | 'USCCB' | 'VATICAN';
  investorProfile: 'famille' | 'congregation' | 'fondation';
}

export function CertificateModal({
  open,
  onClose,
  portfolio,
  dseScore,
  grade,
  totalVal,
  pillars,
  pastoralGuide,
  investorProfile
}: CertificateModalProps) {
  const printRef = useRef<HTMLDivElement>(null);

  if (!open) return null;

  const certNumber = `HMB-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
  const dateStr = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const guideLabel =
    pastoralGuide === 'CEF'
      ? 'Conférence des Évêques de France (CEF)'
      : pastoralGuide === 'USCCB'
      ? 'United States Conference of Catholic Bishops (USCCB)'
      : 'Vatican - Académie Pontificale des Sciences Sociales';

  const profileLabel =
    investorProfile === 'congregation'
      ? 'Congrégation Religieuse & Diocèse'
      : investorProfile === 'fondation'
      ? 'Fondation & Institutionnel Chrétien'
      : 'Famille Chrétienne & Particulier';

  const handlePrint = () => {
    window.print();
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
          className="fixed inset-0 bg-black/80 print:hidden"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 12 }}
          className="relative bg-panel rounded-none border border-white/10 w-full max-w-2xl max-h-[92vh] overflow-y-auto z-10 p-6 sm:p-8 font-sans text-slate-100 print:bg-white print:text-black print:shadow-none print:border-none print:p-0 print:m-0 print:max-w-none print:w-full"
        >
          {/* Action buttons (hidden on print) */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.08] print:hidden">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-400" />
              <span className="font-bold text-sm text-white">
                Rapport d'analyse DSE
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="py-2 px-4 bg-accent hover:bg-accent-hover text-on-accent font-bold text-xs rounded-none flex items-center gap-1.5 transition-all cursor-pointer font-mono"
              >
                <Printer className="w-3.5 h-3.5 text-slate-950" />
                Imprimer / Exporter PDF
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white bg-white/[0.06] hover:bg-white/[0.12] transition-colors cursor-pointer rounded-none"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Printable Document Sheet (Clean, formal, authoritative) */}
          <div ref={printRef} className="p-6 sm:p-8 bg-paper text-slate-100 rounded-none border border-slate-800 print:bg-paper print:border-none print:p-0">
            {/* Header Document */}
            <div className="text-center pb-6 border-b-2 border-emerald-200 mb-6">
              <div className="flex justify-center mb-2">
                <div className="w-12 h-12 rounded-none bg-emerald-100 text-paper flex items-center justify-center font-serif text-2xl font-semibold border border-emerald-300">
                  H
                </div>
              </div>
              <h2 className="text-xs font-bold text-emerald-200 font-mono">
                Homonobus
              </h2>
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-100 mt-1 font-serif">
                Rapport d'analyse extra-financière
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Délivré en conformité avec la Doctrine Sociale de l'Église (DSE) et l'encyclique <em>Laudato si'</em>
              </p>
            </div>

            {/* Meta tags */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-6 p-3 rounded-none bg-slate-950 border border-slate-800">
              <div>
                <span className="text-slate-600 block text-xs font-mono">N° CERTIFICAT</span>
                <span className="font-mono font-bold text-slate-100">{certNumber}</span>
              </div>
              <div>
                <span className="text-slate-600 block text-xs font-mono">DATE D'AUDIT</span>
                <span className="font-medium text-slate-200">{dateStr}</span>
              </div>
              <div>
                <span className="text-slate-600 block text-xs font-mono">PROFIL DÉCLARÉ</span>
                <span className="font-semibold text-slate-200 truncate block">{profileLabel}</span>
              </div>
              <div>
                <span className="text-slate-600 block text-xs font-mono">RÉFÉRENTIEL</span>
                <span className="font-semibold text-emerald-200 truncate block">{pastoralGuide}</span>
              </div>
            </div>

            {/* Score & Verdict Banner */}
            <div className="p-5 rounded-none bg-emerald-50 text-paper mb-6 flex items-center justify-between border border-emerald-200">
              <div>
                <span className="text-xs font-semibold text-emerald-800 block mb-1 font-mono">
                  Évaluation Globale Consolidée
                </span>
                <h3 className="text-3xl font-semibold font-mono">
                  {dseScore} <span className="text-lg font-sans font-normal text-emerald-800">/ 100</span>
                </h3>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-none bg-white/20 text-paper text-xs font-bold border border-white/30 font-mono">
                  {grade}
                </span>
              </div>

              <div className="text-right">
                <span className="text-xs text-emerald-800 block font-mono">Valeur Portefeuille</span>
                <span className="text-lg font-mono font-bold text-paper">
                  {totalVal.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                </span>
                <span className="text-xs text-emerald-800 block mt-1 font-mono">
                  {portfolio.length} positions auditées
                </span>
              </div>
            </div>

            {/* Breakdown across the 4 Pillars */}
            <div className="mb-6">
              <h4 className="text-xs font-mono font-bold text-slate-400 mb-3">
                Résultats par Pilier Fondamental de la DSE :
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs">
                <div className="p-3 rounded-none bg-slate-950 border border-slate-800">
                  <span className="text-xs text-slate-500 block mb-1 font-mono">1. Bioéthique</span>
                  <span className="font-mono font-semibold text-emerald-300 text-base">{pillars.bioethics}/100</span>
                  <span className="text-xs text-slate-600 block mt-0.5">Vie naissante & fin</span>
                </div>

                <div className="p-3 rounded-none bg-slate-950 border border-slate-800">
                  <span className="text-xs text-slate-500 block mb-1 font-mono">2. Laudato Si'</span>
                  <span className="font-mono font-semibold text-emerald-300 text-base">{pillars.environmental}/100</span>
                  <span className="text-xs text-slate-600 block mt-0.5">Écologie Intégrale</span>
                </div>

                <div className="p-3 rounded-none bg-slate-950 border border-slate-800">
                  <span className="text-xs text-slate-500 block mb-1 font-mono">3. Solidarité</span>
                  <span className="font-mono font-semibold text-emerald-300 text-base">{pillars.social_solidarity}/100</span>
                  <span className="text-xs text-slate-600 block mt-0.5">Justice du travail</span>
                </div>

                <div className="p-3 rounded-none bg-slate-950 border border-slate-800">
                  <span className="text-xs text-slate-500 block mb-1 font-mono">4. Gouvernance</span>
                  <span className="font-mono font-semibold text-emerald-300 text-base">{pillars.governance}/100</span>
                  <span className="text-xs text-slate-600 block mt-0.5">Équité fraternelle</span>
                </div>
              </div>
            </div>

            {/* Audited Assets Table */}
            <div className="mb-6">
              <h4 className="text-xs font-mono font-bold text-slate-400 mb-2">
                Inventaire des Lignes en Portefeuille :
              </h4>
              <div className="border border-slate-800 rounded-none overflow-hidden text-xs bg-paper">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-900 text-slate-400 text-xs font-bold font-mono">
                    <tr>
                      <th className="p-2.5">Actif / ISIN</th>
                      <th className="p-2.5">Valeur</th>
                      <th className="p-2.5">Statut</th>
                      <th className="p-2.5 text-right">Score DSE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900">
                    {portfolio.map(item => (
                      <tr key={item.isin} className="hover:bg-slate-950">
                        <td className="p-2.5">
                          <div className="font-semibold text-slate-100">{item.name}</div>
                          <div className="text-xs font-mono text-slate-500">{item.isin} · {item.ticker}</div>
                        </td>
                        <td className="p-2.5 font-mono">
                          {item.total_value.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                        </td>
                        <td className="p-2.5">
                          <span
                            className={clsx(
                              'text-xs font-bold px-2 py-0.5 rounded-none font-mono',
                              item.status === 'compatible'
                                ? 'bg-emerald-900 text-emerald-200 border border-emerald-700'
                                : item.status === 'warning'
                                ? 'bg-amber-900 text-amber-200 border border-amber-700'
                                : 'bg-rose-900 text-rose-200 border border-rose-700'
                            )}
                          >
                            {item.status === 'compatible' ? 'Compatible' : item.status === 'warning' ? 'Vigilance' : '✕ Non conforme'}
                          </span>
                        </td>
                        <td className="p-2.5 text-right font-mono font-bold text-slate-100">
                          {item.catholic.dse_score}/100
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Official Stamp & Signatures */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-200 block">Analyse automatisée Homonobus</span>
                <span className="text-xs text-slate-500 block">Indicatif : n'émane d'aucune autorité ecclésiale</span>
              </div>

              {/* Sceau officiel institutionnel (rectangulaire avec double filet) */}
              <div className="border-2 border-double border-emerald-100 rounded-none flex flex-col items-center justify-center p-3 text-center rotate-[-2deg] text-emerald-50 select-none bg-emerald-950/40">
                <span className="text-[8px] font-mono block font-bold">ANALYSE AUTOMATISÉE</span>
                <span className="text-xs font-semibold my-0.5 font-mono">Score indicatif</span>
                <span className="text-[8px] font-mono block text-emerald-200">HOMONOBUS 2026</span>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-4 pt-3 border-t border-white/[0.08] text-center text-xs text-slate-500 font-mono print:hidden">
            Document indicatif généré automatiquement. Il ne constitue ni une attestation officielle de l'Église ni un conseil en investissement.
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
