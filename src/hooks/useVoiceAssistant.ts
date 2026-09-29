import { useState, useEffect, useCallback, useRef } from 'react';
import type { ShoppingItem, VoiceState, Language, ParsedCommand, ToastMessage, Recommendation, HistoryRecord, InventoryItem } from '../types';
import { StorageService } from '../services/storage';
import { VoiceRecognitionService } from '../services/voiceRecognition';
import { SpeechSynthesisService } from '../services/speechSynthesis';
import { MOCK_PRODUCTS } from '../data/mockProducts';
import confetti from 'canvas-confetti';

export function useVoiceAssistant() {
  const [items, setItems] = useState<ShoppingItem[]>(() => StorageService.getItems());
  const [inventory, setInventory] = useState<InventoryItem[]>(() => StorageService.getInventory());
  const [history] = useState<HistoryRecord[]>(() => StorageService.getHistory());
  const [language, setLanguageState] = useState<Language>(() => StorageService.getLanguage());
  const [ttsEnabled, setTtsEnabledState] = useState<boolean>(() => StorageService.getTTSEnabled());
  
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [transcript, setTranscript] = useState<string>('');
  const [lastCommand, setLastCommand] = useState<ParsedCommand | null>(null);
  const [audioVolume, setAudioVolume] = useState<number>(0);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState<string | null>(null);

  const voiceServiceRef = useRef<VoiceRecognitionService | null>(null);
  const ttsServiceRef = useRef<SpeechSynthesisService | null>(null);

  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetSilenceTimeout = useCallback((currentText?: string) => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }
    silenceTimerRef.current = setTimeout(() => {
      stopListening();
      if (currentText && currentText.trim()) {
        processCommand(currentText);
      }
    }, 3500);
  }, []);

  // Initialize Speech Services
  useEffect(() => {
    const voiceService = new VoiceRecognitionService(language);
    const ttsService = new SpeechSynthesisService();
    ttsService.setEnabled(ttsEnabled);
    ttsService.setLanguage(language);

    voiceService.onResultCallback = (text, isFinal) => {
      setTranscript(text);
      resetSilenceTimeout(text);
    };

    voiceService.onVolumeChangeCallback = (vol) => {
      setAudioVolume(vol);
    };

    voiceService.onErrorCallback = (err) => {
      console.warn('Voice recognition error:', err);
      setVoiceState('error');
      addToast('error', 'Voice Recognition', 'Could not catch that. Try typing or speaking again.');
    };

    voiceService.onEndCallback = () => {
      // Clean up timer if it ends natively
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      setVoiceState('idle');
    };

    voiceServiceRef.current = voiceService;
    ttsServiceRef.current = ttsService;
  }, [language, ttsEnabled, resetSilenceTimeout]);

  // Persist items & history
  useEffect(() => {
    StorageService.saveItems(items);
  }, [items]);

  useEffect(() => {
    StorageService.saveInventory(inventory);
  }, [inventory]);

  useEffect(() => {
    StorageService.saveHistory(history);
  }, [history]);

  const addToast = (type: ToastMessage['type'], title: string, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev.slice(-3), { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 2500); // Popup notification lasts for a few seconds
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    StorageService.saveLanguage(lang);
    if (voiceServiceRef.current) {
      voiceServiceRef.current.setLanguage(lang);
    }
    if (ttsServiceRef.current) {
      ttsServiceRef.current.setLanguage(lang);
    }
    addToast('info', 'Language Switched', `Switched voice & UI to ${lang.toUpperCase()}`);
  };

  const toggleTTS = () => {
    const newStatus = !ttsEnabled;
    setTtsEnabledState(newStatus);
    StorageService.saveTTSEnabled(newStatus);
    if (ttsServiceRef.current) {
      ttsServiceRef.current.setEnabled(newStatus);
    }
    addToast('info', 'Audio Feedback', newStatus ? 'Voice confirmation ON' : 'Voice confirmation OFF');
  };

  const speak = useCallback((text: string) => {
    if (ttsServiceRef.current) {
      ttsServiceRef.current.speak(text);
    }
  }, []);

  const startListening = () => {
    setTranscript('');
    setVoiceState('listening');
    
    if (voiceServiceRef.current) {
      const success = voiceServiceRef.current.start();
      if (!success) {
        setVoiceState('error');
      } else {
        resetSilenceTimeout('');
      }
    }
  };

  const stopListening = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }
    if (voiceServiceRef.current) {
      voiceServiceRef.current.stop();
    }
    setVoiceState('idle');
  }, []);

  // Central Command Dispatcher (Handles parsed intent)
  const processCommand = async (rawText: string) => {
    setVoiceState('processing');
    const parsed = await import('../services/intentParser').then(m => m.parseVoiceIntentAsync(rawText));
    setLastCommand(parsed);

    setTimeout(() => {
      executeIntent(parsed);
    }, 300);
  };

  const executeIntent = (parsed: ParsedCommand) => {
    switch (parsed.intent) {
      case 'ADD_ITEM': {
        if (!parsed.item) break;
        const newItem: ShoppingItem = {
          id: 'item-' + Date.now(),
          name: parsed.item,
          quantity: parsed.quantity || 1,
          unit: parsed.unit || 'units',
          category: 'Other',
          checked: false,
          addedAt: new Date().toISOString(),
          imageEmoji: inferEmoji(parsed.item)
        };
        setItems(prev => [...prev, newItem]);
        setVoiceState('success');
        speak(`Added ${newItem.quantity} ${newItem.unit} of ${newItem.name}.`);
        break;
      }

      case 'REMOVE_ITEM': {
        if (!parsed.item) break;
        const targetName = parsed.item.toLowerCase();
        setItems(prev => prev.filter(i => !i.name.toLowerCase().includes(targetName)));
        setVoiceState('success');
        speak(`Removed ${parsed.item} from the list.`);
        break;
      }

      case 'COMPLETE_ITEM': {
        if (!parsed.item) break;
        const targetName = parsed.item.toLowerCase();
        setItems(prev => prev.map(i => {
          if (i.name.toLowerCase().includes(targetName)) {
            return { ...i, checked: true };
          }
          return i;
        }));
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
        setVoiceState('success');
        addToast('success', 'Item Checked', `Marked ${parsed.item} as completed`);
        speak(`Checked off ${parsed.item}`);
        break;
      }

      case 'CLEAR_COMPLETED': {
        setItems(prev => prev.filter(i => !i.checked));
        setVoiceState('success');
        addToast('info', 'List Cleaned', 'Removed all completed items');
        speak('Cleared completed items from your list');
        break;
      }

      case 'SEARCH_PRODUCT': {
        setSearchQuery(parsed.item || 'grocery');
        setVoiceState('success');
        addToast('info', 'Voice Search', `Searching for ${parsed.item || 'products'}`);
        speak(`Found products matching ${parsed.item || 'your query'}`);
        break;
      }

      case 'GET_RECOMMENDATIONS': {
        setVoiceState('success');
        addToast('info', 'Smart Suggestions', 'Here are your replenishment & seasonal suggestions');
        speak('Here are your personalized pantry suggestions based on your purchase history');
        break;
      }

      case 'FIND_SUBSTITUTE': {
        const itemToSwap = parsed.item || 'milk';
        setSearchQuery(itemToSwap);
        setVoiceState('success');
        addToast('info', 'Smart Swap', `Showing health & dietary alternatives for ${itemToSwap}`);
        speak(`Looking up substitutes for ${itemToSwap}`);
        break;
      }

      default: {
        setVoiceState('error');
        addToast('warning', 'Unrecognized Command', 'Try saying "Add 2 bottles of water" or "Find organic apples"');
        break;
      }
    }

    // Return to idle state after executing command
    setVoiceState('idle');
    if (voiceServiceRef.current) {
      voiceServiceRef.current.stop();
    }
  };

  // Helper emoji inferrer for custom items
  const inferEmoji = (itemName: string): string => {
    const lower = itemName.toLowerCase();
    if (lower.includes('apple')) return '🍎';
    if (lower.includes('banana')) return '🍌';
    if (lower.includes('milk')) return '🥛';
    if (lower.includes('egg')) return '🥚';
    if (lower.includes('bread')) return '🍞';
    if (lower.includes('water')) return '💧';
    if (lower.includes('coffee')) return '☕';
    if (lower.includes('spinach') || lower.includes('green')) return '🥬';
    if (lower.includes('rice')) return '🍚';
    if (lower.includes('pasta')) return '🍝';
    if (lower.includes('soap')) return '🧼';
    if (lower.includes('toothpaste')) return '🪥';
    return '🛒';
  };

  // Direct List Manipulations
  const toggleItemChecked = (id: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const nextState = !item.checked;
        if (nextState) {
          confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
        }
        return { ...item, checked: nextState };
      }
      return item;
    }));
  };

  const updateItemQuantity = (id: string, delta: number) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
    addToast('info', 'Item Removed', 'Item removed from list');
  };

  const addItemFromProduct = (product: typeof MOCK_PRODUCTS[0]) => {
    const newItem: ShoppingItem = {
      id: 'item-' + Date.now(),
      name: product.name,
      quantity: 1,
      unit: product.unit,
      category: product.category,
      checked: false,
      addedAt: new Date().toISOString(),
      brand: product.brand,
      imageEmoji: product.imageEmoji,
      isSeasonal: product.isSeasonal
    };
    setItems(prev => [newItem, ...prev]);
    addToast('success', 'Added', `Added ${product.name} to stream`);
    // Removed speak() per user request
  };

  const clearAllCompleted = () => {
    setItems(prev => prev.filter(i => !i.checked));
    addToast('info', 'Completed Cleared', 'Removed all completed items');
  };

  const updateInventoryItem = (id: string, updates: Partial<InventoryItem>) => {
    setInventory(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
    addToast('success', 'Pantry Updated', 'Item details saved');
  };

  const removeInventoryItem = (id: string) => {
    setInventory(prev => prev.filter(item => item.id !== id));
    addToast('info', 'Item Removed', 'Removed from pantry');
  };

  const addInventoryItem = (item: InventoryItem) => {
    setInventory(prev => [item, ...prev]);
    addToast('success', 'Added to Pantry', `${item.name} added to your pantry`);
  };

  // Smart Recommendations Generator
  const getSmartRecommendations = (): Recommendation[] => {
    const recs: Recommendation[] = [];
    const inventoryNames = inventory.map(i => i.name.toLowerCase());

    // 1. Frequency Replenishment & Low Stock / Missing
    history.forEach(hist => {
      const daysSince = Math.floor((Date.now() - new Date(hist.lastPurchasedDate).getTime()) / 86400000);
      const isDue = daysSince >= hist.averageIntervalDays - 1;
      
      const inventoryItem = inventory.find(i => i.name.toLowerCase().includes(hist.itemName.toLowerCase()));
      const isMissing = !inventoryItem;
      const isLowStock = inventoryItem && (inventoryItem.quantity <= 2 || inventoryItem.isLowStock);
      
      // Recommend if it's historically due OR it's missing from pantry OR low stock
      if (isDue || isMissing || isLowStock) {
        // Skip if already in shopping list
        if (items.some(i => i.name.toLowerCase().includes(hist.itemName.toLowerCase()))) return;
        // Skip if we have plenty in pantry and it's not missing/low
        if (!isMissing && !isLowStock && !isDue) return;

        const matchingProd = MOCK_PRODUCTS.find(p => p.name.toLowerCase().includes(hist.itemName.toLowerCase())) || {
          id: hist.id,
          name: hist.itemName,
          brand: 'Pantry Essential',
          category: hist.category,
          unit: hist.unit,
          inStock: true,
          isSeasonal: false,
          imageEmoji: inferEmoji(hist.itemName)
        };
        
        let reason = isMissing ? 'Missing from pantry' : isLowStock ? 'Currently low stock in pantry' : `Usually bought every ${hist.averageIntervalDays} days`;
        
        recs.push({
          id: 'rec-' + hist.id,
          type: 'replenishment',
          product: matchingProd as any,
          reason,
          frequencyDays: hist.averageIntervalDays,
          lastBoughtDaysAgo: daysSince,
          confidenceScore: isMissing ? 0.98 : isLowStock ? 0.95 : 0.85
        });
      }
    });

    // 2. Seasonal Fresh Produce
    MOCK_PRODUCTS.filter(p => p.isSeasonal).forEach(prod => {
      if (!items.some(i => i.name.toLowerCase().includes(prod.name.toLowerCase())) && !inventoryNames.some(n => n.includes(prod.name.toLowerCase()))) {
        recs.push({
          id: 'rec-season-' + prod.id,
          type: 'seasonal',
          product: prod,
          reason: 'In peak harvest season this week',
          confidenceScore: 0.88
        });
      }
    });

    // 3. Substitutes for active items
    items.forEach(item => {
      const prod = MOCK_PRODUCTS.find(p => p.name.toLowerCase().includes(item.name.toLowerCase()));
      if (prod && prod.substitutes && prod.substitutes.length > 0) {
        const subName = prod.substitutes[0];
        const subProd = MOCK_PRODUCTS.find(p => p.name.toLowerCase().includes(subName.toLowerCase()));
        if (subProd && !items.some(i => i.name.toLowerCase().includes(subProd.name.toLowerCase())) && !inventoryNames.some(n => n.includes(subProd.name.toLowerCase()))) {
          recs.push({
            id: 'rec-sub-' + subProd.id,
            type: 'substitute',
            product: subProd,
            reason: `Popular healthy alternative to ${item.name}`,
            confidenceScore: 0.82
          });
        }
      }
    });

    // Sort by confidence
    recs.sort((a, b) => b.confidenceScore - a.confidenceScore);
    
    // Deduplicate by name just in case
    const uniqueRecs = [];
    const seenNames = new Set();
    for (const rec of recs) {
        if (!seenNames.has(rec.product.name)) {
            seenNames.add(rec.product.name);
            uniqueRecs.push(rec);
        }
    }

    return uniqueRecs.slice(0, 6);
  };

  return {
    items,
    inventory,
    history,
    language,
    ttsEnabled,
    voiceState,
    transcript,
    lastCommand,
    audioVolume,
    toasts,
    searchQuery,
    setLanguage,
    toggleTTS,
    startListening,
    stopListening,
    processCommand,
    toggleItemChecked,
    updateItemQuantity,
    removeItem,
    addItemFromProduct,
    clearAllCompleted,
    updateInventoryItem,
    removeInventoryItem,
    addInventoryItem,
    removeToast,
    setSearchQuery,
    getSmartRecommendations
  };
}
