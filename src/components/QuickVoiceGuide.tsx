import React from 'react';
import type { Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { Sparkles } from 'lucide-react';

interface QuickVoiceGuideProps {
  language: Language;
  onSelectPrompt: (prompt: string) => void;
}

export const QuickVoiceGuide: React.FC<QuickVoiceGuideProps> = ({ language, onSelectPrompt }) => {
  const t = TRANSLATIONS[language];

  const SAMPLE_PROMPTS: Record<Language, string[]> = {
    en: [
      "Add 2 cartons of Oat Milk",
      "I need 6 Honeycrisp Apples",
      "Remove sourdough bread",
      "Find toothpaste under $5",
      "What am I running low on?",
      "Clear completed items"
    ],
    hi: [
      "2 botal paani jodo",
      "Mujhe 6 sev chahiye",
      "500 ke andar chawal khojo",
      "Doodh hatao",
      "Mera saamaan saaf karo"
    ]
  };

  const prompts = SAMPLE_PROMPTS[language] || SAMPLE_PROMPTS.en;

  return (
    <div className="w-full max-w-xl mx-auto mb-6 px-2 text-center">
      <div className="flex items-center justify-center gap-1.5 text-xs text-[#78716C] mb-2 font-medium">
        <Sparkles className="w-3.5 h-3.5 text-[#E06D53]" />
        <span>{t.trySaying}</span>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {prompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => onSelectPrompt(prompt)}
            className="px-3 py-1.5 rounded-full bg-[#F4EFE6] hover:bg-[#2C4A3E] text-[#1C1917] hover:text-white text-xs font-medium border border-[#E7E0D5] transition-all hover:scale-105 active:scale-95 shadow-2xs"
          >
            "{prompt}"
          </button>
        ))}
      </div>
    </div>
  );
};
