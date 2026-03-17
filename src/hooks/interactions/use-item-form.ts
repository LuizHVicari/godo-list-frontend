import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useCreateItem, useUpdateItem } from '@/hooks/interactions/use-item-mutations';
import type { ItemResponse } from '@/types/api';

const itemSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  priority: z.enum(['none', 'low', 'medium', 'high', 'critical'] as const),
  is_completed: z.boolean(),
});

export type ItemFormValues = z.infer<typeof itemSchema>;

interface UseItemFormOptions {
  projectId: string;
  stepId: string;
  mode: 'create' | 'edit';
  defaultValues?: ItemResponse;
  onSuccess?: () => void;
  onOpenChange: (open: boolean) => void;
}

export function useItemForm({
  projectId,
  stepId,
  mode,
  defaultValues,
  onSuccess,
  onOpenChange,
}: UseItemFormOptions) {
  const createItem = useCreateItem(projectId, stepId);
  const updateItem = useUpdateItem(projectId, stepId);

  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      description: defaultValues?.description ?? '',
      priority: defaultValues?.priority ?? 'none',
      is_completed: defaultValues?.is_completed ?? false,
    },
  });

  function handleSubmit(values: ItemFormValues) {
    if (mode === 'create') {
      createItem.mutate(values, {
        onSuccess: () => {
          form.reset();
          onOpenChange(false);
          onSuccess?.();
        },
      });
      return;
    }

    if (!defaultValues) return;

    updateItem.mutate(
      { id: defaultValues.id, data: { ...values, position: defaultValues.position } },
      {
        onSuccess: () => {
          onOpenChange(false);
          onSuccess?.();
        },
      },
    );
  }

  const isPending = createItem.isPending || updateItem.isPending;

  return { form, handleSubmit, isPending };
}
