import { useState, useEffect } from 'react';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';
import { Header } from '../components/Header';
import { VoiceOrb } from '../components/VoiceOrb';
import { QuickVoiceGuide } from '../components/QuickVoiceGuide';
import { ShoppingList } from '../components/ShoppingList';
import { DatabaseView } from '../components/DatabaseView';
import { SmartBuyView } from '../components/SmartBuyView';
import { MagicRecipe } from '../components/MagicRecipe';
import { VoiceSearchModal } from '../components/VoiceSearchModal';
import { KitchenBuddy } from '../components/KitchenBuddy';
import { HistoryDrawer } from '../components/HistoryDrawer';
import { ToastContainer } from '../components/ToastContainer';
import { Mic, Search, History, Database, ShoppingBag } from 'lucide-react';

export function Workspace() {
  const {
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
    addItemFromProduct,
    clearAllCompleted,
    updateInventoryItem,
    removeInventoryItem,
    addInventoryItem,
    removeToast,
    setSearchQuery,
    getSmartRecommendations
  } = useVoiceAssistant();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [activeView, setActiveView] = useState<'home' | 'pantry' | 'assistant' | 'shopping'>('home');

  const recommendations = getSmartRecommendations();
  const activeItemsCount = items.filter(i => !i.checked).length;
  
  const pantryCount = inventory.length;
  const expiringCount = inventory.filter(i => Math.ceil((new Date(i.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) <= 3 && Math.ceil((new Date(i.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) >= 0).length;
  const lowStockCount = inventory.filter(i => i.quantity <= 2).length;

  // Sync search trigger when voice search intent detected
  useEffect(() => {
    if (searchQuery) {
      setIsSearchOpen(true);
    }
  }, [searchQuery]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        if (voiceState === 'listening') {
          stopListening();
        } else {
          startListening();
        }
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [voiceState, startListening, stopListening]);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917] flex flex-col font-sans selection:bg-[#E06D53]/20">
      
      <Header
        language={language}
        onLanguageChange={setLanguage}
        ttsEnabled={ttsEnabled}
        onToggleTTS={toggleTTS}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 md:px-8 py-6 pb-28 md:pb-12 space-y-8">
        
        {/* Tab Navigation */}
        <div className="flex items-center justify-center gap-2 p-1.5 rounded-full bg-white border border-[#E7E0D5] max-w-fit mx-auto shadow-sm sticky top-4 z-30">
          <button
            onClick={() => setActiveView('home')}
            className={`flex items-center gap-2 px-6 py-2 text-sm font-semibold rounded-full transition-all ${
              activeView === 'home'
                ? 'bg-[#E06D53] text-white shadow-md'
                : 'text-[#78716C] hover:bg-[#F4EFE6]'
            }`}
          >
             <span className="hidden sm:inline">Home</span>
          </button>

          <button
            onClick={() => setActiveView('pantry')}
            className={`flex items-center gap-2 px-6 py-2 text-sm font-semibold rounded-full transition-all ${
              activeView === 'pantry'
                ? 'bg-[#2C4A3E] text-white shadow-md'
                : 'text-[#78716C] hover:bg-[#F4EFE6]'
            }`}
          >
            <Database className="w-4 h-4" /> <span className="hidden sm:inline">Pantry</span>
          </button>

          <button
            onClick={() => setActiveView('assistant')}
            className={`flex items-center gap-2 px-6 py-2 text-sm font-semibold rounded-full transition-all ${
              activeView === 'assistant'
                ? 'bg-[#2C4A3E] text-white shadow-md'
                : 'text-[#78716C] hover:bg-[#F4EFE6]'
            }`}
          >
            <Mic className="w-4 h-4" /> <span className="hidden sm:inline">Assistant</span>
          </button>
          
          <button
            onClick={() => setActiveView('shopping')}
            className={`flex items-center gap-2 px-6 py-2 text-sm font-semibold rounded-full transition-all ${
              activeView === 'shopping'
                ? 'bg-[#2C4A3E] text-white shadow-md'
                : 'text-[#78716C] hover:bg-[#F4EFE6]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" /> <span className="hidden sm:inline">Shopping List</span>
            {activeItemsCount > 0 && activeView !== 'shopping' && (
              <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1 right-2 animate-pulse" />
            )}
          </button>
        </div>

        {/* Tab Content */}
        <div className="pt-4 pb-8">
          {activeView === 'home' && (
            <section className="w-full flex flex-col items-center justify-center min-h-[50vh]">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-serif-editorial text-Speak2Cart-forest mb-2">Good evening, User</h2>
                <p className="text-Speak2Cart-muted text-lg">Your pantry is ready.</p>
              </div>
              <VoiceOrb
                voiceState={voiceState}
                transcript={transcript}
                language={language}
                audioVolume={audioVolume}
                lastCommand={lastCommand}
                onStartListening={startListening}
                onStopListening={stopListening}
                onTextSubmit={(text) => processCommand(text)}
              />
              <QuickVoiceGuide
                language={language}
                onSelectPrompt={(prompt) => processCommand(prompt)}
              />
              <div className="mt-16 flex gap-6 text-sm text-Speak2Cart-muted">
                <div className="text-center"><strong className="text-Speak2Cart-forest text-xl block mb-1">{pantryCount}</strong> Pantry Items</div>
                <div className="text-center"><strong className="text-amber-600 text-xl block mb-1">{expiringCount}</strong> Expiring Soon</div>
                <div className="text-center"><strong className="text-rose-600 text-xl block mb-1">{lowStockCount}</strong> Low Stock</div>
                <div className="text-center"><strong className="text-Speak2Cart-terracotta text-xl block mb-1">{activeItemsCount}</strong> Shopping Items</div>
              </div>

              <div className="w-full max-w-2xl mt-12">
                <ShoppingList
                  items={items}
                  onToggleChecked={toggleItemChecked}
                  onClearCompleted={clearAllCompleted}
                />
              </div>
            </section>
          )}

          {activeView === 'pantry' && (
            <div className="space-y-12">
               <DatabaseView 
                 inventory={inventory} 
                 onUpdateItem={updateInventoryItem}
                 onRemoveItem={removeInventoryItem}
                 onAddItem={addInventoryItem}
               />
               <SmartBuyView 
                 recommendations={recommendations}
                 onAddProduct={addItemFromProduct}
               />
               <MagicRecipe inventory={inventory} cartItems={items} />
            </div>
          )}

          {activeView === 'assistant' && (
            <>
             <section className="w-full max-w-2xl mx-auto bg-white rounded-3xl p-6 shadow-sm border border-[#E7E0D5] min-h-[50vh] flex flex-col justify-end">
               <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                  <div className="flex justify-start">
                    <div className="bg-[#F4EFE6] text-[#2C4A3E] px-4 py-3 rounded-2xl rounded-tl-sm max-w-[80%] text-sm">
                      Hi there! I'm Shannu. Ask me what's in your pantry or what's expiring soon.
                    </div>
                  </div>
                  {/* Chat history will be mapped here later */}
               </div>
               <div className="border-t border-[#E7E0D5] pt-4">
                 <VoiceOrb
                    voiceState={voiceState}
                    transcript={transcript}
                    language={language}
                    audioVolume={audioVolume}
                    lastCommand={lastCommand}
                    onStartListening={startListening}
                    onStopListening={stopListening}
                    onTextSubmit={(text) => processCommand(text)}
                  />
               </div>
             </section>
             
             <div className="w-full max-w-2xl mx-auto mt-8">
               <ShoppingList
                  items={items}
                  onToggleChecked={toggleItemChecked}
                  onClearCompleted={clearAllCompleted}
                />
             </div>
           </>
          )}

          {activeView === 'shopping' && (
            <ShoppingList
              items={items}
              onToggleChecked={toggleItemChecked}
              onClearCompleted={clearAllCompleted}
            />
          )}

          <KitchenBuddy 
            inventory={inventory} 
            items={items} 
            history={history}
            onAddShoppingItem={(name) => {
              // Direct mock for Kitchen buddy adding missing item
              addItemFromProduct({
                id: 'kb-' + Date.now(),
                name: name,
                brand: 'Pantry Request',
                category: 'Other',
                price: 0,
                unit: 'units',
                inStock: false,
                isSeasonal: false,
                imageEmoji: '🛒',
                substitutes: []
              } as any);
            }} 
          />
        </div>
      </main>

      {/* Mobile Voice Quick Dock Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-t border-[#E7E0D5] p-3 flex items-center justify-around">
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex flex-col items-center gap-1 text-[#78716C] hover:text-[#1C1917]"
        >
          <Search className="w-5 h-5 text-[#2C4A3E]" />
          <span className="text-[10px] font-medium uppercase tracking-wider">Search</span>
        </button>

        <button
          onClick={voiceState === 'listening' ? stopListening : startListening}
          className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg transition-transform active:scale-90 -mt-6 border-4 border-[#FAF7F2] ${
            voiceState === 'listening' ? 'bg-[#E06D53] animate-pulse' : 'bg-[#2C4A3E]'
          }`}
        >
          <Mic className="w-6 h-6" />
        </button>

        <button
          onClick={() => setIsHistoryOpen(true)}
          className="flex flex-col items-center gap-1 text-[#78716C] hover:text-[#1C1917]"
        >
          <History className="w-5 h-5 text-[#2C4A3E]" />
          <span className="text-[10px] font-medium uppercase tracking-wider">History</span>
        </button>
      </div>

      <VoiceSearchModal
        isOpen={isSearchOpen}
        searchQuery={searchQuery}
        language={language}
        onClose={() => {
          setIsSearchOpen(false);
          setSearchQuery(null);
        }}
        onAddProduct={addItemFromProduct}
      />

      <HistoryDrawer
        isOpen={isHistoryOpen}
        history={history}
        language={language}
        onClose={() => setIsHistoryOpen(false)}
        onAddProduct={addItemFromProduct}
      />

      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </div>
  );
}

export default Workspace;
