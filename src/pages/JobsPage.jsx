import React from 'react';
import { Typography, Paper, Box } from '@mui/material';

function JobsPage() {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Jobs
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Typography>
          Jobs management will be implemented here. This will include:
        </Typography>
        <ul>
          <li>Paginated job listings with search and filters</li>
          <li>Create/Edit job functionality</li>
          <li>Archive/Unarchive jobs</li>
          <li>Drag-and-drop reordering</li>
        </ul>
      </Paper>
    </Box>
  );
}

export default JobsPage;
