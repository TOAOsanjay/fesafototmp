import React, { useState } from 'react';
import { NavPage } from '../../types/manage';
import { initialAuditLines, initialVouchers } from '../../data/manageData';
import {
  CheckCircle2,
  Clock,
  Mail,
  Camera,
  MapPin,
  Bot,
  GitBranch,
  ShieldCheck,
  Ticket,
  Sliders,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

interface GenericSectionViewProps {
  page: NavPage;
  lang: 'nl' | 'en';
}

export const GenericSectionView: React.FC<GenericSectionViewProps> = ({ page, lang }) => {
  const isNl = lang === 'nl';
  const [vouchers, setVouchers] = useState(initialVouchers);
  const [newVoucherNotice, setNewVoucherNotice] = useState(false);

  // STATUS PAGE
  if (page === 'status') {
    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        <div className="pb-4 border-b border-[var(--border)]">
          <h2 className="font-display font-extrabold text-2xl text-[var(--ink)] tracking-tight">
            Systeemstatus & Healthchecks
          </h2>
          <p className="text-xs text-[var(--ink-soft)] mt-0.5">
            Realtime prober resultaten elke 30 seconden uitgevoerd vanuit Amsterdam en Frankfurt.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {[
            { name: 'Ingress & TLS Gateway', status: 'Gezond (24ms)', region: 'Cloudflare Edge' },
            { name: 'Kubernetes API Server', status: 'Gezond (18ms)', region: 'node-ams-01' },
            { name: 'PostgreSQL Database Cluster', status: 'Gezond (1.8ms)', region: 'Primary + Replica' },
            { name: 'Redis Cache & Wachtrij', status: 'Gezond (0.4ms)', region: 'Memory buffer' },
            { name: 'S3 Object Storage', status: 'Gezond (48ms)', region: 'Frankfurt bucket' },
            { name: 'Mollie Betalingswebhook', status: 'Verbonden', region: 'Webhook listener' },
            { name: 'Transcode ffmpeg Workers', status: '1 waarschuwing', region: 'node-ams-02' },
            { name: 'Mailgun E-mail Relay', status: 'Gezond', region: 'EU Relay' },
            { name: 'Beamer WebSocket Server', status: 'Gezond (9ms)', region: 'Live feed stream' },
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[var(--ink)]">{item.name}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono-code font-bold ${
                    item.status.includes('waarschuwing')
                      ? 'bg-amber-50 text-[var(--warning)] border border-amber-200'
                      : 'bg-emerald-50 text-[var(--success)] border border-emerald-200'
                  }`}
                >
                  {item.status}
                </span>
              </div>
              <div className="text-[11px] font-mono-code text-[var(--ink-soft)]">
                Regio / Locatie: {item.region}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // AUDIT PAGE
  if (page === 'audit') {
    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        <div className="pb-4 border-b border-[var(--border)]">
          <h2 className="font-display font-extrabold text-2xl text-[var(--ink)] tracking-tight">
            Audit Trail & Onveranderlijk Logboek
          </h2>
          <p className="text-xs text-[var(--ink-soft)] mt-0.5">
            Volledige geschiedenis van alle mutaties, betalingen, downloads en planwijzigingen.
          </p>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl overflow-hidden shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--paper-2)] text-[var(--ink-soft)] font-mono-code uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Audit ID & Tijd</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Actie</th>
                <th className="py-3 px-4">Doelwit</th>
                <th className="py-3 px-4 text-right">IP / Bron</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {initialAuditLines.map((line) => (
                <tr key={line.id} className="hover:bg-[var(--paper)] transition-colors">
                  <td className="py-3.5 px-4 font-mono-code text-[11px] text-[var(--ink-soft)] whitespace-nowrap">
                    <div className="font-bold text-[var(--ink)]">{line.id}</div>
                    <div>{line.timestamp}</div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[var(--ink)] whitespace-nowrap">
                    {line.actor}
                  </td>
                  <td className="py-3.5 px-4 text-[var(--ink)]">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono-code font-semibold ${
                        line.status === 'warn'
                          ? 'bg-amber-50 text-[var(--warning)] border border-amber-200'
                          : 'bg-emerald-50 text-[var(--success)] border border-emerald-200'
                      }`}
                    >
                      {line.action}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono-code text-[11px] text-[var(--ink-soft)]">
                    {line.target}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono-code text-[11px] text-[var(--ink-soft)] whitespace-nowrap">
                    {line.ip}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // FOTOGRAFEN PAGE
  if (page === 'fotografen') {
    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        <div className="pb-4 border-b border-[var(--border)]">
          <h2 className="font-display font-extrabold text-2xl text-[var(--ink)] tracking-tight">
            Gekoppelde Fotografen & Portaal Toegang
          </h2>
          <p className="text-xs text-[var(--ink-soft)] mt-0.5">
            Professionele fotografen die rechtstreeks RAW en hoge resolutie originals aanleveren.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-5 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[var(--paper)] text-[var(--ink)]">
                  <Camera size={16} strokeWidth={1.5} />
                </div>
                <div>
                  <div className="font-bold text-sm text-[var(--ink)]">Sander Visser Fotografie</div>
                  <div className="font-mono-code text-[11px] text-[var(--ink-soft)]">sander@visserfoto.nl</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-[var(--success)] font-mono-code text-[10px] font-bold">
                Actief
              </span>
            </div>
            <p className="text-[11px] text-[var(--ink-soft)] leading-normal">
              Gekoppeld aan tenant: <strong>Sanjay & Dewie</strong>. Uploadde 22 full-res JPEG bestanden zonder compressie.
            </p>
            <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between font-mono-code text-[11px]">
              <span>Camera preset: Leica M11 / Sony A7R V</span>
              <span className="text-[var(--accent)] font-semibold">1.4 GB geleverd</span>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[var(--paper)] text-[var(--ink)]">
                  <Camera size={16} strokeWidth={1.5} />
                </div>
                <div>
                  <div className="font-bold text-sm text-[var(--ink)]">Studio Noordwijk</div>
                  <div className="font-mono-code text-[11px] text-[var(--ink-soft)]">contact@studionoordwijk.nl</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-mono-code text-[10px] font-bold">
                In afwachting
              </span>
            </div>
            <p className="text-[11px] text-[var(--ink-soft)] leading-normal">
              Uitnodiging verstuurd voor tenant: <strong>Mientjes 65</strong>. Magic link verloopt over 48 uur.
            </p>
            <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between font-mono-code text-[11px]">
              <span>Magic link: Actief</span>
              <span className="text-[var(--ink-soft)]">0 bestanden</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // LOCATIE PAGE
  if (page === 'locatie') {
    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        <div className="pb-4 border-b border-[var(--border)]">
          <h2 className="font-display font-extrabold text-2xl text-[var(--ink)] tracking-tight">
            Locaties & Zaal Beamer Koppelingen
          </h2>
          <p className="text-xs text-[var(--ink-soft)] mt-0.5">
            Evenementenlocaties met permanente fesafotos beamer hardware of zaalstream tokens.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-5 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <MapPin size={16} className="text-[var(--accent)]" />
                <span className="font-bold text-sm text-[var(--ink)]">Paviljoen Puur (Amsterdam)</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-[var(--success)] font-mono-code text-[10px] font-bold">
                Verbonden
              </span>
            </div>
            <p className="text-[11px] text-[var(--ink-soft)] leading-normal">
              Locatie voor <strong>Sanjay & Dewie</strong> op 30 oktober 2026. Beamer 4K HDMI koppeling getest.
            </p>
            <div className="pt-2 border-t border-[var(--border)] font-mono-code text-[11px] text-[var(--ink-soft)] flex justify-between">
              <span>Resolutie: 3840x2160 @ 60Hz</span>
              <span>Wi-Fi: Paviljoen-Gast</span>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <MapPin size={16} className="text-[var(--accent)]" />
                <span className="font-bold text-sm text-[var(--ink)]">Het Sieraad (Amsterdam)</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-[var(--success)] font-mono-code text-[10px] font-bold">
                Gereed
              </span>
            </div>
            <p className="text-[11px] text-[var(--ink-soft)] leading-normal">
              Grote zaal met dubbele projector. Stream token geconfigureerd voor 14 november 2026.
            </p>
            <div className="pt-2 border-t border-[var(--border)] font-mono-code text-[11px] text-[var(--ink-soft)] flex justify-between">
              <span>Beamer Mode: Dual Screen</span>
              <span>Audio limit: 95 dBA</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // KORTINGSCODES PAGE
  if (page === 'kortingscodes') {
    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[var(--border)] gap-3">
          <div>
            <h2 className="font-display font-extrabold text-2xl text-[var(--ink)] tracking-tight">
              Kortingscodes & Vouchers
            </h2>
            <p className="text-xs text-[var(--ink-soft)] mt-0.5">
              Beheer actieve acties voor bruiloften en event planners.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setNewVoucherNotice(true);
              setTimeout(() => setNewVoucherNotice(false), 2500);
            }}
            className="px-3.5 py-2 rounded-xl bg-[var(--ink)] text-white text-xs font-semibold"
          >
            + Nieuwe voucher
          </button>
        </div>

        {newVoucherNotice && (
          <div className="p-3 rounded-xl bg-emerald-50 text-[var(--success)] text-xs font-semibold font-mono-code">
            ✓ Voucher dialoog geopend (ZOMERACTIE_2026 voorbereid).
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {vouchers.map((v) => (
            <div key={v.code} className="p-5 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono-code font-bold text-sm text-[var(--accent)] tracking-wider">
                  {v.code}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono-code font-bold ${
                    v.status === 'active'
                      ? 'bg-emerald-50 text-[var(--success)] border border-emerald-200'
                      : 'bg-stone-100 text-stone-600 border border-stone-200'
                  }`}
                >
                  {v.status === 'active' ? 'Actief' : 'Verlopen'}
                </span>
              </div>

              <div className="font-bold text-[var(--ink)]">{v.discount}</div>

              <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between font-mono-code text-[11px] text-[var(--ink-soft)]">
                <span>Verbruikt: {v.usedCount} van {v.maxUses}</span>
                <span>Geldig tot: {v.validUntil}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // EMAIL & EMAILWACHTRIJ PAGE
  if (page === 'email' || page === 'emailwachtrij') {
    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        <div className="pb-4 border-b border-[var(--border)]">
          <h2 className="font-display font-extrabold text-2xl text-[var(--ink)] tracking-tight">
            E-mailwachtrij & Transactionele Sjablonen
          </h2>
          <p className="text-xs text-[var(--ink-soft)] mt-0.5">
            Mailgun relay toezicht, afleverstatus van QR uitnodigingen en facturen.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs mb-6">
          <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
            <div className="text-[11px] text-[var(--ink-soft)]">Wachtrij status</div>
            <div className="text-xl font-display font-bold text-[var(--success)] mt-0.5">0 in wacht</div>
            <div className="text-[10px] font-mono-code text-[var(--ink-soft)]">Alle mails binnen 1.4s afgeleverd</div>
          </div>
          <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
            <div className="text-[11px] text-[var(--ink-soft)]">Afleverratio vandaag</div>
            <div className="text-xl font-display font-bold text-[var(--ink)] tabular-nums mt-0.5">99,8%</div>
            <div className="text-[10px] font-mono-code text-[var(--success)]">Geen bounces gemeld</div>
          </div>
          <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
            <div className="text-[11px] text-[var(--ink-soft)]">DKIM & SPF</div>
            <div className="text-xl font-display font-bold text-[var(--success)] mt-0.5">Geverifieerd</div>
            <div className="text-[10px] font-mono-code text-[var(--ink-soft)]">fesafotos.nl relay</div>
          </div>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 shadow-2xs space-y-3 text-xs">
          <h3 className="font-display font-bold text-sm text-[var(--ink)]">
            Actieve Transactionele Sjablonen
          </h3>
          <div className="space-y-2">
            {[
              { id: 'tpl_welcome', name: 'Feest Welkomstmail & QR Tafelkaart', sends: '1.850 verzonden' },
              { id: 'tpl_invoice', name: 'Event / Event+ Factuur (Mollie webhook)', sends: '492 verzonden' },
              { id: 'tpl_magic', name: 'Fotograaf Magic Link Login', sends: '142 verzonden' },
              { id: 'tpl_zip_ready', name: 'ZIP Download Archief Klaar Notificatie', sends: '388 verzonden' },
            ].map((tpl) => (
              <div key={tpl.id} className="p-3 rounded-xl bg-[var(--paper)] border border-[var(--border)] flex items-center justify-between font-mono-code">
                <span className="font-semibold text-[var(--ink)]">{tpl.name}</span>
                <span className="text-[var(--ink-soft)] text-[11px]">{tpl.sends}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // AGENTS PAGE
  if (page === 'agents') {
    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        <div className="pb-4 border-b border-[var(--border)]">
          <h2 className="font-display font-extrabold text-2xl text-[var(--ink)] tracking-tight">
            Agent-oppervlakken : Watcher & Detectie
          </h2>
          <p className="text-xs text-[var(--ink-soft)] mt-0.5">
            Geautomatiseerde bewakingsagents voor vlootgezondheid, stuck uploads en moderatie.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-2xs space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <Bot size={18} className="text-[var(--accent)]" />
              <span className="font-bold text-sm text-[var(--ink)]">agent-watcher-prod</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-50 text-[var(--success)] font-mono-code text-[11px] font-bold">
              Draaiend (PID 481)
            </span>
          </div>

          <div className="space-y-2 text-[var(--ink-soft)] leading-relaxed">
            <p>
              Inspectiecyclus: <strong>elke 60 seconden</strong>. Bewaakt ffmpeg workers, memory spikes en SSL verloop.
            </p>
            <p className="font-mono-code text-[11px]">
              Laatste sweep: 2026-10-20 22:15:33 CET · 41 pods gecontroleerd · 1 waarschuwing geregistreerd op node-ams-02.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // PIJPLIJN PAGE
  if (page === 'pijplijn') {
    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        <div className="pb-4 border-b border-[var(--border)]">
          <h2 className="font-display font-extrabold text-2xl text-[var(--ink)] tracking-tight">
            CI/CD Pijplijn & Releases
          </h2>
          <p className="text-xs text-[var(--ink-soft)] mt-0.5">
            Build containers, database migraties en uitrolgeschiedenis.
          </p>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 shadow-2xs space-y-3 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
            <span className="font-bold text-sm text-[var(--ink)] font-mono-code">release-v2.14.8-prod</span>
            <span className="px-2 py-0.5 rounded bg-emerald-50 text-[var(--success)] font-mono-code font-bold">
              Live in productie
            </span>
          </div>

          <div className="space-y-2 text-[11px] font-mono-code text-[var(--ink-soft)]">
            <div className="flex justify-between">
              <span>Commit: e3c35b56 (cohesive redesign & safety fix)</span>
              <span>14 oktober 2026</span>
            </div>
            <div className="flex justify-between">
              <span>Container Image: europe-west4-docker.pkg.dev/fesafotos/app:latest</span>
              <span>Helm v3 deployed</span>
            </div>
            <div className="flex justify-between">
              <span>Database Migratie: 20261014_event_plus_limits.sql</span>
              <span className="text-[var(--success)] font-bold">Toegepast ✓</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // INSTELLINGEN & DOMEINEN FALLBACK
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="pb-4 border-b border-[var(--border)]">
        <h2 className="font-display font-extrabold text-2xl text-[var(--ink)] tracking-tight">
          Systeeminstellingen & Identiteit
        </h2>
        <p className="text-xs text-[var(--ink-soft)] mt-0.5">
          Algemene platformconfiguratie voor fesafotos.nl.
        </p>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 shadow-2xs space-y-4 text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
          <span className="font-semibold text-[var(--ink)]">Standaard Retentie Periode</span>
          <span className="font-mono-code text-[var(--ink)] font-bold">90 dagen (Gratis) / 24 maanden (Event+)</span>
        </div>
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
          <span className="font-semibold text-[var(--ink)]">Maximale Uploadgrootte per Bestand</span>
          <span className="font-mono-code text-[var(--ink)] font-bold">50 MB per foto / 500 MB per video</span>
        </div>
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
          <span className="font-semibold text-[var(--ink)]">Mollie Live API Key Status</span>
          <span className="text-[var(--success)] font-mono-code font-bold">Actief verbonden ✓</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-[var(--ink)]">Primaire Domein</span>
          <span className="font-mono-code text-[var(--accent)] font-bold">fesafotos.nl / manage.fesafotos.nl</span>
        </div>
      </div>
    </div>
  );
};
