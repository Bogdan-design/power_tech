import React from 'react';
import { useLanguage } from '@/components/LanguageContext';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
  const { language, setLanguageCode } = useLanguage();

  return (
    <label className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white/85 px-3 py-2 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-cyan-400/50">
      <Globe className="w-4 h-4 text-blue-400" />
      <select
        value={language}
        onChange={(e) => setLanguageCode(e.target.value as 'pl' | 'en' | 'de')}
        className="bg-transparent text-sm font-medium uppercase text-slate-700 outline-none"
        aria-label="Select language"
      >
        <option value="pl">PL</option>
        <option value="en">EN</option>
        <option value="de">DE</option>
      </select>
    </label>
  );
};

export default LanguageSwitcher;
