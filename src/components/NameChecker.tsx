import React, { useState } from 'react';
import { AddressMode, Language } from '../types';
import { translations } from '../data/translations';

interface NameCheckerProps {
  lang: Language;
  onReserveSuccess: (claimedName: string, mode: AddressMode) => void;
}

export const NameChecker: React.FC<NameCheckerProps> = ({ lang, onReserveSuccess }) => {
  const t = translations[lang].stage1;
  const [mode, setMode] = useState<AddressMode>('subdomain');
  const [nameInput, setNameInput] = useState('daanensophie');
  const [isChecking, setIsChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<{
    query: string;
    available: boolean;
    fullAddress: string;
    suggestions?: string[];
  } | null>({
    query: 'daanensophie',
    available: true,
    fullAddress: 'daanensophie.fesafotos.nl',
  });

  const takenSlugs = ['bruiloft', 'party', 'festival', 'fesa', 'amsterdam', 'event', 'rotterdam'];

  const handleCheck = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const sanitized = nameInput.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
    if (!sanitized || sanitized.length < 3) return;

    setIsChecking(true);
    setCheckResult(null);

    setTimeout(() => {
      const isTaken = takenSlugs.includes(sanitized);
      const suffix = mode === 'subdomain' ? '.fesafotos.nl' : '.nl';
      const full = `${sanitized}${suffix}`;

      if (isTaken) {
        setCheckResult({
          query: sanitized,
          available: false,
          fullAddress: full,
          suggestions: [
            `${sanitized}-2026`,
            `fesa-${sanitized}`,
            `feest-van-${sanitized}`,
          ],
        });
      } else {
        setCheckResult({
          query: sanitized,
          available: true,
          fullAddress: full,
        });
      }
      setIsChecking(false);
    }, 450);
  };

  const handleSelectSuggestion = (suggested: string) => {
    setNameInput(suggested);
    const suffix = mode === 'subdomain' ? '.fesafotos.nl' : '.nl';
    setCheckResult({
      query: suggested,
      available: true,
      fullAddress: `${suggested}${suffix}`,
    });
  };

  return (
    <section id="werk" className="py-16 lg:py-24 border-b border-[#e7ded1] bg-[#faf7f2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12">
          <div className="text-xs font-mono-code font-semibold tracking-wider text-[#c2410c] uppercase mb-2">
            {t.kicker}
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1c1917] tracking-tight font-sans-clean">
            {t.title}
          </h2>
        </div>

        {/* 2-Column Split: Explanatory Copy & Interactive Checker Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-5 space-y-4 text-base text-[#57534e] leading-relaxed">
            <p>{t.copy1}</p>
            <p>{t.copy2}</p>

            <div className="pt-4 border-t border-[#e7ded1]">
              <div className="text-xs font-semibold text-[#1c1917] mb-2">
                Populaire snelle checks:
              </div>
              <div className="flex flex-wrap gap-2">
                {['daanensophie', 'noa-30', 'zomerfeest-2026', 'bruiloft'].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => {
                      setNameInput(chip);
                      setTimeout(() => handleCheck(), 50);
                    }}
                    className="px-2.5 py-1 text-xs font-mono-code bg-white hover:bg-[#f2e9dc] border border-[#d6cebf] rounded text-[#44403c] transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Checker Panel */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-[#e2d8ca] shadow-sm">
            <div className="flex items-center justify-between pb-5 mb-5 border-b border-[#f0e8db]">
              <h3 className="text-lg font-bold text-[#1c1917] font-sans-clean">
                {t.panelTitle}
              </h3>

              {/* Mode Switcher Tabs */}
              <div className="flex items-center p-1 bg-[#f4ebe0] rounded-lg text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setMode('subdomain')}
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    mode === 'subdomain'
                      ? 'bg-white text-[#1c1917] font-semibold shadow-xs'
                      : 'text-[#78716c] hover:text-[#1c1917]'
                  }`}
                >
                  {t.modeSubdomain}
                </button>
                <button
                  type="button"
                  onClick={() => setMode('domain')}
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    mode === 'domain'
                      ? 'bg-white text-[#1c1917] font-semibold shadow-xs'
                      : 'text-[#78716c] hover:text-[#1c1917]'
                  }`}
                >
                  {t.modeCustomDomain}
                </button>
              </div>
            </div>

            {/* Checker Form */}
            <form onSubmit={handleCheck} className="space-y-4">
              <div>
                <label
                  htmlFor="check-name-input"
                  className="block text-xs font-semibold text-[#44403c] mb-1.5"
                >
                  {t.inputLabel}
                </label>
                <div className="flex rounded-lg border border-[#d6cebf] focus-within:border-[#1c1917] focus-within:ring-1 focus-within:ring-[#1c1917] overflow-hidden bg-[#faf7f2]">
                  <input
                    id="check-name-input"
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    placeholder={t.placeholder}
                    className="flex-1 px-3.5 py-3 text-base text-[#1c1917] bg-transparent outline-none font-mono-code"
                  />
                  <span className="inline-flex items-center px-3.5 text-sm text-[#78716c] bg-[#f0e6d8] border-l border-[#d6cebf] font-mono-code select-none">
                    {mode === 'subdomain' ? '.fesafotos.nl' : '.nl'}
                  </span>
                  <button
                    type="submit"
                    disabled={isChecking || nameInput.trim().length < 3}
                    className="px-5 py-3 text-sm font-semibold text-white bg-[#1c1917] hover:bg-[#292524] disabled:opacity-50 transition-colors shrink-0"
                  >
                    {isChecking ? t.buttonChecking : t.buttonCheck}
                  </button>
                </div>
                <p className="text-xs text-[#78716c] mt-1.5">{t.hint}</p>
              </div>

              {/* Status Display */}
              {checkResult && (
                <div
                  className={`mt-6 p-4.5 rounded-xl border transition-all ${
                    checkResult.available
                      ? 'bg-[#f0fdf4] border-[#bbf7d0] text-[#166534]'
                      : 'bg-[#fffbeb] border-[#fde68a] text-[#92400e]'
                  }`}
                >
                  {checkResult.available ? (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-bold font-mono-code">
                          {checkResult.fullAddress} {t.availableStatus}
                        </div>
                        <div className="text-xs text-[#166534]/90 mt-0.5">
                          {t.availableDesc}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onReserveSuccess(checkResult.query, mode)}
                        className="px-4 py-2 text-xs font-semibold text-white bg-[#166534] hover:bg-[#14532d] rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-xs"
                      >
                        {t.claimButton} →
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="text-sm font-bold font-mono-code mb-1">
                        {checkResult.fullAddress} {t.takenStatus}
                      </div>
                      <p className="text-xs text-[#92400e] mb-2.5">
                        {t.takenDesc}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {checkResult.suggestions?.map((sug) => (
                          <button
                            key={sug}
                            type="button"
                            onClick={() => handleSelectSuggestion(sug)}
                            className="px-2.5 py-1 text-xs font-mono-code bg-white hover:bg-[#fef3c7] border border-[#fcd34d] text-[#78350f] rounded transition-colors"
                          >
                            {sug}{mode === 'subdomain' ? '.fesafotos.nl' : '.nl'}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
