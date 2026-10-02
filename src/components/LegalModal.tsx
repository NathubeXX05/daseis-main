import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, FileText, Scales, EnvelopeSimple, Check } from '@phosphor-icons/react';

export type LegalTab = 'mentions' | 'rgpd' | 'cgu';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: LegalTab;
}

export function LegalModal({ isOpen, onClose, initialTab = 'mentions' }: LegalModalProps) {
  const [activeTab, setActiveTab] = useState<LegalTab>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  // Bloquer le scroll d'arrière-plan quand le modal est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
          {/* Backdrop avec flou */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-[#0c1222] border border-white/15 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden z-10 text-slate-200"
          >
            {/* Header Sticky */}
            <div className="p-4 sm:p-6 border-b border-white/10 bg-[#090e1b]/95 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img src="/logo-wordmark.png" alt="DASEIS" className="h-6 w-auto object-contain" />
                <span className="text-xs uppercase tracking-wider text-slate-400 font-mono pl-3 border-l border-white/10 hidden sm:inline">
                  Documents Légaux & Conformité
                </span>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 sm:static p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer border border-white/10"
                aria-label="Fermer"
              >
                <X size={18} weight="bold" />
              </button>
            </div>

            {/* Onglets de navigation */}
            <div className="flex border-b border-white/10 bg-[#070b16] px-4 sm:px-6 gap-2 overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setActiveTab('mentions')}
                className={`py-3 px-3.5 text-xs sm:text-sm font-medium border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'mentions'
                    ? 'border-blue-500 text-white font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText size={16} className={activeTab === 'mentions' ? 'text-blue-400' : ''} />
                <span>Mentions Légales</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('rgpd')}
                className={`py-3 px-3.5 text-xs sm:text-sm font-medium border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'rgpd'
                    ? 'border-blue-500 text-white font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <ShieldCheck size={16} className={activeTab === 'rgpd' ? 'text-emerald-400' : ''} />
                <span>Notice RGPD & Données</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('cgu')}
                className={`py-3 px-3.5 text-xs sm:text-sm font-medium border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'cgu'
                    ? 'border-blue-500 text-white font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Scales size={16} className={activeTab === 'cgu' ? 'text-indigo-400' : ''} />
                <span>Conditions Générales (CGU)</span>
              </button>
            </div>

            {/* Corps défilable */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6 text-xs sm:text-sm leading-relaxed text-slate-300">
              {/* ONGLET 1 : MENTIONS LÉGALES */}
              {activeTab === 'mentions' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="border-b border-white/10 pb-4">
                    <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                      Mentions Légales
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Conformément aux dispositions des articles 6-III et 19 de la Loi n° 2004-575 du 21 juin 2004 pour la Confiance dans l'Économie Numérique (LCEN).
                    </p>
                  </div>

                  <section className="space-y-2">
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider text-blue-400">
                      1. Éditeur de la plateforme
                    </h3>
                    <div className="bg-slate-900/60 p-4 rounded-xl border border-white/5 space-y-1.5">
                      <p><strong>Plateforme :</strong> DASEIS (Daseis Foundation / Réseau Daseis)</p>
                      <p><strong>Activité :</strong> Plateforme de mutualisation, mise en relation et négociation de tarifs préférentiels d'achats groupés entre professionnels (instituts de beauté, esthéticiennes, salons de coiffure, prothésistes ongulaires, artisans indépendants) et fournisseurs ou marques agréées.</p>
                      <p><strong>Contact électronique :</strong> <a href="mailto:daseis.foundation@gmail.com" className="text-blue-400 underline font-mono">daseis.foundation@gmail.com</a></p>
                      <p><strong>Directeur de la publication :</strong> L'équipe de direction Daseis Foundation.</p>
                    </div>
                  </section>

                  <section className="space-y-2">
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider text-blue-400">
                      2. Hébergement du site
                    </h3>
                    <div className="bg-slate-900/60 p-4 rounded-xl border border-white/5 space-y-1.5">
                      <p><strong>Hébergeur :</strong> Cloudflare, Inc.</p>
                      <p><strong>Adresse :</strong> 101 Townsend St, San Francisco, CA 94107, États-Unis d'Amérique</p>
                      <p><strong>Site web :</strong> <a href="https://www.cloudflare.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">https://www.cloudflare.com</a></p>
                      <p>Infrastructure Edge distribuée mondialement et réseau sécurisé conforme aux standards de sécurité internet.</p>
                    </div>
                  </section>

                  <section className="space-y-2">
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider text-blue-400">
                      3. Propriété intellectuelle
                    </h3>
                    <p>
                      La structure générale du site, les textes, graphismes, images, logos, typographies, icônes, simulateurs et éléments logiciels composant la plateforme <strong>DASEIS</strong> sont la propriété exclusive de Daseis ou font l'objet d'une autorisation d'utilisation régulière.
                    </p>
                    <p>
                      Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est strictement interdite sans l'autorisation écrite préalable de Daseis.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider text-blue-400">
                      4. Limitation de responsabilité
                    </h3>
                    <p>
                      Daseis agit en qualité d'intermédiaire et facilitateur de négociation de volume. Les contrats de vente de matériel, produits cosmétiques, consommables ou équipements sont passés directement entre les professionnels acheteurs et les fournisseurs ou distributeurs partenaires. Daseis ne saurait être tenu responsable des délais de livraison, de la disponibilité des stocks, de la conformité des marchandises vendues par les tiers ou d'éventuels litiges commerciaux entre l'adhérent et le fournisseur.
                    </p>
                  </section>
                </div>
              )}

              {/* ONGLET 2 : NOTICE RGPD */}
              {activeTab === 'rgpd' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="border-b border-white/10 pb-4">
                    <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
                      <ShieldCheck size={22} className="text-emerald-400" />
                      Notice RGPD & Protection des Données Personnelles
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Conforme au Règlement Général sur la Protection des Données (RGPD n° 2016/679) et à la loi Informatique et Libertés du 6 janvier 1978 modifiée.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-emerald-200 text-xs">
                    <strong>Notre engagement éthique :</strong> Daseis ne vend, ne loue et ne cède JAMAIS vos données personnelles à des fins publicitaires. Vos coordonnées sont exclusivement utilisées pour activer vos remises auprès des fournisseurs et vous transmettre vos codes partenaires.
                  </div>

                  <section className="space-y-2">
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider text-emerald-400">
                      1. Responsable du traitement
                    </h3>
                    <p>
                      Le responsable du traitement des données collectées via la plateforme Daseis est Daseis Foundation.
                    </p>
                    <p>
                      Pour toute question relative à vos données ou pour contacter notre référent données :
                      <a href="mailto:daseis.foundation@gmail.com" className="ml-1 text-blue-400 underline font-mono">
                        daseis.foundation@gmail.com
                      </a>
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider text-emerald-400">
                      2. Données collectées
                    </h3>
                    <p>Dans le cadre de votre demande de code partenaire ou de partenariat fournisseur, nous collectons les informations suivantes :</p>
                    <ul className="list-disc pl-5 space-y-1 text-slate-300">
                      <li><strong>Identité :</strong> Nom et prénom du professionnel référent.</li>
                      <li><strong>Établissement :</strong> Nom du salon, institut, enseigne ou atelier artisanal.</li>
                      <li><strong>Coordonnées professionnelles :</strong> Adresse email, numéro de téléphone portable (pour confirmation de code par SMS).</li>
                      <li><strong>Activité & Besoins :</strong> Produits recherchés, marques habituelles, estimations d'achats issues du simulateur.</li>
                      <li><strong>Rôle :</strong> Institut / Salon / Artisan ou Fournisseur / Distributeur.</li>
                    </ul>
                  </section>

                  <section className="space-y-2">
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider text-emerald-400">
                      3. Finalités et Bases légales
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-3 pt-1">
                      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                        <strong className="text-white text-xs block">Génération & Transmission des Codes</strong>
                        <p className="text-[11px] text-slate-400">Base légale : Exécution de mesures précontractuelles et contractuelles sollicitées par l'utilisateur (Art. 6.1.b du RGPD).</p>
                      </div>
                      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                        <strong className="text-white text-xs block">Mise en relation avec les Fournisseurs</strong>
                        <p className="text-[11px] text-slate-400">Base légale : Consentement explicite lors de la validation du formulaire (Art. 6.1.a du RGPD).</p>
                      </div>
                    </div>
                  </section>

                  <section className="space-y-2">
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider text-emerald-400">
                      4. Destinataires et Sous-traitants
                    </h3>
                    <p>Les données sont transmises exclusivement à :</p>
                    <ul className="list-disc pl-5 space-y-1 text-slate-300">
                      <li>L'équipe habilitée de Daseis en charge de la qualification des dossiers.</li>
                      <li>Les grossistes et marques partenaires habilités (uniquement les informations nécessaires à l'ouverture de votre compte remisé).</li>
                      <li><strong>Resend Inc.</strong> : Opérateur d'infrastructure d'envoi d'emails transactionnels, opérant en conformité stricte avec le RGPD (Data Processing Agreement).</li>
                    </ul>
                  </section>

                  <section className="space-y-2">
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider text-emerald-400">
                      5. Durée de conservation
                    </h3>
                    <p>
                      Vos données sont conservées pendant une durée maximale de <strong>3 ans</strong> à compter du dernier contact émanant de votre part, ou pendant toute la durée active de validité de votre compte partenaire Daseis.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider text-emerald-400">
                      6. Vos droits et comment les exercer
                    </h3>
                    <p>Conformément aux articles 15 à 22 du RGPD, vous disposez des droits suivants :</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 py-1 text-xs">
                      <span className="p-2 rounded bg-slate-900 border border-white/5 text-center text-slate-200">Droit d'accès</span>
                      <span className="p-2 rounded bg-slate-900 border border-white/5 text-center text-slate-200">Droit de rectification</span>
                      <span className="p-2 rounded bg-slate-900 border border-white/5 text-center text-slate-200">Droit à l'effacement</span>
                      <span className="p-2 rounded bg-slate-900 border border-white/5 text-center text-slate-200">Droit d'opposition</span>
                      <span className="p-2 rounded bg-slate-900 border border-white/5 text-center text-slate-200">Droit à la limitation</span>
                      <span className="p-2 rounded bg-slate-900 border border-white/5 text-center text-slate-200">Droit à la portabilité</span>
                    </div>
                    <p>
                      Pour exercer l'un de ces droits, envoyez simplement un email accompagné de votre nom et enseigne à :
                      <a href="mailto:daseis.foundation@gmail.com" className="ml-1 text-blue-400 underline font-mono">
                        daseis.foundation@gmail.com
                      </a>.
                      Une réponse vous sera apportée sous 30 jours maximum.
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Si vous estimez que vos droits ne sont pas respectés, vous avez la faculté d'introduire une réclamation auprès de la CNIL (<a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="underline">www.cnil.fr</a>).
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider text-emerald-400">
                      7. Cookies et Traceurs
                    </h3>
                    <p>
                      La plateforme Daseis n'utilise aucun cookie publicitaire, aucun traceur de profilage commercial intrusif, ni outil tiers revendant vos données de navigation. Seuls les éléments techniques indispensables au fonctionnement de la session et au chargement des interfaces sont mis en œuvre.
                    </p>
                  </section>
                </div>
              )}

              {/* ONGLET 3 : CONDITIONS GÉNÉRALES (CGU) */}
              {activeTab === 'cgu' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="border-b border-white/10 pb-4">
                    <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
                      <Scales size={22} className="text-indigo-400" />
                      Conditions Générales d'Utilisation (CGU)
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Règles régissant l'utilisation de la plateforme Daseis par les professionnels instituts, salons, artisans et fournisseurs.
                    </p>
                  </div>

                  <section className="space-y-2">
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider text-indigo-400">
                      Article 1 — Objet de la plateforme
                    </h3>
                    <p>
                      Les présentes Conditions Générales d'Utilisation ont pour objet de définir les modalités d'accès et d'utilisation des services proposés par <strong>DASEIS</strong>.
                      Daseis est un réseau de mutualisation d'achats destiné aux professionnels indépendants de la beauté, de l'esthétique, de la coiffure, de l'onglerie et des ateliers artisanaux, leur permettant de bénéficier de tarifs remisés auprès de fournisseurs et marques référencées.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider text-indigo-400">
                      Article 2 — Gratuité totale pour les instituts et artisans
                    </h3>
                    <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-500/20 text-slate-200">
                      <p>
                        L'inscription à Daseis, la délivrance des codes partenaires, la simulation d'économies et l'accès aux catalogues remisés sont <strong>100% gratuits et sans engagement</strong> de volume ni de récurrence pour les instituts, salons et artisans.
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Le modèle économique de Daseis repose sur une rémunération apportée par les fournisseurs partenaires sous forme d'honoraires de référencement de volume d'affaires.
                      </p>
                    </div>
                  </section>

                  <section className="space-y-2">
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider text-indigo-400">
                      Article 3 — Éligibilité des utilisateurs
                    </h3>
                    <p>
                      Le service est exclusivement réservé aux professionnels : entreprises individuelles, micro-entrepreneurs, sociétés commerciales ou artisans régulièrement déclarés, exerçant une activité dans le secteur de la beauté, de l'artisanat bien-être ou de la distribution professionnelle.
                    </p>
                    <p>
                      Daseis se réserve la possibilité de vérifier l'exactitude des informations professionnelles transmises afin de préserver l'exclusivité des remises réservées aux professionnels.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider text-indigo-400">
                      Article 4 — Utilisation des codes partenaires
                    </h3>
                    <p>
                      Chaque code partenaire transmis par Daseis est attribué à titre individuel et professionnel à l'établissement ou à l'artisan demandeur. Il permet d'appliquer la remise négociée directement sur les boutiques en ligne, bons de commande ou factures des distributeurs partenaires.
                    </p>
                    <p>
                      Il est strictement interdit de revendre, publier sur des forums publics ou diffuser les codes partenaires à des particuliers. Tout abus pourra entraîner la désactivation immédiate du code auprès du réseau.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider text-indigo-400">
                      Article 5 — Rôle d'intermédiaire & absence de vente directe
                    </h3>
                    <p>
                      Daseis intervient en tant que plateforme de mise en relation et de négociation de conditions tarifaires. Daseis n'est en aucun cas le vendeur direct des produits, cosmétiques ou matériels.
                    </p>
                    <p>
                      Par conséquent, les commandes, les modalités de paiement, la facturation, l'expédition, la livraison, le service après-vente et la garantie légale des produits relèvent de la responsabilité exclusive des fournisseurs et marques chez lesquels la commande est passée.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider text-indigo-400">
                      Article 6 — Droit applicable et résolution des litiges
                    </h3>
                    <p>
                      Les présentes CGU sont régies et soumises au droit français. En cas de différend relatif à l'interprétation ou à l'exécution des présentes, les parties s'engagent à rechercher préalablement une solution amiable en contactant le support :
                      <a href="mailto:daseis.foundation@gmail.com" className="ml-1 text-blue-400 underline font-mono">
                        daseis.foundation@gmail.com
                      </a>.
                    </p>
                    <p>
                      À défaut de résolution amiable, tout litige sera porté devant les tribunaux compétents du ressort de la juridiction compétente.
                    </p>
                  </section>
                </div>
              )}
            </div>

            {/* Footer Modal */}
            <div className="p-4 sm:p-5 border-t border-white/10 bg-[#090e1b] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-400">
                <EnvelopeSimple size={16} className="text-blue-400" />
                <span>Besoin d'un renseignement juridique ?</span>
                <a href="mailto:daseis.foundation@gmail.com" className="text-blue-400 hover:underline font-mono">
                  daseis.foundation@gmail.com
                </a>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="btn-pressable w-full sm:w-auto px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-lg shadow-blue-600/20"
              >
                <Check size={14} weight="bold" />
                <span>J'ai compris</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
