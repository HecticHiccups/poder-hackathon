"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { SCENARIOS, GameScenario, getLocalizedScenario } from "@/data/scenarios";
import { GameEngine, ScenarioComplete } from "@/components/game-engine";
import { useLanguage } from "@/context/LanguageContext";

type GameState = "select" | "playing" | "complete";

export default function PlayPage() {
    const { t, language } = useLanguage();
    const [gameState, setGameState] = useState<GameState>("select");
    const [selectedScenario, setSelectedScenario] = useState<GameScenario | null>(null);
    const [finalScore, setFinalScore] = useState({ score: 0, max: 0 });

    const handleStartScenario = (scenario: GameScenario) => {
        setSelectedScenario(scenario);
        setGameState("playing");
    };

    const handleComplete = (score: number, maxScore: number) => {
        setFinalScore({ score, max: maxScore });
        setGameState("complete");
    };

    const handleReplay = () => {
        setGameState("playing");
    };

    const handleExit = () => {
        setGameState("select");
        setSelectedScenario(null);
    };

    // Playing state
    if (gameState === "playing" && selectedScenario) {
        return (
            <GameEngine
                key={selectedScenario.id + Date.now()} // Force remount on replay
                scenario={selectedScenario}
                onComplete={handleComplete}
                onExit={handleExit}
            />
        );
    }

    // Complete state
    if (gameState === "complete" && selectedScenario) {
        return (
            <ScenarioComplete
                scenario={selectedScenario}
                score={finalScore.score}
                maxScore={finalScore.max}
                onReplay={handleReplay}
                onExit={handleExit}
            />
        );
    }

    // Coming soon scenarios
    const comingSoonScenarios = [
        { emoji: "🏥", key: "play.medicalRights" },
        { emoji: "⚒️", key: "play.workplaceRaid" },
        { emoji: "📱", key: "play.phoneSearch" },
    ];

    // Selection state
    return (
        <main className="min-h-screen bg-[var(--poder-midnight)]">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-[var(--poder-midnight)]/90 backdrop-blur-sm border-b border-[var(--poder-slate)]">
                <div className="max-w-lg mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link
                            href="/"
                            className="font-display text-2xl text-[var(--poder-fire)]"
                        >
                            PODER
                        </Link>
                        <Link
                            href="/learn"
                            className="font-code text-sm text-[var(--poder-neon)] hover:underline"
                        >
                            ← {t('nav.learn')}
                        </Link>
                    </div>
                </div>
            </header>

            {/* Content */}
            <div className="max-w-lg mx-auto px-4 py-8">
                {/* Hero */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <span className="text-4xl mb-4 block">🎮</span>
                    <h1 className="font-display text-4xl text-[var(--poder-paper)] mb-2">
                        {t('play.title')} <span className="text-[var(--poder-fire)]">{t('play.titleHighlight')}</span>
                    </h1>
                    <p className="font-body text-[var(--poder-paper)] opacity-70">
                        {t('play.subtitle')}
                    </p>
                </motion.div>

                {/* Scenario Cards */}
                <div className="space-y-4">
                    {SCENARIOS.map((scenario, index) => {
                        const localizedScenario = getLocalizedScenario(scenario, language);
                        return (
                            <motion.div
                                key={scenario.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <button
                                    onClick={() => handleStartScenario(scenario)}
                                    className="w-full text-left card-resistance group"
                                >
                                    <div className="flex items-start gap-4">
                                        <span className="text-4xl">{scenario.emoji}</span>
                                        <div className="flex-1">
                                            <h3 className="font-display text-xl text-[var(--poder-paper)] group-hover:text-[var(--poder-fire)] transition-colors">
                                                {localizedScenario.title}
                                            </h3>
                                            <p className="font-body text-sm text-[var(--poder-paper)] opacity-60 mt-1">
                                                {localizedScenario.description}
                                            </p>
                                            <div className="flex items-center gap-4 mt-3">
                                                <span
                                                    className={`badge-neon text-xs ${scenario.difficulty === "beginner"
                                                            ? "!text-green-400 !border-green-400"
                                                            : scenario.difficulty === "intermediate"
                                                                ? "!text-yellow-400 !border-yellow-400"
                                                                : "!text-red-400 !border-red-400"
                                                        }`}
                                                >
                                                    {t(`play.${scenario.difficulty}`)}
                                                </span>
                                                <span className="font-code text-xs text-[var(--poder-paper)] opacity-40">
                                                    ~{scenario.estimatedMinutes} {t('play.min')}
                                                </span>
                                                <span className="font-code text-xs text-[var(--poder-gold)]">
                                                    {scenario.totalPoints} {t('play.pts')}
                                                </span>
                                            </div>
                                        </div>
                                        <span className="font-display text-2xl text-[var(--poder-paper)] opacity-30 group-hover:opacity-100 group-hover:text-[var(--poder-fire)] transition-all">
                                            →
                                        </span>
                                    </div>
                                </button>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Coming Soon */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 text-center"
                >
                    <p className="font-code text-sm text-[var(--poder-paper)] opacity-40 mb-4">
                        {t('play.comingSoon')}
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                        {comingSoonScenarios.map((item) => (
                            <span
                                key={item.key}
                                className="px-3 py-1 bg-[var(--poder-charcoal)] rounded-full font-code text-xs text-[var(--poder-paper)] opacity-40"
                            >
                                {item.emoji} {t(item.key)}
                            </span>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-[var(--poder-charcoal)] border-t border-[var(--poder-slate)]">
                <div className="max-w-lg mx-auto flex">
                    <Link
                        href="/"
                        className="flex-1 py-4 text-center font-code text-sm text-[var(--poder-paper)] opacity-50 hover:opacity-100"
                    >
                        {t('nav.home')}
                    </Link>
                    <Link
                        href="/learn"
                        className="flex-1 py-4 text-center font-code text-sm text-[var(--poder-paper)] opacity-50 hover:opacity-100"
                    >
                        {t('nav.learn')}
                    </Link>
                    <Link
                        href="/play"
                        className="flex-1 py-4 text-center font-code text-sm text-[var(--poder-fire)]"
                    >
                        {t('nav.play')}
                    </Link>
                    <Link
                        href="/profile"
                        className="flex-1 py-4 text-center font-code text-sm text-[var(--poder-paper)] opacity-50 hover:opacity-100"
                    >
                        {t('nav.profile')}
                    </Link>
                </div>
            </nav>
        </main>
    );
}
