import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/components/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Zap, Menu, X } from 'lucide-react';

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

const Header = () => {
  const { t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const scrollToSection = (sectionId) => {
    scrollToSectionWithOffset(sectionId);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isMobileMenuOpen
          ? 'bg-white/95 backdrop-blur-md shadow-lg shadow-slate-300/30'
          : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => scrollToSection('hero')}
            className="group flex min-w-0 items-center gap-2"
            aria-label="POWER TECH Home"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-700 transition-transform duration-300 group-hover:scale-110 sm:h-10 sm:w-10">
              <Zap className="h-5 w-5 text-white sm:h-6 sm:w-6" />
            </div>
            <span className="truncate text-base font-bold text-slate-900 sm:text-xl">POWER TECH</span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('hero')}
              className="font-medium text-slate-700 transition-colors duration-300 hover:text-cyan-700"
            >
              {t?.nav?.home || 'Home'}
            </button>
            <button
              onClick={() => scrollToSection('services')}
              className="font-medium text-slate-700 transition-colors duration-300 hover:text-cyan-700"
            >
              {t?.nav?.services || 'Services'}
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="font-medium text-slate-700 transition-colors duration-300 hover:text-cyan-700"
            >
              {t?.nav?.about || 'About'}
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="font-medium text-slate-700 transition-colors duration-300 hover:text-cyan-700"
            >
              {t?.nav?.contact || 'Contact'}
            </button>
            <LanguageSwitcher />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <LanguageSwitcher />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-xl p-2 text-slate-900"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="mt-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-300/20 md:hidden">
            <div className="flex flex-col gap-3">
              <button
                onClick={() => scrollToSection('hero')}
                className="rounded-2xl bg-slate-50 px-4 py-3 text-left font-medium text-slate-700 transition-colors duration-300 hover:bg-cyan-50 hover:text-cyan-700"
              >
                {t?.nav?.home || 'Home'}
              </button>
              <button
                onClick={() => scrollToSection('services')}
                className="rounded-2xl bg-slate-50 px-4 py-3 text-left font-medium text-slate-700 transition-colors duration-300 hover:bg-cyan-50 hover:text-cyan-700"
              >
                {t?.nav?.services || 'Services'}
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="rounded-2xl bg-slate-50 px-4 py-3 text-left font-medium text-slate-700 transition-colors duration-300 hover:bg-cyan-50 hover:text-cyan-700"
              >
                {t?.nav?.about || 'About'}
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="rounded-2xl bg-slate-50 px-4 py-3 text-left font-medium text-slate-700 transition-colors duration-300 hover:bg-cyan-50 hover:text-cyan-700"
              >
                {t?.nav?.contact || 'Contact'}
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
    {isMobileMenuOpen && <div className="fixed inset-0 z-40 bg-slate-950/20 backdrop-blur-[1px] md:hidden" onClick={() => setIsMobileMenuOpen(false)} />}
    </>
  );
};

export default Header;
