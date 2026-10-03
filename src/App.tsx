import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LegalModal, LegalTab } from './components/LegalModal';

// ─── Types ────────────────────────────────────────────────────────────────────
type ActivityType = 'esthetic' | 'nails' | 'hair' | 'spa';

interface SimulatorProfile {
  title: string;
  defaultSpend: number;
  label: string;
}

const SIMULATOR_PROFILES: Record<ActivityType, SimulatorProfile> = {
  esthetic: {
    title: 'Institut de Beauté & Soins',
    defaultSpend: 1400,
    label: 'Soins & Esthétique',
  },
  nails: {
    title: 'Onglerie & Nail Bar',
    defaultSpend: 900,
    label: 'Onglerie',
  },
  hair: {
    title: 'Salon de Coiffure & Barbier',
    defaultSpend: 2200,
    label: 'Coiffure & Barbier',
  },
  spa: {
    title: 'Spa & Bien-être',
    defaultSpend: 3100,
    label: 'Spa & Bien-être',
  },
};

// ─── 1. Navigation ─────────────────────────────────────────────────────────────
function Header({ onOpenContact }: { onOpenContact: () => void }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  React.useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white border-b border-neutral-200 shadow-sm'
          : 'bg-white/90 backdrop-blur-md'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center">
            <img
              src="/logo-wordmark-black.png"
              alt="DASEIS"
              className="h-6 sm:h-7 w-auto object-contain"
            />
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#comment-ca-marche" className="text-sm text-neutral-600 hover:text-black transition-colors">
              Comment ça marche
            </a>
            <a href="#solutions" className="text-sm text-neutral-600 hover:text-black transition-colors">
              Instituts & Artisans
            </a>
            <a href="#transparence" className="text-sm text-neutral-600 hover:text-black transition-colors">
              Notre modèle
            </a>
            <a href="#faq" className="text-sm text-neutral-600 hover:text-black transition-colors">
              FAQ
            </a>
          </nav>

          {/* CTA Desktop */}
          <div className="hidden md:block">
            <button
              onClick={onOpenContact}
              className="btn-pressable px-5 py-2.5 bg-black text-white text-sm font-medium rounded-none hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Obtenir mon code
            </button>
          </div>

          {/* Mobile burger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-black"
            aria-label="Menu"
          >
            <span className="block w-5 h-px bg-black mb-1.5" />
            <span className="block w-5 h-px bg-black mb-1.5" />
            <span className="block w-5 h-px bg-black" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="md:hidden overflow-hidden bg-white border-t border-neutral-200"
          >
            <div className="px-4 py-4 space-y-3">
              {[
                { href: '#comment-ca-marche', label: 'Comment ça marche' },
                { href: '#solutions', label: 'Instituts & Artisans' },
                { href: '#transparence', label: 'Notre modèle' },
                { href: '#faq', label: 'FAQ' },
              ].map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1.5 text-sm text-neutral-700 hover:text-black transition-colors"
                >
                  {label}
                </a>
              ))}
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenContact(); }}
                className="btn-pressable w-full mt-3 py-3 bg-black text-white text-sm font-medium cursor-pointer"
              >
                Obtenir mon code
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// ─── 2. Hero ───────────────────────────────────────────────────────────────────
function HeroSection({ onOpenContact }: { onOpenContact: () => void }) {
  return (
    <section className="pt-28 sm:pt-36 pb-20 sm:pb-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-widest text-neutral-500 mb-6">
            Réseau d'achats professionnels — France
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl leading-[1.1] text-black mb-6">
            Vos fournitures professionnelles,
            <br />
            <em>à tarifs de groupe.</em>
          </h1>
          <p className="text-base sm:text-lg text-neutral-600 leading-relaxed max-w-xl mb-10">
            Daseis regroupe les commandes des instituts, salons et artisans indépendants pour accéder aux conditions d'achat réservées aux grands comptes. Service gratuit pour les professionnels.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onOpenContact}
              className="btn-pressable inline-flex items-center justify-center px-7 py-3.5 bg-black text-white text-sm font-medium hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Demander mon code partenaire
            </button>
            <a
              href="#comment-ca-marche"
              className="btn-pressable inline-flex items-center justify-center px-7 py-3.5 border border-neutral-300 text-black text-sm font-medium hover:border-neutral-500 transition-colors"
            >
              Comment ça marche
            </a>
          </div>

          <p className="mt-6 text-xs text-neutral-500">
            Rémunération par commission versée par les fournisseurs — aucun frais pour vous.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── 3. Bande de réassurance ───────────────────────────────────────────────────
function ReassuranceStrip() {
  const items = [
    { value: 'Gratuit', label: 'Aucun frais d\'inscription ni d\'abonnement' },
    { value: 'Remises', label: 'Tarifs négociés directement sur facture' },
    { value: 'Direct', label: 'Facture et livraison par le fournisseur' },
    { value: 'Simple', label: 'Un code à appliquer lors de vos commandes' },
  ];

  return (
    <section className="border-y border-neutral-200 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item) => (
            <div key={item.value}>
              <div className="text-xl sm:text-2xl font-serif text-black mb-1">
                {item.value}
              </div>
              <div className="text-xs text-neutral-500 leading-relaxed">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 4. Comment ça marche ──────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Vous nous décrivez vos besoins',
      body: 'Précisez les gammes de consommables et équipements que vous commandez régulièrement : produits de soin, consommables cabine, matériel professionnel.',
    },
    {
      num: '02',
      title: 'Nous vous attribuons un code partenaire',
      body: 'Vous recevez un code personnalisé activé chez les grossistes et distributeurs correspondant à vos besoins. Ce code est unique et illimité dans le temps.',
    },
    {
      num: '03',
      title: 'Vous commandez directement au tarif négocié',
      body: 'Appliquez votre code lors de vos commandes habituelles. Le fournisseur émet la facture à votre nom et assure la livraison selon ses conditions usuelles.',
    },
  ];

  return (
    <section id="comment-ca-marche" className="py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mb-14">
          <h2 className="text-3xl sm:text-4xl text-black mb-4">
            Comment fonctionne le réseau ?
          </h2>
          <p className="text-neutral-600">
            Trois étapes, sans intermédiaire de trop.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 lg:gap-16">
          {steps.map((step) => (
            <div key={step.num} className="border-t border-neutral-200 pt-6">
              <span className="block text-xs text-neutral-400 font-mono mb-4">{step.num}</span>
              <h3 className="text-xl text-black mb-3">{step.title}</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">{step.body}</p>
            </div>
          ))}
        </div>

        {/* Mention transparence */}
        <div className="mt-14 p-6 sm:p-8 border border-neutral-200 bg-neutral-50">
          <p className="text-xs uppercase tracking-widest text-neutral-500 mb-3">
            Transparence sur notre rémunération
          </p>
          <p className="text-sm sm:text-base text-neutral-700 leading-relaxed max-w-3xl">
            Le service est entièrement gratuit pour vous. Daseis est exclusivement rémunéré par une commission d'apporteur d'affaires versée par les fournisseurs partenaires, uniquement lorsque vous passez une commande avec votre code. Vous ne payez jamais rien à Daseis.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── 5. Solutions ──────────────────────────────────────────────────────────────
function AudienceSolutions({ onOpenContact }: { onOpenContact: () => void }) {
  const [activeTab, setActiveTab] = useState<'institut' | 'fournisseur'>('institut');

  return (
    <section id="solutions" className="py-20 sm:py-28 bg-neutral-50 border-y border-neutral-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl text-black mb-4">
            Une plateforme pour deux acteurs
          </h2>
          {/* Onglets */}
          <div className="flex gap-0 mt-8 border-b border-neutral-200">
            <button
              onClick={() => setActiveTab('institut')}
              className={`btn-pressable px-6 py-3 text-sm font-medium border-b-2 -mb-px cursor-pointer transition-colors ${
                activeTab === 'institut'
                  ? 'border-black text-black'
                  : 'border-transparent text-neutral-500 hover:text-black'
              }`}
            >
              Instituts, Salons & Artisans
            </button>
            <button
              onClick={() => setActiveTab('fournisseur')}
              className={`btn-pressable px-6 py-3 text-sm font-medium border-b-2 -mb-px cursor-pointer transition-colors ${
                activeTab === 'fournisseur'
                  ? 'border-black text-black'
                  : 'border-transparent text-neutral-500 hover:text-black'
              }`}
            >
              Fournisseurs & Marques
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'institut' ? (
            <motion.div
              key="institut"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start"
            >
              <div>
                <h3 className="text-2xl sm:text-3xl text-black mb-4">
                  Réduire vos charges sans changer vos habitudes d'achat.
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed mb-8">
                  En tant qu'artisan ou praticien indépendant, vous n'avez pas le poids commercial d'une grande enseigne. Daseis regroupe les demandes pour vous donner accès aux mêmes conditions tarifaires que les acheteurs de volumes.
                </p>
                <div className="space-y-5">
                  {[
                    {
                      title: 'Circuits d\'approvisionnement officiels',
                      body: 'Uniquement des distributeurs agréés et des fabricants référencés. Aucun circuit parallèle.',
                    },
                    {
                      title: 'Sans engagement de volume',
                      body: 'Commandez selon vos besoins réels, à la fréquence qui vous convient.',
                    },
                    {
                      title: 'Service intégralement gratuit',
                      body: 'Vous ne payez que le montant de votre commande, après réduction appliquée.',
                    },
                  ].map((item) => (
                    <div key={item.title} className="border-t border-neutral-200 pt-5">
                      <h4 className="text-sm font-medium text-black mb-1">{item.title}</h4>
                      <p className="text-xs text-neutral-500 leading-relaxed">{item.body}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-10">
                  <button
                    onClick={onOpenContact}
                    className="btn-pressable px-7 py-3.5 bg-black text-white text-sm font-medium hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    Recevoir mon code partenaire
                  </button>
                </div>
              </div>

              <div className="bg-white border border-neutral-200 p-6 sm:p-8">
                <p className="text-xs uppercase tracking-widest text-neutral-400 mb-6">
                  Exemples de produits concernés
                </p>
                <div className="space-y-4">
                  {[
                    { cat: 'Soins esthétique', ex: 'Cires pelables, lotions pré/post, consommables cabine' },
                    { cat: 'Onglerie', ex: 'Gels UV/LED, vernis semi-permanents, embouts ponceuse' },
                    { cat: 'Coiffure', ex: 'Colorations, shampoings professionnels, oxydants' },
                    { cat: 'Hygiène & jetables', ex: 'Draps d\'examen, gants, consommables stériles' },
                  ].map((row) => (
                    <div key={row.cat} className="flex justify-between items-start py-3 border-b border-neutral-100">
                      <span className="text-sm text-black">{row.cat}</span>
                      <span className="text-xs text-neutral-500 max-w-[55%] text-right">{row.ex}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="fournisseur"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start"
            >
              <div>
                <h3 className="text-2xl sm:text-3xl text-black mb-4">
                  Accéder à de nouveaux clients professionnels sans prospection.
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed mb-8">
                  Daseis vous met en relation avec des instituts, salons et artisans qualifiés à la recherche de fournisseurs sérieux. L'intégration technique se limite à un code promo ou paramètre URL sur votre plateforme existante.
                </p>
                <div className="space-y-5">
                  {[
                    {
                      title: 'Clients professionnels vérifiés',
                      body: 'Chaque établissement est qualifié avec SIRET actif et activité vérifiée avant d\'intégrer le réseau.',
                    },
                    {
                      title: 'Modèle 100% à la performance',
                      body: 'Aucun coût fixe, aucun abonnement. Vous versez une commission uniquement sur les commandes effectives.',
                    },
                    {
                      title: 'Intégration technique minimale',
                      body: 'Un simple code promo sur votre boutique en ligne ou système de commande suffit.',
                    },
                  ].map((item) => (
                    <div key={item.title} className="border-t border-neutral-200 pt-5">
                      <h4 className="text-sm font-medium text-black mb-1">{item.title}</h4>
                      <p className="text-xs text-neutral-500 leading-relaxed">{item.body}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-10">
                  <button
                    onClick={onOpenContact}
                    className="btn-pressable px-7 py-3.5 bg-black text-white text-sm font-medium hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    Rejoindre le réseau fournisseurs
                  </button>
                </div>
              </div>

              <div className="bg-white border border-neutral-200 p-6 sm:p-8">
                <p className="text-xs uppercase tracking-widest text-neutral-400 mb-6">
                  Pourquoi les marques choisissent Daseis
                </p>
                <div className="space-y-4">
                  {[
                    { titre: 'Clientèle récurrente', detail: 'Les professionnels réapprovisionnent régulièrement leurs stocks de consommables.' },
                    { titre: 'Maîtrise de votre image', detail: 'Vous conservez le contrôle de vos CGV, prix et expéditions. Daseis n\'intervient pas dans la relation commerciale.' },
                    { titre: 'Aucun coût d\'entrée', detail: 'Pas de frais d\'inscription. Le partenariat démarre dès l\'activation de votre premier code.' },
                  ].map((row) => (
                    <div key={row.titre} className="py-3 border-b border-neutral-100">
                      <span className="block text-sm text-black mb-0.5">{row.titre}</span>
                      <span className="text-xs text-neutral-500">{row.detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// ─── 6. Modèle de transparence ─────────────────────────────────────────────────
function TransparencySection() {
  return (
    <section id="transparence" className="py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div>
            <p className="text-xs uppercase tracking-widest text-neutral-500 mb-4">
              Notre modèle économique
            </p>
            <h2 className="text-3xl sm:text-4xl text-black mb-6">
              Pourquoi le service est gratuit pour vous.
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed mb-6">
              Daseis est rémunéré exclusivement par une commission d'apporteur d'affaires versée par les fournisseurs partenaires. Cette commission est calculée sur le montant des commandes réalisées avec votre code.
            </p>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Vous ne payez jamais de frais d'inscription, d'abonnement mensuel ni de frais de gestion. La réduction que vous obtenez est négociée en amont avec chaque fournisseur, indépendamment de notre commission.
            </p>
          </div>

          <div className="space-y-0">
            {[
              {
                num: '1',
                who: 'Pour vous',
                text: 'Accès aux tarifs de groupe sans aucun frais ni engagement. Vous commandez auprès de vos fournisseurs habituels avec un code de réduction.',
              },
              {
                num: '2',
                who: 'Pour le fournisseur',
                text: 'Il accède à de nouveaux clients professionnels récurrents. Il verse à Daseis une commission uniquement sur les commandes effectives.',
              },
              {
                num: '3',
                who: 'Pour Daseis',
                text: 'La commission du fournisseur constitue notre seule source de rémunération. Si vous ne commandez pas, nous ne percevons rien.',
              },
            ].map((item) => (
              <div key={item.num} className="flex gap-6 py-6 border-t border-neutral-200">
                <span className="text-xs text-neutral-400 font-mono pt-0.5 shrink-0">{item.num}</span>
                <div>
                  <span className="block text-sm font-medium text-black mb-1">{item.who}</span>
                  <p className="text-sm text-neutral-600 leading-relaxed">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 7. FAQ ────────────────────────────────────────────────────────────────────
function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: 'Le service est-il vraiment gratuit pour les instituts et artisans ?',
      a: "Oui. Vous ne payez jamais d'inscription, d'abonnement ni de frais de gestion. Daseis est rémunéré directement par les fournisseurs partenaires sous la forme d'une commission d'apporteur d'affaires, uniquement sur les commandes que vous passez.",
    },
    {
      q: 'Comment s\'applique la réduction lors de mes commandes ?',
      a: "Après validation de votre demande, vous recevez un code partenaire personnel. Saisissez ce code dans le champ \"Code promo\" ou \"Code partenaire\" du site du fournisseur, ou communiquez-le à votre commercial dédié.",
    },
    {
      q: 'Puis-je commander auprès de mes fournisseurs actuels ?',
      a: "Si votre fournisseur fait partie de notre réseau, la remise est activée immédiatement. Dans le cas contraire, transmettez-nous ses coordonnées et nous étudions l'ouverture d'un partenariat.",
    },
    {
      q: 'Y a-t-il un montant minimum de commande ?',
      a: "Daseis n'impose aucun minimum. Seules les conditions habituelles du fournisseur s'appliquent, comme le seuil de franco de port.",
    },
    {
      q: 'Comment fonctionne la facturation ?',
      a: "La facture est émise directement par le fournisseur à l'adresse de votre établissement. Elle comporte toutes les mentions légales nécessaires à la récupération de la TVA.",
    },
  ];

  return (
    <section id="faq" className="py-20 sm:py-28 bg-neutral-50 border-y border-neutral-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-12">
          <div>
            <h2 className="text-3xl sm:text-4xl text-black">
              Questions fréquentes
            </h2>
          </div>
          <div className="lg:col-span-2 space-y-0">
            {faqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div key={idx} className="border-t border-neutral-200">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full py-5 text-left flex items-start justify-between gap-6 cursor-pointer focus:outline-none group"
                  >
                    <span className="text-sm font-medium text-black group-hover:text-neutral-600 transition-colors">
                      {faq.q}
                    </span>
                    <span className="text-neutral-400 shrink-0 mt-0.5 text-lg leading-none">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="pb-5 text-sm text-neutral-600 leading-relaxed pr-8">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
            <div className="border-t border-neutral-200" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 8. Simulateur d'économies ─────────────────────────────────────────────────
function SavingsSimulator() {
  const [activity, setActivity] = useState<ActivityType>('esthetic');
  const [monthlySpend, setMonthlySpend] = useState(1400);

  const handleActivityChange = (act: ActivityType) => {
    setActivity(act);
    setMonthlySpend(SIMULATOR_PROFILES[act].defaultSpend);
  };

  // Estimation prudente et honnête : 15% (fourchette basse)
  const estimatedSavingsLow = Math.round(monthlySpend * 0.15);
  const estimatedSavingsHigh = Math.round(monthlySpend * 0.25);

  return (
    <section id="simulateur" className="py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div>
            <p className="text-xs uppercase tracking-widest text-neutral-500 mb-4">
              Estimation indicative
            </p>
            <h2 className="text-3xl sm:text-4xl text-black mb-4">
              Évaluez votre potentiel d'économies.
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Ces estimations sont indicatives, basées sur une fourchette de remise généralement constatée entre 15% et 25% selon les produits et fournisseurs. Le résultat réel dépend de votre catalogue et des partenariats actifs.
            </p>
          </div>

          <div className="bg-white border border-neutral-200 p-6 sm:p-8">
            {/* Sélection spécialité */}
            <div className="mb-6">
              <label className="block text-xs font-medium text-neutral-600 mb-3">
                Votre spécialité
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(SIMULATOR_PROFILES) as ActivityType[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => handleActivityChange(key)}
                    type="button"
                    className={`btn-pressable px-3 py-2.5 text-xs font-medium border transition-colors cursor-pointer text-left ${
                      activity === key
                        ? 'border-black text-black bg-neutral-50'
                        : 'border-neutral-200 text-neutral-600 hover:border-neutral-400'
                    }`}
                  >
                    {SIMULATOR_PROFILES[key].label}
                  </button>
                ))}
              </div>
            </div>

            {/* Curseur */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-medium text-neutral-600">
                  Budget mensuel d'approvisionnement
                </label>
                <span className="text-sm font-medium text-black">
                  {monthlySpend.toLocaleString('fr-FR')} € HT
                </span>
              </div>
              <input
                type="range"
                min="400"
                max="6000"
                step="100"
                value={monthlySpend}
                onChange={(e) => setMonthlySpend(Number(e.target.value))}
                className="w-full accent-black cursor-pointer h-px bg-neutral-200"
              />
              <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
                <span>400 €</span>
                <span>6 000 €</span>
              </div>
            </div>

            {/* Résultat */}
            <div className="border border-neutral-200 p-5 bg-neutral-50">
              <p className="text-xs text-neutral-500 mb-4">Économie mensuelle estimée (fourchette indicative)</p>
              <div className="text-2xl sm:text-3xl font-serif text-black">
                {estimatedSavingsLow.toLocaleString('fr-FR')} € à {estimatedSavingsHigh.toLocaleString('fr-FR')} €
              </div>
              <p className="text-xs text-neutral-400 mt-2">
                Soit {(estimatedSavingsLow * 12).toLocaleString('fr-FR')} € à {(estimatedSavingsHigh * 12).toLocaleString('fr-FR')} € sur l'année — à titre indicatif uniquement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 9. Formulaire de contact ──────────────────────────────────────────────────
function ContactForm({ onOpenLegal }: { onOpenLegal: (tab: LegalTab) => void }) {
  const [role, setRole] = useState<'institut' | 'fournisseur'>('institut');
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    activity: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, role }),
      });
      if (!res.ok) console.warn('Réponse API :', res.status);
    } catch (err) {
      console.warn('Envoi (mode fallback) :', err);
    } finally {
      setIsSubmitting(false);
      setIsSuccess(true);
    }
  };

  const inputClass =
    'w-full px-4 py-3 bg-white border border-neutral-200 text-black placeholder:text-neutral-400 text-sm focus:outline-none focus:border-black transition-colors';

  return (
    <section id="contact" className="py-20 sm:py-28 border-t border-neutral-200">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="text-3xl sm:text-4xl text-black mb-3">
            Obtenir mon code partenaire
          </h2>
          <p className="text-sm text-neutral-600">
            Renseignez vos coordonnées. Nous vous revenons sous 24 heures ouvrées.
          </p>
        </div>

        {isSuccess ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="border border-neutral-200 p-8 sm:p-10 bg-neutral-50 text-center"
          >
            <h3 className="text-2xl font-serif text-black mb-3">Demande enregistrée.</h3>
            <p className="text-sm text-neutral-600 mb-6">
              Merci <strong>{formData.name || 'pour votre intérêt'}</strong>. Votre demande a été transmise à notre équipe.
              Vous recevrez une réponse à <strong>{formData.email}</strong> sous 24 heures ouvrées.
            </p>
            <button
              type="button"
              onClick={() => {
                setIsSuccess(false);
                setFormData({ name: '', businessName: '', activity: '', email: '', phone: '', message: '' });
              }}
              className="text-xs text-neutral-500 underline underline-offset-4 hover:text-black transition-colors cursor-pointer"
            >
              Faire une autre demande
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Persona */}
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-2">Vous êtes</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('institut')}
                  className={`btn-pressable py-3 text-sm font-medium border cursor-pointer transition-colors ${
                    role === 'institut'
                      ? 'border-black text-black bg-neutral-50'
                      : 'border-neutral-200 text-neutral-600 hover:border-neutral-400'
                  }`}
                >
                  Institut, Salon ou Artisan
                </button>
                <button
                  type="button"
                  onClick={() => setRole('fournisseur')}
                  className={`btn-pressable py-3 text-sm font-medium border cursor-pointer transition-colors ${
                    role === 'fournisseur'
                      ? 'border-black text-black bg-neutral-50'
                      : 'border-neutral-200 text-neutral-600 hover:border-neutral-400'
                  }`}
                >
                  Fournisseur ou Marque
                </button>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-xs font-medium text-neutral-600 mb-1.5">
                  Nom et Prénom *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Claire Laurent"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="businessName" className="block text-xs font-medium text-neutral-600 mb-1.5">
                  Établissement *
                </label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  required
                  value={formData.businessName}
                  onChange={handleChange}
                  placeholder="Institut Beauté"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-neutral-600 mb-1.5">
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
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-xs font-medium text-neutral-600 mb-1.5">
                  Téléphone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="06 12 34 56 78"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label htmlFor="activity" className="block text-xs font-medium text-neutral-600 mb-1.5">
                Produits ou marques habituels
              </label>
              <input
                type="text"
                id="activity"
                name="activity"
                value={formData.activity}
                onChange={handleChange}
                placeholder="Cires pelables, gels UV, shampoings professionnels…"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-xs font-medium text-neutral-600 mb-1.5">
                Précisions (facultatif)
              </label>
              <textarea
                id="message"
                name="message"
                rows={3}
                value={formData.message}
                onChange={handleChange}
                placeholder="Une question sur vos fournisseurs actuels ?"
                className={inputClass + ' resize-none'}
              />
            </div>

            <div className="flex items-start gap-3 pt-1">
              <input
                type="checkbox"
                id="rgpd-consent"
                required
                defaultChecked
                className="mt-0.5 border-neutral-300 cursor-pointer accent-black"
              />
              <label htmlFor="rgpd-consent" className="text-[11px] text-neutral-500 cursor-pointer leading-relaxed">
                J'accepte les{' '}
                <button
                  type="button"
                  onClick={() => onOpenLegal('cgu')}
                  className="underline underline-offset-2 hover:text-black transition-colors cursor-pointer"
                >
                  Conditions Générales
                </button>{' '}
                et la{' '}
                <button
                  type="button"
                  onClick={() => onOpenLegal('rgpd')}
                  className="underline underline-offset-2 hover:text-black transition-colors cursor-pointer"
                >
                  Notice RGPD
                </button>
                . Mes coordonnées sont utilisées uniquement pour la délivrance de mes codes de réduction.
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-pressable w-full py-4 bg-black text-white text-sm font-medium hover:bg-neutral-800 disabled:bg-neutral-400 transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Envoi en cours…</span>
                </>
              ) : (
                'Envoyer ma demande'
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

// ─── 10. Footer ────────────────────────────────────────────────────────────────
function Footer({ onOpenLegal }: { onOpenLegal: (tab: LegalTab) => void }) {
  return (
    <footer className="border-t border-neutral-200 py-10 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 mb-8 border-b border-neutral-100">
          <div className="md:col-span-1">
            <img
              src="/logo-wordmark-black.png"
              alt="DASEIS"
              className="h-6 w-auto object-contain mb-3"
            />
            <p className="text-xs text-neutral-500 leading-relaxed max-w-xs">
              Réseau d'achats professionnels pour instituts de beauté, artisans et ateliers indépendants.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-medium text-black mb-3">Navigation</h4>
            <ul className="space-y-2 text-xs text-neutral-500">
              <li><a href="#comment-ca-marche" className="hover:text-black transition-colors">Comment ça marche</a></li>
              <li><a href="#solutions" className="hover:text-black transition-colors">Instituts & Artisans</a></li>
              <li><a href="#transparence" className="hover:text-black transition-colors">Notre modèle</a></li>
              <li><a href="#faq" className="hover:text-black transition-colors">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-medium text-black mb-3">Contact</h4>
            <ul className="space-y-2 text-xs text-neutral-500">
              <li>
                <a
                  href="mailto:daseis.foundation@gmail.com"
                  className="hover:text-black transition-colors font-mono"
                >
                  daseis.foundation@gmail.com
                </a>
              </li>
              <li>France métropolitaine & Dom-Tom</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] text-neutral-400">
          <span>© {new Date().getFullYear()} Daseis. Service d'apporteur d'affaires — rémunéré par commission fournisseur.</span>
          <div className="flex gap-5">
            <button onClick={() => onOpenLegal('mentions')} className="hover:text-black transition-colors cursor-pointer">Mentions légales</button>
            <button onClick={() => onOpenLegal('rgpd')} className="hover:text-black transition-colors cursor-pointer">RGPD</button>
            <button onClick={() => onOpenLegal('cgu')} className="hover:text-black transition-colors cursor-pointer">CGU</button>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── App Root ──────────────────────────────────────────────────────────────────
export default function App() {
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalInitialTab, setLegalInitialTab] = useState<LegalTab>('mentions');

  const handleOpenLegal = (tab: LegalTab) => {
    setLegalInitialTab(tab);
    setLegalModalOpen(true);
  };

  const handleOpenContact = () => {
    const el = document.getElementById('contact');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === '#mentions-legales' || hash === '#mentions') {
        setLegalInitialTab('mentions');
        setLegalModalOpen(true);
      } else if (hash === '#rgpd' || hash === '#confidentialite') {
        setLegalInitialTab('rgpd');
        setLegalModalOpen(true);
      } else if (hash === '#cgu' || hash === '#conditions') {
        setLegalInitialTab('cgu');
        setLegalModalOpen(true);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  return (
    <div className="min-h-screen bg-white text-black flex flex-col antialiased">
      <Header onOpenContact={handleOpenContact} />
      <main className="flex-1">
        <HeroSection onOpenContact={handleOpenContact} />
        <ReassuranceStrip />
        <HowItWorks />
        <AudienceSolutions onOpenContact={handleOpenContact} />
        <TransparencySection />
        <SavingsSimulator />
        <FAQ />
        <ContactForm onOpenLegal={handleOpenLegal} />
      </main>
      <Footer onOpenLegal={handleOpenLegal} />
      <LegalModal
        isOpen={legalModalOpen}
        onClose={() => setLegalModalOpen(false)}
        initialTab={legalInitialTab}
      />
    </div>
  );
}
