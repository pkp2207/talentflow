// src/db/db.test.js

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { db } from './index.js'; // Correctly import the db instance from the same folder
import { faker } from '@faker-js/faker';

// Mock the faker module to ensure consistent test data
vi.mock('@faker-js/faker', () => ({
  faker: {
    string: {
      uuid: () => 'test-uuid-12345',
    },
    person: {
      jobTitle: () => 'Test Job Title',
    },
    helpers: {
      slugify: () => 'test-job-title',
      arrayElement: () => 'active',
      arrayElements: () => ['React'],
    },
    number: {
      int: () => 1,
    },
    lorem: {
      paragraph: () => 'Test description.',
    },
    company: {
      name: () => 'Test Co.',
    },
  }
}));


describe('Dexie Jobs Table', () => {

  // This runs before each test in this suite
  beforeEach(async () => {
    // Vitest provides a clean database for each test file,
    // but clearing the table ensures tests are independent.
    await db.jobs.clear();
  });

  it('should create a new job successfully', async () => {
    const newJob = {
      id: faker.string.uuid(),
      title: faker.person.jobTitle(),
      slug: faker.helpers.slugify(),
      status: faker.helpers.arrayElement(),
      tags: faker.helpers.arrayElements(),
      order: faker.number.int(),
      description: faker.lorem.paragraph(),
      company: { name: faker.company.name() },
    };

    // Act: Add the job to the database
    const createdId = await db.jobs.add(newJob);

    // Assert: Check if the job was added
    const allJobs = await db.jobs.toArray();
    
    expect(createdId).toBe('test-uuid-12345');
    expect(allJobs).toHaveLength(1);
    expect(allJobs[0].title).toBe('Test Job Title');
  });

  it('should not allow two jobs with the same primary key (id)', async () => {
    const job1 = { id: 'unique-id-1', title: 'Job 1' };
    const job2 = { id: 'unique-id-1', title: 'Job 2' };

    // Act: Add the first job
    await db.jobs.add(job1);

    // Assert: Expect the second add operation to fail
    // Dexie will throw an error if you try to add a duplicate primary key.
    // We use expect().rejects to test for this error.
    await expect(db.jobs.add(job2)).rejects.toThrow();
  });
});