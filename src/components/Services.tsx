import React from 'react';
import { useLanguage } from '@/components/LanguageContext';
import { Cable, CheckCircle2, Network, Server, Tag, ClipboardCheck } from 'lucide-react';

const serviceIcons = [Cable, CheckCircle2, Network, Server, Tag, ClipboardCheck];

const Services = () => {
  const { t } = useLanguage();

  const serviceItems = t?.services?.items || [];

  return (
    <section id="services" className="relative overflow-hidden bg-slate-50 py-24">
      <div className="tech-grid absolute inset-0 opacity-70" />
      <div className="container relative z-10 mx-auto px-4">
        {/* Section Header */}
        <div className="mb-16 max-w-2xl">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-amber-500" />
            <span className="font-tech text-xs uppercase tracking-[0.3em] text-amber-600">Scope of work</span>
          </div>
          <h2 className="font-display mb-4 text-4xl font-bold text-slate-950 md:text-5xl">
            {t?.services?.title || 'Our Services'}
          </h2>
          <p className="text-lg text-slate-600">
            {t?.services?.subtitle || 'Comprehensive electrical solutions tailored to your needs'}
          </p>
        </div>

        {/* Services Grid — technical spec cards */}
        <div className="grid grid-cols-1 gap-px border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-3">
          {serviceItems.map((service, index) => {
            const Icon = serviceIcons[index % serviceIcons.length];
            const code = String(index + 1).padStart(2, '0');
            return (
              <div
                key={index}
                className="group relative bg-white p-8 transition-colors duration-300 hover:bg-slate-950"
              >
                {/* index + accent */}
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center border border-slate-200 bg-slate-50 transition-colors duration-300 group-hover:border-amber-400/40 group-hover:bg-slate-900">
                    <Icon className="h-6 w-6 text-slate-900 transition-colors duration-300 group-hover:text-amber-400" strokeWidth={2} />
                  </div>
                  <span className="font-tech text-sm text-slate-300 transition-colors duration-300 group-hover:text-amber-400">
                    {code}
                  </span>
                </div>

                <h3 className="font-display mb-3 text-xl font-semibold text-slate-950 transition-colors duration-300 group-hover:text-white">
                  {service?.title || 'Service Title'}
                </h3>

                <p className="text-sm leading-relaxed text-slate-600 transition-colors duration-300 group-hover:text-slate-300">
                  {service?.description || 'Service Description'}
                </p>

                {/* live accent line on hover */}
                <div className="absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-amber-400 transition-transform duration-300 group-hover:scale-x-100" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
