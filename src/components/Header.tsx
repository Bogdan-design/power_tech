import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/components/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Zap, Menu, X } from 'lucide-react';

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

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-md shadow-lg shadow-slate-300/30'
          : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => scrollToSection('hero')}
            className="flex items-center gap-2 group"
            aria-label="POWER TECH Home"
          >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-700 transition-transform duration-300 group-hover:scale-110">
                <Zap className="w-6 h-6 text-white" />
              </div>
            <span className="text-xl font-bold text-slate-900">POWER TECH</span>
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
          <div className="flex md:hidden items-center gap-4">
            <LanguageSwitcher />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-900"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="mt-4 border-t border-slate-200 py-4 md:hidden">
            <div className="flex flex-col gap-4">
              <button
                onClick={() => scrollToSection('hero')}
                className="text-left font-medium text-slate-700 transition-colors duration-300 hover:text-cyan-700"
              >
                {t?.nav?.home || 'Home'}
              </button>
              <button
                onClick={() => scrollToSection('services')}
                className="text-left font-medium text-slate-700 transition-colors duration-300 hover:text-cyan-700"
              >
                {t?.nav?.services || 'Services'}
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="text-left font-medium text-slate-700 transition-colors duration-300 hover:text-cyan-700"
              >
                {t?.nav?.about || 'About'}
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="text-left font-medium text-slate-700 transition-colors duration-300 hover:text-cyan-700"
              >
                {t?.nav?.contact || 'Contact'}
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
