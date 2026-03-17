import { useQuery } from '@tanstack/react-query';

import { listItems } from '@/api/items';

export const itemQueryKeys = {
  all: (projectId: string, stepId: string) =>
    ['projects', projectId, 'steps', stepId, 'items'] as const,
};

export function useListItems(projectId: string, stepId: string) {
  return useQuery({
    queryKey: itemQueryKeys.all(projectId, stepId),
    queryFn: () => listItems(projectId, stepId),
    enabled: !!projectId && !!stepId,
    select: (data) => ({
      ...data,
      results: [...data.results].sort((a, b) => a.position - b.position),
    }),
  });
}
