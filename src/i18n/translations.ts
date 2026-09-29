import type { Language } from '../types';

export interface Translations {
  tagline: string;
  orbIdle: string;
  orbListening: string;
  orbProcessing: string;
  orbError: string;
  trySaying: string;
  typePlaceholder: string;
  shoppingStream: string;
  itemsCount: string;
  completed: string;
  clearCompleted: string;
  youMightNeed: string;
  goodThisWeek: string;
  smartSubstitutes: string;
  add: string;
  added: string;
  remove: string;
  edit: string;
  substitute: string;
  searchTitle: string;
  historyTitle: string;
  categories: Record<string, string>;
  micDenied: string;
  typeCommand: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    tagline: "Voice-first pantry & grocery intelligent assistant",
    orbIdle: "Tell me what you need",
    orbListening: "I'm listening...",
    orbProcessing: "Understanding your request...",
    orbError: "I didn't quite catch that. Try again or type below.",
    trySaying: "Try saying:",
    typePlaceholder: "e.g. Add 2 cartons of oat milk or Find toothpaste under $5...",
    shoppingStream: "Shopping Stream",
    itemsCount: "items remaining",
    completed: "Completed",
    clearCompleted: "Clear completed",
    youMightNeed: "You might need these",
    goodThisWeek: "Fresh & seasonal this week",
    smartSubstitutes: "Smart Substitutes",
    add: "Add",
    added: "Added",
    remove: "Remove",
    edit: "Edit",
    substitute: "Swap",
    searchTitle: "Voice Product Discovery",
    historyTitle: "Purchase History & Predictions",
    categories: {
      Produce: "Produce",
      Dairy: "Dairy",
      Pantry: "Pantry",
      Bakery: "Bakery",
      Beverages: "Beverages",
      Household: "Household",
      Snacks: "Snacks",
      Other: "Other"
    },
    micDenied: "Microphone permission is denied or unsupported. Using interactive text fallback.",
    typeCommand: "Type command"
  },
  hi: {
    tagline: "आवाज से चलने वाला स्मार्ट ग्रॉसरी असिस्टेंट",
    orbIdle: "आपको क्या चाहिए, बताइए",
    orbListening: "मैं सुन रहा हूँ...",
    orbProcessing: "समझ रहा हूँ...",
    orbError: "क्षमा करें, समझ नहीं आया। पुनः प्रयास करें या लिखें।",
    trySaying: "बोलकर देखें:",
    typePlaceholder: "जैसे: 2 बोटल पानी जोड़ो या 500 रुपये के अंदर चावल खोजो...",
    shoppingStream: "खरीदारी सूची",
    itemsCount: "सामान बाकी",
    completed: "पूरा हुआ",
    clearCompleted: "पूरे किए गए हटाएं",
    youMightNeed: "आपको इनकी जरूरत हो सकती है",
    goodThisWeek: "इस हफ्ते ताजा और मौसमी",
    smartSubstitutes: "स्मार्ट विकल्प",
    add: "जोड़ें",
    added: "जोड़ दिया",
    remove: "हटाएं",
    edit: "बदलें",
    substitute: "बदलें",
    searchTitle: "वॉयस उत्पाद खोज",
    historyTitle: "खरीदारी का इतिहास",
    categories: {
      Produce: "फल और सब्जियां",
      Dairy: "डेयरी",
      Pantry: "पेंट्री (राशन)",
      Bakery: "बेकरी",
      Beverages: "पेय पदार्थ",
      Household: "घरेलू सामान",
      Snacks: "स्नैक्स",
      Other: "अन्य"
    },
    micDenied: "माइक्रोफोन की अनुमति नहीं है। टेक्स्ट मोड का उपयोग करें।",
    typeCommand: "कमांड टाइप करें"
  }
};
