import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FieldGroup } from '@/components/ui/field';
import { FormCheckbox, FormInput, FormSelect, FormTextarea } from '@/components/ui/form';
import { useItemForm } from '@/hooks/interactions/use-item-form';
import type { ItemPriority, ItemResponse } from '@/types/api';

const priorityOptions: { value: ItemPriority; label: string }[] = [
  { value: 'none', label: 'Nenhuma' },
  { value: 'low', label: 'Baixa' },
  { value: 'medium', label: 'Média' },
  { value: 'high', label: 'Alta' },
  { value: 'critical', label: 'Crítica' },
];

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
  const { form, handleSubmit, isPending } = useItemForm({
    projectId,
    stepId,
    mode,
    defaultValues,
    onSuccess,
    onOpenChange,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Novo Item' : 'Editar Item'}</DialogTitle>
        </DialogHeader>

        <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
          <FieldGroup>
            <FormInput
              control={form.control}
              id="item-name"
              label="Nome"
              name="name"
              placeholder="Nome do item"
            />
            <FormTextarea
              control={form.control}
              id="item-description"
              label="Descrição"
              name="description"
              placeholder="Descrição opcional"
              rows={3}
            />
            <FormSelect
              control={form.control}
              label="Prioridade"
              name="priority"
              options={priorityOptions}
            />
            <FormCheckbox
              control={form.control}
              id="item-completed"
              label="Concluído"
              name="is_completed"
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
