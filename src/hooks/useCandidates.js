import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { candidatesAPI } from '../utils/api.js';

// Candidates query keys
export const candidatesKeys = {
  all: ['candidates'],
  lists: () => [...candidatesKeys.all, 'list'],
  list: (filters) => [...candidatesKeys.lists(), filters],
  details: () => [...candidatesKeys.all, 'detail'],
  detail: (id) => [...candidatesKeys.details(), id],
  timeline: (id) => [...candidatesKeys.detail(id), 'timeline'],
};

// Get candidates with pagination and filters
export const useCandidates = (params = {}) => {
  return useQuery({
    queryKey: candidatesKeys.list(params),
    queryFn: () => candidatesAPI.getCandidates(params),
  });
};

// Get single candidate
export const useCandidate = (id) => {
  return useQuery({
    queryKey: candidatesKeys.detail(id),
    queryFn: () => candidatesAPI.getCandidate(id),
    enabled: !!id,
  });
};

// Get candidate timeline
export const useCandidateTimeline = (id) => {
  return useQuery({
    queryKey: candidatesKeys.timeline(id),
    queryFn: () => candidatesAPI.getCandidateTimeline(id),
    enabled: !!id,
  });
};

// Create candidate mutation
export const useCreateCandidate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: candidatesAPI.createCandidate,
    onSuccess: () => {
      // Invalidate candidates list queries
      queryClient.invalidateQueries({ queryKey: candidatesKeys.lists() });
    },
  });
};

// Update candidate mutation (for stage changes, etc.)
export const useUpdateCandidate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...updates }) => candidatesAPI.updateCandidate(id, updates),
    onSuccess: (data, variables) => {
      // Update the specific candidate in cache
      queryClient.setQueryData(candidatesKeys.detail(variables.id), data);
      // Invalidate timeline if stage changed
      if (variables.stage) {
        queryClient.invalidateQueries({ queryKey: candidatesKeys.timeline(variables.id) });
      }
      // Invalidate lists to refresh
      queryClient.invalidateQueries({ queryKey: candidatesKeys.lists() });
    },
  });
};
