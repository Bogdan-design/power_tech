import React from 'react';
import { useLanguage } from '@/components/LanguageContext';
import { Zap } from 'lucide-react';
import { companyInfo } from '@/lib/companyInfo';

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

const Footer = () => {
  const { t } = useLanguage();

  const scrollToSection = (sectionId) => {
    scrollToSectionWithOffset(sectionId);
  };

  const links = [
    { label: t?.nav?.home || 'Home', id: 'hero' },
    { label: t?.nav?.services || 'Services', id: 'services' },
    { label: t?.nav?.about || 'About', id: 'about' },
    { label: t?.nav?.contact || 'Contact', id: 'contact' }
  ];

  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      {/* live current line at the top edge */}
      <div className="current-line h-px w-full" />
      <div className="container mx-auto px-4 py-14">
        <div className="mb-10 grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center border border-slate-800 bg-slate-900">
                <Zap className="h-5 w-5 text-amber-400" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display text-lg font-bold text-white">POWER TECH</span>
                <span className="font-tech text-[10px] uppercase tracking-[0.25em] text-slate-500">Sp. z o.o.</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              {t?.footer?.tagline || 'Professional Electrical Installations'}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-tech mb-4 text-[11px] uppercase tracking-[0.25em] text-slate-500">
              {t?.footer?.sections || 'Sections'}
            </h3>
            <div className="space-y-2">
              {links.map((link, index) => (
                <button
                  key={index}
                  onClick={() => scrollToSection(link.id)}
                  className="block text-sm text-slate-300 transition-colors duration-300 hover:text-amber-400"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-tech mb-4 text-[11px] uppercase tracking-[0.25em] text-slate-500">
              {t?.contact?.title || 'Contact'}
            </h3>
            <div className="space-y-2 text-sm text-slate-300">
              <p>{companyInfo.address.street}</p>
              <p>{companyInfo.address.postalCode} {companyInfo.address.city}, {companyInfo.address.country}</p>
              {companyInfo.phones.map((phone) => (
                <p key={phone.href}>
                  <a href={`tel:${phone.href}`} className="transition-colors duration-300 hover:text-amber-400">
                    {phone.value}
                  </a>
                </p>
              ))}
              <p>
                <a href={`mailto:${companyInfo.email}`} className="transition-colors duration-300 hover:text-amber-400">
                  {companyInfo.email}
                </a>
              </p>
              <p className="font-tech pt-2 text-xs text-slate-500">
                NIP {companyInfo.registry.nip} · REGON {companyInfo.registry.regon}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-6">
          <p className="font-tech text-center text-xs text-slate-500">
            © {new Date().getFullYear()} POWER TECH Sp. z o.o. — {t?.footer?.rights || 'All rights reserved.'}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
