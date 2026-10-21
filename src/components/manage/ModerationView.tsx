import React, { useState, useEffect } from 'react';
import { ModerationItem } from '../../types/manage';
import { initialModerationItems } from '../../data/manageData';
import { Check, X, AlertTriangle, ShieldCheck, Clock } from 'lucide-react';

interface ModerationViewProps {
  lang: 'nl' | 'en';
}

export const ModerationView: React.FC<ModerationViewProps> = ({ lang }) => {
  const isNl = lang === 'nl';
  const [items, setItems] = useState<ModerationItem[]>(initialModerationItems);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const handleDecision = (id: string, decision: 'approved' | 'rejected' | 'escalated') => {
    const item = items.find((i) => i.id === id);
    setItems((prev) => prev.filter((i) => i.id !== id));

    const noticeText =
      decision === 'approved'
        ? `Item ${id} (${item?.tenantName}) goedgekeurd en gepubliceerd op de muur.`
        : decision === 'rejected'
        ? `Item ${id} afgewezen en verwijderd met notificatie naar gast.`
        : `Item ${id} geëscaleerd naar host ter beoordeling.`;

    setActionNotice(noticeText);
    setTimeout(() => setActionNotice(null), 3000);
  };

  // Keyboard-first shortcuts on active first item
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (items.length === 0) return;
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      const firstId = items[0].id;
      if (e.key === 'a' || e.key === 'A') {
        handleDecision(firstId, 'approved');
      } else if (e.key === 'r' || e.key === 'R') {
        handleDecision(firstId, 'rejected');
      } else if (e.key === 'e' || e.key === 'E') {
        handleDecision(firstId, 'escalated');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--border)]">
        <div>
          <h2 className="font-display font-extrabold text-2xl text-[var(--ink)] tracking-tight">
            {isNl ? 'Moderatie Wachtrij' : 'Moderation Review Queue'}
          </h2>
          <p className="text-xs text-[var(--ink-soft)] mt-0.5">
            {isNl
              ? 'Beoordeel gerapporteerde uploads of automatische vlaggen. Sneltoetsen: [A] Goedkeuren, [R] Afwijzen, [E] Escaleren.'
              : 'Review reported uploads or auto flags. Keyboard shortcuts: [A] Approve, [R] Reject, [E] Escalate.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono-code text-xs px-2.5 py-1 rounded-full bg-[var(--paper-2)] border border-[var(--border)] text-[var(--ink-soft)] font-semibold">
            {items.length} {isNl ? 'in wacht' : 'in queue'}
          </span>
        </div>
      </div>

      {actionNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-mono-code text-[var(--success)] font-semibold flex items-center gap-2 animate-in fade-in">
          <Check size={14} strokeWidth={2.5} />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Review Queue Items */}
      {items.length > 0 ? (
        <div className="space-y-4">
          {items.map((item, idx) => (
            <div
              key={item.id}
              className={`bg-[var(--surface)] border rounded-3xl p-5 shadow-2xs transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-5 ${
                idx === 0 ? 'border-[var(--ink)] ring-1 ring-[var(--ink)]' : 'border-[var(--border)]'
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Media Thumbnail */}
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-[var(--paper)] border border-[var(--border)] shrink-0 relative">
                  <img
                    src={item.mediaUrl}
                    alt={item.reason}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/75 text-white text-[9px] font-mono-code uppercase font-bold">
                    {item.type}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-mono-code text-[11px] text-[var(--ink-soft)]">
                    <span className="font-bold text-[var(--ink)]">{item.tenantName}</span>
                    <span>·</span>
                    <span>{item.timestamp}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1 text-[var(--warning)] font-semibold">
                      <Clock size={11} strokeWidth={1.5} />
                      <span>Deadline: {item.deadlineCountdown}</span>
                    </span>
                  </div>

                  <div className="text-sm font-semibold text-[var(--ink)]">
                    {item.reason}
                  </div>

                  <div className="text-xs text-[var(--ink-soft)] font-mono-code">
                    Geüpload door: {item.uploadedBy} · {item.reporterCount} melding
                  </div>
                </div>
              </div>

              {/* Three Decisions with Keyboard Hints */}
              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                <button
                  type="button"
                  onClick={() => handleDecision(item.id, 'approved')}
                  className="px-3.5 py-2 rounded-xl bg-[var(--success)] text-white hover:opacity-90 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                  title="Sneltoets: Druk op A"
                >
                  <Check size={13} strokeWidth={2.5} />
                  <span>Keur goed [A]</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDecision(item.id, 'rejected')}
                  className="px-3.5 py-2 rounded-xl border border-red-300 bg-red-50 hover:bg-red-100 text-[var(--danger)] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  title="Sneltoets: Druk op R"
                >
                  <X size={13} strokeWidth={2.5} />
                  <span>Wijs af [R]</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDecision(item.id, 'escalated')}
                  className="px-3.5 py-2 rounded-xl border border-[var(--border)] bg-[var(--paper)] hover:bg-[var(--paper-2)] text-[var(--ink)] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  title="Sneltoets: Druk op E"
                >
                  <AlertTriangle size={13} strokeWidth={1.5} />
                  <span>Escaleer [E]</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 text-center rounded-3xl bg-[var(--surface)] border-2 border-dashed border-[var(--border)] max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[var(--success)] text-2xl flex items-center justify-center mx-auto mb-3">
            <ShieldCheck size={28} strokeWidth={1.5} />
          </div>
          <h3 className="font-display font-bold text-lg text-[var(--ink)] mb-1">
            {isNl ? 'Moderatie Wachtrij is Helemaal Schoon' : 'Moderation Queue is Clean'}
          </h3>
          <p className="text-xs text-[var(--ink-soft)] leading-relaxed">
            {isNl
              ? 'Er zijn momenteel geen gerapporteerde foto\'s of openstaande vlaggen. Alle uploads zijn goedgekeurd.'
              : 'There are no reported media items or pending flags. All party albums are running smoothly.'}
          </p>
        </div>
      )}
    </div>
  );
};
