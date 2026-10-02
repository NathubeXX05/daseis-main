import React, { useState } from 'react';
import { Drawer } from 'vaul';
import { submitLead } from '../actions';
import { toast } from 'sonner';
import { Loader2, ShieldCheck, PhoneCall, Sparkles, CheckCircle2, HeartHandshake } from 'lucide-react';

interface LeadDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LeadDrawer({ open, onOpenChange }: LeadDrawerProps) {
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;

    setIsSubmitting(true);
    try {
      const res = await submitLead(phone);
      if (res.success) {
        setIsSuccess(true);
        toast.success('Demande transmise avec succès !');
        setTimeout(() => {
          onOpenChange(false);
          setIsSuccess(false);
          setPhone('');
          setFullName('');
        }, 2200);
      } else {
        toast.error(res.error || 'Erreur lors de la soumission.');
      }
    } catch {
      toast.error('Erreur réseau. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/80 z-50 transition-opacity" />
        <Drawer.Content className="bg-panel border-t border-white/10 text-slate-100 flex flex-col rounded-none max-h-[85vh] fixed bottom-0 left-0 right-0 z-50 focus:outline-none">
          <div className="p-6 flex-1 flex flex-col max-w-lg mx-auto w-full">
            {/* Grab handle */}
            <div className="mx-auto w-12 h-1 flex-shrink-0 bg-slate-700 mb-6 cursor-grab rounded-none" />

            <div className="flex-1 flex flex-col">
              <div className="flex items-center gap-2 mb-2 text-emerald-400 font-semibold text-xs font-mono">
                <HeartHandshake className="w-4 h-4" />
                CONSEIL PATRIMONIAL CHRÉTIEN
              </div>

              <Drawer.Title className="font-semibold text-2xl tracking-tight text-white mb-2 font-sans">
                Aligner vos Épargnes sur la DSE
              </Drawer.Title>
              
              <Drawer.Description className="text-slate-400 mb-6 text-sm tracking-tight leading-relaxed">
                Nos spécialistes en finance catholique vous accompagnent confidentiellement pour purger votre portefeuille des forages fossiles et activités contraires à la dignité humaine.
              </Drawer.Description>

              {isSuccess ? (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 rounded-none flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold tracking-tight text-white mb-1">
                    Demande Confirmée
                  </h3>
                  <p className="text-sm text-slate-400 max-w-xs">
                    Un conseiller spécialisé prendra contact avec vous dans la plus stricte discrétion pastorale.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex-1 flex flex-col space-y-4">
                  <div>
                    <label
                      htmlFor="lead-name"
                      className="block text-xs font-semibold font-mono text-slate-400 mb-1.5"
                    >
                      Prénom & Nom (Optionnel)
                    </label>
                    <input
                      id="lead-name"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Jean-Baptiste Martin"
                      className="w-full px-4 py-3 bg-raised rounded-none border border-white/[0.08] focus:outline-none focus:border-accent text-white placeholder-slate-500 transition-all text-sm font-sans"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="lead-phone"
                      className="block text-xs font-semibold font-mono text-slate-400 mb-1.5"
                    >
                      Numéro de téléphone <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      id="lead-phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="06 12 34 56 78"
                      className="w-full px-4 py-3 bg-raised rounded-none border border-white/[0.08] focus:outline-none focus:border-accent text-white placeholder-slate-500 transition-all text-sm font-mono"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting || !phone}
                      className="w-full py-3.5 bg-white hover:bg-neutral-200 disabled:opacity-40 text-slate-950 font-bold rounded-none transition-all flex items-center justify-center gap-2 cursor-pointer text-sm font-mono"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                      ) : (
                        <>
                          <PhoneCall className="w-4 h-4 text-slate-950" />
                          <span>Demander un audit gratuit</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
