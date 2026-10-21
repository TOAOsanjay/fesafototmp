import React, { useState } from 'react';
import { initialClusterNodes, initialPods } from '../../data/manageData';
import { ClusterNode, ClusterPod } from '../../types/manage';
import {
  Server,
  ShieldCheck,
  Lock,
  Globe,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Box,
  Terminal,
  X,
} from 'lucide-react';

interface ClusterViewProps {
  lang: 'nl' | 'en';
  onRequestCordon?: (nodeName: string) => void;
  onShowToast: (msg: string) => void;
}

export const ClusterView: React.FC<ClusterViewProps> = ({
  lang,
  onRequestCordon,
  onShowToast,
}) => {
  const isNl = lang === 'nl';
  const [nodes, setNodes] = useState<ClusterNode[]>(initialClusterNodes);
  const [pods, setPods] = useState<ClusterPod[]>(initialPods);
  const [namespaceFilter, setNamespaceFilter] = useState<string>('all');
  const [selectedPodLogs, setSelectedPodLogs] = useState<ClusterPod | null>(null);

  const certificates = [
    {
      domain: '*.fesafotos.nl (Wildcard)',
      issuer: "Let's Encrypt Authority X3",
      status: 'Geldig & Auto-renewal',
      expiresIn: '74 dagen',
      issuedOn: '2026-08-01',
    },
    {
      domain: 'manage.fesafotos.nl',
      issuer: "Let's Encrypt Authority X3",
      status: 'Geldig (HSTS ingeschakeld)',
      expiresIn: '74 dagen',
      issuedOn: '2026-08-01',
    },
    {
      domain: 'sanjayendewie.nl (Custom domein)',
      issuer: 'Cloudflare Edge SSL (CNAME)',
      status: 'Geldig & Geverifieerd',
      expiresIn: '210 dagen',
      issuedOn: '2026-05-14',
    },
  ];

  const sessions = [
    {
      device: 'MacBook Pro (macOS Sequoia) : Chrome 132',
      ip: '82.161.44.12 (Amsterdam, NL)',
      location: 'Huidige sessie (deze browser)',
      isCurrent: true,
      lastSeen: 'Nu actief',
    },
    {
      device: 'iPhone 17 Pro : Safari Mobile',
      ip: '145.131.20.8 (KPN 5G)',
      location: 'Locatiebezoek Paviljoen Puur',
      isCurrent: false,
      lastSeen: 'Gisteren om 23:14 CET',
    },
  ];

  const filteredPods = pods.filter(
    (p) => namespaceFilter === 'all' || p.namespace === namespaceFilter
  );

  const handleToggleCordon = (nodeName: string) => {
    if (onRequestCordon) {
      onRequestCordon(nodeName);
      return;
    }
    setNodes((prev) =>
      prev.map((n) =>
        n.name === nodeName ? { ...n, isCordoned: !n.isCordoned } : n
      )
    );
    onShowToast(`Node ${nodeName} cordon-status gewijzigd.`);
  };

  const handleRestartPod = (podName: string) => {
    setPods((prev) =>
      prev.map((p) =>
        p.name === podName
          ? { ...p, restarts: p.restarts + 1, age: '10s' }
          : p
      )
    );
    onShowToast(`Pod ${podName} herstart met nieuwe container instantie.`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="pb-4 border-b border-[var(--border)]">
        <h2 className="font-display font-extrabold text-2xl text-[var(--ink)] tracking-tight">
          {isNl ? 'Vloot, Cluster & Kubernetes Toezicht' : 'Fleet, Cluster & Kubernetes'}
        </h2>
        <p className="text-xs text-[var(--ink-soft)] mt-0.5">
          {isNl
            ? 'Kubernetes clusterstatus op europe-west4, pod inspectie, SSL certificaten en actieve operator sessies.'
            : 'Kubernetes cluster state on europe-west4, live pod inspector, SSL certificates, and active sessions.'}
        </p>
      </div>

      {/* 1. Cluster Node Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-bold text-base text-[var(--ink)]">
            {isNl ? 'Cluster Nodes (europe-west4 Amsterdam)' : 'Cluster Nodes (europe-west4 Amsterdam)'}
          </h3>
          <span className="text-xs font-mono-code text-[var(--success)] font-semibold">
            3/3 Nodes operationeel · 41 pods running
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {nodes.map((node) => (
            <div
              key={node.name}
              className={`bg-[var(--surface)] border rounded-3xl p-5 shadow-2xs space-y-4 transition-all ${
                node.isCordoned
                  ? 'border-amber-400 bg-amber-50/20'
                  : 'border-[var(--border)]'
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                <div className="flex items-center gap-2">
                  <Server size={16} className="text-[var(--ink-soft)]" />
                  <span className="font-mono-code font-bold text-xs text-[var(--ink)]">
                    {node.name}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {node.isCordoned && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono-code bg-amber-100 text-[var(--warning)] font-bold">
                      CORDONED
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono-code bg-emerald-50 text-[var(--success)] font-bold border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)]" />
                    <span>{node.status}</span>
                  </span>
                </div>
              </div>

              {/* Resource meters */}
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between font-mono-code text-[11px] mb-1">
                    <span className="text-[var(--ink-soft)]">CPU Belasting</span>
                    <span className="font-bold text-[var(--ink)] tabular-nums">{node.cpuPercent}%</span>
                  </div>
                  <div className="w-full bg-[var(--paper)] rounded-full h-1.5 overflow-hidden border border-[var(--border)]">
                    <div
                      className={`h-1.5 rounded-full ${node.cpuPercent > 70 ? 'bg-[var(--warning)]' : 'bg-[var(--success)]'}`}
                      style={{ width: `${node.cpuPercent}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-mono-code text-[11px] mb-1">
                    <span className="text-[var(--ink-soft)]">Geheugen (RAM)</span>
                    <span className="font-bold text-[var(--ink)] tabular-nums">{node.memPercent}%</span>
                  </div>
                  <div className="w-full bg-[var(--paper)] rounded-full h-1.5 overflow-hidden border border-[var(--border)]">
                    <div
                      className={`h-1.5 rounded-full ${node.memPercent > 75 ? 'bg-[var(--warning)]' : 'bg-[var(--accent)]'}`}
                      style={{ width: `${node.memPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between text-[11px] font-mono-code text-[var(--ink-soft)]">
                <span>{node.podsRunning} pods</span>
                <button
                  type="button"
                  onClick={() => handleToggleCordon(node.name)}
                  className="text-[10px] underline hover:text-[var(--ink)]"
                >
                  {node.isCordoned ? 'Uncordon node' : 'Cordon node'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Kubernetes Pods Table */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-[var(--border)] bg-[var(--paper-2)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-display font-bold text-base text-[var(--ink)]">
              {isNl ? 'Kubernetes Pods Inspectie (41 actief)' : 'Kubernetes Pods Inspection'}
            </h3>
            <p className="text-xs text-[var(--ink-soft)]">
              Inspecteer individuele pod containers, herstarts en geheugengebruik.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-[var(--paper)] p-1 rounded-xl border border-[var(--border)] text-xs">
            {['all', 'core', 'transcode', 'ingress', 'mail', 'venues'].map((ns) => (
              <button
                key={ns}
                type="button"
                onClick={() => setNamespaceFilter(ns)}
                className={`px-2 py-0.5 rounded-lg font-mono-code text-[11px] transition-colors ${
                  namespaceFilter === ns
                    ? 'bg-[var(--surface)] text-[var(--ink)] font-bold shadow-2xs'
                    : 'text-[var(--ink-soft)] hover:text-[var(--ink)]'
                }`}
              >
                {ns}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--paper)] text-[var(--ink-soft)] font-mono-code uppercase text-[10px]">
                <th className="py-2.5 px-4">Pod Naam & Namespace</th>
                <th className="py-2.5 px-4">Node</th>
                <th className="py-2.5 px-4">CPU / RAM</th>
                <th className="py-2.5 px-4">Herstarts</th>
                <th className="py-2.5 px-4">Leeftijd</th>
                <th className="py-2.5 px-4 text-right">Actie</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)] font-mono-code text-[11px]">
              {filteredPods.map((pod) => (
                <tr key={pod.name} className="hover:bg-[var(--paper)]">
                  <td className="py-3 px-4">
                    <div className="font-bold text-[var(--ink)] flex items-center gap-1.5">
                      <Box size={13} className="text-[var(--accent)]" />
                      <span>{pod.name}</span>
                    </div>
                    <div className="text-[10px] text-[var(--ink-soft)]">
                      ns: {pod.namespace} · versie: {pod.version}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[var(--ink-soft)] whitespace-nowrap">
                    {pod.node}
                  </td>
                  <td className="py-3 px-4 text-[var(--ink)] tabular-nums whitespace-nowrap">
                    {pod.cpuMilli}m / {pod.memMb}MB
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        pod.restarts > 0
                          ? 'bg-amber-100 text-[var(--warning)]'
                          : 'bg-emerald-50 text-[var(--success)]'
                      }`}
                    >
                      {pod.restarts} restarts
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[var(--ink-soft)] whitespace-nowrap">
                    {pod.age}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => setSelectedPodLogs(pod)}
                        className="p-1 rounded-lg border border-[var(--border)] hover:bg-[var(--paper-2)] text-[var(--ink)]"
                        title="Bekijk stdout / stderr container logs"
                      >
                        <Terminal size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRestartPod(pod.name)}
                        className="px-2 py-0.5 rounded-lg border border-[var(--border)] hover:bg-[var(--paper-2)] text-[var(--ink)] text-[10px]"
                        title="Herstart container"
                      >
                        Herstart
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. SSL Certificates & Expiry Countdown */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 shadow-2xs">
        <div className="pb-3 mb-4 border-b border-[var(--border)]">
          <h3 className="font-display font-bold text-base text-[var(--ink)]">
            {isNl ? 'SSL Certificaten & Versleuteling' : 'SSL Certificates & Encryption'}
          </h3>
          <p className="text-xs text-[var(--ink-soft)]">
            {isNl
              ? 'TLSv1.3 en HSTS actief op alle subdomeinen en geverifieerde eigen domeinen.'
              : 'TLSv1.3 and HSTS active across all wildcards and verified custom domains.'}
          </p>
        </div>

        <div className="space-y-3">
          {certificates.map((cert) => (
            <div
              key={cert.domain}
              className="p-3.5 rounded-2xl bg-[var(--paper)] border border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div>
                <div className="font-mono-code font-bold text-sm text-[var(--ink)] flex items-center gap-2">
                  <Lock size={13} className="text-[var(--success)]" />
                  <span>{cert.domain}</span>
                </div>
                <div className="text-[11px] text-[var(--ink-soft)] mt-0.5 font-mono-code">
                  Uitgever: {cert.issuer} · Uitgegeven op {cert.issuedOn}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-mono-code text-xs text-[var(--success)] font-semibold">
                  {cert.status}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[var(--surface)] border border-[var(--border)] font-mono-code text-[11px] font-bold text-[var(--ink)]">
                  Verloopt over {cert.expiresIn}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Active Operator Sessions */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 shadow-2xs">
        <div className="pb-3 mb-4 border-b border-[var(--border)]">
          <h3 className="font-display font-bold text-base text-[var(--ink)]">
            {isNl ? 'Actieve Operator Sessies' : 'Active Operator Sessions'}
          </h3>
          <p className="text-xs text-[var(--ink-soft)]">
            {isNl
              ? 'Beheersessies geauthenticeerd via code-login voor Sanjay Mankoe.'
              : 'Admin sessions authenticated via secure code login for Sanjay Mankoe.'}
          </p>
        </div>

        <div className="space-y-3 text-xs">
          {sessions.map((sess, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-[var(--paper)] border border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--ink)]">
                  <Smartphone size={16} strokeWidth={1.5} />
                </div>
                <div>
                  <div className="font-bold text-[var(--ink)] flex items-center gap-2">
                    <span>{sess.device}</span>
                    {sess.isCurrent && (
                      <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-[var(--success)] text-[10px] font-mono-code font-bold">
                        Huidig
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] font-mono-code text-[var(--ink-soft)] mt-0.5">
                    {sess.ip} · {sess.location}
                  </div>
                </div>
              </div>

              <div className="text-[11px] font-mono-code text-[var(--ink-soft)]">
                {sess.lastSeen}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pod Logs Drawer / Modal */}
      {selectedPodLogs && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setSelectedPodLogs(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-[var(--surface)] border border-[var(--border)] rounded-3xl shadow-2xl p-6 text-[var(--ink)] space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div>
                <span className="text-[10px] font-mono-code font-bold uppercase text-[var(--accent)]">
                  Pod Container Logs (stdout/stderr)
                </span>
                <h3 className="font-mono-code font-bold text-base text-[var(--ink)]">
                  {selectedPodLogs.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPodLogs(null)}
                className="w-7 h-7 rounded-full bg-[var(--paper)] flex items-center justify-center"
              >
                <X size={14} />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#1c1917] text-[#faf7f2] font-mono-code text-[11px] space-y-1 max-h-72 overflow-y-auto">
              <div>2026-10-20T22:15:00.012Z [INFO] Initializing service container on {selectedPodLogs.node}</div>
              <div>2026-10-20T22:15:01.109Z [INFO] Connected to internal redis bus at 10.244.0.12:6379</div>
              <div>2026-10-20T22:15:02.418Z [INFO] Health probe liveness /readiness HTTP 200 OK</div>
              <div>2026-10-20T22:15:10.880Z [INFO] Pod age: {selectedPodLogs.age}, Restarts: {selectedPodLogs.restarts}</div>
              <div>2026-10-20T22:15:33.744Z [INFO] Ready to accept ingress traffic on port 8080.</div>
            </div>

            <div className="pt-2 border-t border-[var(--border)] flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedPodLogs(null)}
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
