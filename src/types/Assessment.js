/**
 * @typedef {import('./AssessmentSection.js').AssessmentSection} AssessmentSection
 */

/**
 * @typedef {Object} Assessment
 * @property {string} id - UUID (Primary Key)
 * @property {string} jobId - Foreign key linking to a Job.
 * @property {string} title
 * @property {string} assessmentType
 * @property {number} durationMinutes
 * @property {number} order - The order of the assessment in the sequence.
 * @property {AssessmentSection[]} sections
 * @property {string} createdAt
 * @property {string} updatedAt
 */
export {};