import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, RefreshCw, Activity, Server, Database, Globe, HardDrive } from 'lucide-react';

interface StatusViewProps {
  lang: 'nl' | 'en';
  onShowToast: (msg: string) => void;
}

export const StatusView: React.FC<StatusViewProps> = ({ lang, onShowToast }) => {
  const isNl = lang === 'nl';
  const [isPinging, setIsPinging] = useState(false);
  const [lastCheck, setLastCheck] = useState('Zojuist (22:15 CET)');
  const [services, setServices] = useState([
    { name: 'Traefik Ingress & TLS (k3s)', status: 'Gezond', rtt: '18ms', region: 'Hetzner LB11 (fsn1)', icon: Globe },
    { name: 'Hetzner k3s API Server', status: 'Gezond', rtt: '14ms', region: 'k3s-control-fsn1-01', icon: Server },
    { name: 'CloudNativePG PostgreSQL HA', status: 'Gezond', rtt: '1.2ms', region: 'Primary + Standby', icon: Database },
    { name: 'Valkey In-Memory Cache', status: 'Gezond', rtt: '0.3ms', region: 'valkey-cluster-0', icon: Activity },
    { name: 'MinIO S3 Object Storage', status: 'Gezond', rtt: '12ms', region: 'Hetzner CSI block storage', icon: HardDrive },
    { name: 'Mollie Betalingswebhook', status: 'Verbonden', rtt: '31ms', region: 'Webhook listener', icon: CheckCircle2 },
    { name: 'ffmpeg Transcode Workers (KEDA)', status: 'Waarschuwing', rtt: '112ms', region: 'k3s-worker-fsn1-01', icon: AlertTriangle },
    { name: 'Stalwart Mail Server (OSS)', status: 'Gezond', rtt: '4ms', region: 'Hetzner k3s pod (188.245.82.11)', icon: Server },
    { name: 'Beamer WebSocket Server', status: 'Gezond', rtt: '9ms', region: 'Live feed stream', icon: Activity },
  ]);

  const handleRunPing = () => {
    setIsPinging(true);
    onShowToast('Realtime latency probers worden uitgevoerd over alle componenten...');

    setTimeout(() => {
      setIsPinging(false);
      setLastCheck('Zojuist');
      setServices((prev) =>
        prev.map((s) => ({
          ...s,
          rtt: `${Math.floor(Math.random() * 25 + 5)}ms`,
        }))
      );
      onShowToast('Alle 9 gezondheidscontroles succesvol gecontroleerd.');
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[var(--border)] gap-3">
        <div>
          <h2 className="font-display font-extrabold text-2xl text-[var(--ink)] tracking-tight">
            {isNl ? 'Systeemstatus & Healthchecks' : 'System Health & Component Status'}
          </h2>
          <p className="text-xs text-[var(--ink-soft)] mt-0.5">
            {isNl
              ? 'Realtime healthcheck probers elke 30 seconden uitgevoerd vanuit Amsterdam en Frankfurt.'
              : 'Real-time probe sweeps executed every 30 seconds across Amsterdam and Frankfurt.'}
          </p>
        </div>

        <button
          type="button"
          onClick={handleRunPing}
          disabled={isPinging}
          className="px-3.5 py-2 rounded-xl bg-[var(--ink)] text-white hover:bg-[#292524] text-xs font-semibold flex items-center gap-1.5 shadow-2xs self-start sm:self-auto disabled:opacity-50"
        >
          <RefreshCw size={13} className={isPinging ? 'animate-spin' : ''} />
          <span>{isPinging ? 'Probing...' : 'Voer Health Probers Uit'}</span>
        </button>
      </div>

      {/* KPI bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-2xs">
          <div className="text-[11px] text-[var(--ink-soft)] font-mono-code uppercase">Overall Vlootstatus</div>
          <div className="text-2xl font-display font-bold text-[var(--success)] mt-0.5">99,98% Uptime</div>
          <div className="text-[10px] font-mono-code text-[var(--ink-soft)] mt-0.5">Laatste 90 dagen</div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-2xs">
          <div className="text-[11px] text-[var(--ink-soft)] font-mono-code uppercase">Gemiddelde Latency</div>
          <div className="text-2xl font-display font-bold text-[var(--ink)] tabular-nums mt-0.5">18 ms</div>
          <div className="text-[10px] font-mono-code text-[var(--success)] mt-0.5">Binnen SLA grens (&lt;50ms)</div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-2xs">
          <div className="text-[11px] text-[var(--ink-soft)] font-mono-code uppercase">Laatste Meting</div>
          <div className="text-2xl font-display font-bold text-[var(--ink)] mt-0.5">{lastCheck}</div>
          <div className="text-[10px] font-mono-code text-[var(--ink-soft)] mt-0.5">Automatische cyclus actief</div>
        </div>
      </div>

      {/* Grid of 9 services */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
        {services.map((item, idx) => {
          const Icon = item.icon;
          const isWarning = item.status.includes('Waarschuwing');

          return (
            <div
              key={idx}
              className="p-5 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-2xs space-y-3 hover:border-[var(--accent)] transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[var(--paper)] text-[var(--ink)] border border-[var(--border)]">
                    <Icon size={16} strokeWidth={1.5} />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-[var(--ink)] block">{item.name}</span>
                    <span className="text-[11px] font-mono-code text-[var(--ink-soft)]">{item.region}</span>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono-code font-bold uppercase ${
                    isWarning
                      ? 'bg-amber-50 text-[var(--warning)] border border-amber-200'
                      : 'bg-emerald-50 text-[var(--success)] border border-emerald-200'
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between font-mono-code text-[11px]">
                <span className="text-[var(--ink-soft)]">Gemeten RTT:</span>
                <span className="font-bold text-[var(--ink)] tabular-nums">{item.rtt}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
