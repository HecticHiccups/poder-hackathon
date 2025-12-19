// Rights content data
// Each card represents a simplified, actionable right
// Bilingual support: English (default) and Spanish

import type { Language } from "@/context/LanguageContext";

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
    title_es: string;
    summary: string;
    summary_es: string;
    fullContent: string;
    fullContent_es: string;
    source: string;
    powerPoints: number;
    tags: string[];
}

// Helper to get localized content from a card
export function getLocalizedCard(card: RightsCard, language: Language): {
    title: string;
    summary: string;
    fullContent: string;
} {
    return {
        title: language === 'es' ? card.title_es : card.title,
        summary: language === 'es' ? card.summary_es : card.summary,
        fullContent: language === 'es' ? card.fullContent_es : card.fullContent,
    };
}

export const CATEGORY_INFO: Record<RightsCategory, { label: string; label_es: string; emoji: string; color: string }> = {
    immigration: { label: "Immigration", label_es: "Inmigración", emoji: "🛂", color: "var(--poder-neon)" },
    housing: { label: "Housing", label_es: "Vivienda", emoji: "🏠", color: "var(--poder-gold)" },
    labor: { label: "Labor", label_es: "Trabajo", emoji: "⚒️", color: "var(--poder-fire)" },
    criminal: { label: "Criminal Justice", label_es: "Justicia Penal", emoji: "⚖️", color: "var(--poder-neon)" },
    healthcare: { label: "Healthcare", label_es: "Salud", emoji: "🏥", color: "var(--poder-gold)" },
};

// Helper to get localized category label
export function getCategoryLabel(category: RightsCategory, language: Language): string {
    const info = CATEGORY_INFO[category];
    return language === 'es' ? info.label_es : info.label;
}

