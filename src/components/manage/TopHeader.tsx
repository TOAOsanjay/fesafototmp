import React from 'react';
import { NavPage, OperatorRole } from '../../types/manage';
import { navSections, operatorAccount } from '../../data/manageData';
import { Menu, Search, CheckCircle2, Shield, Eye } from 'lucide-react';

interface TopHeaderProps {
  currentPage: NavPage;
  lang: 'nl' | 'en';
  onLanguageChange: (lang: 'nl' | 'en') => void;
  onOpenMobileMenu: () => void;
  onQuickSearch: () => void;
  activeRole?: OperatorRole;
  onRoleChange?: (role: OperatorRole) => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentPage,
  lang,
  onLanguageChange,
  onOpenMobileMenu,
  onQuickSearch,
  activeRole = 'admin',
  onRoleChange,
}) => {
  const isNl = lang === 'nl';

  // Find current group and item
  let currentGroup = 'Overzicht';
  let currentLabel = 'Dashboard';

  for (const s of navSections) {
    const item = s.items.find((i) => i.id === currentPage);
    if (item) {
      currentGroup = s.group;
      currentLabel = isNl ? item.labelNl : item.labelEn;
      break;
    }
  }

  return (
    <header className="sticky top-0 z-20 w-full bg-[var(--paper)]/95 backdrop-blur-md border-b border-[var(--border)]">
      {/* Top Banner if non-admin role */}
      {activeRole !== 'admin' && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-1 text-center text-xs font-mono-code text-amber-900 flex items-center justify-center gap-2">
          <Eye size={12} className="text-amber-700" />
          <span>
            {isNl
              ? `Ingelogd met rol: ${activeRole}. Mutaties zijn beperkt conform fesafoto-auth.`
              : `Active role scope: ${activeRole}. Mutations are restricted per fesafoto-auth.`}
          </span>
          {onRoleChange && (
            <button
              type="button"
              onClick={() => onRoleChange('admin')}
              className="underline font-bold hover:text-[var(--accent)] ml-1"
            >
              {isNl ? 'Terug naar admin' : 'Switch back to admin'}
            </button>
          )}
        </div>
      )}

      <div className="h-16 px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left: Mobile Menu Trigger & Breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-xl text-[var(--ink)] hover:bg-[var(--border)] transition-colors"
            aria-label="Open navigatiemenu"
          >
            <Menu size={18} strokeWidth={1.5} />
          </button>

          {/* Breadcrumb */}
          <nav className="flex items-center text-xs font-medium text-[var(--ink-soft)]" aria-label="Kruimelpad">
            <span className="font-display font-bold text-[var(--ink)]">fesafotos.</span>
            <span className="mx-2 text-[var(--border)]">/</span>
            <span className="hidden sm:inline">{currentGroup}</span>
            <span className="hidden sm:inline mx-2 text-[var(--border)]">/</span>
            <span className="text-[var(--ink)] font-semibold">{currentLabel}</span>
          </nav>
        </div>

        {/* Right: Quick Search, Cluster Health Status Pill, Role Chip, Language Toggle */}
        <div className="flex items-center gap-3">
          {/* Quick Search Bar */}
          <button
            type="button"
            onClick={onQuickSearch}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 text-xs text-[var(--ink-soft)] bg-[var(--surface)] hover:bg-[var(--paper-2)] border border-[var(--border)] rounded-xl transition-colors shadow-2xs"
          >
            <Search size={14} strokeWidth={1.5} />
            <span>{isNl ? 'Zoek tenant, order of job...' : 'Search tenant, order, or job...'}</span>
            <kbd className="font-mono-code text-[10px] bg-[var(--paper)] px-1.5 py-0.5 rounded border border-[var(--border)]">
              /
            </kbd>
          </button>

          {/* Fleet Health Status Indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f0fdf4] text-[var(--success)] border border-[#bbf7d0] text-xs font-mono-code">
            <CheckCircle2 size={13} strokeWidth={2} />
            <span className="hidden sm:inline font-semibold">Vloot Gezond</span>
            <span className="sm:hidden font-semibold">OK</span>
            <span className="text-[10px] text-[var(--success)]/80">· 41 pods</span>
          </div>

          {/* Language Toggle */}
          <div className="flex items-center text-xs font-mono-code font-semibold text-[var(--ink-soft)] border-l border-[var(--border)] pl-3">
            <button
              type="button"
              onClick={() => onLanguageChange('nl')}
              className={`px-1.5 py-0.5 rounded transition-colors ${
                lang === 'nl'
                  ? 'text-[var(--accent)] font-bold underline underline-offset-4'
                  : 'hover:text-[var(--ink)]'
              }`}
            >
              NL
            </button>
            <span className="text-[var(--border)]">/</span>
            <button
              type="button"
              onClick={() => onLanguageChange('en')}
              className={`px-1.5 py-0.5 rounded transition-colors ${
                lang === 'en'
                  ? 'text-[var(--accent)] font-bold underline underline-offset-4'
                  : 'hover:text-[var(--ink)]'
              }`}
            >
              EN
            </button>
          </div>

          {/* Operator Initials & Role Chip */}
          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-[var(--border)] text-xs">
            <div className="w-7 h-7 rounded-full bg-[var(--ink)] text-[var(--paper)] flex items-center justify-center font-display font-bold text-[11px]">
              SM
            </div>
            <div className="flex flex-col text-left">
              <span className="font-mono-code text-[11px] text-[var(--ink)] font-bold leading-none">
                {operatorAccount.name}
              </span>
              <span className="text-[10px] font-mono-code text-[var(--accent)] font-semibold leading-none mt-0.5">
                {activeRole}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
