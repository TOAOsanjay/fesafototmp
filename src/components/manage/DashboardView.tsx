import React, { useState } from 'react';
import { NavPage } from '../../types/manage';
import { initialAuditLines, initialTenants, initialOrders } from '../../data/manageData';
import {
  Server,
  Layers,
  Zap,
  Mail,
  BarChart2,
  AlertOctagon,
  ArrowUpRight,
  RefreshCw,
  Eye,
  CheckCircle2,
} from 'lucide-react';

interface DashboardViewProps {
  onNavigate: (page: NavPage) => void;
  lang: 'nl' | 'en';
  onRequeueJob: (jobId: string) => void;
  onOpenStuckModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  lang,
  onRequeueJob,
  onOpenStuckModal,
}) => {
  const isNl = lang === 'nl';
  const [chartRange, setChartRange] = useState<'7d' | '14d' | '30d'>('30d');

  // Chart data points for 30 days uploads
  const dataPoints30d = [
    12, 18, 14, 25, 32, 28, 45, 60, 52, 40, 48, 65, 80, 72, 90, 85, 110, 130, 95, 88, 105, 120, 145, 135,
    160, 175, 150, 140, 180, 142,
  ];

  const pointsToShow =
    chartRange === '7d'
      ? dataPoints30d.slice(-7)
      : chartRange === '14d'
      ? dataPoints30d.slice(-14)
      : dataPoints30d;

  const maxVal = Math.max(...pointsToShow);
  const minVal = 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Health Strip at the Top */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 shadow-2xs">
        <div className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-[var(--ink-soft)] mb-2 px-1">
          {isNl ? 'Systeemgezondheid & Vloot' : 'System Health & Fleet'}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* 1. Publieke diensten */}
          <div
            onClick={() => onNavigate('status')}
            className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[var(--paper)] border border-[var(--border)] hover:border-[var(--ink)] cursor-pointer transition-colors"
          >
            <div className="p-1.5 rounded-lg bg-emerald-50 text-[var(--success)] shrink-0">
              <Server size={14} strokeWidth={1.5} />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-[var(--ink)] truncate">Publieke diensten</div>
              <div className="text-[10px] font-mono-code text-[var(--success)] flex items-center gap-1 font-semibold truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] shrink-0" />
                <span>100% up</span>
              </div>
            </div>
          </div>

          {/* 2. Agents */}
          <div
            onClick={() => onNavigate('agents')}
            className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[var(--paper)] border border-[var(--border)] hover:border-[var(--ink)] cursor-pointer transition-colors"
          >
            <div className="p-1.5 rounded-lg bg-emerald-50 text-[var(--success)] shrink-0">
              <Layers size={14} strokeWidth={1.5} />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-[var(--ink)] truncate">Agents</div>
              <div className="text-[10px] font-mono-code text-[var(--success)] flex items-center gap-1 font-semibold truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] shrink-0" />
                <span>5 lanen · 1 waker</span>
              </div>
            </div>
          </div>

          {/* 3. Keten */}
          <div
            onClick={() => onNavigate('pijplijn')}
            className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[var(--paper)] border border-[var(--border)] hover:border-[var(--ink)] cursor-pointer transition-colors"
          >
            <div className="p-1.5 rounded-lg bg-emerald-50 text-[var(--success)] shrink-0">
              <Zap size={14} strokeWidth={1.5} />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-[var(--ink)] truncate">Bouw & Keten</div>
              <div className="text-[10px] font-mono-code text-[var(--success)] flex items-center gap-1 font-semibold truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] shrink-0" />
                <span>Build & scan OK</span>
              </div>
            </div>
          </div>

          {/* 4. Mail */}
          <div
            onClick={() => onNavigate('email')}
            className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[var(--paper)] border border-[var(--border)] hover:border-[var(--ink)] cursor-pointer transition-colors"
          >
            <div className="p-1.5 rounded-lg bg-emerald-50 text-[var(--success)] shrink-0">
              <Mail size={14} strokeWidth={1.5} />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-[var(--ink)] truncate">Stalwart Mail</div>
              <div className="text-[10px] font-mono-code text-[var(--success)] flex items-center gap-1 font-semibold truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] shrink-0" />
                <span>0 in wacht</span>
              </div>
            </div>
          </div>

          {/* 5. Back-up */}
          <div
            onClick={() => onNavigate('backup_herstel')}
            className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[var(--paper)] border border-[var(--border)] hover:border-[var(--ink)] cursor-pointer transition-colors"
          >
            <div className="p-1.5 rounded-lg bg-emerald-50 text-[var(--success)] shrink-0">
              <BarChart2 size={14} strokeWidth={1.5} />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-[var(--ink)] truncate">Back-up & Herstel</div>
              <div className="text-[10px] font-mono-code text-[var(--success)] flex items-center gap-1 font-semibold truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] shrink-0" />
                <span>Restic 02:15 OK</span>
              </div>
            </div>
          </div>

          {/* 6. Uitgaande weg */}
          <div
            onClick={() => onNavigate('hetzner_k3s')}
            className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[var(--paper)] border border-[var(--border)] hover:border-[var(--ink)] cursor-pointer transition-colors"
          >
            <div className="p-1.5 rounded-lg bg-emerald-50 text-[var(--success)] shrink-0">
              <CheckCircle2 size={14} strokeWidth={1.5} />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-[var(--ink)] truncate">Uitgaande weg</div>
              <div className="text-[10px] font-mono-code text-[var(--success)] flex items-center gap-1 font-semibold truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] shrink-0" />
                <span>Egress canary OK</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Six Number Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div
          onClick={() => onNavigate('tenants')}
          className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 shadow-2xs hover:border-[var(--accent)] cursor-pointer transition-colors"
        >
          <div className="text-[11px] text-[var(--ink-soft)] font-medium mb-1 truncate">
            {isNl ? 'Feesten actief' : 'Active parties'}
          </div>
          <div className="text-2xl lg:text-3xl font-display font-bold text-[var(--ink)] tabular-nums">
            3
          </div>
          <div className="text-[10px] text-[var(--accent)] font-mono-code mt-1 flex items-center gap-0.5">
            <span>Sanjay & Dewie</span>
            <ArrowUpRight size={10} />
          </div>
        </div>

        <div
          onClick={() => onNavigate('bestellingen')}
          className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 shadow-2xs hover:border-[var(--accent)] cursor-pointer transition-colors"
        >
          <div className="text-[11px] text-[var(--ink-soft)] font-medium mb-1 truncate">
            {isNl ? 'Bestellingen (mnd)' : 'Orders this month'}
          </div>
          <div className="text-2xl lg:text-3xl font-display font-bold text-[var(--ink)] tabular-nums">
            12
          </div>
          <div className="text-[10px] text-[var(--warning)] font-mono-code mt-1">
            1 open betaling
          </div>
        </div>

        <div
          onClick={() => onNavigate('bestellingen')}
          className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 shadow-2xs hover:border-[var(--accent)] cursor-pointer transition-colors"
        >
          <div className="text-[11px] text-[var(--ink-soft)] font-medium mb-1 truncate">
            {isNl ? 'Omzet deze maand' : 'Revenue month'}
          </div>
          <div className="text-2xl lg:text-3xl font-display font-bold text-[var(--ink)] tabular-nums">
            € 784
          </div>
          <div className="text-[10px] text-[var(--success)] font-mono-code mt-1">
            +18% t.o.v. sept
          </div>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 shadow-2xs">
          <div className="text-[11px] text-[var(--ink-soft)] font-medium mb-1 truncate">
            {isNl ? 'Uploads vandaag' : 'Uploads today'}
          </div>
          <div className="text-2xl lg:text-3xl font-display font-bold text-[var(--ink)] tabular-nums">
            142
          </div>
          <div className="text-[10px] text-[var(--ink-soft)] font-mono-code mt-1">
            waarvan 6 video's
          </div>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 shadow-2xs">
          <div className="text-[11px] text-[var(--ink-soft)] font-medium mb-1 truncate">
            {isNl ? 'Opslag gebruikt' : 'Storage used'}
          </div>
          <div className="text-2xl lg:text-3xl font-display font-bold text-[var(--ink)] tabular-nums">
            1.8 <span className="text-lg font-normal text-[var(--ink-soft)]">TB</span>
          </div>
          <div className="text-[10px] text-[var(--ink-soft)] font-mono-code mt-1">
            S3 Frankfurt bucket
          </div>
        </div>

        <div
          onClick={() => onNavigate('wachtrijtaken')}
          className="bg-[var(--surface)] border border-red-200 rounded-2xl p-4 shadow-2xs hover:border-[var(--danger)] cursor-pointer transition-colors"
        >
          <div className="text-[11px] text-[var(--danger)] font-medium mb-1 truncate">
            {isNl ? 'Mislukte taken' : 'Failed jobs'}
          </div>
          <div className="text-2xl lg:text-3xl font-display font-bold text-[var(--danger)] tabular-nums">
            1
          </div>
          <div className="text-[10px] text-[var(--danger)] font-mono-code mt-1">
            job-9841 actie vereist
          </div>
        </div>
      </div>

      {/* 3. Calm Trend Chart (Uploads & Activity per Day) */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-[var(--border)] gap-3">
          <div>
            <h3 className="font-display font-bold text-lg text-[var(--ink)]">
              {isNl ? 'Upload Activiteit per Dag' : 'Daily Upload Activity'}
            </h3>
            <p className="text-xs text-[var(--ink-soft)]">
              {isNl
                ? 'Echte telling van uploads over de gekozen periode zonder overbodige grafiekruis.'
                : 'Verified upload counts across the selected window without chart clutter.'}
            </p>
          </div>

          {/* Time range picker */}
          <div className="flex items-center p-1 bg-[var(--paper)] border border-[var(--border)] rounded-xl text-xs font-medium self-start sm:self-auto">
            {(['7d', '14d', '30d'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setChartRange(r)}
                className={`px-3 py-1 rounded-lg transition-colors font-mono-code ${
                  chartRange === r
                    ? 'bg-[var(--surface)] text-[var(--ink)] font-bold shadow-2xs'
                    : 'text-[var(--ink-soft)] hover:text-[var(--ink)]'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Clean Responsive SVG Trendline */}
        <div className="relative h-48 w-full pt-4">
          <svg viewBox="0 0 800 160" preserveAspectRatio="none" className="w-full h-full overflow-visible">
            {/* Horizontal guideline */}
            <line x1="0" y1="40" x2="800" y2="40" stroke="var(--border)" strokeDasharray="3 3" />
            <line x1="0" y1="100" x2="800" y2="100" stroke="var(--border)" strokeDasharray="3 3" />
            <line x1="0" y1="160" x2="800" y2="160" stroke="var(--border)" />

            {/* Area Fill */}
            <path
              d={pointsToShow.reduce((acc, val, i) => {
                const x = (i / (pointsToShow.length - 1)) * 800;
                const y = 160 - ((val - minVal) / (maxVal - minVal || 1)) * 140;
                return `${acc} L ${x} ${y}`;
              }, `M 0 160 L 0 ${160 - ((pointsToShow[0] - minVal) / (maxVal - minVal || 1)) * 140}`) + ` L 800 160 Z`}
              fill="rgba(194, 65, 12, 0.08)"
            />

            {/* Polyline */}
            <path
              d={pointsToShow.reduce((acc, val, i) => {
                const x = (i / (pointsToShow.length - 1)) * 800;
                const y = 160 - ((val - minVal) / (maxVal - minVal || 1)) * 140;
                return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
              }, '')}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Last Point Dot */}
            <circle
              cx="800"
              cy={160 - ((pointsToShow[pointsToShow.length - 1] - minVal) / (maxVal - minVal || 1)) * 140}
              r="4.5"
              fill="var(--accent)"
              stroke="white"
              strokeWidth="2"
            />
          </svg>
        </div>

        {/* X-axis labels */}
        <div className="flex items-center justify-between text-[11px] font-mono-code text-[var(--ink-soft)] pt-2 border-t border-[var(--border)]">
          <span>{chartRange === '30d' ? '30 dagen geleden' : chartRange === '14d' ? '14 dagen geleden' : '7 dagen geleden'}</span>
          <span>Vandaag: 142 uploads</span>
        </div>
      </div>

      {/* 4. Short "Needs Attention" List with direct actions */}
      <div className="bg-[var(--surface)] border border-amber-200 rounded-3xl p-6 shadow-2xs">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-amber-100">
          <div className="flex items-center gap-2">
            <AlertOctagon size={18} className="text-[var(--warning)]" />
            <h3 className="font-display font-bold text-base text-[var(--ink)]">
              {isNl ? 'Wacht op een mens (Aandacht vereist)' : 'Awaiting Human Approval'}
            </h3>
          </div>
          <span className="text-xs font-mono-code px-2 py-0.5 rounded bg-amber-50 text-[var(--warning)] border border-amber-200 font-semibold">
            4 items
          </span>
        </div>

        <div className="space-y-3">
          {/* Item 0: Agent Proposal Awaiting Human Approval */}
          <div className="p-3.5 rounded-xl bg-[var(--paper)] border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <div className="flex items-center gap-2 font-bold text-[var(--ink)] font-mono-code">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>cluster-prop-104 : KEDA HPA minReplicas verhogen</span>
                <span className="text-[var(--accent)] font-semibold">(fesafoto-cluster-agent)</span>
              </div>
              <p className="text-[11px] text-[var(--ink-soft)] mt-0.5">
                Voorstel voor Sanjay & Dewie: minReplicas van 1 naar 2 verhogen om video-wachttijden onder 15s te garanderen.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => onNavigate('agents')}
                className="px-3 py-1.5 rounded-lg bg-[var(--ink)] text-white hover:bg-[var(--accent)] text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <Eye size={12} strokeWidth={2} />
                <span>{isNl ? 'Bekijk voorstel' : 'Review proposal'}</span>
              </button>
            </div>
          </div>

          {/* Item 0b: Anomaly Alert */}
          <div className="p-3.5 rounded-xl bg-[var(--paper)] border border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <div className="flex items-center gap-2 font-bold text-[var(--ink)] font-mono-code">
                <span className="w-2 h-2 rounded-full bg-[var(--warning)]" />
                <span>Signaal sig-01 : Uploads Mientjes 65 70% onder weekgemiddelde</span>
                <span className="text-[var(--ink-soft)] font-normal">(Correlatie)</span>
              </div>
              <p className="text-[11px] text-[var(--ink-soft)] mt-0.5">
                Gasten scannen QR wel, maar upload conversie blijft achter. Zekerheid 7 dagen / 412 events.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => onNavigate('signalen')}
                className="px-3 py-1.5 rounded-lg bg-[var(--surface)] text-[var(--ink)] border border-[var(--border)] hover:bg-[var(--paper-2)] text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <span>{isNl ? 'Bekijk correlatie' : 'View correlation'}</span>
              </button>
            </div>
          </div>

          {/* Item 1: Failed transcode */}
          <div className="p-3.5 rounded-xl bg-[var(--paper)] border border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <div className="flex items-center gap-2 font-bold text-[var(--ink)] font-mono-code">
                <span className="w-2 h-2 rounded-full bg-[var(--danger)]" />
                <span>job-9841 : Video transcode gefaald</span>
                <span className="text-[var(--ink-soft)] font-normal">(Mientjes 65)</span>
              </div>
              <p className="text-[11px] text-[var(--ink-soft)] mt-0.5">
                Worker timeout op fesafotos-node-2: ffmpeg buffer limiet overschreden bij frame 4120.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => onRequeueJob('job-9841')}
                className="px-3 py-1.5 rounded-lg bg-[var(--surface)] text-[var(--ink)] border border-[var(--border)] hover:bg-[var(--ink)] hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw size={12} strokeWidth={2} />
                <span>{isNl ? 'Herstart job' : 'Restart job'}</span>
              </button>
            </div>
          </div>

          {/* Item 2: Open unfinished payment */}
          <div className="p-3.5 rounded-xl bg-[var(--paper)] border border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <div className="flex items-center gap-2 font-bold text-[var(--ink)] font-mono-code">
                <span className="w-2 h-2 rounded-full bg-[var(--warning)]" />
                <span>ord-10493 : Openstaande betaling EUR 49,00</span>
                <span className="text-[var(--ink-soft)] font-normal">(Mientjes 65)</span>
              </div>
              <p className="text-[11px] text-[var(--ink-soft)] mt-0.5">
                Mollie referentie tr_K7Lm28xZb90wP: iDEAL sessie aangemaakt om 20:10, nog niet voltooid.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => onNavigate('bestellingen')}
                className="px-3 py-1.5 rounded-lg bg-[var(--surface)] border border-[var(--border)] hover:bg-[var(--paper-2)] text-[var(--ink)] text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Eye size={12} strokeWidth={2} />
                <span>Controleer Mollie</span>
              </button>
            </div>
          </div>

          {/* Item 3: Stuck upload */}
          <div className="p-3.5 rounded-xl bg-[var(--paper)] border border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <div className="flex items-center gap-2 font-bold text-[var(--ink)] font-mono-code">
                <span className="w-2 h-2 rounded-full bg-[var(--danger)]" />
                <span>Vastgelopen upload : VID_20261020_003.mp4 (84.2 MB)</span>
                <span className="text-[var(--ink-soft)] font-normal">(Mientjes 65)</span>
              </div>
              <p className="text-[11px] text-[var(--ink-soft)] mt-0.5">
                Geüpload door Oom Johan. 48 minuten geleden vastgelopen bij transcode chunk 18/22.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={onOpenStuckModal}
                className="px-3 py-1.5 rounded-lg bg-[var(--accent)] text-white hover:opacity-90 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw size={12} strokeWidth={2} />
                <span>Bekijk & Los op</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Latest Audit Lines Table */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 shadow-2xs">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[var(--border)]">
          <div>
            <h3 className="font-display font-bold text-base text-[var(--ink)]">
              {isNl ? 'Laatste Auditregels' : 'Latest Audit Lines'}
            </h3>
            <p className="text-xs text-[var(--ink-soft)]">
              {isNl ? 'Rechtstreeks log van operators en geautomatiseerde triggers.' : 'Direct system log of operator and automated actions.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('audit')}
            className="text-xs font-semibold text-[var(--accent)] hover:underline"
          >
            {isNl ? 'Volledig audit logboek bekijken →' : 'View full audit trail →'}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--border)] text-[var(--ink-soft)] font-mono-code uppercase text-[10px]">
                <th className="py-2.5 px-3">Tijd</th>
                <th className="py-2.5 px-3">Actor</th>
                <th className="py-2.5 px-3">Actie</th>
                <th className="py-2.5 px-3">Doelwit</th>
                <th className="py-2.5 px-3 text-right">IP / Bron</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {initialAuditLines.map((line) => (
                <tr key={line.id} className="hover:bg-[var(--paper)] transition-colors">
                  <td className="py-3 px-3 font-mono-code text-[11px] text-[var(--ink-soft)] whitespace-nowrap">
                    {line.timestamp}
                  </td>
                  <td className="py-3 px-3 font-semibold text-[var(--ink)] whitespace-nowrap">
                    {line.actor}
                  </td>
                  <td className="py-3 px-3 text-[var(--ink)]">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono-code ${
                        line.status === 'warn'
                          ? 'bg-amber-50 text-[var(--warning)] border border-amber-200'
                          : 'bg-emerald-50 text-[var(--success)] border border-emerald-200'
                      }`}
                    >
                      <span>{line.action}</span>
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono-code text-[11px] text-[var(--ink-soft)]">
                    {line.target}
                  </td>
                  <td className="py-3 px-3 text-right font-mono-code text-[11px] text-[var(--ink-soft)]">
                    {line.ip}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
