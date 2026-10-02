import React, { useState } from 'react';
import { Asset, UserWallet, placeBrokerOrder } from '../actions';
import { 
  X, 
  ArrowUpRight, 
  ArrowDownRight, 
  ShieldCheck, 
  Wallet, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Sparkles,
  Lock
} from 'lucide-react';

interface BrokerOrderModalProps {
  asset: Asset;
  userWallet: UserWallet;
  currentHoldingQuantity?: number;
  isOpen: boolean;
  onClose: () => void;
  onOrderExecuted: (newWallet: UserWallet) => void;
}

export const BrokerOrderModal: React.FC<BrokerOrderModalProps> = ({
  asset,
  userWallet,
  currentHoldingQuantity = 0,
  isOpen,
  onClose,
  onOrderExecuted
}) => {
  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY');
  const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT'>('MARKET');
  const [quantity, setQuantity] = useState<number>(10);
  const [limitPrice, setLimitPrice] = useState<number>(asset.current_price);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [executedOrder, setExecutedOrder] = useState<any | null>(null);

  if (!isOpen) return null;

  const executionPrice = orderType === 'LIMIT' ? limitPrice : asset.current_price;
  const totalAmount = Number((quantity * executionPrice).toFixed(2));
  const canAfford = side === 'BUY' ? userWallet.cash_balance >= totalAmount : currentHoldingQuantity >= quantity;

  const handleQuickQuantity = (qty: number) => {
    setQuantity(qty);
    setError(null);
  };

  const handleMaxQuantity = () => {
    if (side === 'BUY') {
      const maxPossible = Math.floor(userWallet.cash_balance / executionPrice);
      setQuantity(Math.max(1, maxPossible));
    } else {
      setQuantity(Math.max(1, currentHoldingQuantity));
    }
    setError(null);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await placeBrokerOrder(
        asset.isin,
        side,
        quantity,
        orderType,
        orderType === 'LIMIT' ? limitPrice : undefined
      );

      setExecutedOrder(res.order);
      onOrderExecuted(res.wallet);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de la transmission de l\'ordre au marché.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-zinc-950 border border-zinc-800 text-zinc-100 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/60">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-none border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-mono text-sm font-bold">
              TX
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs text-zinc-400 font-semibold">TICKET DE NÉGOCIATION BROKER</span>
                <span className="inline-flex items-center px-1.5 py-0.5 text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Instantané 0s
                </span>
              </div>
              <h2 className="text-base font-semibold text-zinc-100 font-mono flex items-center gap-2">
                {asset.name} <span className="text-xs text-zinc-400">({asset.ticker})</span>
              </h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition"
            aria-label="Fermer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Success Confirmation Screen */}
        {executedOrder ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 size={36} />
            </div>
            <div>
              <span className="text-xs font-mono text-emerald-400">Ordre Exécuté avec Succès</span>
              <h3 className="text-xl font-bold font-mono text-zinc-100 mt-1">
                {executedOrder.side === 'BUY' ? 'Achat de' : 'Vente de'} {executedOrder.quantity} titres {executedOrder.ticker}
              </h3>
              <p className="text-xs text-zinc-400 font-mono mt-1">
                Exécuté au cours de {executedOrder.price.toFixed(2)} € • Réf: {executedOrder.id}
              </p>
            </div>

            <div className="p-4 bg-zinc-900 border border-zinc-800 text-left font-mono text-xs space-y-2">
              <div className="flex justify-between text-zinc-400">
                <span>Montant Net Débité / Crédité :</span>
                <span className="text-zinc-100 font-bold">{executedOrder.total_amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Frais de courtage :</span>
                <span className="text-emerald-400 font-bold">0,00 € (Offert)</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Nouveau solde espèces :</span>
                <span className="text-amber-400 font-bold">{userWallet.cash_balance.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onClose}
                className="w-full py-3 bg-zinc-100 text-zinc-950 font-mono text-xs font-bold hover:bg-white transition"
              >
                Retour au Terminal
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitOrder} className="p-6 space-y-5">
            {/* BUY / SELL Switcher */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-900 border border-zinc-800">
              <button
                type="button"
                onClick={() => { setSide('BUY'); setError(null); }}
                className={`py-2 text-xs font-mono  font-bold  transition flex items-center justify-center space-x-1.5 ${
                  side === 'BUY'
                    ? 'bg-emerald-600 text-white '
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <ArrowUpRight size={14} />
                <span>Acheter (BUY)</span>
              </button>
              <button
                type="button"
                onClick={() => { setSide('SELL'); setError(null); }}
                className={`py-2 text-xs font-mono  font-bold  transition flex items-center justify-center space-x-1.5 ${
                  side === 'SELL'
                    ? 'bg-red-600 text-white '
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <ArrowDownRight size={14} />
                <span>Vendre (SELL)</span>
              </button>
            </div>

            {/* Price & Context Card */}
            <div className="p-3 bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between text-xs font-mono">
              <div>
                <span className="text-zinc-400 text-xs">COURS EN DIRECT</span>
                <div className="text-lg font-bold text-zinc-100">
                  {asset.current_price.toFixed(2)} {asset.currency}
                </div>
              </div>
              <div className="text-right">
                <span className="text-zinc-400 text-xs">
                  {side === 'BUY' ? 'ESPÈCES DISPONIBLES' : 'TITRES DÉTENUS'}
                </span>
                <div className="text-sm font-bold text-amber-400 flex items-center justify-end space-x-1">
                  <Wallet size={13} className="text-amber-400/80" />
                  <span>
                    {side === 'BUY' 
                      ? `${userWallet.cash_balance.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`
                      : `${currentHoldingQuantity} titres`
                    }
                  </span>
                </div>
              </div>
            </div>

            {/* Order Type Selection */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-mono text-zinc-400">Type d'Ordre</label>
                <span className="text-xs text-zinc-400 font-mono">Ordre direct marché</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setOrderType('MARKET')}
                  className={`py-2 px-3 text-xs font-mono border text-left transition ${
                    orderType === 'MARKET'
                      ? 'border-zinc-300 bg-zinc-800 text-zinc-100 font-bold'
                      : 'border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center space-x-1.5">
                    <Sparkles size={12} className="text-emerald-400" />
                    <span>Au Marché</span>
                  </div>
                  <div className="text-xs text-zinc-400 font-normal mt-0.5">Exécution immédiate au cours actuel</div>
                </button>

                <button
                  type="button"
                  onClick={() => setOrderType('LIMIT')}
                  className={`py-2 px-3 text-xs font-mono border text-left transition ${
                    orderType === 'LIMIT'
                      ? 'border-zinc-300 bg-zinc-800 text-zinc-100 font-bold'
                      : 'border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center space-x-1.5">
                    <Lock size={12} className="text-amber-400" />
                    <span>Cours Limité</span>
                  </div>
                  <div className="text-xs text-zinc-400 font-normal mt-0.5">Exécution à un prix fixé</div>
                </button>
              </div>
            </div>

            {/* Limit Price Input if selected */}
            {orderType === 'LIMIT' && (
              <div>
                <label className="text-xs font-mono text-zinc-400 block mb-1">
                  Prix Limite Souhaité (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={limitPrice}
                  onChange={(e) => setLimitPrice(Math.max(0.01, parseFloat(e.target.value) || 0))}
                  className="w-full bg-zinc-900 border border-zinc-800 px-3 py-2 text-zinc-100 font-mono text-sm focus:outline-none focus:border-zinc-500"
                />
              </div>
            )}

            {/* Quantity Input & Shortcuts */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-mono text-zinc-400">Nombre de Titres</label>
                <div className="space-x-1">
                  {[1, 5, 10, 25, 50].map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => handleQuickQuantity(q)}
                      className={`px-1.5 py-0.5 text-xs font-mono border ${
                        quantity === q 
                          ? 'border-zinc-400 bg-zinc-800 text-zinc-100' 
                          : 'border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      +{q}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={handleMaxQuantity}
                    className="px-1.5 py-0.5 text-xs font-mono border border-amber-500/40 text-amber-400 hover:bg-amber-500/10"
                  >
                    MAX
                  </button>
                </div>
              </div>

              <input
                type="number"
                min="1"
                step="1"
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setQuantity(isNaN(val) ? 1 : Math.max(1, val));
                  setError(null);
                }}
                className="w-full bg-zinc-900 border border-zinc-800 px-3 py-2 text-zinc-100 font-mono text-sm font-bold focus:outline-none focus:border-zinc-500"
              />
            </div>

            {/* Order Summary & Catholic Criteria Check */}
            <div className="p-3 bg-zinc-900 border border-zinc-800 text-xs font-mono space-y-1.5">
              <div className="flex justify-between text-zinc-400">
                <span>Prix unitaire retenu :</span>
                <span className="text-zinc-200">{executionPrice.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Frais d'intermédiation :</span>
                <span className="text-emerald-400 font-bold">0,00 € (0.00%)</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Conformité Éthique & DSE :</span>
                <span className="text-emerald-400 flex items-center space-x-1">
                  <ShieldCheck size={12} />
                  <span>Conforme CEF/DSE ({asset.catholic.dse_score}/100)</span>
                </span>
              </div>
              <div className="pt-2 border-t border-zinc-800 flex justify-between items-center text-sm">
                <span className="text-zinc-300 font-bold">
                  {side === 'BUY' ? 'Total à Débiter :' : 'Total à Créditer :'}
                </span>
                <span className="text-base font-bold text-zinc-100 font-mono">
                  {totalAmount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                </span>
              </div>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="p-3 bg-red-950/40 border border-red-800/80 text-red-300 text-xs font-mono flex items-start space-x-2">
                <AlertCircle size={15} className="shrink-0 mt-0.5 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            {!canAfford && !error && (
              <div className="p-2.5 bg-amber-950/30 border border-amber-800/60 text-amber-300 text-xs font-mono flex items-center space-x-2">
                <AlertCircle size={14} className="shrink-0 text-amber-400" />
                <span>
                  {side === 'BUY' 
                    ? `Fonds insuffisants : il vous manque ${(totalAmount - userWallet.cash_balance).toFixed(2)} €.`
                    : `Position insuffisante : vous ne détenez que ${currentHoldingQuantity} titres.`
                  }
                </span>
              </div>
            )}

            {/* Execution CTA Button */}
            <div className="pt-1">
              <button
                type="submit"
                disabled={loading || !canAfford}
                className={`w-full py-3.5 text-xs font-mono font-bold   transition flex items-center justify-center space-x-2 ${
                  loading || !canAfford
                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
                    : side === 'BUY'
                      ? 'bg-emerald-500 text-zinc-950 hover:bg-emerald-400 font-extrabold'
                      : 'bg-red-600 text-white hover:bg-red-500 font-extrabold'
                }`}
              >
                {loading ? (
                  <>
                    <Clock size={14} className="animate-spin" />
                    <span>Transmission au Carnet d'Ordres...</span>
                  </>
                ) : (
                  <>
                    {side === 'BUY' ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}
                    <span>
                      {side === 'BUY' 
                        ? `Exécuter l'Achat (${totalAmount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €)` 
                        : `Exécuter la Vente (${totalAmount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €)`
                      }
                    </span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-zinc-400 font-mono text-center leading-tight">
              Mode démonstration : aucun ordre réel n'est transmis à un marché.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};
