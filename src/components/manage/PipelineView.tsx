import React from 'react';
import { PipelineRun } from '../../types/manage';
import { initialPipelineRuns } from '../../data/manageData';
import { GitBranch, CheckCircle2, RotateCcw, Clock, ShieldCheck, Box, HardDrive } from 'lucide-react';

interface PipelineViewProps {
  lang: 'nl' | 'en';
  onRequestRollback: (run: PipelineRun) => void;
}

export const PipelineView: React.FC<PipelineViewProps> = ({ lang, onRequestRollback }) => {
  const isNl = lang === 'nl';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="pb-4 border-b border-[var(--border)]">
        <h2 className="font-display font-extrabold text-2xl text-[var(--ink)] tracking-tight">
          {isNl ? 'CI/CD Pijplijn & Releases' : 'CI/CD Pipeline & Deployments'}
        </h2>
        <p className="text-xs text-[var(--ink-soft)] mt-0.5">
          {isNl
            ? 'Geautomatiseerde build containers, Helm v3 releases en database migraties op europe-west4.'
            : 'Automated container builds, Helm v3 charts, and database migrations on europe-west4.'}
        </p>
      </div>

      {/* Current Active Release Card */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[var(--border)] gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-[var(--paper)] text-[var(--accent)] border border-[var(--border)]">
              <Box size={18} strokeWidth={1.5} />
            </div>
            <div>
              <div className="font-mono-code font-bold text-sm text-[var(--ink)]">
                release-v2.14.8-prod
              </div>
              <div className="text-xs text-[var(--ink-soft)]">
                Helm chart: <code className="font-mono-code">fesafotos-prod-v2-14-8</code>
              </div>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono-code bg-emerald-50 text-[var(--success)] font-bold border border-emerald-200 self-start sm:self-auto">
            <CheckCircle2 size={13} />
            <span>Live in productie</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono-code">
          <div className="p-3 rounded-xl bg-[var(--paper)] border border-[var(--border)]">
            <div className="text-[10px] text-[var(--ink-soft)] uppercase">Container Artifact</div>
            <div className="font-bold text-[var(--ink)] text-[11px] truncate mt-0.5">
              pkg.dev/fesafotos/app:sha-e3c35b56
            </div>
          </div>
          <div className="p-3 rounded-xl bg-[var(--paper)] border border-[var(--border)]">
            <div className="text-[10px] text-[var(--ink-soft)] uppercase">Database Migratie</div>
            <div className="font-bold text-[var(--success)] text-[11px] mt-0.5">
              20261014_event_plus_limits.sql (Toegepast ✓)
            </div>
          </div>
          <div className="p-3 rounded-xl bg-[var(--paper)] border border-[var(--border)]">
            <div className="text-[10px] text-[var(--ink-soft)] uppercase">Vloot Uitrol</div>
            <div className="font-bold text-[var(--ink)] text-[11px] mt-0.5">
              41/41 pods herstart zonder downtime
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline Runs Table */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-[var(--border)] bg-[var(--paper-2)] flex items-center justify-between">
          <h3 className="font-display font-bold text-sm text-[var(--ink)]">
            Recente Pijplijn Runs & Commit Geschiedenis
          </h3>
          <span className="text-[11px] font-mono-code text-[var(--ink-soft)]">
            Branch: main (beschermd)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--paper)] text-[var(--ink-soft)] font-mono-code uppercase text-[10px]">
                <th className="py-2.5 px-4">Run & Commit</th>
                <th className="py-2.5 px-4">Omschrijving</th>
                <th className="py-2.5 px-4">Duur</th>
                <th className="py-2.5 px-4">Uitgerold op</th>
                <th className="py-2.5 px-4 text-right">Actie</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)] font-mono-code text-[11px]">
              {initialPipelineRuns.map((run, idx) => (
                <tr key={run.id} className="hover:bg-[var(--paper)]">
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="font-bold text-[var(--ink)] flex items-center gap-1.5">
                      <GitBranch size={13} className="text-[var(--accent)]" />
                      <span>{run.id}</span>
                    </div>
                    <div className="text-[10px] text-[var(--ink-soft)]">sha: {run.commitSha}</div>
                  </td>
                  <td className="py-3 px-4 text-[var(--ink)] font-body font-medium">
                    {run.commitMsg}
                  </td>
                  <td className="py-3 px-4 text-[var(--ink-soft)] whitespace-nowrap">
                    {run.duration}
                  </td>
                  <td className="py-3 px-4 text-[var(--ink-soft)] whitespace-nowrap">
                    {run.deployedAt}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    {idx === 0 ? (
                      <span className="text-[10px] text-[var(--success)] font-bold">Huidige versie</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onRequestRollback(run)}
                        className="px-2.5 py-1 rounded-lg border border-[var(--border)] hover:bg-[var(--paper-2)] text-[var(--ink)] text-[11px] flex items-center gap-1 ml-auto"
                        title="Simuleer gecontroleerde rollback naar deze release"
                      >
                        <RotateCcw size={11} />
                        <span>Rollback</span>
                      </button>
                    )}
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
