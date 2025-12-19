"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { RIGHTS_CARDS, CATEGORY_INFO, RightsCategory } from "@/data/rights-content";
import { RightsCardUI, CategoryFilter, ProgressIndicator } from "@/components/rights-card";
import { useLanguage } from "@/context/LanguageContext";

export default function LearnPage() {
    const { t } = useLanguage();
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [earnedPoints, setEarnedPoints] = useState(0);
    const [learnedCards, setLearnedCards] = useState<Set<string>>(new Set());

    // Filter cards by category
    const filteredCards = useMemo(() => {
        if (!selectedCategory) return RIGHTS_CARDS;
        return RIGHTS_CARDS.filter((card) => card.category === selectedCategory);
    }, [selectedCategory]);

    // Current visible cards (top 2 for stacking effect)
    const visibleCards = filteredCards.slice(currentIndex, currentIndex + 2);

    // Category options for filter
    const categoryOptions = Object.entries(CATEGORY_INFO).map(([key, value]) => ({
        key,
        ...value,
    }));

    const handleSwipeRight = () => {
        // User wants to learn more - award points
        const card = filteredCards[currentIndex];
        if (card && !learnedCards.has(card.id)) {
            setEarnedPoints((prev) => prev + card.powerPoints);
            setLearnedCards((prev) => new Set(prev).add(card.id));
        }
        goToNext();
    };

    const handleSwipeLeft = () => {
        // User skipped
        goToNext();
    };

    const goToNext = () => {
        if (currentIndex < filteredCards.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        }
    };

    const handleCategoryChange = (category: string | null) => {
        setSelectedCategory(category as RightsCategory | null);
        setCurrentIndex(0);
    };

    const isComplete = currentIndex >= filteredCards.length - 1 && filteredCards.length > 0;

    return (
        <main className="min-h-screen bg-[var(--poder-midnight)]">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-[var(--poder-midnight)]/90 backdrop-blur-sm border-b border-[var(--poder-slate)]">
                <div className="max-w-lg mx-auto px-4 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <Link
                            href="/"
                            className="font-display text-2xl text-[var(--poder-fire)]"
                        >
                            PODER
                        </Link>
                        <div className="flex items-center gap-4">
                            <span className="badge-power">
                                ⚡ {earnedPoints} {t('learn.pp')}
                            </span>
                            <Link
                                href="/play"
                                className="font-code text-sm text-[var(--poder-neon)] hover:underline"
                            >
                                {t('nav.play')} →
                            </Link>
                        </div>
                    </div>

                    {/* Category Filter */}
                    <CategoryFilter
                        categories={categoryOptions}
                        selected={selectedCategory}
                        onSelect={handleCategoryChange}
                    />
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-lg mx-auto px-4 py-6">
                {/* Progress */}
                <div className="mb-6">
                    <ProgressIndicator
                        current={currentIndex}
                        total={filteredCards.length}
                        points={earnedPoints}
                    />
                </div>

                {/* Card Stack */}
                <div className="relative h-[480px]">
                    <AnimatePresence>
                        {!isComplete ? (
                            visibleCards.map((card, index) => (
                                <RightsCardUI
                                    key={card.id}
                                    card={card}
                                    isTop={index === 0}
                                    onSwipeLeft={handleSwipeLeft}
                                    onSwipeRight={handleSwipeRight}
                                />
                            ))
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute inset-0 flex flex-col items-center justify-center text-center"
                            >
                                <span className="text-6xl mb-4">🔥</span>
                                <h2 className="font-display text-4xl text-[var(--poder-gold)] mb-2">
                                    {t('learn.stackComplete')}
                                </h2>
                                <p className="font-body text-[var(--poder-paper)] opacity-70 mb-6">
                                    {t('learn.earnedPoints')} <span className="text-[var(--poder-gold)]">{earnedPoints}</span> {t('learn.powerPoints')}
                                </p>
                                <div className="flex flex-col gap-3 w-full max-w-xs">
                                    <button
                                        onClick={() => {
                                            setCurrentIndex(0);
                                        }}
                                        className="btn-fire"
                                    >
                                        {t('learn.reviewAgain')}
                                    </button>
                                    <Link href="/play" className="btn-neon text-center">
                                        {t('learn.testKnowledge')}
                                    </Link>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Action Buttons (for non-swipe users) */}
                {!isComplete && (
                    <div className="flex gap-4 mt-6">
                        <button
                            onClick={handleSwipeLeft}
                            className="flex-1 py-3 rounded-lg bg-[var(--poder-charcoal)] border border-[var(--poder-slate)] font-code text-sm text-[var(--poder-paper)] opacity-70 hover:opacity-100 transition-opacity"
                        >
                            {t('learn.skip')}
                        </button>
                        <button
                            onClick={handleSwipeRight}
                            className="flex-1 py-3 rounded-lg bg-[var(--poder-fire)] font-code text-sm text-[var(--poder-cream)] hover:bg-[var(--poder-fire-glow)] transition-colors"
                        >
                            {t('learn.iLearned')}
                        </button>
                    </div>
                )}

                {/* Quick Stats */}
                <div className="mt-8 grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-[var(--poder-charcoal)] rounded-lg">
                        <p className="font-display text-2xl text-[var(--poder-neon)]">
                            {learnedCards.size}
                        </p>
                        <p className="font-code text-xs text-[var(--poder-paper)] opacity-50">
                            {t('learn.learned')}
                        </p>
                    </div>
                    <div className="text-center p-4 bg-[var(--poder-charcoal)] rounded-lg">
                        <p className="font-display text-2xl text-[var(--poder-gold)]">
                            {earnedPoints}
                        </p>
                        <p className="font-code text-xs text-[var(--poder-paper)] opacity-50">
                            {t('learn.points')}
                        </p>
                    </div>
                    <div className="text-center p-4 bg-[var(--poder-charcoal)] rounded-lg">
                        <p className="font-display text-2xl text-[var(--poder-fire)]">
                            {filteredCards.length - currentIndex}
                        </p>
                        <p className="font-code text-xs text-[var(--poder-paper)] opacity-50">
                            {t('learn.remaining')}
                        </p>
                    </div>
                </div>
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
                        className="flex-1 py-4 text-center font-code text-sm text-[var(--poder-fire)]"
                    >
                        {t('nav.learn')}
                    </Link>
                    <Link
                        href="/play"
                        className="flex-1 py-4 text-center font-code text-sm text-[var(--poder-paper)] opacity-50 hover:opacity-100"
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
