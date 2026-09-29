import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export function Landing() {
  const [typedTitle, setTypedTitle] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [stage, setStage] = useState<number>(0);
  const navigate = useNavigate();

  const fullTitle = 'Speak2Cart';

  useEffect(() => {
    // Stage 0: Typing
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullTitle.length) {
        setTypedTitle(fullTitle.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        // Typing finished, move to Stage 1 (Wait & Hide Cursor)
        setTimeout(() => setShowCursor(false), 500);
        setTimeout(() => setStage(1), 700);
      }
    }, 120);

    return () => clearInterval(typingInterval);
  }, []);

  useEffect(() => {
    if (stage === 1) {
      // Stage 2: Tagline
      setTimeout(() => setStage(2), 600);
    } else if (stage === 2) {
      // Stage 3: CTA
      setTimeout(() => setStage(3), 800);
    }
  }, [stage]);

  const handleGetStarted = () => {
    setStage(4); // Transition out
    setTimeout(() => {
      navigate('/login');
    }, 800);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="min-h-screen bg-Speak2Cart-bg flex flex-col items-center justify-center p-6 text-Speak2Cart-text overflow-hidden"
        initial={{ opacity: 1 }}
        animate={{ opacity: stage === 4 ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col items-center max-w-lg text-center w-full z-10 space-y-8">
          
          {/* Title Area */}
          <motion.div 
            className="flex items-center justify-center"
            animate={{ scale: stage === 4 ? 0.9 : 1, y: stage === 4 ? -20 : 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <h1 className="text-6xl sm:text-7xl md:text-8xl font-serif-editorial font-bold text-Speak2Cart-forest tracking-tight flex items-center">
              {typedTitle}
              <span 
                className="inline-block w-[4px] h-12 sm:h-16 md:h-20 bg-Speak2Cart-terracotta ml-1 -mt-2"
                style={{ 
                  opacity: showCursor ? 1 : 0, 
                  transition: 'opacity 0.2s',
                  animation: showCursor ? 'pulse 1s infinite' : 'none' 
                }}
              />
            </h1>
          </motion.div>

          {/* Tagline */}
          <div className="h-16">
            {stage >= 1 && (
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-xl sm:text-2xl font-medium"
              >
                <span className="text-Speak2Cart-text font-serif-editorial">Your pantry. Your voice.</span>
                <br />
                <span className="text-Speak2Cart-muted">One intelligent assistant.</span>
              </motion.div>
            )}
          </div>

          {/* CTA */}
          <div className="h-20">
            {stage >= 2 && (
              <motion.button
                onClick={handleGetStarted}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.4 }}
                className="mt-6 px-10 py-4 bg-Speak2Cart-forest text-white rounded-full font-semibold text-xl shadow-lg hover:bg-Speak2Cart-forest-hover transition-colors"
              >
                Get Started
              </motion.button>
            )}
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
}
