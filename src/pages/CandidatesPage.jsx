import React from 'react';
import { Typography, Paper, Box } from '@mui/material';

function CandidatesPage() {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Candidates
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Typography>
          Candidates management will be implemented here. This will include:
        </Typography>
        <ul>
          <li>Virtualized list of 1000+ candidates</li>
          <li>Client-side search and server-like filtering</li>
          <li>Kanban board for stage management</li>
          <li>Notes with @mentions</li>
        </ul>
      </Paper>
    </Box>
  );
}

export default CandidatesPage;
