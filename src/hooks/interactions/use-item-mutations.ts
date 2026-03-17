import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { createItem, deleteItem, repositionItems, updateItem } from '@/api/items';
import { queryKeys } from '@/hooks/query-keys';
import type {
  CreateItemRequest,
  ListItemsResponse,
  RepositionItemsRequest,
  UpdateItemRequest,
} from '@/types/api';

export function useCreateItem(projectId: string, stepId: string) {
  const queryClient = useQueryClient();
  const queryKey = queryKeys.items.all(projectId, stepId);

  return useMutation({
    mutationFn: (data: CreateItemRequest) => createItem(projectId, stepId, data),
    onSuccess: () => {
      toast.success('Item criado.');
    },
    onError: () => {
      toast.error('Erro ao criar item.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}

export function useUpdateItem(projectId: string, stepId: string) {
  const queryClient = useQueryClient();
  const queryKey = queryKeys.items.all(projectId, stepId);

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateItemRequest }) =>
      updateItem(projectId, stepId, id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<ListItemsResponse>(queryKey);
      queryClient.setQueryData<ListItemsResponse>(queryKey, (old) =>
        old
          ? { ...old, results: old.results.map((it) => (it.id === id ? { ...it, ...data } : it)) }
          : old,
      );
      return { previous };
    },
    onSuccess: () => {
      toast.success('Item atualizado.');
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) queryClient.setQueryData(queryKey, context.previous);
      toast.error('Erro ao atualizar item.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}

export function useDeleteItem(projectId: string, stepId: string) {
  const queryClient = useQueryClient();
  const queryKey = queryKeys.items.all(projectId, stepId);

  return useMutation({
    mutationFn: (id: string) => deleteItem(projectId, stepId, id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<ListItemsResponse>(queryKey);
      queryClient.setQueryData<ListItemsResponse>(queryKey, (old) =>
        old
          ? { ...old, results: old.results.filter((it) => it.id !== id), total: old.total - 1 }
          : old,
      );
      return { previous };
    },
    onSuccess: () => {
      toast.success('Item removido.');
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) queryClient.setQueryData(queryKey, context.previous);
      toast.error('Erro ao remover item.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}

export function useRepositionItems(projectId: string, stepId: string) {
  const queryClient = useQueryClient();
  const queryKey = queryKeys.items.all(projectId, stepId);

  return useMutation({
    mutationFn: (data: RepositionItemsRequest) => repositionItems(projectId, stepId, data),
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<ListItemsResponse>(queryKey);
      queryClient.setQueryData<ListItemsResponse>(queryKey, (old) => {
        if (!old) return old;
        const updated = old.results.map((item) => {
          const found = data.items.find((it) => it.id === item.id);
          return found ? { ...item, position: found.position } : item;
        });
        return { ...old, results: updated };
      });
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) queryClient.setQueryData(queryKey, context.previous);
      toast.error('Erro ao reordenar itens.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
