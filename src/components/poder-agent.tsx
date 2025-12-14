'use client';

import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { findAnswer, searchQuestions, type PoderAnswer, type Language } from '@/lib/poder-agent';

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
    const [isOpen, setIsOpen] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [language, setLanguage] = useState<Language>('en');
    const [transcript, setTranscript] = useState('');
    const [response, setResponse] = useState<PoderAnswer | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [suggestions, setSuggestions] = useState<PoderAnswer[]>([]);
    const [hasMicPermission, setHasMicPermission] = useState<boolean | null>(null);

    // Refs
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const recognitionRef = useRef<any>(null);
    const dragControls = useDragControls();

    // Initial permission check
    useEffect(() => {
        if (typeof navigator !== 'undefined' && navigator.permissions) {
            navigator.permissions.query({ name: 'microphone' as PermissionName })
                .then((result) => {
                    setHasMicPermission(result.state === 'granted');
                    result.onchange = () => setHasMicPermission(result.state === 'granted');
                })
                .catch(() => setHasMicPermission(null));
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
        setSuggestions(searchQuestions('', language, 5));
    }, [language]);

    const playAnswer = useCallback((url: string) => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current.src = url;
            audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(e => {
                    console.error("Audio playback error:", e);
                    setIsPlaying(false);
                });
        }
    }, []);

    const handleQuestion = useCallback((text: string) => {
        // Use current language ref or state
        const answer = findAnswer(text, language);

        if (answer) {
            setResponse(answer);
            setError(null);
            playAnswer(answer.audioUrl);
        } else {
            setError(
                language === 'en'
                    ? "I couldn't find an answer. Try one of the questions below."
                    : "No encontré una respuesta. Prueba una de las preguntas abajo."
            );
            setResponse(null);
        }
    }, [language, playAnswer]);

    // Cleanup audio on unmount
    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            const handleEnded = () => setIsPlaying(false);
            audio.addEventListener('ended', handleEnded);
            return () => audio.removeEventListener('ended', handleEnded);
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
        : isPlaying
            ? (language === 'en' ? 'Speaking...' : 'Hablando...')
            : (language === 'en' ? 'Tap mic to ask' : 'Toca el micrófono');

    if (pathname?.includes('/play/scenario')) return null;

    return (
        <>
            <audio ref={audioRef} className="hidden" preload="none" />

            {/* FAB */}
            <motion.button
                className="fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg active:scale-95 sm:bottom-6 sm:right-6 sm:h-16 sm:w-16 focus:outline-none focus:ring-4 focus:ring-[#FF6B00]/50"
                style={{
                    background: 'linear-gradient(135deg, #FF6B00 0%, #FF8533 100%)',
                    boxShadow: '0 4px 20px rgba(255, 107, 0, 0.4)',
                }}
                onClick={() => setIsOpen(true)}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.5 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Open Poder voice assistant"
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
                                onToggleLanguage={() => setLanguage(l => l === 'en' ? 'es' : 'en')}
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
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
