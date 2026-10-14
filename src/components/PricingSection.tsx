import React from 'react';
import { Language, PricingPlan } from '../types';
import { translations } from '../data/translations';

interface PricingSectionProps {
  lang: Language;
  onSelectPlan: (plan: PricingPlan) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  lang,
  onSelectPlan,
}) => {
  const t = translations[lang].pricing;

  const plans: PricingPlan[] = [
    {
      id: 'free',
      name: t.free.title,
      price: t.free.price,
      priceNumber: 0,
      period: t.free.period,
      description: t.free.desc,
      features: [
        t.free.f1,
        t.free.f2,
        t.free.f3,
        t.free.f4,
        t.free.f5,
      ],
    },
    {
      id: 'event',
      name: t.event.title,
      price: t.event.price,
      priceNumber: 49,
      period: t.event.period,
      badge: t.event.badge,
      highlight: true,
      description: t.event.desc,
      features: [
        t.event.f1,
        t.event.f2,
        t.event.f3,
        t.event.f4,
        t.event.f5,
        t.event.f6,
      ],
    },
    {
      id: 'event_plus',
      name: t.eventPlus.title,
      price: t.eventPlus.price,
      priceNumber: 69,
      period: t.eventPlus.period,
      description: t.eventPlus.desc,
      features: [
        t.eventPlus.f1,
        t.eventPlus.f2,
        t.eventPlus.f3,
        t.eventPlus.f4,
        t.eventPlus.f5,
        t.eventPlus.f6,
      ],
    },
  ];

  return (
    <section id="prijzen" className="py-16 lg:py-24 border-b border-[#e7ded1] bg-[#faf7f2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-14 text-center max-w-3xl mx-auto">
          <div className="text-xs font-mono-code font-semibold tracking-wider text-[#c2410c] uppercase mb-2">
            {t.kicker}
          </div>
          <h2
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1c1917] tracking-tight font-sans-clean mb-3"
            style={{ textWrap: 'balance' }}
          >
            {t.title}
          </h2>
          <p className="text-sm text-[#78716c]">{t.note}</p>
        </div>

        {/* 3-Column Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-2xl p-7 flex flex-col justify-between border transition-all ${
                plan.highlight
                  ? 'bg-white border-[#1c1917] shadow-lg ring-1 ring-[#1c1917] relative'
                  : 'bg-white/80 border-[#e2d8ca] shadow-sm hover:border-[#cfc2af]'
              }`}
            >
              {plan.badge && (
                <div className="text-[11px] font-mono-code font-bold uppercase tracking-wider text-[#c2410c] mb-2">
                  ★ {plan.badge}
                </div>
              )}

              <div>
                <h3 className="text-xl font-bold text-[#1c1917] font-sans-clean">
                  {plan.name}
                </h3>
                <div className="mt-3 mb-4 flex items-baseline gap-2">
                  <span className="text-4xl font-bold font-sans-clean text-[#1c1917] tabular-nums">
                    {plan.price}
                  </span>
                  <span className="text-xs text-[#78716c]">{plan.period}</span>
                </div>
                <p className="text-xs text-[#57534e] pb-5 border-b border-[#f0e8db] leading-relaxed">
                  {plan.description}
                </p>

                <ul className="py-6 space-y-3 text-xs text-[#292524]">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="text-[#c2410c] font-bold shrink-0">✓</span>
                      <span className="leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-[#f0e8db]">
                <button
                  type="button"
                  onClick={() => onSelectPlan(plan)}
                  className={`w-full py-3 px-4 text-xs font-semibold rounded-lg transition-all text-center ${
                    plan.highlight
                      ? 'bg-[#1c1917] hover:bg-[#292524] text-white shadow-xs'
                      : 'bg-[#f4ebe0] hover:bg-[#e9decf] text-[#1c1917]'
                  }`}
                >
                  {plan.id === 'free'
                    ? t.free.cta
                    : plan.id === 'event'
                    ? t.event.cta
                    : t.eventPlus.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
