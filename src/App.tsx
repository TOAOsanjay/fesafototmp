import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { NameChecker } from './components/NameChecker';
import { TableCardStudio } from './components/TableCardStudio';
import { PartyWall } from './components/PartyWall';
import { AlbumFinder } from './components/AlbumFinder';
import { PricingSection } from './components/PricingSection';
import { PhotographerFlow } from './components/PhotographerFlow';
import { BeamerModal } from './components/BeamerModal';
import { Footer } from './components/Footer';
import { initialPhotos, demoAlbumsList } from './data/sampleAlbums';
import { AddressMode, DemoAlbum, Language, PhotoItem, PricingPlan } from './types';

export default function App() {
  const [lang, setLang] = useState<Language>('nl');
  const [photos, setPhotos] = useState<PhotoItem[]>(initialPhotos);
  const [currentSlug, setCurrentSlug] = useState('daanensophie');

  // Modals state
  const [isBeamerOpen, setIsBeamerOpen] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<DemoAlbum | null>(null);
  const [reservationModalData, setReservationModalData] = useState<{
    slug: string;
    mode: AddressMode;
  } | null>(null);
  const [selectedPlanModal, setSelectedPlanModal] = useState<PricingPlan | null>(null);
  const [isPhotographerModalOpen, setIsPhotographerModalOpen] = useState(false);

  // Reservation form state
  const [eventDate, setEventDate] = useState('2026-07-18');
  const [eventType, setEventType] = useState('Bruiloft');
  const [hostEmail, setHostEmail] = useState('');
  const [reservationSuccess, setReservationSuccess] = useState(false);

  // Photographer magic-link state
  const [proEmail, setProEmail] = useState('');
  const [proMagicSent, setProMagicSent] = useState(false);

  const handleAddPhoto = (newPhoto: PhotoItem) => {
    setPhotos((prev) => [newPhoto, ...prev]);
  };

  const handleOpenCheck = () => {
    const el = document.getElementById('werk');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenAlbumHero = () => {
    setSelectedAlbum(demoAlbumsList[0]);
  };

  const handleReserveSuccess = (slug: string, mode: AddressMode) => {
    setCurrentSlug(slug);
    setReservationModalData({ slug, mode });
    setReservationSuccess(false);
  };

  const handleCompleteReservation = (e: React.FormEvent) => {
    e.preventDefault();
    setReservationSuccess(true);
    setTimeout(() => {
      setReservationModalData(null);
      setReservationSuccess(false);
      // scroll to TableCardStudio so they can see their card
      const el = document.getElementById('stage-2');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 1800);
  };

  const handlePhotographerMagicLink = (e: React.FormEvent) => {
    e.preventDefault();
    setProMagicSent(true);
    setTimeout(() => {
      setIsPhotographerModalOpen(false);
      setProMagicSent(false);
    }, 2200);
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#1c1917] flex flex-col font-sans-clean">
      {/* 3-Zone Top Bar */}
      <Navbar
        lang={lang}
        onLanguageChange={setLang}
        onOpenCheck={handleOpenCheck}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          lang={lang}
          onOpenCheck={handleOpenCheck}
          onOpenAlbum={handleOpenAlbumHero}
        />

        {/* Stage 1.0 · Kies een naam (Live Subdomain & Domain Checker) */}
        <NameChecker
          lang={lang}
          onReserveSuccess={handleReserveSuccess}
        />

        {/* Stage 2.0 · Deel het adres (Interactive Table Card & QR Studio) */}
        <div id="stage-2">
          <TableCardStudio
            lang={lang}
            currentSlug={currentSlug}
          />
        </div>

        {/* Stage 3.0 · Het feest (Live Interactive Wall & Guest Upload Simulator) */}
        <PartyWall
          lang={lang}
          photos={photos}
          onAddPhoto={handleAddPhoto}
          onOpenBeamer={() => setIsBeamerOpen(true)}
        />

        {/* Stage 4.0 · Daarna (Het album blijft online & Album Finder) */}
        <AlbumFinder
          lang={lang}
          demoAlbums={demoAlbumsList}
          onSelectAlbum={(alb) => setSelectedAlbum(alb)}
        />

        {/* Stage 5.0 · Prijzen (Geen abonnement, transparant eenmalig) */}
        <PricingSection
          lang={lang}
          onSelectPlan={(plan) => setSelectedPlanModal(plan)}
        />

        {/* Stage 6.0 · Fotograaf-flow (B2B Pro Delivery) */}
        <PhotographerFlow
          lang={lang}
          onOpenPortal={() => setIsPhotographerModalOpen(true)}
        />
      </main>

      {/* Quiet Editorial Footer */}
      <Footer
        lang={lang}
        onLanguageChange={setLang}
        onOpenCheck={handleOpenCheck}
      />

      {/* Beamer Slideshow Modal */}
      <BeamerModal
        isOpen={isBeamerOpen}
        photos={photos}
        onClose={() => setIsBeamerOpen(false)}
        albumSlug={currentSlug}
      />

      {/* Reservation Confirmation Modal */}
      {reservationModalData && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setReservationModalData(null)}
        >
          <div
            className="bg-[#faf7f2] rounded-2xl max-w-lg w-full p-6 sm:p-8 border border-[#d6cebf] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {reservationSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 bg-[#bbf7d0] text-[#166534] rounded-full flex items-center justify-center text-xl font-bold mx-auto">
                  ✓
                </div>
                <h3 className="text-xl font-bold text-[#1c1917] font-sans-clean">
                  Adres gereserveerd!
                </h3>
                <p className="font-mono-code text-sm text-[#166534] font-semibold">
                  {reservationModalData.slug}.fesafotos.nl
                </p>
                <p className="text-xs text-[#57534e]">
                  We hebben een bevestiging gestuurd naar {hostEmail || 'jouw e-mail'}. Jouw album en QR-tafelkaart zijn direct gereed.
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#e2d8ca]">
                  <div>
                    <span className="text-xs font-mono-code text-[#c2410c] uppercase font-bold">
                      Stap 1.1 · Bevestig reservering
                    </span>
                    <h3 className="text-lg font-bold text-[#1c1917] font-sans-clean">
                      Claim jouw adres
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setReservationModalData(null)}
                    className="text-xs text-[#78716c] hover:text-[#1c1917]"
                  >
                    ✕
                  </button>
                </div>

                <div className="p-3 bg-white rounded-xl border border-[#e2d8ca] mb-5 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-[#78716c]">Gekozen adres</div>
                    <div className="text-sm font-bold font-mono-code text-[#1c1917]">
                      {reservationModalData.slug}
                      {reservationModalData.mode === 'subdomain'
                        ? '.fesafotos.nl'
                        : '.nl'}
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-[#166534] bg-[#f0fdf4] px-2.5 py-1 rounded">
                    Beschikbaar
                  </span>
                </div>

                <form onSubmit={handleCompleteReservation} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#44403c] mb-1">
                        Type viering
                      </label>
                      <select
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-[#d6cebf] bg-white focus:outline-none"
                      >
                        <option>Bruiloft</option>
                        <option>Verjaardag / Jubileum</option>
                        <option>Festival / Rooftop</option>
                        <option>Bedrijfsevent</option>
                        <option>Diner & Borrel</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#44403c] mb-1">
                        Datum van feest
                      </label>
                      <input
                        type="date"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-[#d6cebf] bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#44403c] mb-1">
                      E-mailadres organisator
                    </label>
                    <input
                      type="email"
                      required
                      value={hostEmail}
                      onChange={(e) => setHostEmail(e.target.value)}
                      placeholder="bijv. daan@example.com"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-[#d6cebf] bg-white focus:outline-none"
                    />
                    <p className="text-[11px] text-[#78716c] mt-1">
                      Je ontvangt hier direct je beheerlink en QR-export. Geen wachtwoord nodig.
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#e2d8ca] flex justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={() => setReservationModalData(null)}
                      className="px-4 py-2 text-xs font-medium text-[#78716c] hover:text-[#1c1917]"
                    >
                      Annuleren
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-xs font-semibold text-white bg-[#1c1917] hover:bg-[#292524] rounded-lg transition-colors"
                    >
                      Nu activeren →
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Plan Selection Modal */}
      {selectedPlanModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedPlanModal(null)}
        >
          <div
            className="bg-[#faf7f2] rounded-2xl max-w-md w-full p-6 sm:p-7 border border-[#d6cebf] shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#e2d8ca]">
              <div>
                <span className="text-xs font-mono-code text-[#c2410c] uppercase font-bold">
                  Gekozen pakket
                </span>
                <h3 className="text-lg font-bold text-[#1c1917] font-sans-clean">
                  {selectedPlanModal.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPlanModal(null)}
                className="text-xs text-[#78716c] hover:text-[#1c1917]"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-white rounded-xl border border-[#e2d8ca] mb-5">
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold font-sans-clean text-[#1c1917]">
                  {selectedPlanModal.price}
                </span>
                <span className="text-xs text-[#78716c]">
                  {selectedPlanModal.period}
                </span>
              </div>
              <p className="text-xs text-[#57534e] mt-1.5 leading-relaxed">
                {selectedPlanModal.description}
              </p>
            </div>

            <div className="space-y-2 mb-6">
              <div className="text-xs font-bold text-[#1c1917]">Inbegrepen:</div>
              <ul className="space-y-1.5 text-xs text-[#44403c]">
                {selectedPlanModal.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#c2410c] font-bold">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-3 border-t border-[#e2d8ca] flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedPlanModal(null)}
                className="px-4 py-2 text-xs font-medium text-[#78716c]"
              >
                Terug
              </button>
              <button
                type="button"
                onClick={() => {
                  alert(`Pakket ${selectedPlanModal.name} geselecteerd voor jouw feest! Reservering geopend.`);
                  setSelectedPlanModal(null);
                  handleOpenCheck();
                }}
                className="px-5 py-2 text-xs font-semibold text-white bg-[#1c1917] hover:bg-[#292524] rounded-lg"
              >
                Doorgaan met {selectedPlanModal.name} →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Photographer Magic Link Modal */}
      {isPhotographerModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsPhotographerModalOpen(false)}
        >
          <div
            className="bg-[#faf7f2] rounded-2xl max-w-md w-full p-6 sm:p-7 border border-[#d6cebf] shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {proMagicSent ? (
              <div className="py-6 text-center space-y-2">
                <div className="w-10 h-10 bg-[#bbf7d0] text-[#166534] rounded-full flex items-center justify-center font-bold mx-auto">
                  ✓
                </div>
                <h4 className="text-base font-bold text-[#1c1917]">
                  Magic link verstuurd!
                </h4>
                <p className="text-xs text-[#57534e]">
                  Check je inbox op <strong>{proEmail}</strong>. Klik op de link om direct je camera-originals zonder compressie aan te leveren.
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#e2d8ca]">
                  <div>
                    <span className="text-xs font-mono-code text-[#c2410c] uppercase font-bold">
                      B2B Fotograaf Ingang
                    </span>
                    <h3 className="text-base font-bold text-[#1c1917] font-sans-clean">
                      Start met foto's aanleveren
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPhotographerModalOpen(false)}
                    className="text-xs text-[#78716c] hover:text-[#1c1917]"
                  >
                    ✕
                  </button>
                </div>

                <p className="text-xs text-[#57534e] mb-4 leading-relaxed">
                  Vul je e-mailadres in. Je ontvangt direct een veilige magic link waarmee je jezelf koppelt aan feesten van jouw klanten.
                </p>

                <form onSubmit={handlePhotographerMagicLink} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#44403c] mb-1">
                      Fotograaf e-mailadres
                    </label>
                    <input
                      type="email"
                      required
                      value={proEmail}
                      onChange={(e) => setProEmail(e.target.value)}
                      placeholder="studio@fotograaf.nl"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-[#d6cebf] bg-white focus:outline-none"
                    />
                  </div>

                  <div className="pt-3 border-t border-[#e2d8ca] flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsPhotographerModalOpen(false)}
                      className="px-4 py-2 text-xs font-medium text-[#78716c]"
                    >
                      Annuleren
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-xs font-semibold text-white bg-[#1c1917] hover:bg-[#292524] rounded-lg"
                    >
                      Stuur magic link →
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Album Preview Modal */}
      {selectedAlbum && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedAlbum(null)}
        >
          <div
            className="bg-[#faf7f2] rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-[#d6cebf] shadow-2xl p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#e2d8ca]">
              <div>
                <span className="text-xs font-mono-code text-[#c2410c] uppercase font-bold">
                  {selectedAlbum.slug}.fesafotos.nl
                </span>
                <h3 className="text-xl font-bold text-[#1c1917] font-sans-clean">
                  {selectedAlbum.name}
                </h3>
                <div className="text-xs text-[#78716c] font-mono-code mt-0.5">
                  {selectedAlbum.date} · {selectedAlbum.location}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAlbum(null)}
                className="w-8 h-8 rounded-full bg-[#eee5d8] hover:bg-[#e2d8ca] text-sm flex items-center justify-center text-[#1c1917]"
              >
                ✕
              </button>
            </div>

            {/* Album Summary Bar */}
            <div className="grid grid-cols-3 gap-3 p-4 bg-white rounded-xl border border-[#e2d8ca] mb-6 text-center">
              <div>
                <div className="text-lg font-bold text-[#1c1917] tabular-nums">
                  {selectedAlbum.photoCount}
                </div>
                <div className="text-xs text-[#78716c]">Media geüpload</div>
              </div>
              <div>
                <div className="text-lg font-bold text-[#1c1917] tabular-nums">
                  {selectedAlbum.guestCount}
                </div>
                <div className="text-xs text-[#78716c]">Gasten aanwezig</div>
              </div>
              <div>
                <div className="text-lg font-bold text-[#1c1917]">
                  {selectedAlbum.theme}
                </div>
                <div className="text-xs text-[#78716c]">Kaartthema</div>
              </div>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              {photos.map((p) => (
                <div key={p.id} className="relative rounded-lg overflow-hidden border border-black/10 aspect-4/3 bg-black">
                  <img
                    src={p.url}
                    alt={p.caption}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2 text-white">
                    <p className="text-[11px] truncate">{p.caption}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[#e2d8ca] flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-[#78716c]">
                Live beamer presentatie starten voor dit feest?
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedAlbum(null);
                    setIsBeamerOpen(true);
                  }}
                  className="px-4 py-2 text-xs font-semibold bg-[#1c1917] text-white rounded-lg hover:bg-[#292524]"
                >
                  Start Beamer Presentatie 📽️
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
