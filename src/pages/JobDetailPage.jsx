import React from 'react';
import { Typography, Paper, Box } from '@mui/material';
import { useParams } from 'react-router-dom';

function JobDetailPage() {
  const { jobId } = useParams();

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Job Details: {jobId}
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Typography>
          Job detail view will be implemented here.
        </Typography>
      </Paper>
    </Box>
  );
}

export default JobDetailPage;
