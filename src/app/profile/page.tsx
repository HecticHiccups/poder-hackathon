"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
    DEMO_USER,
    ALL_BADGES,
    getRarityColor,
    Badge
} from "@/data/user-data";

export default function ProfilePage() {
    const user = DEMO_USER;
    const xpProgress = (user.stats.xp / user.stats.xpToNextLevel) * 100;

    // Separate earned and locked badges
    const earnedBadgeIds = new Set(user.badges.map(b => b.id));
    const lockedBadges = ALL_BADGES.filter(b => !earnedBadgeIds.has(b.id));

    return (
        <main className="min-h-screen bg-[var(--poder-midnight)] pb-20">
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
                        <button className="font-code text-sm text-[var(--poder-paper)] opacity-60 hover:opacity-100">
                            ⚙️ Settings
                        </button>
                    </div>
                </div>
            </header>

            {/* Profile Content */}
            <div className="max-w-lg mx-auto px-4 py-6">
                {/* Profile Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card-resistance text-center mb-6"
                >
                    {/* Avatar */}
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-[var(--poder-fire)] to-[var(--poder-gold)] flex items-center justify-center text-5xl">
                        {user.avatarEmoji}
                    </div>

                    {/* Name & Title */}
                    <h1 className="font-display text-3xl text-[var(--poder-paper)]">
                        {user.displayName}
                    </h1>
                    <p className="font-code text-sm text-[var(--poder-gold)] mt-1">
                        {user.title}
                    </p>

                    {/* Level Progress */}
                    <div className="mt-6">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-code text-xs text-[var(--poder-paper)] opacity-60">
                                Level {user.stats.level}
                            </span>
                            <span className="font-code text-xs text-[var(--poder-paper)] opacity-60">
                                {user.stats.xp} / {user.stats.xpToNextLevel} XP
                            </span>
                        </div>
                        <div className="h-3 bg-[var(--poder-slate)] rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${xpProgress}%` }}
                                transition={{ duration: 1, delay: 0.3 }}
                                className="h-full bg-gradient-to-r from-[var(--poder-fire)] to-[var(--poder-gold)]"
                            />
                        </div>
                    </div>

                    {/* Power Points */}
                    <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-[var(--poder-midnight)] rounded-full">
                        <span className="text-xl">⚡</span>
                        <span className="font-display text-2xl text-[var(--poder-gold)]">
                            {user.stats.powerPoints}
                        </span>
                        <span className="font-code text-xs text-[var(--poder-paper)] opacity-60">
                            Power Points
                        </span>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 gap-4 mb-6"
                >
                    <div className="card-resistance text-center">
                        <p className="font-display text-3xl text-[var(--poder-neon)]">
                            {user.stats.totalCardsLearned}
                        </p>
                        <p className="font-code text-xs text-[var(--poder-paper)] opacity-60">
                            Cards Learned
                        </p>
                    </div>
                    <div className="card-resistance text-center">
                        <p className="font-display text-3xl text-[var(--poder-fire)]">
                            {user.stats.totalScenariosCompleted}
                        </p>
                        <p className="font-code text-xs text-[var(--poder-paper)] opacity-60">
                            Scenarios Done
                        </p>
                    </div>
                    <div className="card-resistance text-center">
                        <p className="font-display text-3xl text-[var(--poder-gold)]">
                            {user.stats.currentStreak}
                        </p>
                        <p className="font-code text-xs text-[var(--poder-paper)] opacity-60">
                            Day Streak 🔥
                        </p>
                    </div>
                    <div className="card-resistance text-center">
                        <p className="font-display text-3xl text-[var(--poder-paper)]">
                            {Math.round((user.stats.scenariosWon / user.stats.totalScenariosCompleted) * 100) || 0}%
                        </p>
                        <p className="font-code text-xs text-[var(--poder-paper)] opacity-60">
                            Win Rate
                        </p>
                    </div>
                </motion.div>

                {/* Badges Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-display text-xl text-[var(--poder-paper)]">
                            Badges
                        </h2>
                        <span className="font-code text-xs text-[var(--poder-paper)] opacity-50">
                            {user.badges.length} / {ALL_BADGES.length}
                        </span>
                    </div>

                    {/* Earned Badges */}
                    <div className="grid grid-cols-4 gap-3 mb-6">
                        {user.badges.map((badge, index) => (
                            <BadgeCard key={badge.id} badge={badge} earned index={index} />
                        ))}
                    </div>

                    {/* Locked Badges */}
                    <p className="font-code text-xs text-[var(--poder-paper)] opacity-40 mb-3">
                        Locked ({lockedBadges.length})
                    </p>
                    <div className="grid grid-cols-4 gap-3">
                        {lockedBadges.slice(0, 8).map((badge, index) => (
                            <BadgeCard key={badge.id} badge={badge} earned={false} index={index} />
                        ))}
                    </div>
                    {lockedBadges.length > 8 && (
                        <p className="font-code text-xs text-[var(--poder-paper)] opacity-40 text-center mt-3">
                            +{lockedBadges.length - 8} more to unlock
                        </p>
                    )}
                </motion.div>

                {/* Actions */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-8 space-y-3"
                >
                    <Link href="/learn" className="btn-fire w-full text-center block">
                        Continue Learning
                    </Link>
                    <Link href="/play" className="btn-neon w-full text-center block">
                        Play Scenarios
                    </Link>
                </motion.div>

                {/* Member Since */}
                <p className="font-code text-xs text-[var(--poder-paper)] opacity-30 text-center mt-8">
                    Member since {user.stats.joinedAt.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </p>
            </div>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-[var(--poder-charcoal)] border-t border-[var(--poder-slate)]">
                <div className="max-w-lg mx-auto flex">
                    <Link
                        href="/"
                        className="flex-1 py-4 text-center font-code text-sm text-[var(--poder-paper)] opacity-50 hover:opacity-100"
                    >
                        Home
                    </Link>
                    <Link
                        href="/learn"
                        className="flex-1 py-4 text-center font-code text-sm text-[var(--poder-paper)] opacity-50 hover:opacity-100"
                    >
                        Learn
                    </Link>
                    <Link
                        href="/play"
                        className="flex-1 py-4 text-center font-code text-sm text-[var(--poder-paper)] opacity-50 hover:opacity-100"
                    >
                        Play
                    </Link>
                    <Link
                        href="/profile"
                        className="flex-1 py-4 text-center font-code text-sm text-[var(--poder-fire)]"
                    >
                        Profile
                    </Link>
                </div>
            </nav>
        </main>
    );
}

// Badge Card Component
function BadgeCard({
    badge,
    earned,
    index
}: {
    badge: Badge;
    earned: boolean;
    index: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + index * 0.05 }}
            className={`relative aspect-square rounded-xl flex flex-col items-center justify-center p-2 ${earned
                    ? "bg-[var(--poder-charcoal)] border border-[var(--poder-slate)]"
                    : "bg-[var(--poder-midnight)] opacity-40"
                }`}
            title={earned ? `${badge.name}: ${badge.description}` : `🔒 ${badge.name}`}
        >
            <span className={`text-2xl ${!earned && "grayscale"}`}>
                {earned ? badge.emoji : "🔒"}
            </span>
            {earned && (
                <div
                    className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
                    style={{ backgroundColor: getRarityColor(badge.rarity) }}
                />
            )}
            <p className="font-code text-[8px] text-[var(--poder-paper)] opacity-60 mt-1 truncate w-full text-center">
                {badge.name}
            </p>
        </motion.div>
    );
}
