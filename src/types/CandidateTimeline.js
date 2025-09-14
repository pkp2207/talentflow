/**
 * @typedef {'Stage Change' | 'Note Added' | 'Applied' | 'Assessment Submitted' | 'Hired' | 'Rejected'} ActionType
 */

/**
 * @typedef {Object} CandidateTimelineEvent
 * @property {string} id - UUID for the event.
 * @property {string} candidateId - The ID of the candidate this event relates to.
 * @property {string} jobId - The ID of the job this event is associated with.
 * @property {ActionType} actionType - The type of event that occurred.
 * @property {Object} details - An object containing data specific to the action (e.g., fromStage, toStage).
 * @property {string} actorId - The ID of the HR Manager who performed the action.
 * @property {string} actorName - The name of the HR Manager.
 * @property {string} timestamp - ISO date string of when the event occurred.
 */
export {};