import React from 'react';
import { useLanguage } from '@/components/LanguageContext';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
  const { language, setLanguageCode } = useLanguage();

  return (
    <label className="flex max-w-[92px] items-center gap-1 rounded-xl border border-slate-300 bg-white/85 px-2 py-2 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-cyan-400/50 sm:max-w-none sm:gap-2 sm:px-3">
      <Globe className="h-4 w-4 shrink-0 text-blue-400" />
      <select
        value={language}
        onChange={(e) => setLanguageCode(e.target.value as 'pl' | 'en' | 'de')}
        className="min-w-0 bg-transparent text-xs font-medium uppercase text-slate-700 outline-none sm:text-sm"
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
