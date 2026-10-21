import React, { useState } from 'react';
import { AuditLine } from '../../types/manage';
import { initialAuditLines } from '../../data/manageData';
import { Search, Download, ShieldCheck, Filter, AlertTriangle, CheckCircle2, Eye, X } from 'lucide-react';

interface AuditViewProps {
  lang: 'nl' | 'en';
  onShowToast: (msg: string) => void;
}

export const AuditView: React.FC<AuditViewProps> = ({ lang, onShowToast }) => {
  const isNl = lang === 'nl';
  const [auditList] = useState<AuditLine[]>(initialAuditLines);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'warn' | 'destructive'>('all');
  const [selectedAudit, setSelectedAudit] = useState<AuditLine | null>(null);

  const filtered = auditList.filter((line) => {
    const matchesSearch =
      line.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      line.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      line.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      line.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || line.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExportCsv = () => {
    const headers = 'ID,Timestamp,Actor,Action,Target,IP,Status\n';
    const rows = filtered
      .map(
        (l) =>
          `"${l.id}","${l.timestamp}","${l.actor}","${l.action}","${l.target}","${l.ip}","${l.status}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fesafotos-audit-trail-${Date.now()}.csv`;
    a.click();
    onShowToast('Audit trail geëxporteerd als CSV bestand.');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[var(--border)] gap-3">
        <div>
          <h2 className="font-display font-extrabold text-2xl text-[var(--ink)] tracking-tight">
            {isNl ? 'Audit Trail & Onveranderlijk Logboek' : 'Audit Trail & Immutable Log'}
          </h2>
          <p className="text-xs text-[var(--ink-soft)] mt-0.5">
            {isNl
              ? 'Volledige geschiedenis van alle mutaties, betalingen, downloads en planwijzigingen conform AVG/GDPR.'
              : 'Complete history of mutations, transactions, downloads, and plan adjustments.'}
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCsv}
          className="px-3.5 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:bg-[var(--paper)] text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto shadow-2xs text-[var(--ink)]"
        >
          <Download size={14} />
          <span>{isNl ? 'Exporteer Audit (CSV)' : 'Export CSV'}</span>
        </button>
      </div>

      {/* Filter strip */}
      <div className="p-3.5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-soft)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Zoek in audit ID, actor, actie of IP..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--paper)] text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--accent)]"
          />
        </div>

        <div className="flex items-center gap-1 bg-[var(--paper)] p-1 rounded-xl border border-[var(--border)]">
          {(['all', 'success', 'warn', 'destructive'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={`px-2.5 py-1 rounded-lg font-mono-code text-[11px] capitalize transition-colors ${
                statusFilter === s
                  ? 'bg-[var(--surface)] text-[var(--ink)] font-bold shadow-2xs'
                  : 'text-[var(--ink-soft)] hover:text-[var(--ink)]'
              }`}
            >
              {s === 'all' ? 'Alle' : s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--paper-2)] text-[var(--ink-soft)] font-mono-code uppercase text-[10px]">
                <th className="py-3 px-4">Audit ID & Tijd</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Actie</th>
                <th className="py-3 px-4">Doelwit</th>
                <th className="py-3 px-4 text-right">IP / Bron</th>
                <th className="py-3 px-4 text-right">Inspectie</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filtered.map((line) => (
                <tr key={line.id} className="hover:bg-[var(--paper)] transition-colors">
                  <td className="py-3.5 px-4 font-mono-code text-[11px] text-[var(--ink-soft)] whitespace-nowrap">
                    <div className="font-bold text-[var(--ink)]">{line.id}</div>
                    <div>{line.timestamp}</div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[var(--ink)] whitespace-nowrap">
                    {line.actor}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono-code font-semibold ${
                        line.status === 'warn'
                          ? 'bg-amber-50 text-[var(--warning)] border border-amber-200'
                          : line.status === 'destructive'
                          ? 'bg-rose-50 text-[var(--danger)] border border-rose-200'
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
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => setSelectedAudit(line)}
                      className="p-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--paper-2)] text-[var(--ink)]"
                      title="Inspecteer audit metadata"
                    >
                      <Eye size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Inspector */}
      {selectedAudit && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setSelectedAudit(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-[var(--surface)] border border-[var(--border)] rounded-3xl shadow-2xl p-6 text-[var(--ink)] space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div>
                <span className="text-[10px] font-mono-code font-bold uppercase text-[var(--accent)]">
                  Audit Verificatie Record
                </span>
                <h3 className="font-display font-extrabold text-lg text-[var(--ink)]">
                  {selectedAudit.id}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAudit(null)}
                className="w-7 h-7 rounded-full bg-[var(--paper)] flex items-center justify-center"
              >
                <X size={14} />
              </button>
            </div>

            <div className="space-y-2 text-xs font-mono-code">
              <div className="p-2.5 rounded-xl bg-[var(--paper)] border border-[var(--border)] flex justify-between">
                <span className="text-[var(--ink-soft)]">Tijdstip:</span>
                <span className="font-bold">{selectedAudit.timestamp}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[var(--paper)] border border-[var(--border)] flex justify-between">
                <span className="text-[var(--ink-soft)]">Actor:</span>
                <span className="font-bold">{selectedAudit.actor}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[var(--paper)] border border-[var(--border)] flex justify-between">
                <span className="text-[var(--ink-soft)]">Actie:</span>
                <span className="font-bold text-[var(--accent)]">{selectedAudit.action}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[var(--paper)] border border-[var(--border)] flex justify-between">
                <span className="text-[var(--ink-soft)]">Doelwit:</span>
                <span>{selectedAudit.target}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[var(--paper)] border border-[var(--border)] flex justify-between">
                <span className="text-[var(--ink-soft)]">IP-adres:</span>
                <span>{selectedAudit.ip}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[var(--border)] flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedAudit(null)}
                className="px-4 py-2 rounded-xl bg-[var(--ink)] text-white text-xs font-semibold"
              >
                Sluiten
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
