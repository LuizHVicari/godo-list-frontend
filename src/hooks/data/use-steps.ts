import { useQuery } from '@tanstack/react-query';

import { listSteps } from '@/api/steps';
import { queryKeys } from '@/hooks/query-keys';

export function useListSteps(projectId: string) {
  return useQuery({
    queryKey: queryKeys.steps.all(projectId),
    queryFn: () => listSteps(projectId),
    enabled: !!projectId,
    select: (data) => ({
      ...data,
      results: [...data.results].sort((a, b) => a.position - b.position),
    }),
  });
}
