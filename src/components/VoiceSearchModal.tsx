import React, { useState } from 'react';
import type { Product, Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { MOCK_PRODUCTS } from '../data/mockProducts';
import { Search, X, Plus, Sparkles, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceSearchModalProps {
  isOpen: boolean;
  searchQuery: string | null;
  language: Language;
  onClose: () => void;
  onAddProduct: (product: Product) => void;
}

export const VoiceSearchModal: React.FC<VoiceSearchModalProps> = ({
  isOpen,
  searchQuery,
  language,
  onClose,
  onAddProduct
}) => {
  const t = TRANSLATIONS[language];
  const [localQuery, setLocalQuery] = useState(searchQuery || '');
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const activeQuery = localQuery || searchQuery || '';

  // Filter products matching query
  const results = MOCK_PRODUCTS.filter(prod => {
    const query = activeQuery.toLowerCase().trim();
    const nameMatch = !query || prod.name.toLowerCase().includes(query) || prod.category.toLowerCase().includes(query) || prod.brand.toLowerCase().includes(query);
    return nameMatch;
  });

  const handleAdd = (prod: Product) => {
    onAddProduct(prod);
    setAddedIds(prev => ({ ...prev, [prod.id]: true }));
    setTimeout(() => {
      setAddedIds(prev => ({ ...prev, [prod.id]: false }));
    }, 1500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#1C1917]/40 backdrop-blur-sm">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          className="relative w-full max-w-2xl bg-[#FAF7F2] rounded-3xl border border-[#E7E0D5] shadow-xl overflow-hidden max-h-[85vh] flex flex-col"
        >
          
          {/* Modal Header & Search Bar */}
          <div className="p-4 sm:p-6 border-b border-[#E7E0D5] bg-white">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#E06D53]" />
                <h2 className="font-serif text-xl font-semibold text-[#1C1917]">
                  {t.searchTitle}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-[#78716C] hover:text-[#1C1917] hover:bg-[#F4EFE6] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Natural Text Search Input */}
            <div className="flex items-center gap-2 bg-[#F4EFE6] px-3.5 py-2.5 rounded-2xl border border-[#E7E0D5]">
              <Search className="w-4 h-4 text-[#2C4A3E]" />
              <input
                type="text"
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                placeholder="e.g. Organic apples or toothpaste under $5..."
                className="flex-1 bg-transparent text-sm text-[#1C1917] placeholder:text-[#78716C]/60 outline-none"
              />
              {localQuery && (
                <button onClick={() => setLocalQuery('')} className="text-xs text-[#78716C] hover:text-[#1C1917]">
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Results Grid */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-3">
            {results.length === 0 ? (
              <div className="py-12 text-center text-[#78716C]">
                <p className="font-serif text-lg text-[#1C1917]">No matching products found.</p>
                <p className="text-xs mt-1">Try relaxing your search terms.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {results.map(prod => {
                  const isAdded = addedIds[prod.id];
                  return (
                    <div
                      key={prod.id}
                      className="flex items-start justify-between p-3.5 rounded-2xl bg-white border border-[#E7E0D5] shadow-2xs hover:shadow-xs transition-all"
                    >
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <span className="text-2xl select-none" role="img" aria-label={prod.name}>
                          {prod.imageEmoji}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-serif text-base font-semibold text-[#1C1917] truncate">
                              {prod.name}
                            </span>
                          </div>
                          <p className="text-xs text-[#78716C] mt-0.5">
                            {prod.brand}
                          </p>
                          <p className="text-[11px] text-[#78716C]/80 mt-1 line-clamp-1">
                            {prod.description}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleAdd(prod)}
                        className={`ml-2 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 transition-all ${
                          isAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#2C4A3E] hover:bg-[#223B31] text-white shadow-2xs'
                        }`}
                      >
                        {isAdded ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                        <span>{isAdded ? t.added : t.add}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </motion.div>

      </div>
    </AnimatePresence>
  );
};
