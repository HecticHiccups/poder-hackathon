// User gamification data
// Badges, achievements, and profile information

export interface Badge {
    id: string;
    name: string;
    description: string;
    emoji: string;
    category: "learning" | "gameplay" | "streak" | "special";
    rarity: "bronze" | "silver" | "gold" | "platinum";
    earnedAt?: Date;
}

export interface UserStats {
    powerPoints: number;
    totalCardsLearned: number;
    totalScenariosCompleted: number;
    scenariosWon: number;
    currentStreak: number;
    longestStreak: number;
    joinedAt: Date;
    level: number;
    xp: number;
    xpToNextLevel: number;
}

export interface UserProfile {
    id: string;
    displayName: string;
    avatarEmoji: string;
    title: string;
    stats: UserStats;
    badges: Badge[];
    preferredLanguage: string;
}

// XP thresholds for levels
export const LEVEL_THRESHOLDS = [
    0,      // Level 1
    100,    // Level 2
    250,    // Level 3
    500,    // Level 4
    850,    // Level 5
    1300,   // Level 6
    1900,   // Level 7
    2600,   // Level 8
    3500,   // Level 9
    4600,   // Level 10+
];

export const TITLES: Record<number, string> = {
    1: "Newcomer",
    2: "Aware Citizen",
    3: "Rights Learner",
    4: "Knowledge Seeker",
    5: "Rights Defender",
    6: "Legal Scholar",
    7: "Rights Champion",
    8: "Power Advocate",
    9: "Freedom Fighter",
    10: "Poder Master",
};

// All available badges
export const ALL_BADGES: Badge[] = [
    // Learning badges
    {
        id: "first-card",
        name: "First Step",
        description: "Learned your first rights card",
        emoji: "📖",
        category: "learning",
        rarity: "bronze",
    },
    {
        id: "immigration-101",
        name: "Immigration 101",
        description: "Completed all immigration rights cards",
        emoji: "🛂",
        category: "learning",
        rarity: "silver",
    },
    {
        id: "housing-hero",
        name: "Housing Hero",
        description: "Completed all housing rights cards",
        emoji: "🏠",
        category: "learning",
        rarity: "silver",
    },
    {
        id: "labor-leader",
        name: "Labor Leader",
        description: "Completed all labor rights cards",
        emoji: "⚒️",
        category: "learning",
        rarity: "silver",
    },
    {
        id: "justice-seeker",
        name: "Justice Seeker",
        description: "Completed all criminal justice cards",
        emoji: "⚖️",
        category: "learning",
        rarity: "silver",
    },
    {
        id: "health-aware",
        name: "Health Aware",
        description: "Completed all healthcare rights cards",
        emoji: "🏥",
        category: "learning",
        rarity: "silver",
    },
    {
        id: "knowledge-master",
        name: "Knowledge Master",
        description: "Learned all 14 rights cards",
        emoji: "🎓",
        category: "learning",
        rarity: "gold",
    },

    // Gameplay badges
    {
        id: "first-scenario",
        name: "Simulation Initiate",
        description: "Completed your first scenario",
        emoji: "🎮",
        category: "gameplay",
        rarity: "bronze",
    },
    {
        id: "traffic-survivor",
        name: "Traffic Stop Survivor",
        description: "Scored 80%+ on The Traffic Stop",
        emoji: "🚔",
        category: "gameplay",
        rarity: "silver",
    },
    {
        id: "door-defender",
        name: "Door Defender",
        description: "Scored 80%+ on The Knock at the Door",
        emoji: "🚪",
        category: "gameplay",
        rarity: "silver",
    },
    {
        id: "tenant-champion",
        name: "Tenant Champion",
        description: "Scored 80%+ on The Illegal Eviction",
        emoji: "🔐",
        category: "gameplay",
        rarity: "silver",
    },
    {
        id: "scenario-master",
        name: "Scenario Master",
        description: "Completed all scenarios with 80%+ score",
        emoji: "🏆",
        category: "gameplay",
        rarity: "gold",
    },
    {
        id: "perfect-run",
        name: "Perfect Run",
        description: "Achieved 100% on any scenario",
        emoji: "💯",
        category: "gameplay",
        rarity: "platinum",
    },

    // Streak badges
    {
        id: "streak-3",
        name: "Getting Started",
        description: "3-day learning streak",
        emoji: "🔥",
        category: "streak",
        rarity: "bronze",
    },
    {
        id: "streak-7",
        name: "Week Warrior",
        description: "7-day learning streak",
        emoji: "🔥",
        category: "streak",
        rarity: "silver",
    },
    {
        id: "streak-30",
        name: "Month of Power",
        description: "30-day learning streak",
        emoji: "🔥",
        category: "streak",
        rarity: "gold",
    },
    {
        id: "streak-100",
        name: "Unstoppable",
        description: "100-day learning streak",
        emoji: "🔥",
        category: "streak",
        rarity: "platinum",
    },

    // Special badges
    {
        id: "early-adopter",
        name: "Early Adopter",
        description: "Joined during the hackathon launch",
        emoji: "⭐",
        category: "special",
        rarity: "platinum",
    },
    {
        id: "matcha-supporter",
        name: "Matcha Supporter",
        description: "Bought us a matcha!",
        emoji: "🍵",
        category: "special",
        rarity: "platinum",
    },
];

// Mock user for demo
export const DEMO_USER: UserProfile = {
    id: "demo-user-001",
    displayName: "Rights Defender",
    avatarEmoji: "✊",
    title: "Knowledge Seeker",
    preferredLanguage: "en",
    stats: {
        powerPoints: 285,
        totalCardsLearned: 8,
        totalScenariosCompleted: 3,
        scenariosWon: 2,
        currentStreak: 5,
        longestStreak: 5,
        joinedAt: new Date("2024-12-01"),
        level: 4,
        xp: 620,
        xpToNextLevel: 850,
    },
    badges: [
        { ...ALL_BADGES.find(b => b.id === "first-card")!, earnedAt: new Date("2024-12-01") },
        { ...ALL_BADGES.find(b => b.id === "first-scenario")!, earnedAt: new Date("2024-12-02") },
        { ...ALL_BADGES.find(b => b.id === "streak-3")!, earnedAt: new Date("2024-12-03") },
        { ...ALL_BADGES.find(b => b.id === "traffic-survivor")!, earnedAt: new Date("2024-12-04") },
        { ...ALL_BADGES.find(b => b.id === "early-adopter")!, earnedAt: new Date("2024-12-01") },
    ],
};

// Utility functions
export function getTitle(level: number): string {
    return TITLES[Math.min(level, 10)] || TITLES[10];
}

export function calculateLevel(xp: number): { level: number; xpInLevel: number; xpToNext: number } {
    let level = 1;
    for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
        if (xp >= LEVEL_THRESHOLDS[i]) {
            level = i + 1;
        }
    }
    const currentThreshold = LEVEL_THRESHOLDS[level - 1] || 0;
    const nextThreshold = LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1] + 1000;

    return {
        level,
        xpInLevel: xp - currentThreshold,
        xpToNext: nextThreshold - currentThreshold,
    };
}

export function getRarityColor(rarity: Badge["rarity"]): string {
    switch (rarity) {
        case "bronze": return "#CD7F32";
        case "silver": return "#C0C0C0";
        case "gold": return "#FFD700";
        case "platinum": return "#E5E4E2";
    }
}
