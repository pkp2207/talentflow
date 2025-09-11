// API service functions for TalentFlow

const API_BASE = '/api';

// Generic fetch wrapper with error handling
const fetchAPI = async (url, options = {}) => {
  try {
    const response = await fetch(`${API_BASE}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error for ${url}:`, error);
    throw error;
  }
};

// Jobs API
export const jobsAPI = {
  getJobs: (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, value.toString());
      }
    });
    return fetchAPI(`/jobs?${searchParams}`);
  },

  getJob: (id) => fetchAPI(`/jobs/${id}`),

  createJob: (jobData) => 
    fetchAPI('/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    }),

  updateJob: (id, updates) =>
    fetchAPI(`/jobs/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    }),

  reorderJob: (id, { fromOrder, toOrder }) =>
    fetchAPI(`/jobs/${id}/reorder`, {
      method: 'PATCH',
      body: JSON.stringify({ fromOrder, toOrder }),
    }),
};

// Candidates API
export const candidatesAPI = {
  getCandidates: (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, value.toString());
      }
    });
    return fetchAPI(`/candidates?${searchParams}`);
  },

  getCandidate: (id) => fetchAPI(`/candidates/${id}`),

  createCandidate: (candidateData) =>
    fetchAPI('/candidates', {
      method: 'POST',
      body: JSON.stringify(candidateData),
    }),

  updateCandidate: (id, updates) =>
    fetchAPI(`/candidates/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    }),

  getCandidateTimeline: (id) => fetchAPI(`/candidates/${id}/timeline`),
};

// Assessments API
export const assessmentsAPI = {
  getAssessment: (jobId) => fetchAPI(`/assessments/${jobId}`),

  saveAssessment: (jobId, assessmentData) =>
    fetchAPI(`/assessments/${jobId}`, {
      method: 'PUT',
      body: JSON.stringify(assessmentData),
    }),

  submitAssessmentResponse: (jobId, responseData) =>
    fetchAPI(`/assessments/${jobId}/submit`, {
      method: 'POST',
      body: JSON.stringify(responseData),
    }),
};

// Users API
export const usersAPI = {
  getUsers: () => fetchAPI('/users'),
};
