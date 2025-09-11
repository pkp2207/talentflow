import Dexie from 'dexie';

export class TalentFlowDB extends Dexie {
  constructor() {
    super('TalentFlowDB');
    
    this.version(1).stores({
      jobs: '&id, title, slug, status, order, createdAt',
      candidates: '&id, name, email, stage, jobId, createdAt',
      candidateTimeline: '&id, candidateId, timestamp',
      assessments: '&id, jobId, createdAt',
      assessmentResponses: '&id, assessmentId, candidateId, submittedAt',
      users: '&id, name, email' // For @mentions
    });

    // Define table types
    this.jobs = this.table('jobs');
    this.candidates = this.table('candidates');
    this.candidateTimeline = this.table('candidateTimeline');
    this.assessments = this.table('assessments');
    this.assessmentResponses = this.table('assessmentResponses');
    this.users = this.table('users');
  }
}

export const db = new TalentFlowDB();
