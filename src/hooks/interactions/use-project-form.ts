import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useCreateProject, useUpdateProject } from '@/hooks/interactions/use-project-mutations';
import type { ProjectResponse } from '@/types/api';

const projectSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;

interface UseProjectFormOptions {
  mode: 'create' | 'edit';
  defaultValues?: ProjectResponse;
  onSuccess?: () => void;
  onOpenChange: (open: boolean) => void;
}

export function useProjectForm({
  mode,
  defaultValues,
  onSuccess,
  onOpenChange,
}: UseProjectFormOptions) {
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      description: defaultValues?.description ?? '',
    },
  });

  function handleSubmit(values: ProjectFormValues) {
    if (mode === 'create') {
      createProject.mutate(values, {
        onSuccess: () => {
          form.reset();
          onOpenChange(false);
          onSuccess?.();
        },
      });
      return;
    }

    if (!defaultValues) return;

    updateProject.mutate(
      { id: defaultValues.id, data: values },
      {
        onSuccess: () => {
          onOpenChange(false);
          onSuccess?.();
        },
      },
    );
  }

  const isPending = createProject.isPending || updateProject.isPending;

  return { form, handleSubmit, isPending };
}
