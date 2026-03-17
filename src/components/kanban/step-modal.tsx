import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FieldGroup } from '@/components/ui/field';
import { FormInput } from '@/components/ui/form';
import { useStepForm } from '@/hooks/interactions/use-step-form';
import type { StepResponse } from '@/types/api';

interface StepModalProperties {
  projectId: string;
  mode: 'create' | 'edit';
  defaultValues?: StepResponse;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function StepModal({
  projectId,
  mode,
  defaultValues,
  open,
  onOpenChange,
  onSuccess,
}: StepModalProperties) {
  const { form, handleSubmit, isPending } = useStepForm({
    projectId,
    mode,
    defaultValues,
    onSuccess,
    onOpenChange,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Nova Etapa' : 'Editar Etapa'}</DialogTitle>
        </DialogHeader>

        <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
          <FieldGroup>
            <FormInput
              control={form.control}
              id="step-name"
              label="Nome"
              name="name"
              placeholder="Nome da etapa"
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
