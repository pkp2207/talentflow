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
  Alert,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  Chip,
  Avatar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Person as PersonIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  Description as ResumeIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useCandidate, useUpdateCandidate } from '../hooks/useCandidates.js';

const CANDIDATE_STAGES = [
  { key: 'applied', label: 'Applied' },
  { key: 'screen', label: 'Screening' },
  { key: 'tech', label: 'Tech Round' },
  { key: 'offer', label: 'Offer/Rejected' },
  { key: 'hired', label: 'Hired/Rejected the offer' }
];

const CustomStepConnector = styled(StepConnector)(() => ({
  '&.MuiStepConnector-alternativeLabel': {
    top: 22,
  },
  '&.MuiStepConnector-active': {
    '& .MuiStepConnector-line': {
      borderColor: '#1976d2',
    },
  },
  '&.MuiStepConnector-completed': {
    '& .MuiStepConnector-line': {
      borderColor: '#1976d2',
    },
  },
  '& .MuiStepConnector-line': {
    borderColor: '#eaeaf0',
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));

const CustomStepIcon = styled('div')(({ active, completed }) => ({
  backgroundColor: completed ? '#1976d2' : active ? '#1976d2' : '#eaeaf0',
  zIndex: 1,
  color: '#fff',
  width: 44,
  height: 44,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  border: completed || active ? '2px solid #1976d2' : '2px solid #eaeaf0',
}));

function CandidateDetailPage() {
  const { candidateId } = useParams();
  const navigate = useNavigate();
  const [backToCandidates, setBackToCandidates] = useState(false);

  const { data: candidate, isLoading: candidateLoading, error: candidateError } = useCandidate(candidateId);
  const updateCandidateMutation = useUpdateCandidate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    skills: '',
    careerDetails: '',
    timeline: '',
    dateOfBirth: '',
    gender: '',
    appliedJobList: '',
    currentStage: '',
    updateTheStage: '',
    candidateNote: ''
  });

  // Populate form when candidate data is loaded
  useEffect(() => {
    if (candidate) {
      setFormData({
        name: candidate.name || '',
        email: candidate.email || '',
        phone: candidate.phone || '',
        skills: candidate.skills?.join(', ') || '',
        careerDetails: '',
        timeline: '',
        dateOfBirth: '',
        gender: '',
        appliedJobList: '',
        currentStage: candidate.stage || '',
        updateTheStage: candidate.stage || '',
        candidateNote: candidate.notes?.join('\n') || ''
      });
    }
  }, [candidate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = async () => {
    try {
      const updates = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        stage: formData.updateTheStage
      };

      await updateCandidateMutation.mutateAsync({ id: candidateId, ...updates });
      
      if (backToCandidates) {
        navigate('/candidates');
      }
    } catch (error) {
      console.error('Error updating candidate:', error);
    }
  };

  const handleCancel = () => {
    navigate('/candidates');
  };

  const getCurrentStageIndex = () => {
    return CANDIDATE_STAGES.findIndex(stage => stage.key === candidate?.stage);
  };

  if (candidateLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (candidateError || !candidate) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Error loading candidate: {candidateError?.message || 'Candidate not found'}
        </Alert>
      </Box>
    );
  }

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
          Candidate Profile
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
            Candidates
          </Typography>
          
          <FormControlLabel
            control={
              <Checkbox
                checked={backToCandidates}
                onChange={(e) => setBackToCandidates(e.target.checked)}
                sx={{ color: '#666' }}
              />
            }
            label="Back to Candidates"
            sx={{ color: '#666' }}
          />
        </Box>

        <Grid container spacing={3}>
          {/* Left Column - Candidate Information */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Candidate Name
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, color: '#666' }}>
                Candidate email
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Candidate ID"
                  name="candidateId"
                  value={candidateId}
                  fullWidth
                  variant="outlined"
                  size="small"
                  InputProps={{ readOnly: true }}
                />

                <TextField
                  label="Phone No."
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                  size="small"
                />

                <TextField
                  label="Skills"
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                  size="small"
                  placeholder="e.g., JavaScript, React, Node.js"
                />

                <TextField
                  label="Career Details"
                  name="careerDetails"
                  value={formData.careerDetails}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={3}
                />

                <TextField
                  label="Timeline"
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                  size="small"
                />
              </Box>
            </Paper>
          </Grid>

          {/* Right Column - Additional Details */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
              {/* Resume Section */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                mb: 3,
                p: 3,
                border: '2px dashed #ccc',
                borderRadius: 2,
                backgroundColor: '#fafafa'
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center',
                  color: '#666'
                }}>
                  <ResumeIcon sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="body2">
                    Resume
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Date of Birth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                  size="small"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                />

                <TextField
                  label="Gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                  size="small"
                />

                <TextField
                  label="Applied Job List"
                  name="appliedJobList"
                  value={formData.appliedJobList}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                  size="small"
                />
              </Box>
            </Paper>

            {/* Stage Timeline */}
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Candidate Pipeline
              </Typography>
              
              <Stepper 
                activeStep={getCurrentStageIndex()} 
                orientation="vertical"
                connector={<CustomStepConnector />}
              >
                {CANDIDATE_STAGES.map((stage) => (
                  <Step key={stage.key}>
                    <StepLabel
                      StepIconComponent={({ active, completed }) => (
                        <CustomStepIcon active={active} completed={completed}>
                          {completed ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
                        </CustomStepIcon>
                      )}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {stage.label}
                      </Typography>
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>

              <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Current Stage"
                  name="currentStage"
                  value={formData.currentStage}
                  fullWidth
                  variant="outlined"
                  size="small"
                  InputProps={{ readOnly: true }}
                />

                <TextField
                  label="Update the stage"
                  name="updateTheStage"
                  value={formData.updateTheStage}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                  size="small"
                  select
                  SelectProps={{ native: true }}
                >
                  {CANDIDATE_STAGES.map((stage) => (
                    <option key={stage.key} value={stage.key}>
                      {stage.label}
                    </option>
                  ))}
                </TextField>

                <TextField
                  label="Candidate Note"
                  name="candidateNote"
                  value={formData.candidateNote}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={4}
                  placeholder="Add notes about the candidate..."
                />
              </Box>
            </Paper>
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
            variant="contained"
            onClick={handleUpdate}
            disabled={updateCandidateMutation.isPending}
            sx={{ 
              px: 4, 
              py: 1,
              bgcolor: '#1976d2',
              '&:hover': {
                bgcolor: '#1565c0'
              }
            }}
          >
            {updateCandidateMutation.isPending ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              'Update'
            )}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default CandidateDetailPage;
