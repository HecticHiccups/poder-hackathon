'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { findAnswer, type PoderAnswer } from '@/lib/poder-agent';

// Types for Web Speech API
interface IWindow extends Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
}

export function PoderAgent() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [language, setLanguage] = useState<'en' | 'es'>('en');
    const [transcript, setTranscript] = useState('');
    const [response, setResponse] = useState<PoderAnswer | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Refs
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const recognitionRef = useRef<any>(null);

    // Initialize speech recognition
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const { webkitSpeechRecognition, SpeechRecognition } = window as unknown as IWindow;
            const SpeechRecognitionConstructor = SpeechRecognition || webkitSpeechRecognition;

            if (SpeechRecognitionConstructor) {
                const recognition = new SpeechRecognitionConstructor();
                recognition.continuous = false;
                recognition.interimResults = false;
                recognition.lang = language === 'en' ? 'en-US' : 'es-ES';

                recognition.onstart = () => {
                    setIsListening(true);
                    setError(null);
                };

                recognition.onend = () => {
                    setIsListening(false);
                };

                recognition.onresult = (event: any) => {
                    const text = event.results[0][0].transcript;
                    setTranscript(text);
                    handleQuestion(text);
                };

                recognition.onerror = (event: any) => {
                    console.error('Speech recognition error', event.error);
                    setIsListening(false);
                    // Don't show technical errors to user, just reset UI
                };

                recognitionRef.current = recognition;
            }
        }
    }, [language]);

    // Handle language switch
    useEffect(() => {
        if (recognitionRef.current) {
            recognitionRef.current.lang = language === 'en' ? 'en-US' : 'es-ES';
        }
        // clear state on lang switch
        setTranscript('');
        setResponse(null);
        setError(null);
    }, [language]);

    // Process the question
    const handleQuestion = (text: string) => {
        const answer = findAnswer(text, language);

        if (answer) {
            setResponse(answer);
            playAnswer(answer.audioUrl);
        } else {
            setError(
                language === 'en'
                    ? "I didn't catch that specific question. Try asking common questions listed below."
                    : "No entendí esa pregunta específica. Intenta con las preguntas comunes abajo."
            );
        }
    };

    // Play audio response
    const playAnswer = (url: string) => {
        if (audioRef.current) {
            audioRef.current.src = url;
            audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(e => console.error("Audio playback error:", e));

            audioRef.current.onended = () => setIsPlaying(false);
        }
    };

    // Stop everything when closed
    useEffect(() => {
        if (!isOpen) {
            if (audioRef.current) {
                audioRef.current.pause();
                setIsPlaying(false);
            }
            if (isListening && recognitionRef.current) {
                recognitionRef.current.stop();
            }
        }
    }, [isOpen]);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            setTranscript('');
            setResponse(null);
            setError(null);
            recognitionRef.current?.start();
        }
    };

    const handleManualPlay = (answer: PoderAnswer) => {
        setResponse(answer);
        setTranscript(answer.question); // Show the question as if user asked it
        playAnswer(answer.audioUrl);
    };

    // Don't show on specific pages if needed (e.g. inside a game)
    // if (pathname.includes('/play/scenario')) return null;

    return (
        <>
            <audio ref={audioRef} className="hidden" />

            {/* Floating Button */}
            <motion.button
                className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full shadow-[0_0_20px_rgba(255,107,0,0.4)] transition-transform hover:scale-105 active:scale-95"
                style={{
                    background: 'linear-gradient(135deg, #FF6B00 0%, #FF8533 100%)',
                }}
                onClick={() => setIsOpen(true)}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ rotate: 10 }}
            >
                <span className="text-3xl">🎙️</span>
                {/* Pulse effect */}
                <motion.div
                    className="absolute inset-0 rounded-full border-2 border-[#FF6B00]"
                    animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
            </motion.button>

            {/* Modal / Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                        />

                        {/* Agent Interface */}
                        <motion.div
                            initial={{ y: '100%', opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: '100%', opacity: 0 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-h-[85vh] w-full max-w-md overflow-hidden rounded-t-[2rem] bg-gray-900 shadow-2xl ring-1 ring-white/10 sm:bottom-6 sm:rounded-[2rem]"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-white/5 bg-gray-900/50 p-4 backdrop-blur-md">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-[#FF6B00] to-[#FF8533] shadow-lg">
                                        <span className="text-xl">🛡️</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">Ask Poder</h3>
                                        <p className="text-xs text-gray-400">
                                            {isListening ? (language === 'en' ? 'Listening...' : 'Escuchando...') :
                                                isPlaying ? (language === 'en' ? 'Speaking...' : 'Hablando...') :
                                                    (language === 'en' ? 'Tap mic to ask' : 'Toca para preguntar')}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setLanguage(l => l === 'en' ? 'es' : 'en')}
                                        className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-white/10"
                                    >
                                        {language === 'en' ? '🇺🇸 EN' : '🇲🇽 ES'}
                                    </button>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>

                            {/* Content Area */}
                            <div className="flex max-h-[60vh] flex-col overflow-y-auto bg-gray-900 p-6">

                                {/* State: Listening / Processing */}
                                <div className="mb-8 flex flex-col items-center justify-center py-6">
                                    <button
                                        onClick={toggleListening}
                                        className={`relative flex h-24 w-24 items-center justify-center rounded-full transition-all ${isListening
                                                ? 'bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)]'
                                                : 'bg-linear-to-br from-[#FF6B00] to-[#FF8533] shadow-[0_0_20px_rgba(255,107,0,0.3)]'
                                            }`}
                                    >
                                        <span className="text-4xl">{isListening ? '⬛' : '🎙️'}</span>

                                        {/* Ring animations while listening */}
                                        {isListening && (
                                            <>
                                                <motion.div
                                                    className="absolute inset-0 rounded-full border-2 border-red-500"
                                                    animate={{ scale: [1, 1.4], opacity: [0.5, 0] }}
                                                    transition={{ duration: 1.5, repeat: Infinity }}
                                                />
                                                <motion.div
                                                    className="absolute inset-0 rounded-full border-2 border-red-500"
                                                    animate={{ scale: [1, 1.4], opacity: [0.5, 0] }}
                                                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                                                />
                                            </>
                                        )}
                                    </button>

                                    <p className="mt-4 text-center font-medium text-gray-300">
                                        {transcript || (language === 'en' ? "What's your question?" : "¿Cuál es tu pregunta?")}
                                    </p>
                                </div>

                                {/* State: Response */}
                                <AnimatePresence mode="wait">
                                    {response && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mb-6 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10"
                                        >
                                            <div className="mb-2 flex items-center justify-between">
                                                <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B00]">Poder Answer</span>
                                                {isPlaying && (
                                                    <div className="flex gap-1">
                                                        {[1, 2, 3].map(i => (
                                                            <motion.div
                                                                key={i}
                                                                className="h-3 w-1 bg-[#FF6B00]"
                                                                animate={{ height: [4, 12, 4] }}
                                                                transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-lg leading-relaxed text-white">
                                                {response.answer}
                                            </p>
                                            <div className="mt-3 flex gap-2">
                                                <button
                                                    onClick={() => playAnswer(response.audioUrl)}
                                                    className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/20"
                                                >
                                                    🔊 Replay
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}

                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mb-6 rounded-2xl bg-red-500/10 p-4 text-center text-red-200 ring-1 ring-red-500/20"
                                        >
                                            {error}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Suggestions / Common Questions */}
                                <div>
                                    <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
                                        {language === 'en' ? 'Common Questions' : 'Preguntas Comunes'}
                                    </h4>
                                    <div className="grid gap-2">
                                        {(language === 'en' ?
                                            ['What if ICE comes to my door?', 'Can I record the police?', 'Housing discrimination'] :
                                            ['¿Si ICE toca mi puerta?', '¿Puedo grabar a la policía?', 'Discriminación de vivienda']
                                        ).map((q, i) => (
                                            <button
                                                key={i}
                                                onClick={() => {
                                                    const answer = findAnswer(q, language);
                                                    if (answer) handleManualPlay(answer);
                                                }}
                                                className="flex items-center justify-between rounded-xl bg-gray-800 p-3 text-left transition-colors hover:bg-gray-700 active:bg-gray-600"
                                            >
                                                <span className="text-sm text-gray-200">{q}</span>
                                                <span className="text-gray-500">→</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                            </div>

                            {/* Footer / Branding */}
                            <div className="border-t border-white/5 bg-gray-900/80 p-3 text-center backdrop-blur-md">
                                <p className="text-[10px] text-gray-500">
                                    Powered by <span className="text-gray-400">Poder AI</span> • Always consult a lawyer for legal advice
                                </p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
