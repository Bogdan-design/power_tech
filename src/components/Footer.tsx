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
    <footer className="border-t border-slate-200 bg-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-700">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">POWER TECH</span>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              {t?.footer?.tagline || 'Professional Electrical Installations'}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-slate-900 font-semibold mb-4">{t?.footer?.sections || 'Sections'}</h3>
            <div className="space-y-2">
              {links.map((link, index) => (
                <button
                  key={index}
                  onClick={() => scrollToSection(link.id)}
                  className="block text-sm text-slate-600 transition-colors duration-300 hover:text-cyan-700"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-slate-900 font-semibold mb-4">{t?.contact?.title || 'Contact'}</h3>
            <div className="space-y-2 text-sm text-slate-600">
              <p>{companyInfo.address.street}</p>
              <p>{companyInfo.address.postalCode} {companyInfo.address.city}, {companyInfo.address.country}</p>
              {companyInfo.phones.map((phone) => (
                <p key={phone.href}>
                  <a href={`tel:${phone.href}`} className="transition-colors duration-300 hover:text-cyan-700">
                    {phone.value}
                  </a>
                </p>
              ))}
              <p>
                <a href={`mailto:${companyInfo.email}`} className="transition-colors duration-300 hover:text-cyan-700">
                  {companyInfo.email}
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200">
          <p className="text-center text-slate-500 text-sm">
            © {new Date().getFullYear()} POWER TECH Sp. z o.o. {t?.footer?.rights || 'All rights reserved.'}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
