import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Chip,
  Autocomplete,
  MenuItem,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  Stack
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCreateJob } from '../hooks/useJobs.js';

// Predefined options for dropdowns
const INDUSTRIES = [
  'Technology',
  'Finance',
  'Healthcare',
  'E-commerce',
  'Education',
  'Manufacturing',
  'Consulting',
  'Media & Entertainment',
  'Real Estate',
  'Automotive'
];

const HIRING_TYPES = [
  'Full-Time',
  'Part-Time',
  'Contract',
  'Internship',
  'Freelance'
];

const EXPERIENCE_LEVELS = [
  'Entry-level (0-1 years)',
  'Mid-level (2-5 years)',
  'Senior (5-10 years)',
  'Lead (10+ years)'
];

const WORKPLACE_TYPES = [
  'On-site',
  'Remote',
  'Hybrid'
];

const COMMON_SKILLS = [
  'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'PHP', 'Angular', 
  'Vue.js', 'TypeScript', 'Go', 'C++', 'C#', 'Ruby', 'Swift', 'Kotlin',
  'HTML', 'CSS', 'SASS', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis',
  'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Git', 'Jenkins',
  'React Native', 'Flutter', 'Unity', 'Figma', 'Adobe Creative Suite'
];

function CreateJobPage() {
  const navigate = useNavigate();
  const createJobMutation = useCreateJob();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    companyName: '',
    companyWebsite: '',
    companyDescription: '',
    companyLogo: '',
    industry: '',
    hiringType: 'Full-Time',
    workplaceType: 'On-site',
    location: '',
    experienceRequired: '',
    salaryMin: '',
    salaryMax: '',
    salaryCurrency: '$',
    salaryPeriod: 'month',
    requiredSkills: []
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSkillsChange = (event, newValue) => {
    setFormData(prev => ({
      ...prev,
      requiredSkills: newValue
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.title.trim()) newErrors.title = 'Job title is required';
    if (!formData.description.trim()) newErrors.description = 'Job description is required';
    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!formData.industry) newErrors.industry = 'Industry is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.experienceRequired) newErrors.experienceRequired = 'Experience level is required';

    // Salary validation
    if (formData.salaryMin && isNaN(Number(formData.salaryMin))) {
      newErrors.salaryMin = 'Please enter a valid number';
    }
    if (formData.salaryMax && isNaN(Number(formData.salaryMax))) {
      newErrors.salaryMax = 'Please enter a valid number';
    }
    if (formData.salaryMin && formData.salaryMax && 
        Number(formData.salaryMin) > Number(formData.salaryMax)) {
      newErrors.salaryMax = 'Maximum salary must be greater than minimum';
    }

    // URL validation
    if (formData.companyWebsite && !isValidUrl(formData.companyWebsite)) {
      newErrors.companyWebsite = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string.startsWith('http') ? string : `https://${string}`);
      return true;
    } catch {
      return false;
    }
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError('');

    if (!validateForm()) {
      return;
    }

    try {
      const jobData = {
        title: formData.title.trim(),
        slug: generateSlug(formData.title),
        description: formData.description.trim(),
        experienceRequired: formData.experienceRequired,
        company: {
          name: formData.companyName.trim(),
          description: formData.companyDescription.trim(),
          avatarUrl: formData.companyLogo.trim(),
          website: formData.companyWebsite.trim()
        },
        industry: formData.industry,
        jobType: formData.hiringType,
        salary: formData.salaryMin || formData.salaryMax ? {
          min: formData.salaryMin ? Number(formData.salaryMin) : null,
          max: formData.salaryMax ? Number(formData.salaryMax) : null,
          currency: formData.salaryCurrency,
          period: formData.salaryPeriod
        } : null,
        status: 'active',
        location: formData.location.trim(),
        workplaceType: formData.workplaceType,
        tags: formData.requiredSkills,
        order: 0 // Will be set by the backend
      };

      await createJobMutation.mutateAsync(jobData);
      
      // Navigate back to jobs page on success
      navigate('/jobs');
    } catch (error) {
      setSubmitError(error.message || 'Failed to create job. Please try again.');
    }
  };

  const handleCancel = () => {
    navigate('/jobs');
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={handleCancel} size="small">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          Create Job
        </Typography>
        <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            onClick={handleCancel}
            disabled={createJobMutation.isPending}
          >
            Back to Jobs
          </Button>
        </Box>
      </Box>

      {/* Form */}
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Left Column */}
            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Job Title"
                  required
                  value={formData.title}
                  onChange={handleInputChange('title')}
                  error={!!errors.title}
                  helperText={errors.title}
                  placeholder="e.g. Senior Frontend Developer"
                />

                <TextField
                  fullWidth
                  label="Company Website"
                  value={formData.companyWebsite}
                  onChange={handleInputChange('companyWebsite')}
                  error={!!errors.companyWebsite}
                  helperText={errors.companyWebsite}
                  placeholder="https://company.com"
                />

                <TextField
                  fullWidth
                  label="Company Logo URL"
                  value={formData.companyLogo}
                  onChange={handleInputChange('companyLogo')}
                  placeholder="https://company.com/logo.png"
                />

                <TextField
                  fullWidth
                  select
                  label="Industry Section"
                  required
                  value={formData.industry}
                  onChange={handleInputChange('industry')}
                  error={!!errors.industry}
                  helperText={errors.industry}
                >
                  {INDUSTRIES.map((industry) => (
                    <MenuItem key={industry} value={industry}>
                      {industry}
                    </MenuItem>
                  ))}
                </TextField>

                <Autocomplete
                  multiple
                  options={COMMON_SKILLS}
                  freeSolo
                  value={formData.requiredSkills}
                  onChange={handleSkillsChange}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        variant="outlined"
                        label={option}
                        {...getTagProps({ index })}
                        key={index}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Required Skills"
                      placeholder="Type skills and press Enter"
                    />
                  )}
                />

                <TextField
                  fullWidth
                  label="Location"
                  required
                  value={formData.location}
                  onChange={handleInputChange('location')}
                  error={!!errors.location}
                  helperText={errors.location}
                  placeholder="e.g. San Francisco, CA"
                />
              </Stack>
            </Grid>

            {/* Right Column */}
            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Job Description"
                  required
                  value={formData.description}
                  onChange={handleInputChange('description')}
                  error={!!errors.description}
                  helperText={errors.description}
                  placeholder="Describe the role, responsibilities, and requirements..."
                />

                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Company Description"
                  value={formData.companyDescription}
                  onChange={handleInputChange('companyDescription')}
                  placeholder="Brief description about the company..."
                />

                <TextField
                  fullWidth
                  select
                  label="Hiring Type"
                  value={formData.hiringType}
                  onChange={handleInputChange('hiringType')}
                >
                  {HIRING_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>

                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    CTC / Stipend
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Min Salary"
                        type="number"
                        value={formData.salaryMin}
                        onChange={handleInputChange('salaryMin')}
                        error={!!errors.salaryMin}
                        helperText={errors.salaryMin}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <MoneyIcon fontSize="small" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Max Salary"
                        type="number"
                        value={formData.salaryMax}
                        onChange={handleInputChange('salaryMax')}
                        error={!!errors.salaryMax}
                        helperText={errors.salaryMax}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <MoneyIcon fontSize="small" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>

                <TextField
                  fullWidth
                  select
                  label="Experience Required"
                  required
                  value={formData.experienceRequired}
                  onChange={handleInputChange('experienceRequired')}
                  error={!!errors.experienceRequired}
                  helperText={errors.experienceRequired}
                >
                  {EXPERIENCE_LEVELS.map((level) => (
                    <MenuItem key={level} value={level}>
                      {level}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  fullWidth
                  label="Company Name"
                  required
                  value={formData.companyName}
                  onChange={handleInputChange('companyName')}
                  error={!!errors.companyName}
                  helperText={errors.companyName}
                  placeholder="e.g. TechCorp Inc."
                />

                <TextField
                  fullWidth
                  select
                  label="Workplace Type"
                  value={formData.workplaceType}
                  onChange={handleInputChange('workplaceType')}
                >
                  {WORKPLACE_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>
            </Grid>
          </Grid>

          {/* Error Display */}
          {submitError && (
            <Alert severity="error" sx={{ mt: 3 }}>
              {submitError}
            </Alert>
          )}

          {/* Action Buttons */}
          <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={handleCancel}
              disabled={createJobMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={createJobMutation.isPending}
              startIcon={createJobMutation.isPending ? <CircularProgress size={20} /> : <AddIcon />}
            >
              {createJobMutation.isPending ? 'Creating...' : 'Create Job'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}

export default CreateJobPage;