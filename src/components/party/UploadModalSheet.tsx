import React, { useState, useEffect } from 'react';
import { Language, UploadFileItem, MediaItem } from '../../types/party';

interface UploadModalSheetProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onUploadSuccess: (newItems: MediaItem[]) => void;
}

export const UploadModalSheet: React.FC<UploadModalSheetProps> = ({
  isOpen,
  onClose,
  lang,
  onUploadSuccess,
}) => {
  const isNl = lang === 'nl';
  const [firstName, setFirstName] = useState('');
  const [consentGiven, setConsentGiven] = useState(true);
  const [uploadPhase, setUploadPhase] = useState<'idle' | 'uploading' | 'celebrating'>('idle');
  const [overallProgress, setOverallProgress] = useState(0);
  const [remainingTimeSec, setRemainingTimeSec] = useState(12);
  const [overallSpeed, setOverallSpeed] = useState('4.8 MB/s');
  const [autoCloseCountdown, setAutoCloseCountdown] = useState(5);
  const [stayInModal, setStayInModal] = useState(false);

  // Sample files that represent realistic uploads (photos + video)
  const [files, setFiles] = useState<UploadFileItem[]>([
    {
      id: 'f1',
      name: 'IMG_4021_Diner_Sanjay_Dewie.jpg',
      size: 4200000,
      type: 'photo',
      thumbnailUrl: '/src/assets/images/hero_party_celebration_1791985660408.jpg',
      progress: 0,
      speed: '2.4 MB/s',
      status: 'uploading',
    },
    {
      id: 'f2',
      name: 'VID_9823_Openingsdans_Feest.mp4',
      size: 18500000,
      type: 'video',
      thumbnailUrl: '/src/assets/images/party_guest_moments_grid_1791985661203.jpg',
      progress: 0,
      speed: '5.1 MB/s',
      status: 'uploading',
    },
    {
      id: 'f3',
      name: 'DSC_0114_Tafelkaart_Sfeer.jpg',
      size: 3800000,
      type: 'photo',
      thumbnailUrl: '/src/assets/images/qr_table_card_mockup_1791985661307.jpg',
      progress: 0,
      speed: '3.0 MB/s',
      status: 'uploading',
    },
  ]);

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setUploadPhase('idle');
      setOverallProgress(0);
      setRemainingTimeSec(12);
      setAutoCloseCountdown(5);
      setStayInModal(false);
      setFiles((prev) =>
        prev.map((f) => ({
          ...f,
          progress: 0,
          status: 'uploading',
        }))
      );
    }
  }, [isOpen]);

  // Handle Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Simulated progressive upload flow
  const handleStartUpload = () => {
    if (!consentGiven) return;
    setUploadPhase('uploading');

    let currentProg = 0;
    const interval = setInterval(() => {
      currentProg += Math.floor(Math.random() * 8) + 6;
      if (currentProg >= 100) {
        currentProg = 100;
        clearInterval(interval);
        setOverallProgress(100);
        setRemainingTimeSec(0);
        setFiles((prev) =>
          prev.map((f) => ({
            ...f,
            progress: 100,
            status: 'done',
          }))
        );

        // Switch to celebration phase
        setTimeout(() => {
          setUploadPhase('celebrating');
        }, 300);
      } else {
        setOverallProgress(currentProg);
        const rem = Math.max(1, Math.round((100 - currentProg) * 0.12));
        setRemainingTimeSec(rem);
        setOverallSpeed(`${(4.2 + Math.random() * 0.9).toFixed(1)} MB/s`);

        setFiles((prev) =>
          prev.map((f, idx) => {
            const fileProg = Math.min(100, Math.round(currentProg * (1 + (idx - 1) * 0.15)));
            return {
              ...f,
              progress: fileProg,
              status: fileProg >= 100 ? 'done' : 'uploading',
            };
          })
        );
      }
    }, 240);
  };

  // Countdown timer in celebration phase
  useEffect(() => {
    if (uploadPhase !== 'celebrating' || stayInModal) return;

    if (autoCloseCountdown <= 0) {
      handleCompleteCelebration();
      return;
    }

    const timer = setTimeout(() => {
      setAutoCloseCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [uploadPhase, autoCloseCountdown, stayInModal]);

  const handleCompleteCelebration = () => {
    const authorName = firstName.trim() || (isNl ? 'Feestganger' : 'Guest');
    const newItems: MediaItem[] = [
      {
        id: `upload-${Date.now()}-1`,
        type: 'photo',
        url: '/src/assets/images/hero_party_celebration_1791985660408.jpg',
        caption: isNl ? 'Zojuist geüpload naar Sanjay & Dewie!' : 'Just uploaded to Sanjay & Dewie!',
        author: authorName,
        timestamp: isNl ? 'Zojuist' : 'Just now',
        likes: 1,
        isNew: true,
        status: 'geaccepteerd',
        isGuestOwner: true,
      },
      {
        id: `upload-${Date.now()}-2`,
        type: 'video',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        poster: '/src/assets/images/party_guest_moments_grid_1791985661203.jpg',
        videoDuration: '0:22',
        caption: isNl ? 'Feestmoment op de dansvloer' : 'Party moment on the dance floor',
        author: authorName,
        timestamp: isNl ? 'Zojuist' : 'Just now',
        likes: 2,
        isNew: true,
        status: 'geaccepteerd',
        isGuestOwner: true,
      },
    ];

    onUploadSuccess(newItems);
    onClose();

    // Smooth scroll to #mijn-album
    setTimeout(() => {
      const albumElem = document.getElementById('mijn-album');
      if (albumElem) {
        albumElem.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 app-sheet-backdrop"
      onClick={onClose}
    >
      {/* Bottom sheet on mobile / centered dialog on desktop */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-lg bg-[var(--surface)] border border-[var(--border)] rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92dvh] sm:max-h-[85vh] flex flex-col overflow-hidden text-[var(--ink)] animate-in fade-in duration-200"
      >
        {/* Mobile Drag Handle */}
        <div className="sm:hidden pt-3 pb-1 flex justify-center">
          <div className="w-12 h-1.5 rounded-full bg-[var(--border)]" />
        </div>

        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between">
          <div>
            <div className="text-[11px] font-mono-code uppercase tracking-wider text-[var(--accent)] font-bold">
              {isNl ? 'Upload naar Sanjay & Dewie' : 'Upload to Sanjay & Dewie'}
            </div>
            <h3 className="font-display font-bold text-lg sm:text-xl text-[var(--ink)]">
              {uploadPhase === 'celebrating'
                ? (isNl ? 'Upload geslaagd! 🎉' : 'Upload completed! 🎉')
                : (isNl ? 'Momenten toevoegen' : 'Add moments')}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[var(--paper-2)] hover:bg-[var(--border)] flex items-center justify-center text-sm font-semibold transition-colors text-[var(--ink-soft)]"
            aria-label="Sluit upload venster"
          >
            ✕
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* CELEBRATION STATE */}
          {uploadPhase === 'celebrating' ? (
            <div className="py-6 text-center space-y-4">
              {/* Checkmark drawing itself + Confetti Burst */}
              <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                {/* SVG Confetti particles in theme accent */}
                <span className="absolute -top-2 left-2 w-2.5 h-2.5 rounded-full bg-[var(--accent)] animate-bounce" />
                <span className="absolute top-1 -right-2 w-2 h-2 rounded-sm bg-[var(--accent-soft)] rotate-45 animate-ping" />
                <span className="absolute -bottom-1 -left-1 w-2.5 h-1.5 rounded-full bg-[var(--accent)] rotate-12" />
                <span className="absolute bottom-2 -right-3 w-3 h-3 rounded-full bg-[var(--accent-soft)]" />

                {/* Animated SVG Circle & Checkmark */}
                <svg viewBox="0 0 52 52" className="w-16 h-16">
                  <circle
                    cx="26"
                    cy="26"
                    r="24"
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth="3"
                    className="opacity-20"
                  />
                  <path
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14 27l8 8 16-16"
                    className="animate-check-draw"
                  />
                </svg>
              </div>

              <div className="space-y-1">
                <h4 className="font-display font-extrabold text-2xl text-[var(--ink)]">
                  {isNl ? 'Prachtig! Foto\'s staan in het album' : 'Wonderful! Photos are in the album'}
                </h4>
                <p className="text-xs text-[var(--ink-soft)] max-w-sm mx-auto leading-relaxed">
                  {isNl
                    ? 'Jouw foto\'s en video zijn succesvol verwerkt en verschijnen ook op de live beamer muur.'
                    : 'Your photos and video have been processed and will now appear on the live beamer wall.'}
                </p>
              </div>

              {/* Countdown & Action Buttons */}
              <div className="pt-4 border-t border-[var(--border)]">
                {!stayInModal ? (
                  <div className="text-xs font-mono-code text-[var(--accent)] font-semibold mb-3">
                    {isNl
                      ? `Naar je album over ${autoCloseCountdown} s`
                      : `Going to your album in ${autoCloseCountdown} s`}
                  </div>
                ) : (
                  <div className="text-xs text-[var(--ink-soft)] mb-3">
                    {isNl ? 'Automatisch sluiten gepauzeerd.' : 'Auto-close paused.'}
                  </div>
                )}

                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleCompleteCelebration}
                    className="px-5 py-2.5 text-xs font-semibold text-white bg-[var(--accent)] hover:opacity-90 rounded-xl transition-all shadow-xs"
                  >
                    {isNl ? 'Review in album' : 'Review in album'} →
                  </button>
                  <button
                    type="button"
                    onClick={() => setStayInModal(true)}
                    className="px-4 py-2.5 text-xs font-medium text-[var(--ink)] bg-[var(--paper-2)] hover:bg-[var(--border)] rounded-xl transition-colors"
                  >
                    {isNl ? 'Blijven' : 'Stay'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* ACTIVE UPLOAD OR IDLE STATE */
            <>
              {/* Optional First Name Field */}
              <div>
                <label className="block text-xs font-semibold text-[var(--ink)] mb-1">
                  {isNl ? 'Jouw voornaam (optioneel)' : 'Your first name (optional)'}
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder={isNl ? 'bijv. Sanne, Noor of Thijs' : 'e.g. Sanne, Noor, or Thijs'}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[var(--border)] bg-[var(--paper)] focus:outline-none focus:border-[var(--accent)] font-normal text-[var(--ink)]"
                  disabled={uploadPhase === 'uploading'}
                />
              </div>

              {/* ONE Prominent Overall Progress Bar */}
              {uploadPhase === 'uploading' && (
                <div className="p-4 rounded-2xl bg-[var(--paper-2)] border border-[var(--border)] space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono-code text-[var(--ink)] font-bold">
                    <span>{isNl ? 'Totale voortgang' : 'Overall progress'}</span>
                    <span className="tabular-nums">{overallProgress}%</span>
                  </div>

                  {/* Progress bar line */}
                  <div className="w-full bg-[var(--border)] rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-[var(--accent)] h-2.5 rounded-full transition-all duration-200"
                      style={{ width: `${overallProgress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono-code text-[var(--ink-soft)]">
                    <span>
                      {isNl ? `Nog ongeveer ${remainingTimeSec} s` : `About ${remainingTimeSec} s left`}
                    </span>
                    <span>{overallSpeed}</span>
                  </div>
                </div>
              )}

              {/* Selected Files List with per-file progress & status */}
              <div className="space-y-2.5">
                <div className="text-xs font-semibold text-[var(--ink)] flex items-center justify-between">
                  <span>{isNl ? 'Geselecteerde bestanden' : 'Selected files'} ({files.length})</span>
                  <span className="text-[11px] font-mono-code text-[var(--ink-soft)]">26.5 MB totaal</span>
                </div>

                <div className="space-y-2">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="p-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex items-center gap-3 text-xs"
                    >
                      {/* Thumbnail */}
                      <img
                        src={file.thumbnailUrl}
                        alt={file.name}
                        className="w-11 h-11 rounded-lg object-cover border border-black/10 shrink-0"
                      />

                      {/* Info & Progress */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-[var(--ink)] truncate max-w-[180px]">
                            {file.name}
                          </span>
                          <span className="text-[11px] font-mono-code text-[var(--ink-soft)] tabular-nums">
                            {uploadPhase === 'uploading' ? `${file.progress}%` : (file.status === 'done' ? '✓' : 'Gereed')}
                          </span>
                        </div>

                        {/* Per-file mini bar */}
                        {uploadPhase === 'uploading' && (
                          <div className="w-full bg-[var(--border)] rounded-full h-1 overflow-hidden">
                            <div
                              className="bg-[var(--accent)] h-1 rounded-full transition-all duration-200"
                              style={{ width: `${file.progress}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Licence Consent Line */}
              <div className="pt-2 flex items-start gap-2.5 text-xs text-[var(--ink-soft)] leading-snug">
                <input
                  id="consent-checkbox"
                  type="checkbox"
                  checked={consentGiven}
                  onChange={(e) => setConsentGiven(e.target.checked)}
                  className="mt-0.5 rounded text-[var(--accent)] focus:ring-[var(--accent)]"
                />
                <label htmlFor="consent-checkbox" className="cursor-pointer">
                  {isNl
                    ? 'Door te uploaden geef je Sanjay & Dewie toestemming om deze herinneringen te bewaren en te delen met aanwezige gasten.'
                    : 'By uploading, you grant Sanjay & Dewie permission to preserve these memories and share them with fellow guests.'}
                </label>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer / Sticky Action */}
        {uploadPhase !== 'celebrating' && (
          <div className="px-6 py-4 border-t border-[var(--border)] bg-[var(--paper-2)] flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={uploadPhase === 'uploading'}
              className="px-4 py-2.5 text-xs font-semibold text-[var(--ink-soft)] hover:text-[var(--ink)] rounded-xl transition-colors disabled:opacity-50"
            >
              {isNl ? 'Annuleren' : 'Cancel'}
            </button>

            <button
              type="button"
              onClick={handleStartUpload}
              disabled={!consentGiven || uploadPhase === 'uploading'}
              className="px-6 py-2.5 text-xs font-semibold text-white bg-[var(--accent)] hover:opacity-95 rounded-xl transition-all shadow-xs disabled:opacity-50 flex items-center gap-2"
            >
              {uploadPhase === 'uploading' ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{isNl ? 'Bezig met uploaden...' : 'Uploading...'}</span>
                </>
              ) : (
                <>
                  <span>Uploaden starten</span>
                  <span>→</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
