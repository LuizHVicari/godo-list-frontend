import { useQuery } from '@tanstack/react-query';

import { listSteps } from '@/api/steps';

export const stepQueryKeys = {
  all: (projectId: string) => ['projects', projectId, 'steps'] as const,
};

export function useListSteps(projectId: string) {
  return useQuery({
    queryKey: stepQueryKeys.all(projectId),
    queryFn: () => listSteps(projectId),
    enabled: !!projectId,
    select: (data) => ({
      ...data,
      results: [...data.results].sort((a, b) => a.position - b.position),
    }),
  });
}
