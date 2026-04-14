import React from 'react';
import { useLanguage } from '@/components/LanguageContext';
import { ArrowRight, ShieldCheck, Cable, Factory } from 'lucide-react';

const Hero = () => {
  const { t } = useLanguage();
  const stats = [
    { icon: Cable, label: 'Industrial cabling' },
    { icon: Factory, label: 'Production facilities' },
    { icon: ShieldCheck, label: 'Tested & documented' },
  ];

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-100">
      <div className="absolute inset-0">
        <img
          src="/hero-construction-electricians.png"
          alt="Electrical installation team working on a construction site"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="hero-grid absolute inset-0 opacity-40" />
        <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(255,255,255,0.72),rgba(255,255,255,0.4)_36%,rgba(15,23,42,0.45)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_left_top,rgba(255,255,255,0.6),transparent_30%),radial-gradient(circle_at_right_center,rgba(34,211,238,0.18),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.1),rgba(15,23,42,0.42))]" />
        <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-white/35 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-amber-300/30 blur-3xl" />
        <div className="absolute inset-y-0 right-[10%] hidden w-px bg-gradient-to-b from-transparent via-white/40 to-transparent lg:block" />
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/65 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-slate-800 shadow-lg shadow-slate-900/10">
            Industrial Electrical Systems
          </div>
          <h1 className="mb-6 text-5xl font-bold text-slate-900 drop-shadow-[0_12px_40px_rgba(255,255,255,0.35)] animate-fade-in md:text-7xl">
            {t?.hero?.title || 'POWER TECH'}
          </h1>
          <p className="mb-8 text-2xl font-semibold text-cyan-900 drop-shadow-[0_8px_20px_rgba(255,255,255,0.3)] animate-fade-in-delay-1 md:text-3xl">
            {t?.hero?.subtitle || 'Professional Electrical Installation'}
          </p>
          <p className="mx-auto mb-12 max-w-3xl text-lg leading-relaxed text-slate-800 drop-shadow-[0_8px_20px_rgba(255,255,255,0.3)] animate-fade-in-delay-2 md:text-xl">
            {t?.hero?.description || 'We specialize in comprehensive electrical solutions.'}
          </p>

          <div className="mx-auto mb-12 grid max-w-4xl gap-4 animate-fade-in-delay-2 md:grid-cols-3">
            {stats.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-2xl border border-white/70 bg-white/80 px-5 py-4 backdrop-blur-md shadow-xl shadow-slate-900/10">
                  <Icon className="mx-auto mb-3 h-6 w-6 text-cyan-700" />
                  <p className="text-sm uppercase tracking-[0.25em] text-slate-700">{item.label}</p>
                </div>
              );
            })}
          </div>

          <button
            onClick={scrollToContact}
            className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-cyan-700 px-8 py-4 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/30 animate-fade-in-delay-3"
          >
            {t?.hero?.cta || 'Contact Us'}
            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-white/30 p-2">
          <div className="h-3 w-1.5 rounded-full bg-white/50"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
