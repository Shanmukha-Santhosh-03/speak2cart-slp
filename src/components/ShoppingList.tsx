import React, { useState } from 'react';
import type { ShoppingItem } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface ShoppingListProps {
  items: ShoppingItem[];
  onToggleChecked: (id: string) => void;
  onClearCompleted: () => void;
  onRemoveItem: (id: string) => void;
}

export const ShoppingList: React.FC<ShoppingListProps> = ({
  items,
  onToggleChecked,
  onRemoveItem,
}) => {
  const [checkoutError, setCheckoutError] = useState('');

  // Active items are those not yet processed/checkout
  const activeItems = items.filter(i => !i.checked);
  // We'll use a local state for the "Select" checkboxes before checkout
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const handleSelect = (id: string) => {
    setCheckoutError('');
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const handleSelectAll = () => {
    if (selectedIds.size === activeItems.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(activeItems.map(i => i.id)));
    }
  };

  const handleCheckout = () => {
    if (selectedIds.size === 0) {
      setCheckoutError('Please select at least one item.');
      return;
    }
    // Process selected items by toggling them checked
    selectedIds.forEach(id => {
      onToggleChecked(id);
    });
    setSelectedIds(new Set());
    setCheckoutError('');
  };

  const handleDeleteSelected = () => {
    if (selectedIds.size === 0) {
      setCheckoutError('Select at least one item to delete.');
      return;
    }
    const confirmed = window.confirm('Are you sure you want to remove the selected items?');
    if (!confirmed) return;

    selectedIds.forEach(id => {
      onRemoveItem(id);
    });
    setSelectedIds(new Set());
    setCheckoutError('');
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Header */}
      <div className="flex flex-col items-center justify-center pb-4 text-center">
        <h2 className="font-serif text-3xl font-semibold text-[#1C1917] mb-2">
          Shopping List
        </h2>
        <p className="text-sm text-[#78716C]">
          Items you've asked Speak2Cart to add
        </p>
      </div>

      {activeItems.length === 0 ? (
        <div className="py-16 text-center rounded-3xl bg-[#FAF7F2] border border-dashed border-[#E7E0D5]">
          <h3 className="font-serif text-xl font-medium text-[#1C1917]">
            Your shopping list is clear.
          </h3>
          <p className="text-sm text-[#78716C] mt-2 max-w-sm mx-auto">
            Try speaking to the assistant to add your household groceries.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E7E0D5] overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F4EFE6] border-b border-[#E7E0D5] text-sm uppercase tracking-wider text-[#78716C] font-semibold">
                <th className="px-4 py-3 w-16 text-center border-r border-[#E7E0D5]">S.No.</th>
                <th className="px-6 py-3 border-r border-[#E7E0D5]">Product Name</th>
                <th className="px-6 py-3 border-r border-[#E7E0D5]">Quantity</th>
                <th className="px-6 py-3 text-center">Select</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {activeItems.map((item, idx) => {
                  const isSelected = selectedIds.has(item.id);
                  return (
                    <motion.tr 
                      key={item.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-b border-[#E7E0D5] last:border-0 hover:bg-[#FAF7F2] transition-colors"
                    >
                      <td className="px-4 py-4 text-center font-mono text-sm border-r border-[#E7E0D5]">
                        {idx + 1}
                      </td>
                      <td className="px-6 py-4 font-serif text-lg font-medium text-[#1C1917] border-r border-[#E7E0D5]">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#78716C] border-r border-[#E7E0D5]">
                        {item.quantity && item.unit ? `${item.quantity} ${item.unit}` : 'Not specified'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <label className="flex items-center justify-center cursor-pointer">
                          <span className="sr-only">Select</span>
                          <input 
                            type="checkbox" 
                            checked={isSelected}
                            onChange={() => handleSelect(item.id)}
                            className="w-5 h-5 rounded border-[#E7E0D5] text-[#2C4A3E] focus:ring-[#2C4A3E] bg-[#F4EFE6] cursor-pointer"
                          />
                        </label>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}

      {activeItems.length > 0 && (
        <div className="flex flex-col items-center justify-center pt-4 space-y-6">
          <div className="flex items-center justify-between w-full max-w-lg px-2">
            <div className="flex items-center gap-2">
              <label className="flex items-center cursor-pointer gap-2 group">
                <input 
                  type="checkbox"
                  checked={selectedIds.size === activeItems.length && activeItems.length > 0}
                  ref={(input) => {
                    if (input) {
                      input.indeterminate = selectedIds.size > 0 && selectedIds.size < activeItems.length;
                    }
                  }}
                  onChange={handleSelectAll}
                  className="w-5 h-5 rounded border-[#E7E0D5] text-[#2C4A3E] focus:ring-[#2C4A3E] bg-[#F4EFE6] cursor-pointer"
                  aria-label="Select all shopping list items"
                />
                <span className="font-medium text-[#1C1917] group-hover:text-[#2C4A3E] transition-colors">Select All</span>
              </label>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleDeleteSelected}
                aria-label="Delete selected shopping list items"
                className={`px-6 py-2.5 font-semibold text-sm rounded-full shadow-sm transition-all ${
                  selectedIds.size === 0 
                    ? 'bg-[#E7E0D5] text-[#A8A29E] cursor-pointer' 
                    : 'bg-rose-500 text-white hover:bg-rose-600'
                }`}
              >
                Delete Selected
              </button>
              <button
                onClick={handleCheckout}
                aria-label="Checkout selected shopping list items"
                className={`px-6 py-2.5 font-semibold text-sm rounded-full shadow-sm transition-all ${
                  selectedIds.size === 0 
                    ? 'bg-[#E7E0D5] text-[#A8A29E] cursor-pointer' 
                    : 'bg-[#2C4A3E] text-white hover:bg-[#223B31]'
                }`}
              >
                Checkout {selectedIds.size > 0 ? `(${selectedIds.size})` : ''}
              </button>
            </div>
          </div>
          
          {checkoutError && (
            <p className="text-red-600 text-sm font-medium animate-pulse">{checkoutError}</p>
          )}
        </div>
      )}

    </div>
  );
};
