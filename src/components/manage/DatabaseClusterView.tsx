import React, { useState } from 'react';
import { initialPostgresCluster } from '../../data/manageData';
import { PostgresClusterStatus } from '../../types/manage';
import { Database, Activity, RefreshCw, CheckCircle2, ShieldCheck, Zap, HardDrive, AlertTriangle } from 'lucide-react';

interface DatabaseClusterViewProps {
  lang: 'nl' | 'en';
  onShowToast: (msg: string) => void;
}

export const DatabaseClusterView: React.FC<DatabaseClusterViewProps> = ({ lang, onShowToast }) => {
  const isNl = lang === 'nl';
  const [pg, setPg] = useState<PostgresClusterStatus>(initialPostgresCluster);
  const [isSimulatingFailover, setIsSimulatingFailover] = useState(false);

  const valkeyStats = {
    version: 'Valkey v7.2.5 (Open Source Redis fork)',
    uptime: '19 dagen, 4 uur',
    connectedClients: 24,
    usedMemoryMb: 210,
    maxMemoryMb: 1024,
    opsPerSec: 1420,
    hitRatio: '98,6%',
    keysCount: 18450,
  };

  const handleSimulateFailover = () => {
    setIsSimulatingFailover(true);
    onShowToast('CloudNativePG gecontroleerde failover test gestart...');

    setTimeout(() => {
      setIsSimulatingFailover(false);
      setPg((prev) => ({
        ...prev,
        primaryNode: 'fesa-postgres-ha-2 (k3s-worker-nbg1-01)',
        standbyNodes: ['fesa-postgres-ha-1 (k3s-worker-fsn1-01)'],
      }));
      onShowToast('CloudNativePG failover succesvol voltooid in 1.4s met 0 dataverlies.');
    }, 1800);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[var(--border)] gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono-code font-bold bg-blue-50 text-blue-800 border border-blue-200 uppercase">
              CloudNativePG Operator
            </span>
            <span className="text-xs text-[var(--ink-soft)] font-mono-code">
              PostgreSQL 16.4 High-Availability + Valkey OSS
            </span>
          </div>
          <h2 className="font-display font-extrabold text-2xl text-[var(--ink)] tracking-tight mt-1">
            {isNl ? 'CloudNativePG Database & Valkey Cluster' : 'CloudNativePG Database & Valkey Cluster'}
          </h2>
          <p className="text-xs text-[var(--ink-soft)] mt-0.5">
            {isNl
              ? 'Self-hosted relationele database cluster met streaming replicatie, continue WAL archivering naar MinIO en Barman backups.'
              : 'Self-hosted relational database cluster with streaming replication, WAL archiving to MinIO, and Barman backups.'}
          </p>
        </div>

        <button
          type="button"
          onClick={handleSimulateFailover}
          disabled={isSimulatingFailover}
          className="px-3.5 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:bg-[var(--paper)] text-xs font-semibold flex items-center gap-1.5 shadow-2xs self-start sm:self-auto text-[var(--ink)] disabled:opacity-50"
        >
          <RefreshCw size={13} className={isSimulatingFailover ? 'animate-spin' : ''} />
          <span>{isSimulatingFailover ? 'Failover bezig...' : 'Test HA Failover'}</span>
        </button>
      </div>

      {/* CloudNativePG Main Card */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[var(--border)] gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[var(--paper)] text-[var(--accent)] border border-[var(--border)]">
              <Database size={20} strokeWidth={1.5} />
            </div>
            <div>
              <div className="font-mono-code font-bold text-base text-[var(--ink)] flex items-center gap-2">
                <span>{pg.clusterName}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono-code bg-emerald-50 text-[var(--success)] font-bold">
                  HA Gezond (0 lag)
                </span>
              </div>
              <div className="text-xs text-[var(--ink-soft)] font-mono-code">
                {pg.version}
              </div>
            </div>
          </div>

          <div className="text-right font-mono-code text-xs">
            <div className="text-[var(--ink-soft)]">Replicatie Achterstand:</div>
            <div className="font-bold text-[var(--success)] tabular-nums">{pg.replicationLagBytes} bytes (synchroon)</div>
          </div>
        </div>

        {/* Nodes & Topology */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono-code">
          <div className="p-3.5 rounded-2xl bg-[var(--paper)] border border-[var(--border)] space-y-1">
            <div className="text-[10px] text-[var(--ink-soft)] uppercase">Primaire Node (Read/Write)</div>
            <div className="font-bold text-[var(--ink)]">{pg.primaryNode}</div>
            <div className="text-[11px] text-[var(--success)] font-semibold">Actief voor alle API mutaties</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[var(--paper)] border border-[var(--border)] space-y-1">
            <div className="text-[10px] text-[var(--ink-soft)] uppercase">Standby Replica (Read-Only)</div>
            <div className="font-bold text-[var(--ink)]">{pg.standbyNodes[0]}</div>
            <div className="text-[11px] text-[var(--ink-soft)]">Streaming replication via pg_wal</div>
          </div>
        </div>

        {/* Operational Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono-code">
          <div className="p-3 rounded-xl bg-[var(--paper-2)] border border-[var(--border)]">
            <div className="text-[10px] text-[var(--ink-soft)] uppercase">Actieve Verbindingen</div>
            <div className="font-bold text-[var(--ink)] mt-0.5">{pg.connectionsActive} / {pg.connectionsMax}</div>
          </div>
          <div className="p-3 rounded-xl bg-[var(--paper-2)] border border-[var(--border)]">
            <div className="text-[10px] text-[var(--ink-soft)] uppercase">WAL Archivering</div>
            <div className="font-bold text-[var(--success)] mt-0.5">{pg.walArchiving}</div>
          </div>
          <div className="p-3 rounded-xl bg-[var(--paper-2)] border border-[var(--border)]">
            <div className="text-[10px] text-[var(--ink-soft)] uppercase">Barman Backup</div>
            <div className="font-bold text-[var(--ink)] mt-0.5 truncate">{pg.barmanLastBackup}</div>
          </div>
          <div className="p-3 rounded-xl bg-[var(--paper-2)] border border-[var(--border)]">
            <div className="text-[10px] text-[var(--ink-soft)] uppercase">Hetzner CSI Volume</div>
            <div className="font-bold text-[var(--accent)] mt-0.5">{pg.volumeSizeGb} GB ext4</div>
          </div>
        </div>
      </div>

      {/* Valkey In-Memory Cache Card */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[var(--border)] gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[var(--paper)] text-[var(--accent)] border border-[var(--border)]">
              <Zap size={20} strokeWidth={1.5} />
            </div>
            <div>
              <div className="font-mono-code font-bold text-base text-[var(--ink)] flex items-center gap-2">
                <span>valkey-cluster-0</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono-code bg-emerald-50 text-[var(--success)] font-bold">
                  Operationeel
                </span>
              </div>
              <div className="text-xs text-[var(--ink-soft)] font-mono-code">
                {valkeyStats.version}
              </div>
            </div>
          </div>

          <div className="text-right font-mono-code text-xs">
            <div className="text-[var(--ink-soft)]">Cache Hit Ratio:</div>
            <div className="font-bold text-[var(--success)] tabular-nums">{valkeyStats.hitRatio}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono-code">
          <div className="p-3 rounded-xl bg-[var(--paper)] border border-[var(--border)]">
            <div className="text-[10px] text-[var(--ink-soft)] uppercase">Geheugen (RAM)</div>
            <div className="font-bold text-[var(--ink)] mt-0.5">{valkeyStats.usedMemoryMb} MB / {valkeyStats.maxMemoryMb} MB</div>
          </div>
          <div className="p-3 rounded-xl bg-[var(--paper)] border border-[var(--border)]">
            <div className="text-[10px] text-[var(--ink-soft)] uppercase">Operaties / sec</div>
            <div className="font-bold text-[var(--ink)] mt-0.5 tabular-nums">{valkeyStats.opsPerSec} ops/s</div>
          </div>
          <div className="p-3 rounded-xl bg-[var(--paper)] border border-[var(--border)]">
            <div className="text-[10px] text-[var(--ink-soft)] uppercase">Sleutels in Cache</div>
            <div className="font-bold text-[var(--accent)] mt-0.5 tabular-nums">{valkeyStats.keysCount} keys</div>
          </div>
          <div className="p-3 rounded-xl bg-[var(--paper)] border border-[var(--border)]">
            <div className="text-[10px] text-[var(--ink-soft)] uppercase">Verbonden Clients</div>
            <div className="font-bold text-[var(--ink)] mt-0.5">{valkeyStats.connectedClients} pods</div>
          </div>
        </div>
      </div>
    </div>
  );
};
