import React from 'react';
import { useLanguage } from '@/components/LanguageContext';
import { ArrowRight, ShieldCheck, Cable, Server } from 'lucide-react';

const scrollToSectionWithOffset = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (!element) {
    return;
  }

  const headerOffset = 96;
  const elementTop = element.getBoundingClientRect().top + window.scrollY;
  const targetPosition = Math.max(elementTop - headerOffset, 0);

  window.scrollTo({
    top: targetPosition,
    behavior: 'smooth',
  });
};

const Hero = () => {
  const { t } = useLanguage();
  const stats = [
    { icon: Cable, code: '01', label: 'Industrial cabling' },
    { icon: Server, code: '02', label: 'Server rooms & racks' },
    { icon: ShieldCheck, code: '03', label: 'Tested & documented' },
  ];

  const scrollToContact = () => {
    scrollToSectionWithOffset('contact');
  };

  const scrollToServices = () => {
    scrollToSectionWithOffset('services');
  };

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center overflow-hidden bg-slate-950 pt-28 pb-16 sm:pt-32"
    >
      {/* Background: real site photo, ground it in graphite */}
      <div className="absolute inset-0">
        <img
          src="/hero-construction-electricians.png"
          alt="Electrical installation team working on a construction site"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-40"
        />
        <div className="blueprint-grid absolute inset-0 opacity-60" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,16,0.94)_0%,rgba(2,6,16,0.78)_45%,rgba(2,6,16,0.55)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_right_top,rgba(245,158,11,0.14),transparent_45%)]" />
        {/* left accent rail */}
        <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-amber-400/40 to-transparent" />
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-3xl">
          {/* Technical kicker */}
          <div className="mb-6 flex items-center gap-3 animate-fade-in">
            <span className="h-2 w-2 shrink-0 bg-amber-400 shadow-[0_0_12px_2px_rgba(245,158,11,0.7)]" />
            <span className="font-tech text-[11px] uppercase tracking-[0.3em] text-amber-400 sm:text-xs">
              Electrical · Low-current · Server rooms
            </span>
          </div>

          <h1 className="font-display mb-5 text-5xl font-bold leading-[1.02] text-white animate-fade-in sm:text-6xl md:text-7xl">
            {t?.hero?.title || 'POWER TECH'}
          </h1>

          <p className="mb-6 max-w-2xl text-lg font-medium text-amber-100/90 animate-fade-in-delay-1 sm:text-xl md:text-2xl">
            {t?.hero?.subtitle || 'Professional Electrical Installation'}
          </p>

          <p className="mb-10 max-w-2xl text-base leading-relaxed text-slate-300 animate-fade-in-delay-2 sm:text-lg">
            {t?.hero?.description || 'We specialize in comprehensive electrical solutions.'}
          </p>

          {/* Actions */}
          <div className="mb-14 flex flex-col gap-3 animate-fade-in-delay-3 sm:flex-row sm:items-center">
            <button
              onClick={scrollToContact}
              className="group inline-flex items-center justify-center gap-2 bg-amber-400 px-7 py-4 font-semibold text-slate-950 transition-colors duration-300 hover:bg-amber-300"
            >
              {t?.hero?.cta || 'Contact Us'}
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <button
              onClick={scrollToServices}
              className="font-tech inline-flex items-center justify-center gap-2 border border-slate-700 px-7 py-4 text-sm uppercase tracking-wider text-slate-200 transition-colors duration-300 hover:border-amber-400 hover:text-amber-400"
            >
              {t?.nav?.services || 'Services'}
            </button>
          </div>

          {/* Technical stat rail */}
          <div className="grid max-w-2xl grid-cols-1 border-t border-slate-800 sm:grid-cols-3 animate-fade-in-delay-3">
            {stats.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.code}
                  className="flex items-center gap-3 border-b border-slate-800 py-4 sm:border-b-0 sm:border-r sm:px-5 sm:last:border-r-0 sm:first:pl-0"
                >
                  <Icon className="h-5 w-5 shrink-0 text-amber-400" strokeWidth={2} />
                  <div className="min-w-0">
                    <p className="font-tech text-[10px] text-slate-500">{item.code}</p>
                    <p className="text-xs font-medium text-slate-200 sm:text-sm">{item.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
