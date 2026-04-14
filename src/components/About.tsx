import React from 'react';
import { useLanguage } from '@/components/LanguageContext';
import { Award, Users } from 'lucide-react';

const About = () => {
  const { t, language } = useLanguage();

  const highlights = [
    { icon: Award, value: '15+', label: { pl: 'Lat doświadczenia', de: 'Jahre Erfahrung', en: 'Years Experience' } },
    { icon: Users, value: '100+', label: { pl: 'Zrealizowanych projektów', de: 'Abgeschlossene Projekte', en: 'Completed Projects' } },
  ];

  const contentParagraphs = t?.about?.content || [
    'POWER TECH Sp. z o.o. is a leading company specializing in the design and execution of electrical installations.'
  ];

  return (
    <section id="about" className="bg-slate-50 py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="mx-auto mb-5 inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200">
            Company
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            {t?.about?.title || 'About POWER TECH'}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            {t?.about?.subtitle || 'Your partner in professional electrical installations'}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative group">
            <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-cyan-500/50 via-cyan-300/10 to-amber-400/20 opacity-70 blur transition-opacity duration-300 group-hover:opacity-100"></div>
            <div className="relative h-[420px] overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-slate-200/70">
              <img
                src="https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=1200&q=80"
                alt="Professional team working on electrical installations"
                className="h-full w-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <p className="text-xs uppercase tracking-[0.35em] text-cyan-200">Execution ready</p>
                <p className="mt-3 max-w-sm text-lg font-semibold text-white">
                  From structured cabling to tested handover, every stage is organized for industrial delivery.
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <div className="space-y-6 mb-8">
              {contentParagraphs.map((paragraph, index) => (
                <p key={index} className="text-lg leading-relaxed text-slate-700">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Highlights Grid */}
            <div className="grid gap-4 sm:grid-cols-2">
              {highlights.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className="rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-300 hover:border-cyan-400/40 hover:shadow-lg hover:shadow-cyan-100"
                  >
                    <Icon className="mb-2 h-8 w-8 text-cyan-300" />
                    <div className="text-3xl font-bold text-slate-900 mb-1">{item.value}</div>
                    <div className="text-sm text-slate-600">
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
