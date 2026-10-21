import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Database,
  Mail,
  Video,
  UploadCloud,
  DollarSign,
  HelpCircle,
  ExternalLink,
  ShieldAlert,
  Server,
  Layers,
} from 'lucide-react';
import { initialAnomalySignals, initialPartyCosts } from '../../data/manageData';
import { AnomalySignal, PartyCostAnalysis, NavPage } from '../../types/manage';

interface SignalsViewProps {
  lang: 'nl' | 'en';
  onShowToast: (msg: string) => void;
  onNavigate: (page: NavPage) => void;
}

export const SignalsView: React.FC<SignalsViewProps> = ({
  lang,
  onShowToast,
  onNavigate,
}) => {
  const isNl = lang === 'nl';
  const [selectedCategory, setSelectedCategory] = useState<string>('alle');
  const [signals, setSignals] = useState<AnomalySignal[]>(initialAnomalySignals);
  const [partyCosts, setPartyCosts] = useState<PartyCostAnalysis[]>(initialPartyCosts);
  const [selectedSignal, setSelectedSignal] = useState<AnomalySignal | null>(null);

  const filteredSignals =
    selectedCategory === 'alle'
      ? signals
      : signals.filter((s) => s.category === selectedCategory);

  const handleResolveAction = (sig: AnomalySignal) => {
    onShowToast(
      isNl
        ? `Actie uitgevoerd voor: "${sig.title.slice(0, 40)}..."`
        : `Action dispatched for: "${sig.title.slice(0, 40)}..."`
    );
  };

  const handlePartyAction = (partyName: string, action: 'doorlopen' | 'afronden') => {
    if (action === 'afronden') {
      onShowToast(
        isNl
          ? `Feest "${partyName}" gemarkeerd voor afronding en archivering naar MinIO.`
          : `Party "${partyName}" flagged for wrap-up and archival to MinIO.`
      );
    } else {
      onShowToast(
        isNl
          ? `Feest "${partyName}" behoudt actieve live-status.`
          : `Party "${partyName}" remains in active live status.`
      );
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="pb-4 border-b border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <h2 className="font-display font-extrabold text-2xl text-[var(--ink)] tracking-tight">
              {isNl ? 'Signalen & Afwijkingen' : 'Signals & Anomalies'}
            </h2>
          </div>
          <p className="text-xs text-[var(--ink-soft)] mt-0.5">
            {isNl
              ? 'Diepgaande correlatie van platformgebeurtenissen over Kubernetes, pool databases, MTA en transacties.'
              : 'Cross-surface correlation of Kubernetes workloads, tenant SQLite pools, MTA and transaction streams.'}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono-code">
          {[
            { id: 'alle', labelNl: 'Alle signalen', labelEn: 'All signals' },
            { id: 'uploads', labelNl: 'Uploads', labelEn: 'Uploads' },
            { id: 'videowachtrij', labelNl: 'Videowachtrij', labelEn: 'Video Queue' },
            { id: 'mail', labelNl: 'Mail (Stalwart)', labelEn: 'Mail (Stalwart)' },
            { id: 'opslag', labelNl: 'Opslag & CSI', labelEn: 'Storage & CSI' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-[var(--ink)] text-white font-bold'
                  : 'bg-[var(--surface)] text-[var(--ink-soft)] border border-[var(--border)] hover:border-[var(--ink)]'
              }`}
            >
              {isNl ? cat.labelNl : cat.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* 1. Afwijkingen Vandaag (Cross-Surface Correlation) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono-code font-bold uppercase tracking-wider text-[var(--ink-soft)]">
            {isNl ? 'Afwijkingen vandaag (Correlaties)' : 'Anomalies today (Correlations)'}
          </h3>
          <span className="text-[11px] font-mono-code text-[var(--ink-soft)]">
            {filteredSignals.length} {isNl ? 'actieve signalen' : 'active signals'}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {filteredSignals.map((sig) => {
            const isAfwijkend = sig.severity === 'afwijkend';
            const isLetOp = sig.severity === 'let_op';

            return (
              <div
                key={sig.id}
                className={`bg-[var(--surface)] border rounded-2xl p-4 sm:p-5 shadow-2xs transition-all ${
                  isAfwijkend
                    ? 'border-red-300 bg-red-50/15'
                    : isLetOp
                    ? 'border-amber-300 bg-amber-50/10'
                    : 'border-[var(--border)]'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1 min-w-0">
                    {/* Severity chip & Title */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono-code font-bold uppercase tracking-wider ${
                          isAfwijkend
                            ? 'bg-red-100 text-[var(--danger)] border border-red-300'
                            : isLetOp
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-emerald-100 text-[var(--success)] border border-emerald-300'
                        }`}
                      >
                        {sig.severity === 'afwijkend'
                          ? isNl ? 'Afwijkend' : 'Anomaly'
                          : sig.severity === 'let_op'
                          ? isNl ? 'Let op' : 'Warning'
                          : isNl ? 'Verwacht' : 'Expected'}
                      </span>

                      <span className="text-xs font-mono-code text-[var(--ink-soft)] flex items-center gap-1">
                        <Clock size={12} />
                        {sig.detectedAt}
                      </span>

                      <span className="text-xs font-mono-code text-[var(--ink-soft)] px-2 py-0.5 rounded bg-[var(--paper)] border border-[var(--border)]">
                        {sig.category}
                      </span>
                    </div>

                    <h4 className="font-display font-bold text-base text-[var(--ink)] leading-snug">
                      {sig.title}
                    </h4>

                    {/* Impact description */}
                    <p className="text-xs text-[var(--ink-soft)] leading-relaxed">
                      {sig.impactDescription}
                    </p>

                    {/* Chain breakdown & certainty */}
                    <div className="pt-2 border-t border-[var(--border)]/70 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-mono-code">
                      <div className="text-[var(--ink-soft)]">
                        <strong className="text-[var(--ink)]">
                          {isNl ? 'Keten: ' : 'Chain: '}
                        </strong>
                        <span className="text-[var(--ink)]">{sig.chain}</span>
                      </div>
                      <div className="text-[var(--ink-soft)]">
                        <strong className="text-[var(--ink)]">
                          {isNl ? 'Zekerheid: ' : 'Certainty: '}
                        </strong>
                        <span className="text-emerald-700 font-semibold">{sig.certainty}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right side: Suggested action */}
                  <div className="md:w-72 shrink-0 p-3 rounded-xl bg-[var(--paper)] border border-[var(--border)] flex flex-col justify-between gap-3">
                    <div>
                      <div className="text-[10px] font-mono-code font-bold uppercase text-[var(--ink-soft)]">
                        {isNl ? 'Voorgestelde actie' : 'Suggested action'}
                      </div>
                      <div className="text-xs text-[var(--ink)] mt-1 font-medium leading-relaxed">
                        {sig.suggestedAction}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleResolveAction(sig)}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--surface)] text-[var(--ink)] border border-[var(--border)] hover:bg-[var(--ink)] hover:text-white transition-colors"
                    >
                      <span>{isNl ? 'Actie uitvoeren' : 'Execute action'}</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Patronen & Voorspellingen Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patronen over tijd */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
            <h3 className="font-display font-bold text-base text-[var(--ink)]">
              {isNl ? 'Patronen over tijd' : 'Patterns over time'}
            </h3>
            <span className="text-xs font-mono-code text-[var(--ink-soft)]">
              {isNl ? '30-dagen referentiekader' : '30-day baseline'}
            </span>
          </div>

          <div className="space-y-3">
            {[
              {
                metric: isNl ? 'Foto-ingest per gastuur' : 'Photo ingest per guest-hour',
                value: '4.8 foto\'s/uur',
                status: 'verwacht',
                trend: 'stijgt',
                band: 'Binnen normale band (3.5 - 6.0)',
              },
              {
                metric: isNl ? 'ffmpeg transcode latency' : 'ffmpeg transcode latency',
                value: '18.4s gemiddeld',
                status: 'let_op',
                trend: 'stijgt',
                band: 'Nadert waarschuwingsgrens (max 25s)',
              },
              {
                metric: isNl ? 'Stalwart mail bounce percentage' : 'Stalwart mail bounce rate',
                value: '0.9% globaal',
                status: 'verwacht',
                trend: 'stabiel',
                band: 'Gezond (< 2.0% streefwaarde)',
              },
              {
                metric: isNl ? 'Agent waakcyclus interval' : 'Agent sweep interval',
                value: '60s strak',
                status: 'verwacht',
                trend: 'stabiel',
                band: '0 gemiste rondes vandaag',
              },
            ].map((pat, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[var(--paper)] border border-[var(--border)] flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-bold text-[var(--ink)]">{pat.metric}</div>
                  <div className="text-[11px] text-[var(--ink-soft)] font-mono-code mt-0.5">
                    {pat.band}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono-code font-bold text-[var(--ink)]">
                    {pat.value}
                  </div>
                  <div className="text-[10px] font-mono-code text-[var(--ink-soft)] flex items-center justify-end gap-1 mt-0.5">
                    {pat.trend === 'stijgt' && <TrendingUp size={11} className="text-amber-600" />}
                    {pat.trend === 'daalt' && <TrendingDown size={11} className="text-blue-600" />}
                    {pat.trend === 'stabiel' && <Minus size={11} className="text-emerald-600" />}
                    <span>{pat.trend}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Voorspellingen met Aanname & Horizon */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
            <h3 className="font-display font-bold text-base text-[var(--ink)]">
              {isNl ? 'Voorspellingen (Horizon & Aanname)' : 'Forecasts (Horizon & Assumptions)'}
            </h3>
            <span className="text-xs font-mono-code text-[var(--accent)] font-semibold">
              {isNl ? 'Statistisch gemodelleerd' : 'Statistically modeled'}
            </span>
          </div>

          <div className="space-y-3">
            {[
              {
                title: isNl ? 'CSI Volume Capaciteit' : 'CSI Volume Capacity',
                horizon: isNl ? 'Vol over 19 dagen' : 'Full in 19 days',
                assumption: isNl
                  ? 'Uitgaande van constante toename van 4.2 GB per actief weekendfeest.'
                  : 'Assuming continued 4.2 GB/day growth per active weekend party.',
                target: 'pvc-media-pool (50 GB)',
              },
              {
                title: isNl ? 'OpenRouter Modelaanroepen Budget' : 'OpenRouter Model Budget',
                horizon: isNl ? 'Plafond bereikt over 22 dagen' : 'Ceiling reached in 22 days',
                assumption: isNl
                  ? 'Bij gemiddeld $0.38/dag verbruik door cluster-agent en $0.09/dag sec-agent.'
                  : 'At $0.38/day cluster-agent and $0.09/day sec-agent burn rate.',
                target: '$31.40 resterend van $40.00 maandlimiet',
              },
              {
                title: isNl ? 'Moderatiewachtrij Instroom' : 'Moderation Influx',
                horizon: isNl ? '+14 beelden komende 24u' : '+14 items next 24h',
                assumption: isNl
                  ? 'Piekactiviteit op Sanjay & Dewie verwacht tussen 20:00 en 01:00 CET.'
                  : 'Peak uploads on Sanjay & Dewie expected between 20:00 - 01:00 CET.',
                target: 'fesafoto-pool moderatie buffer',
              },
            ].map((pred, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[var(--paper)] border border-[var(--border)] space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between font-bold">
                  <span className="text-[var(--ink)]">{pred.title}</span>
                  <span className="font-mono-code text-[var(--accent)]">{pred.horizon}</span>
                </div>
                <div className="text-[11px] font-mono-code text-[var(--ink-soft)]">
                  {pred.target}
                </div>
                <div className="text-[11px] text-[var(--ink-soft)] leading-normal pt-1 border-t border-[var(--border)]/70">
                  <span className="font-semibold text-[var(--ink)]">
                    {isNl ? 'Aanname: ' : 'Assumption: '}
                  </span>
                  {pred.assumption}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Kosten per Feest (Revenue vs Resource Consumption) */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[var(--border)] gap-2">
          <div>
            <h3 className="font-display font-bold text-base text-[var(--ink)]">
              {isNl ? 'Kosten en Marge per Feest' : 'Cost & Margin per Party'}
            </h3>
            <p className="text-xs text-[var(--ink-soft)]">
              {isNl
                ? 'Opbrengst uit orders en upgrades afgezet tegen reële opslag, transcoding en rekenkracht.'
                : 'Revenue from plans compared against real storage, transcode worker minutes, and memory footprint.'}
            </p>
          </div>

          <div className="text-xs font-mono-code text-[var(--ink-soft)]">
            {isNl ? 'Status: Alle tenants rendabel' : 'Status: All tenants viable'}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono-code border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] text-[var(--ink-soft)] uppercase text-[10px]">
                <th className="py-2.5 px-3">{isNl ? 'Feest / Tenant' : 'Party / Tenant'}</th>
                <th className="py-2.5 px-3">{isNl ? 'Pakket' : 'Plan'}</th>
                <th className="py-2.5 px-3 text-right">{isNl ? 'Omzet' : 'Revenue'}</th>
                <th className="py-2.5 px-3 text-right">{isNl ? 'Kosten' : 'Cost'}</th>
                <th className="py-2.5 px-3 text-right">{isNl ? 'Netto Marge' : 'Net Margin'}</th>
                <th className="py-2.5 px-3">{isNl ? 'Oordeel' : 'Verdict'}</th>
                <th className="py-2.5 px-3 text-right">{isNl ? 'Actie' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {partyCosts.map((party) => {
                const isProfitable = party.netMarginEur > 0;

                return (
                  <tr key={party.tenantId} className="hover:bg-[var(--paper)] transition-colors">
                    <td className="py-3 px-3 font-sans font-bold text-[var(--ink)]">
                      {party.partyName}
                      <div className="text-[10px] font-mono-code text-[var(--ink-soft)] font-normal">
                        {party.storageUsedMb} MB · {party.videosTranscoded} video's
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-[var(--paper)] border border-[var(--border)]">
                        {party.plan}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-[var(--ink)]">
                      € {party.revenueEur.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right text-[var(--ink-soft)]">
                      € {party.costEur.toFixed(2)}
                    </td>
                    <td
                      className={`py-3 px-3 text-right font-bold ${
                        isProfitable ? 'text-[var(--success)]' : 'text-[var(--ink-soft)]'
                      }`}
                    >
                      {isProfitable ? '+' : ''}€ {party.netMarginEur.toFixed(2)}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          party.statusVerdict === 'verdient'
                            ? 'bg-emerald-50 text-[var(--success)] border border-emerald-200'
                            : party.statusVerdict === 'quitte'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-red-50 text-[var(--danger)] border border-red-200'
                        }`}
                      >
                        {party.statusVerdict === 'verdient'
                          ? isNl ? 'Verdient' : 'Profitable'
                          : party.statusVerdict === 'quitte'
                          ? isNl ? 'Quitte' : 'Break-even'
                          : isNl ? 'Kost geld' : 'Unprofitable'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right space-x-1">
                      <button
                        type="button"
                        onClick={() => handlePartyAction(party.partyName, 'doorlopen')}
                        className="px-2 py-1 rounded text-[11px] bg-[var(--paper)] border border-[var(--border)] hover:bg-[var(--surface)] text-[var(--ink)] font-medium transition-colors"
                      >
                        {isNl ? 'Doorlopen' : 'Keep active'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePartyAction(party.partyName, 'afronden')}
                        className="px-2 py-1 rounded text-[11px] bg-[var(--paper)] border border-[var(--border)] hover:text-[var(--accent)] font-medium transition-colors"
                      >
                        {isNl ? 'Afronden' : 'Wrap up'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
