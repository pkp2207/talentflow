import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Grid,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useCandidates, useUpdateCandidate } from '../hooks/useCandidates.js';
import CandidateCard from '../components/CandidateCard.jsx';
import DroppableColumn from '../components/DroppableColumn.jsx';

const STAGES = [
  { key: 'applied', label: 'Applied' },
  { key: 'screen', label: 'Screen' },
  { key: 'tech', label: 'Tech' },
  { key: 'offer', label: 'Offer' },
  { key: 'hired', label: 'Hired' }
];

const FILTER_TABS = [
  { key: 'all', label: 'All' },
  { key: 'job-role', label: 'Job Role' },
  { key: 'company', label: 'Company' },
  { key: 'rejected', label: 'Rejected' }
];

function CandidatesPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeId, setActiveId] = useState(null);

  // Sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  // Fetch candidates
  const { 
    data: candidatesData, 
    isLoading: candidatesLoading, 
    error: candidatesError 
  } = useCandidates({ 
    search: searchTerm,
    pageSize: 1000 // Get all candidates for Kanban view
  });

  const updateCandidateMutation = useUpdateCandidate();

  // Group candidates by stage
  const candidatesByStage = useMemo(() => {
    if (!candidatesData?.data) return {};

    const candidates = candidatesData.data;
    
    // Apply filters
    let filteredCandidates = candidates;
    
    if (activeFilter === 'rejected') {
      filteredCandidates = candidates.filter(c => c.stage === 'rejected');
    } else if (activeFilter !== 'all') {
      // For now, just show all for other filters
      filteredCandidates = candidates.filter(c => c.stage !== 'rejected');
    } else {
      filteredCandidates = candidates.filter(c => c.stage !== 'rejected');
    }

    // Group by stage
    const grouped = {};
    STAGES.forEach(stage => {
      grouped[stage.key] = filteredCandidates.filter(c => c.stage === stage.key);
    });

    return grouped;
  }, [candidatesData, activeFilter]);

  const handleCandidateClick = (candidate) => {
    console.log('Navigate to candidate:', candidate.id);
    navigate(`/candidates/${candidate.id}`);
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      return;
    }

    // Find the candidate being dragged
    const candidateId = active.id;
    const candidate = candidatesData?.data?.find(c => c.id === candidateId);
    
    if (!candidate) {
      setActiveId(null);
      return;
    }

    // Determine the new stage from the droppable area
    let newStage = null;
    
    // Check if dropped on a stage column
    const stageKeys = STAGES.map(s => s.key);
    if (stageKeys.includes(over.id)) {
      newStage = over.id;
    } else {
      // If dropped on another candidate, find which stage column it's in
      const targetCandidate = candidatesData?.data?.find(c => c.id === over.id);
      if (targetCandidate) {
        newStage = targetCandidate.stage;
      }
    }

    // Only update if the stage actually changed
    if (newStage && newStage !== candidate.stage) {
      try {
        await updateCandidateMutation.mutateAsync({
          id: candidateId,
          stage: newStage
        });
      } catch (error) {
        console.error('Error updating candidate stage:', error);
      }
    }

    setActiveId(null);
  };

  const handleFilterChange = (event, newValue) => {
    setActiveFilter(newValue);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  if (candidatesLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (candidatesError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Error loading candidates: {candidatesError.message}
        </Alert>
      </Box>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
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
            Candidates
          </Typography>
        </Box>

        <Box sx={{ p: 3 }}>
          {/* Page Title and Search */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 3 
          }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
              Candidates
            </Typography>
            
            <TextField
              placeholder="Search Candidate"
              value={searchTerm}
              onChange={handleSearchChange}
              variant="outlined"
              size="small"
              sx={{ minWidth: 250 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Filter Tabs */}
          <Box sx={{ mb: 3 }}>
            <Tabs 
              value={activeFilter} 
              onChange={handleFilterChange}
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 500,
                  minWidth: 'auto',
                  px: 3
                }
              }}
            >
              {FILTER_TABS.map(tab => (
                <Tab 
                  key={tab.key} 
                  label={tab.label} 
                  value={tab.key}
                />
              ))}
            </Tabs>
          </Box>

          {/* Kanban Board */}
          <Grid container spacing={3}>
            {STAGES.map(stage => (
              <Grid item xs={12} sm={6} md={2.4} key={stage.key}>
                <DroppableColumn 
                  stage={stage}
                  candidates={candidatesByStage[stage.key] || []}
                  onCandidateClick={handleCandidateClick}
                />
              </Grid>
            ))}
          </Grid>

          {/* Summary */}
          {candidatesData?.pagination && (
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Showing {candidatesData.data?.length || 0} of {candidatesData.pagination.total} candidates
              </Typography>
            </Box>
          )}
        </Box>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeId ? (
            <CandidateCard 
              candidate={candidatesData?.data?.find(c => c.id === activeId) || {}}
            />
          ) : null}
        </DragOverlay>
      </Box>
    </DndContext>
  );
}

export default CandidatesPage;
