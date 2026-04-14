import React from 'react';
import { useLanguage } from '@/components/LanguageContext';
import { Cable, CheckCircle2, Network, Server, Tag, ClipboardCheck } from 'lucide-react';

const serviceIcons = [Cable, CheckCircle2, Network, Server, Tag, ClipboardCheck];

const Services = () => {
  const { t } = useLanguage();

  const serviceItems = t?.services?.items || [];

  return (
    <section id="services" className="bg-white py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="mx-auto mb-5 inline-flex items-center rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-amber-200">
            Scope
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            {t?.services?.title || 'Our Services'}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            {t?.services?.subtitle || 'Comprehensive electrical solutions tailored to your needs'}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceItems.map((service, index) => {
            const Icon = serviceIcons[index % serviceIcons.length];
            return (
              <div
                key={index}
                className="group relative rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-xl hover:shadow-cyan-100"
              >
                {/* Icon */}
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-cyan-700 transition-transform duration-300 group-hover:scale-110">
                  <Icon className="w-7 h-7 text-white" />
                </div>

                {/* Title */}
                <h3 className="mb-3 text-xl font-bold text-slate-900 transition-colors duration-300 group-hover:text-cyan-700">
                  {service?.title || 'Service Title'}
                </h3>

                {/* Description */}
                <p className="leading-relaxed text-slate-600">
                  {service?.description || 'Service Description'}
                </p>

                {/* Hover Accent */}
                <div className="absolute bottom-0 left-0 right-0 h-1 origin-left scale-x-0 rounded-b-3xl bg-gradient-to-r from-cyan-400 via-cyan-300 to-amber-300 transition-transform duration-300 group-hover:scale-x-100"></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
