import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobsAPI } from '../utils/api.js';

// Jobs query keys
export const jobsKeys = {
  all: ['jobs'],
  lists: () => [...jobsKeys.all, 'list'],
  list: (filters) => [...jobsKeys.lists(), filters],
  details: () => [...jobsKeys.all, 'detail'],
  detail: (id) => [...jobsKeys.details(), id],
};

// Get jobs with pagination and filters
export const useJobs = (params = {}) => {
  return useQuery({
    queryKey: jobsKeys.list(params),
    queryFn: () => jobsAPI.getJobs(params),
  });
};

// Get single job
export const useJob = (id) => {
  return useQuery({
    queryKey: jobsKeys.detail(id),
    queryFn: () => jobsAPI.getJob(id),
    enabled: !!id,
  });
};

// Create job mutation
export const useCreateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: jobsAPI.createJob,
    onSuccess: () => {
      // Invalidate jobs list queries
      queryClient.invalidateQueries({ queryKey: jobsKeys.lists() });
    },
  });
};

// Update job mutation
export const useUpdateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...updates }) => jobsAPI.updateJob(id, updates),
    onSuccess: (data, variables) => {
      // Update the specific job in cache
      queryClient.setQueryData(jobsKeys.detail(variables.id), data);
      // Invalidate lists to refresh
      queryClient.invalidateQueries({ queryKey: jobsKeys.lists() });
    },
  });
};

// Reorder job mutation with optimistic updates
export const useReorderJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, fromOrder, toOrder }) => 
      jobsAPI.reorderJob(id, { fromOrder, toOrder }),
    
    onMutate: async ({ id, fromOrder, toOrder, currentParams = {} }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: jobsKeys.list(currentParams) });

      // Snapshot the previous value
      const previousJobs = queryClient.getQueryData(jobsKeys.list(currentParams));

      // Optimistically update to the new value
      if (previousJobs?.data) {
        const newJobs = [...previousJobs.data];
        const jobIndex = newJobs.findIndex(job => job.id === id);
        
        if (jobIndex !== -1) {
          const [movedJob] = newJobs.splice(jobIndex, 1);
          const newIndex = toOrder < fromOrder ? toOrder : Math.min(toOrder, newJobs.length);
          newJobs.splice(newIndex, 0, { ...movedJob, order: toOrder });
          
          // Update orders for affected jobs
          newJobs.forEach((job, index) => {
            job.order = index;
          });

          queryClient.setQueryData(jobsKeys.list(currentParams), {
            ...previousJobs,
            data: newJobs,
          });
        }
      }

      // Return a context object with the snapshotted value
      return { previousJobs, currentParams };
    },
    
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousJobs) {
        queryClient.setQueryData(
          jobsKeys.list(context.currentParams), 
          context.previousJobs
        );
      }
    },
    
    onSettled: (data, error, variables, context) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ 
        queryKey: jobsKeys.list(context?.currentParams || {}) 
      });
    },
  });
};
