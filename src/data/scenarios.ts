// Game scenario data
// Interactive rights simulations with branching choices

export interface ScenarioChoice {
    id: string;
    text: string;
    isCorrect: boolean;
    feedback: string;
    pointsEarned: number;
}

export interface ScenarioStep {
    id: string;
    narrative: string;
    speaker: "narrator" | "authority" | "you" | "system";
    choices?: ScenarioChoice[];
    nextStepId?: string; // For auto-advance steps
    timerSeconds?: number; // Adds pressure
}

export interface GameScenario {
    id: string;
    title: string;
    description: string;
    category: string;
    difficulty: "beginner" | "intermediate" | "advanced";
    emoji: string;
    estimatedMinutes: number;
    steps: ScenarioStep[];
    totalPoints: number;
}

export const SCENARIOS: GameScenario[] = [
    {
        id: "traffic-stop-001",
        title: "The Traffic Stop",
        description: "You've been pulled over. The officer approaches your window. Do you know your rights?",
        category: "criminal",
        difficulty: "beginner",
        emoji: "🚔",
        estimatedMinutes: 3,
        totalPoints: 100,
        steps: [
            {
                id: "ts-1",
                narrative: "It's 9 PM. You're driving home from work when you see flashing lights in your rearview mirror. Your heart races as you pull over to the side of the road.",
                speaker: "narrator",
                nextStepId: "ts-2",
            },
            {
                id: "ts-2",
                narrative: "An officer approaches your window with a flashlight. \"License and registration, please.\"",
                speaker: "authority",
                choices: [
                    {
                        id: "ts-2-a",
                        text: "Immediately hand over documents without saying anything",
                        isCorrect: true,
                        feedback: "Good. You're required to show license, registration, and proof of insurance when asked.",
                        pointsEarned: 10,
                    },
                    {
                        id: "ts-2-b",
                        text: "Ask why you were pulled over before giving documents",
                        isCorrect: false,
                        feedback: "While you can ask, refusing to provide documents can escalate the situation. Provide them first, then ask.",
                        pointsEarned: 0,
                    },
                    {
                        id: "ts-2-c",
                        text: "Refuse to provide documents and ask for a supervisor",
                        isCorrect: false,
                        feedback: "You ARE required by law to provide license, registration, and insurance. Refusing can lead to arrest.",
                        pointsEarned: -10,
                    },
                ],
            },
            {
                id: "ts-3",
                narrative: "The officer looks at your documents, then says: \"I smell marijuana. Mind if I search your car?\"",
                speaker: "authority",
                timerSeconds: 15,
                choices: [
                    {
                        id: "ts-3-a",
                        text: "\"Sure, go ahead.\"",
                        isCorrect: false,
                        feedback: "By consenting, you waive your 4th Amendment rights. Even if you have nothing to hide, you should not consent to searches.",
                        pointsEarned: -10,
                    },
                    {
                        id: "ts-3-b",
                        text: "\"I do not consent to a search.\"",
                        isCorrect: true,
                        feedback: "Perfect! Clearly stating you don't consent preserves your rights. The officer may still search if they have probable cause, but your refusal is on record.",
                        pointsEarned: 30,
                    },
                    {
                        id: "ts-3-c",
                        text: "Stay silent and shrug",
                        isCorrect: false,
                        feedback: "Silence can be interpreted as consent. Always verbally state: \"I do not consent to a search.\"",
                        pointsEarned: 0,
                    },
                ],
            },
            {
                id: "ts-4",
                narrative: "\"Step out of the vehicle. I'm going to search it anyway.\"",
                speaker: "authority",
                choices: [
                    {
                        id: "ts-4-a",
                        text: "Refuse to exit and lock your doors",
                        isCorrect: false,
                        feedback: "Physically resisting is dangerous and illegal. You MUST comply with lawful orders to exit the vehicle.",
                        pointsEarned: -20,
                    },
                    {
                        id: "ts-4-b",
                        text: "Calmly exit while repeating: \"I do not consent to this search.\"",
                        isCorrect: true,
                        feedback: "Excellent. Comply physically but maintain verbal objection. This protects you legally without risking your safety.",
                        pointsEarned: 30,
                    },
                    {
                        id: "ts-4-c",
                        text: "Start recording on your phone while exiting",
                        isCorrect: true,
                        feedback: "Smart! You have the right to record police. Calmly state you're recording for your safety.",
                        pointsEarned: 20,
                    },
                ],
            },
            {
                id: "ts-5",
                narrative: "The officer searches your car and finds nothing illegal. \"Where were you coming from tonight?\"",
                speaker: "authority",
                timerSeconds: 10,
                choices: [
                    {
                        id: "ts-5-a",
                        text: "Answer honestly: \"I was at work.\"",
                        isCorrect: false,
                        feedback: "While this may seem harmless, you're not required to answer questions beyond identification. Anything you say can be used against you.",
                        pointsEarned: 0,
                    },
                    {
                        id: "ts-5-b",
                        text: "\"Am I being detained or am I free to go?\"",
                        isCorrect: true,
                        feedback: "Perfect question! This forces the officer to clarify your status. If you're not being detained, you can leave.",
                        pointsEarned: 30,
                    },
                    {
                        id: "ts-5-c",
                        text: "\"I'm exercising my right to remain silent.\"",
                        isCorrect: true,
                        feedback: "Good. The 5th Amendment protects you from self-incrimination. You do not have to answer questions.",
                        pointsEarned: 20,
                    },
                ],
            },
            {
                id: "ts-6",
                narrative: "\"You're free to go. Drive safe.\" The officer returns to their vehicle.",
                speaker: "authority",
                nextStepId: "ts-end",
            },
            {
                id: "ts-end",
                narrative: "You handled that well. Remember: Know your rights, stay calm, and document everything.",
                speaker: "system",
            },
        ],
    },
    {
        id: "ice-knock-001",
        title: "The Knock at the Door",
        description: "There's a knock at your door. Someone claims to be from immigration. What do you do?",
        category: "immigration",
        difficulty: "intermediate",
        emoji: "🚪",
        estimatedMinutes: 4,
        totalPoints: 120,
        steps: [
            {
                id: "ice-1",
                narrative: "It's early morning. You hear a loud knock at your door. Through the peephole, you see several people in uniforms.",
                speaker: "narrator",
                nextStepId: "ice-2",
            },
            {
                id: "ice-2",
                narrative: "\"Open up! This is ICE!\"",
                speaker: "authority",
                timerSeconds: 10,
                choices: [
                    {
                        id: "ice-2-a",
                        text: "Open the door immediately",
                        isCorrect: false,
                        feedback: "Never open the door! ICE cannot enter without a judicial warrant signed by a judge.",
                        pointsEarned: -20,
                    },
                    {
                        id: "ice-2-b",
                        text: "Ask them to slide any warrant under the door",
                        isCorrect: true,
                        feedback: "Correct! Without a judicial warrant (signed by a judge), you do NOT have to open the door.",
                        pointsEarned: 30,
                    },
                    {
                        id: "ice-2-c",
                        text: "Stay completely silent and hide",
                        isCorrect: false,
                        feedback: "While you don't have to open the door, engaging through the closed door to ask for a warrant is the recommended approach.",
                        pointsEarned: 10,
                    },
                ],
            },
            {
                id: "ice-3",
                narrative: "They slide a paper under the door. You see \"Administrative Warrant\" at the top with \"Department of Homeland Security\" letterhead.",
                speaker: "narrator",
                choices: [
                    {
                        id: "ice-3-a",
                        text: "This looks official - open the door",
                        isCorrect: false,
                        feedback: "An ADMINISTRATIVE warrant is NOT a judicial warrant! Look for a JUDGE's signature. Without it, do not open.",
                        pointsEarned: -20,
                    },
                    {
                        id: "ice-3-b",
                        text: "Look for a judge's signature - don't open without one",
                        isCorrect: true,
                        feedback: "Exactly right! A judicial warrant must be signed by a JUDGE, not an immigration officer. Administrative warrants (I-200) do NOT give them the right to enter.",
                        pointsEarned: 40,
                    },
                    {
                        id: "ice-3-c",
                        text: "Call 911",
                        isCorrect: false,
                        feedback: "Calling 911 may not help and could complicate things. Focus on determining if they have a valid judicial warrant.",
                        pointsEarned: 0,
                    },
                ],
            },
            {
                id: "ice-4",
                narrative: "Through the door: \"We just want to ask you some questions. Are you [Your Name]?\"",
                speaker: "authority",
                choices: [
                    {
                        id: "ice-4-a",
                        text: "Confirm your identity",
                        isCorrect: false,
                        feedback: "You are NOT required to confirm your identity to ICE through a closed door. Doing so may give them information to use against you.",
                        pointsEarned: -10,
                    },
                    {
                        id: "ice-4-b",
                        text: "\"I'm exercising my right to remain silent.\"",
                        isCorrect: true,
                        feedback: "Perfect. The 5th Amendment protects everyone, regardless of immigration status.",
                        pointsEarned: 30,
                    },
                    {
                        id: "ice-4-c",
                        text: "\"Please leave a contact card. I will have my attorney contact you.\"",
                        isCorrect: true,
                        feedback: "Excellent! This is a professional way to end the encounter while protecting your rights.",
                        pointsEarned: 30,
                    },
                ],
            },
            {
                id: "ice-5",
                narrative: "After 10 minutes, the officers leave. You see them drive away from the window.",
                speaker: "narrator",
                nextStepId: "ice-end",
            },
            {
                id: "ice-end",
                narrative: "You protected yourself and your rights. Remember: Never open the door without a judicial warrant. Contact an immigration attorney as soon as possible.",
                speaker: "system",
            },
        ],
    },
    {
        id: "landlord-001",
        title: "The Illegal Eviction",
        description: "You come home to find your locks changed and belongings on the curb. What are your rights?",
        category: "housing",
        difficulty: "intermediate",
        emoji: "🔐",
        estimatedMinutes: 3,
        totalPoints: 100,
        steps: [
            {
                id: "ll-1",
                narrative: "You return home after work to find your key doesn't work. Your belongings are in garbage bags on the sidewalk. Your landlord is standing on the porch.",
                speaker: "narrator",
                nextStepId: "ll-2",
            },
            {
                id: "ll-2",
                narrative: "\"You're out. Rent was late one too many times. I changed the locks.\"",
                speaker: "authority",
                choices: [
                    {
                        id: "ll-2-a",
                        text: "Accept it and start looking for a new place",
                        isCorrect: false,
                        feedback: "This is an ILLEGAL self-help eviction! Landlords cannot evict you without a court order, no matter the circumstances.",
                        pointsEarned: -20,
                    },
                    {
                        id: "ll-2-b",
                        text: "\"This is illegal. You must evict me through the courts.\"",
                        isCorrect: true,
                        feedback: "Correct! Self-help evictions (changing locks, removing belongings, shutting off utilities) are ILLEGAL in every state.",
                        pointsEarned: 30,
                    },
                    {
                        id: "ll-2-c",
                        text: "Threaten to call the police",
                        isCorrect: false,
                        feedback: "While you can call the police, they may treat this as a \"civil matter.\" Know your rights and assert them clearly first.",
                        pointsEarned: 10,
                    },
                ],
            },
            {
                id: "ll-3",
                narrative: "The landlord laughs. \"Good luck. I own this building.\"",
                speaker: "authority",
                choices: [
                    {
                        id: "ll-3-a",
                        text: "Call 911 and report an illegal lockout",
                        isCorrect: true,
                        feedback: "Good step! In many jurisdictions, police can order the landlord to let you back in. Document the call and get a report number.",
                        pointsEarned: 25,
                    },
                    {
                        id: "ll-3-b",
                        text: "Document everything with photos and videos",
                        isCorrect: true,
                        feedback: "Excellent! Documentation is crucial for any legal action. Photograph the changed locks, your belongings outside, and the landlord if possible.",
                        pointsEarned: 25,
                    },
                    {
                        id: "ll-3-c",
                        text: "Try to break back into the apartment",
                        isCorrect: false,
                        feedback: "Never attempt to force entry. This could result in you being arrested, even though the eviction is illegal.",
                        pointsEarned: -20,
                    },
                ],
            },
            {
                id: "ll-4",
                narrative: "You've documented everything and called the police. What's your next step?",
                speaker: "narrator",
                choices: [
                    {
                        id: "ll-4-a",
                        text: "Contact a tenant's rights organization or legal aid",
                        isCorrect: true,
                        feedback: "Perfect! Legal aid can help you file for emergency re-entry and sue for damages, including potential treble (3x) damages in many states.",
                        pointsEarned: 30,
                    },
                    {
                        id: "ll-4-b",
                        text: "Wait to see what the landlord does next",
                        isCorrect: false,
                        feedback: "Time is critical! The longer you wait, the harder it may be to recover your belongings and re-establish residency.",
                        pointsEarned: -10,
                    },
                    {
                        id: "ll-4-c",
                        text: "File a complaint with the housing authority",
                        isCorrect: true,
                        feedback: "Good! Housing authorities can investigate and fine landlords for illegal evictions. This creates an official record.",
                        pointsEarned: 20,
                    },
                ],
            },
            {
                id: "ll-end",
                narrative: "You took the right steps. Illegal evictions can result in your landlord owing YOU money—including damages, legal fees, and potentially your rent back. Never accept an illegal lockout.",
                speaker: "system",
            },
        ],
    },
];

// Get scenario by ID
export function getScenarioById(id: string): GameScenario | undefined {
    return SCENARIOS.find((s) => s.id === id);
}

// Get step by ID within a scenario
export function getStepById(scenario: GameScenario, stepId: string): ScenarioStep | undefined {
    return scenario.steps.find((s) => s.id === stepId);
}
