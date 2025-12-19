"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
    DEMO_USER,
    ALL_BADGES,
    getRarityColor,
    getTitle,
    Badge
} from "@/data/user-data";
import { useLanguage } from "@/context/LanguageContext";

export default function ProfilePage() {
    const { t, language } = useLanguage();
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
                            ⚙️ {t('profile.settings')}
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
                        {getTitle(user.stats.level, language)}
                    </p>

                    {/* Level Progress */}
                    <div className="mt-6">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-code text-xs text-[var(--poder-paper)] opacity-60">
                                {t('profile.level')} {user.stats.level}
                            </span>
                            <span className="font-code text-xs text-[var(--poder-paper)] opacity-60">
                                {user.stats.xp} / {user.stats.xpToNextLevel} {t('profile.xp')}
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
                            {t('profile.powerPoints')}
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
                            {t('profile.cardsLearned')}
                        </p>
                    </div>
                    <div className="card-resistance text-center">
                        <p className="font-display text-3xl text-[var(--poder-fire)]">
                            {user.stats.totalScenariosCompleted}
                        </p>
                        <p className="font-code text-xs text-[var(--poder-paper)] opacity-60">
                            {t('profile.scenariosDone')}
                        </p>
                    </div>
                    <div className="card-resistance text-center">
                        <p className="font-display text-3xl text-[var(--poder-gold)]">
                            {user.stats.currentStreak}
                        </p>
                        <p className="font-code text-xs text-[var(--poder-paper)] opacity-60">
                            {t('profile.dayStreak')} 🔥
                        </p>
                    </div>
                    <div className="card-resistance text-center">
                        <p className="font-display text-3xl text-[var(--poder-paper)]">
                            {Math.round((user.stats.scenariosWon / user.stats.totalScenariosCompleted) * 100) || 0}%
                        </p>
                        <p className="font-code text-xs text-[var(--poder-paper)] opacity-60">
                            {t('profile.winRate')}
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
                            {t('profile.badges')}
                        </h2>
                        <span className="font-code text-xs text-[var(--poder-paper)] opacity-50">
                            {user.badges.length} / {ALL_BADGES.length}
                        </span>
                    </div>

                    {/* Earned Badges */}
                    <div className="grid grid-cols-4 gap-3 mb-6">
                        {user.badges.map((badge, index) => (
                            <BadgeCard key={badge.id} badge={badge} earned index={index} t={t} />
                        ))}
                    </div>

                    {/* Locked Badges */}
                    <p className="font-code text-xs text-[var(--poder-paper)] opacity-40 mb-3">
                        {t('profile.locked')} ({lockedBadges.length})
                    </p>
                    <div className="grid grid-cols-4 gap-3">
                        {lockedBadges.slice(0, 8).map((badge, index) => (
                            <BadgeCard key={badge.id} badge={badge} earned={false} index={index} t={t} />
                        ))}
                    </div>
                    {lockedBadges.length > 8 && (
                        <p className="font-code text-xs text-[var(--poder-paper)] opacity-40 text-center mt-3">
                            +{lockedBadges.length - 8} {t('profile.moreToUnlock')}
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
                        {t('profile.continueLearning')}
                    </Link>
                    <Link href="/play" className="btn-neon w-full text-center block">
                        {t('profile.playScenarios')}
                    </Link>
                </motion.div>

                {/* Member Since */}
                <p className="font-code text-xs text-[var(--poder-paper)] opacity-30 text-center mt-8">
                    {t('profile.memberSince')} {user.stats.joinedAt.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { month: "long", year: "numeric" })}
                </p>
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
                        className="flex-1 py-4 text-center font-code text-sm text-[var(--poder-paper)] opacity-50 hover:opacity-100"
                    >
                        {t('nav.play')}
                    </Link>
                    <Link
                        href="/profile"
                        className="flex-1 py-4 text-center font-code text-sm text-[var(--poder-fire)]"
                    >
                        {t('nav.profile')}
                    </Link>
                </div>
            </nav>
        </main>
    );
}

// Badge ID to translation key mapping
const BADGE_KEY_MAP: Record<string, string> = {
    "first-card": "firstStep",
    "immigration-101": "immigration101",
    "housing-hero": "housingHero",
    "labor-leader": "laborLeader",
    "justice-seeker": "justiceSeeker",
    "health-aware": "healthAware",
    "knowledge-master": "knowledgeMaster",
    "first-scenario": "simulationInitiate",
    "traffic-survivor": "trafficStopSurvivor",
    "door-defender": "doorDefender",
    "tenant-champion": "tenantChampion",
    "scenario-master": "scenarioMaster",
    "perfect-run": "perfectRun",
    "streak-3": "gettingStarted",
    "streak-7": "weekWarrior",
    "streak-30": "monthOfPower",
    "streak-100": "unstoppable",
    "early-adopter": "earlyAdopter",
    "matcha-supporter": "matchaSupporter",
};

// Badge Card Component
function BadgeCard({
    badge,
    earned,
    index,
    t
}: {
    badge: Badge;
    earned: boolean;
    index: number;
    t: (key: string) => string;
}) {
    const badgeKey = BADGE_KEY_MAP[badge.id] || badge.id;
    const badgeName = t(`badge.${badgeKey}`);
    const badgeDesc = t(`badge.desc.${badgeKey}`);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + index * 0.05 }}
            className={`relative aspect-square rounded-xl flex flex-col items-center justify-center p-2 ${earned
                    ? "bg-[var(--poder-charcoal)] border border-[var(--poder-slate)]"
                    : "bg-[var(--poder-midnight)] opacity-40"
                }`}
            title={earned ? `${badgeName}: ${badgeDesc}` : `🔒 ${badgeName}`}
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
                {badgeName}
            </p>
        </motion.div>
    );
}
