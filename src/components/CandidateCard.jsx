import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Avatar
} from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';

const CandidateCard = ({ candidate, onClick, style }) => {
  const {
    name,
    email,
    stage,
    createdAt
  } = candidate;

  // Different color schemes for variety
  const colorSchemes = [
    { bg: '#ffebee', border: '#f44336', accent: '#d32f2f' }, // Red
    { bg: '#f3e5f5', border: '#9c27b0', accent: '#7b1fa2' }, // Purple
    { bg: '#e8f5e8', border: '#4caf50', accent: '#388e3c' }, // Green
    { bg: '#fff3e0', border: '#ff9800', accent: '#f57c00' }, // Orange
    { bg: '#e3f2fd', border: '#2196f3', accent: '#1976d2' }, // Blue
    { bg: '#fce4ec', border: '#e91e63', accent: '#c2185b' }, // Pink
  ];

  // Use candidate ID to consistently assign colors
  const colorIndex = candidate.id ? 
    parseInt(candidate.id.substring(0, 8), 16) % colorSchemes.length : 0;
  const colors = colorSchemes[colorIndex];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatStage = (stage) => {
    switch(stage) {
      case 'applied': return 'Applied';
      case 'screen': return 'Screen';
      case 'tech': return 'Tech';
      case 'offer': return 'Offer';
      case 'hired': return 'Hired';
      case 'rejected': return 'Rejected';
      default: return stage;
    }
  };

  return (
    <Card 
      onClick={() => onClick && onClick(candidate)}
      sx={{ 
        mb: 2,
        cursor: onClick ? 'pointer' : 'default',
        backgroundColor: colors.bg,
        border: `2px solid ${colors.border}`,
        borderRadius: 2,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': onClick ? {
          transform: 'translateY(-2px)',
          boxShadow: 3,
        } : {},
        minHeight: 120,
        ...style
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        {/* Header with avatar and name */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
          <Avatar 
            sx={{ 
              width: 32, 
              height: 32, 
              bgcolor: colors.accent,
              mr: 1,
              fontSize: '0.875rem'
            }}
          >
            {name ? name.charAt(0).toUpperCase() : <PersonIcon fontSize="small" />}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                fontWeight: 600,
                color: colors.accent,
                fontSize: '0.875rem',
                lineHeight: 1.2,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {name || 'Full Name'}
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: '#666',
                fontSize: '0.75rem',
                display: 'block',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {email || 'email@example.com'}
            </Typography>
          </Box>
        </Box>

        {/* Job information */}
        <Box sx={{ mb: 1.5 }}>
          <Typography 
            variant="caption" 
            sx={{ 
              color: '#666',
              fontSize: '0.75rem',
              display: 'block',
              mb: 0.5
            }}
          >
            Job Title
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              fontWeight: 500,
              color: colors.accent,
              fontSize: '0.8rem',
              lineHeight: 1.2
            }}
          >
            Company Name
          </Typography>
        </Box>

        {/* Stage and date */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Chip
            label={formatStage(stage)}
            size="small"
            sx={{
              bgcolor: colors.accent,
              color: 'white',
              fontSize: '0.7rem',
              height: 20,
              '& .MuiChip-label': {
                px: 1
              }
            }}
          />
          <Typography 
            variant="caption" 
            sx={{ 
              color: '#666',
              fontSize: '0.7rem'
            }}
          >
            {formatDate(createdAt)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CandidateCard;