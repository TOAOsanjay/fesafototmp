import React, { useState } from 'react';
import { Voucher } from '../../types/manage';
import { initialVouchers } from '../../data/manageData';
import { Ticket, Plus, Copy, Check, Calendar, Users, X } from 'lucide-react';

interface VouchersViewProps {
  lang: 'nl' | 'en';
  onShowToast: (msg: string) => void;
}

export const VouchersView: React.FC<VouchersViewProps> = ({ lang, onShowToast }) => {
  const isNl = lang === 'nl';
  const [vouchers, setVouchers] = useState<Voucher[]>(initialVouchers);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState('15% korting');
  const [maxUses, setMaxUses] = useState(50);
  const [validUntil, setValidUntil] = useState('31 december 2026');

  const handleCopy = (c: string) => {
    navigator.clipboard?.writeText(c);
    setCopiedCode(c);
    onShowToast(`Kortingscode ${c} gekopieerd naar klembord!`);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleAddVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    const newV: Voucher = {
      code: code.trim().toUpperCase(),
      discount: discount.trim(),
      usedCount: 0,
      maxUses,
      status: 'active',
      validUntil: validUntil.trim(),
    };

    setVouchers([newV, ...vouchers]);
    setIsModalOpen(false);
    onShowToast(`Kortingscode ${newV.code} aangemaakt en actief!`);
    setCode('');
  };

  const handleToggleStatus = (codeToToggle: string) => {
    setVouchers((prev) =>
      prev.map((v) =>
        v.code === codeToToggle
          ? { ...v, status: v.status === 'active' ? 'expired' : 'active' }
          : v
      )
    );
    onShowToast(`Status van kortingscode ${codeToToggle} aangepast.`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[var(--border)] gap-3">
        <div>
          <h2 className="font-display font-extrabold text-2xl text-[var(--ink)] tracking-tight">
            {isNl ? 'Kortingscodes & Promotie Vouchers' : 'Discount Codes & Promo Vouchers'}
          </h2>
          <p className="text-xs text-[var(--ink-soft)] mt-0.5">
            {isNl
              ? 'Beheer acties voor wedding planners, locaties en promotionele upgrades naar Event en Event+.'
              : 'Manage promotional campaigns for wedding planners, venues, and upgrades.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-3.5 py-2 rounded-xl bg-[var(--ink)] text-white hover:bg-[#292524] text-xs font-semibold flex items-center gap-1.5 shadow-2xs self-start sm:self-auto"
        >
          <Plus size={14} />
          <span>{isNl ? 'Nieuwe voucher aanmaken' : 'Create Voucher'}</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {vouchers.map((v) => (
          <div
            key={v.code}
            className="p-5 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-2xs space-y-4 hover:border-[var(--accent)] transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Ticket size={16} className="text-[var(--accent)]" />
                <span className="font-mono-code font-bold text-base text-[var(--ink)] tracking-wider">
                  {v.code}
                </span>
              </div>

              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-mono-code font-bold uppercase ${
                  v.status === 'active'
                    ? 'bg-emerald-50 text-[var(--success)] border border-emerald-200'
                    : 'bg-stone-100 text-stone-700 border border-stone-200'
                }`}
              >
                {v.status === 'active' ? 'Actief' : 'Verlopen'}
              </span>
            </div>

            <div className="font-bold text-sm text-[var(--ink)]">
              {v.discount}
            </div>

            {/* Quota bar */}
            <div>
              <div className="flex justify-between font-mono-code text-[11px] text-[var(--ink-soft)] mb-1">
                <span>Verbruikt: {v.usedCount} van {v.maxUses}</span>
                <span>Geldig tot: {v.validUntil}</span>
              </div>
              <div className="w-full bg-[var(--paper)] rounded-full h-1.5 overflow-hidden border border-[var(--border)]">
                <div
                  className="h-1.5 rounded-full bg-[var(--accent)]"
                  style={{ width: `${Math.min(100, (v.usedCount / v.maxUses) * 100)}%` }}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => handleToggleStatus(v.code)}
                className="text-[11px] font-mono-code text-[var(--ink-soft)] hover:text-[var(--ink)] underline"
              >
                {v.status === 'active' ? 'Deactiveer code' : 'Heractiveer code'}
              </button>

              <button
                type="button"
                onClick={() => handleCopy(v.code)}
                className="px-3 py-1.5 rounded-xl border border-[var(--border)] hover:bg-[var(--paper-2)] text-[var(--ink)] font-semibold flex items-center gap-1.5 transition-colors"
              >
                {copiedCode === v.code ? (
                  <>
                    <Check size={13} className="text-[var(--success)]" />
                    <span className="text-[var(--success)]">Gekopieerd!</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    <span>Kopieer Code</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[var(--surface)] border border-[var(--border)] rounded-3xl shadow-2xl p-6 text-[var(--ink)] space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
              <h3 className="font-display font-extrabold text-lg">
                {isNl ? 'Nieuwe Vouchercode Aanmaken' : 'Create Voucher Code'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-full bg-[var(--paper)] flex items-center justify-center text-xs"
              >
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleAddVoucher} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Kortingscode (bijv. HERFST2026) *</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, ''))}
                  placeholder="BRUILOFT2026"
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--paper)] font-mono-code text-xs uppercase"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Kortingswaarde / Omschrijving</label>
                <input
                  type="text"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  placeholder="bijv. 20% korting op Event+"
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--paper)] text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Maximaal aantal verzilveringen</label>
                <input
                  type="number"
                  min={1}
                  max={500}
                  value={maxUses}
                  onChange={(e) => setMaxUses(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--paper)] font-mono-code text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Geldig tot</label>
                <input
                  type="text"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  placeholder="31 december 2026"
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--paper)] text-xs"
                />
              </div>

              <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-[var(--ink-soft)]"
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  disabled={!code.trim()}
                  className="px-4 py-2 rounded-xl bg-[var(--ink)] text-white text-xs font-semibold disabled:opacity-50"
                >
                  Opslaan & Activeren
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
