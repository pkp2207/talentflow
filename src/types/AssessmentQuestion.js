/**
 * @typedef {Object} AssessmentQuestion
 * @property {string} id - UUID
 * @property {'single-choice'|'multi-choice'|'short-text'|'long-text'|'numeric'|'file-upload'} type
 * @property {string} title
 * @property {string} description - Optional instructions for the question.
 * @property {Array<{id: string, text: string}>} options - For choice-based questions.
 * @property {boolean} required
 * @property {{min?: number, max?: number, minLength?: number, maxLength?: number}} validation
 * @property {{showIfQuestionId: string, isAnswer: any}} conditionalLogic - e.g., show this question only if Q1's answer is "Yes".
 */
export {};