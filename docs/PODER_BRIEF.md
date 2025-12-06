# PODER - Product Requirements Document
**Product Brief & Technical Specification**

---

## 1. Executive Summary

**Product Name:** Poder (Spanish: "Power")  
**Tagline:** Reclaiming Rights. Empowering People.  
**Version:** 1.0 MVP  
**Status:** Active Development (Hackathon Phase)  
**Last Updated:** December 2024

**Mission:** Archive disappearing rights information, translate legal jargon into accessible language, and gamify civic education to empower vulnerable communities.

---

## 2. Problem Statement

### The Crisis
- **Government websites are removing or obscuring critical rights information**
- Legal documents use inaccessible jargon that most people cannot understand
- Language barriers exclude non-English speakers from understanding their rights
- Traditional legal education is boring and ineffective
- Vulnerable communities (immigrants, tenants, workers) are exploited due to lack of knowledge

### The Impact
**Without knowing their rights, people waive them.** This leads to:
- Illegal evictions going unchallenged
- Wage theft remaining unreported
- Self-incrimination during police encounters
- Deportations that could have been prevented
- Unsafe working conditions persisting

---

## 3. Target Users

### Primary Personas

#### 1. The Immigrant 🛂
- **Age:** 18-45
- **Pain Point:** Fear of deportation, doesn't know rights during ICE encounters
- **Language:** Often non-English primary speaker
- **Tech Literacy:** Mobile-first, social media native
- **Use Case:** Practice "The Knock at the Door" scenario in native language

#### 2. The Tenant 🏠
- **Age:** 22-55
- **Pain Point:** Facing aggressive landlord, unaware of housing protections
- **Income:** Low to moderate, rent-burdened
- **Use Case:** Learn about illegal eviction tactics, document violations

#### 3. The Worker ⚒️
- **Age:** 18-65
- **Pain Point:** Wage theft, unsafe conditions, fear of retaliation
- **Environment:** Blue-collar, service industry
- **Use Case:** Understand labor rights, know how to report OSHA violations

#### 4. The Activist ✊
- **Age:** 20-35
- **Pain Point:** Wants to educate their community but lacks accessible resources
- **Tech Literacy:** High, social media influencer
- **Use Case:** Share Poder content, train community members

#### 5. The Youth 📱
- **Age:** 16-25
- **Pain Point:** Traditional legal education is boring and irrelevant
- **Platform Preference:** TikTok, Instagram, mobile-first
- **Use Case:** Swipe through rights cards, compete on scenarios with friends

---

## 4. Product Vision

### North Star Metric
**Number of people who can correctly assert at least one right in a high-pressure situation**

### Core Value Propositions

1. **Archive** — Preserve government rights information before it disappears
2. **Simplify** — Transform legal jargon into plain, actionable language
3. **Translate** — Deliver content in any language (coming soon)
4. **Gamify** — Make learning engaging through interactive simulations

---

## 5. Current Features (MVP v1.0)

### 5.1 Landing Page (`/`)
**Purpose:** First impression, value communication, navigation hub

**Components:**
- Animated hero section with "PODER" fire glow effect
- Staggered intro animations
- Stats row (Rights Archived, Languages, Power Users)
- 3 feature cards:
  - 📜 Archive Rights
  - 🎮 Play Scenarios
  - 🌍 Translate in Real-Time
- CTA section: "Buy Us a Matcha"
- Footer with social links

**Design System:**
- Custom color palette: midnight, fire, neon, gold
- Typography: Bebas Neue (display), Bitter (body), JetBrains Mono (code)
- Film grain texture overlay
- Protest-art aesthetic

---

### 5.2 Learn Module (`/learn`)
**Purpose:** Swipeable TikTok-style knowledge feed

**Current Content:**
- 14 rights cards across 5 categories:
  - 🛂 **Immigration** (3 cards) — ICE encounters, warrants, right to silence
  - 🏠 **Housing** (3 cards) — Illegal evictions, repair withholding, retaliation
  - ⚒️ **Labor** (3 cards) — Wage theft, OSHA protections, organizing rights
  - ⚖️ **Criminal Justice** (3 cards) — Recording police, refusing searches, detention
  - 🏥 **Healthcare** (2 cards) — EMTALA, medical records access

