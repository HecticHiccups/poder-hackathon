'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <motion.button
      onClick={toggleLanguage}
      className="fixed top-3 left-3 z-50 flex items-center justify-center w-9 h-9 sm:w-auto sm:h-10 sm:gap-1.5 sm:px-3 rounded-full bg-[var(--poder-charcoal)]/80 backdrop-blur-sm border border-[var(--poder-slate)]/50 active:scale-95 transition-all shadow-md"
      whileTap={{ scale: 0.9 }}
      aria-label={`Switch to ${language === 'en' ? 'Spanish' : 'English'}`}
      role="switch"
      aria-checked={language === 'es'}
    >
      {/* Flag only on mobile, flag + text on desktop */}
      <AnimatePresence mode="wait">
        <motion.span
          key={language}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.12 }}
          className="text-base sm:text-lg"
          role="img"
          aria-label={language === 'en' ? 'English' : 'Español'}
        >
          {language === 'en' ? '🇺🇸' : '🇲🇽'}
        </motion.span>
      </AnimatePresence>

      {/* Language code - hidden on mobile */}
      <span className="hidden sm:inline font-code text-xs font-medium text-[var(--poder-paper)] opacity-80">
        {language.toUpperCase()}
      </span>
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
