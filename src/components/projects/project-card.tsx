import { MoreHorizontalIcon, PencilIcon, Trash2Icon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { ProjectResponse } from '@/types/api';

interface ProjectCardProperties extends React.ComponentProps<typeof Card> {
  project: ProjectResponse;
  onEdit: () => void;
  onDelete: () => void;
  onClick: () => void;
}

export function ProjectCard({
  project,
  onEdit,
  onDelete,
  onClick,
  ...rest
}: ProjectCardProperties) {
  return (
    <Card className="cursor-pointer transition-shadow hover:shadow-md" {...rest}>
      <CardHeader className="flex-row items-start justify-between gap-2">
        <div className="flex-1 space-y-1" onClick={onClick}>
          <CardTitle className="text-base">{project.name}</CardTitle>
          {project.description && (
            <CardDescription className="line-clamp-2">{project.description}</CardDescription>
          )}
          <p className="text-xs text-muted-foreground">
            {new Date(project.created_at).toLocaleDateString('pt-BR')}
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="size-7 shrink-0" size="icon-sm" variant="ghost">
              <MoreHorizontalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <PencilIcon />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={onDelete}>
              <Trash2Icon />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
    </Card>
  );
}
