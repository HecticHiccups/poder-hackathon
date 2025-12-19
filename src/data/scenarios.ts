// Game scenario data
// Interactive rights simulations with branching choices
// Bilingual support: English (default) and Spanish

import type { Language } from "@/context/LanguageContext";

export interface ScenarioChoice {
    id: string;
    text: string;
    text_es: string;
    isCorrect: boolean;
    feedback: string;
    feedback_es: string;
    pointsEarned: number;
}

export interface ScenarioStep {
    id: string;
    narrative: string;
    narrative_es: string;
    speaker: "narrator" | "authority" | "you" | "system";
    choices?: ScenarioChoice[];
    nextStepId?: string; // For auto-advance steps
    timerSeconds?: number; // Adds pressure
}

export interface GameScenario {
    id: string;
    title: string;
    title_es: string;
    description: string;
    description_es: string;
    category: string;
    difficulty: "beginner" | "intermediate" | "advanced";
    emoji: string;
    estimatedMinutes: number;
    steps: ScenarioStep[];
    totalPoints: number;
}

// Helper to get localized scenario content
export function getLocalizedScenario(scenario: GameScenario, language: Language): {
    title: string;
    description: string;
} {
    return {
        title: language === 'es' ? scenario.title_es : scenario.title,
        description: language === 'es' ? scenario.description_es : scenario.description,
    };
}

// Helper to get localized step content
export function getLocalizedStep(step: ScenarioStep, language: Language): {
    narrative: string;
} {
    return {
        narrative: language === 'es' ? step.narrative_es : step.narrative,
    };
}

// Helper to get localized choice content
export function getLocalizedChoice(choice: ScenarioChoice, language: Language): {
    text: string;
    feedback: string;
} {
    return {
        text: language === 'es' ? choice.text_es : choice.text,
        feedback: language === 'es' ? choice.feedback_es : choice.feedback,
    };
}

