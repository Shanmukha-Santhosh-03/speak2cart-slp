import React from 'react';
import type { Recommendation, Product } from '../types';
import { Plus } from 'lucide-react';

interface RecommendationsProps {
  recommendations: Recommendation[];
  onAddProduct: (product: Product) => void;
}

export const SmartBuyView: React.FC<RecommendationsProps> = ({ recommendations, onAddProduct }) => {
  const replenishmentRecs = recommendations.filter(r => r.type === 'replenishment');

  if (replenishmentRecs.length === 0) return null;

  return (
    <div className="mt-12 pt-8 border-t border-[#E7E0D5] animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6">
        <h2 className="font-serif text-2xl font-bold text-[#1C1917]">Recommended for You</h2>
        <p className="text-[#78716C] mt-1">Based on your previous purchases:</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {replenishmentRecs.map(rec => (
          <div key={rec.id} className="bg-white p-4 rounded-2xl border border-[#E7E0D5] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl" role="img" aria-label={rec.product.name}>
                {rec.product.imageEmoji}
              </span>
              <div>
                <h4 className="font-semibold text-[#1C1917] text-lg">{rec.product.name}</h4>
                <p className="text-xs text-[#78716C] mt-0.5">{rec.reason}</p>
              </div>
            </div>
            
            <button
              onClick={() => onAddProduct(rec.product)}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#F4EFE6] hover:bg-[#E7E0D5] text-[#2C4A3E] font-semibold rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