**Features:**
- Swipeable card stack (Framer Motion gestures)
- Category filter pills
- Expandable "Learn More" sections
- Power Points awarded for learning (+10-25 PP per card)
- Progress tracking (X/14 cards)
- "Skip" vs "I Learned This" actions
- Mobile-first bottom navigation

**Card Structure:**
```
- Title (what the right is)
- Summary (60-second version)
- Full Content (expandable, with "What to say" scripts)
- Source citation (ACLU, HUD, DOL, etc.)
- Power Points value
```

---

### 5.3 Play Module (`/play`)
**Purpose:** Interactive scenario-based simulations

**Current Scenarios:**

#### 1. 🚔 The Traffic Stop (Beginner, ~3min, 100pts)
**Context:** You've been pulled over. Officer asks for documents, wants to search your car.  
**Decision Points:** 5  
**Key Learnings:**
- What documents you must provide
- How to refuse consent to search
- When to assert right to silence
- Physical compliance vs verbal objection

#### 2. 🚪 The Knock at the Door (Intermediate, ~4min, 120pts)
**Context:** ICE agents knock. They have a "warrant."  
**Decision Points:** 4  
**Key Learnings:**
- Difference between administrative vs judicial warrants
- Never open door without judge's signature
- Right to remain silent at your own door
- How to end the encounter safely

#### 3. 🔐 The Illegal Eviction (Intermediate, ~3min, 100pts)
**Context:** Landlord changed your locks, put belongings on curb.  
**Decision Points:** 4  
**Key Learnings:**
- Self-help evictions are always illegal
- Document everything immediately
- Call police and housing authority
- Legal aid can recover damages

**Game Mechanics:**
- Branching narrative with multiple choices per step
- Timed pressure (10-15 second countdowns on some choices)
- Instant feedback with explanations
- Point scoring (+30 for correct, -10 to -20 for dangerous choices)
- Completion grades:
  - 80%+ = Rights Champion 🏆
  - 60-79% = Rights Aware ✊
  - 40-59% = Learning 📚
  - <40% = Needs Practice ⚠️
- Replay functionality

---

### 5.4 Profile Module (`/profile`)
**Purpose:** Gamification hub, progress dashboard

**Features:**

**Identity:**
- Avatar (emoji-based)
- Display name
- Dynamic title (evolves with level)

**Progression System:**
- Level 1-10 with unique titles:
  - Lv1: Newcomer
  - Lv4: Knowledge Seeker
  - Lv7: Rights Champion
  - Lv10: Poder Master
- XP thresholds: [0, 100, 250, 500, 850, 1300, 1900, 2600, 3500, 4600]
- Visual progress bar to next level
- Power Points balance (⚡ Currency)

**Stats Grid:**
- 📚 Total Cards Learned
- 🎮 Scenarios Completed
- 🔥 Current Streak (days)
- 📊 Win Rate (%)

**Badge System (18 total):**

| Category | Count | Examples |
|----------|-------|----------|
| 📖 Learning | 7 | First Step, Immigration 101, Knowledge Master |
| 🎮 Gameplay | 6 | Simulation Initiate, Traffic Survivor, Perfect Run |
| 🔥 Streak | 4 | Getting Started (3d), Week Warrior (7d), Unstoppable (100d) |
| ⭐ Special | 2 | Early Adopter, Matcha Supporter |

**Badge Rarity:**
- Bronze: 🟤 Common achievements
- Silver: ⚪ Category completion
- Gold: 🟡 Mastery badges
- Platinum: ⚪ Rare/special accomplishments

**Display:**
- Earned badges shown in full color with rarity indicator
- Locked badges shown grayed out with 🔒
- Hover tooltips with badge descriptions

---

## 6. Technical Architecture

