import React from 'react';
import { Typography, Paper, Box } from '@mui/material';
import { useParams } from 'react-router-dom';

function CandidateDetailPage() {
  const { candidateId } = useParams();

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Candidate Details: {candidateId}
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Typography>
          Candidate detail view with timeline will be implemented here.
        </Typography>
      </Paper>
    </Box>
  );
}

export default CandidateDetailPage;
