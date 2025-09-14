// src/db/index.js

import Dexie from 'dexie';

// 1. Create and export the database instance directly.
export const db = new Dexie('TalentFlowDB_v2');

// 2. Define the schema on the instance.
db.version(1).stores({
  jobs: `id, title, slug, status, order, *tags`,
  candidates: `id, name, email, stage, jobId, createdAt`,
  hrManagers: `id, email`,
  assessments: `id, jobId`,
  assessmentResponses: `id, [assessmentId+candidateId], candidateId`,
  candidateTimeline: `++id, candidateId, timestamp`,
  users: `id, name, email`
});

// Helper function to reset the database
export const resetDatabase = async () => {
  try {
    await db.delete();
    console.log('Database deleted successfully');
    // Also try to delete the old database
    try {
      const oldDb = new Dexie('TalentFlowDB');
      await oldDb.delete();
      console.log('Old database deleted successfully');
    } catch {
      // Ignore errors for old database
    }
    // Recreate the database
    await db.open();
    console.log('Database recreated with new schema');
  } catch (error) {
    console.error('Error resetting database:', error);
    throw error;
  }
};

// 3. Attach hooks to the instance.
db.hrManagers.hook('creating', (primKey, obj, trans) => {
  return db.hrManagers.where('email').equals(obj.email).first().then(found => {
    if (found) {
      trans.abort();
      throw new Dexie.ModifyError('An HR Manager with this email already exists.');
    }
  });
});

db.assessmentResponses.hook('creating', (primKey, obj, trans) => {
  return db.assessmentResponses
    .where('[assessmentId+candidateId]')
    .equals([obj.assessmentId, obj.candidateId])
    .first()
    .then(found => {
      if (found) {
        trans.abort();
        throw new Dexie.ModifyError('A response for this candidate and assessment already exists.');
      }
    });
});