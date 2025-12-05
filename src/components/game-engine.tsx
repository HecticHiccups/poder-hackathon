"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameScenario, ScenarioStep, ScenarioChoice, getStepById } from "@/data/scenarios";

interface GameEngineProps {
    scenario: GameScenario;
    onComplete: (score: number, maxScore: number) => void;
    onExit: () => void;
}

export function GameEngine({ scenario, onComplete, onExit }: GameEngineProps) {
    const [currentStepId, setCurrentStepId] = useState(scenario.steps[0].id);
    const [score, setScore] = useState(0);
    const [showFeedback, setShowFeedback] = useState<ScenarioChoice | null>(null);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [stepHistory, setStepHistory] = useState<string[]>([]);

    const currentStep = getStepById(scenario, currentStepId);

    // Timer logic
    useEffect(() => {
        if (currentStep?.timerSeconds && !showFeedback) {
            setTimeLeft(currentStep.timerSeconds);
            const interval = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev === null || prev <= 1) {
                        clearInterval(interval);
                        // Time's up - auto-select worst option or skip
                        handleTimeout();
                        return null;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [currentStepId, showFeedback]);

    const handleTimeout = useCallback(() => {
        if (currentStep?.choices) {
            // Find the worst choice
            const worstChoice = currentStep.choices.reduce((worst, choice) =>
                choice.pointsEarned < worst.pointsEarned ? choice : worst
            );
            handleChoice(worstChoice);
        }
    }, [currentStep]);

    const handleChoice = (choice: ScenarioChoice) => {
        setScore((prev) => prev + choice.pointsEarned);
        setShowFeedback(choice);
        setTimeLeft(null);
    };

    const advanceStep = () => {
        setShowFeedback(null);

        // Find next step
        const currentIndex = scenario.steps.findIndex((s) => s.id === currentStepId);
        const nextStep = scenario.steps[currentIndex + 1];

        if (nextStep) {
            setStepHistory((prev) => [...prev, currentStepId]);
            setCurrentStepId(nextStep.id);
        } else {
            // Scenario complete
            onComplete(score, scenario.totalPoints);
        }
    };

    // Auto-advance for narrator/system steps
    useEffect(() => {
        if (currentStep && !currentStep.choices && currentStep.nextStepId) {
            const timeout = setTimeout(() => {
                if (currentStep.nextStepId) {
                    setStepHistory((prev) => [...prev, currentStepId]);
                    setCurrentStepId(currentStep.nextStepId);
                }
            }, 2500);
            return () => clearTimeout(timeout);
        }
    }, [currentStepId, currentStep]);

    if (!currentStep) {
        return <div>Error: Step not found</div>;
    }

    const progress = ((stepHistory.length + 1) / scenario.steps.length) * 100;

    return (
        <div className="min-h-screen bg-[var(--poder-midnight)] flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-[var(--poder-midnight)]/90 backdrop-blur-sm border-b border-[var(--poder-slate)] p-4">
                <div className="flex items-center justify-between mb-2">
                    <button
                        onClick={onExit}
                        className="font-code text-sm text-[var(--poder-paper)] opacity-60 hover:opacity-100"
                    >
                        ← Exit
                    </button>
                    <span className="font-code text-sm text-[var(--poder-gold)]">
                        {score} points
                    </span>
                </div>
                {/* Progress bar */}
                <div className="h-1 bg-[var(--poder-charcoal)] rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-[var(--poder-fire)] to-[var(--poder-gold)]"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                    />
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col max-w-lg mx-auto w-full p-4">
                {/* Timer */}
                <AnimatePresence>
                    {timeLeft !== null && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="mb-4"
                        >
                            <div
                                className={`text-center py-2 rounded-lg font-display text-2xl ${timeLeft <= 5 ? "bg-[var(--poder-fire)] animate-pulse" : "bg-[var(--poder-charcoal)]"
                                    }`}
                                style={{
                                    color: timeLeft <= 5 ? "var(--poder-cream)" : "var(--poder-neon)",
                                }}
                            >
                                {timeLeft}s
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Narrative */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex-1"
                    >
                        {/* Speaker indicator */}
                        <div className="mb-4">
                            {currentStep.speaker === "authority" && (
                                <span className="badge-fire">👮 Authority</span>
                            )}
                            {currentStep.speaker === "narrator" && (
                                <span className="badge-neon">📖 Scene</span>
                            )}
                            {currentStep.speaker === "system" && (
                                <span className="badge-power">⚡ Result</span>
                            )}
                        </div>

                        {/* Text */}
                        <div
                            className={`p-6 rounded-xl mb-6 ${currentStep.speaker === "authority"
                                    ? "bg-[var(--poder-charcoal)] border-l-4 border-[var(--poder-fire)]"
                                    : currentStep.speaker === "system"
                                        ? "bg-gradient-to-br from-[var(--poder-charcoal)] to-[var(--poder-slate)]"
                                        : "bg-[var(--poder-charcoal)]"
                                }`}
                        >
                            <p className="font-body text-lg text-[var(--poder-paper)] leading-relaxed">
                                {currentStep.narrative}
                            </p>
                        </div>

                        {/* Choices */}
                        {currentStep.choices && !showFeedback && (
                            <div className="space-y-3">
                                {currentStep.choices.map((choice, index) => (
                                    <motion.button
                                        key={choice.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        onClick={() => handleChoice(choice)}
                                        className="w-full p-4 text-left bg-[var(--poder-charcoal)] border border-[var(--poder-slate)] rounded-lg hover:border-[var(--poder-fire)] transition-colors"
                                    >
                                        <span className="font-body text-[var(--poder-paper)]">
                                            {choice.text}
                                        </span>
                                    </motion.button>
                                ))}
                            </div>
                        )}

                        {/* Feedback */}
                        <AnimatePresence>
                            {showFeedback && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="space-y-4"
                                >
                                    <div
                                        className={`p-6 rounded-xl border-2 ${showFeedback.isCorrect
                                                ? "bg-green-900/30 border-green-500"
                                                : showFeedback.pointsEarned < 0
                                                    ? "bg-red-900/30 border-red-500"
                                                    : "bg-yellow-900/30 border-yellow-500"
                                            }`}
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-2xl">
                                                {showFeedback.isCorrect ? "✅" : showFeedback.pointsEarned < 0 ? "❌" : "⚠️"}
                                            </span>
                                            <span
                                                className={`font-display text-xl ${showFeedback.pointsEarned > 0
                                                        ? "text-green-400"
                                                        : showFeedback.pointsEarned < 0
                                                            ? "text-red-400"
                                                            : "text-yellow-400"
                                                    }`}
                                            >
                                                {showFeedback.pointsEarned > 0 ? "+" : ""}
                                                {showFeedback.pointsEarned} points
                                            </span>
                                        </div>
                                        <p className="font-body text-[var(--poder-paper)] opacity-90">
                                            {showFeedback.feedback}
                                        </p>
                                    </div>

                                    <button onClick={advanceStep} className="btn-fire w-full">
                                        Continue →
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Auto-advance for narrative steps */}
                        {!currentStep.choices && currentStep.nextStepId && (
                            <div className="flex items-center gap-2 text-[var(--poder-paper)] opacity-50">
                                <motion.div
                                    className="w-4 h-4 border-2 border-[var(--poder-neon)] border-t-transparent rounded-full"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                />
                                <span className="font-code text-sm">Loading...</span>
                            </div>
                        )}

                        {/* End of scenario */}
                        {!currentStep.choices && !currentStep.nextStepId && (
                            <button
                                onClick={() => onComplete(score, scenario.totalPoints)}
                                className="btn-fire w-full"
                            >
                                Complete Scenario
                            </button>
                        )}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}

// Scenario complete screen
interface ScenarioCompleteProps {
    scenario: GameScenario;
    score: number;
    maxScore: number;
    onReplay: () => void;
    onExit: () => void;
}

export function ScenarioComplete({
    scenario,
    score,
    maxScore,
    onReplay,
    onExit,
}: ScenarioCompleteProps) {
    const percentage = Math.round((score / maxScore) * 100);
    const grade =
        percentage >= 80
            ? { label: "Rights Champion", emoji: "🏆", color: "var(--poder-gold)" }
            : percentage >= 60
                ? { label: "Rights Aware", emoji: "✊", color: "var(--poder-neon)" }
                : percentage >= 40
                    ? { label: "Learning", emoji: "📚", color: "var(--poder-paper)" }
                    : { label: "Needs Practice", emoji: "⚠️", color: "var(--poder-fire)" };

    return (
        <div className="min-h-screen bg-[var(--poder-midnight)] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full text-center"
            >
                <span className="text-6xl mb-4 block">{grade.emoji}</span>
                <h2
                    className="font-display text-4xl mb-2"
                    style={{ color: grade.color }}
                >
                    {grade.label}
                </h2>
                <p className="font-body text-[var(--poder-paper)] opacity-70 mb-6">
                    {scenario.title} Complete
                </p>

                <div className="bg-[var(--poder-charcoal)] rounded-xl p-6 mb-6">
                    <div className="flex justify-center items-baseline gap-2 mb-4">
                        <span className="font-display text-5xl text-[var(--poder-gold)]">
                            {score}
                        </span>
                        <span className="font-code text-[var(--poder-paper)] opacity-50">
                            / {maxScore} pts
                        </span>
                    </div>
                    <div className="h-3 bg-[var(--poder-slate)] rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1, delay: 0.3 }}
                            className="h-full bg-gradient-to-r from-[var(--poder-fire)] to-[var(--poder-gold)]"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <button onClick={onReplay} className="btn-neon">
                        Try Again
                    </button>
                    <button onClick={onExit} className="btn-fire">
                        Back to Scenarios
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
