import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/index.js';

const JOB_STATUSES = ['active', 'archived'];
const CANDIDATE_STAGES = ['applied', 'screen', 'tech', 'offer', 'hired', 'rejected'];
const TECH_TAGS = ['JavaScript', 'React', 'Node.js', 'Python', 'Java', 'PHP', 'Angular', 'Vue.js', 'TypeScript', 'Go'];
const WORKPLACE_TYPES = ['On-site', 'Remote', 'Hybrid'];
const JOB_TYPES = ['Full-Time', 'Internship', 'Contract'];

// Sample companies
const COMPANIES = [
  { name: 'TechCorp Inc.', description: 'Leading technology company', website: 'https://techcorp.com' },
  { name: 'Innovation Labs', description: 'AI and machine learning solutions', website: 'https://innovationlabs.com' },
  { name: 'Digital Solutions', description: 'Full-stack development agency', website: 'https://digitalsolutions.com' },
  { name: 'StartupX', description: 'Fast-growing fintech startup', website: 'https://startupx.com' },
  { name: 'Enterprise Systems', description: 'Enterprise software solutions', website: 'https://enterprisesystems.com' },
  { name: 'CloudTech', description: 'Cloud infrastructure services', website: 'https://cloudtech.com' },
  { name: 'DataFlow Inc.', description: 'Big data analytics platform', website: 'https://dataflow.com' },
  { name: 'CodeFactory', description: 'Software development consultancy', website: 'https://codefactory.com' },
];

// Generate a URL-friendly slug from a title
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
};

