import { useQuery } from '@tanstack/react-query';

import { listProjects } from '@/api/projects';

export const projectQueryKeys = {
  all: ['projects'] as const,
  detail: (id: string) => ['projects', id] as const,
};

export function useListProjects() {
  return useQuery({
    queryKey: projectQueryKeys.all,
    queryFn: listProjects,
  });
}
