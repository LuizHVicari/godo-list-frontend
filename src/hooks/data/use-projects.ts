import { useQuery } from '@tanstack/react-query';

import { listProjects } from '@/api/projects';
import { queryKeys } from '@/hooks/query-keys';

export function useListProjects() {
  return useQuery({
    queryKey: queryKeys.projects.all,
    queryFn: listProjects,
  });
}
