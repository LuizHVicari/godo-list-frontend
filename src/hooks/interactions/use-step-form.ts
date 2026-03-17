import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useCreateStep, useUpdateStep } from '@/hooks/interactions/use-step-mutations';
import type { StepResponse } from '@/types/api';

const stepSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
});

export type StepFormValues = z.infer<typeof stepSchema>;

interface UseStepFormOptions {
  projectId: string;
  mode: 'create' | 'edit';
  defaultValues?: StepResponse;
  onSuccess?: () => void;
  onOpenChange: (open: boolean) => void;
}

export function useStepForm({
  projectId,
  mode,
  defaultValues,
  onSuccess,
  onOpenChange,
}: UseStepFormOptions) {
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
      return;
    }

    if (!defaultValues) return;

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

  const isPending = createStep.isPending || updateStep.isPending;

  return { form, handleSubmit, isPending };
}
