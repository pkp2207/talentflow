import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortableCandidateCard from './SortableCandidateCard.jsx';

const DroppableColumn = ({ stage, candidates, onCandidateClick }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: stage.key
  });

  return (
    <Paper 
      ref={setNodeRef}
      sx={{ 
        p: 2, 
        minHeight: 600,
        backgroundColor: isOver ? '#f0f8ff' : '#ffffff',
        borderRadius: 2,
        border: isOver ? '2px dashed #1976d2' : '1px solid #e0e0e0',
        transition: 'all 0.2s ease'
      }}
    >
      {/* Column Header */}
      <Box sx={{ 
        textAlign: 'center', 
        mb: 2,
        pb: 1,
        borderBottom: '2px solid #e0e0e0'
      }}>
        <Typography variant="h6" sx={{ 
          fontWeight: 600,
          color: '#2c3e50',
          fontSize: '1rem'
        }}>
          {stage.label}
        </Typography>
        <Typography variant="caption" sx={{ 
          color: '#666',
          fontSize: '0.75rem'
        }}>
          ({candidates.length})
        </Typography>
      </Box>

      {/* Candidate Cards */}
      <SortableContext 
        items={candidates.map(c => c.id)} 
        strategy={verticalListSortingStrategy}
      >
        <Box sx={{ 
          maxHeight: 500, 
          overflowY: 'auto',
          pr: 1,
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#c1c1c1',
            borderRadius: '3px',
            '&:hover': {
              background: '#a8a8a8',
            },
          },
        }}>
          {candidates.map(candidate => (
            <SortableCandidateCard
              key={candidate.id}
              candidate={candidate}
              onClick={onCandidateClick}
            />
          ))}
          
          {candidates.length === 0 && (
            <Box sx={{ 
              textAlign: 'center', 
              py: 4,
              color: '#999',
              minHeight: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Typography variant="body2">
                Drop candidates here
              </Typography>
            </Box>
          )}
        </Box>
      </SortableContext>
    </Paper>
  );
};

export default DroppableColumn;