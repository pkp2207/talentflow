// src/types/Job.js

/**
 * @typedef {'active' | 'archived'} JobStatus
 */

/**
 * @typedef {'On-site' | 'Remote' | 'Hybrid'} WorkplaceType
 */

/**
 * @typedef {'Full-Time' | 'Internship' | 'Contract'} JobType
 */

/**
 * @typedef {object} Job
 * @property {string} id - UUID
 * @property {string} title
 * @property {string} slug - URL-friendly unique identifier
 * @property {string} description
 * @property {string} experienceRequired
 * @property {{name: string, description: string, avatarUrl: string, website: string}} company
 * @property {string} industry
 * @property {JobType} jobType
 * @property {{min: number, max: number, currency: string, period: string}} salary
 * @property {JobStatus} status
 * @property {string} location
 * @property {WorkplaceType} workplaceType
 * @property {string[]} tags - For required skills and other metadata.
 * @property {number} order - The display order in the list.
 * @property {string} createdAt - ISO date string.
 * @property {string} updatedAt - ISO date string.
 */
export {};