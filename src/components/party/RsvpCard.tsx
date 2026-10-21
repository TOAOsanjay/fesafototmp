import React, { useState } from 'react';
import { Language } from '../../types/party';
import { partyConfig } from '../../data/partyData';

interface RsvpCardProps {
  lang: Language;
}

export const RsvpCard: React.FC<RsvpCardProps> = ({ lang }) => {
  const isNl = lang === 'nl';
  const [status, setStatus] = useState<'yes' | 'maybe' | 'no' | null>('yes');
  const [guestCount, setGuestCount] = useState(2);
  const [dietary, setDietary] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleCopyPersonalLink = () => {
    navigator.clipboard?.writeText(`https://${partyConfig.subdomain}?rsvp=gast-sanne`);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2200);
  };

  return (
    <section className="py-10 border-b border-[var(--border)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-[var(--surface)] rounded-3xl p-6 sm:p-8 border border-[var(--border)] shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-5 border-b border-[var(--border)]">
            <div>
              <span className="text-[11px] font-mono-code font-bold uppercase tracking-wider text-[var(--accent)]">
                {isNl ? 'Aanwezigheid : RSVP' : 'Attendance : RSVP'}
              </span>
              <h3 className="font-display font-bold text-xl text-[var(--ink)]">
                {isNl ? 'Vier je mee met Sanjay & Dewie?' : 'Are you celebrating with Sanjay & Dewie?'}
              </h3>
            </div>

            <button
              type="button"
              onClick={handleCopyPersonalLink}
              className="text-xs font-semibold text-[var(--ink-soft)] hover:text-[var(--ink)] bg-[var(--paper)] hover:bg-[var(--paper-2)] border border-[var(--border)] px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span>🔗</span>
              <span>{linkCopied ? (isNl ? 'Persoonlijke link gekopieerd!' : 'Personal link copied!') : (isNl ? 'Mijn persoonlijke link' : 'My personal link')}</span>
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            {/* Status Radio Buttons */}
            <div>
              <label className="block font-semibold text-[var(--ink)] mb-2">
                {isNl ? 'Jouw status voor vrijdag 30 oktober' : 'Your status for Friday, 30 October'}
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setStatus('yes')}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    status === 'yes'
                      ? 'border-[var(--success)] bg-[#f0fdf4] text-[var(--success)] font-bold shadow-2xs'
                      : 'border-[var(--border)] bg-[var(--paper)] text-[var(--ink-soft)]'
                  }`}
                >
                  <span className="block text-base mb-0.5">🎉</span>
                  <span>{isNl ? 'Ik ben erbij!' : 'I am coming!'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStatus('maybe')}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    status === 'maybe'
                      ? 'border-[#f59e0b] bg-[#fffbeb] text-[#92400e] font-bold shadow-2xs'
                      : 'border-[var(--border)] bg-[var(--paper)] text-[var(--ink-soft)]'
                  }`}
                >
                  <span className="block text-base mb-0.5">🤔</span>
                  <span>{isNl ? 'Misschien' : 'Maybe'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStatus('no')}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    status === 'no'
                      ? 'border-red-400 bg-red-50 text-red-700 font-bold shadow-2xs'
                      : 'border-[var(--border)] bg-[var(--paper)] text-[var(--ink-soft)]'
                  }`}
                >
                  <span className="block text-base mb-0.5">💌</span>
                  <span>{isNl ? 'Helaas verhinderd' : 'Cannot attend'}</span>
                </button>
              </div>
            </div>

            {status === 'yes' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block font-semibold text-[var(--ink)] mb-1">
                    {isNl ? 'Aantal personen' : 'Number of guests'}
                  </label>
                  <select
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--paper)] focus:outline-none focus:border-[var(--accent)] text-[var(--ink)]"
                  >
                    <option value={1}>1 persoon</option>
                    <option value={2}>2 personen (met partner)</option>
                    <option value={3}>3 personen</option>
                    <option value={4}>4 personen (gezin)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[var(--ink)] mb-1">
                    {isNl ? 'Dieetwensen of opmerking' : 'Dietary wishes or notes'}
                  </label>
                  <input
                    type="text"
                    value={dietary}
                    onChange={(e) => setDietary(e.target.value)}
                    placeholder={isNl ? 'bijv. vegetarisch, glutenvrij' : 'e.g. vegetarian, gluten-free'}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--paper)] focus:outline-none focus:border-[var(--accent)] text-[var(--ink)]"
                  />
                </div>
              </div>
            )}

            <div className="pt-2 flex items-center justify-between">
              {isSaved ? (
                <span className="text-xs text-[var(--success)] font-semibold">
                  ✓ {isNl ? 'RSVP status bijgewerkt voor Sanjay & Dewie!' : 'RSVP updated for Sanjay & Dewie!'}
                </span>
              ) : <span />}

              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-semibold text-white bg-[var(--accent)] hover:opacity-90 rounded-xl transition-all shadow-xs"
              >
                {isNl ? 'Bevestig aanwezigheid' : 'Confirm RSVP'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
