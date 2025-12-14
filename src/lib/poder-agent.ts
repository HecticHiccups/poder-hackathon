// Poder Voice Agent - Knowledge Base Query Utility
// Simple keyword-based matching for MVP

import enFAQ from '@/data/knowledge-base/en/immigration-faq.json';
import esFAQ from '@/data/knowledge-base/es/preguntas-inmigracion.json';

export type Language = 'en' | 'es';

export interface PoderAnswer {
    id: string;
    question: string;
    answer: string;
    voiceScript: string;
    audioUrl: string;
    relatedScenarios: string[];
    relatedCards: string[];
    category: string;
    confidence: number; // 0-1 score for match quality
}

/**
 * Find the best matching answer for a user's question
 * Uses simple keyword matching for MVP (no AI needed)
 */
export function findAnswer(
    userQuestion: string,
    language: Language = 'en'
): PoderAnswer | null {
    const kb = language === 'en' ? enFAQ : esFAQ;
    const normalized = userQuestion.toLowerCase().trim();

    let bestMatch: (typeof kb.questions[0] & { score: number }) | null = null;
    let highestScore = 0;

    // Score each question based on keyword matches
    for (const item of kb.questions) {
        let score = 0;

        // Check keyword matches
        for (const keyword of item.keywords) {
            if (normalized.includes(keyword.toLowerCase())) {
                score += 2; // Each keyword match = 2 points
            }
        }

        // Bonus: check if question text has overlap
        const questionWords = item.question.toLowerCase().split(' ');
        for (const word of questionWords) {
            if (word.length > 3 && normalized.includes(word)) {
                score += 0.5; // Small bonus for question word matches
            }
        }

        // Update best match if this is better
        if (score > highestScore) {
            highestScore = score;
            bestMatch = { ...item, score };
        }
    }

    // Require minimum score of 2 (at least 1 keyword match)
    if (!bestMatch || highestScore < 2) {
        return null;
    }

    // Convert to PoderAnswer format
    return {
        id: bestMatch.id,
        question: bestMatch.question,
        answer: bestMatch.answer,
        voiceScript: bestMatch.voiceScript,
        audioUrl: `/audio/${language}/${bestMatch.audioFile}`,
        relatedScenarios: bestMatch.relatedScenarios,
        relatedCards: bestMatch.relatedCards,
        category: bestMatch.category,
        confidence: Math.min(highestScore / 10, 1), // Normalize to 0-1
    };
}

/**
 * Get all available categories in the knowledge base
 */
export function getCategories(language: Language = 'en'): string[] {
    const kb = language === 'en' ? enFAQ : esFAQ;
    const categories = new Set(kb.questions.map(q => q.category));
    return Array.from(categories);
}

/**
 * Get questions by category
 */
export function getQuestionsByCategory(
    category: string,
    language: Language = 'en'
): PoderAnswer[] {
    const kb = language === 'en' ? enFAQ : esFAQ;

    return kb.questions
        .filter(q => q.category === category)
        .map(q => ({
            id: q.id,
            question: q.question,
            answer: q.answer,
            voiceScript: q.voiceScript,
            audioUrl: `/audio/${language}/${q.audioFile}`,
            relatedScenarios: q.relatedScenarios,
            relatedCards: q.relatedCards,
            category: q.category,
            confidence: 1, // Direct category query = certainty
        }));
}

/**
 * Get a random question (useful for "daily question" features)
 */
export function getRandomQuestion(language: Language = 'en'): PoderAnswer {
    const kb = language === 'en' ? enFAQ : esFAQ;
    const randomIndex = Math.floor(Math.random() * kb.questions.length);
    const q = kb.questions[randomIndex];

    return {
        id: q.id,
        question: q.question,
        answer: q.answer,
        voiceScript: q.voiceScript,
        audioUrl: `/audio/${language}/${q.audioFile}`,
        relatedScenarios: q.relatedScenarios,
        relatedCards: q.relatedCards,
        category: q.category,
        confidence: 1,
    };
}

/**
 * Search all questions (useful for autocomplete/suggestions)
 */
export function searchQuestions(
    searchTerm: string,
    language: Language = 'en',
    limit: number = 5
): PoderAnswer[] {
    const kb = language === 'en' ? enFAQ : esFAQ;
    const normalized = searchTerm.toLowerCase();

    // Score and sort all questions
    const scored = kb.questions
        .map(q => {
            let score = 0;

            // Check if question contains search term
            if (q.question.toLowerCase().includes(normalized)) {
                score += 5;
            }

            // Check keywords
            for (const keyword of q.keywords) {
                if (keyword.toLowerCase().includes(normalized)) {
                    score += 2;
                }
            }

            return { ...q, score };
        })
        .filter(q => q.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

    return scored.map(q => ({
        id: q.id,
        question: q.question,
        answer: q.answer,
        voiceScript: q.voiceScript,
        audioUrl: `/audio/${language}/${q.audioFile}`,
        relatedScenarios: q.relatedScenarios,
        relatedCards: q.relatedCards,
        category: q.category,
        confidence: Math.min(q.score / 10, 1),
    }));
}
