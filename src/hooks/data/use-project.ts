import { useQuery } from '@tanstack/react-query';

import { getProject } from '@/api/projects';

import { projectQueryKeys } from './use-projects';

export function useFindProject(id: string) {
  return useQuery({
    queryKey: projectQueryKeys.detail(id),
    queryFn: () => getProject(id),
    enabled: !!id,
  });
}
