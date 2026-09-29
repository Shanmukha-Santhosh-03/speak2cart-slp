import React from 'react';
import type { HistoryRecord, Language, Product } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { MOCK_PRODUCTS } from '../data/mockProducts';
import { History, X, Plus, Calendar, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HistoryDrawerProps {
  isOpen: boolean;
  history: HistoryRecord[];
  language: Language;
  onClose: () => void;
  onAddProduct: (product: Product) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  history,
  language,
  onClose,
  onAddProduct
}) => {
  const t = TRANSLATIONS[language];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-[#1C1917]/30 backdrop-blur-xs">
        
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full max-w-md bg-[#FAF7F2] h-full shadow-2xl border-l border-[#E7E0D5] flex flex-col"
        >
          {/* Drawer Header */}
          <div className="p-5 border-b border-[#E7E0D5] bg-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-[#2C4A3E]" />
              <h2 className="font-serif text-xl font-semibold text-[#1C1917]">
                {t.historyTitle}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-[#78716C] hover:text-[#1C1917] hover:bg-[#F4EFE6] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="p-5 overflow-y-auto flex-1 space-y-4">
            <p className="text-xs text-[#78716C]">
              Speak2Cart analyzes your purchase history to automatically suggest items when you're running low.
            </p>

            <div className="space-y-3">
              {history.map(record => {
                const daysAgo = Math.floor(
                  (Date.now() - new Date(record.lastPurchasedDate).getTime()) / 86400000
                );
                const matchingProd = MOCK_PRODUCTS.find(p => p.name.toLowerCase().includes(record.itemName.toLowerCase())) || {
                  id: record.id,
                  name: record.itemName,
                  brand: 'Pantry Item',
                  category: record.category,
                  unit: record.unit,
                  inStock: true,
                  isSeasonal: false,
                  imageEmoji: '🛒'
                };

                return (
                  <div
                    key={record.id}
                    className="p-4 rounded-2xl bg-white border border-[#E7E0D5] shadow-2xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl select-none" role="img" aria-label={record.itemName}>
                          {matchingProd.imageEmoji}
                        </span>
                        <div>
                          <h4 className="font-serif text-base font-medium text-[#1C1917]">
                            {record.itemName}
                          </h4>
                          <span className="text-[11px] text-[#78716C]">
                            Purchased {record.purchaseCount} times
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => onAddProduct(matchingProd as any)}
                        className="px-3 py-1.5 rounded-full bg-[#2C4A3E] hover:bg-[#223B31] text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#78716C] pt-2 border-t border-[#E7E0D5]/50">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#E06D53]" />
                        Last bought: {daysAgo}d ago
                      </span>
                      <span className="flex items-center gap-1 font-mono text-[11px] text-[#2C4A3E]">
                        <RotateCcw className="w-3 h-3" />
                        Every ~{record.averageIntervalDays} days
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

      </div>
    </AnimatePresence>
  );
};
