import type { InventoryItem } from '../types';

export interface KitchenBuddyRequest {
  message: string;
  conversationHistory: { sender: string; text: string }[];
  pantry: InventoryItem[];
  language: string;
}

export interface KitchenBuddyResponse {
  answer: string;
  scope: string;
  normalizedQuestion: string;
  usedPantryContext: boolean;
}

export const kitchenBuddy = {
  ask: async (request: KitchenBuddyRequest): Promise<KitchenBuddyResponse> => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}/api/kitchen-buddy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error('Error contacting Kitchen Buddy backend:', error);
      throw error;
    }
  }
};
