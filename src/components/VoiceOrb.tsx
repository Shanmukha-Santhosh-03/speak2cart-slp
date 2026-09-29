import React, { useState } from 'react';
import type { VoiceState, Language, ParsedCommand } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { Mic, Send, Sparkles, RefreshCw, Keyboard, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceOrbProps {
  voiceState: VoiceState;
  transcript: string;
  language: Language;
  audioVolume: number;
  lastCommand?: ParsedCommand | null;
  onStartListening: () => void;
  onStopListening: () => void;
  onTextSubmit: (text: string) => void;
}

export const VoiceOrb: React.FC<VoiceOrbProps> = ({
  voiceState,
  transcript,
  language,
  audioVolume,
  lastCommand,
  onStartListening,
  onStopListening,
  onTextSubmit
}) => {
  const t = TRANSLATIONS[language];
  const [isTextInputOpen, setIsTextInputOpen] = useState(false);
  const [inputText, setInputText] = useState('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onTextSubmit(inputText.trim());
    setInputText('');
    setIsTextInputOpen(false);
  };

  const getStatusText = () => {
    switch (voiceState) {
      case 'listening': return t.orbListening;
      case 'processing': return t.orbProcessing;
      case 'error': return t.orbError;
      case 'success': return transcript || t.orbIdle;
      case 'idle':
      default:
        return t.orbIdle;
    }
  };

  return (
    <div className="relative w-full max-w-xl mx-auto my-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#FFFDF9] to-[#F4EFE6] border border-[#E7E0D5] shadow-sm text-center overflow-hidden">
      
      {/* Background Decorative Rings */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-40">
        <div className="w-72 h-72 rounded-full border border-[#2C4A3E]/10 animate-ping opacity-25" />
        <div className="w-56 h-56 rounded-full border border-[#2C4A3E]/15" />
      </div>

      {/* Voice Orb Interaction Area */}
      <div className="relative z-10 flex flex-col items-center">
        
        {/* Dynamic Voice Field Ring */}
        <div className="relative flex items-center justify-center my-4">
          
          {/* Animated Audio-Reactive Rings when listening */}
          {voiceState === 'listening' && (
            <>
              <motion.div
                animate={{ scale: [1, 1.2 + audioVolume * 0.4, 1] }}
                transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                className="absolute inset-0 rounded-full bg-[#2C4A3E]/15 blur-md"
              />
              <motion.div
                animate={{ scale: [1, 1.35 + audioVolume * 0.6, 1] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                className="absolute inset-0 rounded-full bg-[#E06D53]/15 blur-lg"
              />
            </>
          )}

          {/* Core Voice Orb Touchpoint */}
          <button
            onClick={voiceState === 'listening' ? onStopListening : onStartListening}
            className={`relative group w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center transition-all duration-500 shadow-md ${
              voiceState === 'listening'
                ? 'bg-[#2C4A3E] text-white ring-8 ring-[#2C4A3E]/20 scale-105'
                : voiceState === 'processing'
                ? 'bg-[#E06D53] text-white ring-8 ring-[#E06D53]/20 animate-pulse'
                : voiceState === 'error'
                ? 'bg-amber-600 text-white ring-8 ring-amber-600/20'
                : 'bg-[#2C4A3E] hover:bg-[#223B31] text-white hover:scale-105 active:scale-95'
            }`}
            aria-label="Toggle Voice Interaction"
          >
            {voiceState === 'listening' ? (
              <div className="flex flex-col items-center gap-1">
                {/* Audio Waveform Bars */}
                <div className="flex items-center gap-1.5 h-6">
                  <div className="w-1.5 bg-white rounded-full animate-wave-bar-1" />
                  <div className="w-1.5 bg-white rounded-full animate-wave-bar-2" />
                  <div className="w-1.5 bg-white rounded-full animate-wave-bar-3" />
                  <div className="w-1.5 bg-white rounded-full animate-wave-bar-4" />
                </div>
                <span className="text-[10px] uppercase font-semibold tracking-wider opacity-80">Listening</span>
              </div>
            ) : voiceState === 'processing' ? (
              <RefreshCw className="w-8 h-8 animate-spin text-white" />
            ) : (
              <div className="flex flex-col items-center gap-1">
                <Mic className="w-8 h-8 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-medium tracking-wide uppercase opacity-75">Tap to Speak</span>
              </div>
            )}
          </button>
        </div>

        {/* Dynamic Status / Live Transcript Overlay */}
        <div className="min-h-[52px] flex flex-col items-center justify-center mt-2 px-4">
          <AnimatePresence mode="wait">
            <motion.p
              key={voiceState + transcript}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className={`text-base sm:text-lg font-serif font-medium text-center ${
                voiceState === 'error'
                  ? 'text-amber-800'
                  : voiceState === 'success'
                  ? 'text-[#2C4A3E]'
                  : 'text-[#1C1917]'
              }`}
            >
              {transcript ? `"${transcript}"` : getStatusText()}
            </motion.p>
          </AnimatePresence>

          {voiceState === 'listening' && (
            <p className="text-xs text-[#78716C] mt-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#E06D53]" />
              Speak naturally — try "Add 2 bottles of water"
            </p>
          )}

          {lastCommand && voiceState !== 'listening' && voiceState !== 'processing' && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 p-3 bg-white/60 rounded-xl border border-[#E7E0D5]/50 w-full text-left text-xs font-mono shadow-xs overflow-hidden"
            >
              <div className="flex items-center gap-1.5 text-[#2C4A3E] font-semibold mb-2 uppercase tracking-wide text-[10px]">
                <Cpu className="w-3 h-3" /> ML Inference Result
              </div>
              <div className="grid grid-cols-2 gap-2 text-[#78716C]">
                <div><span className="font-semibold">Intent:</span> <span className={lastCommand.intent === 'UNKNOWN' ? 'text-amber-600' : 'text-[#1C1917]'}>{lastCommand.intent}</span></div>
                <div><span className="font-semibold">Confidence:</span> <span className={lastCommand.confidence < 0.6 ? 'text-amber-600' : 'text-[#1C1917]'}>{(lastCommand.confidence * 100).toFixed(1)}%</span></div>
                <div className="col-span-2">
                  <span className="font-semibold">Entities:</span> 
                  <span className="text-[#1C1917] ml-1">
                    {[lastCommand.item, lastCommand.quantity, lastCommand.unit].filter(Boolean).join(' · ')}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Text Input Toggle / Keyboard Shortcut Bar */}
        <div className="mt-4 pt-4 border-t border-[#E7E0D5]/60 w-full flex items-center justify-between text-xs text-[#78716C]">
          <button
            onClick={() => setIsTextInputOpen(!isTextInputOpen)}
            className="flex items-center gap-1.5 hover:text-[#1C1917] font-medium transition-colors"
          >
            <Keyboard className="w-3.5 h-3.5 text-[#2C4A3E]" />
            <span>{isTextInputOpen ? "Hide Text Command" : "Type instead"}</span>
          </button>

          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#E7E0D5]/50 text-[10px] text-[#78716C]">
            Press <kbd className="font-mono bg-white px-1 rounded shadow-2xs">Space</kbd> or <kbd className="font-mono bg-white px-1 rounded shadow-2xs">Tap mic</kbd>
          </span>
        </div>

        {/* Manual Text Command Drawer */}
        <AnimatePresence>
          {isTextInputOpen && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleFormSubmit}
              className="w-full mt-3 overflow-hidden"
            >
              <div className="flex items-center gap-2 bg-white p-1.5 pl-3.5 rounded-full border border-[#E7E0D5] shadow-xs">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={t.typePlaceholder}
                  className="flex-1 bg-transparent text-xs sm:text-sm text-[#1C1917] placeholder:text-[#78716C]/60 outline-none"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="w-8 h-8 rounded-full bg-[#2C4A3E] disabled:bg-gray-300 text-white flex items-center justify-center hover:bg-[#223B31] transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