export const RIGHTS_CARDS: RightsCard[] = [
    // === IMMIGRATION ===
    {
        id: "imm-001",
        category: "immigration",
        title: "You Have the Right to Remain Silent",
        title_es: "Tienes Derecho a Guardar Silencio",
        summary: "You do NOT have to answer questions about your immigration status—even from ICE agents.",
        summary_es: "NO tienes que responder preguntas sobre tu estatus migratorio—ni siquiera a agentes de ICE.",
        fullContent: `Under the Fifth Amendment, you have the right to remain silent. You are not required to answer questions about where you were born, whether you are a U.S. citizen, or how you entered the country.

**What to say:** "I am exercising my right to remain silent."

**Important:** This applies everywhere—at home, on the street, at work, or at a checkpoint.`,
        fullContent_es: `Bajo la Quinta Enmienda, tienes derecho a guardar silencio. No estás obligado a responder preguntas sobre dónde naciste, si eres ciudadano estadounidense, o cómo entraste al país.

**Qué decir:** "Estoy ejerciendo mi derecho a guardar silencio."

**Importante:** Esto aplica en todas partes—en casa, en la calle, en el trabajo, o en un punto de control.`,
        source: "ACLU Know Your Rights",
        powerPoints: 15,
        tags: ["fifth-amendment", "silence", "ice"],
    },
    {
        id: "imm-002",
        category: "immigration",
        title: "You Can Refuse to Open Your Door",
        title_es: "Puedes Negarte a Abrir Tu Puerta",
        summary: "ICE cannot enter your home without a judicial warrant signed by a judge.",
        summary_es: "ICE no puede entrar a tu casa sin una orden judicial firmada por un juez.",
        fullContent: `Immigration officers (ICE) cannot enter your home without a warrant signed by a judge. An administrative warrant (Form I-200) is NOT enough.

**What to do:**
1. Ask them to slide the warrant under the door
2. Look for a judge's signature
3. If it's not signed by a judge, you do NOT have to open the door

**Say:** "I do not consent to your entry. Please slide any warrant under the door."`,
        fullContent_es: `Los oficiales de inmigración (ICE) no pueden entrar a tu casa sin una orden firmada por un juez. Una orden administrativa (Formulario I-200) NO es suficiente.

**Qué hacer:**
1. Pídeles que pasen la orden por debajo de la puerta
2. Busca la firma de un juez
3. Si no está firmada por un juez, NO tienes que abrir la puerta

**Di:** "No doy mi consentimiento para que entren. Por favor pasen cualquier orden por debajo de la puerta."`,
        source: "National Immigration Law Center",
        powerPoints: 20,
        tags: ["warrant", "home", "ice"],
    },
    {
        id: "imm-003",
        category: "immigration",
        title: "You Have the Right to a Lawyer",
        title_es: "Tienes Derecho a un Abogado",
        summary: "If detained, you can ask for an attorney before answering any questions.",
        summary_es: "Si te detienen, puedes pedir un abogado antes de responder cualquier pregunta.",
        fullContent: `You have the right to speak with a lawyer before answering questions. This is true even if you are undocumented.

**What to say:** "I want to speak with my lawyer."

**Pro tip:** Memorize your lawyer's number or keep it written somewhere accessible. You may not have access to your phone.`,
        fullContent_es: `Tienes derecho a hablar con un abogado antes de responder preguntas. Esto es verdad incluso si eres indocumentado.

**Qué decir:** "Quiero hablar con mi abogado."

**Consejo:** Memoriza el número de tu abogado o tenlo escrito en un lugar accesible. Puede que no tengas acceso a tu teléfono.`,
        source: "Immigrant Legal Resource Center",
        powerPoints: 15,
        tags: ["lawyer", "attorney", "detention"],
    },

    // === HOUSING ===
    {
        id: "hous-001",
        category: "housing",
        title: "Your Landlord Cannot Change Locks Illegally",
        title_es: "Tu Arrendador No Puede Cambiar las Cerraduras Ilegalmente",
        summary: "Self-help evictions are ILLEGAL. You must be evicted through court process.",
        summary_es: "Los desalojos por cuenta propia son ILEGALES. Deben desalojarte a través del proceso judicial.",
        fullContent: `In most states, landlords CANNOT:
- Change your locks
- Remove your belongings
- Shut off utilities
- Physically remove you

This is called a "self-help eviction" and it's illegal. Only a sheriff can execute a court-ordered eviction.

**If this happens:** Call the police, document everything, and contact a tenant's rights organization.`,
        fullContent_es: `En la mayoría de los estados, los arrendadores NO PUEDEN:
- Cambiar tus cerraduras
- Sacar tus pertenencias
- Cortar los servicios públicos
- Sacarte físicamente

Esto se llama "desalojo por cuenta propia" y es ilegal. Solo un alguacil puede ejecutar un desalojo ordenado por la corte.

**Si esto sucede:** Llama a la policía, documenta todo, y contacta una organización de derechos de inquilinos.`,
        source: "HUD Tenant Rights",
        powerPoints: 20,
        tags: ["eviction", "locks", "illegal"],
    },
    {
        id: "hous-002",
        category: "housing",
        title: "You Can Withhold Rent for Major Repairs",
        title_es: "Puedes Retener el Alquiler por Reparaciones Mayores",
        summary: "In many states, you can legally withhold rent if your landlord refuses to fix serious issues.",
        summary_es: "En muchos estados, puedes legalmente retener el alquiler si tu arrendador se niega a arreglar problemas serios.",
        fullContent: `If your rental has serious habitability issues (no heat, water leaks, mold, pests), you may have the right to:

1. **Repair and Deduct:** Pay for repairs yourself and deduct from rent
2. **Withhold Rent:** Stop paying until repairs are made
3. **Report to Housing Authority:** File a complaint

**Important:** Always document everything in writing first. Send a dated letter requesting repairs.`,
        fullContent_es: `Si tu alquiler tiene problemas serios de habitabilidad (sin calefacción, fugas de agua, moho, plagas), puedes tener derecho a:

1. **Reparar y Deducir:** Pagar las reparaciones tú mismo y deducirlas del alquiler
2. **Retener el Alquiler:** Dejar de pagar hasta que se hagan las reparaciones
3. **Reportar a la Autoridad de Vivienda:** Presentar una queja

**Importante:** Siempre documenta todo por escrito primero. Envía una carta fechada solicitando reparaciones.`,
        source: "National Housing Law Project",
        powerPoints: 25,
        tags: ["repairs", "rent", "habitability"],
    },
    {
        id: "hous-003",
        category: "housing",
        title: "Retaliation is Illegal",
        title_es: "La Represalia es Ilegal",
        summary: "Your landlord cannot evict you, raise rent, or harass you for asserting your rights.",
        summary_es: "Tu arrendador no puede desalojarte, subir el alquiler, o acosarte por hacer valer tus derechos.",
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
        fullContent_es: `Si tú:
- Te quejaste de reparaciones
- Reportaste violaciones de código
- Te organizaste con otros inquilinos
- Ejerciste cualquier derecho legal

Tu arrendador NO PUEDE tomar represalias:
- Iniciando procedimientos de desalojo
- Subiendo tu alquiler
- Reduciendo servicios
- Acosándote

**Documenta todo.** La represalia es una defensa en la corte de desalojos.`,
        source: "Tenant Rights Coalition",
        powerPoints: 20,
        tags: ["retaliation", "eviction", "organizing"],
    },

    // === LABOR ===
    {
        id: "lab-001",
        category: "labor",
        title: "You Must Be Paid for All Hours Worked",
        title_es: "Deben Pagarte por Todas las Horas Trabajadas",
        summary: "Working 'off the clock' is illegal. Your employer must pay you for every hour.",
        summary_es: "Trabajar 'fuera del reloj' es ilegal. Tu empleador debe pagarte por cada hora.",
        fullContent: `Employers MUST pay you for:
- Time spent preparing for work
- Mandatory meetings
- Training
- Waiting time (if required to stay on-site)
- Overtime (1.5x after 40 hours in most states)

**If you're not being paid:** File a wage claim with your state's labor department. You can recover back wages + penalties.`,
        fullContent_es: `Los empleadores DEBEN pagarte por:
- Tiempo preparándote para el trabajo
- Reuniones obligatorias
- Capacitación
- Tiempo de espera (si te requieren quedarte en el sitio)
- Horas extras (1.5x después de 40 horas en la mayoría de los estados)

**Si no te pagan:** Presenta una reclamación de salarios con el departamento de trabajo de tu estado. Puedes recuperar salarios atrasados + multas.`,
        source: "Department of Labor",
        powerPoints: 15,
        tags: ["wages", "overtime", "off-the-clock"],
    },
    {
        id: "lab-002",
        category: "labor",
        title: "You Cannot Be Fired for Reporting Safety Issues",
        title_es: "No Pueden Despedirte por Reportar Problemas de Seguridad",
        summary: "Whistleblower protections cover workers who report unsafe conditions.",
        summary_es: "Las protecciones para denunciantes cubren a trabajadores que reportan condiciones inseguras.",
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
        fullContent_es: `Si reportas:
- Condiciones de trabajo inseguras
- Violaciones de OSHA
- Actividad ilegal

Estás protegido de represalias. Tu empleador no puede:
- Despedirte
- Degradarte
- Reducir tus horas
- Acosarte

**Cómo reportar:** Presenta con OSHA en línea o llama al 1-800-321-OSHA. Puedes reportar anónimamente.`,
        source: "OSHA Whistleblower Program",
        powerPoints: 25,
        tags: ["whistleblower", "safety", "osha"],
    },
    {
        id: "lab-003",
        category: "labor",
        title: "You Have the Right to Organize",
        title_es: "Tienes Derecho a Organizarte",
        summary: "Discussing wages and forming unions is protected by federal law.",
        summary_es: "Discutir salarios y formar sindicatos está protegido por la ley federal.",
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
        fullContent_es: `La Ley Nacional de Relaciones Laborales protege tu derecho a:
- Discutir salarios con compañeros de trabajo
- Formar o unirte a un sindicato
- Participar en acción colectiva
- Distribuir materiales sindicales (en descansos, en áreas fuera del trabajo)

**Tu empleador NO PUEDE:**
- Amenazarte por actividad sindical
- Interrogarte sobre organización
- Prometer beneficios para detener la organización
- Despedir a simpatizantes del sindicato

**Recuerda:** Puedes hablar sobre tu pago. Es la ley.`,
        source: "National Labor Relations Board",
        powerPoints: 20,
        tags: ["union", "wages", "organizing"],
    },

    // === CRIMINAL JUSTICE ===
    {
        id: "crim-001",
        category: "criminal",
        title: "You Can Record Police in Public",
        title_es: "Puedes Grabar a la Policía en Público",
        summary: "In all 50 states, you have the right to record police performing their duties in public.",
        summary_es: "En los 50 estados, tienes derecho a grabar a la policía realizando sus funciones en público.",
        fullContent: `You can record police if:
- You are in a public place
- You are not interfering with their duties

**Important:**
- Keep a safe distance
- Don't physically obstruct officers
- You can livestream (in case your phone is seized)
- If asked to stop, calmly state: "I am exercising my First Amendment right to record."

**Pro tip:** Use an app that automatically uploads to the cloud.`,
        fullContent_es: `Puedes grabar a la policía si:
- Estás en un lugar público
- No estás interfiriendo con sus funciones

**Importante:**
- Mantén una distancia segura
- No obstruyas físicamente a los oficiales
- Puedes transmitir en vivo (en caso de que confisquen tu teléfono)
- Si te piden que pares, di calmadamente: "Estoy ejerciendo mi derecho de la Primera Enmienda a grabar."

**Consejo:** Usa una aplicación que suba automáticamente a la nube.`,
        source: "ACLU",
        powerPoints: 15,
        tags: ["recording", "police", "first-amendment"],
    },
    {
        id: "crim-002",
        category: "criminal",
        title: "You Can Refuse a Search of Your Car",
        title_es: "Puedes Rechazar un Registro de Tu Carro",
        summary: "Without a warrant or probable cause, you can refuse consent to search your vehicle.",
        summary_es: "Sin una orden o causa probable, puedes rechazar el consentimiento para registrar tu vehículo.",
        fullContent: `If a police officer asks to search your car:
1. You can say: "I do not consent to a search."

**However:** They can still search if they have:
- Probable cause (they see/smell something)
- A warrant
- You are arrested

**What to do:** Clearly state your refusal. Do not physically resist. If they search anyway, stay calm—your lawyer can challenge it in court.`,
        fullContent_es: `Si un oficial de policía pide registrar tu carro:
1. Puedes decir: "No doy mi consentimiento para un registro."

**Sin embargo:** Todavía pueden registrar si tienen:
- Causa probable (ven/huelen algo)
- Una orden judicial
- Estás arrestado

**Qué hacer:** Declara claramente tu rechazo. No resistas físicamente. Si registran de todos modos, mantén la calma—tu abogado puede impugnarlo en la corte.`,
        source: "ACLU Know Your Rights",
        powerPoints: 20,
        tags: ["search", "car", "consent"],
    },
    {
        id: "crim-003",
        category: "criminal",
        title: "You Have the Right to Know Why You're Detained",
        title_es: "Tienes Derecho a Saber Por Qué Te Detienen",
        summary: "If stopped by police, you can ask: 'Am I being detained or am I free to go?'",
        summary_es: "Si te para la policía, puedes preguntar: '¿Estoy detenido o soy libre de irme?'",
        fullContent: `There's a difference between a "stop" and an "arrest."

**If stopped, ask:**
"Am I being detained, or am I free to go?"

If they say you're free to go—leave calmly.

If you're being detained, you have the right to know why. Ask:
"What is the reason for this detention?"

**Remember:** Being detained doesn't mean you have to answer questions. You can still remain silent.`,
        fullContent_es: `Hay una diferencia entre una "parada" y un "arresto."

**Si te paran, pregunta:**
"¿Estoy detenido, o soy libre de irme?"

Si dicen que eres libre de irte—vete calmadamente.

Si estás detenido, tienes derecho a saber por qué. Pregunta:
"¿Cuál es la razón de esta detención?"

**Recuerda:** Estar detenido no significa que tengas que responder preguntas. Todavía puedes guardar silencio.`,
        source: "Flex Your Rights",
        powerPoints: 15,
        tags: ["detention", "stop", "police"],
    },

    // === HEALTHCARE ===
    {
        id: "health-001",
        category: "healthcare",
        title: "Emergency Rooms Cannot Turn You Away",
        title_es: "Las Salas de Emergencia No Pueden Rechazarte",
        summary: "Under EMTALA, hospitals must treat you regardless of your ability to pay or immigration status.",
        summary_es: "Bajo EMTALA, los hospitales deben tratarte sin importar tu capacidad de pago o estatus migratorio.",
        fullContent: `The Emergency Medical Treatment and Labor Act (EMTALA) requires hospitals to:
- Screen everyone who comes to the ER
- Stabilize emergency conditions
- Not ask about immigration status or insurance before treatment

**This applies to:**
- Everyone, including undocumented immigrants
- Anyone, regardless of ability to pay

**If turned away:** File a complaint with the HHS Office of Civil Rights.`,
        fullContent_es: `La Ley de Tratamiento Médico de Emergencia y Trabajo (EMTALA) requiere que los hospitales:
- Examinen a todos los que llegan a la sala de emergencias
- Estabilicen condiciones de emergencia
- No pregunten sobre estatus migratorio o seguro antes del tratamiento

**Esto aplica a:**
- Todos, incluyendo inmigrantes indocumentados
- Cualquiera, sin importar su capacidad de pago

**Si te rechazan:** Presenta una queja con la Oficina de Derechos Civiles del HHS.`,
        source: "CMS EMTALA",
        powerPoints: 20,
        tags: ["emergency", "hospital", "emtala"],
    },
    {
        id: "health-002",
        category: "healthcare",
        title: "You Have the Right to Your Medical Records",
        title_es: "Tienes Derecho a Tus Registros Médicos",
        summary: "Under HIPAA, you can request a copy of your complete medical records.",
        summary_es: "Bajo HIPAA, puedes solicitar una copia de tus registros médicos completos.",
        fullContent: `You have the right to:
- Access your full medical records
- Get copies (paper or electronic)
- Request corrections to errors

**How to request:**
1. Submit a written request to the provider
2. They have 30 days to respond
3. They can charge a reasonable fee for copies

**They cannot deny you access** except in very limited circumstances (e.g., psychiatric notes in some cases).`,
        fullContent_es: `Tienes derecho a:
- Acceder a tus registros médicos completos
- Obtener copias (en papel o electrónicas)
- Solicitar correcciones de errores

**Cómo solicitar:**
1. Envía una solicitud escrita al proveedor
2. Tienen 30 días para responder
3. Pueden cobrar una tarifa razonable por las copias

**No pueden negarte el acceso** excepto en circunstancias muy limitadas (ej., notas psiquiátricas en algunos casos).`,
        source: "HHS HIPAA",
        powerPoints: 10,
        tags: ["records", "hipaa", "access"],
    },
];
