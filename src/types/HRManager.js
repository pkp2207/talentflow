// src/types/HRManager.js

/**
 * @typedef {Object} HRManager
 * @property {string} id - UUID
 * @property {string} name
 * @property {string} email - Used for login
 * @property {string} password - Hashed string
 * @property {'manager'} role - Explicitly defines the user type.
 * @property {string} avatarUrl
 * @property {number[]} assignedJobs - Array of job IDs this manager is responsible for.
 * @property {{phone: string, gender: string, city: string, dateOfBirth: string}} personalDetails
 * @property {Array<{company: string, role:string, duration: string, location: string}>} workExperience
 * @property {string} createdAt
 */
export {};