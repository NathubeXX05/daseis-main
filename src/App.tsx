import React, { useState } from 'react';

// Composant Header
function Header() {
  return (
    <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-700">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <a href="/" className="inline-block">
              <img
                src="/logo.svg"
                alt="Daseis - Logo"
                className="h-10 w-auto"
              />
            </a>
            <p className="text-sm text-slate-300 mt-1">
              Les mêmes produits pro, moins chers, sans frais pour votre institut
            </p>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#comment-ca-marche" className="text-slate-200 hover:text-blue-400 transition-colors text-sm font-medium">
              Comment ça marche
            </a>
            <a href="#instituts" className="text-slate-200 hover:text-blue-400 transition-colors text-sm font-medium">
              Pour les instituts
            </a>
            <a href="#fournisseurs" className="text-slate-200 hover:text-blue-400 transition-colors text-sm font-medium">
              Pour les fournisseurs
            </a>
            <a href="#contact" className="text-slate-200 hover:text-blue-400 transition-colors text-sm font-medium">
              Contact
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}

// Composant Hero Section
function HeroSection() {
  return (
    <section className="bg-slate-900 py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
          Économisez sur vos achats professionnels
          <span className="block text-blue-400 mt-1">sans changer vos habitudes</span>
        </h1>
        <p className="mt-6 text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Daseis vous connecte avec des fournisseurs de qualité offrant des tarifs préférentiels.
          Vous obtenez un code de réduction unique, et vous commandez directement chez eux.
        </p>
        <div className="mt-10">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg"
          >
            Obtenir mon code de réduction
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

// Composant Comment ça marche
function HowItWorks() {
  const steps = [
    {
      number: '1',
      title: 'Analyse de vos achats',
      description: 'Nous examinons vos achats actuels pour identifier les postes où des économies sont possibles, sans compromettre la qualité.',
      icon: (
        <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      number: '2',
      title: 'Mise en relation',
      description: 'Nous vous mettons en contact avec un fournisseur adapté à vos besoins et vous attribuons un code de réduction personnel.',
      icon: (
        <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      number: '3',
      title: 'Vous commandez',
      description: 'Vous commandez directement auprès du fournisseur en utilisant votre code. Les économies sont immédiates et transparentes.',
      icon: (
        <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="comment-ca-marche" className="py-16 bg-slate-800">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Comment ça marche ?
          </h2>
          <p className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto">
            Une solution simple en trois étapes, sans engagement de votre part.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative bg-slate-900 rounded-xl p-8 border border-slate-700 hover:border-blue-500 transition-colors"
            >
              <div className="absolute -top-5 left-8 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                {step.number}
              </div>
              <div className="flex flex-col items-center text-center pt-4">
                <div className="mb-4 text-blue-400">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-slate-300 leading-relaxed text-sm">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Composant Pour les instituts
function ForInstitutes() {
  const benefits = [
    {
      icon: (
        <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Produits de qualité professionnelle',
      description: 'Accès aux mêmes produits que vous utilisez déjà, mais à des tarifs négociés.',
    },
    {
      icon: (
        <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Économies immédiates',
      description: 'Des réductions significatives sur vos achats courants, sans minimum de commande.',
    },
    {
      icon: (
        <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Service 100% gratuit',
      description: 'Aucun frais, aucune commission, aucun abonnement. Vous ne payez que vos achats.',
    },
  ];

  return (
    <section id="instituts" className="py-16 bg-slate-900">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-4">
              Pour les instituts et professionnels
            </h2>
            <p className="text-lg text-slate-300 mb-8">
              Que vous soyez esthéticienne, gérant d'un institut de beauté, ou responsable d'un atelier,
              Daseis vous aide à réduire vos coûts d'approvisionnement sans changer vos fournisseurs habituels.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors"
            >
              Je suis un professionnel
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
          <div className="space-y-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-6 bg-slate-800 rounded-lg border border-slate-700"
              >
                <div className="flex-shrink-0">
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">
                    {benefit.title}
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Composant Pour les fournisseurs
function ForSuppliers() {
  const benefits = [
    {
      icon: (
        <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: 'Nouveaux clients professionnels',
      description: 'Accédez à un réseau de professionnels locaux recherchant des produits de qualité à prix compétitifs.',
    },
    {
      icon: (
        <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      title: 'Augmentation de votre chiffre d\'affaires',
      description: 'Générez des ventes supplémentaires sans effort commercial supplémentaire.',
    },
    {
      icon: (
        <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Rémunération à la performance',
      description: 'Vous ne payez une commission que sur les commandes réellement passées avec les codes Daseis.',
    },
  ];

  return (
    <section id="fournisseurs" className="py-16 bg-slate-800">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="lg:order-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-4">
              Pour les fournisseurs
            </h2>
            <p className="text-lg text-slate-300 mb-8">
              Vous êtes fournisseur de produits professionnels ? Daseis vous permet d'atteindre
              de nouveaux clients qualifiés qui recherchent activement vos produits.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors"
            >
              Je suis un fournisseur
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
          <div className="lg:order-1 space-y-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-6 bg-slate-900 rounded-lg border border-slate-700"
              >
                <div className="flex-shrink-0">
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">
                    {benefit.title}
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Composant Transparence
function TransparencySection() {
  return (
    <section className="py-16 bg-slate-800">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="inline-block px-4 py-1 bg-blue-900/30 text-blue-300 text-sm font-medium rounded-full mb-6">
          Transparence
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-6">
          Un modèle gagnant-gagnant
        </h2>
        <p className="text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto mb-8">
          Daseis est rémunéré par les fournisseurs sous forme de commission sur les commandes
          passées avec les codes que nous attribuons. <strong className="text-white">Ce service est et reste gratuit pour les professionnels.</strong>
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-8">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-900/30 rounded-full flex items-center justify-center border border-blue-700">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-white mb-2">Pour vous</h3>
            <p className="text-slate-300 text-sm">
              Accès à des tarifs préférentiels<br />sans frais ni engagement
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-emerald-900/30 rounded-full flex items-center justify-center border border-emerald-700">
              <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold text-white mb-2">Pour nous</h3>
            <p className="text-slate-300 text-sm">
              Commission sur les ventes<br />réalisées via vos codes
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// Composant Formulaire de contact
function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    activity: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSuccess(true);
    setFormData({ name: '', activity: '', email: '', phone: '', message: '' });
  };

  if (isSuccess) {
    return (
      <section id="contact" className="py-16 bg-slate-900">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="w-16 h-16 mx-auto mb-6 bg-emerald-900/30 rounded-full flex items-center justify-center border border-emerald-700">
            <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Message envoyé avec succès !
          </h2>
          <p className="text-slate-300">
            Nous vous répondrons dans les plus brefs délais à l'adresse : <strong className="text-white">[VOTRE EMAIL]</strong>
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-16 bg-slate-800">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Contactez-nous
          </h2>
          <p className="mt-4 text-lg text-slate-300">
            Vous avez des questions ? Remplissez ce formulaire et nous vous répondrons rapidement.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-slate-900 p-8 rounded-xl border border-slate-700">
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-200 mb-2">
                Nom / Prénom *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-white placeholder-slate-500"
                placeholder="Votre nom"
              />
            </div>
            <div>
              <label htmlFor="activity" className="block text-sm font-medium text-slate-200 mb-2">
                Activité *
              </label>
              <input
                type="text"
                id="activity"
                name="activity"
                value={formData.activity}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-white placeholder-slate-500"
                placeholder="Ex: Institut de beauté"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-200 mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-white placeholder-slate-500"
                placeholder="votre@email.com"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-200 mb-2">
                Téléphone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-white placeholder-slate-500"
                placeholder="06 12 34 56 78"
              />
            </div>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-slate-200 mb-2">
              Message *
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical text-white placeholder-slate-500"
              placeholder="Décrivez vos besoins ou posez votre question..."
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Envoi en cours...
              </>
            ) : (
              <>
                Envoyer le message
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </>
            )}
          </button>

          <p className="text-xs text-slate-400 text-center">
            * Champs obligatoires. Vos données sont traitées conformément à notre politique de confidentialité.
          </p>
        </form>
      </div>
    </section>
  );
}

// Composant Footer
function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">
              Daseis
            </h3>
            <p className="text-sm leading-relaxed mb-4">
              Mise en relation entre professionnels et fournisseurs pour des achats à prix réduits.
            </p>
            <div className="space-y-2 text-sm">
              <p>
                <strong className="text-white">Email :</strong> [À COMPLÉTER]
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-white font-bold text-lg mb-4">
              Mentions légales
            </h3>
            <div className="space-y-3 text-sm">
              <p>
                <strong className="text-white">Entreprise :</strong> [NOM DE L'ENTREPRISE]
              </p>
              <p>
                <strong className="text-white">SIRET :</strong> [NUMÉRO SIRET]
              </p>
              <p>
                <strong className="text-white">Adresse :</strong> [ADRESSE COMPLÈTE]
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8">
          <div className="text-center">
            <h4 className="text-white font-semibold mb-3">
              Politique de confidentialité (RGPD)
            </h4>
            <p className="text-xs leading-relaxed max-w-4xl mx-auto">
              Les données personnelles collectées via ce formulaire sont utilisées uniquement pour vous recontacter.
              Elles ne seront jamais transmises à des tiers sans votre consentement explicite.
              Vous disposez d'un droit d'accès, de rectification et de suppression de vos données.
              Pour l'exercer, contactez-nous à l'adresse email indiquée ci-dessus.
              <br />
              <strong className="text-white">Responsable du traitement :</strong> [NOM DU RESPONSABLE]
            </p>
          </div>
          <p className="text-center text-xs text-slate-500 mt-8">
            © {new Date().getFullYear()} Daseis. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}

// Composant principal
export default function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-white antialiased">
      <Header />
      <main>
        <HeroSection />
        <HowItWorks />
        <ForInstitutes />
        <ForSuppliers />
        <TransparencySection />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
}
