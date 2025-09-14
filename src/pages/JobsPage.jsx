import React, { useState } from 'react';
import { 
  Typography, 
  Box, 
  CircularProgress, 
  Alert,
  TextField,
  InputAdornment,
  Button,
  Stack,
  Container
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Add as AddIcon,
  FilterList as FilterIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import JobCard from '../components/JobCard.jsx';
import { useJobs } from '../hooks/useJobs.js';
import { useCandidateCountsByJob } from '../hooks/useCandidates.js';

function JobsPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('active');

  // Fetch jobs with filters
  const { 
    data: jobsData, 
    isLoading: jobsLoading, 
    error: jobsError 
  } = useJobs({ 
    status,
    pageSize: 50
  });

  // Get candidate counts for the jobs
  const jobIds = jobsData?.data?.map(job => job.id) || [];
  const { 
    data: candidateCounts = {}
  } = useCandidateCountsByJob(jobIds);

  const handleJobClick = (job) => {
    navigate(`/jobs/${job.id}`);
  };

  const handleDownload = (job) => {
    console.log('Download job:', job.id);
  };

  const handleDelete = (job) => {
    console.log('Delete job:', job.id);
  };

  const handleEdit = (job) => {
    navigate(`/jobs/${job.id}/edit`);
  };

  const handleCreateJob = () => {
    navigate('/jobs/create');
  };

  const handleApplyFilter = () => {
    console.log('Apply filter');
  };

  if (jobsLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (jobsError) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Error loading jobs: {jobsError.message}
      </Alert>
    );
  }

  const jobs = jobsData?.data || [];

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8f9fa',
      p: 0
    }}>
      <Container maxWidth={false} sx={{ px: 3, py: 2 }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3
        }}>
          <Typography 
            variant="h4" 
            component="h1"
            sx={{ 
              fontWeight: 600,
              color: '#333',
              fontSize: '2rem'
            }}
          >
            Jobs
          </Typography>
          
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={handleApplyFilter}
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
                borderColor: '#ddd',
                color: '#666',
                backgroundColor: 'white'
              }}
            >
              Apply Filter
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<SearchIcon />}
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
                borderColor: '#ddd',
                color: '#666',
                backgroundColor: 'white'
              }}
            >
              Search Job
            </Button>
            
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateJob}
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
                backgroundColor: '#1976d2',
                '&:hover': {
                  backgroundColor: '#1565c0'
                }
              }}
            >
              Create Job
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<PersonIcon />}
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
                borderColor: '#ddd',
                color: '#666',
                backgroundColor: 'white'
              }}
            >
              Profile
            </Button>
          </Stack>
        </Box>

        {/* Tab Navigation */}
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" spacing={0}>
            <Button
              variant={status === 'active' ? 'contained' : 'text'}
              onClick={() => setStatus('active')}
              sx={{
                borderRadius: '8px 0 0 8px',
                textTransform: 'none',
                px: 3,
                py: 1,
                backgroundColor: status === 'active' ? '#1976d2' : 'white',
                color: status === 'active' ? 'white' : '#666',
                border: '1px solid #ddd',
                borderRight: 'none',
                '&:hover': {
                  backgroundColor: status === 'active' ? '#1565c0' : '#f0f0f0'
                }
              }}
            >
              Active Jobs
            </Button>
            <Button
              variant={status === 'archived' ? 'contained' : 'text'}
              onClick={() => setStatus('archived')}
              sx={{
                borderRadius: '0 8px 8px 0',
                textTransform: 'none',
                px: 3,
                py: 1,
                backgroundColor: status === 'archived' ? '#1976d2' : 'white',
                color: status === 'archived' ? 'white' : '#666',
                border: '1px solid #ddd',
                '&:hover': {
                  backgroundColor: status === 'archived' ? '#1565c0' : '#f0f0f0'
                }
              }}
            >
              Archive Jobs
            </Button>
          </Stack>
        </Box>

        {/* Jobs Grid */}
        {jobs.length === 0 ? (
          <Box sx={{ 
            backgroundColor: 'white',
            borderRadius: 3,
            p: 8, 
            textAlign: 'center',
            border: '1px solid #ddd'
          }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No jobs found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Create your first job to get started
            </Typography>
            <Button variant="contained" onClick={handleCreateJob}>
              Create Job
            </Button>
          </Box>
        ) : (
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 2.5,
            '@media (max-width: 1600px)': {
              gridTemplateColumns: 'repeat(4, 1fr)',
            },
            '@media (max-width: 1200px)': {
              gridTemplateColumns: 'repeat(3, 1fr)',
            },
            '@media (max-width: 900px)': {
              gridTemplateColumns: 'repeat(2, 1fr)',
            },
            '@media (max-width: 600px)': {
              gridTemplateColumns: 'repeat(1, 1fr)',
            }
          }}>
            {jobs.map((job, index) => (
              <JobCard
                key={job.id}
                job={job}
                candidateCount={candidateCounts[job.id] || 0}
                onClick={() => handleJobClick(job)}
                onDownload={() => handleDownload(job)}
                onDelete={() => handleDelete(job)}
                onEdit={() => handleEdit(job)}
                colorIndex={index}
              />
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default JobsPage;
