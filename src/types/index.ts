export type Category = 
  | 'Fruits' 
  | 'Vegetables' 
  | 'Dairy' 
  | 'Grains & Rice' 
  | 'Pulses & Dal' 
  | 'Spices' 
  | 'Masalas'
  | 'Condiments'
  | 'Whole Spices'
  | 'Cooking Essentials' 
  | 'Snacks' 
  | 'Beverages' 
  | 'Other';

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: Category;
  checked: boolean;
  addedAt: string; // ISO string
  estimatedPrice?: number; // Removed
  notes?: string;
  isSeasonal?: boolean;
  substituteOf?: string;
  brand?: string;
  imageEmoji?: string;
}

export type IntentType = 
  | 'ADD_ITEM' 
  | 'REMOVE_ITEM' 
  | 'UPDATE_QUANTITY' 
  | 'COMPLETE_ITEM' 
  | 'UNCOMPLETE_ITEM' 
  | 'SEARCH_PRODUCT' 
  | 'GET_RECOMMENDATIONS' 
  | 'FIND_SUBSTITUTE' 
  | 'CLEAR_COMPLETED' 
  | 'UNKNOWN';

export interface ParsedCommand {
  intent: IntentType;
  rawText: string;
  item?: string;
  quantity?: number;
  unit?: string;
  category?: Category;
  priceFilter?: number; // Removed
  brandFilter?: string;
  confidence: number;
  suggestedActionText?: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: Category;
  price: number; // Removed
  unit: string;
  inStock: boolean;
  isSeasonal: boolean;
  imageEmoji: string;
  substitutes?: string[]; // IDs or names of substitutes
  description?: string;
}

export interface Recommendation {
  id: string;
  type: 'replenishment' | 'seasonal' | 'substitute';
  product: Product;
  reason: string;
  frequencyDays?: number;
  lastBoughtDaysAgo?: number;
  confidenceScore: number;
}

export interface HistoryRecord {
  id: string;
  itemName: string;
  category: Category;
  purchaseCount: number;
  lastPurchasedDate: string;
  averageIntervalDays: number;
  unit: string;
}

export type VoiceState = 'idle' | 'listening' | 'processing' | 'success' | 'error';

export type Language = 'en' | 'hi';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error' | 'warning';
  title: string;
  message: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: Category;
  quantity: number;
  unit: string;
  purchaseDate: string; // ISO string
  shelfLifeDays: number;
  expiryDate: string; // ISO string
  isLowStock: boolean;
  imageEmoji: string;
}

// PendingAction removed
