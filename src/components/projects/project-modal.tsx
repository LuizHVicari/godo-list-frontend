import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FieldGroup } from '@/components/ui/field';
import { FormInput, FormTextarea } from '@/components/ui/form';
import { useProjectForm } from '@/hooks/interactions/use-project-form';
import type { ProjectResponse } from '@/types/api';

interface ProjectModalProperties {
  mode: 'create' | 'edit';
  defaultValues?: ProjectResponse;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function ProjectModal({
  mode,
  defaultValues,
  open,
  onOpenChange,
  onSuccess,
}: ProjectModalProperties) {
  const { form, handleSubmit, isPending } = useProjectForm({
    mode,
    defaultValues,
    onSuccess,
    onOpenChange,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Novo Projeto' : 'Editar Projeto'}</DialogTitle>
        </DialogHeader>

        <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
          <FieldGroup>
            <FormInput
              control={form.control}
              id="project-name"
              label="Nome"
              name="name"
              placeholder="Nome do projeto"
            />
            <FormTextarea
              control={form.control}
              id="project-description"
              label="Descrição"
              name="description"
              placeholder="Descrição opcional"
              rows={3}
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
