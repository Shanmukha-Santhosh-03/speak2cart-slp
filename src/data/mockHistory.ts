import type { HistoryRecord, ShoppingItem } from '../types';

export const INITIAL_SHOPPING_LIST: ShoppingItem[] = [
  {
    id: 'item-1',
    name: 'Biryani Rice',
    quantity: 2,
    unit: 'kg',
    category: 'Grains & Rice',
    checked: false,
    addedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    imageEmoji: '🍚',
    brand: 'Kohinoor',
    isSeasonal: false
  },
  {
    id: 'item-2',
    name: 'Toor Dal',
    quantity: 1,
    unit: 'kg',
    category: 'Pulses & Dal',
    checked: false,
    addedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    imageEmoji: '🫘',
    brand: 'Tata Sampann'
  },
  {
    id: 'item-3',
    name: 'Sambar Powder',
    quantity: 500,
    unit: 'g',
    category: 'Masalas',
    checked: false,
    addedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    imageEmoji: '🌶️',
    brand: 'MTR'
  },
  {
    id: 'item-4',
    name: 'Ginger-Garlic Paste',
    quantity: 200,
    unit: 'g',
    category: 'Condiments',
    checked: false,
    addedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    imageEmoji: '🧄',
    brand: 'Smith & Jones'
  }
];

export const MOCK_HISTORY: HistoryRecord[] = [
  {
    id: 'h-1',
    itemName: 'Cow Milk',
    category: 'Dairy',
    purchaseCount: 14,
    lastPurchasedDate: new Date(Date.now() - 86400000 * 1).toISOString(),
    averageIntervalDays: 1,
    unit: 'litre'
  },
  {
    id: 'h-2',
    itemName: 'Curd (Dahi)',
    category: 'Dairy',
    purchaseCount: 9,
    lastPurchasedDate: new Date(Date.now() - 86400000 * 2).toISOString(),
    averageIntervalDays: 3,
    unit: 'g'
  },
  {
    id: 'h-3',
    itemName: 'Onions',
    category: 'Vegetables',
    purchaseCount: 18,
    lastPurchasedDate: new Date(Date.now() - 86400000 * 4).toISOString(),
    averageIntervalDays: 7,
    unit: 'kg'
  },
  {
    id: 'h-4',
    itemName: 'Atta (Whole Wheat Flour)',
    category: 'Cooking Essentials',
    purchaseCount: 4,
    lastPurchasedDate: new Date(Date.now() - 86400000 * 28).toISOString(),
    averageIntervalDays: 30,
    unit: 'kg'
  }
];
