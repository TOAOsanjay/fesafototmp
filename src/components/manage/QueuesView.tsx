import React, { useState, useEffect, useRef } from 'react';
import { QueueJob, StuckUpload } from '../../types/manage';
import { initialLogStream } from '../../data/manageData';
import {
  RefreshCw,
  Trash2,
  Copy,
  Search,
  CheckCircle2,
  Clock,
  Play,
  AlertTriangle,
  Terminal,
} from 'lucide-react';

interface QueuesViewProps {
  jobs: QueueJob[];
  stuckUpload: StuckUpload | null;
  lang: 'nl' | 'en';
  onRequeueJob: (jobId: string) => void;
  onRequestDiscardStuck: (stuck: StuckUpload) => void;
  onRequeueStuck: () => void;
}

export const QueuesView: React.FC<QueuesViewProps> = ({
  jobs,
  stuckUpload,
  lang,
  onRequeueJob,
  onRequestDiscardStuck,
  onRequeueStuck,
}) => {
  const isNl = lang === 'nl';
  const [logFilter, setLogFilter] = useState('');
  const [autoFollow, setAutoFollow] = useState(true);
  const [copiedLog, setCopiedLog] = useState(false);
  const logContainerRef = useRef<HTMLDivElement>(null);

  const [logs, setLogs] = useState<string[]>(initialLogStream);

  // Simulated live log follow
  useEffect(() => {
    if (!autoFollow || !logContainerRef.current) return;
    logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
  }, [logs, autoFollow]);

  const handleCopyLogs = () => {
    navigator.clipboard?.writeText(logs.join('\n'));
    setCopiedLog(true);
    setTimeout(() => setCopiedLog(false), 2000);
  };

  const filteredLogs = logs.filter((l) =>
    l.toLowerCase().includes(logFilter.toLowerCase())
  );

  const getJobBadge = (state: QueueJob['state']) => {
    switch (state) {
      case 'done':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono-code font-bold bg-emerald-50 text-[var(--success)] border border-emerald-200">
            <CheckCircle2 size={11} strokeWidth={2} />
            <span>Voltooid</span>
          </span>
        );
      case 'running':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono-code font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Play size={10} strokeWidth={2} />
            <span>Draaiend</span>
          </span>
        );
      case 'queued':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono-code font-bold bg-stone-100 text-stone-700 border border-stone-200">
            <Clock size={11} strokeWidth={2} />
            <span>In wachtrij</span>
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono-code font-bold bg-red-50 text-[var(--danger)] border border-red-200">
            <AlertTriangle size={11} strokeWidth={2} />
            <span>Gefaald</span>
          </span>
        );
      case 'quarantined':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono-code font-bold bg-purple-50 text-purple-700 border border-purple-200">
            <span>In quarantaine</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="pb-4 border-b border-[var(--border)]">
        <h2 className="font-display font-extrabold text-2xl text-[var(--ink)] tracking-tight">
          {isNl ? 'Wachtrijtaken & Vastgelopen Uploads' : 'Queue Jobs & Stuck Uploads'}
        </h2>
        <p className="text-xs text-[var(--ink-soft)] mt-0.5">
          {isNl
            ? 'Realtime toezicht op achtergrondverwerking: ffmpeg video transcoding, ZIP-generatie en S3 pipeline.'
            : 'Realtime supervisor for background workers: ffmpeg video transcoding, ZIP generation, and S3 pipeline.'}
        </p>
      </div>

      {/* 1. Stuck Upload Alert Banner & Actions */}
      {stuckUpload ? (
        <div className="bg-[var(--surface)] border-2 border-red-200 rounded-3xl p-6 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-red-100 gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--danger)] animate-ping" />
              <h3 className="font-display font-bold text-base text-[var(--danger)]">
                {isNl ? '1 Vastgelopen Upload Gedetecteerd' : '1 Stuck Upload Detected'}
              </h3>
              <span className="font-mono-code text-[11px] text-[var(--ink-soft)]">
                id: {stuckUpload.id}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onRequeueStuck}
                className="px-3.5 py-1.5 rounded-xl bg-[var(--ink)] hover:bg-[#292524] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <RefreshCw size={12} strokeWidth={2} />
                <span>Herstart Transcode</span>
              </button>

              <button
                type="button"
                onClick={() => onRequestDiscardStuck(stuckUpload)}
                className="px-3.5 py-1.5 rounded-xl border border-red-300 bg-red-50 hover:bg-red-100 text-[var(--danger)] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Vereist getypte bevestiging DISCARD"
              >
                <Trash2 size={12} strokeWidth={2} />
                <span>Verwerp Bestand (Discard)</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[var(--paper)] border border-[var(--border)]">
              <div className="text-[10px] font-mono-code text-[var(--ink-soft)] uppercase">Tenant</div>
              <div className="font-bold text-[var(--ink)] mt-0.5">{stuckUpload.tenantName}</div>
              <div className="font-mono-code text-[10px] text-[var(--ink-soft)]">{stuckUpload.tenantSlug}.fesafotos.nl</div>
            </div>

            <div className="p-3 rounded-xl bg-[var(--paper)] border border-[var(--border)]">
              <div className="text-[10px] font-mono-code text-[var(--ink-soft)] uppercase">Bestand</div>
              <div className="font-mono-code font-bold text-[var(--ink)] mt-0.5 truncate">{stuckUpload.filename}</div>
              <div className="font-mono-code text-[10px] text-[var(--ink-soft)]">{stuckUpload.filesize}</div>
            </div>

            <div className="p-3 rounded-xl bg-[var(--paper)] border border-[var(--border)]">
              <div className="text-[10px] font-mono-code text-[var(--ink-soft)] uppercase">Fase</div>
              <div className="font-bold text-[var(--warning)] mt-0.5">{stuckUpload.stuckStage}</div>
              <div className="text-[10px] text-[var(--ink-soft)]">{stuckUpload.stuckSince}</div>
            </div>

            <div className="p-3 rounded-xl bg-[var(--paper)] border border-[var(--border)]">
              <div className="text-[10px] font-mono-code text-[var(--ink-soft)] uppercase">Gast</div>
              <div className="font-bold text-[var(--ink)] mt-0.5">{stuckUpload.guestName}</div>
              <div className="text-[10px] text-[var(--ink-soft)]">Browser upload</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-red-50 border border-red-200 font-mono-code text-[11px] text-red-900">
            {stuckUpload.errorLog}
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-[var(--success)] flex items-center gap-2 font-medium">
          <CheckCircle2 size={16} strokeWidth={2} />
          <span>Geen vastgelopen uploads in de wachtrij: alle mediabestanden zijn netjes verwerkt!</span>
        </div>
      )}

      {/* 2. Run List Table */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl overflow-hidden shadow-2xs">
        <div className="p-5 border-b border-[var(--border)] flex items-center justify-between">
          <h3 className="font-display font-bold text-base text-[var(--ink)]">
            {isNl ? 'Actieve & Recente Wachtrijtaken' : 'Active & Recent Queue Jobs'}
          </h3>
          <span className="text-xs font-mono-code text-[var(--ink-soft)]">
            Worker Vloot: 3 nodes actief
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--paper-2)] text-[var(--ink-soft)] font-mono-code uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Job ID & Type</th>
                <th className="py-3 px-4">Tenant</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Pogingen</th>
                <th className="py-3 px-4 text-right">Duur</th>
                <th className="py-3 px-4">Worker Node</th>
                <th className="py-3 px-4 text-right">Actie</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-[var(--paper)] transition-colors">
                  <td className="py-3.5 px-4 font-mono-code text-[11px] text-[var(--ink)]">
                    <div className="font-bold">{job.id}</div>
                    <div className="text-[10px] text-[var(--ink-soft)]">{job.type}</div>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap text-[var(--ink)] font-medium">
                    {job.tenantName}
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {getJobBadge(job.state)}
                  </td>

                  <td className="py-3.5 px-4 text-center font-mono-code text-[11px] tabular-nums">
                    {job.attempts}
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono-code text-[11px] tabular-nums text-[var(--ink-soft)]">
                    {job.duration}
                  </td>

                  <td className="py-3.5 px-4 font-mono-code text-[11px] text-[var(--ink-soft)] whitespace-nowrap">
                    {job.workerNode}
                  </td>

                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    {job.state === 'failed' ? (
                      <button
                        type="button"
                        onClick={() => onRequeueJob(job.id)}
                        className="px-2.5 py-1 rounded-lg bg-[var(--ink)] hover:bg-[#292524] text-white text-[11px] font-semibold transition-colors inline-flex items-center gap-1"
                      >
                        <RefreshCw size={11} strokeWidth={2} />
                        <span>Herstarten</span>
                      </button>
                    ) : (
                      <span className="text-[11px] font-mono-code text-[var(--ink-soft)]">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Interactive Unified Log Viewer with follow toggle, search, and copy */}
      <div className="bg-[#121110] border border-black/40 rounded-3xl overflow-hidden shadow-lg text-white">
        {/* Log Viewer Chrome Bar */}
        <div className="px-5 py-3.5 border-b border-white/10 bg-black/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Terminal size={16} className="text-[var(--accent)]" />
            <span className="font-mono-code text-xs font-bold text-white">
              Centrale Logviewer : Ingress, Storage & Workers
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Search Filter */}
            <div className="relative">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                value={logFilter}
                onChange={(e) => setLogFilter(e.target.value)}
                placeholder="Filter logs..."
                className="pl-7 pr-2.5 py-1 text-[11px] rounded-lg bg-white/10 border border-white/15 text-white placeholder-white/40 focus:outline-none focus:border-[var(--accent)] font-mono-code w-36 sm:w-48"
              />
            </div>

            {/* Follow Toggle */}
            <button
              type="button"
              onClick={() => setAutoFollow(!autoFollow)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono-code transition-colors flex items-center gap-1 ${
                autoFollow
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  : 'bg-white/10 text-white/60 hover:text-white'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${autoFollow ? 'bg-emerald-400 animate-pulse' : 'bg-white/40'}`} />
              <span>Follow: {autoFollow ? 'AAN' : 'UIT'}</span>
            </button>

            {/* Copy Button */}
            <button
              type="button"
              onClick={handleCopyLogs}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-mono-code transition-colors flex items-center gap-1"
            >
              <Copy size={11} strokeWidth={1.5} />
              <span>{copiedLog ? 'Gekopieerd!' : 'Kopieer'}</span>
            </button>
          </div>
        </div>

        {/* Monospace Log Lines Stream */}
        <div
          ref={logContainerRef}
          className="p-4 font-mono-code text-[11px] space-y-1.5 max-h-64 overflow-y-auto leading-relaxed select-text"
        >
          {filteredLogs.map((line, idx) => (
            <div
              key={idx}
              className={`hover:bg-white/5 px-2 py-0.5 rounded transition-colors ${
                line.includes('[WARN]') || line.includes('timeout')
                  ? 'text-amber-400'
                  : line.includes('[ERROR]')
                  ? 'text-red-400'
                  : 'text-white/80'
              }`}
            >
              {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