export const SCENARIOS: GameScenario[] = [
    {
        id: "traffic-stop-001",
        title: "The Traffic Stop",
        title_es: "La Parada de Tráfico",
        description: "You've been pulled over. The officer approaches your window. Do you know your rights?",
        description_es: "Te han detenido. El oficial se acerca a tu ventana. ¿Conoces tus derechos?",
        category: "criminal",
        difficulty: "beginner",
        emoji: "🚔",
        estimatedMinutes: 3,
        totalPoints: 100,
        steps: [
            {
                id: "ts-1",
                narrative: "It's 9 PM. You're driving home from work when you see flashing lights in your rearview mirror. Your heart races as you pull over to the side of the road.",
                narrative_es: "Son las 9 PM. Estás manejando a casa del trabajo cuando ves luces parpadeantes en tu espejo retrovisor. Tu corazón se acelera mientras te orillas al lado del camino.",
                speaker: "narrator",
                nextStepId: "ts-2",
            },
            {
                id: "ts-2",
                narrative: "An officer approaches your window with a flashlight. \"License and registration, please.\"",
                narrative_es: "Un oficial se acerca a tu ventana con una linterna. \"Licencia y registro, por favor.\"",
                speaker: "authority",
                choices: [
                    {
                        id: "ts-2-a",
                        text: "Immediately hand over documents without saying anything",
                        text_es: "Entregar los documentos inmediatamente sin decir nada",
                        isCorrect: true,
                        feedback: "Good. You're required to show license, registration, and proof of insurance when asked.",
                        feedback_es: "Bien. Estás obligado a mostrar licencia, registro y prueba de seguro cuando te lo piden.",
                        pointsEarned: 10,
                    },
                    {
                        id: "ts-2-b",
                        text: "Ask why you were pulled over before giving documents",
                        text_es: "Preguntar por qué te detuvieron antes de dar los documentos",
                        isCorrect: false,
                        feedback: "While you can ask, refusing to provide documents can escalate the situation. Provide them first, then ask.",
                        feedback_es: "Aunque puedes preguntar, negarte a proporcionar documentos puede escalar la situación. Dálos primero, luego pregunta.",
                        pointsEarned: 0,
                    },
                    {
                        id: "ts-2-c",
                        text: "Refuse to provide documents and ask for a supervisor",
                        text_es: "Negarte a dar documentos y pedir un supervisor",
                        isCorrect: false,
                        feedback: "You ARE required by law to provide license, registration, and insurance. Refusing can lead to arrest.",
                        feedback_es: "ESTÁS obligado por ley a proporcionar licencia, registro y seguro. Negarte puede llevar al arresto.",
                        pointsEarned: -10,
                    },
                ],
            },
            {
                id: "ts-3",
                narrative: "The officer looks at your documents, then says: \"I smell marijuana. Mind if I search your car?\"",
                narrative_es: "El oficial mira tus documentos, luego dice: \"Huelo marihuana. ¿Te importa si registro tu carro?\"",
                speaker: "authority",
                timerSeconds: 15,
                choices: [
                    {
                        id: "ts-3-a",
                        text: "\"Sure, go ahead.\"",
                        text_es: "\"Claro, adelante.\"",
                        isCorrect: false,
                        feedback: "By consenting, you waive your 4th Amendment rights. Even if you have nothing to hide, you should not consent to searches.",
                        feedback_es: "Al consentir, renuncias a tus derechos de la 4ta Enmienda. Aunque no tengas nada que esconder, no debes consentir a registros.",
                        pointsEarned: -10,
                    },
                    {
                        id: "ts-3-b",
                        text: "\"I do not consent to a search.\"",
                        text_es: "\"No doy mi consentimiento para un registro.\"",
                        isCorrect: true,
                        feedback: "Perfect! Clearly stating you don't consent preserves your rights. The officer may still search if they have probable cause, but your refusal is on record.",
                        feedback_es: "¡Perfecto! Declarar claramente que no consientes preserva tus derechos. El oficial aún puede registrar si tiene causa probable, pero tu rechazo queda registrado.",
                        pointsEarned: 30,
                    },
                    {
                        id: "ts-3-c",
                        text: "Stay silent and shrug",
                        text_es: "Quedarte en silencio y encogerte de hombros",
                        isCorrect: false,
                        feedback: "Silence can be interpreted as consent. Always verbally state: \"I do not consent to a search.\"",
                        feedback_es: "El silencio puede interpretarse como consentimiento. Siempre declara verbalmente: \"No doy mi consentimiento para un registro.\"",
                        pointsEarned: 0,
                    },
                ],
            },
            {
                id: "ts-4",
                narrative: "\"Step out of the vehicle. I'm going to search it anyway.\"",
                narrative_es: "\"Sal del vehículo. Voy a registrarlo de todos modos.\"",
                speaker: "authority",
                choices: [
                    {
                        id: "ts-4-a",
                        text: "Refuse to exit and lock your doors",
                        text_es: "Negarte a salir y cerrar las puertas con seguro",
                        isCorrect: false,
                        feedback: "Physically resisting is dangerous and illegal. You MUST comply with lawful orders to exit the vehicle.",
                        feedback_es: "Resistir físicamente es peligroso e ilegal. DEBES cumplir con órdenes legales de salir del vehículo.",
                        pointsEarned: -20,
                    },
                    {
                        id: "ts-4-b",
                        text: "Calmly exit while repeating: \"I do not consent to this search.\"",
                        text_es: "Salir calmadamente mientras repites: \"No doy mi consentimiento para este registro.\"",
                        isCorrect: true,
                        feedback: "Excellent. Comply physically but maintain verbal objection. This protects you legally without risking your safety.",
                        feedback_es: "Excelente. Cumple físicamente pero mantén tu objeción verbal. Esto te protege legalmente sin arriesgar tu seguridad.",
                        pointsEarned: 30,
                    },
                    {
                        id: "ts-4-c",
                        text: "Start recording on your phone while exiting",
                        text_es: "Empezar a grabar con tu teléfono mientras sales",
                        isCorrect: true,
                        feedback: "Smart! You have the right to record police. Calmly state you're recording for your safety.",
                        feedback_es: "¡Inteligente! Tienes derecho a grabar a la policía. Di calmadamente que estás grabando por tu seguridad.",
                        pointsEarned: 20,
                    },
                ],
            },
            {
                id: "ts-5",
                narrative: "The officer searches your car and finds nothing illegal. \"Where were you coming from tonight?\"",
                narrative_es: "El oficial registra tu carro y no encuentra nada ilegal. \"¿De dónde vienes esta noche?\"",
                speaker: "authority",
                timerSeconds: 10,
                choices: [
                    {
                        id: "ts-5-a",
                        text: "Answer honestly: \"I was at work.\"",
                        text_es: "Responder honestamente: \"Estaba en el trabajo.\"",
                        isCorrect: false,
                        feedback: "While this may seem harmless, you're not required to answer questions beyond identification. Anything you say can be used against you.",
                        feedback_es: "Aunque esto puede parecer inofensivo, no estás obligado a responder preguntas más allá de la identificación. Cualquier cosa que digas puede ser usada en tu contra.",
                        pointsEarned: 0,
                    },
                    {
                        id: "ts-5-b",
                        text: "\"Am I being detained or am I free to go?\"",
                        text_es: "\"¿Estoy detenido o soy libre de irme?\"",
                        isCorrect: true,
                        feedback: "Perfect question! This forces the officer to clarify your status. If you're not being detained, you can leave.",
                        feedback_es: "¡Pregunta perfecta! Esto obliga al oficial a aclarar tu estatus. Si no estás detenido, puedes irte.",
                        pointsEarned: 30,
                    },
                    {
                        id: "ts-5-c",
                        text: "\"I'm exercising my right to remain silent.\"",
                        text_es: "\"Estoy ejerciendo mi derecho a guardar silencio.\"",
                        isCorrect: true,
                        feedback: "Good. The 5th Amendment protects you from self-incrimination. You do not have to answer questions.",
                        feedback_es: "Bien. La 5ta Enmienda te protege de la auto-incriminación. No tienes que responder preguntas.",
                        pointsEarned: 20,
                    },
                ],
            },
            {
                id: "ts-6",
                narrative: "\"You're free to go. Drive safe.\" The officer returns to their vehicle.",
                narrative_es: "\"Eres libre de irte. Maneja con cuidado.\" El oficial regresa a su vehículo.",
                speaker: "authority",
                nextStepId: "ts-end",
            },
            {
                id: "ts-end",
                narrative: "You handled that well. Remember: Know your rights, stay calm, and document everything.",
                narrative_es: "Lo manejaste bien. Recuerda: Conoce tus derechos, mantén la calma, y documenta todo.",
                speaker: "system",
            },
        ],
    },
    {
        id: "ice-knock-001",
        title: "The Knock at the Door",
        title_es: "El Toque a la Puerta",
        description: "There's a knock at your door. Someone claims to be from immigration. What do you do?",
        description_es: "Hay un toque en tu puerta. Alguien dice ser de inmigración. ¿Qué haces?",
        category: "immigration",
        difficulty: "intermediate",
        emoji: "🚪",
        estimatedMinutes: 4,
        totalPoints: 120,
        steps: [
            {
                id: "ice-1",
                narrative: "It's early morning. You hear a loud knock at your door. Through the peephole, you see several people in uniforms.",
                narrative_es: "Es temprano en la mañana. Escuchas un golpe fuerte en tu puerta. Por la mirilla, ves varias personas en uniforme.",
                speaker: "narrator",
                nextStepId: "ice-2",
            },
            {
                id: "ice-2",
                narrative: "\"Open up! This is ICE!\"",
                narrative_es: "\"¡Abra! ¡Esto es ICE!\"",
                speaker: "authority",
                timerSeconds: 10,
                choices: [
                    {
                        id: "ice-2-a",
                        text: "Open the door immediately",
                        text_es: "Abrir la puerta inmediatamente",
                        isCorrect: false,
                        feedback: "Never open the door! ICE cannot enter without a judicial warrant signed by a judge.",
                        feedback_es: "¡Nunca abras la puerta! ICE no puede entrar sin una orden judicial firmada por un juez.",
                        pointsEarned: -20,
                    },
                    {
                        id: "ice-2-b",
                        text: "Ask them to slide any warrant under the door",
                        text_es: "Pedirles que pasen cualquier orden por debajo de la puerta",
                        isCorrect: true,
                        feedback: "Correct! Without a judicial warrant (signed by a judge), you do NOT have to open the door.",
                        feedback_es: "¡Correcto! Sin una orden judicial (firmada por un juez), NO tienes que abrir la puerta.",
                        pointsEarned: 30,
                    },
                    {
                        id: "ice-2-c",
                        text: "Stay completely silent and hide",
                        text_es: "Quedarte completamente en silencio y esconderte",
                        isCorrect: false,
                        feedback: "While you don't have to open the door, engaging through the closed door to ask for a warrant is the recommended approach.",
                        feedback_es: "Aunque no tienes que abrir la puerta, comunicarte a través de la puerta cerrada para pedir una orden es el enfoque recomendado.",
                        pointsEarned: 10,
                    },
                ],
            },
            {
                id: "ice-3",
                narrative: "They slide a paper under the door. You see \"Administrative Warrant\" at the top with \"Department of Homeland Security\" letterhead.",
                narrative_es: "Pasan un papel por debajo de la puerta. Ves \"Administrative Warrant\" (Orden Administrativa) arriba con el membrete del \"Department of Homeland Security\".",
                speaker: "narrator",
                choices: [
                    {
                        id: "ice-3-a",
                        text: "This looks official - open the door",
                        text_es: "Esto parece oficial - abrir la puerta",
                        isCorrect: false,
                        feedback: "An ADMINISTRATIVE warrant is NOT a judicial warrant! Look for a JUDGE's signature. Without it, do not open.",
                        feedback_es: "¡Una orden ADMINISTRATIVA NO es una orden judicial! Busca la firma de un JUEZ. Sin ella, no abras.",
                        pointsEarned: -20,
                    },
                    {
                        id: "ice-3-b",
                        text: "Look for a judge's signature - don't open without one",
                        text_es: "Buscar la firma de un juez - no abrir sin una",
                        isCorrect: true,
                        feedback: "Exactly right! A judicial warrant must be signed by a JUDGE, not an immigration officer. Administrative warrants (I-200) do NOT give them the right to enter.",
                        feedback_es: "¡Exactamente! Una orden judicial debe estar firmada por un JUEZ, no un oficial de inmigración. Las órdenes administrativas (I-200) NO les dan derecho a entrar.",
                        pointsEarned: 40,
                    },
                    {
                        id: "ice-3-c",
                        text: "Call 911",
                        text_es: "Llamar al 911",
                        isCorrect: false,
                        feedback: "Calling 911 may not help and could complicate things. Focus on determining if they have a valid judicial warrant.",
                        feedback_es: "Llamar al 911 puede no ayudar y podría complicar las cosas. Concéntrate en determinar si tienen una orden judicial válida.",
                        pointsEarned: 0,
                    },
                ],
            },
            {
                id: "ice-4",
                narrative: "Through the door: \"We just want to ask you some questions. Are you [Your Name]?\"",
                narrative_es: "A través de la puerta: \"Solo queremos hacerle algunas preguntas. ¿Es usted [Su Nombre]?\"",
                speaker: "authority",
                choices: [
                    {
                        id: "ice-4-a",
                        text: "Confirm your identity",
                        text_es: "Confirmar tu identidad",
                        isCorrect: false,
                        feedback: "You are NOT required to confirm your identity to ICE through a closed door. Doing so may give them information to use against you.",
                        feedback_es: "NO estás obligado a confirmar tu identidad a ICE a través de una puerta cerrada. Hacerlo puede darles información para usar en tu contra.",
                        pointsEarned: -10,
                    },
                    {
                        id: "ice-4-b",
                        text: "\"I'm exercising my right to remain silent.\"",
                        text_es: "\"Estoy ejerciendo mi derecho a guardar silencio.\"",
                        isCorrect: true,
                        feedback: "Perfect. The 5th Amendment protects everyone, regardless of immigration status.",
                        feedback_es: "Perfecto. La 5ta Enmienda protege a todos, sin importar el estatus migratorio.",
                        pointsEarned: 30,
                    },
                    {
                        id: "ice-4-c",
                        text: "\"Please leave a contact card. I will have my attorney contact you.\"",
                        text_es: "\"Por favor deje una tarjeta de contacto. Mi abogado se comunicará con usted.\"",
                        isCorrect: true,
                        feedback: "Excellent! This is a professional way to end the encounter while protecting your rights.",
                        feedback_es: "¡Excelente! Esta es una forma profesional de terminar el encuentro mientras proteges tus derechos.",
                        pointsEarned: 30,
                    },
                ],
            },
            {
                id: "ice-5",
                narrative: "After 10 minutes, the officers leave. You see them drive away from the window.",
                narrative_es: "Después de 10 minutos, los oficiales se van. Los ves alejarse desde la ventana.",
                speaker: "narrator",
                nextStepId: "ice-end",
            },
            {
                id: "ice-end",
                narrative: "You protected yourself and your rights. Remember: Never open the door without a judicial warrant. Contact an immigration attorney as soon as possible.",
                narrative_es: "Te protegiste a ti mismo y a tus derechos. Recuerda: Nunca abras la puerta sin una orden judicial. Contacta a un abogado de inmigración lo antes posible.",
                speaker: "system",
            },
        ],
    },
    {
        id: "landlord-001",
        title: "The Illegal Eviction",
        title_es: "El Desalojo Ilegal",
        description: "You come home to find your locks changed and belongings on the curb. What are your rights?",
        description_es: "Llegas a casa y encuentras las cerraduras cambiadas y tus pertenencias en la acera. ¿Cuáles son tus derechos?",
        category: "housing",
        difficulty: "intermediate",
        emoji: "🔐",
        estimatedMinutes: 3,
        totalPoints: 100,
        steps: [
            {
                id: "ll-1",
                narrative: "You return home after work to find your key doesn't work. Your belongings are in garbage bags on the sidewalk. Your landlord is standing on the porch.",
                narrative_es: "Regresas a casa después del trabajo y descubres que tu llave no funciona. Tus pertenencias están en bolsas de basura en la acera. Tu arrendador está parado en el porche.",
                speaker: "narrator",
                nextStepId: "ll-2",
            },
            {
                id: "ll-2",
                narrative: "\"You're out. Rent was late one too many times. I changed the locks.\"",
                narrative_es: "\"Estás fuera. El alquiler se atrasó demasiadas veces. Cambié las cerraduras.\"",
                speaker: "authority",
                choices: [
                    {
                        id: "ll-2-a",
                        text: "Accept it and start looking for a new place",
                        text_es: "Aceptarlo y empezar a buscar un nuevo lugar",
                        isCorrect: false,
                        feedback: "This is an ILLEGAL self-help eviction! Landlords cannot evict you without a court order, no matter the circumstances.",
                        feedback_es: "¡Esto es un desalojo ilegal por cuenta propia! Los arrendadores no pueden desalojarte sin una orden judicial, sin importar las circunstancias.",
                        pointsEarned: -20,
                    },
                    {
                        id: "ll-2-b",
                        text: "\"This is illegal. You must evict me through the courts.\"",
                        text_es: "\"Esto es ilegal. Debe desalojarme a través de los tribunales.\"",
                        isCorrect: true,
                        feedback: "Correct! Self-help evictions (changing locks, removing belongings, shutting off utilities) are ILLEGAL in every state.",
                        feedback_es: "¡Correcto! Los desalojos por cuenta propia (cambiar cerraduras, sacar pertenencias, cortar servicios) son ILEGALES en todos los estados.",
                        pointsEarned: 30,
                    },
                    {
                        id: "ll-2-c",
                        text: "Threaten to call the police",
                        text_es: "Amenazar con llamar a la policía",
                        isCorrect: false,
                        feedback: "While you can call the police, they may treat this as a \"civil matter.\" Know your rights and assert them clearly first.",
                        feedback_es: "Aunque puedes llamar a la policía, pueden tratar esto como un \"asunto civil.\" Conoce tus derechos y hazlos valer claramente primero.",
                        pointsEarned: 10,
                    },
                ],
            },
            {
                id: "ll-3",
                narrative: "The landlord laughs. \"Good luck. I own this building.\"",
                narrative_es: "El arrendador se ríe. \"Buena suerte. Soy dueño de este edificio.\"",
                speaker: "authority",
                choices: [
                    {
                        id: "ll-3-a",
                        text: "Call 911 and report an illegal lockout",
                        text_es: "Llamar al 911 y reportar un bloqueo ilegal",
                        isCorrect: true,
                        feedback: "Good step! In many jurisdictions, police can order the landlord to let you back in. Document the call and get a report number.",
                        feedback_es: "¡Buen paso! En muchas jurisdicciones, la policía puede ordenar al arrendador que te deje entrar. Documenta la llamada y obtén un número de reporte.",
                        pointsEarned: 25,
                    },
                    {
                        id: "ll-3-b",
                        text: "Document everything with photos and videos",
                        text_es: "Documentar todo con fotos y videos",
                        isCorrect: true,
                        feedback: "Excellent! Documentation is crucial for any legal action. Photograph the changed locks, your belongings outside, and the landlord if possible.",
                        feedback_es: "¡Excelente! La documentación es crucial para cualquier acción legal. Fotografía las cerraduras cambiadas, tus pertenencias afuera, y al arrendador si es posible.",
                        pointsEarned: 25,
                    },
                    {
                        id: "ll-3-c",
                        text: "Try to break back into the apartment",
                        text_es: "Intentar entrar a la fuerza al apartamento",
                        isCorrect: false,
                        feedback: "Never attempt to force entry. This could result in you being arrested, even though the eviction is illegal.",
                        feedback_es: "Nunca intentes entrar a la fuerza. Esto podría resultar en tu arresto, aunque el desalojo sea ilegal.",
                        pointsEarned: -20,
                    },
                ],
            },
            {
                id: "ll-4",
                narrative: "You've documented everything and called the police. What's your next step?",
                narrative_es: "Has documentado todo y llamado a la policía. ¿Cuál es tu siguiente paso?",
                speaker: "narrator",
                choices: [
                    {
                        id: "ll-4-a",
                        text: "Contact a tenant's rights organization or legal aid",
                        text_es: "Contactar una organización de derechos de inquilinos o ayuda legal",
                        isCorrect: true,
                        feedback: "Perfect! Legal aid can help you file for emergency re-entry and sue for damages, including potential treble (3x) damages in many states.",
                        feedback_es: "¡Perfecto! La ayuda legal puede ayudarte a solicitar reingreso de emergencia y demandar por daños, incluyendo potenciales daños triples (3x) en muchos estados.",
                        pointsEarned: 30,
                    },
                    {
                        id: "ll-4-b",
                        text: "Wait to see what the landlord does next",
                        text_es: "Esperar a ver qué hace el arrendador",
                        isCorrect: false,
                        feedback: "Time is critical! The longer you wait, the harder it may be to recover your belongings and re-establish residency.",
                        feedback_es: "¡El tiempo es crítico! Mientras más esperes, más difícil puede ser recuperar tus pertenencias y restablecer la residencia.",
                        pointsEarned: -10,
                    },
                    {
                        id: "ll-4-c",
                        text: "File a complaint with the housing authority",
                        text_es: "Presentar una queja ante la autoridad de vivienda",
                        isCorrect: true,
                        feedback: "Good! Housing authorities can investigate and fine landlords for illegal evictions. This creates an official record.",
                        feedback_es: "¡Bien! Las autoridades de vivienda pueden investigar y multar a los arrendadores por desalojos ilegales. Esto crea un registro oficial.",
                        pointsEarned: 20,
                    },
                ],
            },
            {
                id: "ll-end",
                narrative: "You took the right steps. Illegal evictions can result in your landlord owing YOU money—including damages, legal fees, and potentially your rent back. Never accept an illegal lockout.",
                narrative_es: "Tomaste los pasos correctos. Los desalojos ilegales pueden resultar en que tu arrendador te deba dinero—incluyendo daños, honorarios legales, y potencialmente tu alquiler de vuelta. Nunca aceptes un bloqueo ilegal.",
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
