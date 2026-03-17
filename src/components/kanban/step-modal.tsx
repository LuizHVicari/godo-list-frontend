import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
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
  useCreateStep,
  useUpdateStep,
} from '@/hooks/interactions/use-step-mutations';
import type { StepResponse } from '@/types/api';

const stepSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
});

type StepFormValues = z.infer<typeof stepSchema>;

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
  const createStep = useCreateStep(projectId);
  const updateStep = useUpdateStep(projectId);

  const form = useForm<StepFormValues>({
    resolver: zodResolver(stepSchema),
    defaultValues: { name: defaultValues?.name ?? '' },
  });

  function handleSubmit(values: StepFormValues) {
    if (mode === 'create') {
      createStep.mutate(values, {
        onSuccess: () => {
          form.reset();
          onOpenChange(false);
          onSuccess?.();
        },
      });
    } else if (defaultValues) {
      updateStep.mutate(
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

  const isPending = createStep.isPending || updateStep.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Nova Etapa' : 'Editar Etapa'}</DialogTitle>
        </DialogHeader>

        <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
          <FieldGroup>
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="step-name">Nome</FieldLabel>
                  <Input
                    id="step-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="Nome da etapa"
                    {...field}
                  />
                  <FieldError errors={[fieldState.error]} />
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
