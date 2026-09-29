import React from 'react';
import { motion } from 'framer-motion';

interface KitchenBuddyMascotProps {
  state: 'idle' | 'hover' | 'thinking' | 'speaking' | 'suggesting' | 'happy';
  onClick?: () => void;
  className?: string;
}

export const KitchenBuddyMascot: React.FC<KitchenBuddyMascotProps> = ({ state, onClick, className = '' }) => {
  // Respect reduced motion
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const animations: any = {
    idle: {
      scale: isReducedMotion ? 1 : [1, 1.02, 1],
      transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
    },
    hover: {
      scale: 1.05,
      rotate: isReducedMotion ? 0 : [0, -5, 5, 0],
      transition: { duration: 0.5 }
    },
    thinking: {
      y: isReducedMotion ? 0 : [-2, 2, -2],
      transition: { duration: 1, repeat: Infinity }
    },
    speaking: {
      scaleY: isReducedMotion ? 1 : [1, 1.05, 1],
      transition: { duration: 0.3, repeat: Infinity, ease: 'easeInOut' }
    },
    suggesting: {
      rotate: isReducedMotion ? 0 : -5,
      scale: 1.05,
      transition: { duration: 0.3 }
    },
    happy: {
      y: isReducedMotion ? 0 : [0, -10, 0],
      scale: 1.1,
      transition: { duration: 0.6 }
    }
  };

  return (
    <motion.div
      className={`relative cursor-pointer select-none ${className}`}
      onClick={onClick}
      animate={animations[state]}
      whileHover={state === 'idle' ? 'hover' : undefined}
      aria-label="Kitchen Buddy Mascot"
      role="button"
    >
      <svg width="64" height="64" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Shadow */}
        <ellipse cx="50" cy="92" rx="25" ry="4" fill="#E7E0D5" />
        
        {/* Body (Apron) */}
        <path d="M35 55 Q 50 45 65 55 L 70 90 Q 50 95 30 90 Z" fill="#F4EFE6" stroke="#2C4A3E" strokeWidth="2.5" />
        
        {/* Orange Accent Belt */}
        <path d="M31 75 Q 50 78 69 75 L 70 82 Q 50 85 30 82 Z" fill="#E06D53" />

        {/* Head */}
        <circle cx="50" cy="40" r="18" fill="#FADCB6" stroke="#1C1917" strokeWidth="2" />
        
        {/* Chef Hat */}
        <path d="M32 30 Q 25 15 40 15 Q 50 5 60 15 Q 75 15 68 30 Z" fill="#FFFFFF" stroke="#2C4A3E" strokeWidth="2.5" />
        <path d="M36 30 L 64 30 L 66 38 Q 50 42 34 38 Z" fill="#FFFFFF" stroke="#2C4A3E" strokeWidth="2.5" />
        
        {/* Face */}
        <circle cx="44" cy="38" r="2.5" fill="#1C1917" />
        <circle cx="56" cy="38" r="2.5" fill="#1C1917" />
        
        {/* Mouth */}
        {state === 'speaking' || state === 'happy' ? (
          <path d="M46 45 Q 50 50 54 45" fill="none" stroke="#1C1917" strokeWidth="2" strokeLinecap="round" />
        ) : (
          <path d="M47 45 Q 50 47 53 45" fill="none" stroke="#1C1917" strokeWidth="2" strokeLinecap="round" />
        )}

        {/* Cheeks */}
        <circle cx="39" cy="41" r="3" fill="#E06D53" opacity="0.3" />
        <circle cx="61" cy="41" r="3" fill="#E06D53" opacity="0.3" />

        {/* Arm and Bowl */}
        <path d="M68 60 Q 85 65 78 80" fill="none" stroke="#FADCB6" strokeWidth="4" strokeLinecap="round" />
        <path d="M65 72 Q 75 75 85 72 Q 85 85 75 85 Q 65 85 65 72 Z" fill="#2C4A3E" />
        {/* Wooden Spoon */}
        <path d="M78 62 L 72 75" stroke="#C19A6B" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </motion.div>
  );
};
