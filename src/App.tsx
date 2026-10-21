import React, { useState } from 'react';
import { NavPage, TenantParty, Order, QueueJob, StuckUpload, PlanConfig } from './types/manage';
import {
  initialTenants,
  initialOrders,
  initialPlans,
  initialQueueJobs,
  initialStuckUpload,
  operatorAccount,
} from './data/manageData';
import { Sidebar } from './components/manage/Sidebar';
import { TopHeader } from './components/manage/TopHeader';
import { DashboardView } from './components/manage/DashboardView';
import { TenantsView } from './components/manage/TenantsView';
import { OrdersView } from './components/manage/OrdersView';
import { PlansView } from './components/manage/PlansView';
import { QueuesView } from './components/manage/QueuesView';
import { ModerationView } from './components/manage/ModerationView';
import { ClusterView } from './components/manage/ClusterView';
import { AnalyticsView } from './components/manage/AnalyticsView';
import { AssistantView } from './components/manage/AssistantView';
import { AccountView } from './components/manage/AccountView';
import { GenericSectionView } from './components/manage/GenericSectionView';
import { TypedConfirmModal } from './components/manage/TypedConfirmModal';
import { ManageInventory } from './components/manage/ManageInventory';
import { Search, X, Check, ExternalLink } from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<'nl' | 'en'>('nl');
  const [currentPage, setCurrentPage] = useState<NavPage>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Core Data States
  const [tenants, setTenants] = useState<TenantParty[]>(initialTenants);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [plans, setPlans] = useState<PlanConfig[]>(initialPlans);
  const [jobs, setJobs] = useState<QueueJob[]>(initialQueueJobs);
  const [stuckUpload, setStuckUpload] = useState<StuckUpload | null>(initialStuckUpload);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Quick Search state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickQuery, setQuickQuery] = useState('');

  // Typed Confirmation Dialog state
  const [typedConfirm, setTypedConfirm] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    confirmWord: string;
    action: () => void;
  } | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Requeue a job
  const handleRequeueJob = (jobId: string) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, state: 'running' } : j))
    );
    showToast(`Job ${jobId} herstart op worker node-ams-02.`);

    setTimeout(() => {
      setJobs((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, state: 'done' } : j))
      );
      showToast(`Job ${jobId} succesvol voltooid!`);
    }, 1800);
  };

  // Requeue stuck upload
  const handleRequeueStuck = () => {
    showToast('Vastgelopen upload herstart. ffmpeg herstart op schone memory buffer.');
    setTimeout(() => {
      setStuckUpload(null);
      showToast('Upload VID_20261020_003.mp4 verwerkt en toegevoegd aan album Mientjes 65.');
    }, 1200);
  };

  // Request discard stuck upload (guarded by typed confirmation)
  const handleRequestDiscardStuck = (stuck: StuckUpload) => {
    setTypedConfirm({
      isOpen: true,
      title: `Verwerp vastgelopen upload ${stuck.filename}`,
      description: `Weet je zeker dat je ${stuck.filename} (${stuck.filesize}) van ${stuck.tenantName} wilt weggooien? Dit kan niet ongedaan worden gemaakt.`,
      confirmWord: 'DISCARD',
      action: () => {
        setStuckUpload(null);
        setTypedConfirm(null);
        showToast(`Bestand ${stuck.filename} verworpen en verwijderd uit staging.`);
      },
    });
  };

  // Request order refund (guarded by typed confirmation)
  const handleRequestRefund = (order: Order) => {
    setTypedConfirm({
      isOpen: true,
      title: `Terugstorting uitvoeren voor ${order.partyName}`,
      description: `Weet je zeker dat je EUR ${order.amountEur.toFixed(2)} voor order ${order.id} (Mollie ref ${order.providerRef}) wilt terugstorten naar de klant?`,
      confirmWord: 'REFUND',
      action: () => {
        setOrders((prev) =>
          prev.map((o) => (o.id === order.id ? { ...o, status: 'refunded' } : o))
        );
        setTypedConfirm(null);
        showToast(`Terugstorting van EUR ${order.amountEur.toFixed(2)} verwerkt via Mollie.`);
      },
    });
  };

  // Destructive actions on Account view
  const handleDestructiveAction = (actionName: string, confirmWord: string) => {
    setTypedConfirm({
      isOpen: true,
      title: actionName,
      description: `Weet je zeker dat je de actie "${actionName}" wilt uitvoeren op het productiecluster?`,
      confirmWord,
      action: () => {
        setTypedConfirm(null);
        showToast(`Actie "${actionName}" succesvol uitgevoerd op het cluster.`);
      },
    });
  };

  // Update tenant plan
  const handleUpdateTenantPlan = (tenantId: string, newPlan: 'free' | 'event' | 'event_plus') => {
    setTenants((prev) =>
      prev.map((t) => (t.id === tenantId ? { ...t, plan: newPlan } : t))
    );
    showToast(`Pakket voor tenant #${tenantId} aangepast naar ${newPlan}.`);
  };

  // Save Plan configuration
  const handleSavePlan = (updatedPlan: PlanConfig) => {
    setPlans((prev) =>
      prev.map((p) => (p.id === updatedPlan.id ? updatedPlan : p))
    );
    showToast(`Pakket ${updatedPlan.name} bijgewerkt: EUR ${updatedPlan.price}, ${updatedPlan.videoClips} clips, ${updatedPlan.retentionMonths} mnd.`);
  };

  // Impersonate view
  const handleImpersonate = (tenant: TenantParty) => {
    showToast(`Veilige host-view geopend voor ${tenant.name} (${tenant.subdomain}).`);
  };

  // Render current view
  const renderView = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <DashboardView
            onNavigate={setCurrentPage}
            lang={lang}
            onRequeueJob={handleRequeueJob}
            onOpenStuckModal={() => setCurrentPage('vastgelopen_uploads')}
          />
        );
      case 'tenants':
        return (
          <TenantsView
            tenants={tenants}
            lang={lang}
            onImpersonate={handleImpersonate}
            onUpdatePlan={handleUpdateTenantPlan}
          />
        );
      case 'bestellingen':
        return (
          <OrdersView
            orders={orders}
            lang={lang}
            onRequestRefund={handleRequestRefund}
          />
        );
      case 'plannen':
        return (
          <PlansView
            plans={plans}
            lang={lang}
            onSavePlan={handleSavePlan}
          />
        );
      case 'wachtrijtaken':
      case 'vastgelopen_uploads':
      case 'pijplijn':
        return (
          <QueuesView
            jobs={jobs}
            stuckUpload={stuckUpload}
            lang={lang}
            onRequeueJob={handleRequeueJob}
            onRequestDiscardStuck={handleRequestDiscardStuck}
            onRequeueStuck={handleRequeueStuck}
          />
        );
      case 'moderatie':
        return <ModerationView lang={lang} />;
      case 'cluster':
      case 'beveiliging':
      case 'sessies':
      case 'domeinen':
      case 'identiteit':
        return <ClusterView lang={lang} />;
      case 'analytics':
        return <AnalyticsView lang={lang} />;
      case 'assistent':
        return <AssistantView lang={lang} />;
      case 'account':
        return (
          <AccountView
            lang={lang}
            onLanguageChange={setLang}
            onRequestDestructiveAction={handleDestructiveAction}
          />
        );
      default:
        return <GenericSectionView page={currentPage} lang={lang} />;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)] font-body paper-pattern flex">
      {/* Grouped Sidebar (Fixed on Desktop, Off-canvas Drawer on Mobile) */}
      <Sidebar
        currentPage={currentPage}
        onSelectPage={setCurrentPage}
        lang={lang}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Back-Office Work Area */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        {/* Sticky Top Header */}
        <TopHeader
          currentPage={currentPage}
          lang={lang}
          onLanguageChange={setLang}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onQuickSearch={() => setIsSearchOpen(true)}
        />

        {/* Dynamic Page Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-safe">
          {renderView()}

          {/* Component Inventory Documentation for Developers */}
          <ManageInventory lang={lang} />
        </main>
      </div>

      {/* Reusable Typed Confirmation Dialog */}
      {typedConfirm && (
        <TypedConfirmModal
          isOpen={typedConfirm.isOpen}
          title={typedConfirm.title}
          description={typedConfirm.description}
          confirmWord={typedConfirm.confirmWord}
          onConfirm={typedConfirm.action}
          onCancel={() => setTypedConfirm(null)}
        />
      )}

      {/* Quick Search Modal */}
      {isSearchOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-[var(--surface)] border border-[var(--border)] rounded-3xl shadow-2xl overflow-hidden text-[var(--ink)]"
          >
            <div className="p-4 border-b border-[var(--border)] flex items-center gap-3">
              <Search size={18} className="text-[var(--ink-soft)]" />
              <input
                type="text"
                autoFocus
                value={quickQuery}
                onChange={(e) => setQuickQuery(e.target.value)}
                placeholder="Zoek tenants, orders, jobs of logregels..."
                className="flex-1 text-sm bg-transparent outline-none font-medium"
              />
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="text-xs text-[var(--ink-soft)] hover:text-[var(--ink)]"
              >
                ESC
              </button>
            </div>

            <div className="p-3 max-h-72 overflow-y-auto space-y-1 text-xs">
              <div className="text-[10px] font-mono-code font-bold uppercase text-[var(--ink-soft)] px-3 py-1">
                Snelle koppelingen
              </div>
              <button
                type="button"
                onClick={() => {
                  setCurrentPage('tenants');
                  setIsSearchOpen(false);
                }}
                className="w-full text-left p-2.5 rounded-xl hover:bg-[var(--paper)] flex items-center justify-between"
              >
                <div className="font-semibold">Sanjay & Dewie (sanjayendewie)</div>
                <span className="font-mono-code text-[11px] text-[var(--accent)] font-bold">Event+</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setCurrentPage('bestellingen');
                  setIsSearchOpen(false);
                }}
                className="w-full text-left p-2.5 rounded-xl hover:bg-[var(--paper)] flex items-center justify-between"
              >
                <div className="font-semibold">Order ord-10492 (EUR 69,00)</div>
                <span className="font-mono-code text-[11px] text-[var(--success)]">Voltooid</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setCurrentPage('wachtrijtaken');
                  setIsSearchOpen(false);
                }}
                className="w-full text-left p-2.5 rounded-xl hover:bg-[var(--paper)] flex items-center justify-between"
              >
                <div className="font-semibold">Vastgelopen upload VID_20261020_003.mp4</div>
                <span className="font-mono-code text-[11px] text-[var(--danger)]">Actie vereist</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[var(--ink)] text-[var(--paper)] px-4 py-3 rounded-2xl shadow-xl border border-white/10 text-xs font-mono-code flex items-center gap-2.5 animate-in slide-in-from-bottom duration-200">
          <Check size={14} className="text-[var(--accent-soft)]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