### 6.1 Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Frontend Framework** | Next.js | 14+ (App Router) | React SSR/SSG framework |
| **Language** | TypeScript | 5.x | Type safety |
| **Styling** | Tailwind CSS | 3.x | Utility-first CSS |
| **Animations** | Framer Motion | 11.x | Gesture-based animations |
| **State Management** | Zustand | 4.x | Lightweight state (installed, not used yet) |
| **Fonts** | Google Fonts | - | Bebas Neue, Bitter, JetBrains Mono |
| **Deployment** | Vercel | - | Hosting + edge functions |
| **Database** | Supabase | - | PostgreSQL (planned, not implemented) |
| **AI/Translation** | Anthropic Claude | - | Simplification + translation (planned) |

### 6.2 File Structure

```
poder-hackathon/
├── docs/
│   └── PODER_BRIEF.md          # This file
├── public/
│   ├── manifest.json            # PWA manifest
│   └── *.svg                    # Icons
├── src/
│   ├── app/
│   │   ├── globals.css          # Design system
│   │   ├── layout.tsx           # Root layout + fonts
│   │   ├── page.tsx             # Landing page
│   │   ├── learn/page.tsx       # Knowledge archive
│   │   ├── play/page.tsx        # Scenario selection
│   │   └── profile/page.tsx     # User dashboard
│   ├── components/
│   │   ├── rights-card.tsx      # Swipeable card + filters
│   │   └── game-engine.tsx      # Scenario player + completion
│   └── data/
│       ├── rights-content.ts    # 14 rights cards data
│       ├── scenarios.ts         # 3 game scenarios data
│       └── user-data.ts         # Badges, levels, demo user
└── README.md                    # Marketing/onboarding
```

### 6.3 Data Models

#### RightsCard
```typescript
{
  id: string;
  category: "immigration" | "housing" | "labor" | "criminal" | "healthcare";
  title: string;
  summary: string;          // 60-second version
  fullContent: string;      // Expandable details
  source: string;           // ACLU, HUD, etc.
  powerPoints: number;      // 10-25
  tags: string[];
}
```

#### GameScenario
```typescript
{
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  emoji: string;
  estimatedMinutes: number;
  totalPoints: number;
  steps: ScenarioStep[];    // Branching narrative
}
```

#### ScenarioStep
```typescript
{
  id: string;
  narrative: string;
  speaker: "narrator" | "authority" | "you" | "system";
  choices?: ScenarioChoice[];
  nextStepId?: string;      // For auto-advance
  timerSeconds?: number;    // Pressure mechanic
}
```

#### UserProfile
```typescript
{
  id: string;
  displayName: string;
  avatarEmoji: string;
  title: string;
  stats: UserStats;
  badges: Badge[];
  preferredLanguage: string;
}
```

---

## 7. User Flows

### 7.1 First-Time User Journey

```mermaid
graph TD
    A[Land on Homepage] --> B{Clicks CTA}
    B -->|Archive| C[/learn page]
    B -->|Play| D[/play page]
    
    C --> E[View first rights card]
    E --> F[Swipe through cards]
    F --> G[Earn Power Points]
    G --> H[Check /profile]
    H --> I[See Level 1, unlock badges]
    
    D --> J[Select scenario]
    J --> K[Play through choices]
    K --> L[Get instant feedback]
    L --> M[See final score]
    M --> N[Unlock badges]
    N --> H
```

### 7.2 Learn Flow (Detailed)

1. User lands on `/learn`
2. Sees category filter pills (All, Immigration, Housing, etc.)
3. Selects a category or leaves on "All"
4. Views top card in stack (with next card visible underneath)
5. Reads summary
6. **Choice A:** Clicks "Learn More" → Expands to see full content + source
7. **Choice B:** Swipes left (Skip) → No points, next card
8. **Choice C:** Swipes right or clicks "I Learned This" → +Points, next card
9. Progress bar + points update in real-time
10. After last card → Completion screen with stats
11. Can review again or go to `/play`

### 7.3 Play Flow (Detailed)

