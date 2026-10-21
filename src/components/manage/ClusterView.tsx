import React from 'react';
import { initialClusterNodes } from '../../data/manageData';
import { Server, ShieldCheck, Lock, Globe, Smartphone, CheckCircle2 } from 'lucide-react';

interface ClusterViewProps {
  lang: 'nl' | 'en';
}

export const ClusterView: React.FC<ClusterViewProps> = ({ lang }) => {
  const isNl = lang === 'nl';

  const certificates = [
    {
      domain: '*.fesafotos.nl (Wildcard)',
      issuer: "Let's Encrypt Authority X3",
      status: 'Geldig & Auto-renewal',
      expiresIn: '74 dagen',
      issuedOn: '2026-08-01',
    },
    {
      domain: 'manage.fesafotos.nl',
      issuer: "Let's Encrypt Authority X3",
      status: 'Geldig (HSTS ingeschakeld)',
      expiresIn: '74 dagen',
      issuedOn: '2026-08-01',
    },
    {
      domain: 'sanjayendewie.nl (Custom domein)',
      issuer: 'Cloudflare Edge SSL (CNAME)',
      status: 'Geldig & Geverifieerd',
      expiresIn: '210 dagen',
      issuedOn: '2026-05-14',
    },
  ];

  const sessions = [
    {
      device: 'MacBook Pro (macOS Sequoia) : Chrome 132',
      ip: '82.161.44.12 (Amsterdam, NL)',
      location: 'Huidige sessie (deze browser)',
      isCurrent: true,
      lastSeen: 'Nu actief',
    },
    {
      device: 'iPhone 17 Pro : Safari Mobile',
      ip: '145.131.20.8 (KPN 5G)',
      location: 'Locatiebezoek Paviljoen Puur',
      isCurrent: false,
      lastSeen: 'Gisteren om 23:14 CET',
    },
  ];

  const domains = [
    {
      domain: 'sanjayendewie.nl',
      tenantSlug: 'sanjayendewie',
      partyName: 'Sanjay & Dewie',
      dnsStatus: 'CNAME geverifieerd (cname.fesafotos.nl)',
      sslStatus: 'SSL actief',
      verified: true,
    },
    {
      domain: 'mientjesfeest.nl',
      tenantSlug: 'mientjes65',
      partyName: 'Mientjes 65',
      dnsStatus: 'Wacht op DNS propagatie (TTL 3600)',
      sslStatus: 'Certificaat aangevraagd',
      verified: false,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="pb-4 border-b border-[var(--border)]">
        <h2 className="font-display font-extrabold text-2xl text-[var(--ink)] tracking-tight">
          {isNl ? 'Vloot, Cluster & Beveiliging' : 'Fleet, Cluster & Security'}
        </h2>
        <p className="text-xs text-[var(--ink-soft)] mt-0.5">
          {isNl
            ? 'Kubernetes clusterstatus, SSL certificaten, actieve sessies en eigen domeinnaam verificatie.'
            : 'Kubernetes cluster health, SSL certificates, active operator sessions, and custom domain DNS.'}
        </p>
      </div>

      {/* 1. Cluster Node Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-bold text-base text-[var(--ink)]">
            {isNl ? 'Cluster Nodes (europe-west4 Amsterdam)' : 'Cluster Nodes (europe-west4 Amsterdam)'}
          </h3>
          <span className="text-xs font-mono-code text-[var(--success)] font-semibold">
            3/3 Nodes operationeel · 41 pods running
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {initialClusterNodes.map((node) => (
            <div
              key={node.name}
              className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-5 shadow-2xs space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                <div className="flex items-center gap-2">
                  <Server size={16} className="text-[var(--ink-soft)]" />
                  <span className="font-mono-code font-bold text-xs text-[var(--ink)]">
                    {node.name}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono-code bg-emerald-50 text-[var(--success)] font-bold border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)]" />
                  <span>{node.status}</span>
                </span>
              </div>

              {/* Resource meters */}
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between font-mono-code text-[11px] mb-1">
                    <span className="text-[var(--ink-soft)]">CPU Belasting</span>
                    <span className="font-bold text-[var(--ink)] tabular-nums">{node.cpuPercent}%</span>
                  </div>
                  <div className="w-full bg-[var(--paper)] rounded-full h-1.5 overflow-hidden border border-[var(--border)]">
                    <div
                      className={`h-1.5 rounded-full ${node.cpuPercent > 70 ? 'bg-[var(--warning)]' : 'bg-[var(--success)]'}`}
                      style={{ width: `${node.cpuPercent}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-mono-code text-[11px] mb-1">
                    <span className="text-[var(--ink-soft)]">Geheugen (RAM)</span>
                    <span className="font-bold text-[var(--ink)] tabular-nums">{node.memPercent}%</span>
                  </div>
                  <div className="w-full bg-[var(--paper)] rounded-full h-1.5 overflow-hidden border border-[var(--border)]">
                    <div
                      className={`h-1.5 rounded-full ${node.memPercent > 75 ? 'bg-[var(--warning)]' : 'bg-[var(--accent)]'}`}
                      style={{ width: `${node.memPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between text-[11px] font-mono-code text-[var(--ink-soft)]">
                <span>{node.podsRunning} pods</span>
                <span>Uptime: {node.uptime}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. SSL Certificates & Expiry Countdown */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 shadow-2xs">
        <div className="pb-3 mb-4 border-b border-[var(--border)]">
          <h3 className="font-display font-bold text-base text-[var(--ink)]">
            {isNl ? 'SSL Certificaten & Versleuteling' : 'SSL Certificates & Encryption'}
          </h3>
          <p className="text-xs text-[var(--ink-soft)]">
            {isNl
              ? 'TLSv1.3 en HSTS actief op alle subdomeinen en geverifieerde eigen domeinen.'
              : 'TLSv1.3 and HSTS active across all wildcards and verified custom domains.'}
          </p>
        </div>

        <div className="space-y-3">
          {certificates.map((cert) => (
            <div
              key={cert.domain}
              className="p-3.5 rounded-2xl bg-[var(--paper)] border border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div>
                <div className="font-mono-code font-bold text-sm text-[var(--ink)] flex items-center gap-2">
                  <Lock size={13} className="text-[var(--success)]" />
                  <span>{cert.domain}</span>
                </div>
                <div className="text-[11px] text-[var(--ink-soft)] mt-0.5 font-mono-code">
                  Uitgever: {cert.issuer} · Uitgegeven op {cert.issuedOn}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-mono-code text-xs text-[var(--success)] font-semibold">
                  {cert.status}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[var(--surface)] border border-[var(--border)] font-mono-code text-[11px] font-bold text-[var(--ink)]">
                  Verloopt over {cert.expiresIn}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Custom Domains & DNS Routing */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 shadow-2xs">
        <div className="pb-3 mb-4 border-b border-[var(--border)]">
          <h3 className="font-display font-bold text-base text-[var(--ink)]">
            {isNl ? 'Gekoppelde Eigen Domeinen' : 'Connected Custom Domains'}
          </h3>
          <p className="text-xs text-[var(--ink-soft)]">
            {isNl
              ? 'DNS routering voor klanten met een Event+ pakket.'
              : 'DNS routing for customers on the Event+ tier.'}
          </p>
        </div>

        <div className="space-y-3">
          {domains.map((dom) => (
            <div
              key={dom.domain}
              className="p-3.5 rounded-2xl bg-[var(--paper)] border border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div>
                <div className="font-mono-code font-bold text-sm text-[var(--ink)] flex items-center gap-2">
                  <Globe size={14} className="text-[var(--accent)]" />
                  <span>{dom.domain}</span>
                  <span className="text-[11px] text-[var(--ink-soft)] font-normal">
                    → {dom.tenantSlug}.fesafotos.nl
                  </span>
                </div>
                <div className="text-[11px] text-[var(--ink-soft)] mt-0.5">
                  Tenant: <strong>{dom.partyName}</strong>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center gap-1 font-mono-code text-[11px] font-semibold ${
                    dom.verified ? 'text-[var(--success)]' : 'text-[var(--warning)]'
                  }`}
                >
                  <CheckCircle2 size={12} strokeWidth={2} />
                  <span>{dom.dnsStatus}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Active Operator Sessions */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 shadow-2xs">
        <div className="pb-3 mb-4 border-b border-[var(--border)]">
          <h3 className="font-display font-bold text-base text-[var(--ink)]">
            {isNl ? 'Actieve Operator Sessies' : 'Active Operator Sessions'}
          </h3>
          <p className="text-xs text-[var(--ink-soft)]">
            {isNl
              ? 'Beheersessies geauthenticeerd via code-login voor Sanjay Mankoe.'
              : 'Admin sessions authenticated via secure code login for Sanjay Mankoe.'}
          </p>
        </div>

        <div className="space-y-3 text-xs">
          {sessions.map((sess, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-[var(--paper)] border border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--ink)]">
                  <Smartphone size={16} strokeWidth={1.5} />
                </div>
                <div>
                  <div className="font-bold text-[var(--ink)] flex items-center gap-2">
                    <span>{sess.device}</span>
                    {sess.isCurrent && (
                      <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-[var(--success)] text-[10px] font-mono-code font-bold">
                        Huidig
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] font-mono-code text-[var(--ink-soft)] mt-0.5">
                    {sess.ip} · {sess.location}
                  </div>
                </div>
              </div>

              <div className="text-[11px] font-mono-code text-[var(--ink-soft)]">
                {sess.lastSeen}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
