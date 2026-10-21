import React, { useState } from 'react';
import { ThemeId, Language } from '../../types/party';
import { themePresets, partyConfig, planDetails } from '../../data/partyData';

interface OrganisationSectionProps {
  lang: Language;
  currentTheme: ThemeId;
  onThemeSelect: (themeId: ThemeId) => void;
  onOpenBeamer: () => void;
}

export const OrganisationSection: React.FC<OrganisationSectionProps> = ({
  lang,
  currentTheme,
  onThemeSelect,
  onOpenBeamer,
}) => {
  const isNl = lang === 'nl';
  const [copiedLink, setCopiedLink] = useState(false);
  const [previewAnimation, setPreviewAnimation] = useState<'confetti' | 'balloons'>('confetti');

  // Party settings edit state
  const [partyName, setPartyName] = useState(partyConfig.name);
  const [partyDate, setPartyDate] = useState('2026-10-30');
  const [hashtag, setHashtag] = useState(partyConfig.hashtag);
  const [welcomeText, setWelcomeText] = useState(partyConfig.welcomeTextNl);
  const [savedSettingsNotice, setSavedSettingsNotice] = useState(false);

  // Sample guest roster
  const [guestList] = useState([
    { name: 'Sanne & Lucas', status: 'Aanwezig', uploads: 3 },
    { name: 'Noor & Youssef', status: 'Aanwezig', uploads: 2 },
    { name: 'Thijs van Dijk', status: 'Aanwezig', uploads: 2 },
    { name: 'Oma Truus & Opa Jan', status: 'Aanwezig', uploads: 0 },
    { name: 'Bram (Ceremoniemeester)', status: 'Aanwezig', uploads: 1 },
    { name: 'Familie Visser', status: 'Aanwezig', uploads: 1 },
  ]);

  const handleCopyInviteLink = () => {
    navigator.clipboard?.writeText(`https://${partyConfig.subdomain}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSettingsNotice(true);
    setTimeout(() => setSavedSettingsNotice(false), 2500);
  };

  return (
    <section id="organisatie" className="py-12 sm:py-16 border-b border-[var(--border)] bg-[var(--paper-2)]/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-xs font-mono-code font-bold uppercase tracking-wider text-[var(--accent)] mb-1">
              {isNl ? 'Organisatie & Beheer : Host Area' : 'Organisation & Host Area'}
            </div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--ink)] tracking-tight">
              {isNl ? 'Feestinstellingen voor Sanjay & Dewie' : 'Party settings for Sanjay & Dewie'}
            </h2>
            <p className="text-sm text-[var(--ink-soft)] mt-1">
              {isNl
                ? 'Beheer jouw gastenlijst, thema, beamer projectie en albumvoorkeuren.'
                : 'Manage your guest invitations, theme, projector mode, and limits.'}
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenBeamer}
            className="px-4 py-2.5 text-xs font-semibold text-white bg-[var(--ink)] hover:bg-[#292524] rounded-xl transition-all shadow-xs flex items-center gap-2 self-start sm:self-auto"
          >
            <span>📽️</span>
            <span>{isNl ? 'Open Beamer Projector' : 'Open Projector Mode'}</span>
          </button>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-start">
          {/* Card 1: Guests & Invitations */}
          <div className="bg-[var(--surface)] rounded-3xl p-6 sm:p-7 border border-[var(--border)] shadow-xs">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[var(--border)]">
              <div>
                <h3 className="font-display font-bold text-lg text-[var(--ink)]">
                  {isNl ? 'Gasten & Uitnodigingen' : 'Guests & Invitations'}
                </h3>
                <p className="text-xs text-[var(--ink-soft)]">
                  24 {isNl ? 'uitnodigingen verstuurd' : 'invitations sent'}
                </p>
              </div>
              <button
                type="button"
                onClick={handleCopyInviteLink}
                className="px-3 py-1.5 text-xs font-semibold text-[var(--accent)] bg-[var(--paper)] hover:bg-[var(--paper-2)] border border-[var(--border)] rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>🔗</span>
                <span>{copiedLink ? (isNl ? 'Gekopieerd!' : 'Copied!') : (isNl ? 'Kopieer link' : 'Copy link')}</span>
              </button>
            </div>

            <div className="space-y-2 mb-4 max-h-56 overflow-y-auto pr-1">
              {guestList.map((g, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--paper)] border border-[var(--border)] text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--success)]" />
                    <span className="font-medium text-[var(--ink)]">{g.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] font-mono-code text-[var(--ink-soft)]">
                    <span>{g.uploads} uploads</span>
                    <span className="text-[var(--success)] font-semibold">{g.status}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => alert(isNl ? 'CSV gastenlijst import geopend.' : 'Guest list CSV import opened.')}
                className="text-xs font-medium text-[var(--accent)] hover:underline"
              >
                + {isNl ? 'Importeer CSV gastenlijst' : 'Import CSV guests'}
              </button>
              <span className="text-[11px] font-mono-code text-[var(--ink-soft)]">
                sanjayendewie.fesafotos.nl
              </span>
            </div>
          </div>

          {/* Card 2: Theme & Animation Choice */}
          <div className="bg-[var(--surface)] rounded-3xl p-6 sm:p-7 border border-[var(--border)] shadow-xs">
            <div className="pb-4 mb-4 border-b border-[var(--border)]">
              <h3 className="font-display font-bold text-lg text-[var(--ink)]">
                {isNl ? 'Thema & Feeststijl' : 'Theme & Party Style'}
              </h3>
              <p className="text-xs text-[var(--ink-soft)]">
                {isNl
                  ? 'Kies het accent voor jouw album, QR-tafelkaart en beamer animatie.'
                  : 'Select the accent color for your album, table card and animations.'}
              </p>
            </div>

            {/* Presets Swatches */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5">
              {themePresets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => onThemeSelect(preset.id)}
                  className={`p-3 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                    currentTheme === preset.id
                      ? 'border-[var(--ink)] bg-[var(--paper)] ring-1 ring-[var(--ink)]'
                      : 'border-[var(--border)] hover:bg-[var(--paper-2)]'
                  }`}
                >
                  <span
                    className="w-5 h-5 rounded-full shrink-0 border border-black/20 shadow-2xs mt-0.5"
                    style={{ backgroundColor: preset.accent }}
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[var(--ink)] truncate">
                      {isNl ? preset.name : preset.nameEn}
                    </div>
                    <div className="text-[11px] text-[var(--ink-soft)] line-clamp-1">
                      {preset.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Animation Preview Selector */}
            <div className="p-3 rounded-xl bg-[var(--paper-2)] border border-[var(--border)]">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-[var(--ink)]">
                  {isNl ? 'Feestanimatie preview:' : 'Animation preview:'}
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPreviewAnimation('confetti')}
                    className={`px-2 py-1 rounded text-[11px] font-medium ${
                      previewAnimation === 'confetti'
                        ? 'bg-[var(--accent)] text-white'
                        : 'bg-[var(--surface)] text-[var(--ink-soft)]'
                    }`}
                  >
                    🎉 Confetti
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewAnimation('balloons')}
                    className={`px-2 py-1 rounded text-[11px] font-medium ${
                      previewAnimation === 'balloons'
                        ? 'bg-[var(--accent)] text-white'
                        : 'bg-[var(--surface)] text-[var(--ink-soft)]'
                    }`}
                  >
                    🎈 Ballonnen
                  </button>
                </div>
              </div>

              {/* Dynamic CSS Preview Area */}
              <div className="h-14 rounded-lg bg-[var(--surface)] border border-[var(--border)] relative overflow-hidden flex items-center justify-center">
                {previewAnimation === 'confetti' ? (
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent)] animate-bounce" />
                    <span className="w-2 h-2 rounded-sm bg-[var(--accent-soft)] rotate-45 animate-ping" />
                    <span className="text-xs font-mono-code text-[var(--ink)] font-semibold">
                      {isNl ? 'Confetti burst actief bij uploads' : 'Confetti burst active on uploads'}
                    </span>
                    <span className="w-2.5 h-1.5 rounded-full bg-[var(--accent)] rotate-12" />
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="text-xl animate-float-gentle">🎈</span>
                    <span className="text-xs font-mono-code text-[var(--ink)] font-semibold">
                      {isNl ? 'Feestelijke ballonnen op de beamer' : 'Balloons drifting on beamer'}
                    </span>
                    <span className="text-xl animate-float-gentle" style={{ animationDelay: '1s' }}>
                      🎈
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Card 3: Party Settings */}
          <div className="bg-[var(--surface)] rounded-3xl p-6 sm:p-7 border border-[var(--border)] shadow-xs">
            <div className="pb-4 mb-4 border-b border-[var(--border)]">
              <h3 className="font-display font-bold text-lg text-[var(--ink)]">
                {isNl ? 'Feestgegevens & Teksten' : 'Party Details & Copy'}
              </h3>
              <p className="text-xs text-[var(--ink-soft)]">
                {isNl
                  ? 'Pas de welkomsttekst en datum van het feest aan.'
                  : 'Edit your party name, date, hashtag and welcome greeting.'}
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[var(--ink)] mb-1">
                    {isNl ? 'Feestnaam' : 'Party name'}
                  </label>
                  <input
                    type="text"
                    value={partyName}
                    onChange={(e) => setPartyName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--paper)] focus:outline-none focus:border-[var(--accent)] font-medium text-[var(--ink)]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[var(--ink)] mb-1">
                    {isNl ? 'Hashtag' : 'Hashtag'}
                  </label>
                  <input
                    type="text"
                    value={hashtag}
                    onChange={(e) => setHashtag(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--paper)] focus:outline-none focus:border-[var(--accent)] font-mono-code text-[var(--ink)]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[var(--ink)] mb-1">
                  {isNl ? 'Datum van viering' : 'Celebration date'}
                </label>
                <input
                  type="date"
                  value={partyDate}
                  onChange={(e) => setPartyDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--paper)] focus:outline-none focus:border-[var(--accent)] text-[var(--ink)]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[var(--ink)] mb-1">
                  {isNl ? 'Welkomsttekst voor gasten' : 'Welcome message for guests'}
                </label>
                <textarea
                  rows={3}
                  value={welcomeText}
                  onChange={(e) => setWelcomeText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--paper)] focus:outline-none focus:border-[var(--accent)] text-[var(--ink)] leading-relaxed"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                {savedSettingsNotice ? (
                  <span className="text-xs text-[var(--success)] font-semibold">
                    ✓ {isNl ? 'Wijzigingen opgeslagen' : 'Changes saved'}
                  </span>
                ) : <span />}

                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[var(--ink)] hover:bg-[#292524] rounded-xl transition-colors shadow-xs"
                >
                  {isNl ? 'Opslaan' : 'Save changes'}
                </button>
              </div>
            </form>
          </div>

          {/* Card 4: Plan and Limits Meter */}
          <div className="bg-[var(--surface)] rounded-3xl p-6 sm:p-7 border border-[var(--border)] shadow-xs">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[var(--border)]">
              <div>
                <span className="text-[11px] font-mono-code font-bold uppercase text-[var(--accent)]">
                  {isNl ? 'Huidig pakket' : 'Current Plan'}
                </span>
                <h3 className="font-display font-bold text-lg text-[var(--ink)]">
                  {planDetails.currentPlan} ({planDetails.price})
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#f0fdf4] text-[var(--success)] border border-[#bbf7d0] text-xs font-semibold">
                Actief
              </span>
            </div>

            {/* Limits list */}
            <div className="space-y-3 text-xs mb-6">
              <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
                <span className="text-[var(--ink-soft)]">{isNl ? 'Geldig tot:' : 'Hosting valid until:'}</span>
                <span className="font-semibold text-[var(--ink)] font-mono-code">{planDetails.expiryDate}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
                <span className="text-[var(--ink-soft)]">{isNl ? 'Max aantal media:' : 'Media uploads:'}</span>
                <span className="font-semibold text-[var(--success)]">{planDetails.maxMedia}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
                <span className="text-[var(--ink-soft)]">{isNl ? 'Videoclips limiet:' : 'Video clips limit:'}</span>
                <span className="font-semibold text-[var(--ink)]">{planDetails.videoDurationLimit}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
                <span className="text-[var(--ink-soft)]">{isNl ? 'Downloads:' : 'Downloads:'}</span>
                <span className="font-semibold text-[var(--ink)]">{planDetails.downloads}</span>
              </div>
            </div>

            {/* Storage Meter Visual */}
            <div className="p-3.5 rounded-2xl bg-[var(--paper-2)] border border-[var(--border)] mb-4">
              <div className="flex items-center justify-between text-xs font-mono-code mb-1.5">
                <span className="text-[var(--ink-soft)]">Verbruik: 11 van onbeperkt</span>
                <span className="text-[var(--accent)] font-bold">11%</span>
              </div>
              <div className="w-full bg-[var(--border)] rounded-full h-2 overflow-hidden">
                <div className="bg-[var(--accent)] h-2 rounded-full w-[11%]" />
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenBeamer}
              className="w-full py-2.5 px-4 text-xs font-semibold rounded-xl bg-[var(--accent)] text-white hover:opacity-95 transition-all text-center flex items-center justify-center gap-2 shadow-xs"
            >
              <span>📽️</span>
              <span>{isNl ? 'Start Beamer Modus op groot scherm' : 'Launch Projector Mode on big screen'}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
