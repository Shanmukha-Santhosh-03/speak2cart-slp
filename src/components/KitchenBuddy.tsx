import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KitchenBuddyMascot } from './KitchenBuddyMascot';
import { X, Send } from 'lucide-react';
import type { InventoryItem, ShoppingItem, HistoryRecord } from '../types';
import { kitchenBuddy } from '../services/kitchenBuddyAI';

interface Message {
  id: string;
  sender: 'buddy' | 'user';
  text: string;
  actions?: { label: string; onClick: () => void }[];
  recipeMode?: boolean;
}

interface KitchenBuddyProps {
  inventory: InventoryItem[];
  items: ShoppingItem[];
  history: HistoryRecord[];
  onAddShoppingItem: (name: string) => void;
}

export const KitchenBuddy: React.FC<KitchenBuddyProps> = ({ inventory, onAddShoppingItem }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mascotState, setMascotState] = useState<'idle' | 'hover' | 'thinking' | 'speaking' | 'suggesting' | 'happy'>('idle');
  
  const [messages, setMessages] = useState<Message[]>([{
    id: 'msg-init',
    sender: 'buddy',
    text: "Hi! I'm Kitchen Buddy. What would you like to know about your kitchen?",
    actions: [
      { label: 'What can I cook today?', onClick: () => handleActionClick('What can I cook today?') },
      { label: 'Explain a masala', onClick: () => handleActionClick('Explain a masala') },
      { label: 'What can I make with my pantry?', onClick: () => handleActionClick('What can I make with my pantry?') }
    ]
  }]);
  
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleActionClick = (text: string) => {
    handleUserSubmit(text);
  };

  const handleUserSubmit = async (text: string = inputValue) => {
    if (!text.trim()) return;
    
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', text }]);
    setInputValue('');
    setMascotState('thinking');

    try {
      const historyForBackend = messages.map(msg => ({ sender: msg.sender, text: msg.text }));
      
      const response = await kitchenBuddy.ask({
        message: text,
        conversationHistory: historyForBackend,
        pantry: inventory,
        language: "English"
      });
      
      let happy = false;
      let recipeMode = response.answer.includes('**') || response.answer.includes('Step');
      
      let actions: { label: string; onClick: () => void }[] | undefined;
      const lowerResp = response.answer.toLowerCase();
      if (lowerResp.includes('missing') && (lowerResp.includes('sambar') || lowerResp.includes('tamarind') || lowerResp.includes('vegetable'))) {
        actions = [{
          label: 'Add missing ingredients to list',
          onClick: () => {
            onAddShoppingItem('Missing Ingredients');
            setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'buddy', text: 'Added missing items to your shopping list!' }]);
          }
        }];
      }

      setMascotState('speaking');
      setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'buddy', text: response.answer, actions, recipeMode }]);
      setTimeout(() => setMascotState(happy ? 'happy' : 'idle'), 2000);
      
    } catch (err) {
      console.error("Backend error:", err);
      // Fallback
      setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'buddy', text: "Kitchen Buddy is temporarily unavailable. Please try again." }]);
      setMascotState('idle');
    }
  };





  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="mb-4 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-[#E7E0D5] overflow-hidden flex flex-col max-h-[500px]"
          >
            {/* Header */}
            <div className="bg-[#FAF7F2] p-4 border-b border-[#E7E0D5] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <KitchenBuddyMascot state={mascotState} className="w-8 h-8" />
                <h3 className="font-serif text-lg font-semibold text-[#1C1917]">Kitchen Buddy</h3>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-[#78716C] hover:bg-[#E7E0D5] hover:text-[#1C1917] rounded-full transition-colors"
                aria-label="Close Kitchen Buddy"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 p-4 overflow-y-auto bg-[#FFFDF9] space-y-4">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl p-3 text-sm ${
                    msg.sender === 'user' 
                      ? 'bg-[#2C4A3E] text-white rounded-tr-sm' 
                      : 'bg-[#F4EFE6] text-[#1C1917] rounded-tl-sm'
                  }`}>
                    {msg.recipeMode ? (
                      <div className="whitespace-pre-line leading-relaxed font-sans">
                        {/* Super simple markdown parsing for bold */}
                        {msg.text.split('**').map((chunk, i) => i % 2 === 1 ? <strong key={i}>{chunk}</strong> : chunk)}
                      </div>
                    ) : (
                      <p className="leading-relaxed">{msg.text}</p>
                    )}

                    {msg.actions && (
                      <div className="mt-3 flex flex-col gap-2">
                        {msg.actions.map(action => (
                          <button
                            key={action.label}
                            onClick={action.onClick}
                            className="text-left text-xs bg-white text-[#2C4A3E] border border-[#2C4A3E]/20 hover:bg-[#E7E0D5] px-3 py-2 rounded-lg transition-colors font-medium"
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white border-t border-[#E7E0D5]">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleUserSubmit(); }}
                className="flex items-center gap-2"
              >
                <input 
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask Kitchen Buddy..."
                  className="flex-1 bg-[#F4EFE6] border border-[#E7E0D5] rounded-full px-4 py-2 text-sm text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#2C4A3E]/30"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="p-2 bg-[#E06D53] hover:bg-[#C85B42] disabled:bg-[#E7E0D5] text-white rounded-full transition-colors"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={() => {
            setIsOpen(true);
            setMascotState('idle');
          }}
          className="flex items-center justify-center p-2 bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[#E7E0D5] hover:scale-105 transition-transform group"
          aria-label="Open Kitchen Buddy"
        >
          <div className="flex flex-col items-center">
            <KitchenBuddyMascot state="idle" className="w-14 h-14" />
            <span className="text-[10px] font-medium text-[#78716C] group-hover:text-[#2C4A3E] mt-1 tracking-wider uppercase">Buddy</span>
          </div>
        </motion.button>
      )}
    </div>
  );
};
