import React, { useState } from 'react';
import {
  HardDrive,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  FileCheck,
  RefreshCw,
  Archive,
  Database,
  Layers,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { initialBackupLayers, initialRestoreDrill } from '../../data/manageData';
import { BackupLayerStatus, RestoreDrillReport } from '../../types/manage';

interface BackupDrillViewProps {
  lang: 'nl' | 'en';
  onShowToast: (msg: string) => void;
}

export const BackupDrillView: React.FC<BackupDrillViewProps> = ({
  lang,
  onShowToast,
}) => {
  const isNl = lang === 'nl';
  const [backupLayers] = useState<BackupLayerStatus[]>(initialBackupLayers);
  const [restoreDrill] = useState<RestoreDrillReport>(initialRestoreDrill);
  const [isRequestingDrill, setIsRequestingDrill] = useState(false);

  const handleRequestDrill = () => {
    setIsRequestingDrill(true);
    onShowToast(
      isNl
        ? 'Herstelproef aangevraagd via fesafoto-cluster-agent voorstel cluster-prop-105.'
        : 'Restore drill proposal cluster-prop-105 queued via fesafoto-cluster-agent.'
    );
    setTimeout(() => {
      setIsRequestingDrill(false);
      onShowToast(
        isNl
          ? 'Voorstel aangemaakt in Besluitenregister. Wacht op menselijke goedkeuring.'
          : 'Proposal registered in decisions ledger. Awaiting human confirmation.'
      );
    }, 1200);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="pb-4 border-b border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <h2 className="font-display font-extrabold text-2xl text-[var(--ink)] tracking-tight">
              {isNl ? 'Back-up & Herstelproef' : 'Backup & Restore Drills'}
            </h2>
          </div>
          <p className="text-xs text-[var(--ink-soft)] mt-0.5">
            {isNl
              ? 'Drielagige gegevensbescherming: etcd cluster snapshots, Restic dagelijkse back-up naar Hetzner Object Storage, en kwartaal herstelproeven.'
              : 'Three-tier disaster recovery: etcd cluster snapshots, Restic daily backups to Hetzner Object Storage, and quarterly restore drills.'}
          </p>
        </div>

        <button
          type="button"
          onClick={handleRequestDrill}
          disabled={isRequestingDrill}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[var(--surface)] border border-[var(--border)] text-[var(--ink)] hover:border-[var(--ink)] transition-colors shadow-2xs self-start sm:self-auto disabled:opacity-60"
        >
          <RefreshCw size={14} className={isRequestingDrill ? 'animate-spin text-[var(--accent)]' : ''} />
          <span>{isNl ? 'Nieuwe herstelproef aanvragen' : 'Request restore drill'}</span>
        </button>
      </div>

      {/* 1. Retention Window Banner */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-[var(--paper)] text-[var(--success)] border border-[var(--border)]">
              <ShieldCheck size={24} strokeWidth={1.5} />
            </div>
            <div>
              <div className="text-xs font-mono-code font-bold uppercase tracking-wider text-[var(--ink-soft)]">
                {isNl ? 'Bewaartermijn & Herstelvenster' : 'Retention Window & Recovery SLA'}
              </div>
              <div className="font-display font-bold text-lg text-[var(--ink)] mt-0.5">
                90 {isNl ? 'dagen point-in-time herstel gegarandeerd' : 'days point-in-time recovery active'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono-code">
            <div className="p-2.5 rounded-xl bg-[var(--paper)] border border-[var(--border)]">
              <div className="text-[10px] text-[var(--ink-soft)] uppercase">
                {isNl ? 'Oudste Snapshot' : 'Oldest Snapshot'}
              </div>
              <div className="font-bold text-[var(--ink)] mt-0.5">22 juli 2026</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[var(--paper)] border border-[var(--border)]">
              <div className="text-[10px] text-[var(--ink-soft)] uppercase">
                {isNl ? 'Nieuwste Snapshot' : 'Latest Snapshot'}
              </div>
              <div className="font-bold text-[var(--success)] mt-0.5">Vandaag 02:15 CET</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[var(--paper)] border border-[var(--border)] col-span-2 sm:col-span-1">
              <div className="text-[10px] text-[var(--ink-soft)] uppercase">
                {isNl ? 'RPO / RTO Doel' : 'RPO / RTO Target'}
              </div>
              <div className="font-bold text-[var(--ink)] mt-0.5">&lt; 24u / &lt; 15 min</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Drielagige Back-up Kaarten */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono-code font-bold uppercase tracking-wider text-[var(--ink-soft)]">
          {isNl ? 'Drie actieve beschermingslagen' : 'Three active backup layers'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {backupLayers.map((layer) => (
            <div
              key={layer.id}
              className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-2xs space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="p-2.5 rounded-xl bg-[var(--paper)] text-[var(--accent)] border border-[var(--border)]">
                  {layer.id === 'backup-etcd' && <Database size={18} strokeWidth={1.5} />}
                  {layer.id === 'backup-restic' && <Archive size={18} strokeWidth={1.5} />}
                  {layer.id === 'backup-manifests' && <Layers size={18} strokeWidth={1.5} />}
                </div>

                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono-code font-bold bg-emerald-50 text-[var(--success)] border border-emerald-200">
                  <CheckCircle2 size={11} />
                  <span>{isNl ? 'Geslaagd' : 'Healthy'}</span>
                </span>
              </div>

              <div>
                <h4 className="font-display font-bold text-base text-[var(--ink)]">
                  {layer.layerName}
                </h4>
                <div className="text-xs text-[var(--ink-soft)] mt-1 font-mono-code">
                  {layer.targetLocation}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono-code pt-2 border-t border-[var(--border)]">
                <div>
                  <div className="text-[10px] text-[var(--ink-soft)] uppercase">
                    {isNl ? 'Omvang' : 'Size'}
                  </div>
                  <div className="font-bold text-[var(--ink)] mt-0.5">
                    {layer.sizeMb > 1000
                      ? `${(layer.sizeMb / 1024).toFixed(1)} GB`
                      : `${layer.sizeMb.toFixed(1)} MB`}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-[var(--ink-soft)] uppercase">
                    {isNl ? 'Duur' : 'Duration'}
                  </div>
                  <div className="font-bold text-[var(--ink)] mt-0.5">
                    {layer.durationSeconds}s
                  </div>
                </div>

                <div className="col-span-2 pt-1">
                  <div className="text-[10px] text-[var(--ink-soft)] uppercase">
                    {isNl ? 'Laatste Run' : 'Last Run'}
                  </div>
                  <div className="text-xs text-[var(--ink)] mt-0.5 truncate">
                    {layer.lastBackupTime}
                  </div>
                </div>

                <div className="col-span-2 pt-1">
                  <div className="text-[10px] text-[var(--ink-soft)] uppercase">
                    SHA-256 Checksum
                  </div>
                  <div className="text-[10px] text-[var(--ink-soft)] font-mono-code truncate mt-0.5">
                    {layer.sha256}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Kwartaal Herstelproef (Restore Drill Report) */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[var(--border)] gap-2">
          <div className="flex items-center gap-2">
            <FileCheck size={18} className="text-[var(--success)]" />
            <h3 className="font-display font-bold text-base text-[var(--ink)]">
              {isNl ? 'Laatste Herstelproef (fesafoto-restore-drill)' : 'Latest Restore Drill (fesafoto-restore-drill)'}
            </h3>
          </div>

          <span className="text-xs font-mono-code text-[var(--ink-soft)]">
            ID: {restoreDrill.drillId}
          </span>
        </div>

        <p className="text-xs text-[var(--ink)] leading-relaxed font-sans">
          {restoreDrill.summary}
        </p>

        {/* Verification metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono-code">
          <div className="p-3 rounded-xl bg-[var(--paper)] border border-[var(--border)]">
            <div className="text-[10px] text-[var(--ink-soft)] uppercase">
              {isNl ? 'Gecontroleerde Tenants' : 'Verified Tenants'}
            </div>
            <div className="font-bold text-base text-[var(--ink)] mt-0.5">
              {restoreDrill.verifiedTenantsCount} / 3
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[var(--paper)] border border-[var(--border)]">
            <div className="text-[10px] text-[var(--ink-soft)] uppercase">
              {isNl ? 'SQLite Databases' : 'SQLite DBs'}
            </div>
            <div className="font-bold text-base text-[var(--ink)] mt-0.5">
              {restoreDrill.verifiedSqliteDatabasesCount} (100% OK)
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[var(--paper)] border border-[var(--border)]">
            <div className="text-[10px] text-[var(--ink-soft)] uppercase">
              {isNl ? 'Media Bestanden' : 'Media Files'}
            </div>
            <div className="font-bold text-base text-[var(--ink)] mt-0.5">
              {restoreDrill.verifiedMediaFilesCount.toLocaleString()}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[var(--paper)] border border-[var(--border)]">
            <div className="text-[10px] text-[var(--ink-soft)] uppercase">
              {isNl ? 'Ontbrekende Hashes' : 'Missing Hashes'}
            </div>
            <div className="font-bold text-base text-[var(--success)] mt-0.5">
              0 (Geen dataverlies)
            </div>
          </div>
        </div>

        <div className="text-[11px] font-mono-code text-[var(--ink-soft)] pt-2 border-t border-[var(--border)] flex items-center justify-between">
          <span>{isNl ? 'Uitvoeringsdatum:' : 'Execution date:'} {restoreDrill.completedAt}</span>
          <span className="text-[var(--success)] font-semibold">Integriteit 100% geverifieerd</span>
        </div>
      </div>
    </div>
  );
};
