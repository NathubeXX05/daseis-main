import React, { useState } from 'react';
import { 
  ArrowRight, 
  CheckCircle, 
  ShieldCheck, 
  Sparkle, 
  Tag, 
  Storefront, 
  Handshake, 
  Percent, 
  Calculator, 
  CaretDown, 
  EnvelopeSimple, 
  Phone, 
  Buildings, 
  User, 
  PaperPlaneTilt,
  List,
  X,
  TrendUp,
  Clock,
  Package,
  Question,
  Copy,
  Check,
  Quotes
} from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'motion/react';

// Types
type ActivityType = 'esthetic' | 'nails' | 'hair' | 'spa';

interface SimulatorProfile {
  title: string;
  defaultSpend: number;
  sampleProducts: string;
}

const SIMULATOR_PROFILES: Record<ActivityType, SimulatorProfile> = {
  esthetic: {
    title: 'Institut de Beauté & Soins',
    defaultSpend: 1400,
    sampleProducts: 'Cires pelables, lotions pré/post, consommables cabine, draps d\'examen',
  },
  nails: {
    title: 'Onglerie & Nail Bar',
    defaultSpend: 900,
    sampleProducts: 'Vernis semi-permanents, gels UV/LED, embouts ponceuse, désinfectants',
  },
  hair: {
    title: 'Coiffure & Salon Mixte',
    defaultSpend: 2200,
    sampleProducts: 'Colorations techniques, shampoings bac, oxydants, soins profonds',
  },
  spa: {
    title: 'Spa, Massage & Bien-être',
    defaultSpend: 3100,
    sampleProducts: 'Huiles neutres et essentielles, serviettes jetables, gommages corps',
  },
};

