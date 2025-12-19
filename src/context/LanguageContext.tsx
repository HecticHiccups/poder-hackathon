'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

// Language type - matches the one in poder-agent.ts
export type Language = 'en' | 'es';

// Context type
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

// Create context with default values
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations dictionary
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.learn': 'Learn',
    'nav.play': 'Play',
    'nav.profile': 'Profile',

    // Hero Section
    'hero.badge': 'Powered by the People',
    'hero.tagline': 'Reclaiming rights.\nEmpowering people.',
    'hero.cta.learn': 'Start Learning',
    'hero.cta.play': 'Enter Simulation',

    // Stats
    'stats.rightsArchived': 'Rights Archived',
    'stats.languages': 'Languages',
    'stats.power': 'Power to You',

    // Scroll prompt
    'scroll.prompt': 'Scroll to Learn More',

    // About Section
    'about.title': 'Know Your',
    'about.titleHighlight': 'Rights',
    'about.description': 'Information is power. But critical rights information has been removed, hidden, or buried in government websites. <strong>Poder</strong> recovers this knowledge and transforms it into interactive, gamified learning experiences — in whatever language you speak.',

    // Feature Cards
    'feature.archive.title': 'Archive',
    'feature.archive.desc': 'Recovered government documents simplified for everyone.',
    'feature.play.title': 'Play',
    'feature.play.desc': 'Real-life scenarios to practice asserting your rights.',
    'feature.translate.title': 'Translate',
    'feature.translate.desc': 'Instant translation to your native language.',

    // CTA Section
    'cta.badge': 'Buy Us a Matcha',
    'cta.title': 'Fueled by',
    'cta.titleHighlight': 'Performative People',
    'cta.description': 'This project is built by people who believe knowledge should be free. Support us by sharing, contributing, or buying us a matcha.',
    'cta.button': 'Support the Movement',

    // Footer
    'footer.copyright': '© 2024 Poder. Reclaiming Power.',
    'footer.github': 'GitHub',
    'footer.discord': 'Discord',

    // Voice Agent
    'agent.askQuestion': 'Ask a question...',
    'agent.listening': 'Listening...',
    'agent.thinking': 'Thinking...',
    'agent.tapToSpeak': 'Tap to speak',
    'agent.error': "I couldn't process that. Please try again.",
    'agent.noAnswer': "I couldn't find an answer. Try one of the questions below.",
    'agent.suggestedQuestions': 'Suggested Questions',
    'agent.faqTitle': 'What can I help with?',

    // Language Toggle
    'lang.toggle': 'ES',
    'lang.current': 'EN',

    // Learn Page
    'learn.title': 'Learn Your Rights',
    'learn.subtitle': 'Interactive lessons to understand your legal protections',
    'learn.comingSoon': 'Coming Soon',
    'learn.description': 'We\'re building comprehensive lessons on immigration rights, police encounters, workplace protections, and more.',
    'learn.stackComplete': 'Stack Complete!',
    'learn.earnedPoints': 'You earned',
    'learn.powerPoints': 'Power Points',
    'learn.reviewAgain': 'Review Again',
    'learn.testKnowledge': 'Test Your Knowledge',
    'learn.skip': 'Skip',
    'learn.iLearned': 'I Learned This ✓',
    'learn.learned': 'Learned',
    'learn.points': 'Points',
    'learn.remaining': 'Remaining',
    'learn.pp': 'PP',

    // Play Page
    'play.title': 'Know Your Rights',
    'play.titleHighlight': 'Live',
    'play.subtitle': 'Practice real scenarios under pressure. Make the right choices.',
    'play.comingSoon': 'More scenarios coming soon',
    'play.description': 'Interactive scenarios where you can practice asserting your rights in realistic situations.',
    'play.startScenario': 'Start Scenario',
    'play.score': 'Score',
    'play.streak': 'Streak',
    'play.min': 'min',
    'play.pts': 'pts',
    'play.medicalRights': 'Medical Rights',
    'play.workplaceRaid': 'Workplace Raid',
    'play.phoneSearch': 'Phone Search',
    'play.beginner': 'beginner',
    'play.intermediate': 'intermediate',
    'play.advanced': 'advanced',

    // Profile Page
    'profile.title': 'Your Profile',
    'profile.progress': 'Learning Progress',
    'profile.achievements': 'Achievements',
    'profile.comingSoon': 'Coming Soon',
    'profile.settings': 'Settings',
    'profile.level': 'Level',
    'profile.xp': 'XP',
    'profile.powerPoints': 'Power Points',
    'profile.cardsLearned': 'Cards Learned',
    'profile.scenariosDone': 'Scenarios Done',
    'profile.dayStreak': 'Day Streak',
    'profile.winRate': 'Win Rate',
    'profile.badges': 'Badges',
    'profile.locked': 'Locked',
    'profile.moreToUnlock': 'more to unlock',
    'profile.continueLearning': 'Continue Learning',
    'profile.playScenarios': 'Play Scenarios',
    'profile.memberSince': 'Member since',

    // Rights Card UI
    'card.learnMore': 'Learn More →',
    'card.showLess': '← Show Less',
    'card.swipeSkip': '← Swipe to skip',
    'card.swipeLearn': 'Swipe to learn →',
    'card.source': 'Source',
    'card.cards': 'cards',
    'card.all': 'All',

    // Categories
    'category.immigration': 'Immigration',
    'category.housing': 'Housing',
    'category.labor': 'Labor',
    'category.criminal': 'Criminal Justice',
    'category.healthcare': 'Healthcare',

    // Game Engine UI
    'game.exit': '← Exit',
    'game.points': 'points',
    'game.authority': 'Authority',
    'game.scene': 'Scene',
    'game.result': 'Result',
    'game.continue': 'Continue →',
    'game.loading': 'Loading...',
    'game.completeScenario': 'Complete Scenario',
    'game.tryAgain': 'Try Again',
    'game.backToScenarios': 'Back to Scenarios',
    'game.complete': 'Complete',

    // Grade Labels
    'grade.rightsChampion': 'Rights Champion',
    'grade.rightsAware': 'Rights Aware',
    'grade.learning': 'Learning',
    'grade.needsPractice': 'Needs Practice',

    // User Titles
    'title.newcomer': 'Newcomer',
    'title.awareCitizen': 'Aware Citizen',
    'title.rightsLearner': 'Rights Learner',
    'title.knowledgeSeeker': 'Knowledge Seeker',
    'title.rightsDefender': 'Rights Defender',
    'title.legalScholar': 'Legal Scholar',
    'title.rightsChampion': 'Rights Champion',
    'title.powerAdvocate': 'Power Advocate',
    'title.freedomFighter': 'Freedom Fighter',
    'title.poderMaster': 'Poder Master',

    // Badge Names
    'badge.firstStep': 'First Step',
    'badge.immigration101': 'Immigration 101',
    'badge.housingHero': 'Housing Hero',
    'badge.laborLeader': 'Labor Leader',
    'badge.justiceSeeker': 'Justice Seeker',
    'badge.healthAware': 'Health Aware',
    'badge.knowledgeMaster': 'Knowledge Master',
    'badge.simulationInitiate': 'Simulation Initiate',
    'badge.trafficStopSurvivor': 'Traffic Stop Survivor',
    'badge.doorDefender': 'Door Defender',
    'badge.tenantChampion': 'Tenant Champion',
    'badge.scenarioMaster': 'Scenario Master',
    'badge.perfectRun': 'Perfect Run',
    'badge.gettingStarted': 'Getting Started',
    'badge.weekWarrior': 'Week Warrior',
    'badge.monthOfPower': 'Month of Power',
    'badge.unstoppable': 'Unstoppable',
    'badge.earlyAdopter': 'Early Adopter',
    'badge.matchaSupporter': 'Matcha Supporter',

    // Badge Descriptions
    'badge.desc.firstStep': 'Learned your first rights card',
    'badge.desc.immigration101': 'Completed all immigration rights cards',
    'badge.desc.housingHero': 'Completed all housing rights cards',
    'badge.desc.laborLeader': 'Completed all labor rights cards',
    'badge.desc.justiceSeeker': 'Completed all criminal justice cards',
    'badge.desc.healthAware': 'Completed all healthcare rights cards',
    'badge.desc.knowledgeMaster': 'Learned all 14 rights cards',
    'badge.desc.simulationInitiate': 'Completed your first scenario',
    'badge.desc.trafficStopSurvivor': 'Scored 80%+ on The Traffic Stop',
    'badge.desc.doorDefender': 'Scored 80%+ on The Knock at the Door',
    'badge.desc.tenantChampion': 'Scored 80%+ on The Illegal Eviction',
    'badge.desc.scenarioMaster': 'Completed all scenarios with 80%+ score',
    'badge.desc.perfectRun': 'Achieved 100% on any scenario',
    'badge.desc.gettingStarted': '3-day learning streak',
    'badge.desc.weekWarrior': '7-day learning streak',
    'badge.desc.monthOfPower': '30-day learning streak',
    'badge.desc.unstoppable': '100-day learning streak',
    'badge.desc.earlyAdopter': 'Joined during the hackathon launch',
    'badge.desc.matchaSupporter': 'Bought us a matcha!',
  },

  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.learn': 'Aprender',
    'nav.play': 'Jugar',
    'nav.profile': 'Perfil',

    // Hero Section
    'hero.badge': 'Impulsado por la Gente',
    'hero.tagline': 'Reclamando derechos.\nEmpoderando personas.',
    'hero.cta.learn': 'Comenzar a Aprender',
    'hero.cta.play': 'Entrar a Simulación',

    // Stats
    'stats.rightsArchived': 'Derechos Archivados',
    'stats.languages': 'Idiomas',
    'stats.power': 'Poder para Ti',

    // Scroll prompt
    'scroll.prompt': 'Desplázate para Saber Más',

    // About Section
    'about.title': 'Conoce Tus',
    'about.titleHighlight': 'Derechos',
    'about.description': 'La información es poder. Pero información crítica sobre derechos ha sido removida, escondida, o enterrada en sitios web del gobierno. <strong>Poder</strong> recupera este conocimiento y lo transforma en experiencias interactivas y gamificadas — en el idioma que hables.',

    // Feature Cards
    'feature.archive.title': 'Archivo',
    'feature.archive.desc': 'Documentos gubernamentales recuperados y simplificados para todos.',
    'feature.play.title': 'Jugar',
    'feature.play.desc': 'Escenarios de la vida real para practicar tus derechos.',
    'feature.translate.title': 'Traducir',
    'feature.translate.desc': 'Traducción instantánea a tu idioma nativo.',

    // CTA Section
    'cta.badge': 'Cómpranos un Matcha',
    'cta.title': 'Impulsado por',
    'cta.titleHighlight': 'Gente Comprometida',
    'cta.description': 'Este proyecto es construido por personas que creen que el conocimiento debe ser libre. Apóyanos compartiendo, contribuyendo, o comprándonos un matcha.',
    'cta.button': 'Apoya el Movimiento',

    // Footer
    'footer.copyright': '© 2024 Poder. Reclamando Poder.',
    'footer.github': 'GitHub',
    'footer.discord': 'Discord',

    // Voice Agent
    'agent.askQuestion': 'Haz una pregunta...',
    'agent.listening': 'Escuchando...',
    'agent.thinking': 'Pensando...',
    'agent.tapToSpeak': 'Toca para hablar',
    'agent.error': 'No pude procesar eso. Por favor intenta de nuevo.',
    'agent.noAnswer': 'No encontré una respuesta. Prueba una de las preguntas abajo.',
    'agent.suggestedQuestions': 'Preguntas Sugeridas',
    'agent.faqTitle': '¿En qué puedo ayudarte?',

    // Language Toggle
    'lang.toggle': 'EN',
    'lang.current': 'ES',

    // Learn Page
    'learn.title': 'Aprende Tus Derechos',
    'learn.subtitle': 'Lecciones interactivas para entender tus protecciones legales',
    'learn.comingSoon': 'Próximamente',
    'learn.description': 'Estamos construyendo lecciones completas sobre derechos de inmigración, encuentros con la policía, protecciones laborales, y más.',
    'learn.stackComplete': '¡Pila Completada!',
    'learn.earnedPoints': 'Ganaste',
    'learn.powerPoints': 'Puntos de Poder',
    'learn.reviewAgain': 'Repasar de Nuevo',
    'learn.testKnowledge': 'Prueba Tu Conocimiento',
    'learn.skip': 'Saltar',
    'learn.iLearned': 'Aprendí Esto ✓',
    'learn.learned': 'Aprendido',
    'learn.points': 'Puntos',
    'learn.remaining': 'Restantes',
    'learn.pp': 'PP',

    // Play Page
    'play.title': 'Conoce Tus Derechos',
    'play.titleHighlight': 'En Vivo',
    'play.subtitle': 'Practica escenarios reales bajo presión. Toma las decisiones correctas.',
    'play.comingSoon': 'Más escenarios próximamente',
    'play.description': 'Escenarios interactivos donde puedes practicar cómo hacer valer tus derechos en situaciones realistas.',
    'play.startScenario': 'Iniciar Escenario',
    'play.score': 'Puntuación',
    'play.streak': 'Racha',
    'play.min': 'min',
    'play.pts': 'pts',
    'play.medicalRights': 'Derechos Médicos',
    'play.workplaceRaid': 'Redada Laboral',
    'play.phoneSearch': 'Registro de Teléfono',
    'play.beginner': 'principiante',
    'play.intermediate': 'intermedio',
    'play.advanced': 'avanzado',

    // Profile Page
    'profile.title': 'Tu Perfil',
    'profile.progress': 'Progreso de Aprendizaje',
    'profile.achievements': 'Logros',
    'profile.comingSoon': 'Próximamente',
    'profile.settings': 'Configuración',
    'profile.level': 'Nivel',
    'profile.xp': 'XP',
    'profile.powerPoints': 'Puntos de Poder',
    'profile.cardsLearned': 'Tarjetas Aprendidas',
    'profile.scenariosDone': 'Escenarios Completados',
    'profile.dayStreak': 'Racha de Días',
    'profile.winRate': 'Tasa de Victoria',
    'profile.badges': 'Insignias',
    'profile.locked': 'Bloqueadas',
    'profile.moreToUnlock': 'más por desbloquear',
    'profile.continueLearning': 'Continuar Aprendiendo',
    'profile.playScenarios': 'Jugar Escenarios',
    'profile.memberSince': 'Miembro desde',

    // Rights Card UI
    'card.learnMore': 'Saber Más →',
    'card.showLess': '← Ver Menos',
    'card.swipeSkip': '← Desliza para saltar',
    'card.swipeLearn': 'Desliza para aprender →',
    'card.source': 'Fuente',
    'card.cards': 'tarjetas',
    'card.all': 'Todas',

    // Categories
    'category.immigration': 'Inmigración',
    'category.housing': 'Vivienda',
    'category.labor': 'Trabajo',
    'category.criminal': 'Justicia Penal',
    'category.healthcare': 'Salud',

    // Game Engine UI
    'game.exit': '← Salir',
    'game.points': 'puntos',
    'game.authority': 'Autoridad',
    'game.scene': 'Escena',
    'game.result': 'Resultado',
    'game.continue': 'Continuar →',
    'game.loading': 'Cargando...',
    'game.completeScenario': 'Completar Escenario',
    'game.tryAgain': 'Intentar de Nuevo',
    'game.backToScenarios': 'Volver a Escenarios',
    'game.complete': 'Completado',

    // Grade Labels
    'grade.rightsChampion': 'Campeón de Derechos',
    'grade.rightsAware': 'Consciente de Derechos',
    'grade.learning': 'Aprendiendo',
    'grade.needsPractice': 'Necesita Práctica',

    // User Titles
    'title.newcomer': 'Principiante',
    'title.awareCitizen': 'Ciudadano Consciente',
    'title.rightsLearner': 'Aprendiz de Derechos',
    'title.knowledgeSeeker': 'Buscador de Conocimiento',
    'title.rightsDefender': 'Defensor de Derechos',
    'title.legalScholar': 'Erudito Legal',
    'title.rightsChampion': 'Campeón de Derechos',
    'title.powerAdvocate': 'Abogado del Poder',
    'title.freedomFighter': 'Luchador por la Libertad',
    'title.poderMaster': 'Maestro del Poder',

    // Badge Names
    'badge.firstStep': 'Primer Paso',
    'badge.immigration101': 'Inmigración 101',
    'badge.housingHero': 'Héroe de Vivienda',
    'badge.laborLeader': 'Líder Laboral',
    'badge.justiceSeeker': 'Buscador de Justicia',
    'badge.healthAware': 'Consciente de Salud',
    'badge.knowledgeMaster': 'Maestro del Conocimiento',
    'badge.simulationInitiate': 'Iniciado en Simulación',
    'badge.trafficStopSurvivor': 'Sobreviviente de Parada de Tráfico',
    'badge.doorDefender': 'Defensor de la Puerta',
    'badge.tenantChampion': 'Campeón Inquilino',
    'badge.scenarioMaster': 'Maestro de Escenarios',
    'badge.perfectRun': 'Ronda Perfecta',
    'badge.gettingStarted': 'Empezando',
    'badge.weekWarrior': 'Guerrero Semanal',
    'badge.monthOfPower': 'Mes de Poder',
    'badge.unstoppable': 'Imparable',
    'badge.earlyAdopter': 'Pionero',
    'badge.matchaSupporter': 'Apoyador Matcha',

    // Badge Descriptions
    'badge.desc.firstStep': 'Aprendiste tu primera tarjeta de derechos',
    'badge.desc.immigration101': 'Completaste todas las tarjetas de inmigración',
    'badge.desc.housingHero': 'Completaste todas las tarjetas de vivienda',
    'badge.desc.laborLeader': 'Completaste todas las tarjetas laborales',
    'badge.desc.justiceSeeker': 'Completaste todas las tarjetas de justicia penal',
    'badge.desc.healthAware': 'Completaste todas las tarjetas de salud',
    'badge.desc.knowledgeMaster': 'Aprendiste las 14 tarjetas de derechos',
    'badge.desc.simulationInitiate': 'Completaste tu primer escenario',
    'badge.desc.trafficStopSurvivor': 'Obtuviste 80%+ en La Parada de Tráfico',
    'badge.desc.doorDefender': 'Obtuviste 80%+ en El Toque a la Puerta',
    'badge.desc.tenantChampion': 'Obtuviste 80%+ en El Desalojo Ilegal',
    'badge.desc.scenarioMaster': 'Completaste todos los escenarios con 80%+',
    'badge.desc.perfectRun': 'Lograste 100% en cualquier escenario',
    'badge.desc.gettingStarted': 'Racha de aprendizaje de 3 días',
    'badge.desc.weekWarrior': 'Racha de aprendizaje de 7 días',
    'badge.desc.monthOfPower': 'Racha de aprendizaje de 30 días',
    'badge.desc.unstoppable': 'Racha de aprendizaje de 100 días',
    'badge.desc.earlyAdopter': 'Te uniste durante el lanzamiento del hackathon',
    'badge.desc.matchaSupporter': '¡Nos compraste un matcha!',
  },
};

// Storage key for persistence
const LANGUAGE_STORAGE_KEY = 'poder-language';

// Provider component
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [isHydrated, setIsHydrated] = useState(false);

  // Load language from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language | null;
    if (stored && (stored === 'en' || stored === 'es')) {
      setLanguageState(stored);
    } else {
      // Detect browser language
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('es')) {
        setLanguageState('es');
      }
    }
    setIsHydrated(true);
  }, []);

  // Save language to localStorage when it changes
  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  }, []);

  // Toggle between languages
  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'en' ? 'es' : 'en');
  }, [language, setLanguage]);

  // Translation function
  const t = useCallback((key: string): string => {
    return translations[language][key] || key;
  }, [language]);

  // Prevent hydration mismatch by rendering default until hydrated
  const value = {
    language: isHydrated ? language : 'en',
    setLanguage,
    toggleLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// Hook to use language context
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Export translations for direct access if needed
export { translations };
