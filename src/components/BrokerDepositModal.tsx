import React, { useState } from 'react';
import { UserWallet, depositCash } from '../actions';
import { X, Wallet, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

interface BrokerDepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: UserWallet;
  onDepositSuccess: (newWallet: UserWallet) => void;
}

export const BrokerDepositModal: React.FC<BrokerDepositModalProps> = ({
  isOpen,
  onClose,
  wallet,
  onDepositSuccess
}) => {
  const [amount, setAmount] = useState<number>(5000);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;
    setLoading(true);

    try {
      const updated = await depositCash(amount);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onDepositSuccess(updated);
        onClose();
      }, 1200);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-zinc-950 border border-zinc-800 text-zinc-100 relative font-mono"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/60">
          <div className="flex items-center space-x-2">
            <Wallet size={16} className="text-amber-400" />
            <span className="text-xs text-zinc-200 font-bold">
              Approvisionner le Compte Espèces Broker
            </span>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-white">
            <X size={16} />
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 size={40} className="text-emerald-400 mx-auto" />
            <h3 className="text-base font-bold text-zinc-100">Dépôt Enregistré Instantanément</h3>
            <p className="text-xs text-zinc-400">
              +{amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} € crédités sur votre compte de négociation.
            </p>
          </div>
        ) : (
          <form onSubmit={handleDeposit} className="p-6 space-y-4">
            <div className="p-3 bg-zinc-900 border border-zinc-800 text-xs">
              <span className="text-zinc-400 text-xs block">SOLDE ESPÈCES ACTUEL</span>
              <span className="text-xl font-bold text-amber-400">
                {wallet.cash_balance.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
              </span>
            </div>

            <div>
              <label className="text-xs text-zinc-400 block mb-1">
                Montant du Virement Instantané (€)
              </label>
              <div className="grid grid-cols-4 gap-1.5 mb-2">
                {[1000, 5000, 10000, 25000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmount(amt)}
                    className={`py-1 text-xs border ${
                      amount === amt 
                        ? 'border-amber-400 bg-amber-500/10 text-amber-300 font-bold'
                        : 'border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    +{amt.toLocaleString('fr-FR')} €
                  </button>
                ))}
              </div>
              <input
                type="number"
                min="100"
                step="100"
                value={amount}
                onChange={(e) => setAmount(Math.max(1, parseFloat(e.target.value) || 0))}
                className="w-full bg-zinc-900 border border-zinc-800 px-3 py-2 text-zinc-100 font-mono text-sm focus:outline-none focus:border-zinc-500"
              />
            </div>

            <div className="flex items-center space-x-2 text-xs text-zinc-400">
              <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
              <span>Mode démonstration : aucun fonds réel n'est débité.</span>
            </div>

            <button
              type="submit"
              disabled={loading || amount <= 0}
              className="w-full py-3 bg-accent text-on-accent font-bold text-xs hover:bg-amber-400 transition flex items-center justify-center space-x-1.5"
            >
              <span>{loading ? 'Crédit en cours...' : `Créditer +${amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`}</span>
              <ArrowRight size={14} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
