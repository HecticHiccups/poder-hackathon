'use client';

import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { findAnswer, searchQuestions, analyzeIntent, type PoderAnswer, type Language } from '@/lib/poder-agent';
import { useLanguage } from '@/context/LanguageContext';

// Types for Web Speech API
interface IWindow extends Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
}

// --- Sub-components for Performance ---

const PulseRing = memo(() => (
    <>
        <span className="absolute inset-0 rounded-full border-2 border-[#FF6B00] animate-ping opacity-75" />
        <span className="relative inline-flex h-full w-full rounded-full bg-gradient-to-br from-[#FF6B00] to-[#FF8533]" />
    </>
));
PulseRing.displayName = 'PulseRing';

const ModalHeader = memo(({
    onClose,
    language,
    onToggleLanguage,
    status
}: {
    onClose: () => void;
    language: Language;
    onToggleLanguage: () => void;
    status: string;
}) => (
    <div className="flex items-center justify-between border-b border-white/5 px-4 pb-4 pt-2 sm:pt-4">
        <div className="flex items-center gap-3">
            <div
                className="flex h-11 w-11 items-center justify-center rounded-full shadow-lg"
                style={{ background: 'linear-gradient(135deg, #FF6B00 0%, #FF8533 100%)' }}
            >
                <span className="text-xl" role="img" aria-hidden="true">🛡️</span>
            </div>
            <div>
                <h2 className="text-lg font-bold text-white">Ask Poder</h2>
                <p className="text-xs text-gray-400 min-w-[100px]">
                    {status}
                </p>
            </div>
        </div>

        <div className="flex items-center gap-2">
            <button
                onClick={onToggleLanguage}
                className="flex h-10 items-center gap-1.5 rounded-full bg-white/10 px-3 text-sm font-medium text-white transition-colors active:bg-white/20"
                aria-label={`Switch to ${language === 'en' ? 'Spanish' : 'English'}`}
            >
                <span role="img" aria-hidden="true">{language === 'en' ? '🇺🇸' : '🇲🇽'}</span>
                <span className="hidden sm:inline">{language === 'en' ? 'EN' : 'ES'}</span>
            </button>

            <button
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-gray-400 transition-colors active:bg-white/20"
                aria-label="Close"
            >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    </div>
));
ModalHeader.displayName = 'ModalHeader';

const SuggestionsList = memo(({
    suggestions,
    onSelect,
    language
}: {
    suggestions: PoderAnswer[];
    onSelect: (answer: PoderAnswer) => void;
    language: Language;
}) => (
    <div>
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
            {language === 'en' ? 'Common Questions' : 'Preguntas Comunes'}
        </h3>
        <div className="grid gap-2">
            {suggestions.slice(0, 5).map((answer) => (
                <button
                    key={answer.id}
                    onClick={() => onSelect(answer)}
                    className="flex min-h-[52px] items-center justify-between gap-3 rounded-xl bg-gray-800 p-3.5 text-left transition-colors active:bg-gray-700 hover:bg-gray-750"
                >
                    <span className="text-sm text-gray-200 sm:text-base">
                        {answer.question}
                    </span>
                    <span className="flex-shrink-0 text-lg text-gray-500" role="img" aria-hidden="true">
                        🔊
                    </span>
                </button>
            ))}
        </div>
    </div>
));
SuggestionsList.displayName = 'SuggestionsList';

// --- Main Component ---

