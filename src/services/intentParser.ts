import type { Category, ParsedCommand, IntentType } from '../types';
import { MOCK_PRODUCTS } from '../data/mockProducts';

// Helper maps for unit recognition
const UNIT_MAP: Record<string, string> = {
  bottle: 'bottles',
  bottles: 'bottles',
  botal: 'bottles',
  botella: 'bottles',
  botellas: 'bottles',
  carton: 'cartons',
  cartons: 'cartons',
  box: 'boxes',
  boxes: 'boxes',
  bag: 'bags',
  bags: 'bags',
  pack: 'packs',
  packs: 'packs',
  paquetes: 'packs',
  loaf: 'loaf',
  loaves: 'loaf',
  pan: 'loaf',
  bunch: 'bunch',
  bunches: 'bunch',
  tub: 'tubs',
  tubs: 'tubs',
  tube: 'tubes',
  tubes: 'tubes',
  roll: 'rolls',
  rolls: 'rolls',
  kg: 'kg',
  kilo: 'kg',
  kilos: 'kg',
  lb: 'lbs',
  lbs: 'lbs',
  pound: 'lbs',
  pounds: 'lbs',
  pc: 'pcs',
  pcs: 'pcs',
  piece: 'pcs',
  pieces: 'pcs',
  item: 'pcs',
  items: 'pcs'
};

// Word to number conversion
const NUMBER_WORDS: Record<string, number> = {
  one: 1, a: 1, an: 1, ek: 1, uno: 1, una: 1,
  two: 2, do: 2, dos: 2,
  three: 3, teen: 3, tres: 3,
  four: 4, char: 4, cuatro: 4,
  five: 5, paanch: 5, cinco: 5,
  six: 6, chhe: 6, seis: 6,
  seven: 7, saat: 7, siete: 7,
  eight: 8, aath: 8, ocho: 8,
  nine: 9, nau: 9, nueve: 9,
  ten: 10, das: 10, diez: 10,
  half: 0.5, ' आधा': 0.5, medio: 0.5
};

// Category lookup by product keyphrases
function inferCategory(itemText: string): Category {
  const text = itemText.toLowerCase();
  
  if (text.match(/apple|banana|strawberry|fruit|berry|lemon|grape|fruta|mango|orange|peach/)) {
    return 'Fruits';
  }
  if (text.match(/spinach|avocado|vegetable|tomato|lettuce|onion|potato|sabzi|carrot|broccoli/)) {
    return 'Vegetables';
  }
  if (text.match(/milk|egg|cheese|yogurt|butter|cream|dairy|doodh|anda|leche|huevo/)) {
    return 'Dairy';
  }
  if (text.match(/rice|pasta|oil|olive|flour|sugar|sauce|cereal|chickpea|penne|grain|chawal|तेल|aceite|arroz/)) {
    return 'Cooking Essentials';
  }
  if (text.match(/bread|sourdough|toast|croissant|bagel|bakery|roti|pan/)) {
    return 'Other';
  }
  if (text.match(/water|juice|coffee|tea|sparkling|soda|bev|drink|paani|chai|agua|cafe/)) {
    return 'Beverages';
  }
  if (text.match(/soap|toothpaste|towel|paper|detergent|cleaner|brush|shampoo|household|sabun|papel/)) {
    return 'Other';
  }
  if (text.match(/chip|snack|chocolate|cookie|biscuit|nut|crisp/)) {
    return 'Snacks';
  }
  
  // Try matching against product database
  const match = MOCK_PRODUCTS.find(p => p.name.toLowerCase().includes(text) || text.includes(p.name.toLowerCase()));
  if (match) return match.category;

  return 'Other';
}

