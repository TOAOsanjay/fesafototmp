import React, { useState } from 'react';
import { initialHetznerNodes, initialHetznerLb } from '../../data/manageData';
import { HetznerServerNode, HetznerLoadBalancer } from '../../types/manage';
import {
  Server,
  Network,
  HardDrive,
  ShieldCheck,
  RefreshCw,
  Cpu,
  Layers,
  ArrowRight,
  CheckCircle2,
  Lock,
  ExternalLink,
  Sliders,
  Terminal,
} from 'lucide-react';

interface HetznerK3sViewProps {
  lang: 'nl' | 'en';
  onShowToast: (msg: string) => void;
  onRequestCordon?: (nodeName: string) => void;
}

export const HetznerK3sView: React.FC<HetznerK3sViewProps> = ({
  lang,
  onShowToast,
  onRequestCordon,
}) => {
  const isNl = lang === 'nl';
  const [nodes, setNodes] = useState<HetznerServerNode[]>(initialHetznerNodes);
  const [lb, setLb] = useState<HetznerLoadBalancer>(initialHetznerLb);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [snapshotSuccess, setSnapshotSuccess] = useState(false);

  const handleRefreshCsi = () => {
    setIsRefreshing(true);
    onShowToast('Hetzner CSI Volume status gesynchroniseerd...');
    setTimeout(() => {
      setIsRefreshing(false);
      onShowToast('Alle 8 Hetzner CSI persistent volumes zijn gezond (ext4 block storage).');
    }, 1000);
  };

  const handleSnapshotCsi = () => {
    setSnapshotSuccess(true);
    onShowToast('Hetzner Cloud CSI Volume Snapshot geactiveerd voor alle 8 volumes.');
    setTimeout(() => setSnapshotSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[var(--border)] gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono-code font-bold bg-rose-50 text-rose-700 border border-rose-200 uppercase">
              Hetzner Cloud (k3s)
            </span>
            <span className="text-xs text-[var(--ink-soft)] font-mono-code">
              vitobotta/hetzner-k3s v1.30+
            </span>
          </div>
          <h2 className="font-display font-extrabold text-2xl text-[var(--ink)] tracking-tight mt-1">
            {isNl ? 'Hetzner k3s Cluster & Vlootinfrastructuur' : 'Hetzner k3s Cluster & Fleet Infrastructure'}
          </h2>
          <p className="text-xs text-[var(--ink-soft)] mt-0.5">
            {isNl
              ? 'Volledig self-hosted open-source cluster op Hetzner Cloud met hcloud-ccm, hcloud-csi, Traefik en private network.'
              : '100% open-source self-hosted cluster on Hetzner Cloud with hcloud-ccm, hcloud-csi, Traefik and private networking.'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleSnapshotCsi}
            className="px-3.5 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:bg-[var(--paper)] text-xs font-semibold flex items-center gap-1.5 shadow-2xs text-[var(--ink)]"
          >
            <HardDrive size={13} className="text-[var(--accent)]" />
            <span>CSI Volume Snapshot</span>
          </button>

          <button
            type="button"
            onClick={handleRefreshCsi}
            disabled={isRefreshing}
            className="px-3.5 py-2 rounded-xl bg-[var(--ink)] text-white hover:bg-[#292524] text-xs font-semibold flex items-center gap-1.5 shadow-2xs disabled:opacity-50"
          >
            <RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />
            <span>Sync Vloot</span>
          </button>
        </div>
      </div>

      {snapshotSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 text-[var(--success)] border border-emerald-200 text-xs font-mono-code flex items-center gap-2">
          <CheckCircle2 size={15} />
          <span>Hetzner CSI Snapshot succesvol aangemaakt over 320 GB block storage in fsn1 en nbg1.</span>
        </div>
      )}

      {/* Hetzner-k3s Core Components Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-2xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[var(--ink)] font-mono-code">hcloud-ccm</span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono-code font-bold bg-emerald-50 text-[var(--success)]">
              v1.19.1
            </span>
          </div>
          <div className="text-[11px] text-[var(--ink-soft)] leading-normal">
            Hetzner Cloud Controller Manager: routes, private networks & Load Balancer reconciler.
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-2xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[var(--ink)] font-mono-code">hcloud-csi</span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono-code font-bold bg-emerald-50 text-[var(--success)]">
              v2.8.0
            </span>
          </div>
          <div className="text-[11px] text-[var(--ink-soft)] leading-normal">
            Hetzner Cloud CSI Driver: 8 volumes (ext4, 320 GB totaal) voor MinIO en Postgres.
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-2xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[var(--ink)] font-mono-code">Traefik Ingress</span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono-code font-bold bg-emerald-50 text-[var(--success)]">
              v3.1.2
            </span>
          </div>
          <div className="text-[11px] text-[var(--ink-soft)] leading-normal">
            Default k3s IngressController met Proxy Protocol v2 van Hetzner LB11.
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-2xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[var(--ink)] font-mono-code">System Upgrade</span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono-code font-bold bg-emerald-50 text-[var(--success)]">
              v0.13.4
            </span>
          </div>
          <div className="text-[11px] text-[var(--ink-soft)] leading-normal">
            Rancher SUC: automatische rollende k3s upgrades zonder downtime.
          </div>
        </div>
      </div>

      {/* Hetzner Cloud Load Balancer LB11 Card */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[var(--border)] gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[var(--paper)] text-[var(--accent)] border border-[var(--border)]">
              <Network size={18} strokeWidth={1.5} />
            </div>
            <div>
              <div className="font-mono-code font-bold text-base text-[var(--ink)] flex items-center gap-2">
                <span>{lb.name} ({lb.type})</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono-code bg-emerald-50 text-[var(--success)] font-bold">
                  Operationeel
                </span>
              </div>
              <div className="text-xs text-[var(--ink-soft)]">
                Locatie: {lb.location} · Algoritme: {lb.algorithm}
              </div>
            </div>
          </div>

          <div className="font-mono-code text-xs text-right">
            <div className="font-bold text-[var(--ink)]">IPv4: {lb.ipv4}</div>
            <div className="text-[10px] text-[var(--ink-soft)] truncate max-w-xs">{lb.ipv6}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono-code">
          <div className="p-3 rounded-xl bg-[var(--paper)] border border-[var(--border)]">
            <div className="text-[10px] text-[var(--ink-soft)] uppercase">Proxy Protocol v2</div>
            <div className="font-bold text-[var(--success)] mt-0.5">Ingeschakeld ✓</div>
            <div className="text-[10px] text-[var(--ink-soft)] mt-0.5">Behoudt echte client IP-adressen</div>
          </div>

          <div className="p-3 rounded-xl bg-[var(--paper)] border border-[var(--border)]">
            <div className="text-[10px] text-[var(--ink-soft)] uppercase">HTTP Port 80 Forwarding</div>
            <div className="font-bold text-[var(--ink)] mt-0.5">TCP :80 → NodePort :30080</div>
            <div className="text-[10px] text-[var(--success)] mt-0.5">Traefik HTTP/2 ingress</div>
          </div>

          <div className="p-3 rounded-xl bg-[var(--paper)] border border-[var(--border)]">
            <div className="text-[10px] text-[var(--ink-soft)] uppercase">HTTPS Port 443 Forwarding</div>
            <div className="font-bold text-[var(--ink)] mt-0.5">TCP :443 → NodePort :30443</div>
            <div className="text-[10px] text-[var(--success)] mt-0.5">Passthrough naar cert-manager TLS</div>
          </div>
        </div>
      </div>

      {/* Hetzner Server Nodes Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-bold text-base text-[var(--ink)]">
            {isNl ? 'Hetzner Cloud Server Nodes (k3s Topology)' : 'Hetzner Cloud Server Nodes'}
          </h3>
          <span className="text-xs font-mono-code text-[var(--ink-soft)]">
            Privé Netwerk: 10.0.0.0/16 · WireGuard CNI
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {nodes.map((node) => (
            <div
              key={node.name}
              className="p-5 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-2xs space-y-4 hover:border-[var(--accent)] transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-mono-code font-bold text-sm text-[var(--ink)] flex items-center gap-1.5">
                    <Server size={14} className="text-[var(--accent)]" />
                    <span>{node.name}</span>
                  </div>
                  <div className="text-[11px] text-[var(--ink-soft)] font-mono-code mt-0.5">
                    Type: <strong className="text-[var(--ink)]">{node.serverType.toUpperCase()}</strong> ({node.cores} vCPU, {node.memoryGb} GB RAM)
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono-code font-bold uppercase ${
                    node.role === 'control-plane'
                      ? 'bg-purple-50 text-purple-700 border border-purple-200'
                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}
                >
                  {node.role}
                </span>
              </div>

              {/* IP & Location */}
              <div className="p-3 rounded-2xl bg-[var(--paper)] border border-[var(--border)] space-y-1.5 font-mono-code text-[11px]">
                <div className="flex justify-between">
                  <span className="text-[var(--ink-soft)]">Datacenter:</span>
                  <span className="font-bold text-[var(--ink)]">{node.city} ({node.datacenter})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--ink-soft)]">Publiek IPv4:</span>
                  <span className="text-[var(--ink)]">{node.publicIpv4}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--ink-soft)]">Privé IP (k3s):</span>
                  <span className="text-[var(--accent)] font-bold">{node.privateIp}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-[var(--border)]">
                  <span className="text-[var(--ink-soft)]">Hetzner CSI Volumes:</span>
                  <span className="font-bold text-[var(--ink)]">{node.csiVolumesAttached} gekoppeld</span>
                </div>
              </div>

              {/* Action */}
              <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between">
                <span className="text-[10px] font-mono-code text-[var(--success)] font-semibold flex items-center gap-1">
                  <CheckCircle2 size={12} />
                  <span>k3s Ready</span>
                </span>

                <button
                  type="button"
                  onClick={() => {
                    if (onRequestCordon) {
                      onRequestCordon(node.name);
                    } else {
                      onShowToast(`Node ${node.name} geselecteerd.`);
                    }
                  }}
                  className="text-[11px] font-mono-code text-[var(--ink-soft)] hover:text-[var(--ink)] underline"
                >
                  {node.isCordoned ? 'Uncordon' : 'Cordon'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
