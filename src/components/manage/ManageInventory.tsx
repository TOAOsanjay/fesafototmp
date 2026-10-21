import React, { useState } from 'react';

interface ManageInventoryProps {
  lang: 'nl' | 'en';
}

export const ManageInventory: React.FC<ManageInventoryProps> = ({ lang }) => {
  const isNl = lang === 'nl';
  const [isOpen, setIsOpen] = useState(false);

  const inventory = [
    {
      name: 'Sidebar',
      purpose: 'Fixed grouped desktop navigation and mobile off-canvas drawer with 9 official operational groups and badged indicators.',
      states: 'Default, active page highlight, badge variants (warning/danger), mobile drawer open/close.',
    },
    {
      name: 'TopHeader',
      purpose: 'Sticky header with dynamic breadcrumbs, live fleet status pill, quick search trigger, language switch, and operator account chip.',
      states: 'Desktop breadcrumbs, mobile hamburger toggle, quick search trigger, language active.',
    },
    {
      name: 'DashboardView',
      purpose: 'Top health strip (cluster, pods, API, mail, analytics), 6 tabular number cards, calm 30-day SVG trendline with range selector, and needs attention list.',
      states: 'Range selector (7d/14d/30d), single-click job requeue, direct action triggers, audit log feed.',
    },
    {
      name: 'TenantsView',
      purpose: 'Party directory table on desktop and card feed on mobile with search, plan filters, health status, and full detail drawer.',
      states: 'Search query filtering, plan filtering, health filtering, tenant detail drawer open with moderation list and host-view launch.',
    },
    {
      name: 'OrdersView',
      purpose: 'Financial transaction ledger with Mollie provider references, status pills, tabular euro currency formatting, and guarded refund action.',
      states: 'Filter by completed/pending/refunded, initiate typed refund confirmation modal.',
    },
    {
      name: 'PlansView',
      purpose: 'Editable pricing and quota matrix (free, Event, Event+) with live number inputs for clips, duration, retention, and live audit registration.',
      states: 'Inline value modification, save with audit feedback toast, add-on quota breakdown.',
    },
    {
      name: 'QueuesView',
      purpose: 'Background task manager with stuck upload card (requeue/discard) and unified monospace log viewer with live follow toggle and copy button.',
      states: 'Job state pills (queued/running/done/failed), live log follow toggle (on/off), text filter search, copy to clipboard.',
    },
    {
      name: 'ModerationView',
      purpose: 'Content moderation review queue with thumbnail preview, reporter count, deadline countdown, and keyboard shortcuts ([A], [R], [E]).',
      states: 'Review queue list, approve/reject/escalate actions, keyboard listener, zero-state clean queue.',
    },
    {
      name: 'ClusterView',
      purpose: 'Fleet telemetry view with node CPU/RAM percentage bars, SSL wildcard expiry countdown, active operator sessions, and custom domain DNS status.',
      states: 'Healthy/degraded node state, SSL renewal countdown, current vs remote session chip, domain verification check.',
    },
    {
      name: 'AnalyticsView',
      purpose: 'Platform traffic and conversion numbers with time range picker and honest service-down state simulation (never pretends zero).',
      states: 'Time range (7d/30d/90d), live metrics view, simulated collector outage banner.',
    },
    {
      name: 'AssistantView',
      purpose: 'Operator operational AI assistant with plain human answers, typing state naming the assistant, and isolated citation block.',
      states: 'Prompt submit, assistant thinking indicator, message feed with external sources.',
    },
    {
      name: 'AccountView',
      purpose: 'Operator profile settings for Sanjay Mankoe, language preference, emergency safe-mode toggle, and guarded destructive actions.',
      states: 'Safe-mode toggle, destructive triggers (FLUSH, RESET), sign-out confirmation.',
    },
    {
      name: 'TypedConfirmModal',
      purpose: 'Safety-first modal primitive requiring user to type a confirmation word (e.g. REFUND or DISCARD) before executing destructive operations.',
      states: 'Open/closed, input match validation, escape key listener, auto-focus.',
    },
  ];

  return (
    <footer className="mt-16 py-8 border-t border-[var(--border)] bg-[var(--paper)] text-xs text-[var(--ink-soft)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono-code font-bold text-[var(--accent)] uppercase">
              {isNl ? 'Componenten Inventaris' : 'Component Inventory'}
            </span>
            <span>·</span>
            <span>manage.fesafotos.nl</span>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--paper-2)] text-[var(--ink)] font-semibold transition-colors"
          >
            {isOpen
              ? (isNl ? 'Verberg inventaris ▲' : 'Hide inventory ▲')
              : (isNl ? 'Bekijk componenten inventaris ▼' : 'View component inventory ▼')}
          </button>
        </div>

        {isOpen && (
          <div className="mt-6 space-y-4 pt-4 border-t border-[var(--border)]">
            <p className="leading-relaxed">
              {isNl
                ? 'Dit beheerpaneel is ontworpen als een samenhangend operationeel gereedschap voor de operator van fesafotos.nl (Sanjay Mankoe). Hieronder staat het overzicht van alle componenten, hun doel en hun toestanden voor ontwikkelaars.'
                : 'This management console is designed as a cohesive operational tool for the fesafotos.nl operator (Sanjay Mankoe). Below is the technical specification of all components and their states.'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {inventory.map((comp) => (
                <div
                  key={comp.name}
                  className="p-3.5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-1.5 shadow-2xs"
                >
                  <div className="font-mono-code font-bold text-[var(--ink)] flex items-center justify-between">
                    <span>&lt;{comp.name} /&gt;</span>
                  </div>
                  <p className="text-[11px] text-[var(--ink)] leading-snug">
                    {comp.purpose}
                  </p>
                  <div className="text-[10px] font-mono-code text-[var(--accent)] pt-1 border-t border-[var(--border)]">
                    States: {comp.states}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </footer>
  );
};
