import { useState } from 'react';

import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { PlusIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ProjectCard } from '@/components/projects/project-card';
import { ProjectModal } from '@/components/projects/project-modal';
import { useListProjects } from '@/hooks/data/use-projects';
import { useDeleteProject } from '@/hooks/interactions/use-project-mutations';
import type { ProjectResponse } from '@/types/api';

export const Route = createFileRoute('/_protected/projects/')({
  component: ProjectsPage,
});

function ProjectsPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useListProjects();
  const deleteProject = useDeleteProject();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectResponse | null>(null);

  const projects = data?.results ?? [];

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-8 w-36" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Projetos</h1>
        <Button onClick={() => setIsCreateOpen(true)}>
          <PlusIcon />
          Novo Projeto
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center text-muted-foreground">
          <p className="text-lg font-medium">Nenhum projeto ainda.</p>
          <p className="mt-1 text-sm">Clique em &quot;Novo Projeto&quot; para começar!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() =>
                navigate({
                  to: '/projects/$projectId',
                  params: { projectId: project.id },
                })
              }
              onDelete={() => deleteProject.mutate(project.id)}
              onEdit={() => setEditingProject(project)}
            />
          ))}
        </div>
      )}

      <ProjectModal
        mode="create"
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />

      {editingProject && (
        <ProjectModal
          key={editingProject.id}
          defaultValues={editingProject}
          mode="edit"
          open={true}
          onOpenChange={(open) => !open && setEditingProject(null)}
        />
      )}
    </div>
  );
}
