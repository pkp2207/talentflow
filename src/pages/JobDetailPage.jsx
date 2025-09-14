import React, { useState } from 'react';
import {
  Box,
  Typography,
  Chip,
  Button,
  TextField,
  Avatar,
  Stack,
  CircularProgress,
  Alert,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { 
  Business as BusinessIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Archive as ArchiveIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useJob, useUpdateJob } from '../hooks/useJobs.js';
import { useCandidateCountsByJob } from '../hooks/useCandidates.js';

function JobDetailPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [backToJobs, setBackToJobs] = useState(false);
  
  const { data: job, isLoading: jobLoading, error: jobError } = useJob(jobId);
  const { data: candidateCounts = {} } = useCandidateCountsByJob(jobId ? [jobId] : []);
  const updateJobMutation = useUpdateJob();

  const handleEditDetails = () => {
    navigate(`/jobs/${jobId}/edit`);
  };

  const handleArchiveJob = async () => {
    try {
      await updateJobMutation.mutateAsync({
        id: jobId,
        status: job.status === 'active' ? 'archived' : 'active'
      });
      
      if (backToJobs) {
        navigate('/jobs');
      }
    } catch (error) {
      console.error('Error archiving job:', error);
    }
  };

  const handleDeleteJob = () => {
    // In a real app, you'd want a confirmation dialog
    if (window.confirm('Are you sure you want to delete this job?')) {
      console.log('Delete job:', jobId);
      // Implement delete functionality
      navigate('/jobs');
    }
  };

  const formatSalary = (salary) => {
    if (!salary) return 'Salary not specified';
    
    const { min, max, currency = '$', period = 'month' } = salary;
    
    if (min && max) {
      return `${currency}${(min/1000).toLocaleString()}k-${(max/1000).toLocaleString()}k/${period}`;
    } else if (min) {
      return `${currency}${(min/1000).toLocaleString()}k+/${period}`;
    }
    return 'Salary negotiable';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (jobLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (jobError || !job) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Error loading job: {jobError?.message || 'Job not found'}
        </Alert>
      </Box>
    );
  }

  const candidateCount = candidateCounts[jobId] || 0;

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8f9fa',
      p: 0
    }}>
      {/* Header */}
      <Box sx={{ 
        backgroundColor: '#2c3e50',
        color: 'white',
        p: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Job and it's details
        </Typography>
      </Box>

      <Box sx={{ p: 3 }}>
        {/* Navigation and Actions */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3 
        }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            Jobs
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => navigate('/jobs/create')}
              sx={{ 
                backgroundColor: '#1976d2',
                '&:hover': { backgroundColor: '#1565c0' }
              }}
            >
              Create Job
            </Button>
            <FormControlLabel
              control={
                <Checkbox
                  checked={backToJobs}
                  onChange={(e) => setBackToJobs(e.target.checked)}
                  sx={{ color: '#666' }}
                />
              }
              label="Back to Jobs"
              sx={{ color: '#666' }}
            />
          </Box>
        </Box>

        <Typography variant="h6" sx={{ mb: 3, color: '#666' }}>
          Job ID
        </Typography>

        {/* Main Content */}
        <Box sx={{ display: 'flex', gap: 4 }}>
          {/* Left Section */}
          <Box sx={{ flex: 1 }}>
            {/* Job Title and Company */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h3" component="h2" sx={{ 
                fontWeight: 700,
                mb: 1,
                color: '#2c3e50'
              }}>
                {job.title}
              </Typography>
              <Typography variant="h5" sx={{ 
                color: '#666',
                fontWeight: 400
              }}>
                {job.company?.name || 'Company Name'}
              </Typography>
            </Box>

            {/* Job Description */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="body2" sx={{ mb: 1, color: '#666' }}>
                Job Description
              </Typography>
              <TextField
                value={job.description || ''}
                multiline
                rows={6}
                fullWidth
                variant="outlined"
                InputProps={{
                  readOnly: true,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#f8f9fa',
                  }
                }}
              />
            </Box>

            {/* Experience Required */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="body2" sx={{ mb: 1, color: '#666' }}>
                Experience required
              </Typography>
              <TextField
                value={job.experienceRequired || ''}
                fullWidth
                variant="outlined"
                size="small"
                InputProps={{
                  readOnly: true,
                }}
                sx={{
                  maxWidth: 300,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#f8f9fa',
                  }
                }}
              />
            </Box>

            {/* Required Skills */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="body2" sx={{ mb: 2, color: '#666' }}>
                Required Skills
              </Typography>
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                {job.tags?.map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    variant="outlined"
                    sx={{
                      borderColor: '#ccc',
                      color: '#666'
                    }}
                  />
                ))}
              </Stack>
            </Box>
          </Box>

          {/* Right Section */}
          <Box sx={{ minWidth: 300 }}>
            {/* Company Logo */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mb: 4,
              p: 3,
              border: '2px dashed #ccc',
              borderRadius: 2,
              backgroundColor: '#fff'
            }}>
              {job.company?.avatarUrl ? (
                <Avatar 
                  src={job.company.avatarUrl} 
                  alt={job.company.name}
                  sx={{ width: 120, height: 120 }}
                />
              ) : (
                <Box sx={{ 
                  width: 120, 
                  height: 120, 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: '#666'
                }}>
                  <BusinessIcon sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="body2" sx={{ textAlign: 'center' }}>
                    Comp.<br />Logo
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Stats */}
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                Candidate Count
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2', mb: 2 }}>
                {candidateCount}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Date of creation
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {formatDate(job.createdAt)}
              </Typography>
            </Box>

            {/* Salary and Location */}
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                {formatSalary(job.salary)}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                Job Location
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {job.location || 'Location not specified'}
              </Typography>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<ArchiveIcon />}
                onClick={handleArchiveJob}
                disabled={updateJobMutation.isPending}
                sx={{ 
                  borderColor: '#ffa726',
                  color: '#ffa726',
                  '&:hover': {
                    borderColor: '#ff9800',
                    backgroundColor: 'rgba(255, 167, 38, 0.04)'
                  }
                }}
              >
                {job.status === 'active' ? 'Archive Job' : 'Unarchive Job'}
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<DeleteIcon />}
                onClick={handleDeleteJob}
                sx={{ 
                  borderColor: '#f44336',
                  color: '#f44336',
                  '&:hover': {
                    borderColor: '#d32f2f',
                    backgroundColor: 'rgba(244, 67, 54, 0.04)'
                  }
                }}
              >
                Delete Job
              </Button>
              
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={handleEditDetails}
                sx={{ 
                  backgroundColor: '#4caf50',
                  '&:hover': {
                    backgroundColor: '#45a049'
                  }
                }}
              >
                Edit Details
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default JobDetailPage;
