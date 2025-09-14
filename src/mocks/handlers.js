import { http, HttpResponse } from 'msw';
import { db } from '../db/index.js';
import { v4 as uuidv4 } from 'uuid';

// Helper function to add artificial latency and error rate
const withLatencyAndErrors = async (handler, errorRate = 0.1) => {
  // Add artificial latency (200-1200ms)
  const latency = Math.random() * 1000 + 200;
  await new Promise(resolve => setTimeout(resolve, latency));
  
  // Random error rate (5-10% on write operations)
  if (Math.random() < errorRate) {
    return HttpResponse.json(
      { error: 'Internal Server Error', message: 'Something went wrong' },
      { status: 500 }
    );
  }
  
  return handler();
};

export const handlers = [
  // Test endpoint to verify MSW is working
  http.get('/api/test', () => {
    return HttpResponse.json({ message: 'MSW is working' });
  }),

  // Jobs endpoints
  http.get('/api/jobs', async ({ request }) => {
    return withLatencyAndErrors(async () => {
      const url = new URL(request.url);
      const search = url.searchParams.get('search') || '';
      const status = url.searchParams.get('status') || '';
      const page = parseInt(url.searchParams.get('page') || '1');
      const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
      const sort = url.searchParams.get('sort') || 'order';

      let query = db.jobs.orderBy(sort);
      
      if (status) {
        query = query.filter(job => job.status === status);
      }
      
      if (search) {
        query = query.filter(job => 
          job.title.toLowerCase().includes(search.toLowerCase()) ||
          job.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
        );
      }

      const jobs = await query.toArray();
      const total = jobs.length;
      const startIndex = (page - 1) * pageSize;
      const paginatedJobs = jobs.slice(startIndex, startIndex + pageSize);

      return HttpResponse.json({
        data: paginatedJobs,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize)
        }
      });
    });
  }),

  http.get('/api/jobs/:id', async ({ params }) => {
    return withLatencyAndErrors(async () => {
      const { id } = params;
      const job = await db.jobs.get(id);
      
      if (!job) {
        return HttpResponse.json({ error: 'Job not found' }, { status: 404 });
      }

      return HttpResponse.json(job);
    });
  }),

  http.post('/api/jobs', async ({ request }) => {
    return withLatencyAndErrors(async () => {
      const jobData = await request.json();
      const newJob = {
        id: uuidv4(),
        ...jobData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await db.jobs.add(newJob);
      return HttpResponse.json(newJob, { status: 201 });
    }, 0.08);
  }),

  http.patch('/api/jobs/:id', async ({ params, request }) => {
    return withLatencyAndErrors(async () => {
      const { id } = params;
      const updates = await request.json();
      
      await db.jobs.update(id, {
        ...updates,
        updatedAt: new Date().toISOString()
      });

      const updatedJob = await db.jobs.get(id);
      return HttpResponse.json(updatedJob);
    }, 0.08);
  }),

  http.patch('/api/jobs/:id/reorder', async ({ params, request }) => {
    return withLatencyAndErrors(async () => {
      const { id } = params;
      const { toOrder } = await request.json();
      
      // Simulate reordering logic
      const job = await db.jobs.get(id);
      if (!job) {
        return HttpResponse.json({ error: 'Job not found' }, { status: 404 });
      }

      await db.jobs.update(id, { order: toOrder });
      
      // Update other jobs' orders as needed
      const allJobs = await db.jobs.orderBy('order').toArray();
      const updates = [];
      
      allJobs.forEach((j, index) => {
        if (j.id !== id) {
          updates.push(db.jobs.update(j.id, { order: index }));
        }
      });
      
      await Promise.all(updates);
      
      return HttpResponse.json({ success: true });
    }, 0.15); // Higher error rate for reorder to test rollback
  }),

  // Candidates endpoints
  http.get('/api/candidates', async ({ request }) => {
    return withLatencyAndErrors(async () => {
      const url = new URL(request.url);
      const search = url.searchParams.get('search') || '';
      const stage = url.searchParams.get('stage') || '';
      const page = parseInt(url.searchParams.get('page') || '1');
      const pageSize = parseInt(url.searchParams.get('pageSize') || '50');

      let query = db.candidates.orderBy('createdAt').reverse();
      
      if (stage) {
        query = query.filter(candidate => candidate.stage === stage);
      }
      
      if (search) {
        query = query.filter(candidate => 
          candidate.name.toLowerCase().includes(search.toLowerCase()) ||
          candidate.email.toLowerCase().includes(search.toLowerCase())
        );
      }

      const candidates = await query.toArray();
      const total = candidates.length;
      const startIndex = (page - 1) * pageSize;
      const paginatedCandidates = candidates.slice(startIndex, startIndex + pageSize);

      return HttpResponse.json({
        data: paginatedCandidates,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize)
        }
      });
    });
  }),

  http.post('/api/candidates', async ({ request }) => {
    return withLatencyAndErrors(async () => {
      const candidateData = await request.json();
      const newCandidate = {
        id: uuidv4(),
        ...candidateData,
        stage: 'applied',
        notes: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await db.candidates.add(newCandidate);
      
      // Add timeline entry
      await db.candidateTimeline.add({
        id: uuidv4(),
        candidateId: newCandidate.id,
        action: 'applied',
        fromStage: null,
        toStage: 'applied',
        timestamp: new Date().toISOString(),
        userId: 'system',
        userName: 'System'
      });

      return HttpResponse.json(newCandidate, { status: 201 });
    }, 0.08);
  }),

  http.patch('/api/candidates/:id', async ({ params, request }) => {
    return withLatencyAndErrors(async () => {
      const { id } = params;
      const updates = await request.json();
      
      const candidate = await db.candidates.get(id);
      if (!candidate) {
        return HttpResponse.json({ error: 'Candidate not found' }, { status: 404 });
      }

      // If stage is changing, add timeline entry
      if (updates.stage && updates.stage !== candidate.stage) {
        await db.candidateTimeline.add({
          id: uuidv4(),
          candidateId: id,
          action: 'stage_change',
          fromStage: candidate.stage,
          toStage: updates.stage,
          timestamp: new Date().toISOString(),
          userId: 'current-user',
          userName: 'Current User'
        });
      }

      await db.candidates.update(id, {
        ...updates,
        updatedAt: new Date().toISOString()
      });

      const updatedCandidate = await db.candidates.get(id);
      return HttpResponse.json(updatedCandidate);
    }, 0.08);
  }),

  http.get('/api/candidates/:id/timeline', async ({ params }) => {
    return withLatencyAndErrors(async () => {
      const { id } = params;
      const timeline = await db.candidateTimeline
        .where('candidateId')
        .equals(id)
        .orderBy('timestamp')
        .toArray();

      return HttpResponse.json(timeline);
    });
  }),

  http.post('/api/candidates/counts-by-job', async ({ request }) => {
    return withLatencyAndErrors(async () => {
      const { jobIds } = await request.json();
      const counts = {};
      
      for (const jobId of jobIds) {
        const count = await db.candidates
          .where('jobId')
          .equals(jobId)
          .count();
        counts[jobId] = count;
      }

      return HttpResponse.json(counts);
    });
  }),

  // Assessments endpoints
  http.get('/api/assessments/:jobId', async ({ params }) => {
    return withLatencyAndErrors(async () => {
      const { jobId } = params;
      const assessment = await db.assessments
        .where('jobId')
        .equals(jobId)
        .first();

      if (!assessment) {
        return HttpResponse.json(null, { status: 404 });
      }

      return HttpResponse.json(assessment);
    });
  }),

  http.put('/api/assessments/:jobId', async ({ params, request }) => {
    return withLatencyAndErrors(async () => {
      const { jobId } = params;
      const assessmentData = await request.json();
      
      const existingAssessment = await db.assessments
        .where('jobId')
        .equals(jobId)
        .first();

      if (existingAssessment) {
        await db.assessments.update(existingAssessment.id, {
          ...assessmentData,
          updatedAt: new Date().toISOString()
        });
        const updated = await db.assessments.get(existingAssessment.id);
        return HttpResponse.json(updated);
      } else {
        const newAssessment = {
          id: uuidv4(),
          jobId,
          ...assessmentData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        await db.assessments.add(newAssessment);
        return HttpResponse.json(newAssessment, { status: 201 });
      }
    }, 0.08);
  }),

  http.post('/api/assessments/:jobId/submit', async ({ params, request }) => {
    return withLatencyAndErrors(async () => {
      const { jobId } = params;
      const { candidateId, responses } = await request.json();
      
      const assessment = await db.assessments
        .where('jobId')
        .equals(jobId)
        .first();

      if (!assessment) {
        return HttpResponse.json({ error: 'Assessment not found' }, { status: 404 });
      }

      const response = {
        id: uuidv4(),
        assessmentId: assessment.id,
        candidateId,
        responses,
        submittedAt: new Date().toISOString()
      };

      await db.assessmentResponses.add(response);
      return HttpResponse.json(response, { status: 201 });
    }, 0.08);
  }),

  // Users endpoint for @mentions
  http.get('/api/users', async () => {
    return withLatencyAndErrors(async () => {
      const users = await db.users.toArray();
      return HttpResponse.json(users);
    });
  })
];
