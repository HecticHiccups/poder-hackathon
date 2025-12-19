'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <motion.button
      onClick={toggleLanguage}
      className="fixed top-4 right-4 z-50 flex items-center gap-2 px-3 py-2 rounded-full bg-[var(--poder-charcoal)] border border-[var(--poder-slate)] hover:border-[var(--poder-fire)] transition-colors"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${language === 'en' ? 'Spanish' : 'English'}`}
    >
      <span className={`font-code text-sm ${language === 'en' ? 'text-[var(--poder-fire)]' : 'text-[var(--poder-paper)] opacity-50'}`}>
        EN
      </span>
      <div className="relative w-10 h-5 rounded-full bg-[var(--poder-midnight)]">
        <motion.div
          className="absolute top-0.5 w-4 h-4 rounded-full bg-[var(--poder-fire)]"
          animate={{ left: language === 'en' ? '2px' : '22px' }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </div>
      <span className={`font-code text-sm ${language === 'es' ? 'text-[var(--poder-fire)]' : 'text-[var(--poder-paper)] opacity-50'}`}>
        ES
      </span>
    </motion.button>
  );
}
