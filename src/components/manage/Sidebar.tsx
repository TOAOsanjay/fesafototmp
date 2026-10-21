import React from 'react';
import { NavPage } from '../../types/manage';
import { navSections, operatorAccount } from '../../data/manageData';
import {
  LayoutDashboard,
  Activity,
  ScrollText,
  Users,
  Camera,
  MapPin,
  ListTodo,
  AlertTriangle,
  ShieldCheck,
  Mail,
  Globe,
  Fingerprint,
  CreditCard,
  Ticket,
  MailCheck,
  Bot,
  Server,
  Lock,
  Smartphone,
  GitBranch,
  MessageSquare,
  BarChart3,
  Sliders,
  Settings,
  User,
  X,
} from 'lucide-react';

interface SidebarProps {
  currentPage: NavPage;
  onSelectPage: (page: NavPage) => void;
  lang: 'nl' | 'en';
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onSelectPage,
  lang,
  isOpenMobile,
  onCloseMobile,
}) => {
  const isNl = lang === 'nl';

  const getIcon = (id: NavPage) => {
    switch (id) {
      case 'dashboard':
        return <LayoutDashboard size={16} strokeWidth={1.5} />;
      case 'status':
        return <Activity size={16} strokeWidth={1.5} />;
      case 'audit':
        return <ScrollText size={16} strokeWidth={1.5} />;
      case 'tenants':
        return <Users size={16} strokeWidth={1.5} />;
      case 'fotografen':
        return <Camera size={16} strokeWidth={1.5} />;
      case 'locatie':
        return <MapPin size={16} strokeWidth={1.5} />;
      case 'wachtrijtaken':
        return <ListTodo size={16} strokeWidth={1.5} />;
      case 'vastgelopen_uploads':
        return <AlertTriangle size={16} strokeWidth={1.5} />;
      case 'moderatie':
        return <ShieldCheck size={16} strokeWidth={1.5} />;
      case 'emailwachtrij':
        return <Mail size={16} strokeWidth={1.5} />;
      case 'domeinen':
        return <Globe size={16} strokeWidth={1.5} />;
      case 'identiteit':
        return <Fingerprint size={16} strokeWidth={1.5} />;
      case 'bestellingen':
        return <CreditCard size={16} strokeWidth={1.5} />;
      case 'kortingscodes':
        return <Ticket size={16} strokeWidth={1.5} />;
      case 'email':
        return <MailCheck size={16} strokeWidth={1.5} />;
      case 'agents':
        return <Bot size={16} strokeWidth={1.5} />;
      case 'cluster':
        return <Server size={16} strokeWidth={1.5} />;
      case 'beveiliging':
        return <Lock size={16} strokeWidth={1.5} />;
      case 'sessies':
        return <Smartphone size={16} strokeWidth={1.5} />;
      case 'pijplijn':
        return <GitBranch size={16} strokeWidth={1.5} />;
      case 'assistent':
        return <MessageSquare size={16} strokeWidth={1.5} />;
      case 'analytics':
        return <BarChart3 size={16} strokeWidth={1.5} />;
      case 'plannen':
        return <Sliders size={16} strokeWidth={1.5} />;
      case 'instellingen':
        return <Settings size={16} strokeWidth={1.5} />;
      case 'account':
        return <User size={16} strokeWidth={1.5} />;
      default:
        return <Activity size={16} strokeWidth={1.5} />;
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[var(--paper)] border-r border-[var(--border)] text-[var(--ink)]">
      {/* Brand Header */}
      <div className="h-16 px-5 border-b border-[var(--border)] flex items-center justify-between shrink-0">
        <a
          href="#dashboard"
          onClick={(e) => {
            e.preventDefault();
            onSelectPage('dashboard');
            onCloseMobile();
          }}
          className="flex items-center gap-2.5 group"
        >
          {/* FF Monogram with confetti dot at x-height */}
          <div className="relative w-8 h-8 rounded-lg bg-[var(--ink)] text-[var(--paper)] flex items-center justify-center font-display font-bold text-sm tracking-tighter shadow-2xs">
            <span>FF</span>
            <span
              className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[var(--accent)] border-2 border-[var(--paper)] shadow-2xs"
              aria-hidden="true"
            />
          </div>

          <div className="flex flex-col">
            <span className="font-display font-bold text-lg text-[var(--ink)] tracking-tight leading-none">
              fesafotos<span className="text-[var(--accent)]">.</span>
            </span>
            <span className="text-[10px] font-mono-code text-[var(--ink-soft)] tracking-wider uppercase mt-0.5">
              manage back-office
            </span>
          </div>
        </a>

        {/* Mobile close button */}
        <button
          type="button"
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 rounded-lg text-[var(--ink-soft)] hover:bg-[var(--border)]"
          aria-label="Sluit menu"
        >
          <X size={18} strokeWidth={1.5} />
        </button>
      </div>

      {/* Navigation Groups List */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6 text-xs" aria-label="Beheer navigatie">
        {navSections.map((section) => (
          <div key={section.group} className="space-y-1">
            <div className="px-3 text-[10px] font-mono-code font-bold uppercase tracking-wider text-[var(--ink-soft)]/80 mb-1.5">
              {section.group}
            </div>

            {section.items.map((item) => {
              const isActive = currentPage === item.id;
              const label = isNl ? item.labelNl : item.labelEn;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectPage(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-[var(--ink)] text-[var(--paper)] font-semibold shadow-2xs'
                      : 'text-[var(--ink-soft)] hover:text-[var(--ink)] hover:bg-[var(--paper-2)]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className={isActive ? 'text-[var(--accent-soft)]' : 'text-[var(--ink-soft)]'}>
                      {getIcon(item.id)}
                    </span>
                    <span className="truncate">{label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-mono-code px-1.5 py-0.5 rounded-md font-semibold ${
                        item.badgeType === 'danger'
                          ? 'bg-red-100 text-[var(--danger)] border border-red-200'
                          : item.badgeType === 'warning'
                          ? 'bg-amber-100 text-[var(--warning)] border border-amber-200'
                          : isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-[var(--paper-2)] text-[var(--ink-soft)] border border-[var(--border)]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Operator Account Footer */}
      <div className="p-3 border-t border-[var(--border)] bg-[var(--paper-2)] shrink-0">
        <button
          type="button"
          onClick={() => {
            onSelectPage('account');
            onCloseMobile();
          }}
          className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-[var(--paper)] transition-colors text-left"
        >
          <div className="w-8 h-8 rounded-full bg-[var(--accent)] text-white font-display font-bold text-xs flex items-center justify-center shrink-0">
            SM
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-[var(--ink)] truncate">
              {operatorAccount.name}
            </div>
            <div className="text-[10px] font-mono-code text-[var(--ink-soft)] truncate">
              {operatorAccount.email} · {operatorAccount.role}
            </div>
          </div>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:block w-64 h-screen sticky top-0 shrink-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Off-canvas Drawer */}
      {isOpenMobile && (
        <div
          role="dialog"
          aria-modal="true"
          className="lg:hidden fixed inset-0 z-50 flex"
          onClick={onCloseMobile}
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" />
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10"
          >
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
