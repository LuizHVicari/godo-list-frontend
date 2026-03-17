import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  useCreateItem,
  useUpdateItem,
} from '@/hooks/interactions/use-item-mutations';
import type { ItemPriority, ItemResponse } from '@/types/api';

const itemSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  priority: z.enum(['none', 'low', 'medium', 'high', 'critical'] as const),
  is_completed: z.boolean(),
});

type ItemFormValues = z.infer<typeof itemSchema>;

const priorityLabels: Record<ItemPriority, string> = {
  none: 'Nenhuma',
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
  critical: 'Crítica',
};

interface ItemModalProperties {
  projectId: string;
  stepId: string;
  mode: 'create' | 'edit';
  defaultValues?: ItemResponse;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function ItemModal({
  projectId,
  stepId,
  mode,
  defaultValues,
  open,
  onOpenChange,
  onSuccess,
}: ItemModalProperties) {
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
    } else if (defaultValues) {
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
  }

  const isPending = createItem.isPending || updateItem.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Novo Item' : 'Editar Item'}</DialogTitle>
        </DialogHeader>

        <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
          <FieldGroup>
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="item-name">Nome</FieldLabel>
                  <Input
                    id="item-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="Nome do item"
                    {...field}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="item-description">Descrição</FieldLabel>
                  <Textarea
                    id="item-description"
                    aria-invalid={fieldState.invalid}
                    placeholder="Descrição opcional"
                    rows={3}
                    {...field}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="priority"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Prioridade</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger aria-invalid={fieldState.invalid}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(
                        ['none', 'low', 'medium', 'high', 'critical'] as ItemPriority[]
                      ).map((priority) => (
                        <SelectItem key={priority} value={priority}>
                          {priorityLabels[priority]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="is_completed"
              render={({ field }) => (
                <Field>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={field.value}
                      id="item-completed"
                      onCheckedChange={field.onChange}
                    />
                    <FieldLabel htmlFor="item-completed">Concluído</FieldLabel>
                  </div>
                </Field>
              )}
            />
          </FieldGroup>

          <DialogFooter>
            <Button disabled={isPending} type="submit">
              {mode === 'create' ? 'Criar' : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
