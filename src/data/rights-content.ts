// Rights content data
// Each card represents a simplified, actionable right

export type RightsCategory =
    | "immigration"
    | "housing"
    | "labor"
    | "criminal"
    | "healthcare";

export interface RightsCard {
    id: string;
    category: RightsCategory;
    title: string;
    summary: string;
    fullContent: string;
    source: string;
    powerPoints: number;
    tags: string[];
}

export const CATEGORY_INFO: Record<RightsCategory, { label: string; emoji: string; color: string }> = {
    immigration: { label: "Immigration", emoji: "🛂", color: "var(--poder-neon)" },
    housing: { label: "Housing", emoji: "🏠", color: "var(--poder-gold)" },
    labor: { label: "Labor", emoji: "⚒️", color: "var(--poder-fire)" },
    criminal: { label: "Criminal Justice", emoji: "⚖️", color: "var(--poder-neon)" },
    healthcare: { label: "Healthcare", emoji: "🏥", color: "var(--poder-gold)" },
};

export const RIGHTS_CARDS: RightsCard[] = [
    // === IMMIGRATION ===
    {
        id: "imm-001",
        category: "immigration",
        title: "You Have the Right to Remain Silent",
        summary: "You do NOT have to answer questions about your immigration status—even from ICE agents.",
        fullContent: `Under the Fifth Amendment, you have the right to remain silent. You are not required to answer questions about where you were born, whether you are a U.S. citizen, or how you entered the country.

**What to say:** "I am exercising my right to remain silent."

**Important:** This applies everywhere—at home, on the street, at work, or at a checkpoint.`,
        source: "ACLU Know Your Rights",
        powerPoints: 15,
        tags: ["fifth-amendment", "silence", "ice"],
    },
    {
        id: "imm-002",
        category: "immigration",
        title: "You Can Refuse to Open Your Door",
        summary: "ICE cannot enter your home without a judicial warrant signed by a judge.",
        fullContent: `Immigration officers (ICE) cannot enter your home without a warrant signed by a judge. An administrative warrant (Form I-200) is NOT enough.

**What to do:**
1. Ask them to slide the warrant under the door
2. Look for a judge's signature
3. If it's not signed by a judge, you do NOT have to open the door

**Say:** "I do not consent to your entry. Please slide any warrant under the door."`,
        source: "National Immigration Law Center",
        powerPoints: 20,
        tags: ["warrant", "home", "ice"],
    },
    {
        id: "imm-003",
        category: "immigration",
        title: "You Have the Right to a Lawyer",
        summary: "If detained, you can ask for an attorney before answering any questions.",
        fullContent: `You have the right to speak with a lawyer before answering questions. This is true even if you are undocumented.

**What to say:** "I want to speak with my lawyer."

**Pro tip:** Memorize your lawyer's number or keep it written somewhere accessible. You may not have access to your phone.`,
        source: "Immigrant Legal Resource Center",
        powerPoints: 15,
        tags: ["lawyer", "attorney", "detention"],
    },

    // === HOUSING ===
    {
        id: "hous-001",
        category: "housing",
        title: "Your Landlord Cannot Change Locks Illegally",
        summary: "Self-help evictions are ILLEGAL. You must be evicted through court process.",
        fullContent: `In most states, landlords CANNOT:
- Change your locks
- Remove your belongings
- Shut off utilities
- Physically remove you

This is called a "self-help eviction" and it's illegal. Only a sheriff can execute a court-ordered eviction.

**If this happens:** Call the police, document everything, and contact a tenant's rights organization.`,
        source: "HUD Tenant Rights",
        powerPoints: 20,
        tags: ["eviction", "locks", "illegal"],
    },
    {
        id: "hous-002",
        category: "housing",
        title: "You Can Withhold Rent for Major Repairs",
        summary: "In many states, you can legally withhold rent if your landlord refuses to fix serious issues.",
        fullContent: `If your rental has serious habitability issues (no heat, water leaks, mold, pests), you may have the right to:

1. **Repair and Deduct:** Pay for repairs yourself and deduct from rent
2. **Withhold Rent:** Stop paying until repairs are made
3. **Report to Housing Authority:** File a complaint

**Important:** Always document everything in writing first. Send a dated letter requesting repairs.`,
        source: "National Housing Law Project",
        powerPoints: 25,
        tags: ["repairs", "rent", "habitability"],
    },
    {
        id: "hous-003",
        category: "housing",
        title: "Retaliation is Illegal",
        summary: "Your landlord cannot evict you, raise rent, or harass you for asserting your rights.",
        fullContent: `If you:
- Complained about repairs
- Reported code violations
- Organized with other tenants
- Exercised any legal right

Your landlord CANNOT retaliate by:
- Starting eviction proceedings
- Raising your rent
- Reducing services
- Harassing you

**Document everything.** Retaliation is a defense in eviction court.`,
        source: "Tenant Rights Coalition",
        powerPoints: 20,
        tags: ["retaliation", "eviction", "organizing"],
    },

    // === LABOR ===
    {
        id: "lab-001",
        category: "labor",
        title: "You Must Be Paid for All Hours Worked",
        summary: "Working 'off the clock' is illegal. Your employer must pay you for every hour.",
        fullContent: `Employers MUST pay you for:
- Time spent preparing for work
- Mandatory meetings
- Training
- Waiting time (if required to stay on-site)
- Overtime (1.5x after 40 hours in most states)

**If you're not being paid:** File a wage claim with your state's labor department. You can recover back wages + penalties.`,
        source: "Department of Labor",
        powerPoints: 15,
        tags: ["wages", "overtime", "off-the-clock"],
    },
    {
        id: "lab-002",
        category: "labor",
        title: "You Cannot Be Fired for Reporting Safety Issues",
        summary: "Whistleblower protections cover workers who report unsafe conditions.",
        fullContent: `If you report:
- Unsafe working conditions
- OSHA violations
- Illegal activity

You are protected from retaliation. Your employer cannot:
- Fire you
- Demote you
- Cut your hours
- Harass you

**How to report:** File with OSHA online or call 1-800-321-OSHA. You can report anonymously.`,
        source: "OSHA Whistleblower Program",
        powerPoints: 25,
        tags: ["whistleblower", "safety", "osha"],
    },
    {
        id: "lab-003",
        category: "labor",
        title: "You Have the Right to Organize",
        summary: "Discussing wages and forming unions is protected by federal law.",
        fullContent: `The National Labor Relations Act protects your right to:
- Discuss wages with coworkers
- Form or join a union
- Engage in collective action
- Distribute union materials (on breaks, in non-work areas)

**Your employer CANNOT:**
- Threaten you for union activity
- Interrogate you about organizing
- Promise benefits to stop organizing
- Fire union supporters

**Remember:** You can talk about pay. It's the law.`,
        source: "National Labor Relations Board",
        powerPoints: 20,
        tags: ["union", "wages", "organizing"],
    },

    // === CRIMINAL JUSTICE ===
    {
        id: "crim-001",
        category: "criminal",
        title: "You Can Record Police in Public",
        summary: "In all 50 states, you have the right to record police performing their duties in public.",
        fullContent: `You can record police if:
- You are in a public place
- You are not interfering with their duties

**Important:**
- Keep a safe distance
- Don't physically obstruct officers
- You can livestream (in case your phone is seized)
- If asked to stop, calmly state: "I am exercising my First Amendment right to record."

**Pro tip:** Use an app that automatically uploads to the cloud.`,
        source: "ACLU",
        powerPoints: 15,
        tags: ["recording", "police", "first-amendment"],
    },
    {
        id: "crim-002",
        category: "criminal",
        title: "You Can Refuse a Search of Your Car",
        summary: "Without a warrant or probable cause, you can refuse consent to search your vehicle.",
        fullContent: `If a police officer asks to search your car:
1. You can say: "I do not consent to a search."

**However:** They can still search if they have:
- Probable cause (they see/smell something)
- A warrant
- You are arrested

**What to do:** Clearly state your refusal. Do not physically resist. If they search anyway, stay calm—your lawyer can challenge it in court.`,
        source: "ACLU Know Your Rights",
        powerPoints: 20,
        tags: ["search", "car", "consent"],
    },
    {
        id: "crim-003",
        category: "criminal",
        title: "You Have the Right to Know Why You're Detained",
        summary: "If stopped by police, you can ask: 'Am I being detained or am I free to go?'",
        fullContent: `There's a difference between a "stop" and an "arrest."

**If stopped, ask:**
"Am I being detained, or am I free to go?"

If they say you're free to go—leave calmly.

If you're being detained, you have the right to know why. Ask:
"What is the reason for this detention?"

**Remember:** Being detained doesn't mean you have to answer questions. You can still remain silent.`,
        source: "Flex Your Rights",
        powerPoints: 15,
        tags: ["detention", "stop", "police"],
    },

    // === HEALTHCARE ===
    {
        id: "health-001",
        category: "healthcare",
        title: "Emergency Rooms Cannot Turn You Away",
        summary: "Under EMTALA, hospitals must treat you regardless of your ability to pay or immigration status.",
        fullContent: `The Emergency Medical Treatment and Labor Act (EMTALA) requires hospitals to:
- Screen everyone who comes to the ER
- Stabilize emergency conditions
- Not ask about immigration status or insurance before treatment

**This applies to:**
- Everyone, including undocumented immigrants
- Anyone, regardless of ability to pay

**If turned away:** File a complaint with the HHS Office of Civil Rights.`,
        source: "CMS EMTALA",
        powerPoints: 20,
        tags: ["emergency", "hospital", "emtala"],
    },
    {
        id: "health-002",
        category: "healthcare",
        title: "You Have the Right to Your Medical Records",
        summary: "Under HIPAA, you can request a copy of your complete medical records.",
        fullContent: `You have the right to:
- Access your full medical records
- Get copies (paper or electronic)
- Request corrections to errors

**How to request:**
1. Submit a written request to the provider
2. They have 30 days to respond
3. They can charge a reasonable fee for copies

**They cannot deny you access** except in very limited circumstances (e.g., psychiatric notes in some cases).`,
        source: "HHS HIPAA",
        powerPoints: 10,
        tags: ["records", "hipaa", "access"],
    },
];
