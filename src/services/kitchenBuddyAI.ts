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
      const API_URL = import.meta.env.VITE_KITCHEN_BUDDY_API_URL;
      
      if (!API_URL) {
        throw new Error('VITE_KITCHEN_BUDDY_API_URL is not configured');
      }

      let response: Response;
      try {
        response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(request),
        });
      } catch (fetchError) {
        throw new Error(`NETWORK_ERROR: ${fetchError instanceof Error ? fetchError.message : 'Failed to connect to proxy'}`);
      }
      
      if (!response.ok) {
        let errorBody = '';
        try {
          const errData = await response.json();
          errorBody = errData.error || errData.message || response.statusText;
        } catch {
          errorBody = response.statusText;
        }

        if (response.status === 500 && errorBody.includes('GEMINI_API_KEY')) {
          throw new Error('MISSING_API_KEY: Gemini API Key is not configured on the Cloudflare Worker');
        } else if (response.status === 401 || response.status === 403) {
          throw new Error(`INVALID_API_KEY: ${errorBody}`);
        } else if (response.status === 429) {
          throw new Error(`RATE_LIMIT: ${errorBody}`);
        } else {
          throw new Error(`API_ERROR (${response.status}): ${errorBody}`);
        }
      }
      
      const data = await response.json();
      if (!data || !data.answer) {
        throw new Error('INVALID_RESPONSE: The response did not contain an answer');
      }
      return data;
    } catch (error) {
      console.error('[KitchenBuddy] request failed:', error);
      throw error;
    }
  }
};
