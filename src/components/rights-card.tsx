"use client";

import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { useState } from "react";
import { RightsCard, CATEGORY_INFO } from "@/data/rights-content";

interface RightsCardUIProps {
    card: RightsCard;
    onSwipeLeft: () => void;
    onSwipeRight: () => void;
    isTop: boolean;
}

export function RightsCardUI({ card, onSwipeLeft, onSwipeRight, isTop }: RightsCardUIProps) {
    const [exitX, setExitX] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false);
    const categoryInfo = CATEGORY_INFO[card.category];

    const handleDragEnd = (_: unknown, info: PanInfo) => {
        if (info.offset.x > 100) {
            setExitX(300);
            onSwipeRight();
        } else if (info.offset.x < -100) {
            setExitX(-300);
            onSwipeLeft();
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                className="absolute w-full"
                style={{
                    zIndex: isTop ? 10 : 0,
                    willChange: isTop ? 'transform' : 'auto',  // GPU hint for active card
                }}
                initial={{ scale: isTop ? 1 : 0.95, opacity: isTop ? 1 : 0.5 }}
                animate={{
                    scale: isTop ? 1 : 0.95,
                    opacity: isTop ? 1 : 0.7,
                    y: isTop ? 0 : 20,
                }}
                exit={{
                    x: exitX,
                    opacity: 0,
                    rotate: exitX > 0 ? 10 : -10,  // Reduced rotation (was 15)
                    transition: { duration: 0.2 }  // Faster exit (was 0.3)
                }}
                drag={isTop ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.5}  // Reduced elasticity (was 0.9)
                onDragEnd={handleDragEnd}
                whileDrag={{ cursor: "grabbing", scale: 1.01 }}  // Subtler scale (was 1.02)
            >
                <div
                    className="card-resistance cursor-grab active:cursor-grabbing"
                    style={{
                        borderColor: categoryInfo.color,
                        minHeight: isExpanded ? "auto" : "400px",
                    }}
                >
                    {/* Category Badge */}
                    <div className="flex items-center justify-between mb-4">
                        <span
                            className="badge-neon"
                            style={{
                                color: categoryInfo.color,
                                borderColor: categoryInfo.color,
                                background: `${categoryInfo.color}15`,
                            }}
                        >
                            {categoryInfo.emoji} {categoryInfo.label}
                        </span>
                        <span className="badge-power">
                            +{card.powerPoints} PP
                        </span>
                    </div>

                    {/* Title */}
                    <h2
                        className="font-display text-2xl sm:text-3xl mb-4"
                        style={{ color: categoryInfo.color }}
                    >
                        {card.title}
                    </h2>

                    {/* Summary */}
                    <p className="font-body text-lg text-[var(--poder-paper)] opacity-90 mb-6 leading-relaxed">
                        {card.summary}
                    </p>

                    {/* Expandable Content */}
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="pt-4 border-t border-[var(--poder-slate)]">
                                    <div className="font-body text-[var(--poder-paper)] opacity-80 whitespace-pre-line leading-relaxed">
                                        {card.fullContent}
                                    </div>
                                    <p className="mt-4 font-code text-xs text-[var(--poder-paper)] opacity-50">
                                        Source: {card.source}
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Expand Button */}
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="mt-4 font-code text-sm text-[var(--poder-neon)] hover:underline"
                    >
                        {isExpanded ? "← Show Less" : "Learn More →"}
                    </button>

                    {/* Swipe Hints */}
                    {isTop && (
                        <div className="flex justify-between mt-6 pt-4 border-t border-[var(--poder-slate)]">
                            <span className="font-code text-xs text-[var(--poder-paper)] opacity-40">
                                ← Swipe to skip
                            </span>
                            <span className="font-code text-xs text-[var(--poder-fire)] opacity-60">
                                Swipe to learn →
                            </span>
                        </div>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
}

// Category filter pills
interface CategoryFilterProps {
    categories: Array<{ key: string; label: string; emoji: string; color: string }>;
    selected: string | null;
    onSelect: (category: string | null) => void;
}

export function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
    return (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
                onClick={() => onSelect(null)}
                className={`shrink-0 px-4 py-2 rounded-full font-code text-sm transition-all ${selected === null
                    ? "bg-[var(--poder-fire)] text-[var(--poder-cream)]"
                    : "bg-[var(--poder-charcoal)] text-[var(--poder-paper)] opacity-70 hover:opacity-100"
                    }`}
            >
                All
            </button>
            {categories.map((cat) => (
                <button
                    key={cat.key}
                    onClick={() => onSelect(cat.key)}
                    className={`shrink-0 px-4 py-2 rounded-full font-code text-sm transition-all ${selected === cat.key
                        ? "text-[var(--poder-cream)]"
                        : "bg-[var(--poder-charcoal)] text-[var(--poder-paper)] opacity-70 hover:opacity-100"
                        }`}
                    style={{
                        background: selected === cat.key ? cat.color : undefined,
                    }}
                >
                    {cat.emoji} {cat.label}
                </button>
            ))}
        </div>
    );
}

// Progress indicator
interface ProgressIndicatorProps {
    current: number;
    total: number;
    points: number;
}

export function ProgressIndicator({ current, total, points }: ProgressIndicatorProps) {
    const progress = ((current + 1) / total) * 100;

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <span className="font-code text-xs text-[var(--poder-paper)] opacity-60">
                    {current + 1} / {total} cards
                </span>
                <span className="font-code text-xs text-[var(--poder-gold)]">
                    ⚡ {points} Power Points
                </span>
            </div>
            <div className="h-1 bg-[var(--poder-charcoal)] rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-gradient-to-r from-[var(--poder-fire)] to-[var(--poder-gold)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                />
            </div>
        </div>
    );
}
