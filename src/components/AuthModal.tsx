import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Lock,
  Mail,
  User,
  Church,
  HeartHandshake,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Building
} from 'lucide-react';
import clsx from 'clsx';

export interface UserSession {
  name: string;
  email: string;
  role: 'famille' | 'congregation' | 'diocèse';
  organization?: string;
  initials: string;
}

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  currentUser: UserSession | null;
  onLogin: (user: UserSession) => void;
  onLogout: () => void;
}

const DEMO_ACCOUNTS: UserSession[] = [
  {
    name: 'Père Jean-Baptiste',
    email: 'econome@congregation-stjoseph.fr',
    role: 'congregation',
    organization: 'Congrégation des Frères de Saint-Joseph',
    initials: 'JB'
  },
  {
    name: 'Benoît & Claire Martin',
    email: 'famille.martin@gmail.com',
    role: 'famille',
    organization: 'Patrimoine Familial & Transmission',
    initials: 'BC'
  },
  {
    name: 'Chancellerie Diocésaine',
    email: 'finances@diocese-paris.catholique.fr',
    role: 'diocèse',
    organization: 'Conseil aux Affaires Économiques',
    initials: 'CD'
  }
];

export function AuthModal({
  open,
  onClose,
  currentUser,
  onLogin,
  onLogout
}: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'signin' | 'demo'>('demo');

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const initials = email
      .split('@')[0]
      .split('.')
      .map(part => part[0]?.toUpperCase() || '')
      .join('')
      .slice(0, 2) || 'HM';

    onLogin({
      name: email.split('@')[0].replace('.', ' '),
      email,
      role: 'famille',
      organization: 'Compte Personnel Homonobus',
      initials
    });
    onClose();
  };

  const handleSelectDemo = (account: UserSession) => {
    onLogin(account);
    onClose();
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
          className="fixed inset-0 bg-black/80"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 10 }}
          className="relative bg-panel border border-white/10 w-full max-w-md overflow-hidden z-10 p-6 font-sans text-slate-100 rounded-none"
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-white/[0.08]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-emerald-800 border border-emerald-600 flex items-center justify-center text-white font-serif font-semibold text-base rounded-none">
                H
              </div>
              <div>
                <h3 className="text-base font-bold tracking-tight text-white">
                  {currentUser ? 'Mon Espace Homonobus' : 'Espace Membre Institutionnel'}
                </h3>
                <p className="text-xs text-slate-400">
                  Plateforme d'investissement éthique & catholique
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

          {/* If already logged in */}
          {currentUser ? (
            <div className="py-6 space-y-4">
              <div className="p-4 bg-raised border border-white/[0.08] flex items-center gap-3.5 rounded-none">
                <div className="w-10 h-10 bg-emerald-950 border border-emerald-500/30 text-emerald-400 font-bold flex items-center justify-center text-sm rounded-none">
                  {currentUser.initials}
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{currentUser.name}</div>
                  <div className="text-xs text-slate-400">{currentUser.email}</div>
                  <span className="inline-block mt-1 text-xs font-semibold text-emerald-300 bg-emerald-950 border border-emerald-500/30 px-2 py-0.5 rounded-none font-mono">
                    {currentUser.organization || 'Membre vérifié'}
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-400 space-y-2 p-3 bg-panel border border-white/[0.06] rounded-none">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Analyses de portefeuille selon la DSE</span>
                </div>
                <div className="flex items-center gap-2">
                  <Church className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Critères inspirés des orientations de la CEF</span>
                </div>
              </div>

              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="w-full py-2.5 border border-rose-500/30 bg-rose-950/40 text-rose-300 hover:bg-rose-950/70 text-xs font-semibold transition-all cursor-pointer rounded-none font-mono"
              >
                Se déconnecter
              </button>
            </div>
          ) : (
            <div className="py-4 space-y-4">
              {/* Tab switcher */}
              <div className="flex bg-raised border border-white/[0.08] text-xs font-semibold rounded-none">
                <button
                  type="button"
                  onClick={() => setActiveTab('demo')}
                  className={clsx(
                    'flex-1 py-1.5 transition-all cursor-pointer rounded-none',
                    activeTab === 'demo'
                      ? 'bg-white text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  )}
                >
                  Profils Démo (1-clic)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('signin')}
                  className={clsx(
                    'flex-1 py-1.5 transition-all cursor-pointer rounded-none',
                    activeTab === 'signin'
                      ? 'bg-white text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  )}
                >
                  Identifiant & Clé
                </button>
              </div>

              {/* DEMO PROFILES */}
              {activeTab === 'demo' && (
                <div className="space-y-2">
                  <p className="text-xs text-slate-400">
                    Connectez-vous instantanément avec l'un de nos profils types :
                  </p>

                  {DEMO_ACCOUNTS.map(acc => (
                    <button
                      key={acc.email}
                      type="button"
                      onClick={() => handleSelectDemo(acc)}
                      className="w-full p-3 bg-raised border border-white/[0.06] hover:border-white/30 hover:bg-raised transition-all text-left flex items-center justify-between group cursor-pointer rounded-none"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/[0.06] group-hover:bg-emerald-950 text-slate-200 group-hover:text-emerald-300 font-bold flex items-center justify-center text-xs transition-colors border border-white/[0.08] rounded-none">
                          {acc.initials}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">{acc.name}</div>
                          <div className="text-xs text-slate-400">{acc.organization}</div>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-emerald-300 bg-emerald-950 px-2 py-0.5 border border-emerald-500/30 rounded-none font-mono">
                        Accéder
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* STANDARD SIGN IN */}
              {activeTab === 'signin' && (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1 font-mono">Adresse email ou identifiant diocésain</label>
                    <div className="relative flex items-center">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="exemple@diocese.fr"
                        className="w-full pl-9 pr-3.5 py-2.5 bg-raised border border-white/[0.08] text-xs text-white focus:outline-none focus:border-accent font-sans rounded-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1 font-mono">Mot de passe</label>
                    <div className="relative flex items-center">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-3.5 py-2.5 bg-raised border border-white/[0.08] text-xs text-white focus:outline-none focus:border-accent font-sans rounded-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-accent hover:bg-accent-hover text-on-accent font-bold text-xs active:scale-[0.98] transition-all cursor-pointer mt-2 flex items-center justify-center gap-1.5 rounded-none"
                  >
                    <span>Entrer dans mon espace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Footer notice */}
          <div className="pt-3 border-t border-white/[0.08] text-center text-xs text-slate-500 font-mono">
            Vos données restent confidentielles.
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