1. User lands on `/play` scenario selection
2. Sees difficulty badges, time estimates, point values
3. Selects a scenario (e.g., "The Traffic Stop")
4. **Step 1:** Narrator sets the scene (auto-advances after 2.5s)
5. **Step 2:** Authority figure speaks, 3 choice buttons appear
6. **Optional:** 15-second timer starts (red pulse when <5s)
7. User clicks a choice
8. **Feedback screen:** Shows ✅/❌, points gained/lost, explanation
9. User clicks "Continue →"
10. Repeat steps 5-9 until scenario ends
11. **Completion screen:** Shows grade, total score, badges unlocked
12. User can Replay or Back to Scenarios

---

## 8. Design Principles

### 8.1 Visual Identity
- **Aesthetic:** Protest art meets cyberpunk
- **Mood:** Rebellious, empowering, urgent
- **Palette:**
  - `--poder-midnight`: #0A0E27 (background)
  - `--poder-fire`: #EF4444 (primary actions)
  - `--poder-neon`: #22D3EE (secondary actions)
  - `--poder-gold`: #FBBF24 (rewards/achievements)
- **Texture:** Film grain overlay for "resistance" feel

### 8.2 UX Principles
1. **Mobile-First:** 80% of users on phones
2. **Micro-Interactions:** Every action feels responsive
3. **Instant Feedback:** No dead clicks, always show state
4. **Progressive Disclosure:** Expandable content, not overwhelming walls of text
5. **Gamification:** Points, badges, levels for retention

### 8.3 Content Principles
1. **Plain Language:** 8th-grade reading level max
2. **Actionable:** Always include "What to say" scripts
3. **Cited:** Every card links to authoritative source
4. **Respectful:** Acknowledge fear, empower without patronizing
5. **Current:** Date-stamped, version-controlled (planned)

---

## 9. Current State Analysis

### 9.1 What's Working ✅
- **Strong visual identity** — Unique, memorable aesthetic
- **Engaging interactions** — Swipe gestures, timed choices feel good
- **Quality content** — Real rights, real sources, actionable advice
- **Complete navigation** — All 4 pages functional with bottom nav
- **Gamification foundation** — Badges, levels, points established

### 9.2 What's Missing 🚨

#### Critical Gaps
1. **No data persistence** — Everything resets on refresh
2. **No authentication** — Single demo user for everyone
3. **No backend** — Hardcoded data, can't scale
4. **Translation missing** — Promised but not implemented
5. **No error handling** — App can break silently

#### Polish Gaps
6. **Limited content** — Only 14 cards, 3 scenarios
7. **No offline mode** — PWA incomplete (no service worker)
8. **No social features** — Can't share progress
9. **No analytics** — Don't know what users do
10. **Landing CTAs broken** — Don't link to specific content flows

---

## 10. Success Metrics (Proposed)

### Engagement Metrics
- **DAU/MAU ratio** — Target: >25% (sticky product)
- **Avg. cards learned per session** — Target: 5+
- **Scenario completion rate** — Target: >60%
- **Return rate (next day)** — Target: >30%

### Learning Metrics
- **Knowledge retention** (quiz after 1 week) — Target: >70%
- **Scenario score improvement** (2nd attempt vs 1st) — Target: +20%
- **Badge unlock rate** — Target: <30 days to first 5 badges

### Impact Metrics (Long-term)
- **User-reported rights assertions** — Qualitative surveys
- **Community reach** — Shares, referrals
- **Language diversity** — % non-English users (when translation launches)

---

## 11. Roadmap

### Phase 1: MVP Completion (Current → Week 1)
- [ ] Add localStorage for session persistence
- [ ] Fix landing page CTA routing
- [ ] Add loading/error states
- [ ] Deploy to Vercel
- [ ] Add 3 more scenarios (reach 6 total)

### Phase 2: Backend Integration (Week 2-3)
- [ ] Supabase setup (auth + database)
- [ ] User account creation flow
- [ ] Persistent progress tracking
- [ ] Real-time leaderboards

