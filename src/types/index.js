// Type definitions as JSDoc comments for better IDE support

/**
 * @typedef {Object} Job
 * @property {string} id
 * @property {string} title
 * @property {string} slug
 * @property {string} description
 * @property {'active'|'archived'} status
 * @property {string[]} tags
 * @property {number} order
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} Candidate
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} phone
 * @property {'applied'|'screen'|'tech'|'offer'|'hired'|'rejected'} stage
 * @property {string} jobId
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {CandidateNote[]} notes
 */

/**
 * @typedef {Object} CandidateNote
 * @property {string} id
 * @property {string} content
 * @property {string} authorId
 * @property {string} authorName
 * @property {string} createdAt
 */

/**
 * @typedef {Object} CandidateTimeline
 * @property {string} id
 * @property {string} candidateId
 * @property {string} action
 * @property {string} fromStage
 * @property {string} toStage
 * @property {string} timestamp
 * @property {string} userId
 * @property {string} userName
 */

/**
 * @typedef {Object} Assessment
 * @property {string} id
 * @property {string} jobId
 * @property {string} title
 * @property {string} description
 * @property {AssessmentSection[]} sections
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} AssessmentSection
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {AssessmentQuestion[]} questions
 */

/**
 * @typedef {Object} AssessmentQuestion
 * @property {string} id
 * @property {'single-choice'|'multi-choice'|'short-text'|'long-text'|'numeric'|'file-upload'} type
 * @property {string} title
 * @property {string} description
 * @property {boolean} required
 * @property {Object} validation
 * @property {string[]} options - For choice questions
 * @property {Object} conditionalLogic
 */

/**
 * @typedef {Object} AssessmentResponse
 * @property {string} id
 * @property {string} assessmentId
 * @property {string} candidateId
 * @property {Object} responses - Question ID to answer mapping
 * @property {string} submittedAt
 */

export {};
