import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { createStep, deleteStep, repositionSteps, updateStep } from '@/api/steps';
import { queryKeys } from '@/hooks/query-keys';
import type {
  CreateStepRequest,
  ListStepsResponse,
  RepositionStepsRequest,
  UpdateStepRequest,
} from '@/types/api';

export function useCreateStep(projectId: string) {
  const queryClient = useQueryClient();
  const queryKey = queryKeys.steps.all(projectId);

  return useMutation({
    mutationFn: (data: CreateStepRequest) => createStep(projectId, data),
    onSuccess: () => {
      toast.success('Etapa criada.');
    },
    onError: () => {
      toast.error('Erro ao criar etapa.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}

export function useUpdateStep(projectId: string) {
  const queryClient = useQueryClient();
  const queryKey = queryKeys.steps.all(projectId);

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStepRequest }) =>
      updateStep(projectId, id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<ListStepsResponse>(queryKey);
      queryClient.setQueryData<ListStepsResponse>(queryKey, (old) =>
        old
          ? { ...old, results: old.results.map((s) => (s.id === id ? { ...s, ...data } : s)) }
          : old,
      );
      return { previous };
    },
    onSuccess: () => {
      toast.success('Etapa atualizada.');
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) queryClient.setQueryData(queryKey, context.previous);
      toast.error('Erro ao atualizar etapa.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}

export function useDeleteStep(projectId: string) {
  const queryClient = useQueryClient();
  const queryKey = queryKeys.steps.all(projectId);

  return useMutation({
    mutationFn: (id: string) => deleteStep(projectId, id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<ListStepsResponse>(queryKey);
      queryClient.setQueryData<ListStepsResponse>(queryKey, (old) =>
        old
          ? { ...old, results: old.results.filter((s) => s.id !== id), total: old.total - 1 }
          : old,
      );
      return { previous };
    },
    onSuccess: () => {
      toast.success('Etapa removida.');
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) queryClient.setQueryData(queryKey, context.previous);
      toast.error('Erro ao remover etapa.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}

export function useRepositionSteps(projectId: string) {
  const queryClient = useQueryClient();
  const queryKey = queryKeys.steps.all(projectId);

  return useMutation({
    mutationFn: (data: RepositionStepsRequest) => repositionSteps(projectId, data),
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<ListStepsResponse>(queryKey);
      queryClient.setQueryData<ListStepsResponse>(queryKey, (old) => {
        if (!old) return old;
        const updated = old.results.map((step) => {
          const found = data.steps.find((s) => s.id === step.id);
          return found ? { ...step, position: found.position } : step;
        });
        return { ...old, results: updated };
      });
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) queryClient.setQueryData(queryKey, context.previous);
      toast.error('Erro ao reordenar etapas.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