// Create seed data
export const createSeedData = () => {
  // Generate 25 jobs
  const jobs = Array.from({ length: 25 }, (_, index) => {
    const title = faker.person.jobTitle();
    const createdAt = faker.date.past({ years: 1 }).toISOString();
    const company = faker.helpers.arrayElement(COMPANIES);
    
    return {
      id: uuidv4(),
      title,
      slug: `${generateSlug(title)}-${index}`,
      description: faker.lorem.paragraphs(2),
      experienceRequired: faker.helpers.arrayElement(['Entry-level', 'Mid-level', 'Senior', 'Lead']),
      company: {
        name: company.name,
        description: company.description,
        avatarUrl: '', // We'll use the default icon
        website: company.website
      },
      industry: faker.helpers.arrayElement(['Technology', 'Finance', 'Healthcare', 'E-commerce', 'Education']),
      jobType: faker.helpers.arrayElement(JOB_TYPES),
      salary: {
        min: faker.number.int({ min: 4, max: 12 }) * 1000,
        max: faker.number.int({ min: 15, max: 25 }) * 1000,
        currency: '$',
        period: 'month'
      },
      status: faker.helpers.arrayElement(JOB_STATUSES),
      location: faker.location.city(),
      workplaceType: faker.helpers.arrayElement(WORKPLACE_TYPES),
      tags: faker.helpers.arrayElements(TECH_TAGS, { min: 2, max: 5 }),
      order: index,
      createdAt,
      updatedAt: createdAt
    };
  });

  // Generate 1000 candidates
  const candidates = Array.from({ length: 1000 }, () => {
    const createdAt = faker.date.past({ years: 1 }).toISOString();
    const jobId = faker.helpers.arrayElement(jobs).id;
    
    return {
      id: uuidv4(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      stage: faker.helpers.arrayElement(CANDIDATE_STAGES),
      jobId,
      createdAt,
      updatedAt: createdAt,
      notes: []
    };
  });

  // Generate timeline entries for candidates
  const candidateTimeline = [];
  candidates.forEach(candidate => {
    // Each candidate has 1-3 timeline entries
    const timelineCount = faker.number.int({ min: 1, max: 3 });
    
    for (let i = 0; i < timelineCount; i++) {
      candidateTimeline.push({
        id: uuidv4(),
        candidateId: candidate.id,
        action: i === 0 ? 'applied' : 'stage_change',
        fromStage: i === 0 ? null : faker.helpers.arrayElement(CANDIDATE_STAGES),
        toStage: i === 0 ? 'applied' : faker.helpers.arrayElement(CANDIDATE_STAGES),
        timestamp: faker.date.past({ years: 1 }).toISOString(),
        userId: uuidv4(),
        userName: faker.person.fullName()
      });
    }
  });

  // Generate assessment questions
  const createQuestions = () => {
    const questions = [
      {
        id: uuidv4(),
        type: 'single-choice',
        title: 'How many years of experience do you have with React?',
        description: 'Please select your experience level',
        required: true,
        options: ['0-1 years', '1-3 years', '3-5 years', '5+ years'],
        validation: {},
        conditionalLogic: {}
      },
      {
        id: uuidv4(),
        type: 'multi-choice',
        title: 'Which of the following technologies have you worked with?',
        description: 'Select all that apply',
        required: true,
        options: ['Redux', 'Context API', 'MobX', 'Zustand', 'Recoil'],
        validation: {},
        conditionalLogic: {}
      },
      {
        id: uuidv4(),
        type: 'short-text',
        title: 'What is your current role?',
        description: 'Please provide your current job title',
        required: true,
        options: [],
        validation: { maxLength: 100 },
        conditionalLogic: {}
      },
      {
        id: uuidv4(),
        type: 'long-text',
        title: 'Describe a challenging project you worked on',
        description: 'Please provide details about the project, your role, and the challenges faced',
        required: true,
        options: [],
        validation: { maxLength: 1000 },
        conditionalLogic: {}
      },
      {
        id: uuidv4(),
        type: 'numeric',
        title: 'Expected salary range (in thousands)',
        description: 'Please enter your expected annual salary',
        required: false,
        options: [],
        validation: { min: 0, max: 500 },
        conditionalLogic: {}
      },
      {
        id: uuidv4(),
        type: 'file-upload',
        title: 'Upload your resume',
        description: 'Please upload your latest resume (PDF format preferred)',
        required: true,
        options: [],
        validation: { allowedTypes: ['pdf', 'doc', 'docx'] },
        conditionalLogic: {}
      }
    ];

    // Add more questions to reach 10+
    for (let i = questions.length; i < 12; i++) {
      questions.push({
        id: uuidv4(),
        type: faker.helpers.arrayElement(['single-choice', 'short-text', 'long-text']),
        title: faker.lorem.sentence({ min: 5, max: 10 }),
        description: faker.lorem.sentence(),
        required: faker.datatype.boolean(),
        options: faker.helpers.arrayElement(['single-choice', 'multi-choice']) ? 
          Array.from({ length: 4 }, () => faker.lorem.words(2)) : [],
        validation: {},
        conditionalLogic: {}
      });
    }

    return questions;
  };

  // Generate 3 assessments with 10+ questions each
  const assessments = jobs.slice(0, 3).map(job => {
    const createdAt = faker.date.past({ years: 1 }).toISOString();
    
    return {
      id: uuidv4(),
      jobId: job.id,
      title: `${job.title} Assessment`,
      description: `Technical assessment for ${job.title} position`,
      sections: [
        {
          id: uuidv4(),
          title: 'Experience & Background',
          description: 'Questions about your professional experience',
          questions: createQuestions().slice(0, 6)
        },
        {
          id: uuidv4(),
          title: 'Technical Skills',
          description: 'Technical questions related to the role',
          questions: createQuestions().slice(6, 12)
        }
      ],
      createdAt,
      updatedAt: createdAt
    };
  });

  // Generate some users for @mentions
  const users = Array.from({ length: 10 }, () => ({
    id: uuidv4(),
    name: faker.person.fullName(),
    email: faker.internet.email()
  }));

  return {
    jobs,
    candidates,
    candidateTimeline,
    assessments,
    users,
    assessmentResponses: [] // Start with empty responses
  };
};

// Seed the database
export const seedDatabase = async () => {
  try {
    // Force reseed for new database schema
    console.log('Seeding database...');
    const seedData = createSeedData();

    // Clear existing data and add seed data
    await db.transaction('rw', db.jobs, db.candidates, db.candidateTimeline, db.assessments, db.users, async () => {
      await db.jobs.clear();
      await db.candidates.clear();
      await db.candidateTimeline.clear();
      await db.assessments.clear();
      await db.users.clear();
      
      // Only clear if the table exists
      try {
        await db.assessmentResponses.clear();
      } catch {
        // Table might not exist yet
      }

      await db.jobs.bulkAdd(seedData.jobs);
      await db.candidates.bulkAdd(seedData.candidates);
      await db.candidateTimeline.bulkAdd(seedData.candidateTimeline);
      await db.assessments.bulkAdd(seedData.assessments);
      await db.users.bulkAdd(seedData.users);
    });

    console.log('Database seeded successfully!');
    console.log(`Added ${seedData.jobs.length} jobs`);
    console.log(`Added ${seedData.candidates.length} candidates`);
    console.log(`Added ${seedData.candidateTimeline.length} timeline entries`);
    console.log(`Added ${seedData.assessments.length} assessments`);
    console.log(`Added ${seedData.users.length} users`);
  } catch (error) {
    console.error('Error seeding database:', error);
    
    // If it's a schema error, try to reset and reseed
    if (error.message?.includes('InvalidAccessError') || error.message?.includes('createIndex') || error.message?.includes('UpgradeError')) {
      console.log('Schema error detected, attempting database reset...');
      const { resetDatabase } = await import('../db/index.js');
      await resetDatabase();
      
      // Try seeding again after reset
      console.log('Attempting to seed after reset...');
      const seedData = createSeedData();
      
      await db.transaction('rw', db.jobs, db.candidates, db.candidateTimeline, db.assessments, db.users, async () => {
        await db.jobs.bulkAdd(seedData.jobs);
        await db.candidates.bulkAdd(seedData.candidates);
        await db.candidateTimeline.bulkAdd(seedData.candidateTimeline);
        await db.assessments.bulkAdd(seedData.assessments);
        await db.users.bulkAdd(seedData.users);
      });
      
      console.log('Database reset and seeded successfully!');
    } else {
      throw error;
    }
  }
};

// Force reseed the database (useful for development)
export const reseedDatabase = async () => {
  try {
    console.log('Reseeding database...');
    const seedData = createSeedData();

    // Clear existing data and add seed data
    await db.transaction('rw', db.jobs, db.candidates, db.candidateTimeline, db.assessments, db.users, async () => {
      await db.jobs.clear();
      await db.candidates.clear();
      await db.candidateTimeline.clear();
      await db.assessments.clear();
      await db.users.clear();
      await db.assessmentResponses.clear();

      await db.jobs.bulkAdd(seedData.jobs);
      await db.candidates.bulkAdd(seedData.candidates);
      await db.candidateTimeline.bulkAdd(seedData.candidateTimeline);
      await db.assessments.bulkAdd(seedData.assessments);
      await db.users.bulkAdd(seedData.users);
    });

    console.log('Database reseeded successfully!');
    console.log(`Added ${seedData.jobs.length} jobs`);
    console.log(`Added ${seedData.candidates.length} candidates`);
    console.log(`Added ${seedData.candidateTimeline.length} timeline entries`);
    console.log(`Added ${seedData.assessments.length} assessments`);
    console.log(`Added ${seedData.users.length} users`);
  } catch (error) {
    console.error('Error reseeding database:', error);
  }
};