export function PoderAgent() {
    const pathname = usePathname();
    const { language, toggleLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [response, setResponse] = useState<PoderAnswer | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [suggestions, setSuggestions] = useState<PoderAnswer[]>([]);
    const [hasMicPermission, setHasMicPermission] = useState<boolean | null>(null);

    // New: Agent-specific state
    const [isAgentThinking, setIsAgentThinking] = useState(false);
    const [conversationSessionId, setConversationSessionId] = useState<string | null>(null);
    const [responseSource, setResponseSource] = useState<'faq' | 'agent' | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    // Refs
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const recognitionRef = useRef<any>(null);
    const dragControls = useDragControls();
    const fabConstraintsRef = useRef<HTMLDivElement | null>(null);
    const audioUnlockedRef = useRef(false);

    // Initial permission check - only set false if explicitly denied
    useEffect(() => {
        if (typeof navigator !== 'undefined' && navigator.permissions) {
            navigator.permissions.query({ name: 'microphone' as PermissionName })
                .then((result) => {
                    // Only disable if explicitly denied, allow 'prompt' state
                    setHasMicPermission(result.state !== 'denied');
                    result.onchange = () => setHasMicPermission(result.state !== 'denied');
                })
                .catch(() => {
                    // Permission API not supported - assume allowed until proven otherwise
                    setHasMicPermission(true);
                });
        } else {
            // No permissions API - assume allowed
            setHasMicPermission(true);
        }
    }, []);

    // Speech Recognition Setup
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const { webkitSpeechRecognition, SpeechRecognition } = window as unknown as IWindow;
            const SpeechRecognitionConstructor = SpeechRecognition || webkitSpeechRecognition;

            if (SpeechRecognitionConstructor) {
                const recognition = new SpeechRecognitionConstructor();
                recognition.continuous = false;
                recognition.interimResults = true;
                recognition.lang = language === 'en' ? 'en-US' : 'es-ES';

                recognition.onstart = () => {
                    setIsListening(true);
                    setError(null);
                };

                recognition.onend = () => {
                    setIsListening(false);
                };

                recognition.onresult = (event: any) => {
                    const result = event.results[event.results.length - 1];
                    const text = result[0].transcript;
                    setTranscript(text);

                    if (result.isFinal) {
                        handleQuestion(text);
                    }
                };

                recognition.onerror = (event: any) => {
                    console.error('Speech recognition error', event.error);
                    setIsListening(false);
                    if (event.error === 'not-allowed') {
                        setHasMicPermission(false);
                    }
                };

                recognitionRef.current = recognition;
            }
        }
    }, [language]); // Only recreate if language changes

    // Update language settings
    useEffect(() => {
        setTranscript('');
        setResponse(null);
        setError(null);
        const newSuggestions = searchQuestions('', language, 5);
        console.log('[Suggestions] Loaded for language:', language, newSuggestions);
        setSuggestions(newSuggestions);
        // Clear conversation session when language changes
        setConversationSessionId(null);
        setResponseSource(null);
    }, [language]);

    // Unlock audio on iOS/Safari - must be called from user gesture
    const unlockAudio = useCallback(() => {
        if (audioUnlockedRef.current) return;

        const audio = audioRef.current;
        if (audio) {
            console.log('[Audio] Unlocking audio context...');
            // Create a short silence and play it to unlock
            audio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
            audio.play().then(() => {
                audio.pause();
                audio.currentTime = 0;
                audioUnlockedRef.current = true;
                console.log('[Audio] Audio context unlocked!');
            }).catch(e => {
                console.log('[Audio] Could not unlock audio:', e.message);
            });
        }
    }, []);

    const playAnswer = useCallback((url: string) => {
        if (!url) {
            console.warn('[Audio] No URL provided');
            return;
        }

        const audio = audioRef.current;
        if (audio) {
            console.log('[Audio] Attempting to play:', url);

            // Stop any current playback
            audio.pause();
            audio.currentTime = 0;

            // Set source and load
            audio.src = url;
            console.log('[Audio] Source set, loading...');

            // Use oncanplaythrough for more reliable playback
            const handleCanPlay = () => {
                console.log('[Audio] Can play through, starting playback...');
                const playPromise = audio.play();
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            console.log('[Audio] Playback started successfully');
                            setIsPlaying(true);
                        })
                        .catch(e => {
                            console.error('[Audio] Playback error:', e.name, e.message);
                            setIsPlaying(false);
                            if (e.name === 'NotAllowedError') {
                                setError(
                                    language === 'en'
                                        ? 'Tap a question again to hear audio.'
                                        : 'Toca una pregunta de nuevo para escuchar.'
                                );
                            }
                        });
                }
                audio.removeEventListener('canplaythrough', handleCanPlay);
            };

            audio.addEventListener('canplaythrough', handleCanPlay);
            audio.load();
        } else {
            console.error('[Audio] Audio element not found');
        }
    }, [language]);

    const handleQuestion = useCallback(async (text: string) => {
        setIsAgentThinking(true);
        setError(null);
        setResponse(null);

        // Analyze user intent for smart routing
        const intent = analyzeIntent(text, language);
        console.log('[Poder Agent] Intent detected:', intent);

        // Route based on intent
        if (intent === 'greeting' || intent === 'help_request' || intent === 'conversation') {
            // Conversational intents → go straight to dynamic Q&A (natural conversation)
            console.log('[Poder Agent] Conversational intent, using dynamic Q&A (Groq + TTS)');

            try {
                const apiResponse = await fetch('/api/conversation/dynamic', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        text,
                        language,
                    }),
                });

                const data = await apiResponse.json();
                console.log('[Poder Agent] API response:', data);

                if (!apiResponse.ok) {
                    // Check for specific config errors
                    if (data.error?.includes('not configured')) {
                        throw new Error('SERVICE_NOT_CONFIGURED');
                    }
                    throw new Error(data.error || data.message || 'API request failed');
                }

                if (data.type === 'dynamic') {
                    const dynamicAnswer: PoderAnswer = {
                        id: `dynamic-${Date.now()}`,
                        question: text,
                        answer: data.text,
                        voiceScript: data.text,
                        audioUrl: data.audioUrl,
                        relatedScenarios: [],
                        relatedCards: [],
                        category: 'dynamic-response',
                        confidence: 1,
                    };

                    setResponse(dynamicAnswer);
                    setResponseSource('agent');
                    playAnswer(data.audioUrl);

                    console.log('[Poder Agent] Dynamic response played, time:', data.duration_ms, 'ms');
                } else if (data.type === 'error') {
                    throw new Error(data.message || 'Unknown error');
                }
            } catch (error) {
                console.error('[Poder Agent] Dynamic Q&A error:', error);
                const errorMsg = error instanceof Error ? error.message : 'Unknown error';

                // Provide helpful fallback response for greetings when API fails
                if (intent === 'greeting') {
                    const fallbackAnswer: PoderAnswer = {
                        id: 'fallback-greeting',
                        question: text,
                        answer: language === 'en'
                            ? "Hi! I'm Poder. I help people understand their rights with ICE, police, and landlords. Try asking a question from the list below!"
                            : "¡Hola! Soy Poder. Ayudo a las personas a entender sus derechos con ICE, policía y propietarios. ¡Intenta preguntar algo de la lista abajo!",
                        voiceScript: '',
                        audioUrl: '',
                        relatedScenarios: [],
                        relatedCards: [],
                        category: 'fallback',
                        confidence: 1,
                    };
                    setResponse(fallbackAnswer);
                    setResponseSource(null);
                } else {
                    setError(
                        language === 'en'
                            ? "Voice service temporarily unavailable. Try a question below!"
                            : "Servicio de voz no disponible. ¡Prueba una pregunta abajo!"
                    );
                }
            } finally {
                setIsAgentThinking(false);
            }
            return;
        }

        // Legal question → try FAQ first (Layer 2 - fast, free)
        const faqAnswer = findAnswer(text, language);

        if (faqAnswer && faqAnswer.confidence >= 0.7) {
            // High confidence FAQ match → use existing MP3
            console.log('[Poder Agent] Using FAQ MP3:', faqAnswer.id);
            setResponse(faqAnswer);
            setResponseSource('faq');
            playAnswer(faqAnswer.audioUrl);
            setIsAgentThinking(false);
            return;
        }

        // No FAQ match or low confidence → use dynamic Q&A (Layer 2.5)
        try {
            console.log('[Poder Agent] No FAQ match, using dynamic Q&A (Groq + TTS)');

            const apiResponse = await fetch('/api/conversation/dynamic', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text,
                    language,
                }),
            });

            const data = await apiResponse.json();

            if (!apiResponse.ok) {
                throw new Error(data.error || 'API request failed');
            }

            if (data.type === 'dynamic') {
                const dynamicAnswer: PoderAnswer = {
                    id: `dynamic-${Date.now()}`,
                    question: text,
                    answer: data.text,
                    voiceScript: data.text,
                    audioUrl: data.audioUrl,
                    relatedScenarios: [],
                    relatedCards: [],
                    category: 'dynamic-response',
                    confidence: 1,
                };

                setResponse(dynamicAnswer);
                setResponseSource('agent');
                playAnswer(data.audioUrl);

                console.log('[Poder Agent] Dynamic response played, time:', data.duration_ms, 'ms');
            } else if (data.type === 'error') {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('[Poder Agent] Dynamic Q&A error:', error);

            // Fallback to low-confidence FAQ match if available
            if (faqAnswer) {
                console.log('[Poder Agent] Falling back to low-confidence FAQ:', faqAnswer.id);
                setResponse(faqAnswer);
                setResponseSource('faq');
                playAnswer(faqAnswer.audioUrl);
            } else {
                setError(
                    language === 'en'
                        ? "I couldn't find an answer. Try one of the questions below."
                        : "No encontré una respuesta. Prueba una de las preguntas abajo."
                );
            }
        } finally {
            setIsAgentThinking(false);
        }
    }, [language, playAnswer]);

    // Audio element event listeners for debugging
    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            const handleEnded = () => {
                console.log('[Audio Event] ended');
                setIsPlaying(false);
            };
            const handleCanPlay = () => console.log('[Audio Event] canplay - ready to play');
            const handleLoadStart = () => console.log('[Audio Event] loadstart');
            const handleError = (e: Event) => {
                const target = e.target as HTMLAudioElement;
                console.error('[Audio Event] error:', target.error?.code, target.error?.message);
            };
            const handlePlaying = () => console.log('[Audio Event] playing');
            const handleWaiting = () => console.log('[Audio Event] waiting (buffering)');

            audio.addEventListener('ended', handleEnded);
            audio.addEventListener('canplay', handleCanPlay);
            audio.addEventListener('loadstart', handleLoadStart);
            audio.addEventListener('error', handleError);
            audio.addEventListener('playing', handlePlaying);
            audio.addEventListener('waiting', handleWaiting);

            return () => {
                audio.removeEventListener('ended', handleEnded);
                audio.removeEventListener('canplay', handleCanPlay);
                audio.removeEventListener('loadstart', handleLoadStart);
                audio.removeEventListener('error', handleError);
                audio.removeEventListener('playing', handlePlaying);
                audio.removeEventListener('waiting', handleWaiting);
            };
        }
    }, []);

    // Reset when closed
    useEffect(() => {
        if (!isOpen) {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
                setIsPlaying(false);
            }
            if (isListening && recognitionRef.current) {
                recognitionRef.current.stop();
            }
        }
    }, [isOpen, isListening]);

    const toggleListening = useCallback(() => {
        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            setTranscript('');
            setResponse(null);
            setError(null);
            try {
                recognitionRef.current?.start();
            } catch (e) {
                console.error('Failed to start recognition:', e);
            }
        }
    }, [isListening]);

    const handleManualPlay = useCallback((answer: PoderAnswer) => {
        console.log('[Manual Play] Answer object:', answer);
        console.log('[Manual Play] Audio URL:', answer.audioUrl);
        setResponse(answer);
        setError(null);
        setTranscript(answer.question);
        playAnswer(answer.audioUrl);
    }, [playAnswer]);

    const stopAudio = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setIsPlaying(false);
        }
    }, []);

    // Derived status text
    const statusText = isListening
        ? (language === 'en' ? 'Listening...' : 'Escuchando...')
        : isAgentThinking
            ? (language === 'en' ? 'Thinking...' : 'Pensando...')
            : isPlaying
                ? (language === 'en' ? 'Speaking...' : 'Hablando...')
                : (language === 'en' ? 'Tap mic to ask' : 'Toca el micrófono');

    if (pathname?.includes('/play/scenario')) return null;

    return (
        <>
            <audio
                ref={audioRef}
                className="hidden"
                preload="auto"
                playsInline
            />

            {/* Drag boundary - full viewport */}
            <div ref={fabConstraintsRef} className="fixed inset-0 pointer-events-none z-40" />

            {/* FAB - draggable, positioned above bottom nav */}
            <motion.button
                className="fixed bottom-20 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg sm:bottom-6 sm:right-6 sm:h-16 sm:w-16 focus:outline-none focus:ring-4 focus:ring-[#FF6B00]/50 touch-none cursor-grab active:cursor-grabbing"
                style={{
                    background: 'linear-gradient(135deg, #FF6B00 0%, #FF8533 100%)',
                    boxShadow: '0 4px 20px rgba(255, 107, 0, 0.4)',
                }}
                onClick={() => {
                    // Only open if not dragging
                    if (!isDragging) {
                        unlockAudio(); // Unlock audio on iOS/Safari
                        setIsOpen(true);
                    }
                }}
                drag
                dragConstraints={fabConstraintsRef}
                dragElastic={0.1}
                dragMomentum={false}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={() => {
                    // Small delay to prevent click firing after drag
                    setTimeout(() => setIsDragging(false), 100);
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.5 }}
                whileTap={{ scale: isDragging ? 1 : 0.9 }}
                whileDrag={{ scale: 1.1 }}
                aria-label="Open Poder voice assistant (drag to reposition)"
            >
                <div className="relative flex items-center justify-center">
                    <span className="text-2xl sm:text-3xl relative z-10" role="img" aria-hidden="true">🎙️</span>
                    {/* CSS Pulse Animation - More Performant */}
                    <div className="absolute inset-0 -m-1 rounded-full border-2 border-white/30 animate-ping opacity-20" />
                </div>
            </motion.button>

            {/* Modal */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
                        />

                        {/* Sheet */}
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            drag="y"
                            dragControls={dragControls}
                            dragConstraints={{ top: 0, bottom: 0 }}
                            dragElastic={{ top: 0, bottom: 0.5 }}
                            onDragEnd={(_, info) => {
                                if (info.offset.y > 100 || info.velocity.y > 500) {
                                    setIsOpen(false);
                                }
                            }}
                            className="fixed inset-x-0 bottom-0 z-50 flex max-h-[90vh] flex-col overflow-hidden rounded-t-3xl bg-gray-900 shadow-2xl ring-1 ring-white/10 sm:inset-x-auto sm:bottom-6 sm:left-1/2 sm:w-full sm:max-w-md sm:-translate-x-1/2 sm:rounded-3xl"
                        >
                            {/* Drag Indicator */}
                            <div
                                className="flex justify-center py-3 sm:hidden"
                                onPointerDown={(e) => dragControls.start(e)}
                            >
                                <div className="h-1.5 w-12 rounded-full bg-white/20" />
                            </div>

                            <ModalHeader
                                onClose={() => setIsOpen(false)}
                                language={language}
                                onToggleLanguage={toggleLanguage}
                                status={statusText}
                            />

                            {/* Scrollable Content */}
                            <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6">

                                {/* Mic Interaction Area */}
                                <div className="flex flex-col items-center py-6">
                                    <motion.button
                                        onClick={toggleListening}
                                        disabled={hasMicPermission === false}
                                        className={`relative flex h-20 w-20 items-center justify-center rounded-full transition-all sm:h-24 sm:w-24 ${hasMicPermission === false ? 'bg-gray-700 opacity-50' :
                                                isListening ? 'bg-red-500' : ''
                                            }`}
                                        style={!isListening && hasMicPermission !== false ? {
                                            background: 'linear-gradient(135deg, #FF6B00 0%, #FF8533 100%)'
                                        } : undefined}
                                        whileTap={{ scale: 0.95 }}
                                        aria-label={isListening ? 'Stop listening' : 'Start listening'}
                                    >
                                        <span className="text-3xl sm:text-4xl relative z-10" role="img" aria-hidden="true">
                                            {hasMicPermission === false ? '🚫' : isListening ? '⏹️' : '🎙️'}
                                        </span>

                                        {isListening && (
                                            <>
                                                <div className="absolute inset-0 rounded-full border-2 border-red-500 animate-[ping_1.5s_ease-in-out_infinite]" />
                                                <div className="absolute inset-0 rounded-full border-2 border-red-500 animate-[ping_1.5s_ease-in-out_infinite_0.5s]" />
                                            </>
                                        )}
                                    </motion.button>

                                    <p className="mt-4 max-w-xs text-center text-sm text-gray-300 sm:text-base min-h-[1.5em] transition-all duration-200">
                                        {hasMicPermission === false
                                            ? (language === 'en' ? 'Microphone access denied.' : 'Acceso al micrófono denegado.')
                                            : transcript || (language === 'en' ? "What's your question?" : '¿Cuál es tu pregunta?')}
                                    </p>
                                </div>

                                {/* Answer Card */}
                                <AnimatePresence mode="wait">
                                    {response && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="mb-6 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10"
                                        >
                                            <div className="mb-2 flex items-center justify-between">
                                                <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B00]">
                                                    {language === 'en' ? 'Poder Answer' : 'Respuesta de Poder'}
                                                </span>
                                                {isPlaying && (
                                                    <div className="flex items-center gap-1">
                                                        <span className="block h-2 w-1 animate-[pulse_0.6s_infinite] rounded-full bg-[#FF6B00]" />
                                                        <span className="block h-3 w-1 animate-[pulse_0.6s_infinite_0.2s] rounded-full bg-[#FF6B00]" />
                                                        <span className="block h-2 w-1 animate-[pulse_0.6s_infinite_0.4s] rounded-full bg-[#FF6B00]" />
                                                    </div>
                                                )}
                                            </div>

                                            <p className="text-base leading-relaxed text-white sm:text-lg">
                                                {response.answer}
                                            </p>

                                            <div className="mt-4 flex flex-wrap gap-2">
                                                <button
                                                    onClick={() => isPlaying ? stopAudio() : playAnswer(response.audioUrl)}
                                                    className="flex h-10 items-center gap-2 rounded-full bg-white/10 px-4 text-sm font-medium text-white transition-colors active:bg-white/20 hover:bg-white/15"
                                                >
                                                    {isPlaying ? '⏹️ Stop' : '🔊 Replay'}
                                                </button>

                                                {response.relatedScenarios.length > 0 && (
                                                    <a
                                                        href={`/play/${response.relatedScenarios[0]}`}
                                                        className="flex h-10 items-center gap-2 rounded-full bg-[#FF6B00]/20 px-4 text-sm font-medium text-[#FF6B00] transition-colors active:bg-[#FF6B00]/30 hover:bg-[#FF6B00]/25"
                                                    >
                                                        🎮 Practice
                                                    </a>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}

                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="mb-6 rounded-2xl bg-red-500/10 p-4 text-center text-sm text-red-200 ring-1 ring-red-500/20"
                                        >
                                            {error}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <SuggestionsList
                                    suggestions={suggestions}
                                    onSelect={handleManualPlay}
                                    language={language}
                                />
                            </div>

                            {/* Footer */}
                            <div className="border-t border-white/5 bg-gray-900/90 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 backdrop-blur-sm">
                                <p className="text-center text-[11px] text-gray-500">
                                    {language === 'en'
                                        ? 'Powered by Poder • Not legal advice'
                                        : 'Desarrollado por Poder • No es asesoría legal'}
                                </p>
                                {/* Debug info - remove after testing */}
                                <p className="text-center text-[9px] text-gray-600 mt-1">
                                    Audio: {isPlaying ? '▶️ Playing' : '⏸️ Stopped'} | Suggestions: {suggestions.length}
                                </p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
