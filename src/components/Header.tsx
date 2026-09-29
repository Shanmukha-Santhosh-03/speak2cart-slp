import React from 'react';
import type { Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { Volume2, VolumeX, History, Search } from 'lucide-react';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  ttsEnabled: boolean;
  onToggleTTS: () => void;
  onOpenHistory: () => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  ttsEnabled,
  onToggleTTS,
  onOpenHistory,
  onOpenSearch
}) => {
  const t = TRANSLATIONS[language];

  return (
    <header className="sticky top-0 z-30 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#E7E0D5] px-4 md:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo & Shopping Context */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#2C4A3E] text-white flex items-center justify-center font-serif text-xl font-bold shadow-sm">
            S
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl font-semibold tracking-tight text-[#1C1917]">
                Speak2Cart
              </h1>
            </div>
            <p className="text-xs text-[#78716C] hidden md:block">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Action Controls & i18n Selector */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#1C1917] bg-[#F4EFE6] hover:bg-[#ECE6DA] rounded-full border border-[#E7E0D5] transition-colors"
            title="Search Products by Voice or Text"
          >
            <Search className="w-3.5 h-3.5 text-[#2C4A3E]" />
            <span className="hidden sm:inline">Search</span>
          </button>

          {/* History Trigger */}
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#1C1917] bg-[#F4EFE6] hover:bg-[#ECE6DA] rounded-full border border-[#E7E0D5] transition-colors"
            title="View Purchase History & Predictions"
          >
            <History className="w-3.5 h-3.5 text-[#2C4A3E]" />
            <span className="hidden sm:inline">History</span>
          </button>

          {/* Audio Feedback Toggle */}
          <button
            onClick={onToggleTTS}
            className={`p-2 rounded-full border transition-all ${
              ttsEnabled 
                ? 'bg-[#2C4A3E] text-white border-[#2C4A3E]' 
                : 'bg-[#F4EFE6] text-[#78716C] border-[#E7E0D5] hover:text-[#1C1917]'
            }`}
            title={ttsEnabled ? "Voice Feedback ON" : "Voice Feedback OFF"}
          >
            {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Language Selector */}
          <div className="relative flex items-center bg-[#F4EFE6] p-1 rounded-full border border-[#E7E0D5]">
            {(['en', 'hi'] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => onLanguageChange(lang)}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-full uppercase transition-all ${
                  language === lang
                    ? 'bg-[#2C4A3E] text-white shadow-xs'
                    : 'text-[#78716C] hover:text-[#1C1917]'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

        </div>

      </div>
    </header>
  );
};
