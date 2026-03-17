import { useQuery } from '@tanstack/react-query';

import { getProject } from '@/api/projects';
import { queryKeys } from '@/hooks/query-keys';

export function useFindProject(id: string) {
  return useQuery({
    queryKey: queryKeys.projects.detail(id),
    queryFn: () => getProject(id),
    enabled: !!id,
  });
}