### Phase 3: Translation Layer (Week 4)
- [ ] Claude API integration for simplification
- [ ] Pre-translate content to Spanish, Mandarin, Arabic
- [ ] Language picker in profile
- [ ] RTL support for Arabic

### Phase 4: Content Expansion (Ongoing)
- [ ] Reach 50+ rights cards
- [ ] 10+ scenarios covering all categories
- [ ] Community submission portal
- [ ] Expert review process

### Phase 5: Social Features (Month 2-3)
- [ ] Shareable results ("I scored 95% on Traffic Stop!")
- [ ] Multiplayer scenarios (opposing roles)
- [ ] Leaderboards with privacy controls
- [ ] Badges for community contributions

### Phase 6: Archival Mission (Month 3+)
- [ ] Web scraper for .gov sites
- [ ] Version control for archived content
- [ ] Diff viewer when rights change
- [ ] Alert system for removed content

---

## 12. Risk Assessment

### Technical Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| Claude API costs scale faster than revenue | High | Cache translations, set usage limits |
| Supabase free tier exceeded | Medium | Monitor usage, upgrade plan proactively |
| Content becomes outdated | High | Automated scraping + quarterly reviews |
| PWA adoption low on iOS | Low | Focus on mobile web first |

### Legal Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| Providing "legal advice" without license | High | Disclaimer: "Educational only, not legal advice" |
| Copyright on archived government content | Low | Government works = public domain |
| User-generated content moderation | Medium | Manual review for community submissions |

### Product Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| Users don't find content trustworthy | High | Cite authoritative sources, show credentials |
| Gamification feels trivializing | Medium | Balance fun with gravity, testimonials |
| Translation accuracy issues | High | Human review for critical content |

---

## 13. Competitive Landscape

### Direct Competitors
- **ACLU Know Your Rights** (static PDFs, not gamified)
- **Immigrant Legal Resource Center** (dense text, English-only)
- **Flex Your Rights** (videos, not interactive)

### Adjacent Products
- **Duolingo** (gamified learning, but language not rights)
- **Brilliant** (interactive STEM, our model for engagement)
- **TikTok** (content format inspiration)

### Our Differentiators
1. **Only gamified rights education platform**
2. **Only product archiving disappearing content**
3. **Multi-language from day one** (when implemented)
4. **Mobile-first, Gen Z UX**
5. **Free and open-source**

---

## 14. Open Questions

1. **Monetization:** Donations only, or premium features (certifications, advanced scenarios)?
2. **Moderation:** How to handle community submissions without full-time staff?
3. **Partnerships:** Should we seek NGO partnerships (ACLU, ICIRR, etc.)?
4. **Certification:** Could we offer a "Rights Defender" certificate for completing all content?
5. **Localization:** Beyond translation, how to handle region-specific rights (CA vs TX)?

---

## 15. Contributing

**Current Team:** Solo founder + AI pair programming  
**Open Source:** MIT License  
**Contributions Welcome:**
- New scenario ideas
- Rights card content (with sources)
- Translation volunteers
- UX feedback
- Bug reports

---

## 16. Appendix

### A. Content Sources
- ACLU Know Your Rights: https://www.aclu.org/know-your-rights
- National Immigration Law Center: https://www.nilc.org
- HUD Tenant Rights: https://www.hud.gov/topics/rental_assistance/tenantrights
- Department of Labor: https://www.dol.gov
- National Labor Relations Board: https://www.nlrb.gov

### B. Design Assets
- **Fonts:** Google Fonts API (Bebas Neue, Bitter, JetBrains Mono)
- **Icons:** Emoji-first (accessible, no licensing)
- **Color Palette:** Custom CSS variables in `globals.css`

### C. Deployment
- **Production URL:** TBD (Vercel deployment pending)
- **Preview URL:** Generated per PR
- **Local Dev:** `npm run dev` → http://localhost:3000

---

**Document Version:** 1.0  
**Last Updated:** December 5, 2024  
**Maintained By:** Poder Team

---

_This is a living document. As the product evolves, this PRD should be updated to reflect current reality._
