import React from 'react';
import { useLanguage } from '@/components/LanguageContext';
import { Award, Users, MapPinned, ShieldCheck } from 'lucide-react';

const About = () => {
  const { t, language } = useLanguage();

  const highlights = [
    { icon: Award, value: '15+', label: { pl: 'Lat doświadczenia', de: 'Jahre Erfahrung', en: 'Years experience' } },
    { icon: Users, value: '100+', label: { pl: 'Zrealizowanych projektów', de: 'Abgeschlossene Projekte', en: 'Completed projects' } },
    { icon: MapPinned, value: 'EU', label: { pl: 'Realizacje w Europie', de: 'Projekte in Europa', en: 'Projects across Europe' } },
    { icon: ShieldCheck, value: '100%', label: { pl: 'Zgodność z normami', de: 'Normkonformität', en: 'Standards compliance' } },
  ];

  const contentParagraphs = t?.about?.content || [
    'POWER TECH Sp. z o.o. is a leading company specializing in the design and execution of electrical installations.'
  ];

  return (
    <section id="about" className="bg-white py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-16 max-w-2xl">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-amber-500" />
            <span className="font-tech text-xs uppercase tracking-[0.3em] text-amber-600">The company</span>
          </div>
          <h2 className="font-display mb-4 text-4xl font-bold text-slate-950 md:text-5xl">
            {t?.about?.title || 'About POWER TECH'}
          </h2>
          <p className="text-lg text-slate-600">
            {t?.about?.subtitle || 'Your partner in professional electrical installations'}
          </p>
        </div>

        <div className="grid items-stretch gap-10 lg:grid-cols-2">
          {/* Image — real work, framed like a technical plate */}
          <div className="relative">
            <div className="relative h-full min-h-[380px] overflow-hidden border border-slate-200 bg-slate-950">
              <img
                src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80"
                alt="Electrical engineer working on an industrial installation"
                className="h-full w-full object-cover opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
              {/* corner registration marks */}
              <span className="absolute left-4 top-4 h-4 w-4 border-l border-t border-amber-400/70" />
              <span className="absolute right-4 top-4 h-4 w-4 border-r border-t border-amber-400/70" />
              <span className="absolute bottom-4 left-4 h-4 w-4 border-b border-l border-amber-400/70" />
              <span className="absolute bottom-4 right-4 h-4 w-4 border-b border-r border-amber-400/70" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <p className="font-tech text-[11px] uppercase tracking-[0.3em] text-amber-400">Execution ready</p>
                <p className="mt-3 max-w-sm text-lg font-semibold text-white">
                  From structured cabling to tested handover — every stage organized for industrial delivery.
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col">
            <div className="mb-8 space-y-5">
              {contentParagraphs.map((paragraph, index) => (
                <p key={index} className="leading-relaxed text-slate-700">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Highlights — spec sheet */}
            <div className="mt-auto grid grid-cols-2 gap-px border border-slate-200 bg-slate-200">
              {highlights.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="group bg-white p-5 transition-colors duration-300 hover:bg-slate-950">
                    <Icon className="mb-3 h-6 w-6 text-amber-500" strokeWidth={2} />
                    <div className="font-display text-3xl font-bold text-slate-950 transition-colors duration-300 group-hover:text-white">
                      {item.value}
                    </div>
                    <div className="mt-1 text-sm text-slate-600 transition-colors duration-300 group-hover:text-slate-300">
                      {item.label[language] || item.label.en}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
