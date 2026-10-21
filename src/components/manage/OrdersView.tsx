import React, { useState } from 'react';
import { Order } from '../../types/manage';
import { CreditCard, ExternalLink, RotateCcw, CheckCircle2, Clock } from 'lucide-react';

interface OrdersViewProps {
  orders: Order[];
  lang: 'nl' | 'en';
  onRequestRefund: (order: Order) => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  lang,
  onRequestRefund,
}) => {
  const isNl = lang === 'nl';
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredOrders = orders.filter((o) => {
    if (filterStatus === 'all') return true;
    return o.status === filterStatus;
  });

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono-code font-bold bg-emerald-50 text-[var(--success)] border border-emerald-200">
            <CheckCircle2 size={11} strokeWidth={2} />
            <span>Voltooid</span>
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono-code font-bold bg-amber-50 text-[var(--warning)] border border-amber-200">
            <Clock size={11} strokeWidth={2} />
            <span>In afwachting</span>
          </span>
        );
      case 'refunded':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono-code font-bold bg-purple-50 text-purple-700 border border-purple-200">
            <RotateCcw size={11} strokeWidth={2} />
            <span>Teruggestort</span>
          </span>
        );
      case 'refunding':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono-code font-bold bg-purple-50 text-purple-700 border border-purple-200">
            <span>Bezig met terugstorten</span>
          </span>
        );
      case 'chargeback':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono-code font-bold bg-red-50 text-[var(--danger)] border border-red-200">
            <span>Chargeback</span>
          </span>
        );
      case 'provisioned':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono-code font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <span>Geactiveerd</span>
          </span>
        );
      case 'expired':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono-code font-bold bg-stone-100 text-stone-600 border border-stone-200">
            <span>Verlopen</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
        <div>
          <h2 className="font-display font-extrabold text-2xl text-[var(--ink)] tracking-tight">
            {isNl ? 'Bestellingen & Financiën' : 'Orders & Money'}
          </h2>
          <p className="text-xs text-[var(--ink-soft)] mt-0.5">
            {isNl
              ? 'Overzicht van eenmalige pakketbetalingen, Mollie referenties en terugstortingen.'
              : 'Overview of one-time plan payments, Mollie transaction references, and refunds.'}
          </p>
        </div>

        <div className="text-right">
          <div className="text-xs text-[var(--ink-soft)]">Omzet deze maand</div>
          <div className="text-xl font-display font-bold text-[var(--ink)] tabular-nums">
            € 784,00
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center p-1 bg-[var(--paper)] border border-[var(--border)] rounded-2xl text-xs w-fit">
        {['all', 'completed', 'pending', 'refunded'].map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => setFilterStatus(st)}
            className={`px-3 py-1.5 rounded-xl transition-colors font-mono-code text-[11px] ${
              filterStatus === st
                ? 'bg-[var(--surface)] text-[var(--ink)] font-bold shadow-2xs'
                : 'text-[var(--ink-soft)] hover:text-[var(--ink)]'
            }`}
          >
            {st === 'all'
              ? 'Alle'
              : st === 'completed'
              ? 'Voltooid'
              : st === 'pending'
              ? 'In afwachting'
              : 'Teruggestort'}
          </button>
        ))}
      </div>

      {/* Money Table */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl overflow-hidden shadow-2xs">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--paper-2)] text-[var(--ink-soft)] font-mono-code uppercase text-[10px] tracking-wider">
              <th className="py-3 px-4">Order ID & Datum</th>
              <th className="py-3 px-4">Tenant / Feest</th>
              <th className="py-3 px-4">Pakket / Omschrijving</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Mollie Provider Ref</th>
              <th className="py-3 px-4 text-right">Bedrag</th>
              <th className="py-3 px-4 text-right">Actie</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-[var(--paper)] transition-colors">
                <td className="py-3.5 px-4 font-mono-code text-[11px] text-[var(--ink)] whitespace-nowrap">
                  <div className="font-bold">{order.id}</div>
                  <div className="text-[10px] text-[var(--ink-soft)]">{order.createdAt}</div>
                </td>

                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="font-bold text-[var(--ink)]">{order.partyName}</div>
                  <div className="font-mono-code text-[10px] text-[var(--ink-soft)]">
                    {order.tenantSlug}.fesafotos.nl
                  </div>
                </td>

                <td className="py-3.5 px-4 whitespace-nowrap text-[var(--ink)]">
                  <div className="font-medium">{order.planName}</div>
                  <div className="text-[10px] text-[var(--ink-soft)]">{order.method}</div>
                </td>

                <td className="py-3.5 px-4 whitespace-nowrap">
                  {getStatusBadge(order.status)}
                </td>

                <td className="py-3.5 px-4 whitespace-nowrap font-mono-code text-[11px] text-[var(--ink-soft)]">
                  <span className="select-all hover:text-[var(--ink)]">{order.providerRef}</span>
                </td>

                <td className="py-3.5 px-4 text-right font-display font-bold text-sm text-[var(--ink)] tabular-nums whitespace-nowrap">
                  € {order.amountEur.toFixed(2).replace('.', ',')}
                </td>

                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  {order.status === 'completed' && (
                    <button
                      type="button"
                      onClick={() => onRequestRefund(order)}
                      className="px-2.5 py-1 rounded-lg border border-[var(--border)] hover:border-red-300 text-red-700 hover:bg-red-50 text-[11px] font-semibold transition-colors flex items-center gap-1 ml-auto"
                      title="Start bewaakte terugstorting met getypte bevestiging"
                    >
                      <RotateCcw size={11} strokeWidth={1.5} />
                      <span>Terugstorten</span>
                    </button>
                  )}
                  {order.status === 'pending' && (
                    <span className="text-[11px] font-mono-code text-[var(--warning)] font-medium">
                      Wacht op bank
                    </span>
                  )}
                  {order.status === 'refunded' && (
                    <span className="text-[11px] font-mono-code text-purple-700">
                      Gecrediteerd
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
