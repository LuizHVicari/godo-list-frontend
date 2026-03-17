import { useState } from 'react';

import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  GripVerticalIcon,
  MoreHorizontalIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { useListItems } from '@/hooks/data/use-items';
import { useDeleteStep } from '@/hooks/interactions/use-step-mutations';
import type { ItemResponse, StepResponse } from '@/types/api';

import { ItemModal } from './item-modal';
import { KanbanItemCard } from './kanban-item-card';
import { StepModal } from './step-modal';

interface KanbanColumnProperties {
  projectId: string;
  step: StepResponse;
}

export function KanbanColumn({ projectId, step }: KanbanColumnProperties) {
  const [isCreateItemOpen, setIsCreateItemOpen] = useState(false);
  const [isEditStepOpen, setIsEditStepOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ItemResponse | null>(null);

  const { data: itemsData, isLoading } = useListItems(projectId, step.id);
  const deleteStep = useDeleteStep(projectId);

  const items = itemsData?.results ?? [];
  const itemIds = items.map((item) => item.id);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: step.id,
    data: { type: 'step', step },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <>
      <div
        ref={setNodeRef}
        className="flex w-72 shrink-0 flex-col rounded-lg border bg-muted/40"
        style={style}
      >
        <div className="flex items-center gap-2 border-b px-3 py-2">
          <button
            className="touch-none text-muted-foreground hover:text-foreground"
            type="button"
            {...attributes}
            {...listeners}
          >
            <GripVerticalIcon className="size-4" />
          </button>

          <span className="flex-1 truncate text-sm font-semibold">{step.name}</span>

          <Badge variant="secondary">{items.length}</Badge>

          <Button
            className="size-6"
            size="icon-xs"
            variant="ghost"
            onClick={() => setIsCreateItemOpen(true)}
          >
            <PlusIcon />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="size-6" size="icon-xs" variant="ghost">
                <MoreHorizontalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditStepOpen(true)}>
                <PencilIcon />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => deleteStep.mutate(step.id)}
              >
                <Trash2Icon />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-col gap-2 p-2">
          {isLoading ? (
            <>
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </>
          ) : (
            <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
                {items.map((item) => (
                  <KanbanItemCard
                    key={item.id}
                    item={item}
                    onEdit={() => setEditingItem(item)}
                  />
                ))}
              </SortableContext>
          )}
        </div>
      </div>

      <ItemModal
        mode="create"
        open={isCreateItemOpen}
        projectId={projectId}
        stepId={step.id}
        onOpenChange={setIsCreateItemOpen}
      />

      <StepModal
        defaultValues={step}
        mode="edit"
        open={isEditStepOpen}
        projectId={projectId}
        onOpenChange={setIsEditStepOpen}
      />

      {editingItem && (
        <ItemModal
          key={editingItem.id}
          defaultValues={editingItem}
          mode="edit"
          open={true}
          projectId={projectId}
          stepId={step.id}
          onOpenChange={(open) => !open && setEditingItem(null)}
        />
      )}
    </>
  );
}
