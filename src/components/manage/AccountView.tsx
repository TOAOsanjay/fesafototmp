import React, { useState } from 'react';
import { operatorAccount } from '../../data/manageData';
import { User, LogOut, ShieldAlert, Key, Globe, RefreshCcw, Check } from 'lucide-react';

interface AccountViewProps {
  lang: 'nl' | 'en';
  onLanguageChange: (lang: 'nl' | 'en') => void;
  onRequestDestructiveAction: (actionName: string, confirmWord: string) => void;
}

export const AccountView: React.FC<AccountViewProps> = ({
  lang,
  onLanguageChange,
  onRequestDestructiveAction,
}) => {
  const isNl = lang === 'nl';
  const [safeMode, setSafeMode] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-3xl">
      {/* Header */}
      <div className="pb-4 border-b border-[var(--border)]">
        <h2 className="font-display font-extrabold text-2xl text-[var(--ink)] tracking-tight">
          {isNl ? 'Mijn Operator Account' : 'My Operator Account'}
        </h2>
        <p className="text-xs text-[var(--ink-soft)] mt-0.5">
          {isNl
            ? 'Beheeroperator profiel, taalinstelling, sessieveiligheid en noodhandelingen.'
            : 'Operator profile, language preference, session security, and emergency actions.'}
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-4 pb-4 border-b border-[var(--border)]">
          <div className="w-14 h-14 rounded-2xl bg-[var(--accent)] text-white font-display font-extrabold text-xl flex items-center justify-center shadow-xs">
            SM
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-[var(--ink)]">
              {operatorAccount.name}
            </h3>
            <p className="text-xs font-mono-code text-[var(--ink-soft)]">
              {operatorAccount.email} · Rol: <span className="font-bold text-[var(--accent)]">{operatorAccount.role}</span>
            </p>
            <div className="text-[11px] text-[var(--ink-soft)] mt-0.5">
              Laatst ingelogd: {operatorAccount.lastLogin}
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-[var(--paper)] border border-[var(--border)] space-y-2">
            <div className="font-bold text-[var(--ink)] flex items-center gap-2">
              <Globe size={15} className="text-[var(--ink-soft)]" />
              <span>Taalvoorkeur interface</span>
            </div>
            <p className="text-[11px] text-[var(--ink-soft)] leading-normal">
              Kies de weergavetaal voor het beheerpaneel en e-mail notificaties.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => onLanguageChange('nl')}
                className={`px-3 py-1.5 rounded-xl font-mono-code text-xs font-semibold ${
                  lang === 'nl'
                    ? 'bg-[var(--ink)] text-white'
                    : 'bg-[var(--surface)] text-[var(--ink)] border border-[var(--border)]'
                }`}
              >
                Nederlands (NL)
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange('en')}
                className={`px-3 py-1.5 rounded-xl font-mono-code text-xs font-semibold ${
                  lang === 'en'
                    ? 'bg-[var(--ink)] text-white'
                    : 'bg-[var(--surface)] text-[var(--ink)] border border-[var(--border)]'
                }`}
              >
                English (EN)
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--paper)] border border-[var(--border)] space-y-2">
            <div className="font-bold text-[var(--ink)] flex items-center gap-2">
              <Key size={15} className="text-[var(--ink-soft)]" />
              <span>Noodveilige Modus (Safe Mode)</span>
            </div>
            <p className="text-[11px] text-[var(--ink-soft)] leading-normal">
              Schakelt alle destructieve knoppen uit voor veilige inspectie op mobiele apparaten.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setSafeMode(!safeMode)}
                className={`px-3 py-1.5 rounded-xl font-mono-code text-xs font-semibold ${
                  safeMode
                    ? 'bg-[var(--success)] text-white'
                    : 'bg-[var(--surface)] text-[var(--ink)] border border-[var(--border)]'
                }`}
              >
                {safeMode ? '✓ Safe Mode Actief' : 'Safe Mode Inschakelen'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Destructive Operator Operations */}
      <div className="bg-[var(--surface)] border border-red-200 rounded-3xl p-6 shadow-2xs space-y-4">
        <div className="pb-3 border-b border-red-100 flex items-center gap-2">
          <ShieldAlert size={18} className="text-[var(--danger)]" />
          <div>
            <h3 className="font-display font-bold text-base text-[var(--danger)]">
              {isNl ? 'Destructieve Systeemacties' : 'Destructive System Actions'}
            </h3>
            <p className="text-xs text-[var(--ink-soft)]">
              {isNl
                ? 'Deze acties vereisen een getypte bevestiging in een gecentreerd dialoogvenster.'
                : 'These actions require typed confirmation before execution.'}
            </p>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-[var(--paper)] border border-[var(--border)] flex items-center justify-between gap-3">
            <div>
              <div className="font-bold text-[var(--ink)]">Edge Cache Legen (Flush Ingress Cache)</div>
              <div className="text-[11px] text-[var(--ink-soft)]">
                Wist Cloudflare en NGINX cache voor alle actieve feestadressen.
              </div>
            </div>
            <button
              type="button"
              disabled={safeMode}
              onClick={() => onRequestDestructiveAction('Flush Ingress Cache', 'FLUSH')}
              className="px-3 py-1.5 rounded-xl border border-red-300 text-[var(--danger)] bg-red-50 hover:bg-red-100 font-semibold text-xs disabled:opacity-50"
            >
              Legen (FLUSH)
            </button>
          </div>

          <div className="p-3.5 rounded-2xl bg-[var(--paper)] border border-[var(--border)] flex items-center justify-between gap-3">
            <div>
              <div className="font-bold text-[var(--ink)]">Transcode Wachtrij Resetten</div>
              <div className="text-[11px] text-[var(--ink-soft)]">
                Herstart alle wachtende jobs en herstelt de Redis cluster verbinding.
              </div>
            </div>
            <button
              type="button"
              disabled={safeMode}
              onClick={() => onRequestDestructiveAction('Reset Transcode Queue', 'RESET')}
              className="px-3 py-1.5 rounded-xl border border-red-300 text-[var(--danger)] bg-red-50 hover:bg-red-100 font-semibold text-xs disabled:opacity-50"
            >
              Resetten (RESET)
            </button>
          </div>
        </div>

        {/* Sign Out */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Weet je zeker dat je wilt uitloggen uit manage.fesafotos.nl?')) {
                alert('Sessie beëindigd. Je wordt herleid naar het inlogscherm.');
              }
            }}
            className="px-4 py-2 rounded-xl bg-[var(--ink)] text-white hover:bg-[#292524] text-xs font-semibold flex items-center gap-1.5"
          >
            <LogOut size={13} strokeWidth={1.5} />
            <span>Uitloggen (sanjay@live.nl)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
