import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowLeftIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { KanbanBoard } from '@/components/kanban/kanban-board';
import { useFindProject } from '@/hooks/data/use-project';
import { useListSteps } from '@/hooks/data/use-steps';

export const Route = createFileRoute('/_protected/projects/$projectId')({
  component: ProjectKanbanPage,
});

function ProjectKanbanPage() {
  const { projectId } = Route.useParams();
  const { data: project } = useFindProject(projectId);
  const { data: stepsData, isLoading } = useListSteps(projectId);

  const steps = stepsData?.results ?? [];

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex items-center gap-3">
        <Button asChild size="icon-sm" variant="ghost">
          <Link to="/projects">
            <ArrowLeftIcon />
          </Link>
        </Button>
        <h1 className="text-xl font-semibold">{project?.name ?? '...'}</h1>
      </div>

      {isLoading ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-64 w-72 shrink-0" />
          ))}
        </div>
      ) : (
        <KanbanBoard projectId={projectId} steps={steps} />
      )}
    </div>
  );
}
