import type { InventoryItem } from '../types';

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'inv-1',
    name: 'Biryani Rice',
    category: 'Grains & Rice',
    quantity: 2,
    unit: 'kg',
    purchaseDate: new Date(Date.now() - 15 * 86400000).toISOString(),
    shelfLifeDays: 365,
    expiryDate: new Date(Date.now() + 350 * 86400000).toISOString(),
    isLowStock: false,
    imageEmoji: '🍚'
  },
  {
    id: 'inv-2',
    name: 'Toor Dal',
    category: 'Pulses & Dal',
    quantity: 1,
    unit: 'kg',
    purchaseDate: new Date(Date.now() - 25 * 86400000).toISOString(),
    shelfLifeDays: 180,
    expiryDate: new Date(Date.now() + 155 * 86400000).toISOString(),
    isLowStock: true,
    imageEmoji: '🫘'
  },
  {
    id: 'inv-3',
    name: 'Sambar Powder',
    category: 'Masalas',
    quantity: 500,
    unit: 'g',
    purchaseDate: new Date(Date.now() - 30 * 86400000).toISOString(),
    shelfLifeDays: 180,
    expiryDate: new Date(Date.now() + 150 * 86400000).toISOString(),
    isLowStock: false,
    imageEmoji: '🌶️'
  },
  {
    id: 'inv-4',
    name: 'Curd',
    category: 'Dairy',
    quantity: 500,
    unit: 'g',
    purchaseDate: new Date(Date.now() - 2 * 86400000).toISOString(),
    shelfLifeDays: 5,
    expiryDate: new Date(Date.now() + 3 * 86400000).toISOString(),
    isLowStock: true,
    imageEmoji: '🥣'
  },
  {
    id: 'inv-5',
    name: 'Ginger-Garlic Paste',
    category: 'Condiments',
    quantity: 200,
    unit: 'g',
    purchaseDate: new Date(Date.now() - 10 * 86400000).toISOString(),
    shelfLifeDays: 30,
    expiryDate: new Date(Date.now() + 20 * 86400000).toISOString(),
    isLowStock: false,
    imageEmoji: '🧄'
  },
  {
    id: 'inv-6',
    name: 'Onions',
    category: 'Vegetables',
    quantity: 2,
    unit: 'kg',
    purchaseDate: new Date(Date.now() - 5 * 86400000).toISOString(),
    shelfLifeDays: 14,
    expiryDate: new Date(Date.now() + 9 * 86400000).toISOString(),
    isLowStock: false,
    imageEmoji: '🧅'
  },
  {
    id: 'inv-7',
    name: 'Mustard Seeds',
    category: 'Whole Spices',
    quantity: 250,
    unit: 'g',
    purchaseDate: new Date(Date.now() - 60 * 86400000).toISOString(),
    shelfLifeDays: 365,
    expiryDate: new Date(Date.now() + 305 * 86400000).toISOString(),
    isLowStock: false,
    imageEmoji: '⚫'
  }
];
