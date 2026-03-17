import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { createProject, deleteProject, updateProject } from '@/api/projects';
import type {
  CreateProjectRequest,
  ListProjectsResponse,
  UpdateProjectRequest,
} from '@/types/api';

import { projectQueryKeys } from '../data/use-projects';

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProjectRequest) => createProject(data),
    onSuccess: () => {
      toast.success('Projeto criado.');
    },
    onError: () => {
      toast.error('Erro ao criar projeto.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: projectQueryKeys.all });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProjectRequest }) =>
      updateProject(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: projectQueryKeys.all });
      const previous = queryClient.getQueryData<ListProjectsResponse>(projectQueryKeys.all);
      queryClient.setQueryData<ListProjectsResponse>(projectQueryKeys.all, (old) =>
        old
          ? { ...old, results: old.results.map((p) => (p.id === id ? { ...p, ...data } : p)) }
          : old,
      );
      return { previous };
    },
    onSuccess: () => {
      toast.success('Projeto atualizado.');
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(projectQueryKeys.all, context.previous);
      }
      toast.error('Erro ao atualizar projeto.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: projectQueryKeys.all });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProject(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: projectQueryKeys.all });
      const previous = queryClient.getQueryData<ListProjectsResponse>(projectQueryKeys.all);
      queryClient.setQueryData<ListProjectsResponse>(projectQueryKeys.all, (old) =>
        old
          ? { ...old, results: old.results.filter((p) => p.id !== id), total: old.total - 1 }
          : old,
      );
      return { previous };
    },
    onSuccess: () => {
      toast.success('Projeto removido.');
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(projectQueryKeys.all, context.previous);
      }
      toast.error('Erro ao remover projeto.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: projectQueryKeys.all });
    },
  });
}
