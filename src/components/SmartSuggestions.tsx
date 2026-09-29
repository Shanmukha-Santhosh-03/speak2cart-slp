import React from 'react';
import type { Recommendation, Language, Product } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { Sparkles, Plus, Calendar, Leaf, ArrowRightLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface SmartSuggestionsProps {
  recommendations: Recommendation[];
  language: Language;
  onAddProduct: (product: Product) => void;
}

export const SmartSuggestions: React.FC<SmartSuggestionsProps> = ({
  recommendations,
  language,
  onAddProduct
}) => {
  const t = TRANSLATIONS[language];

  if (recommendations.length === 0) return null;

  const replenishmentRecs = recommendations.filter(r => r.type === 'replenishment');
  const seasonalRecs = recommendations.filter(r => r.type === 'seasonal');
  const substituteRecs = recommendations.filter(r => r.type === 'substitute');

  return (
    <div className="w-full space-y-6">
      
      {/* 1. Replenishment Insights */}
      {replenishmentRecs.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#E06D53]" />
            <h3 className="font-serif text-lg font-semibold text-[#1C1917]">
              {t.youMightNeed}
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {replenishmentRecs.map(rec => (
              <motion.div
                key={rec.id}
                whileHover={{ y: -2 }}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FFFDF9] border border-[#E7E0D5] shadow-2xs hover:shadow-xs transition-all"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-2xl select-none" role="img" aria-label={rec.product.name}>
                    {rec.product.imageEmoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-serif text-base font-medium text-[#1C1917] truncate">
                        {rec.product.name}
                      </span>
                    </div>
                    <p className="text-xs text-[#78716C] mt-0.5 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E06D53]" />
                      {rec.reason}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onAddProduct(rec.product)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#2C4A3E] hover:bg-[#223B31] text-white text-xs font-medium transition-colors shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t.add}</span>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Seasonal Produce Highlights */}
      {seasonalRecs.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-[#2C4A3E]" />
            <h3 className="font-serif text-lg font-semibold text-[#1C1917]">
              {t.goodThisWeek}
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {seasonalRecs.map(rec => (
              <motion.div
                key={rec.id}
                whileHover={{ y: -2 }}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F5EBE1]/60 border border-[#E7E0D5] shadow-2xs hover:shadow-xs transition-all"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-2xl select-none" role="img" aria-label={rec.product.name}>
                    {rec.product.imageEmoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-serif text-base font-medium text-[#1C1917] truncate">
                        {rec.product.name}
                      </span>
                    </div>
                    <p className="text-xs text-[#78716C] mt-0.5 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#E06D53]" />
                      {rec.reason}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onAddProduct(rec.product)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#2C4A3E] hover:bg-[#223B31] text-white text-xs font-medium transition-colors shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t.add}</span>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Smart Dietary Substitutes */}
      {substituteRecs.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4 text-[#2C4A3E]" />
            <h3 className="font-serif text-lg font-semibold text-[#1C1917]">
              {t.smartSubstitutes}
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {substituteRecs.map(rec => (
              <motion.div
                key={rec.id}
                whileHover={{ y: -2 }}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-[#E7E0D5] shadow-2xs hover:shadow-xs transition-all"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-2xl select-none" role="img" aria-label={rec.product.name}>
                    {rec.product.imageEmoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-serif text-base font-medium text-[#1C1917] truncate">
                        {rec.product.name}
                      </span>
                    </div>
                    <p className="text-xs text-[#78716C] mt-0.5">
                      {rec.reason}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onAddProduct(rec.product)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#E06D53] hover:bg-[#C85B42] text-white text-xs font-medium transition-colors shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t.substitute}</span>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
