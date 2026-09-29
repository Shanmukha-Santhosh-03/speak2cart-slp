import React from 'react';
import type { InventoryItem } from '../types';
import { Package } from 'lucide-react';

interface DatabaseViewProps {
  inventory: InventoryItem[];
  onUpdateItem: (id: string, updates: Partial<InventoryItem>) => void;
  onRemoveItem: (id: string) => void;
  onAddItem: (item: InventoryItem) => void;
}

export const DatabaseView: React.FC<DatabaseViewProps> = ({ inventory, onUpdateItem, onRemoveItem, onAddItem }) => {
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editForm, setEditForm] = React.useState<Partial<InventoryItem>>({});
  
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [addForm, setAddForm] = React.useState<Partial<InventoryItem>>({
    name: '', quantity: 1, unit: 'kg', category: 'Other', shelfLifeDays: 30
  });

  // Group inventory by category
  const groupedInventory = inventory.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, InventoryItem[]>);

  const categories = Object.keys(groupedInventory).sort();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#E06D53]/10 flex items-center justify-center text-[#E06D53]">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#1C1917]">Your Pantry Database</h2>
            <p className="text-sm text-[#78716C]">Currently existing items in your home</p>
          </div>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-[#2C4A3E] text-white rounded-full text-sm font-semibold shadow hover:bg-[#1f352c] transition-colors"
        >
          {showAddForm ? 'Cancel' : '+ Add Item'}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white p-5 rounded-3xl border border-[#E7E0D5] shadow-sm mb-8 animate-in fade-in slide-in-from-top-2">
          <h3 className="font-serif text-lg font-semibold mb-4">Add New Item</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#78716C]">Name</label>
              <input type="text" className="p-2 border border-[#E7E0D5] rounded-lg bg-[#FAF7F2] text-sm" value={addForm.name || ''} onChange={e => setAddForm({ ...addForm, name: e.target.value })} placeholder="e.g. Tamarind" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#78716C]">Quantity</label>
              <input type="number" className="p-2 border border-[#E7E0D5] rounded-lg bg-[#FAF7F2] text-sm" value={addForm.quantity || 1} onChange={e => setAddForm({ ...addForm, quantity: parseFloat(e.target.value) })} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#78716C]">Unit</label>
              <input type="text" className="p-2 border border-[#E7E0D5] rounded-lg bg-[#FAF7F2] text-sm" value={addForm.unit || ''} onChange={e => setAddForm({ ...addForm, unit: e.target.value })} />
            </div>
            <button 
              onClick={() => {
                if (addForm.name) {
                  onAddItem({
                    id: 'inv-' + Date.now(),
                    name: addForm.name,
                    category: addForm.category as any,
                    quantity: addForm.quantity || 1,
                    unit: addForm.unit || 'units',
                    purchaseDate: new Date().toISOString(),
                    shelfLifeDays: addForm.shelfLifeDays || 30,
                    expiryDate: new Date(Date.now() + (addForm.shelfLifeDays || 30) * 86400000).toISOString(),
                    isLowStock: false,
                    imageEmoji: '📦'
                  });
                  setAddForm({ name: '', quantity: 1, unit: 'kg', category: 'Other', shelfLifeDays: 30 });
                  setShowAddForm(false);
                }
              }} 
              className="px-4 py-2 h-[38px] bg-[#E06D53] text-white rounded-lg text-sm font-semibold hover:bg-[#c95c43] transition-colors"
            >
              Save Item
            </button>
          </div>
        </div>
      )}

      {categories.length === 0 ? (
        <div className="text-center py-12 text-[#78716C] border-2 border-dashed border-[#E7E0D5] rounded-3xl">
          <p>Your pantry is currently empty.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map(category => (
            <div key={category} className="bg-white p-5 rounded-3xl border border-[#E7E0D5] shadow-sm">
              <h3 className="font-serif text-xl font-semibold mb-4 flex items-center gap-2">
                {category}
                <span className="text-xs font-sans font-normal bg-[#F4EFE6] px-2 py-1 rounded-full text-[#78716C]">
                  {groupedInventory[category].length}
                </span>
              </h3>
              
              <ul className="space-y-3">
                {groupedInventory[category].map(item => {
                  const daysToExpiry = Math.ceil((new Date(item.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                  const isExpiringSoon = daysToExpiry <= 3 && daysToExpiry >= 0;
                  const isExpired = daysToExpiry < 0;

                  return (
                      <li key={item.id} className="p-4 rounded-2xl bg-[#FAF7F2] hover:bg-[#F4EFE6] transition-colors border border-[#E7E0D5]">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl" role="img" aria-label={item.name}>{item.imageEmoji}</span>
                            <div>
                              <h4 className="font-serif text-[#1C1917] text-xl font-bold">{item.name}</h4>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            {isExpired ? (
                              <span className="text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md text-xs font-semibold border border-rose-100">
                                Expired
                              </span>
                            ) : isExpiringSoon ? (
                              <span className="text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md text-xs font-semibold border border-amber-100">
                                Use Soon (Est.)
                              </span>
                            ) : (
                              <span className="text-[#2C4A3E] bg-[#2C4A3E]/10 px-2.5 py-1 rounded-md text-xs font-semibold border border-[#2C4A3E]/20">
                                Fresh
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-y-3 text-sm pt-2">
                          <div className="text-[#78716C]">Bought:</div>
                          <div className="font-medium text-right text-[#1C1917]">
                            {new Date(item.purchaseDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </div>
                          
                          <div className="text-[#78716C]">Shelf Life:</div>
                          <div className="font-medium text-right text-[#1C1917]">
                            {item.shelfLifeDays >= 30 ? `${Math.round(item.shelfLifeDays/30)} months` : `${item.shelfLifeDays} days`}
                          </div>

                          <div className="text-[#78716C]">Estimated Expiry:</div>
                          <div className="font-medium text-right text-[#1C1917]">
                            {new Date(item.expiryDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} (Est.)
                          </div>
                          
                          <div className="text-[#78716C]">Current Quantity:</div>
                          <div className="font-medium text-right text-[#1C1917]">
                            {item.quantity} {item.unit}
                          </div>
                        </div>

                        {editingId === item.id ? (
                          <div className="mt-4 pt-4 border-t border-[#E7E0D5] flex flex-col gap-3 text-sm">
                            <div className="grid grid-cols-2 gap-2 items-center">
                              <label className="text-[#78716C]">Name</label>
                              <input type="text" className="p-1 border border-[#E7E0D5] rounded bg-white text-right" value={editForm.name || ''} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
                              
                              <label className="text-[#78716C]">Quantity</label>
                              <input type="number" className="p-1 border border-[#E7E0D5] rounded bg-white text-right" value={editForm.quantity || 0} onChange={e => setEditForm({ ...editForm, quantity: parseFloat(e.target.value) })} />

                              <label className="text-[#78716C]">Unit</label>
                              <input type="text" className="p-1 border border-[#E7E0D5] rounded bg-white text-right" value={editForm.unit || ''} onChange={e => setEditForm({ ...editForm, unit: e.target.value })} />
                            </div>
                            <div className="flex justify-end gap-2 mt-2">
                              <button onClick={() => setEditingId(null)} className="px-3 py-1.5 text-xs rounded-md bg-[#E7E0D5] text-[#1C1917]">Cancel</button>
                              <button onClick={() => { onUpdateItem(item.id, editForm); setEditingId(null); }} className="px-3 py-1.5 text-xs rounded-md bg-[#2C4A3E] text-white">Save Changes</button>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-4 pt-4 border-t border-[#E7E0D5] flex gap-2 justify-end">
                            <button onClick={() => { setEditingId(item.id); setEditForm(item); }} className="px-3 py-1.5 text-xs font-semibold rounded-md border border-[#E7E0D5] text-[#78716C] hover:bg-white transition-colors">Edit</button>
                            <button onClick={() => { if(window.confirm(`Remove ${item.name} from your pantry?`)) onRemoveItem(item.id); }} className="px-3 py-1.5 text-xs font-semibold rounded-md bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors">Remove</button>
                          </div>
                        )}
                      </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
