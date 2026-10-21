import React, { useState } from 'react';
import {
  Bot,
  AlertTriangle,
  CheckCircle2,
  Play,
  Pause,
  Shield,
  Activity,
  DollarSign,
  ChevronDown,
  ChevronUp,
  FileCode,
  ArrowRight,
  ShieldAlert,
  Server,
  Terminal,
  HelpCircle,
  Eye,
} from 'lucide-react';
import {
  initialAgentLanes,
  initialAgentProposals,
  initialFindings,
} from '../../data/manageData';
import { AgentLane, AgentProposal, FindingItem } from '../../types/manage';

interface AgentsViewProps {
  lang: 'nl' | 'en';
  onShowToast: (msg: string) => void;
}

export const AgentsView: React.FC<AgentsViewProps> = ({ lang, onShowToast }) => {
  const isNl = lang === 'nl';
  const [lanes, setLanes] = useState<AgentLane[]>(initialAgentLanes);
  const [proposals, setProposals] = useState<AgentProposal[]>(initialAgentProposals);
  const [findings] = useState<FindingItem[]>(initialFindings);
  const [expandedProposalId, setExpandedProposalId] = useState<string | null>('cluster-prop-104');
  const [selectedControlGroup, setSelectedControlGroup] = useState<string>('alle');

  // Toggle kill switch (rem)
  const handleToggleKillSwitch = (agentId: string) => {
    setLanes((prev) =>
      prev.map((lane) => {
        if (lane.id === agentId) {
          const nextState = !lane.isKillSwitchEngaged;
          onShowToast(
            nextState
              ? `Noodrem ingeschakeld voor ${lane.name}. Modelaanroepen gepauzeerd.`
              : `Noodrem uitgeschakeld voor ${lane.name}. Agent hervat toezicht.`
          );
          return {
            ...lane,
            isKillSwitchEngaged: nextState,
            status: nextState ? 'paused' : 'healthy',
          };
        }
        return lane;
      })
    );
  };

  // Approve proposal (dispatched to fesafoto-ops-applier)
  const handleApproveProposal = (proposal: AgentProposal) => {
    setProposals((prev) =>
      prev.map((p) => (p.id === proposal.id ? { ...p, status: 'approved' } : p))
    );
    onShowToast(
      isNl
        ? `Voorstel "${proposal.title.slice(0, 36)}..." goedgekeurd. Doorgegeven aan fesafoto-ops-applier.`
        : `Proposal approved. Handed over to fesafoto-ops-applier CronJob.`
    );

    setTimeout(() => {
      setProposals((prev) =>
        prev.map((p) => (p.id === proposal.id ? { ...p, status: 'applied' } : p))
      );
      onShowToast(
        isNl
          ? `Patch voorstel ${proposal.id} succesvol toegepast en rooktest geslaagd!`
          : `Patch for ${proposal.id} successfully applied and smoke test passed!`
      );
    }, 1800);
  };

  // Reject proposal
  const handleRejectProposal = (proposal: AgentProposal) => {
    setProposals((prev) =>
      prev.map((p) => (p.id === proposal.id ? { ...p, status: 'rejected' } : p))
    );
    onShowToast(
      isNl
        ? `Voorstel ${proposal.id} afgewezen en gearchiveerd in auditlog.`
        : `Proposal ${proposal.id} rejected and archived in audit log.`
    );
  };

  const filteredFindings =
    selectedControlGroup === 'alle'
      ? findings
      : findings.filter((f) => f.group === selectedControlGroup);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="pb-4 border-b border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent)]" />
            <h2 className="font-display font-extrabold text-2xl text-[var(--ink)] tracking-tight">
              {isNl ? 'Agent-lanen & Autonomie' : 'Agent Lanes & Autonomy'}
            </h2>
          </div>
          <p className="text-xs text-[var(--ink-soft)] mt-0.5">
            {isNl
              ? '5 modelgestuurde diensten plus 1 deterministische waker. Elk met eigen rem, dagbudget, en menselijke goedkeuring voor patches.'
              : '5 model-governed agents plus 1 deterministic watcher. Each with kill switch, daily budget, and human-in-the-loop gating.'}
          </p>
        </div>

        {/* Autonomy Register Badge */}
        <div className="p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-xs font-mono-code flex items-center gap-2.5 shadow-2xs self-start sm:self-auto">
          <Shield size={16} className="text-[var(--accent)]" />
          <div>
            <div className="text-[10px] text-[var(--ink-soft)] uppercase font-bold">Autonomie Register</div>
            <div className="font-bold text-[var(--ink)]">agent-autonomy.json: Human Gated</div>
          </div>
        </div>
      </div>

      {/* 1. OpenRouter Credit Watch & Burn Rate Banner */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-[var(--paper)] text-[var(--accent)] border border-[var(--border)]">
              <DollarSign size={22} strokeWidth={1.5} />
            </div>
            <div>
              <div className="text-xs font-mono-code font-bold uppercase tracking-wider text-[var(--ink-soft)]">
                {isNl ? 'OpenRouter Modelaanroepen Saldo (fesafoto-openrouter-credit)' : 'OpenRouter Credit Watch'}
              </div>
              <div className="font-display font-bold text-lg text-[var(--ink)] mt-0.5">
                $31.40 {isNl ? 'resterend van $40.00 maandlimiet' : 'remaining of $40.00 monthly cap'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono-code">
            <div className="p-2.5 rounded-xl bg-[var(--paper)] border border-[var(--border)]">
              <div className="text-[10px] text-[var(--ink-soft)] uppercase">Verbruik Vandaag</div>
              <div className="font-bold text-[var(--ink)] mt-0.5">$0.87 (221 calls)</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[var(--paper)] border border-[var(--border)]">
              <div className="text-[10px] text-[var(--ink-soft)] uppercase">Dagelijkse Burn-rate</div>
              <div className="font-bold text-[var(--ink)] mt-0.5">~$1.14 / dag</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[var(--paper)] border border-[var(--border)]">
              <div className="text-[10px] text-[var(--ink-soft)] uppercase">80% Drempelwaarde</div>
              <div className="font-bold text-[var(--success)] mt-0.5">Veilig (21.5%)</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[var(--paper)] border border-[var(--border)]">
              <div className="text-[10px] text-[var(--ink-soft)] uppercase">Primaire Modellen</div>
              <div className="font-bold text-[var(--ink)] mt-0.5">Claude 3.5 / Gemini 2.0</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. De Zes Agent-Lanen Kaarten */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono-code font-bold uppercase tracking-wider text-[var(--ink-soft)]">
          {isNl ? 'De agent-lanen (status, rem & verbruik)' : 'Agent lanes (status, kill switch & usage)'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lanes.map((lane) => {
            const hasCeiling = lane.dailyCallsCeiling > 0;
            const usagePercent = hasCeiling
              ? Math.round((lane.dailyCallsUsed / lane.dailyCallsCeiling) * 100)
              : 0;

            return (
              <div
                key={lane.id}
                className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-[var(--paper)] text-[var(--accent)] border border-[var(--border)]">
                        <Bot size={16} strokeWidth={1.5} />
                      </div>
                      <div>
                        <div className="font-mono-code font-bold text-xs text-[var(--ink)] truncate max-w-[170px]">
                          {lane.name}
                        </div>
                        <div className="text-[10px] font-mono-code text-[var(--ink-soft)]">
                          ns: {lane.namespace} {lane.port ? `:${lane.port}` : ''}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono-code font-bold ${
                        lane.isKillSwitchEngaged
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : lane.status === 'warning'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-emerald-50 text-[var(--success)] border border-emerald-200'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          lane.isKillSwitchEngaged
                            ? 'bg-amber-600'
                            : lane.status === 'warning'
                            ? 'bg-amber-500'
                            : 'bg-[var(--success)]'
                        }`}
                      />
                      <span>
                        {lane.isKillSwitchEngaged
                          ? isNl ? 'Rem actief' : 'Paused'
                          : lane.status === 'warning'
                          ? isNl ? 'Aandacht' : 'Warning'
                          : isNl ? 'Actief' : 'Healthy'}
                      </span>
                    </span>
                  </div>

                  <p className="text-xs text-[var(--ink-soft)] leading-snug">
                    {lane.roleDescription}
                  </p>
                </div>

                {/* Probe details (Honest empty state for pidurable & guest agent) */}
                <div className="space-y-2 pt-2 border-t border-[var(--border)] text-xs font-mono-code">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[var(--ink-soft)]">
                      {isNl ? 'Laatste ronde:' : 'Last sweep:'}
                    </span>
                    <span className="text-[var(--ink)] font-semibold">
                      {lane.probeType === 'timestamp' && lane.lastCycleTime
                        ? lane.lastCycleTime
                        : lane.probeType === 'reachability_only'
                        ? isNl ? 'Bereikbaar (geen tijdstempel)' : 'Reachable (no timestamp)'
                        : isNl ? 'Deterministisch' : 'Deterministic'}
                    </span>
                  </div>

                  {hasCeiling ? (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[var(--ink-soft)]">
                          {isNl ? 'Aanroepen vandaag:' : 'Calls today:'}
                        </span>
                        <span className="text-[var(--ink)] font-bold">
                          {lane.dailyCallsUsed} / {lane.dailyCallsCeiling}
                        </span>
                      </div>
                      <div className="w-full bg-[var(--paper)] h-1.5 rounded-full overflow-hidden border border-[var(--border)]">
                        <div
                          className={`h-full rounded-full ${
                            usagePercent > 80
                              ? 'bg-[var(--warning)]'
                              : 'bg-[var(--accent)]'
                          }`}
                          style={{ width: `${Math.min(usagePercent, 100)}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="text-[11px] text-[var(--ink-soft)] italic">
                      {isNl
                        ? 'Geen modelaanroepen of budget (restarts only).'
                        : 'No model calls or budget needed.'}
                    </div>
                  )}

                  {/* Kill Switch Toggle Button (for model-governed lanes) */}
                  {lane.probeType !== 'deterministic' && (
                    <div className="pt-2 flex items-center justify-between">
                      <div className="text-[10px] text-[var(--ink-soft)]">
                        {lane.modelCostTodayUsd ? `$${lane.modelCostTodayUsd.toFixed(2)} / dag` : ''}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleKillSwitch(lane.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-sans font-medium transition-colors ${
                          lane.isKillSwitchEngaged
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                            : 'bg-[var(--paper)] text-[var(--ink)] border border-[var(--border)] hover:bg-amber-100 hover:text-amber-900'
                        }`}
                      >
                        {lane.isKillSwitchEngaged ? (
                          <>
                            <Play size={11} />
                            <span>{isNl ? 'Hervatten' : 'Resume'}</span>
                          </>
                        ) : (
                          <>
                            <Pause size={11} />
                            <span>{isNl ? 'Rem omzetten' : 'Pause agent'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Open Voorstellen met Patch, Terugrolpad & Rooktest (Deel E.5) */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[var(--border)] gap-2">
          <div>
            <h3 className="font-display font-bold text-base text-[var(--ink)]">
              {isNl ? 'Open voorstellen van agents' : 'Open proposals from agents'}
            </h3>
            <p className="text-xs text-[var(--ink-soft)]">
              {isNl
                ? 'Agents stellen voor, de beheerder keurt goed, en fesafoto-ops-applier voert uit met terugrolpad.'
                : 'Agents propose, the operator approves, and fesafoto-ops-applier executes with rollback guarantees.'}
            </p>
          </div>

          <span className="text-xs font-mono-code text-[var(--ink-soft)]">
            {proposals.filter((p) => p.status === 'open').length} {isNl ? 'wachten op goedkeuring' : 'awaiting approval'}
          </span>
        </div>

        <div className="space-y-3">
          {proposals.map((prop) => {
            const isExpanded = expandedProposalId === prop.id;
            const isApplied = prop.status === 'applied';
            const isApproved = prop.status === 'approved';
            const isRejected = prop.status === 'rejected';

            return (
              <div
                key={prop.id}
                className="border border-[var(--border)] rounded-xl overflow-hidden bg-[var(--paper)]/50 transition-all"
              >
                {/* Header row */}
                <div
                  className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer bg-[var(--surface)] hover:bg-[var(--paper)] transition-colors"
                  onClick={() => setExpandedProposalId(isExpanded ? null : prop.id)}
                >
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono-code font-bold uppercase bg-[var(--paper)] border border-[var(--border)]">
                        {prop.category}
                      </span>
                      <span className="text-xs font-mono-code text-[var(--ink-soft)]">
                        ID: {prop.id}
                      </span>
                      <span className="text-xs font-mono-code text-[var(--accent)] font-semibold">
                        van {prop.agentId}
                      </span>
                    </div>

                    <h4 className="font-display font-bold text-sm text-[var(--ink)]">
                      {prop.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono-code font-bold ${
                        isApplied
                          ? 'bg-emerald-100 text-[var(--success)] border border-emerald-300'
                          : isApproved
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : isRejected
                          ? 'bg-red-100 text-[var(--danger)] border border-red-300'
                          : 'bg-amber-100 text-amber-900 border border-amber-300'
                      }`}
                    >
                      {prop.status}
                    </span>

                    <button
                      type="button"
                      className="p-1 text-[var(--ink-soft)] hover:text-[var(--ink)]"
                    >
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details: Patch, Evidence, Rollback, Smoke Test */}
                {isExpanded && (
                  <div className="p-4 sm:p-5 border-t border-[var(--border)] bg-[var(--paper)] space-y-4 text-xs font-mono-code animate-in fade-in duration-150">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-[var(--ink-soft)] mb-1">
                        {isNl ? 'Onderbouwing & Bewijs (Evidence)' : 'Evidence & Rationale'}
                      </div>
                      <p className="font-sans text-xs text-[var(--ink)] leading-relaxed bg-[var(--surface)] p-3 rounded-lg border border-[var(--border)]">
                        {prop.evidence}
                      </p>
                    </div>

                    {/* YAML Patch */}
                    <div>
                      <div className="text-[10px] uppercase font-bold text-[var(--ink-soft)] mb-1 flex items-center justify-between">
                        <span>{isNl ? 'Voorgestelde Patch (YAML)' : 'Proposed Patch (YAML)'}</span>
                        <span className="text-[var(--ink-soft)]">{prop.target}</span>
                      </div>
                      <pre className="p-3 rounded-lg bg-[var(--ink)] text-emerald-300 text-[11px] overflow-x-auto border border-neutral-800">
                        <code>{prop.patchYaml}</code>
                      </pre>
                    </div>

                    {/* Rollback & Smoke test grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
                        <div className="text-[10px] uppercase font-bold text-[var(--danger)] mb-0.5">
                          {isNl ? 'Terugrolpad (Rollback Path)' : 'Rollback Path'}
                        </div>
                        <div className="text-[11px] text-[var(--ink)] font-mono-code break-all">
                          {prop.rollbackPath}
                        </div>
                      </div>

                      <div className="p-3 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
                        <div className="text-[10px] uppercase font-bold text-[var(--success)] mb-0.5">
                          {isNl ? 'Rooktest (Smoke Test)' : 'Smoke Test'}
                        </div>
                        <div className="text-[11px] text-[var(--ink)] font-mono-code break-all">
                          {prop.smokeTest}
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    {prop.status === 'open' && (
                      <div className="pt-2 flex flex-wrap items-center justify-end gap-2 font-sans">
                        <button
                          type="button"
                          onClick={() => handleRejectProposal(prop)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--surface)] border border-[var(--border)] text-[var(--danger)] hover:bg-red-50 transition-colors"
                        >
                          {isNl ? 'Afwijzen' : 'Reject'}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleApproveProposal(prop)}
                          className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-[var(--ink)] text-white hover:bg-[var(--accent)] transition-colors shadow-2xs"
                        >
                          {isNl ? 'Goedkeuren & Toepassen via applier' : 'Approve & Apply via applier'}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Beveiligingsbevindingen over Tien Controlegroepen */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[var(--border)] gap-2">
          <div>
            <h3 className="font-display font-bold text-base text-[var(--ink)]">
              {isNl ? 'Bevindingen over 10 controlegroepen (fesafoto-security-agent)' : 'Security findings across 10 control groups'}
            </h3>
            <p className="text-xs text-[var(--ink-soft)]">
              {isNl
                ? 'Geautomatiseerd getoetst: auth, authz, headers, tls, secrets, cluster, images, network, audit en surface.'
                : 'Audited continuously: auth, authz, headers, tls, secrets, cluster, images, network, audit and surface.'}
            </p>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap text-xs font-mono-code">
            {['alle', 'tls', 'cluster', 'auth', 'surface'].map((group) => (
              <button
                key={group}
                type="button"
                onClick={() => setSelectedControlGroup(group)}
                className={`px-2.5 py-1 rounded-md text-[11px] transition-colors ${
                  selectedControlGroup === group
                    ? 'bg-[var(--ink)] text-white font-bold'
                    : 'bg-[var(--paper)] text-[var(--ink-soft)] border border-[var(--border)] hover:border-[var(--ink)]'
                }`}
              >
                {group}
              </button>
            ))}
          </div>
        </div>

        {/* Findings table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono-code border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] text-[var(--ink-soft)] uppercase text-[10px]">
                <th className="py-2 px-3">{isNl ? 'Ernst' : 'Severity'}</th>
                <th className="py-2 px-3">{isNl ? 'Controlegroep' : 'Control group'}</th>
                <th className="py-2 px-3">{isNl ? 'Bevinding' : 'Finding'}</th>
                <th className="py-2 px-3">{isNl ? 'Doel' : 'Target'}</th>
                <th className="py-2 px-3">{isNl ? 'Ouderdom' : 'Age'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filteredFindings.map((find) => (
                <tr key={find.id} className="hover:bg-[var(--paper)] transition-colors">
                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        find.severity === 'hoog' || find.severity === 'kritiek'
                          ? 'bg-red-50 text-[var(--danger)] border border-red-200'
                          : find.severity === 'medium'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-emerald-50 text-[var(--success)] border border-emerald-200'
                      }`}
                    >
                      {find.severity}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded bg-[var(--paper)] border border-[var(--border)] text-[10px]">
                      {find.group}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-sans font-medium text-[var(--ink)]">
                    {find.title}
                    <div className="text-[11px] text-[var(--ink-soft)] font-sans mt-0.5">
                      {find.description}
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-[var(--ink-soft)]">{find.target}</td>
                  <td className="py-2.5 px-3 text-[var(--ink-soft)]">{find.ageHours}u geleden</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
