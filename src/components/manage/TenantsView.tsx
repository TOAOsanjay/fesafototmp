import React, { useState } from 'react';
import { TenantParty, PlanId } from '../../types/manage';
import { Search, ExternalLink, ShieldAlert, ArrowUpRight, CheckCircle2, AlertTriangle, Eye, X } from 'lucide-react';

interface TenantsViewProps {
  tenants: TenantParty[];
  lang: 'nl' | 'en';
  onImpersonate: (tenant: TenantParty) => void;
  onUpdatePlan: (tenantId: string, newPlan: PlanId) => void;
}

export const TenantsView: React.FC<TenantsViewProps> = ({
  tenants,
  lang,
  onImpersonate,
  onUpdatePlan,
}) => {
  const isNl = lang === 'nl';
  const [searchQuery, setSearchQuery] = useState('');
  const [planFilter, setPlanFilter] = useState<'all' | PlanId>('all');
  const [healthFilter, setHealthFilter] = useState<'all' | 'healthy' | 'warning' | 'error'>('all');
  const [selectedTenant, setSelectedTenant] = useState<TenantParty | null>(null);

  const filteredTenants = tenants.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.hashtag.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlan = planFilter === 'all' || t.plan === planFilter;
    const matchesHealth = healthFilter === 'all' || t.health === healthFilter;
    return matchesSearch && matchesPlan && matchesHealth;
  });

  const getPlanBadge = (plan: PlanId) => {
    switch (plan) {
      case 'event_plus':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-mono-code font-bold bg-amber-50 text-[var(--accent)] border border-amber-200">
            Event+ (EUR 69)
          </span>
        );
      case 'event':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-mono-code font-bold bg-blue-50 text-blue-800 border border-blue-200">
            Event (EUR 49)
          </span>
        );
      case 'free':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-mono-code font-medium bg-stone-100 text-stone-700 border border-stone-200">
            Gratis (EUR 0)
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header & Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
        <div>
          <h2 className="font-display font-extrabold text-2xl text-[var(--ink)] tracking-tight">
            {isNl ? 'Tenants : Feesten & Evenementen' : 'Tenants : Parties & Events'}
          </h2>
          <p className="text-xs text-[var(--ink-soft)] mt-0.5">
            {isNl
              ? 'Totaal 3 actieve tenants geregistreerd in het platform.'
              : 'Total 3 active tenants registered across the platform.'}
          </p>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono-code text-[var(--ink-soft)]">
            Actieve vloot: 100% online
          </span>
        </div>
      </div>

      {/* Filter Strip */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-3.5 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Field */}
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--ink-soft)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isNl ? 'Zoek op naam, slug of hashtag...' : 'Search by name, slug, or hashtag...'}
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-[var(--border)] bg-[var(--paper)] focus:outline-none focus:border-[var(--accent)] text-[var(--ink)] font-medium"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Plan Filter */}
          <div className="flex items-center p-1 bg-[var(--paper)] border border-[var(--border)] rounded-xl text-xs">
            {(['all', 'free', 'event', 'event_plus'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPlanFilter(p)}
                className={`px-2.5 py-1 rounded-lg transition-colors font-mono-code text-[11px] ${
                  planFilter === p
                    ? 'bg-[var(--surface)] text-[var(--ink)] font-bold shadow-2xs'
                    : 'text-[var(--ink-soft)] hover:text-[var(--ink)]'
                }`}
              >
                {p === 'all' ? 'Alle' : p === 'event_plus' ? 'Event+' : p === 'event' ? 'Event' : 'Gratis'}
              </button>
            ))}
          </div>

          {/* Health Filter */}
          <div className="flex items-center p-1 bg-[var(--paper)] border border-[var(--border)] rounded-xl text-xs">
            {(['all', 'healthy', 'warning'] as const).map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => setHealthFilter(h)}
                className={`px-2.5 py-1 rounded-lg transition-colors text-[11px] ${
                  healthFilter === h
                    ? 'bg-[var(--surface)] text-[var(--ink)] font-bold shadow-2xs'
                    : 'text-[var(--ink-soft)] hover:text-[var(--ink)]'
                }`}
              >
                {h === 'all' ? 'Status: Alle' : h === 'healthy' ? 'Gezond' : 'Waarschuwing'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-[var(--surface)] border border-[var(--border)] rounded-3xl overflow-hidden shadow-2xs">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--paper-2)] text-[var(--ink-soft)] font-mono-code uppercase text-[10px] tracking-wider">
              <th className="py-3 px-4">Feest & Adres</th>
              <th className="py-3 px-4">Pakket</th>
              <th className="py-3 px-4 text-right">Uploads & Media</th>
              <th className="py-3 px-4 text-right">Gasten</th>
              <th className="py-3 px-4 text-right">Dagen te gaan</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Acties</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {filteredTenants.map((t) => (
              <tr
                key={t.id}
                onClick={() => setSelectedTenant(t)}
                className="hover:bg-[var(--paper)] transition-colors cursor-pointer group"
              >
                <td className="py-3.5 px-4">
                  <div className="font-display font-bold text-sm text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors">
                    {t.name}
                  </div>
                  <div className="font-mono-code text-[11px] text-[var(--ink-soft)] flex items-center gap-1.5 mt-0.5">
                    <span>{t.subdomain}</span>
                    {t.customDomain && (
                      <span className="text-[var(--accent)] font-semibold">({t.customDomain})</span>
                    )}
                  </div>
                  <div className="text-[10px] font-mono-code text-[var(--ink-soft)]/70 mt-0.5">
                    {t.date} · {t.hashtag}
                  </div>
                </td>

                <td className="py-3.5 px-4 whitespace-nowrap">
                  {getPlanBadge(t.plan)}
                </td>

                <td className="py-3.5 px-4 text-right font-mono-code whitespace-nowrap">
                  <span className="font-bold text-[var(--ink)] tabular-nums">{t.uploads}</span>{' '}
                  <span className="text-[var(--ink-soft)]">foto's,</span>{' '}
                  <span className="font-bold text-[var(--ink)] tabular-nums">{t.videos}</span>{' '}
                  <span className="text-[var(--ink-soft)]">video's</span>
                </td>

                <td className="py-3.5 px-4 text-right font-mono-code whitespace-nowrap">
                  <span className="font-bold text-[var(--ink)] tabular-nums">{t.guests}</span>{' '}
                  <span className="text-[var(--ink-soft)]">gasten</span>
                </td>

                <td className="py-3.5 px-4 text-right font-mono-code whitespace-nowrap">
                  <span className="font-bold text-[var(--accent)] tabular-nums">{t.daysToGo}</span>{' '}
                  <span className="text-[var(--ink-soft)]">dagen</span>
                </td>

                <td className="py-3.5 px-4 whitespace-nowrap">
                  {t.health === 'healthy' ? (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono-code bg-emerald-50 text-[var(--success)] border border-emerald-200">
                      <CheckCircle2 size={12} strokeWidth={2} />
                      <span>Gezond</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono-code bg-amber-50 text-[var(--warning)] border border-amber-200">
                      <AlertTriangle size={12} strokeWidth={2} />
                      <span>1 vastloper</span>
                    </span>
                  )}
                </td>

                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => setSelectedTenant(t)}
                      className="p-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--paper-2)] text-[var(--ink)]"
                      title="Bekijk tenant details"
                    >
                      <Eye size={14} strokeWidth={1.5} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onImpersonate(t)}
                      className="px-2.5 py-1 rounded-lg bg-[var(--ink)] text-white hover:bg-[#292524] text-[11px] font-semibold flex items-center gap-1 shadow-2xs"
                      title="Veilige impersonatie weergave"
                    >
                      <span>Host-view</span>
                      <ExternalLink size={11} strokeWidth={1.5} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Feed */}
      <div className="md:hidden space-y-3">
        {filteredTenants.map((t) => (
          <div
            key={t.id}
            onClick={() => setSelectedTenant(t)}
            className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-2xs space-y-3 cursor-pointer"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-display font-bold text-base text-[var(--ink)]">
                  {t.name}
                </h3>
                <div className="font-mono-code text-xs text-[var(--ink-soft)]">
                  {t.subdomain}
                </div>
              </div>
              <div>{getPlanBadge(t.plan)}</div>
            </div>

            <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-[var(--paper)] border border-[var(--border)] text-center text-xs font-mono-code">
              <div>
                <div className="text-[10px] text-[var(--ink-soft)] uppercase">Uploads</div>
                <div className="font-bold text-[var(--ink)] tabular-nums">{t.uploads}</div>
              </div>
              <div>
                <div className="text-[10px] text-[var(--ink-soft)] uppercase">Video's</div>
                <div className="font-bold text-[var(--ink)] tabular-nums">{t.videos}</div>
              </div>
              <div>
                <div className="text-[10px] text-[var(--ink-soft)] uppercase">Dagen</div>
                <div className="font-bold text-[var(--accent)] tabular-nums">{t.daysToGo}</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-[var(--border)]">
              <span className="text-[11px] text-[var(--ink-soft)] font-mono-code">{t.hashtag}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onImpersonate(t);
                }}
                className="px-3 py-1 rounded-lg bg-[var(--ink)] text-white text-xs font-semibold flex items-center gap-1"
              >
                <span>Host-view</span>
                <ArrowUpRight size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Tenant Detail Drawer / Modal */}
      {selectedTenant && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setSelectedTenant(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:max-w-2xl bg-[var(--surface)] border border-[var(--border)] rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[90dvh] sm:max-h-[85vh] flex flex-col overflow-hidden text-[var(--ink)]"
          >
            {/* Header */}
            <div className="p-5 border-b border-[var(--border)] bg-[var(--paper-2)] flex items-start justify-between">
              <div>
                <div className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-[var(--accent)]">
                  Tenant Detail #{selectedTenant.id}
                </div>
                <h3 className="font-display font-extrabold text-xl text-[var(--ink)] mt-0.5">
                  {selectedTenant.name}
                </h3>
                <div className="text-xs font-mono-code text-[var(--ink-soft)] mt-0.5 flex items-center gap-2">
                  <span>{selectedTenant.subdomain}</span>
                  {selectedTenant.customDomain && (
                    <span className="font-semibold text-[var(--accent)]">({selectedTenant.customDomain})</span>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTenant(null)}
                className="w-8 h-8 rounded-full bg-[var(--paper)] hover:bg-[var(--border)] flex items-center justify-center text-xs font-semibold transition-colors"
                aria-label="Sluit detailvenster"
              >
                <X size={16} strokeWidth={1.5} />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* Metric strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-[var(--paper)] border border-[var(--border)] text-center">
                  <div className="text-[10px] text-[var(--ink-soft)] font-mono-code uppercase">Uploads</div>
                  <div className="text-xl font-display font-bold tabular-nums text-[var(--ink)]">
                    {selectedTenant.uploads}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[var(--paper)] border border-[var(--border)] text-center">
                  <div className="text-[10px] text-[var(--ink-soft)] font-mono-code uppercase">Video's</div>
                  <div className="text-xl font-display font-bold tabular-nums text-[var(--ink)]">
                    {selectedTenant.videos}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[var(--paper)] border border-[var(--border)] text-center">
                  <div className="text-[10px] text-[var(--ink-soft)] font-mono-code uppercase">Gasten</div>
                  <div className="text-xl font-display font-bold tabular-nums text-[var(--ink)]">
                    {selectedTenant.guests}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[var(--paper)] border border-[var(--border)] text-center">
                  <div className="text-[10px] text-[var(--ink-soft)] font-mono-code uppercase">Opslag</div>
                  <div className="text-xl font-display font-bold tabular-nums text-[var(--accent)]">
                    {(selectedTenant.storageMb / 1024).toFixed(1)} GB
                  </div>
                </div>
              </div>

              {/* Host & Plan settings */}
              <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--paper-2)] space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
                  <span className="font-semibold text-[var(--ink)]">Organisator</span>
                  <span className="font-mono-code text-[var(--ink-soft)]">
                    {selectedTenant.hostName} ({selectedTenant.hostEmail})
                  </span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
                  <span className="font-semibold text-[var(--ink)]">Huidig Pakket</span>
                  <div className="flex items-center gap-2">
                    {getPlanBadge(selectedTenant.plan)}
                    <button
                      type="button"
                      onClick={() => {
                        const newP = selectedTenant.plan === 'event_plus' ? 'event' : 'event_plus';
                        onUpdatePlan(selectedTenant.id, newP);
                        setSelectedTenant({ ...selectedTenant, plan: newP });
                      }}
                      className="text-[11px] font-mono-code text-[var(--accent)] underline"
                    >
                      Wissel plan
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
                  <span className="font-semibold text-[var(--ink)]">Hashtag & Thema</span>
                  <span className="font-mono-code text-[var(--accent)]">{selectedTenant.hashtag}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[var(--ink)]">Retentieperiode</span>
                  <span className="font-mono-code text-[var(--ink-soft)]">
                    {selectedTenant.plan === 'event_plus' ? '24 maanden garantie' : '12 maanden'}
                  </span>
                </div>
              </div>

              {/* Media Moderation & Review overview */}
              <div>
                <h4 className="font-display font-bold text-sm text-[var(--ink)] mb-2">
                  Media Recente Uploads & Review Status
                </h4>
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[var(--success)]" />
                      <span className="font-mono-code">IMG_4021_Diner_Sanjay_Dewie.jpg</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono-code bg-emerald-50 text-[var(--success)] font-semibold">
                      Geaccepteerd
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[var(--success)]" />
                      <span className="font-mono-code">VID_9823_Openingsdans_Feest.mp4</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono-code bg-emerald-50 text-[var(--success)] font-semibold">
                      Geaccepteerd (0:28)
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <span className="font-mono-code">Selfie_Bruidspaar_Sanne.jpg</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono-code bg-amber-50 text-[var(--warning)] font-semibold">
                      In beoordeling
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-[var(--border)] bg-[var(--paper-2)] flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSelectedTenant(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--ink-soft)] hover:text-[var(--ink)]"
              >
                Sluiten
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onImpersonate(selectedTenant)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[var(--ink)] hover:bg-[#292524] flex items-center gap-1.5 shadow-2xs"
                >
                  <span>Open Impersonate View</span>
                  <ExternalLink size={13} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
