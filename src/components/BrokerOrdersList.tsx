import React from 'react';
import { BrokerOrder } from '../actions';
import { ArrowUpRight, ArrowDownRight, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface BrokerOrdersListProps {
  orders: BrokerOrder[];
  onRefresh?: () => void;
}

export const BrokerOrdersList: React.FC<BrokerOrdersListProps> = ({ orders }) => {
  if (orders.length === 0) {
    return (
      <div className="p-8 text-center border border-zinc-800 bg-zinc-950 font-mono text-zinc-400">
        <Clock size={28} className="mx-auto mb-2 text-zinc-600" />
        <p className="text-xs">Aucun ordre exécuté pour le moment</p>
        <p className="text-xs text-zinc-400 mt-1">
          Utilisez le bouton "NÉGOCIER / ACHETER" sur une fiche d'actif pour passer votre premier ordre de bourse éthique.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-zinc-800 bg-zinc-950">
      <div className="px-4 py-3 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/60 font-mono">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span className="text-xs font-bold text-zinc-200">
            Registre des Exécutions Broker ({orders.length})
          </span>
        </div>
        <span className="text-xs text-zinc-400">
          Carnet d'ordres (démonstration)
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-xs">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/30 text-xs text-zinc-400">
              <th className="py-2.5 px-4">Date / Réf</th>
              <th className="py-2.5 px-4">Sens</th>
              <th className="py-2.5 px-4">Actif / ISIN</th>
              <th className="py-2.5 px-4 text-right">Quantité</th>
              <th className="py-2.5 px-4 text-right">Cours Exécuté</th>
              <th className="py-2.5 px-4 text-right">Montant Total</th>
              <th className="py-2.5 px-4 text-center">Frais</th>
              <th className="py-2.5 px-4 text-right">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900">
            {orders.map((ord) => {
              const isBuy = ord.side === 'BUY';
              const dateStr = new Date(ord.created_at).toLocaleString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <tr key={ord.id} className="hover:bg-zinc-900/40 transition">
                  <td className="py-3 px-4 text-zinc-400">
                    <div>{dateStr}</div>
                    <div className="text-xs text-zinc-400 font-mono">{ord.id}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center space-x-1 px-1.5 py-0.5 text-xs font-bold  border ${
                      isBuy 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                        : 'bg-red-500/10 text-red-400 border-red-500/30'
                    }`}>
                      {isBuy ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                      <span>{isBuy ? 'ACHAT' : 'VENTE'}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-zinc-100">{ord.name}</div>
                    <div className="text-xs text-zinc-400">{ord.ticker} • {ord.isin}</div>
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-zinc-200">
                    {ord.quantity}
                  </td>
                  <td className="py-3 px-4 text-right text-zinc-300">
                    {ord.price.toFixed(2)} €
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-zinc-100">
                    {ord.total_amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-emerald-400 text-xs">0,00 €</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="inline-flex items-center space-x-1 text-emerald-400 text-xs">
                      <CheckCircle2 size={11} />
                      <span>{ord.status}</span>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
