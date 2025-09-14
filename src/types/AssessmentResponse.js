// src/types/AssessmentResponse.js

/**
 * @typedef {'not-started' | 'in-progress' | 'completed' | 'reviewed'} AssessmentStatus
 */

/**
 * @typedef {object} Answer
 * @property {string | string[] | number} answer
 */

/**
 * @typedef {Object.<string, Answer>} ResponseMap
 */

/**
 * @typedef {Object} AssessmentResponse
 * @property {string} id - UUID
 * @property {string} assessmentId - The ID of the specific assessment taken.
 * @property {string} candidateId - The ID of the candidate who took the assessment.
 * @property {AssessmentStatus} status - The current status of this submission.
 * @property {string} startedAt - ISO date string of when the assessment was started.
 * @property {string} submittedAt - ISO date string of when the assessment was completed.
 * @property {ResponseMap} responses - The collection of answers provided by the candidate.
 */
export {};