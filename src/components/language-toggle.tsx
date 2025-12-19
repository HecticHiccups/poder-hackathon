'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <motion.button
      onClick={toggleLanguage}
      className="fixed top-4 left-4 z-50 flex items-center gap-1.5 h-11 px-3 rounded-full bg-[var(--poder-charcoal)]/90 backdrop-blur-sm border border-[var(--poder-slate)] active:scale-95 transition-all shadow-lg"
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${language === 'en' ? 'Spanish' : 'English'}`}
      role="switch"
      aria-checked={language === 'es'}
    >
      {/* Current language flag - larger for mobile */}
      <AnimatePresence mode="wait">
        <motion.span
          key={language}
          initial={{ opacity: 0, y: -10, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.8 }}
          transition={{ duration: 0.15 }}
          className="text-xl"
          role="img"
          aria-label={language === 'en' ? 'English' : 'Español'}
        >
          {language === 'en' ? '🇺🇸' : '🇲🇽'}
        </motion.span>
      </AnimatePresence>

      {/* Language code with highlight */}
      <span className="font-code text-sm font-semibold text-[var(--poder-paper)]">
        {language.toUpperCase()}
      </span>

      {/* Switch indicator */}
      <motion.span
        className="text-[var(--poder-paper)] opacity-50 text-xs"
        animate={{ rotate: [0, 180] }}
        transition={{ duration: 0.3 }}
        key={language + '-arrow'}
      >
        ⇄
      </motion.span>
    </motion.button>
  );
}

// Alternative: Expanded toggle for settings pages or if user prefers more explicit control
export function LanguageToggleExpanded() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2 p-1 rounded-full bg-[var(--poder-charcoal)] border border-[var(--poder-slate)]">
      <button
        onClick={() => setLanguage('en')}
        className={`flex items-center gap-2 h-10 px-4 rounded-full font-code text-sm font-medium transition-all ${
          language === 'en'
            ? 'bg-[var(--poder-fire)] text-[var(--poder-cream)]'
            : 'text-[var(--poder-paper)] opacity-60 hover:opacity-100'
        }`}
        aria-pressed={language === 'en'}
      >
        <span className="text-lg">🇺🇸</span>
        <span>English</span>
      </button>
      <button
        onClick={() => setLanguage('es')}
        className={`flex items-center gap-2 h-10 px-4 rounded-full font-code text-sm font-medium transition-all ${
          language === 'es'
            ? 'bg-[var(--poder-fire)] text-[var(--poder-cream)]'
            : 'text-[var(--poder-paper)] opacity-60 hover:opacity-100'
        }`}
        aria-pressed={language === 'es'}
      >
        <span className="text-lg">🇲🇽</span>
        <span>Español</span>
      </button>
    </div>
  );
}
