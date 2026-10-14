import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';

interface PhotographerFlowProps {
  lang: Language;
  onOpenPortal: () => void;
}

export const PhotographerFlow: React.FC<PhotographerFlowProps> = ({
  lang,
  onOpenPortal,
}) => {
  const t = translations[lang].b2b;
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [deliverySent, setDeliverySent] = useState(false);

  const handleSimulateUpload = () => {
    setUploadProgress(15);
    setDeliverySent(false);

    const int1 = setTimeout(() => setUploadProgress(48), 350);
    const int2 = setTimeout(() => setUploadProgress(82), 700);
    const int3 = setTimeout(() => {
      setUploadProgress(100);
      setDeliverySent(true);
    }, 1100);

    return () => {
      clearTimeout(int1);
      clearTimeout(int2);
      clearTimeout(int3);
    };
  };

  const steps = [
    { num: '01', title: t.step1Title, desc: t.step1Desc },
    { num: '02', title: t.step2Title, desc: t.step2Desc },
    { num: '03', title: t.step3Title, desc: t.step3Desc },
    { num: '04', title: t.step4Title, desc: t.step4Desc },
  ];

  return (
    <section id="fotograaf" className="py-16 lg:py-24 border-b border-[#e7ded1] bg-[#faf7f2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="text-xs font-mono-code font-semibold tracking-wider text-[#c2410c] uppercase mb-2">
            {t.kicker}
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1c1917] tracking-tight font-sans-clean">
            {t.title}
          </h2>
          <p className="text-base text-[#57534e] max-w-2xl mt-3 leading-relaxed">
            {t.copy}
          </p>
        </div>

        {/* 2-Column Split: Editorial Workflow & Real Visual */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center mb-16">
          {/* Steps List */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-4">
              {steps.map((step) => (
                <div
                  key={step.num}
                  className="p-4.5 bg-white rounded-xl border border-[#e2d8ca] flex items-start gap-4"
                >
                  <span className="font-mono-code text-xs font-bold text-[#c2410c] pt-0.5">
                    {step.num}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-[#1c1917] font-sans-clean">
                      {step.title}
                    </h3>
                    <p className="text-xs text-[#57534e] mt-1 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenPortal}
                className="px-6 py-3 text-sm font-semibold text-white bg-[#1c1917] hover:bg-[#292524] rounded-lg transition-colors"
              >
                Start als fotograaf →
              </button>
            </div>
          </div>

          {/* Visual Asset */}
          <div className="lg:col-span-6">
            <figure className="rounded-2xl overflow-hidden border border-[#d8ccbc] bg-[#eee5d8] shadow-sm">
              <img
                src="/src/assets/images/photographer_delivery_workflow_1791985661699.jpg"
                alt="Professional event photographer reviewing photographs on laptop"
                className="w-full h-[360px] sm:h-[420px] object-cover"
                referrerPolicy="no-referrer"
              />
              <figcaption className="p-4 text-xs text-[#78716c] font-mono-code bg-[#f2e9dc] border-t border-[#e2d8ca]">
                Geen WeTransfer links die na 7 dagen verlopen: één live levering in het album.
              </figcaption>
            </figure>
          </div>
        </div>

        {/* Interactive Photographer Upload Demo Sandbox */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#e2d8ca] shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-[#f0e8db] gap-2">
            <div>
              <h3 className="text-base font-bold text-[#1c1917] font-sans-clean">
                {t.portalDemoTitle}
              </h3>
              <p className="text-xs text-[#78716c] font-mono-code">
                Album: daanensophie.fesafotos.nl · Pro-ingang
              </p>
            </div>
            <div className="text-xs text-[#57534e] font-mono-code">
              Status: <span className="font-bold text-[#166534]">Gekoppeld als fotograaf</span>
            </div>
          </div>

          <div
            onClick={handleSimulateUpload}
            className="border-2 border-dashed border-[#d6cebf] hover:border-[#1c1917] rounded-xl p-8 text-center cursor-pointer bg-[#faf7f2] transition-colors"
          >
            <div className="text-3xl mb-2">📸</div>
            <div className="text-sm font-bold text-[#1c1917] mb-1">
              {t.dropzoneTitle}
            </div>
            <p className="text-xs text-[#78716c] mb-4">
              {t.dropzoneDesc}
            </p>
            <button
              type="button"
              className="px-4 py-2 text-xs font-semibold text-[#1c1917] bg-white border border-[#d6cebf] rounded-lg hover:bg-[#f2e9dc]"
            >
              {t.btnSimulateUpload}
            </button>
          </div>

          {/* Upload Progress Simulation */}
          {uploadProgress !== null && (
            <div className="mt-5 p-4 rounded-xl bg-[#f8f5ee] border border-[#e2d8ca]">
              <div className="flex items-center justify-between text-xs font-mono-code text-[#44403c] mb-1.5">
                <span>Upload batch: DSC_4910.JPG - DSC_4914.JPG (Original 45MP)</span>
                <span className="tabular-nums font-bold">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-[#e2d8ca] rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-[#1c1917] h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>

              {deliverySent && (
                <div className="mt-3 text-xs text-[#166534] font-medium flex items-center gap-1.5">
                  <span>✓</span>
                  <span>{t.uploadSuccessNotice}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
