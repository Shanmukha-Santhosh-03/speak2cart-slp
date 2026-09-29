import React from 'react';
import type { ToastMessage } from '../types';
import { Sparkles, X, CheckCircle2, AlertCircle, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onRemoveToast: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemoveToast }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className={`pointer-events-auto flex items-start justify-between p-3.5 rounded-2xl border shadow-lg backdrop-blur-md ${
              toast.type === 'success'
                ? 'bg-[#2C4A3E] text-white border-[#2C4A3E]'
                : toast.type === 'error'
                ? 'bg-rose-900 text-white border-rose-800'
                : toast.type === 'warning'
                ? 'bg-amber-950 text-amber-100 border-amber-800'
                : 'bg-[#1C1917] text-white border-[#1C1917]'
            }`}
          >
            <div className="flex items-start gap-2.5">
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-300 shrink-0 mt-0.5" />}
              {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />}
              {toast.type === 'info' && <Sparkles className="w-5 h-5 text-[#E06D53] shrink-0 mt-0.5" />}

              <div>
                <h5 className="font-serif text-sm font-semibold tracking-tight">{toast.title}</h5>
                <p className="text-xs opacity-90 mt-0.5 leading-snug">{toast.message}</p>
              </div>
            </div>

            <button
              onClick={() => onRemoveToast(toast.id)}
              className="p-1 opacity-70 hover:opacity-100 transition-opacity ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
