import { useQuery } from '@tanstack/react-query';

import { listItems } from '@/api/items';
import { queryKeys } from '@/hooks/query-keys';

export function useListItems(projectId: string, stepId: string) {
  return useQuery({
    queryKey: queryKeys.items.all(projectId, stepId),
    queryFn: () => listItems(projectId, stepId),
    enabled: !!projectId && !!stepId,
    select: (data) => ({
      ...data,
      results: [...data.results].sort((a, b) => a.position - b.position),
    }),
  });
}
