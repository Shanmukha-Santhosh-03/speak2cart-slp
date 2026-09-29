import React, { useState } from 'react';
import type { InventoryItem, ShoppingItem } from '../types';
import { Sparkles, Utensils, Clock, Flame, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface MagicRecipeProps {
  inventory: InventoryItem[];
  cartItems: ShoppingItem[];
}

export const MagicRecipe: React.FC<MagicRecipeProps> = ({ inventory, cartItems }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [recipe, setRecipe] = useState<{
    name: string;
    description: string;
    time: string;
    difficulty: string;
    matchedIngredients: string[];
    missingIngredients: string[];
  } | null>(null);

  const generateRecipe = () => {
    setIsGenerating(true);
    setRecipe(null);
    
    // Simulate AI generation time
    setTimeout(() => {
      // Very basic AI mock combining an inventory item and a cart item
      const invItem = inventory.find(i => i.category === 'Vegetables' || i.category === 'Fruits') || inventory[0];
      const cartItem = cartItems[0] || { name: 'Cheese', category: 'Dairy' };
      
      setRecipe({
        name: `Rustic ${invItem?.name || 'Garden'} & ${cartItem?.name || 'Herb'} Delight`,
        description: 'A beautiful, home-cooked meal inspired by the fresh ingredients currently in your pantry and your recent shopping list.',
        time: '25 mins',
        difficulty: 'Easy',
        matchedIngredients: [invItem?.name || 'Fresh Greens', cartItem?.name || 'Grains', 'Olive Oil (Pantry)'],
        missingIngredients: ['Garlic', 'Sea Salt']
      });
      
      setIsGenerating(false);
      
      // Fire confetti for the wow effect
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#E06D53', '#2C4A3E', '#F4EFE6']
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#E06D53', '#2C4A3E', '#F4EFE6']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }, 2000);
  };

  return (
    <div className="bg-gradient-to-br from-[#2C4A3E] to-[#1A2E26] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden my-8">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#E06D53]/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="font-serif text-2xl font-bold flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#E06D53]" />
            Magic Recipe AI
          </h3>
          <p className="text-emerald-100/80 mt-2 max-w-md text-sm leading-relaxed">
            Not sure what to cook? Let our AI analyze your pantry and your current shopping cart to craft a delicious recipe instantly.
          </p>
        </div>
        
        <button
          onClick={generateRecipe}
          disabled={isGenerating}
          className="shrink-0 px-6 py-3 bg-[#E06D53] hover:bg-[#c95d45] disabled:opacity-50 text-white font-semibold rounded-full shadow-lg transition-all flex items-center gap-2 active:scale-95"
        >
          {isGenerating ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin text-xl">🪄</span> Analyzing...
            </span>
          ) : (
            <>
              <Utensils className="w-4 h-4" /> Generate Recipe
            </>
          )}
        </button>
      </div>

      <AnimatePresence>
        {recipe && !isGenerating && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5"
          >
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-serif text-xl font-bold text-white">{recipe.name}</h4>
              <div className="flex items-center gap-3 text-xs font-medium text-emerald-100 bg-black/20 px-3 py-1.5 rounded-full">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {recipe.time}</span>
                <span className="flex items-center gap-1"><Flame className="w-3 h-3" /> {recipe.difficulty}</span>
              </div>
            </div>
            
            <p className="text-emerald-50 text-sm mb-5 leading-relaxed">{recipe.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h5 className="font-semibold text-emerald-200 mb-2 uppercase tracking-wider text-xs">Ingredients You Have</h5>
                <ul className="space-y-1.5">
                  {recipe.matchedIngredients.map((ing, i) => (
                    <li key={i} className="flex items-center gap-2 text-white">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {ing}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-rose-300 mb-2 uppercase tracking-wider text-xs">Add to Shopping List</h5>
                <ul className="space-y-1.5">
                  {recipe.missingIngredients.map((ing, i) => (
                    <li key={i} className="flex items-center gap-2 text-emerald-100/70">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 ml-1.5 mr-1" /> {ing}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
