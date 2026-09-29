// Simulated Database & Auth using LocalStorage for isolated user data
import { v4 as uuidv4 } from 'uuid';

export interface User {
  id: string;
  username: string;
  password?: string;
}

// Data models based on spec
export interface PantryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  purchase_date: string;
  expiry_date?: string;
  expiry_type: 'recorded' | 'estimated' | 'none';
  created_at: string;
  updated_at: string;
  imageEmoji?: string;
}

export interface ShoppingListItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  checked: boolean;
  source: string; // 'voice', 'manual', 'replenishment'
  created_at: string;
  imageEmoji?: string;
}

export interface PurchaseHistory {
  id: string;
  item_name: string;
  quantity: number;
  unit: string;
  purchased_at: string;
}

export interface AssistantHistory {
  id: string;
  transcript: string;
  intent: string;
  confidence: number;
  response: string;
  created_at: string;
}

// Users table (global)
const getUsersDB = () => {
  const data = localStorage.getItem('speak2cart_users');
  if (data) return JSON.parse(data);
  return [];
};

const saveUsersDB = (users: User[]) => {
  localStorage.setItem('speak2cart_users', JSON.stringify(users));
};

// User-namespaced DB access
const getUserDBKey = (username: string, collection: string) => {
  return `speak2cart_user_${username}_${collection}`;
};

const getCollection = <T>(username: string, collection: string): T[] => {
  const data = localStorage.getItem(getUserDBKey(username, collection));
  if (data) return JSON.parse(data);
  return [];
};

const saveCollection = <T>(username: string, collection: string, data: T[]) => {
  localStorage.setItem(getUserDBKey(username, collection), JSON.stringify(data));
};

export const AuthService = {
  register: (username: string, password: string): boolean => {
    const users = getUsersDB();
    if (users.find((u: User) => u.username === username)) {
      return false; // User exists
    }
    const newUser: User = { id: uuidv4(), username, password };
    users.push(newUser);
    saveUsersDB(users);
    
    // Auto-login after register
    localStorage.setItem('speak2cart_session', JSON.stringify({ id: newUser.id, username: newUser.username }));
    return true;
  },

  login: (username: string, password: string): User | null => {
    const users = getUsersDB();
    const user = users.find((u: User) => u.username === username && u.password === password);
    if (!user) return null;
    
    const sessionUser = { id: user.id, username: user.username };
    localStorage.setItem('speak2cart_session', JSON.stringify(sessionUser));
    return sessionUser;
  },
  
  logout: () => {
    localStorage.removeItem('speak2cart_session');
  },
  
  getCurrentUser: (): User | null => {
    const session = localStorage.getItem('speak2cart_session');
    return session ? JSON.parse(session) : null;
  }
};

export const DBService = {
  // Pantry
  getPantry: (username: string): PantryItem[] => getCollection<PantryItem>(username, 'pantry'),
  addPantryItem: (username: string, item: Omit<PantryItem, 'id' | 'created_at' | 'updated_at'>) => {
    const col = getCollection<PantryItem>(username, 'pantry');
    const newItem: PantryItem = {
      ...item,
      id: uuidv4(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    col.push(newItem);
    saveCollection(username, 'pantry', col);
    return newItem;
  },
  updatePantryItem: (username: string, id: string, updates: Partial<PantryItem>) => {
    const col = getCollection<PantryItem>(username, 'pantry');
    const index = col.findIndex(i => i.id === id);
    if (index !== -1) {
      col[index] = { ...col[index], ...updates, updated_at: new Date().toISOString() };
      saveCollection(username, 'pantry', col);
    }
  },
  removePantryItem: (username: string, id: string) => {
    let col = getCollection<PantryItem>(username, 'pantry');
    col = col.filter(i => i.id !== id);
    saveCollection(username, 'pantry', col);
  },

  // Shopping List
  getShoppingList: (username: string): ShoppingListItem[] => getCollection<ShoppingListItem>(username, 'shopping'),
  addShoppingItem: (username: string, item: Omit<ShoppingListItem, 'id' | 'created_at'>) => {
    const col = getCollection<ShoppingListItem>(username, 'shopping');
    const newItem: ShoppingListItem = {
      ...item,
      id: uuidv4(),
      created_at: new Date().toISOString()
    };
    col.push(newItem);
    saveCollection(username, 'shopping', col);
    return newItem;
  },
  updateShoppingItem: (username: string, id: string, updates: Partial<ShoppingListItem>) => {
    const col = getCollection<ShoppingListItem>(username, 'shopping');
    const index = col.findIndex(i => i.id === id);
    if (index !== -1) {
      col[index] = { ...col[index], ...updates };
      saveCollection(username, 'shopping', col);
    }
  },
  removeShoppingItem: (username: string, id: string) => {
    let col = getCollection<ShoppingListItem>(username, 'shopping');
    col = col.filter(i => i.id !== id);
    saveCollection(username, 'shopping', col);
  },

  // History
  addPurchaseHistory: (username: string, record: Omit<PurchaseHistory, 'id' | 'purchased_at'>) => {
    const col = getCollection<PurchaseHistory>(username, 'history');
    col.push({
      ...record,
      id: uuidv4(),
      purchased_at: new Date().toISOString()
    });
    saveCollection(username, 'history', col);
  },
  getPurchaseHistory: (username: string): PurchaseHistory[] => getCollection<PurchaseHistory>(username, 'history'),

  addAssistantHistory: (username: string, record: Omit<AssistantHistory, 'id' | 'created_at'>) => {
    const col = getCollection<AssistantHistory>(username, 'assistant');
    col.push({
      ...record,
      id: uuidv4(),
      created_at: new Date().toISOString()
    });
    saveCollection(username, 'assistant', col);
  },
  getAssistantHistory: (username: string): AssistantHistory[] => getCollection<AssistantHistory>(username, 'assistant')
};
