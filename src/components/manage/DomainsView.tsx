import React, { useState } from 'react';
import { CustomDomainEntry } from '../../types/manage';
import { initialCustomDomains } from '../../data/manageData';
import { Globe, ShieldCheck, CheckCircle2, AlertTriangle, RefreshCw, Plus, Search, ExternalLink } from 'lucide-react';

interface DomainsViewProps {
  lang: 'nl' | 'en';
  onShowToast: (msg: string) => void;
}

export const DomainsView: React.FC<DomainsViewProps> = ({ lang, onShowToast }) => {
  const isNl = lang === 'nl';
  const [domains, setDomains] = useState<CustomDomainEntry[]>(initialCustomDomains);
  const [testingDomain, setTestingDomain] = useState<string | null>(null);
  const [diagnosticResult, setDiagnosticResult] = useState<{
    domain: string;
    target: string;
    status: 'ok' | 'error';
    details: string;
  } | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newDomain, setNewDomain] = useState('');
  const [tenantSlug, setTenantSlug] = useState('sanjayendewie');

  const runDnsCheck = (domain: string) => {
    setTestingDomain(domain);
    setDiagnosticResult(null);

    setTimeout(() => {
      setTestingDomain(null);
      if (domain === 'sanjayendewie.nl') {
        setDiagnosticResult({
          domain,
          target: 'cname.fesafotos.nl',
          status: 'ok',
          details: 'CNAME record correct ingesteld (TTL 300). TLSv1.3 certificaat actief via Cloudflare Edge.',
        });
        onShowToast(`DNS voor ${domain} is 100% geverifieerd!`);
      } else {
        setDiagnosticResult({
          domain,
          target: 'cname.fesafotos.nl',
          status: 'error',
          details: 'CNAME ontbreekt of wijst nog naar oude hostingprovider. Wacht op DNS propagatie (TTL 3600).',
        });
        onShowToast(`DNS waarschuwing voor ${domain}.`);
      }
    }, 1200);
  };

  const handleAddDomain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomain.trim()) return;

    const entry: CustomDomainEntry = {
      domain: newDomain.trim().toLowerCase(),
      tenantSlug,
      partyName: tenantSlug === 'sanjayendewie' ? 'Sanjay & Dewie' : 'Mientjes 65',
      dnsTarget: 'cname.fesafotos.nl',
      dnsVerified: false,
      sslActive: false,
      sslExpiresDays: 90,
      autoRenew: true,
    };

    setDomains([...domains, entry]);
    setIsAddModalOpen(false);
    onShowToast(`Domein ${newDomain} gekoppeld. Voeg nu een CNAME toe die wijst naar cname.fesafotos.nl.`);
    setNewDomain('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[var(--border)] gap-3">
        <div>
          <h2 className="font-display font-extrabold text-2xl text-[var(--ink)] tracking-tight">
            {isNl ? 'Eigen Domeinen & DNS Diagnostiek' : 'Custom Domains & DNS Diagnostics'}
          </h2>
          <p className="text-xs text-[var(--ink-soft)] mt-0.5">
            {isNl
              ? 'Koppel eigen domeinnamen (bijv. sanjayendewie.nl) voor Event+ feesten met automatische SSL provisioning.'
              : 'Configure custom domains with automated TLS certificates for Event+ parties.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="px-3.5 py-2 rounded-xl bg-[var(--ink)] text-white hover:bg-[#292524] text-xs font-semibold flex items-center gap-1.5 shadow-2xs self-start sm:self-auto"
        >
          <Plus size={14} />
          <span>{isNl ? 'Domein koppelen' : 'Attach Domain'}</span>
        </button>
      </div>

      {/* Diagnostic Panel */}
      <div className="p-5 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-2xs space-y-3">
        <h3 className="font-display font-bold text-sm text-[var(--ink)]">
          Live DNS Query Simulator
        </h3>
        <p className="text-xs text-[var(--ink-soft)]">
          Voer direct een live DNS resolver test uit om te controleren of de CNAME naar <code className="font-mono-code bg-[var(--paper)] px-1 py-0.5 rounded text-[var(--ink)]">cname.fesafotos.nl</code> correct propageert.
        </p>

        {diagnosticResult && (
          <div
            className={`p-3.5 rounded-2xl border text-xs font-mono-code space-y-1 ${
              diagnosticResult.status === 'ok'
                ? 'bg-emerald-50 text-[var(--success)] border-emerald-200'
                : 'bg-amber-50 text-[var(--warning)] border-amber-200'
            }`}
          >
            <div className="font-bold flex items-center gap-2">
              {diagnosticResult.status === 'ok' ? (
                <CheckCircle2 size={14} />
              ) : (
                <AlertTriangle size={14} />
              )}
              <span>Resultaat voor {diagnosticResult.domain}:</span>
            </div>
            <div>{diagnosticResult.details}</div>
          </div>
        )}
      </div>

      {/* Domain Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {domains.map((dom) => (
          <div
            key={dom.domain}
            className="p-5 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-2xs space-y-4 hover:border-[var(--accent)] transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-[var(--paper)] text-[var(--accent)] border border-[var(--border)]">
                  <Globe size={18} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-mono-code font-bold text-base text-[var(--ink)]">
                    {dom.domain}
                  </h3>
                  <div className="text-xs text-[var(--ink-soft)] font-medium">
                    Tenant: <strong>{dom.partyName}</strong> ({dom.tenantSlug}.fesafotos.nl)
                  </div>
                </div>
              </div>

              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-mono-code font-bold uppercase ${
                  dom.dnsVerified
                    ? 'bg-emerald-50 text-[var(--success)] border border-emerald-200'
                    : 'bg-amber-50 text-[var(--warning)] border border-amber-200'
                }`}
              >
                {dom.dnsVerified ? 'Geverifieerd' : 'Wacht op DNS'}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-[var(--paper)] border border-[var(--border)] space-y-1.5 font-mono-code text-[11px]">
              <div className="flex justify-between">
                <span className="text-[var(--ink-soft)]">Doel CNAME:</span>
                <span className="text-[var(--accent)] font-semibold">{dom.dnsTarget}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--ink-soft)]">SSL Certificaat:</span>
                <span className={dom.sslActive ? 'text-[var(--success)] font-bold' : 'text-[var(--warning)]'}>
                  {dom.sslActive ? `Actief (${dom.sslExpiresDays} dagen)` : 'In aanvraag'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--ink-soft)]">Auto-renew:</span>
                <span className="text-[var(--ink)]">Ingeschakeld via Let's Encrypt</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between">
              <span className="text-[10px] font-mono-code text-[var(--ink-soft)]">
                TTL: 300 seconden
              </span>

              <button
                type="button"
                onClick={() => runDnsCheck(dom.domain)}
                disabled={testingDomain === dom.domain}
                className="px-3 py-1.5 rounded-xl border border-[var(--border)] hover:bg-[var(--paper-2)] text-[var(--ink)] text-xs font-semibold flex items-center gap-1.5"
              >
                <RefreshCw size={12} className={testingDomain === dom.domain ? 'animate-spin' : ''} />
                <span>{testingDomain === dom.domain ? 'Testen...' : 'Test DNS status'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[var(--surface)] border border-[var(--border)] rounded-3xl shadow-2xl p-6 text-[var(--ink)] space-y-4"
          >
            <h3 className="font-display font-extrabold text-lg">
              {isNl ? 'Eigen Domeinnaam Toevoegen' : 'Attach Custom Domain'}
            </h3>

            <form onSubmit={handleAddDomain} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Domeinnaam (zonder https://) *</label>
                <input
                  type="text"
                  required
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value.toLowerCase())}
                  placeholder="bijv. sanjayendewie.nl"
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--paper)] font-mono-code text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Koppel aan feest (tenant)</label>
                <select
                  value={tenantSlug}
                  onChange={(e) => setTenantSlug(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--paper)] text-xs font-mono-code"
                >
                  <option value="sanjayendewie">Sanjay & Dewie (Event+)</option>
                  <option value="mientjes65">Mientjes 65 (Event)</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-[var(--paper)] border border-[var(--border)] text-[11px] font-mono-code text-[var(--ink-soft)] leading-relaxed">
                Instructie voor de klant: Maak in DNS een CNAME record aan met naam <strong>@</strong> of <strong>feest</strong> die wijst naar <strong>cname.fesafotos.nl</strong>.
              </div>

              <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-[var(--ink-soft)]"
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  disabled={!newDomain.trim()}
                  className="px-4 py-2 rounded-xl bg-[var(--ink)] text-white text-xs font-semibold disabled:opacity-50"
                >
                  Domein Opslaan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