// 1. Header Navigation
function Header({ onOpenContact }: { onOpenContact: (role?: 'institut' | 'fournisseur') => void }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#080d1a]/85 backdrop-blur-md border-b border-white/[0.08] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
                <span className="text-white font-extrabold text-lg tracking-wider">D</span>
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors">
                  DASEIS
                </span>
                <span className="hidden sm:inline-block ml-2 text-[10px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-400">
                  Réseau Pro
                </span>
              </div>
            </a>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7">
            <a href="#comment-ca-marche" className="text-sm font-medium text-slate-300 hover:text-white transition-colors duration-150">
              Comment ça marche
            </a>
            <a href="#simulateur" className="text-sm font-medium text-slate-300 hover:text-white transition-colors duration-150 flex items-center gap-1.5">
              <span>Simulateur</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </a>
            <a href="#solutions" className="text-sm font-medium text-slate-300 hover:text-white transition-colors duration-150">
              Pour qui ?
            </a>
            <a href="#transparence" className="text-sm font-medium text-slate-300 hover:text-white transition-colors duration-150">
              Modèle
            </a>
            <a href="#faq" className="text-sm font-medium text-slate-300 hover:text-white transition-colors duration-150">
              FAQ
            </a>
          </nav>

          {/* Action Button */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => onOpenContact('institut')}
              className="btn-pressable inline-flex items-center gap-2 px-4.5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-md shadow-blue-600/25 border border-blue-400/30 cursor-pointer"
            >
              <span>Demander mon code</span>
              <ArrowRight size={15} weight="bold" />
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-800/80 text-slate-200 border border-slate-700/60"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X size={22} weight="bold" /> : <List size={22} weight="bold" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="md:hidden border-b border-white/[0.08] bg-[#0c1222] px-4 pt-3 pb-6 space-y-3"
          >
            <a
              href="#comment-ca-marche"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm text-slate-300 hover:text-white"
            >
              Comment ça marche
            </a>
            <a
              href="#simulateur"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm text-slate-300 hover:text-white"
            >
              Simulateur d'économies
            </a>
            <a
              href="#solutions"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm text-slate-300 hover:text-white"
            >
              Instituts & Fournisseurs
            </a>
            <a
              href="#transparence"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm text-slate-300 hover:text-white"
            >
              Notre modèle
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm text-slate-300 hover:text-white"
            >
              FAQ
            </a>
            <div className="pt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenContact('institut');
                }}
                className="btn-pressable w-full py-3 rounded-lg bg-blue-600 text-white text-center text-sm font-semibold"
              >
                Demander mon code pro
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// 2. Hero Section with Interactive Savings Simulator (Split screen, anti-center)
function HeroSection({ onSelectActivity }: { onSelectActivity: (act: string, spend: number) => void }) {
  const [activity, setActivity] = useState<ActivityType>('esthetic');
  const [monthlySpend, setMonthlySpend] = useState<number>(1400);

  // Discount estimation between 18% and 25%
  const averageDiscountPct = 0.22;
  const monthlySavings = Math.round(monthlySpend * averageDiscountPct);
  const annualSavings = monthlySavings * 12;

  const currentProfile = SIMULATOR_PROFILES[activity];

  const handleActivityChange = (act: ActivityType) => {
    setActivity(act);
    setMonthlySpend(SIMULATOR_PROFILES[act].defaultSpend);
  };

  return (
    <section className="relative pt-12 pb-20 md:py-20 overflow-hidden">
      {/* Background glow orbs */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-48 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Value Proposition & Intent */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Pill Eyebrow (max 1 eyebrow rule respected) */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-300 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Tarifs grossistes négociés pour les professionnels de la beauté</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12]">
              Vos produits professionnels habituels.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-emerald-400">
                15% à 30% moins chers.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-[58ch]">
              Daseis fédère les commandes des instituts pour négocier des tarifs de groupe directement auprès des fabricants et distributeurs agréés.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <a
                href="#contact"
                className="btn-pressable inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-base shadow-lg shadow-blue-600/25 border border-blue-400/30 cursor-pointer"
              >
                <span>Obtenir mon code de réduction</span>
                <ArrowRight size={18} weight="bold" />
              </a>
              <a
                href="#simulateur"
                className="btn-pressable inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white font-medium text-base border border-white/[0.08]"
              >
                <Calculator size={18} className="text-blue-400" />
                <span>Simuler mes économies</span>
              </a>
            </div>

            {/* Quick Guarantees (under hero, clear icons) */}
            <div className="pt-4 grid grid-cols-3 gap-3 border-t border-white/[0.08] text-xs text-slate-400 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle size={16} weight="fill" className="text-emerald-400 flex-shrink-0" />
                <span>100% Gratuit pour l'institut</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={16} weight="fill" className="text-emerald-400 flex-shrink-0" />
                <span>Sans engagement</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Package size={16} weight="fill" className="text-emerald-400 flex-shrink-0" />
                <span>Direct fabricant</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Simulator Card */}
          <div id="simulateur" className="lg:col-span-5">
            <div className="relative bg-[#0e1628]/90 rounded-2xl p-6 sm:p-7 border border-white/[0.12] shadow-2xl shadow-black/60 backdrop-blur-xl">
              {/* Badge header */}
              <div className="flex items-center justify-between pb-5 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Calculator size={18} weight="bold" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Simulateur d'économies</h3>
                    <p className="text-[11px] text-slate-400">Calcul en temps réel selon votre activité</p>
                  </div>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  ~22% de remise
                </span>
              </div>

              {/* Activity Selector */}
              <div className="mt-5 space-y-2">
                <label className="block text-xs font-semibold text-slate-300">
                  Votre spécialité :
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(SIMULATOR_PROFILES) as ActivityType[]).map((key) => {
                    const active = activity === key;
                    return (
                      <button
                        key={key}
                        onClick={() => handleActivityChange(key)}
                        type="button"
                        className={`btn-pressable text-left px-3 py-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                          active
                            ? 'bg-blue-600/20 border-blue-500 text-white shadow-sm shadow-blue-500/20'
                            : 'bg-slate-900/60 border-slate-700/60 text-slate-300 hover:border-slate-600'
                        }`}
                      >
                        {key === 'esthetic' && '✨ Soins & Esthétique'}
                        {key === 'nails' && '💅 Onglerie & Nails'}
                        {key === 'hair' && '✂️ Coiffure & Salon'}
                        {key === 'spa' && '🌿 Spa & Massages'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Monthly Spend Slider */}
              <div className="mt-6 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-medium">Budget approvisionnement mensuel :</span>
                  <span className="text-sm font-mono font-bold text-white bg-slate-900 px-2.5 py-1 rounded border border-slate-700">
                    {monthlySpend.toLocaleString('fr-FR')} € HT / mois
                  </span>
                </div>
                <input
                  type="range"
                  min="400"
                  max="6000"
                  step="100"
                  value={monthlySpend}
                  onChange={(e) => setMonthlySpend(Number(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>400 €</span>
                  <span>2 500 €</span>
                  <span>6 000 €+</span>
                </div>
              </div>

              {/* Calculated Result Box */}
              <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-emerald-950/40 to-slate-900/80 border border-emerald-500/30">
                <div className="grid grid-cols-2 gap-4 text-center divide-x divide-white/[0.08]">
                  <div>
                    <span className="block text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                      Économie estimée
                    </span>
                    <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
                      +{monthlySavings} €
                    </span>
                    <span className="block text-[10px] text-slate-400">chaque mois</span>
                  </div>
                  <div>
                    <span className="block text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                      Gain annuel net
                    </span>
                    <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                      +{annualSavings.toLocaleString('fr-FR')} €
                    </span>
                    <span className="block text-[10px] text-emerald-400 font-medium">réinvestissable</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-emerald-500/20 text-[11px] text-slate-300 flex items-start gap-1.5">
                  <Sparkle size={14} className="text-emerald-400 mt-0.5 flex-shrink-0" weight="fill" />
                  <span>
                    <strong>Exemples de consommables remisés :</strong> {currentProfile.sampleProducts}
                  </span>
                </div>
              </div>

              {/* Apply Button */}
              <div className="mt-5">
                <a
                  href="#contact"
                  onClick={() => onSelectActivity(currentProfile.title, monthlySpend)}
                  className="btn-pressable w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-md shadow-blue-600/30 cursor-pointer"
                >
                  <span>Activer mon code pour économiser {monthlySavings} €/mois</span>
                  <ArrowRight size={15} weight="bold" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// 3. Credibility & Numbers Strip
function CredibilityStrip() {
  const metrics = [
    { value: '0 €', label: 'Aucun frais ni abonnement', detail: 'Service 100% gratuit pour les praticiens' },
    { value: '-15% à -30%', label: 'Remise directe en facture', detail: 'Négociée sur catalogue professionnel' },
    { value: '100%', label: 'Facturation & envoi direct', detail: 'Par vos marques et distributeurs agréés' },
    { value: '< 24h', label: 'Délai d\'attribution', detail: 'Réception de votre code promo unique' },
  ];

  return (
    <section className="border-y border-white/[0.08] bg-[#0c1322]/60 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {metrics.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-mono tracking-tight">
                {item.value}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-200">
                {item.label}
              </div>
              <div className="text-xs text-slate-400">
                {item.detail}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// 4. How It Works (Bento Layout with Asymmetric Rhythm)
function HowItWorks() {
  return (
    <section id="comment-ca-marche" className="py-20 sm:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Comment fonctionne le réseau Daseis ?
          </h2>
          <p className="mt-3 text-base text-slate-300">
            Une mise en relation directe, transparente et sans engagement en 3 étapes.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-[#0f172a]/80 rounded-2xl p-7 border border-white/[0.08] hover:border-blue-500/40 transition-colors flex flex-col justify-between space-y-6">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-400 font-mono font-bold text-lg mb-6">
                01
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                1. Analyse de vos besoins
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Vous nous précisez les gammes de consommables et équipements que vous commandez régulièrement (cires, soins, ongles, coiffure).
              </p>
            </div>
            
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-700/60 text-xs text-slate-300 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>SIMULATION COMPARATIVE</span>
                <span className="text-emerald-400 font-bold">-24%</span>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-slate-400">Prix public habituel :</span>
                <span className="line-through text-slate-500">120,00 €</span>
              </div>
              <div className="flex justify-between font-mono font-bold text-emerald-400">
                <span>Tarif réseau Daseis :</span>
                <span>91,20 € HT</span>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-[#0f172a]/80 rounded-2xl p-7 border border-white/[0.08] hover:border-blue-500/40 transition-colors flex flex-col justify-between space-y-6">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-400 font-mono font-bold text-lg mb-6">
                02
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                2. Attribution de votre code
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Nous vous transmettons votre code partenaire personnel, activé chez les grossistes et marques correspondant à votre besoin.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-950/60 to-slate-900 border border-blue-500/30 text-center">
              <span className="text-[10px] text-blue-400 font-mono uppercase tracking-wider block mb-1">
                Exemple de code personnalisé
              </span>
              <div className="inline-block px-4 py-1.5 rounded-lg bg-blue-600/20 border border-blue-400/40 text-sm font-mono font-bold text-white tracking-widest">
                DASEIS-BEAUTE-2026
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">Valable sans limite de fréquence</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-[#0f172a]/80 rounded-2xl p-7 border border-white/[0.08] hover:border-blue-500/40 transition-colors flex flex-col justify-between space-y-6">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-400 font-mono font-bold text-lg mb-6">
                03
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                3. Commande & livraison directe
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Vous commandez directement sur la boutique ou auprès du commercial de votre fournisseur en appliquant votre code.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-700/60 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-200">
                <CheckCircle size={16} weight="fill" className="text-emerald-400 flex-shrink-0" />
                <span>Facture émise directement par le fournisseur</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <CheckCircle size={16} weight="fill" className="text-emerald-400 flex-shrink-0" />
                <span>Livraison standard et SAV habituel</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <CheckCircle size={16} weight="fill" className="text-emerald-400 flex-shrink-0" />
                <span>Zéro frais de service ni commission</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// 5. Dual Persona Section (Instituts vs Fournisseurs)
function AudienceSolutions({ onOpenContact }: { onOpenContact: (role: 'institut' | 'fournisseur') => void }) {
  const [activeTab, setActiveTab] = useState<'institut' | 'fournisseur'>('institut');

  return (
    <section id="solutions" className="py-20 bg-[#0b101f] border-y border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Une solution pensée pour chacun
          </h2>
          <p className="mt-3 text-base text-slate-300">
            Daseis connecte les deux extrémités de la chaîne d'approvisionnement en supprimant les frictions.
          </p>

          {/* Segmented Button (Emil Kowalski tactile toggle) */}
          <div className="mt-8 inline-flex p-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80">
            <button
              onClick={() => setActiveTab('institut')}
              className={`btn-pressable px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer flex items-center gap-2 ${
                activeTab === 'institut'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Storefront size={18} weight="bold" />
              <span>Pour les Instituts & Praticiens</span>
            </button>
            <button
              onClick={() => setActiveTab('fournisseur')}
              className={`btn-pressable px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer flex items-center gap-2 ${
                activeTab === 'fournisseur'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Buildings size={18} weight="bold" />
              <span>Pour les Fournisseurs & Marques</span>
            </button>
          </div>
        </div>

        {/* Content Tabs */}
        <AnimatePresence mode="wait">
          {activeTab === 'institut' ? (
            <motion.div
              key="institut"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="grid lg:grid-cols-12 gap-8 items-center"
            >
              <div className="lg:col-span-6 space-y-6">
                <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-semibold">
                  Instituts de beauté · Esthéticiennes · Ateliers de soin
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Diminuez vos charges fixes sans rogner sur la qualité de vos prestations.
                </h3>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  En tant que professionnel indépendant ou gérant d'institut, vous n'avez pas le temps de négocier avec chaque marque. Daseis regroupe les demandes et vous fait bénéficier de remises grand compte.
                </p>

                <div className="space-y-3.5 pt-2">
                  <div className="flex items-start gap-3">
                    <div className="p-1 rounded bg-blue-500/10 text-blue-400 mt-0.5">
                      <CheckCircle size={18} weight="bold" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Marques certifiées et stocks officiels</h4>
                      <p className="text-xs text-slate-400">Aucun produit reconditionné ou circuit parallèle : uniquement des circuits officiels.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-1 rounded bg-blue-500/10 text-blue-400 mt-0.5">
                      <CheckCircle size={18} weight="bold" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Sans engagement de volume</h4>
                      <p className="text-xs text-slate-400">Commandez selon vos réels besoins, à la fréquence qui vous convient.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-1 rounded bg-blue-500/10 text-blue-400 mt-0.5">
                      <CheckCircle size={18} weight="bold" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Service 100% gratuit</h4>
                      <p className="text-xs text-slate-400">Vous ne payez que le montant de votre commande après réduction appliquée.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => onOpenContact('institut')}
                    className="btn-pressable inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-md cursor-pointer"
                  >
                    <span>Je souhaite recevoir mes codes instituts</span>
                    <ArrowRight size={16} weight="bold" />
                  </button>
                </div>
              </div>

              <div className="lg:col-span-6 bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-white/[0.08] space-y-4">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Cas d'usage réels constatés
                </h4>
                
                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-white text-sm">Cires à épiler & spatules</span>
                    <span className="font-mono text-xs text-emerald-400 font-bold">-28% constatés</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Économie moyenne de 140 €/mois pour un salon réalisant 15 épilations/jour.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-white text-sm">Gels & vernis semi-permanents</span>
                    <span className="font-mono text-xs text-emerald-400 font-bold">-22% constatés</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Plus de 250 couleurs professionnelles accessibles sans minimum par teinte.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-white text-sm">Consommables hygiène & draps</span>
                    <span className="font-mono text-xs text-emerald-400 font-bold">-18% constatés</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Paniers groupés livrés directement en carton pro avec facturation TVA standard.
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="fournisseur"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="grid lg:grid-cols-12 gap-8 items-center"
            >
              <div className="lg:col-span-6 space-y-6">
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                  Grossistes · Distributeurs · Fabricants de cosmétiques
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Développez votre clientèle pro sans prospection commerciale fastidieuse.
                </h3>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  Daseis vous amène des instituts et praticiens prêts à commander, en quête de marques sérieuses et d'approvisionnements récurrents.
                </p>

                <div className="space-y-3.5 pt-2">
                  <div className="flex items-start gap-3">
                    <div className="p-1 rounded bg-emerald-500/10 text-emerald-400 mt-0.5">
                      <CheckCircle size={18} weight="bold" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Nouveaux comptes professionnels vérifiés</h4>
                      <p className="text-xs text-slate-400">Chaque institut demandeur est qualifié (SIRET actif, activité beauté vérifiée).</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-1 rounded bg-emerald-500/10 text-emerald-400 mt-0.5">
                      <CheckCircle size={18} weight="bold" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Modèle 100% à la performance</h4>
                      <p className="text-xs text-slate-400">Aucun coût fixe, aucun forfait : vous ne réglez une commission que sur les ventes effectives.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-1 rounded bg-emerald-500/10 text-emerald-400 mt-0.5">
                      <CheckCircle size={18} weight="bold" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Intégration technique ultra simple</h4>
                      <p className="text-xs text-slate-400">Un simple code promo ou paramètre d'URL sur votre plateforme e-commerce existante suffit.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => onOpenContact('fournisseur')}
                    className="btn-pressable inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-md cursor-pointer"
                  >
                    <span>Rejoindre le réseau fournisseurs</span>
                    <ArrowRight size={16} weight="bold" />
                  </button>
                </div>
              </div>

              <div className="lg:col-span-6 bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-white/[0.08] space-y-4">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Pourquoi les marques collaborent avec Daseis
                </h4>
                
                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-white text-sm">Fidélisation & Récurrence</span>
                    <span className="font-mono text-xs text-emerald-400 font-bold">Panier récurrent</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Les instituts réapprovisionnent leurs stocks toutes les 3 à 5 semaines de manière prévisible.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-white text-sm">Coût d'acquisition divisé par 3</span>
                    <span className="font-mono text-xs text-emerald-400 font-bold">ROI mesurable</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Évitez les salons professionnels coûteux et la prospection téléphonique infructueuse.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-white text-sm">Maîtrise de votre image de marque</span>
                    <span className="font-mono text-xs text-emerald-400 font-bold">Distributeur officiel</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Vous conservez le contrôle total de vos conditions générales de vente et de vos expéditions.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// 6. Transparence & Business Model
function TransparencySection() {
  return (
    <section id="transparence" className="py-20 bg-[#080d1a] relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium mb-6">
          <Handshake size={15} className="text-blue-400" />
          <span>Notre engagement de transparence</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Pourquoi ce service est-il 100% gratuit pour vous ?
        </h2>
        
        <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Nous croyons qu'un modèle pérenne doit être limpide. Daseis est rémunéré par les grossistes partenaires sous la forme d'un pourcentage d'apport d'affaires lorsqu'une commande est passée avec votre code.
        </p>

        <div className="mt-12 grid sm:grid-cols-3 gap-6 text-left">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-white/[0.08]">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold mb-4">
              1
            </div>
            <h3 className="text-base font-bold text-white mb-2">Pour l'Institut</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Vous accédez immédiatement aux prix négociés de groupe, sans abonnement, sans cotisation et sans engagement de durée.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-white/[0.08]">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold mb-4">
              2
            </div>
            <h3 className="text-base font-bold text-white mb-2">Pour le Fournisseur</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Il acquiert de nouveaux clients professionnels fidèles et rentabilise ses volumes de production sans frais fixes commerciaux.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-white/[0.08]">
            <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 font-bold mb-4">
              3
            </div>
            <h3 className="text-base font-bold text-white mb-2">Pour Daseis</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Une commission versée uniquement en cas de commande réelle. Si vous ne trouvez pas votre bonheur, vous n'avez rien déboursé.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// 7. Verified Testimonials (Max 3 lines quote discipline from Taste Skill)
function Testimonials() {
  const reviews = [
    {
      name: 'Sarah M.',
      role: 'Fondatrice de L\'Atelier Beauté',
      city: 'Lyon (69)',
      savings: '280 € / mois',
      text: 'Sur la cire et les huiles de cabine, j\'économise près de 280€ chaque mois. Et je commande toujours chez mon grossiste habituel sans rien changer.',
    },
    {
      name: 'Clara D.',
      role: 'Esthéticienne à domicile',
      city: 'Nantes (44)',
      savings: '190 € / mois',
      text: 'Aucun engagement ni piège. J\'ai reçu mon code en moins de 24h et il a fonctionné dès ma première commande au panier.',
    },
    {
      name: 'Jean-Marc V.',
      role: 'Distributeur consommables pro',
      city: 'Région Parisienne',
      savings: '+35 clients pros',
      text: 'Daseis nous apporte des instituts sérieux avec des commandes récurrentes. Un canal d\'acquisition ultra rentable au succès.',
    },
  ];

  return (
    <section className="py-20 bg-[#0a0f1d] border-t border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Ce que disent nos membres
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-400">
            Des retours concrets d'instituts et de fournisseurs qui utilisent le réseau.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((rev, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-slate-900/80 border border-white/[0.08] hover:border-slate-600 transition-colors flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400 text-xs">
                    {'★'.repeat(5)}
                  </div>
                  <span className="text-[11px] font-mono font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                    {rev.savings}
                  </span>
                </div>
                
                {/* Max 3 lines quote */}
                <p className="text-sm text-slate-300 leading-relaxed italic">
                  "{rev.text}"
                </p>
              </div>

              <div className="pt-5 mt-4 border-t border-white/[0.06] flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center font-bold text-xs text-blue-400">
                  {rev.name.charAt(0)}
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{rev.name}</div>
                  <div className="text-[11px] text-slate-400">{rev.role} · {rev.city}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// 8. FAQ Accordion (Smooth Emil Kowalski transition)
function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Le service Daseis est-il réellement 100% gratuit pour les instituts ?',
      a: 'Oui, sans aucune exception. Vous ne paierez jamais d\'inscription, d\'abonnement mensuel ni de frais de gestion. Nous sommes rémunérés directement par nos fournisseurs partenaires sous la forme d\'une commission d\'apporteur d\'affaires.',
    },
    {
      q: 'Comment s\'applique concrètement la réduction lors de mes commandes ?',
      a: 'Dès validation de votre profil professionnel, vous recevez un code de réduction unique. Il vous suffit de le saisir dans la case "Code Promo / Code Partenaire" sur le site e-commerce du fournisseur agréé ou de l\'indiquer à votre commercial dédié.',
    },
    {
      q: 'Puis-je continuer à commander mes marques favorites ?',
      a: 'Absolument. Si votre fournisseur actuel fait déjà partie de notre réseau, nous vous activons la remise sur son catalogue. S\'il n\'en fait pas encore partie, vous pouvez nous transmettre ses coordonnées et notre équipe de négociation le contactera pour ouvrir un partenariat de groupe.',
    },
    {
      q: 'Y a-t-il un montant minimum de commande imposé ?',
      a: 'Daseis n\'impose aucun minimum. Seules les conditions habituelles du fournisseur s\'appliquent (par exemple le seuil de franco de port pour bénéficier de la livraison offerte).',
    },
    {
      q: 'Comment fonctionne la facturation et la récupération de TVA ?',
      a: 'La facturation est émise directement par le fournisseur à l\'adresse de votre institut. Votre facture comporte toutes les mentions légales requises et vous récupérez votre TVA déductible normalement.',
    },
  ];

  return (
    <section id="faq" className="py-20 bg-[#080d1a]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Foire aux questions
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Toutes les réponses à vos interrogations avant de commencer.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-white/[0.08] bg-slate-900/60 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <span className="text-sm sm:text-base font-semibold text-slate-200">
                    {faq.q}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                    className="flex-shrink-0 text-slate-400"
                  >
                    <CaretDown size={18} weight="bold" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
                    >
                      <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-white/[0.04] pt-3">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// 9. Contact & Request Form (High tactile feedback & validation)
function ContactForm({ prefilledActivity }: { prefilledActivity: string }) {
  const [role, setRole] = useState<'institut' | 'fournisseur'>('institut');
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    activity: prefilledActivity || '',
    email: '',
    phone: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Update activity if prefilled changes
  React.useEffect(() => {
    if (prefilledActivity) {
      setFormData(prev => ({ ...prev, activity: prefilledActivity }));
    }
  }, [prefilledActivity]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate responsive network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const demoPromoCode = 'DASEIS-VIP-' + Math.floor(1000 + Math.random() * 9000);

  const copyCode = () => {
    navigator.clipboard?.writeText(demoPromoCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <section id="contact" className="py-20 bg-[#090f1e] border-t border-white/[0.08]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Obtenez votre code partenaire
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-300">
            Remplissez ce formulaire rapide pour recevoir la liste de vos tarifs remisés par email.
          </p>
        </div>

        {isSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className="p-8 rounded-2xl bg-slate-900 border border-emerald-500/40 text-center space-y-5 shadow-2xl"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle size={36} weight="fill" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">Demande enregistrée avec succès !</h3>
              <p className="text-sm text-slate-300">
                Merci <strong>{formData.name || 'cher confrère'}</strong>. Votre demande a bien été transmise à notre équipe.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 max-w-sm mx-auto space-y-2">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-mono">
                Votre référence dossier temporaire :
              </span>
              <div className="flex items-center justify-center gap-2">
                <span className="font-mono font-bold text-base text-emerald-400">
                  {demoPromoCode}
                </span>
                <button
                  type="button"
                  onClick={copyCode}
                  className="p-1.5 rounded bg-slate-700 hover:bg-slate-600 text-white transition-colors"
                  title="Copier"
                >
                  {copiedCode ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-400">
              Un conseiller prendra contact sous 24h ouvrées pour vous remettre votre catalogue remisé.
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsSuccess(false);
                  setFormData({ name: '', businessName: '', activity: '', email: '', phone: '', message: '' });
                }}
                className="btn-pressable text-xs font-semibold text-blue-400 hover:text-blue-300 underline"
              >
                Faire une autre demande
              </button>
            </div>
          </motion.div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-[#0e1628] p-6 sm:p-8 rounded-2xl border border-white/[0.1] shadow-2xl space-y-6"
          >
            {/* Persona switcher */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Vous êtes :
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('institut')}
                  className={`btn-pressable py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold border flex items-center justify-center gap-2 cursor-pointer ${
                    role === 'institut'
                      ? 'bg-blue-600/25 border-blue-500 text-white'
                      : 'bg-slate-900/60 border-slate-700/60 text-slate-400 hover:text-white'
                  }`}
                >
                  <Storefront size={16} />
                  <span>Un Institut / Praticien</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('fournisseur')}
                  className={`btn-pressable py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold border flex items-center justify-center gap-2 cursor-pointer ${
                    role === 'fournisseur'
                      ? 'bg-emerald-600/25 border-emerald-500 text-white'
                      : 'bg-slate-900/60 border-slate-700/60 text-slate-400 hover:text-white'
                  }`}
                >
                  <Buildings size={16} />
                  <span>Un Fournisseur / Marque</span>
                </button>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Nom et Prénom *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ex : Claire Laurent"
                  className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder:text-slate-600 text-sm focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="businessName" className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Nom de l'établissement ou Enseigne *
                </label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  required
                  value={formData.businessName}
                  onChange={handleChange}
                  placeholder="Ex : L'Institut Botanique"
                  className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder:text-slate-600 text-sm focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Email professionnel *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="contact@moninstitut.fr"
                  className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder:text-slate-600 text-sm focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Téléphone (pour envoi SMS du code)
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="06 12 34 56 78"
                  className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder:text-slate-600 text-sm focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="activity" className="block text-xs font-semibold text-slate-300 mb-1.5">
                Produits recherchés ou marques habituelles
              </label>
              <input
                type="text"
                id="activity"
                name="activity"
                value={formData.activity}
                onChange={handleChange}
                placeholder="Ex : Cires pelables, gels UV, soins cabine visage..."
                className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder:text-slate-600 text-sm focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-xs font-semibold text-slate-300 mb-1.5">
                Précisions supplémentaires (facultatif)
              </label>
              <textarea
                id="message"
                name="message"
                rows={3}
                value={formData.message}
                onChange={handleChange}
                placeholder="Une question particulière sur vos fournisseurs actuels ?"
                className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder:text-slate-600 text-sm focus:border-blue-500 transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-pressable w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Traitement en cours...</span>
                </>
              ) : (
                <>
                  <span>Recevoir mes codes et catalogues remisés</span>
                  <PaperPlaneTilt size={16} weight="bold" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 text-center">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>Vos données restent strictement confidentielles (RGPD). Aucun démarchage abusif.</span>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

// 10. Footer (Clean, responsive)
function Footer() {
  return (
    <footer className="bg-[#050811] border-t border-white/[0.08] py-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-white/[0.06]">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                D
              </div>
              <span className="text-base font-bold text-white tracking-tight">DASEIS</span>
            </div>
            <p className="text-slate-400 max-w-sm leading-relaxed">
              La plateforme française d'achats groupés pour instituts de beauté, esthéticiennes indépendantes et ateliers de bien-être.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Navigation</h4>
            <ul className="space-y-2">
              <li><a href="#comment-ca-marche" className="hover:text-white transition-colors">Comment ça marche</a></li>
              <li><a href="#simulateur" className="hover:text-white transition-colors">Simulateur d'économies</a></li>
              <li><a href="#solutions" className="hover:text-white transition-colors">Instituts & Praticiens</a></li>
              <li><a href="#solutions" className="hover:text-white transition-colors">Fournisseurs agréés</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">Questions fréquentes</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Informations & Contact</h4>
            <ul className="space-y-2">
              <li><span>Service Support Instituts</span></li>
              <li><span className="text-slate-300 font-mono">support@daseis.fr</span></li>
              <li className="pt-2 text-slate-400">France métropolitaine & Dom-Tom</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-[11px]">
          <div>
            © {new Date().getFullYear()} Daseis Technologies. Tous droits réservés. Service gratuit sans engagement.
          </div>
          <div className="flex gap-4">
            <a href="#contact" className="hover:text-white transition-colors">Mentions légales</a>
            <a href="#contact" className="hover:text-white transition-colors">Politique RGPD</a>
            <a href="#contact" className="hover:text-white transition-colors">Conditions Générales</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Main Application Component
export default function App() {
  const [selectedActivity, setSelectedActivity] = useState<string>('');

  const handleOpenContact = (role?: 'institut' | 'fournisseur') => {
    const el = document.getElementById('contact');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectFromSimulator = (activityTitle: string, spend: number) => {
    setSelectedActivity(`${activityTitle} (Budget : ${spend}€/mois)`);
    const el = document.getElementById('contact');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#080d1a] text-slate-100 flex flex-col font-sans selection:bg-blue-500/30 selection:text-white antialiased">
      <Header onOpenContact={handleOpenContact} />
      <main className="flex-1">
        <HeroSection onSelectActivity={handleSelectFromSimulator} />
        <CredibilityStrip />
        <HowItWorks />
        <AudienceSolutions onOpenContact={handleOpenContact} />
        <TransparencySection />
        <Testimonials />
        <FAQ />
        <ContactForm prefilledActivity={selectedActivity} />
      </main>
      <Footer />
    </div>
  );
}
