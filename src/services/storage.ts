import type { ShoppingItem, Language, HistoryRecord, InventoryItem } from '../types';
import { INITIAL_SHOPPING_LIST, MOCK_HISTORY } from '../data/mockHistory';
import { INITIAL_INVENTORY } from '../data/mockInventory';
import { AuthService } from './db';

const getBaseKey = (base: string) => {
  const user = AuthService.getCurrentUser();
  const prefix = user ? `speak2cart_user_${user.username}` : 'speak2cart_guest';
  return `${prefix}_${base}`;
};

export const StorageService = {
  getItems(): ShoppingItem[] {
    try {
      const data = localStorage.getItem(getBaseKey('shopping'));
      if (!data) return INITIAL_SHOPPING_LIST;
      return JSON.parse(data);
    } catch {
      return INITIAL_SHOPPING_LIST;
    }
  },

  saveItems(items: ShoppingItem[]) {
    try {
      localStorage.setItem(getBaseKey('shopping'), JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save shopping items to localStorage', e);
    }
  },

  getInventory(): InventoryItem[] {
    try {
      const data = localStorage.getItem(getBaseKey('pantry'));
      if (!data) return INITIAL_INVENTORY;
      return JSON.parse(data);
    } catch {
      return INITIAL_INVENTORY;
    }
  },

  saveInventory(inventory: InventoryItem[]) {
    try {
      localStorage.setItem(getBaseKey('pantry'), JSON.stringify(inventory));
    } catch (e) {
      console.error('Failed to save inventory to localStorage', e);
    }
  },

  getHistory(): HistoryRecord[] {
    try {
      const data = localStorage.getItem(getBaseKey('history'));
      if (!data) return MOCK_HISTORY;
      return JSON.parse(data);
    } catch {
      return MOCK_HISTORY;
    }
  },

  saveHistory(history: HistoryRecord[]) {
    try {
      localStorage.setItem(getBaseKey('history'), JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save history to localStorage', e);
    }
  },

  getLanguage(): Language {
    try {
      return (localStorage.getItem(getBaseKey('language')) as Language) || 'en';
    } catch {
      return 'en';
    }
  },

  saveLanguage(lang: Language) {
    try {
      localStorage.setItem(getBaseKey('language'), lang);
    } catch (e) {
      console.error('Failed to save language to localStorage', e);
    }
  },

  getTTSEnabled(): boolean {
    try {
      const val = localStorage.getItem(getBaseKey('tts_enabled'));
      if (val === null) return true;
      return JSON.parse(val);
    } catch {
      return true;
    }
  },

  saveTTSEnabled(enabled: boolean) {
    try {
      localStorage.setItem(getBaseKey('tts_enabled'), JSON.stringify(enabled));
    } catch (e) {
      console.error('Failed to save TTS setting to localStorage', e);
    }
  }
};
