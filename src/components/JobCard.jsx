import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  IconButton,
  Avatar,
  Stack
} from '@mui/material';
import {
  GetApp as DownloadIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Business as BusinessIcon
} from '@mui/icons-material';

// Color themes for different cards
const colorThemes = [
  { bg: '#E3F2FD', border: '#2196F3', accent: '#1976D2' }, // Blue
  { bg: '#F3E5F5', border: '#9C27B0', accent: '#7B1FA2' }, // Purple
  { bg: '#E8F5E8', border: '#4CAF50', accent: '#388E3C' }, // Green
  { bg: '#FFF3E0', border: '#FF9800', accent: '#F57C00' }, // Orange
  { bg: '#FCE4EC', border: '#E91E63', accent: '#C2185B' }, // Pink
];

const JobCard = ({ 
  job, 
  candidateCount = 0,
  onDownload,
  onDelete,
  onEdit,
  onClick,
  colorIndex = 0
}) => {
  const {
    title,
    company,
    tags = [],
    salary,
    location,
    workplaceType,
    createdAt
  } = job;

  const theme = colorThemes[colorIndex % colorThemes.length];

  // Format salary display
  const formatSalary = (salary) => {
    if (!salary) return 'Salary not specified';
    
    const { min, max, currency = '$', period = 'month' } = salary;
    
    if (min && max) {
      const minFormatted = Math.round(min / 1000);
      const maxFormatted = Math.round(max / 1000);
      return `${currency}${minFormatted}k-${maxFormatted}k /${period}`;
    } else if (min) {
      const minFormatted = Math.round(min / 1000);
      return `${currency}${minFormatted}k+ /${period}`;
    }
    return 'Salary negotiable';
  };

  // Format location display
  const formatLocation = (location, workplaceType) => {
    if (workplaceType === 'Remote') return 'Remote';
    if (workplaceType === 'Hybrid' && location) return `${location} (Hybrid)`;
    return location || 'Location not specified';
  };

  // Format creation date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card 
      sx={{ 
        width: '100%',
        maxWidth: 280,
        minHeight: 280,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease-in-out',
        '&:hover': onClick ? {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
        } : {},
        borderRadius: 3,
        border: `2px solid ${theme.border}`,
        backgroundColor: theme.bg,
        position: 'relative',
        overflow: 'visible'
      }}
      onClick={onClick}
    >
      {/* Action buttons positioned absolutely */}
      <Box sx={{ 
        position: 'absolute',
        top: 8,
        right: 8,
        display: 'flex',
        gap: 0.5,
        zIndex: 2
      }}>
        {onDownload && (
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onDownload(job);
            }}
            sx={{ 
              width: 28,
              height: 28,
              backgroundColor: 'rgba(255,255,255,0.9)',
              '&:hover': { backgroundColor: 'white' }
            }}
          >
            <DownloadIcon sx={{ fontSize: 16 }} />
          </IconButton>
        )}
        {onDelete && (
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(job);
            }}
            sx={{ 
              width: 28,
              height: 28,
              backgroundColor: 'rgba(255,255,255,0.9)',
              '&:hover': { backgroundColor: 'white' }
            }}
          >
            <DeleteIcon sx={{ fontSize: 16 }} />
          </IconButton>
        )}
        {onEdit && (
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(job);
            }}
            sx={{ 
              width: 28,
              height: 28,
              backgroundColor: 'rgba(255,255,255,0.9)',
              '&:hover': { backgroundColor: 'white' }
            }}
          >
            <EditIcon sx={{ fontSize: 16 }} />
          </IconButton>
        )}
      </Box>

      <CardContent sx={{ p: 2, pb: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header with title and company */}
        <Box sx={{ mb: 2, flex: '0 0 auto' }}>
          <Typography 
            variant="h6" 
            component="h3" 
            sx={{ 
              fontWeight: 600,
              fontSize: '1rem',
              lineHeight: 1.2,
              mb: 1,
              color: theme.accent,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: '2.4em'
            }}
          >
            {title}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ width: 24, height: 24, bgcolor: 'white' }}>
              <BusinessIcon sx={{ fontSize: 14, color: theme.accent }} />
            </Avatar>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                fontSize: '0.875rem',
                fontWeight: 500
              }}
            >
              {company?.name || 'Company Name'}
            </Typography>
          </Box>
        </Box>

        {/* Skills/Tags */}
        <Box sx={{ mb: 2, flex: '1 1 auto', display: 'flex', alignItems: 'flex-start' }}>
          <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
            {tags.slice(0, 6).map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                sx={{
                  fontSize: '0.7rem',
                  height: 22,
                  backgroundColor: 'rgba(255,255,255,0.8)',
                  border: `1px solid ${theme.border}`,
                  color: theme.accent,
                  '& .MuiChip-label': {
                    px: 1
                  }
                }}
              />
            ))}
          </Stack>
        </Box>

        {/* Bottom section */}
        <Box sx={{ mt: 'auto' }}>
          {/* Salary and Location */}
          <Box sx={{ mb: 1.5 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                color: theme.accent,
                fontSize: '1rem',
                mb: 0.5
              }}
            >
              {formatSalary(salary)}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ fontSize: '0.8rem' }}
            >
              {formatLocation(location, workplaceType)}
            </Typography>
          </Box>
          
          {/* Candidate count and date */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography 
                variant="body1" 
                sx={{ 
                  fontWeight: 600,
                  color: theme.accent,
                  fontSize: '0.9rem'
                }}
              >
                {candidateCount} Cand. Ctn
              </Typography>
            </Box>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ fontSize: '0.75rem' }}
            >
              {formatDate(createdAt)}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default JobCard;