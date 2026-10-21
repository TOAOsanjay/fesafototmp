import React, { useState } from 'react';
import { PlanConfig } from '../../types/manage';
import { Save, Check, Plus, ShieldCheck } from 'lucide-react';

interface PlansViewProps {
  plans: PlanConfig[];
  lang: 'nl' | 'en';
  onSavePlan: (updatedPlan: PlanConfig) => void;
}

export const PlansView: React.FC<PlansViewProps> = ({
  plans,
  lang,
  onSavePlan,
}) => {
  const isNl = lang === 'nl';
  const [editingPlans, setEditingPlans] = useState<PlanConfig[]>(plans);
  const [savedPlanId, setSavedPlanId] = useState<string | null>(null);

  const handleFieldChange = (
    planId: string,
    field: keyof PlanConfig,
    value: string | number
  ) => {
    setEditingPlans((prev) =>
      prev.map((p) => (p.id === planId ? { ...p, [field]: value } : p))
    );
  };

  const handleSave = (plan: PlanConfig) => {
    onSavePlan(plan);
    setSavedPlanId(plan.id);
    setTimeout(() => setSavedPlanId(null), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="pb-4 border-b border-[var(--border)]">
        <h2 className="font-display font-extrabold text-2xl text-[var(--ink)] tracking-tight">
          {isNl ? 'Plannen & Limieten' : 'Plans & Limits'}
        </h2>
        <p className="text-xs text-[var(--ink-soft)] mt-0.5">
          {isNl
            ? 'Beheer prijzen, videolimieten en retentie per pakket. Wijzigingen worden direct geregistreerd in de audit trail.'
            : 'Manage pricing, video clip quotas, and retention rules. Updates are logged directly into the audit trail.'}
        </p>
      </div>

      {/* Plans Table / Cards */}
      <div className="space-y-6">
        {editingPlans.map((plan) => (
          <div
            key={plan.id}
            className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 shadow-2xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[var(--border)] gap-2">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-[var(--accent)]" />
                <h3 className="font-display font-bold text-lg text-[var(--ink)]">
                  {plan.name} Pakket
                </h3>
                <span className="font-mono-code text-xs px-2 py-0.5 rounded bg-[var(--paper)] text-[var(--ink-soft)] border border-[var(--border)]">
                  id: {plan.id}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {savedPlanId === plan.id && (
                  <span className="text-xs text-[var(--success)] font-semibold flex items-center gap-1 font-mono-code">
                    <Check size={13} strokeWidth={2.5} />
                    <span>Opgeslagen & Audit geregistreerd!</span>
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => handleSave(plan)}
                  className="px-4 py-2 rounded-xl bg-[var(--ink)] hover:bg-[#292524] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Save size={13} strokeWidth={1.5} />
                  <span>Opslaan</span>
                </button>
              </div>
            </div>

            {/* Editable Fields Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-xs">
              <div>
                <label className="block text-[11px] font-mono-code text-[var(--ink-soft)] uppercase mb-1">
                  Prijs (EUR eenmalig)
                </label>
                <input
                  type="number"
                  value={plan.price}
                  onChange={(e) =>
                    handleFieldChange(plan.id, 'price', Number(e.target.value))
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--paper)] focus:outline-none focus:border-[var(--accent)] font-mono-code font-bold text-[var(--ink)] tabular-nums"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono-code text-[var(--ink-soft)] uppercase mb-1">
                  Videoclips limiet
                </label>
                <input
                  type="number"
                  value={plan.videoClips}
                  onChange={(e) =>
                    handleFieldChange(plan.id, 'videoClips', Number(e.target.value))
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--paper)] focus:outline-none focus:border-[var(--accent)] font-mono-code font-bold text-[var(--ink)] tabular-nums"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono-code text-[var(--ink-soft)] uppercase mb-1">
                  Videoduur (seconden)
                </label>
                <input
                  type="number"
                  value={plan.videoDurationSec}
                  onChange={(e) =>
                    handleFieldChange(plan.id, 'videoDurationSec', Number(e.target.value))
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--paper)] focus:outline-none focus:border-[var(--accent)] font-mono-code font-bold text-[var(--ink)] tabular-nums"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono-code text-[var(--ink-soft)] uppercase mb-1">
                  Retentie (maanden)
                </label>
                <input
                  type="number"
                  value={plan.retentionMonths}
                  onChange={(e) =>
                    handleFieldChange(plan.id, 'retentionMonths', Number(e.target.value))
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--paper)] focus:outline-none focus:border-[var(--accent)] font-mono-code font-bold text-[var(--ink)] tabular-nums"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono-code text-[var(--ink-soft)] uppercase mb-1">
                  Gasten capaciteit
                </label>
                <input
                  type="text"
                  value={plan.guestsLimit}
                  onChange={(e) =>
                    handleFieldChange(plan.id, 'guestsLimit', e.target.value)
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--paper)] focus:outline-none focus:border-[var(--accent)] font-medium text-[var(--ink)]"
                />
              </div>
            </div>

            {/* What this plan unlocks */}
            <div className="pt-2">
              <div className="text-[11px] font-mono-code uppercase text-[var(--ink-soft)] mb-2 font-bold">
                Wat dit pakket ontgrendelt:
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-[var(--ink-soft)]">
                {plan.unlocks.map((u, i) => (
                  <li key={i} className="flex items-start gap-1.5 p-2 rounded-xl bg-[var(--paper)] border border-[var(--border)]">
                    <span className="text-[var(--success)] font-bold">✓</span>
                    <span className="leading-snug">{u}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}

        {/* Add-ons list */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 shadow-2xs">
          <div className="pb-3 mb-4 border-b border-[var(--border)]">
            <h3 className="font-display font-bold text-base text-[var(--ink)]">
              {isNl ? 'Beschikbare Add-ons voor Organisatoren' : 'Available Add-ons for Hosts'}
            </h3>
            <p className="text-xs text-[var(--ink-soft)]">
              {isNl
                ? 'Losse upgrades die hosts kunnen aanschaffen bovenop hun pakket.'
                : 'Standalone upgrades hosts can purchase on top of their plan.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-[var(--paper)] border border-[var(--border)] flex flex-col justify-between">
              <div>
                <div className="font-bold text-sm text-[var(--ink)] mb-1">Media Top-up</div>
                <p className="text-xs text-[var(--ink-soft)] leading-normal">
                  +500 extra foto's en video's capaciteit voor grote vieringen.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-[var(--border)] flex items-center justify-between font-mono-code">
                <span className="text-[var(--ink-soft)]">Prijs:</span>
                <span className="font-bold text-[var(--ink)]">EUR 15,00</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--paper)] border border-[var(--border)] flex flex-col justify-between">
              <div>
                <div className="font-bold text-sm text-[var(--ink)] mb-1">Retentie Verlenging</div>
                <p className="text-xs text-[var(--ink-soft)] leading-normal">
                  +12 maanden verlenging van de actieve online galerij.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-[var(--border)] flex items-center justify-between font-mono-code">
                <span className="text-[var(--ink-soft)]">Prijs:</span>
                <span className="font-bold text-[var(--ink)]">EUR 19,00</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--paper)] border border-[var(--border)] flex flex-col justify-between">
              <div>
                <div className="font-bold text-sm text-[var(--ink)] mb-1">Video Top-up</div>
                <p className="text-xs text-[var(--ink-soft)] leading-normal">
                  +25 extra Full HD videoclips inclusief transcoding capaciteit.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-[var(--border)] flex items-center justify-between font-mono-code">
                <span className="text-[var(--ink-soft)]">Prijs:</span>
                <span className="font-bold text-[var(--ink)]">EUR 12,00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
