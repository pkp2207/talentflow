import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import Layout from './components/Layout.jsx';
import JobsPage from './pages/JobsPage.jsx';
import CreateJobPage from './pages/CreateJobPage.jsx';
import EditJobPage from './pages/EditJobPage.jsx';
import JobDetailPage from './pages/JobDetailPage.jsx';
import CandidatesPage from './pages/CandidatesPage.jsx';
import CandidateDetailPage from './pages/CandidateDetailPage.jsx';
import AssessmentsPage from './pages/AssessmentsPage.jsx';

function App() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/jobs" replace />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/create" element={<CreateJobPage />} />
          <Route path="/jobs/:id/edit" element={<EditJobPage />} />
          <Route path="/jobs/:jobId" element={<JobDetailPage />} />
          <Route path="/candidates" element={<CandidatesPage />} />
          <Route path="/candidates/:candidateId" element={<CandidateDetailPage />} />
          <Route path="/assessments" element={<AssessmentsPage />} />
          <Route path="/assessments/:jobId" element={<AssessmentsPage />} />
        </Routes>
      </Layout>
    </Box>
  );
}

export default App;
