import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Alert
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useJob, useUpdateJob } from '../hooks/useJobs.js';

const EditJobPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: job, isLoading: jobLoading, error: jobError } = useJob(id);
  const updateJobMutation = useUpdateJob();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    companyName: '',
    companyWebsite: '',
    companyDescription: '',
    companyLogo: '',
    industrySector: '',
    hiringType: '',
    requiredSkills: '',
    ctcStipend: '',
    location: '',
    experienceRequired: ''
  });

  const [backToJobs, setBackToJobs] = useState(false);

  // Populate form when job data is loaded
  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || '',
        description: job.description || '',
        companyName: job.company?.name || '',
        companyWebsite: job.company?.website || '',
        companyDescription: job.company?.description || '',
        companyLogo: job.company?.avatarUrl || '',
        industrySector: job.industry || '',
        hiringType: job.jobType || '',
        requiredSkills: job.tags?.join(', ') || '',
        ctcStipend: job.salary ? `${job.salary.min}-${job.salary.max}` : '',
        location: job.location || '',
        experienceRequired: job.experienceRequired || ''
      });
    }
  }, [job]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Parse salary
      const salaryParts = formData.ctcStipend.split('-');
      const minSalary = salaryParts[0] ? parseInt(salaryParts[0].replace(/[^0-9]/g, '')) : 0;
      const maxSalary = salaryParts[1] ? parseInt(salaryParts[1].replace(/[^0-9]/g, '')) : minSalary;

      // Parse skills
      const skills = formData.requiredSkills
        .split(',')
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0);

      const jobData = {
        title: formData.title,
        description: formData.description,
        company: {
          name: formData.companyName,
          website: formData.companyWebsite,
          description: formData.companyDescription,
          avatarUrl: formData.companyLogo
        },
        industry: formData.industrySector,
        jobType: formData.hiringType,
        tags: skills,
        salary: {
          min: minSalary * 1000, // Convert to full amount
          max: maxSalary * 1000,
          currency: '$',
          period: 'month'
        },
        location: formData.location,
        experienceRequired: formData.experienceRequired,
        workplaceType: 'On-site' // Default value
      };

      await updateJobMutation.mutateAsync({ id, ...jobData });
      
      if (backToJobs) {
        navigate('/jobs');
      } else {
        // Stay on the page, maybe show a success message
        console.log('Job updated successfully');
      }
    } catch (error) {
      console.error('Error updating job:', error);
    }
  };

  const handleCancel = () => {
    navigate('/jobs');
  };

  if (jobLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (jobError) {
    return (
      <Box>
        <Alert severity="error">
          Error loading job: {jobError.message}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3 
      }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Jobs
        </Typography>
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

      {/* Form */}
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 600 }}>
          Edit Job
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Left Column */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box>
                  <Typography variant="body2" sx={{ mb: 1, color: '#666' }}>
                    Job Title
                  </Typography>
                  <TextField
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    fullWidth
                    variant="outlined"
                    size="small"
                    required
                  />
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ mb: 1, color: '#666' }}>
                    Company Website
                  </Typography>
                  <TextField
                    name="companyWebsite"
                    value={formData.companyWebsite}
                    onChange={handleInputChange}
                    fullWidth
                    variant="outlined"
                    size="small"
                    type="url"
                  />
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ mb: 1, color: '#666' }}>
                    Company Name
                  </Typography>
                  <TextField
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    fullWidth
                    variant="outlined"
                    size="small"
                    required
                  />
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ mb: 1, color: '#666' }}>
                    Company Logo
                  </Typography>
                  <TextField
                    name="companyLogo"
                    value={formData.companyLogo}
                    onChange={handleInputChange}
                    fullWidth
                    variant="outlined"
                    size="small"
                    placeholder="URL to company logo"
                  />
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ mb: 1, color: '#666' }}>
                    Industry Sector
                  </Typography>
                  <TextField
                    name="industrySector"
                    value={formData.industrySector}
                    onChange={handleInputChange}
                    fullWidth
                    variant="outlined"
                    size="small"
                  />
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ mb: 1, color: '#666' }}>
                    Required Skills
                  </Typography>
                  <TextField
                    name="requiredSkills"
                    value={formData.requiredSkills}
                    onChange={handleInputChange}
                    fullWidth
                    variant="outlined"
                    size="small"
                    placeholder="e.g., JavaScript, React, Node.js"
                    helperText="Separate skills with commas"
                  />
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ mb: 1, color: '#666' }}>
                    Location
                  </Typography>
                  <TextField
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    fullWidth
                    variant="outlined"
                    size="small"
                  />
                </Box>
              </Box>
            </Grid>

            {/* Right Column */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box>
                  <Typography variant="body2" sx={{ mb: 1, color: '#666' }}>
                    Job Description
                  </Typography>
                  <TextField
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    fullWidth
                    variant="outlined"
                    multiline
                    rows={4}
                    required
                  />
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ mb: 1, color: '#666' }}>
                    Company Description
                  </Typography>
                  <TextField
                    name="companyDescription"
                    value={formData.companyDescription}
                    onChange={handleInputChange}
                    fullWidth
                    variant="outlined"
                    multiline
                    rows={3}
                  />
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ mb: 1, color: '#666' }}>
                    Hiring Type
                  </Typography>
                  <TextField
                    name="hiringType"
                    value={formData.hiringType}
                    onChange={handleInputChange}
                    fullWidth
                    variant="outlined"
                    size="small"
                    placeholder="e.g., Full-Time, Part-Time, Contract"
                  />
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ mb: 1, color: '#666' }}>
                    CTC / Stipend
                  </Typography>
                  <TextField
                    name="ctcStipend"
                    value={formData.ctcStipend}
                    onChange={handleInputChange}
                    fullWidth
                    variant="outlined"
                    size="small"
                    placeholder="e.g., 50-80 (in thousands)"
                  />
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ mb: 1, color: '#666' }}>
                    Experience Required
                  </Typography>
                  <TextField
                    name="experienceRequired"
                    value={formData.experienceRequired}
                    onChange={handleInputChange}
                    fullWidth
                    variant="outlined"
                    size="small"
                    placeholder="e.g., 2-5 years"
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>

          {/* Action Buttons */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            gap: 2, 
            mt: 4 
          }}>
            <Button
              type="button"
              variant="outlined"
              onClick={handleCancel}
              sx={{ 
                px: 4, 
                py: 1,
                borderColor: '#ccc',
                color: '#666',
                '&:hover': {
                  borderColor: '#999'
                }
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={updateJobMutation.isPending}
              sx={{ 
                px: 4, 
                py: 1,
                bgcolor: '#1976d2',
                '&:hover': {
                  bgcolor: '#1565c0'
                }
              }}
            >
              {updateJobMutation.isPending ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                'Save Changes'
              )}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default EditJobPage;