export function parseVoiceIntent(rawInput: string): ParsedCommand {
  const text = rawInput.trim();
  const lower = text.toLowerCase();

  if (!text) {
    return {
      intent: 'UNKNOWN',
      rawText: '',
      confidence: 0,
      suggestedActionText: 'Please say or type a command.'
    };
  }

  // 1. CLEAR COMPLETED
  if (lower.match(/clear completed|remove completed|delete completed|clean done|saaf karo/)) {
    return {
      intent: 'CLEAR_COMPLETED',
      rawText: text,
      confidence: 0.95,
      suggestedActionText: 'Clearing completed items'
    };
  }

  // 2. GET RECOMMENDATIONS / LOW STOCK
  if (lower.match(/what am i running low on|what do i need|show recommendations|suggest|recommend|kya chahiye|que necesito/)) {
    return {
      intent: 'GET_RECOMMENDATIONS',
      rawText: text,
      confidence: 0.9,
      suggestedActionText: 'Showing smart recommendations'
    };
  }

  // 3. FIND SUBSTITUTES
  if (lower.match(/alternative|substitute|swap|instead of|vikalp/)) {
    const itemMatch = lower.replace(/.*(alternative to|substitute for|swap for|instead of|vikalp)\s+/, '');
    return {
      intent: 'FIND_SUBSTITUTE',
      rawText: text,
      item: itemMatch.trim(),
      confidence: 0.9,
      suggestedActionText: `Finding alternatives for ${itemMatch.trim()}`
    };
  }

  // 4. SEARCH / FILTER PRODUCTS
  if (lower.match(/find|search|look for|under \$|khojo|busca/)) {
    let priceFilter: number | undefined;
    const priceMatch = lower.match(/under \$?(\d+(\.\d+)?)|less than \$?(\d+(\.\d+)?)/);
    if (priceMatch) {
      priceFilter = parseFloat(priceMatch[1] || priceMatch[3]);
    }

    const cleanSearchText = lower
      .replace(/find|search|look for|under \$?\d+(\.\d+)?|less than \$?\d+(\.\d+)?|khojo|busca/g, '')
      .replace(/organic|fresh|best/g, '')
      .trim();

    return {
      intent: 'SEARCH_PRODUCT',
      rawText: text,
      item: cleanSearchText || 'grocery items',
      priceFilter,
      confidence: 0.88,
      suggestedActionText: `Searching for ${cleanSearchText || 'items'}${priceFilter ? ` under $${priceFilter}` : ''}`
    };
  }

  // 5. REMOVE ITEM
  if (lower.match(/remove|delete|drop|clear|hatao|elimina|quita/)) {
    const itemText = lower
      .replace(/remove|delete|drop|clear|from my list|from list|hatao|elimina|quita/g, '')
      .replace(/the|a|an/g, '')
      .trim();

    return {
      intent: 'REMOVE_ITEM',
      rawText: text,
      item: itemText,
      confidence: 0.9,
      suggestedActionText: `Removing ${itemText} from list`
    };
  }

  // 6. COMPLETE / CHECK OFF ITEM
  if (lower.match(/check off|mark as done|got the|bought the|completed|khareed liya/)) {
    const itemText = lower
      .replace(/check off|mark as done|mark|got the|bought the|completed|khareed liya/g, '')
      .replace(/the|a|an/g, '')
      .trim();

    return {
      intent: 'COMPLETE_ITEM',
      rawText: text,
      item: itemText,
      confidence: 0.92,
      suggestedActionText: `Marked ${itemText} as completed`
    };
  }

  // 7. ADD ITEM (DEFAULT INTENT FOR NATURAL PHRASING)
  // Extracts quantity, unit, and item name
  // Examples: "Add 2 bottles of water", "I need 6 apples", "2 botal paani jodo", "Agrega 2 botellas de agua"
  let quantity = 1;
  let unit = 'pcs';
  let cleanItem = lower
    .replace(/add|i need|put|get|buy|jodo|chahiye|agrega|necesito|traer/g, '')
    .replace(/on my list|to my list|to list|in list|saaman/g, '')
    .trim();

  // Extract numeric digits (e.g., 2, 6, 1.5)
  const numberMatch = cleanItem.match(/(\d+(\.\d+)?)/);
  if (numberMatch) {
    quantity = parseFloat(numberMatch[1]);
    cleanItem = cleanItem.replace(numberMatch[1], '').trim();
  } else {
    // Check for word numbers
    for (const [word, num] of Object.entries(NUMBER_WORDS)) {
      const regex = new RegExp(`\\b${word}\\b`, 'i');
      if (regex.test(cleanItem)) {
        quantity = num;
        cleanItem = cleanItem.replace(regex, '').trim();
        break;
      }
    }
  }

  // Extract units
  for (const [key, normalizedUnit] of Object.entries(UNIT_MAP)) {
    const regex = new RegExp(`\\b${key}\\b`, 'i');
    if (regex.test(cleanItem)) {
      unit = normalizedUnit;
      cleanItem = cleanItem.replace(regex, '').trim();
      break;
    }
  }

  // Clean remaining filler words (of, the, a, an, de)
  cleanItem = cleanItem
    .replace(/\b(of|the|a|an|de|pack of|box of|bottle of|carton of)\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Capitalize item name nicely
  const formattedItem = cleanItem ? cleanItem.charAt(0).toUpperCase() + cleanItem.slice(1) : 'Item';
  const category = inferCategory(formattedItem);

  return {
    intent: 'ADD_ITEM',
    rawText: text,
    item: formattedItem,
    quantity,
    unit,
    category,
    confidence: 0.95,
    suggestedActionText: `Added ${quantity} ${unit} of ${formattedItem}`
  };
}

import { predictIntentTFJS } from './tfjsModel';

export async function parseVoiceIntentAsync(rawInput: string): Promise<ParsedCommand> {
  try {
    // First, get the rule-based parsed command (this handles all entity extraction gracefully)
    const ruleBasedParsed = parseVoiceIntent(rawInput);
    
    // Call the local TFJS model
    const prediction = await predictIntentTFJS(rawInput);
    
    // Override intent and confidence with the model's prediction
    ruleBasedParsed.intent = prediction.intent as IntentType;
    ruleBasedParsed.confidence = prediction.confidence;

    return ruleBasedParsed;
    
  } catch (error) {
    console.warn("TFJS Model unavailable or failed, falling back to rule parser.", error);
    return parseVoiceIntent(rawInput);
  }
}
