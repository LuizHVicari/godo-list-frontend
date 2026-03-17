import { DndContext, DragOverlay } from '@dnd-kit/core';
import { horizontalListSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { useKanbanDnd } from '@/hooks/interactions/use-kanban-dnd';
import type { StepResponse } from '@/types/api';

import { KanbanColumn } from './kanban-column';
import { KanbanItemCard } from './kanban-item-card';
import { StepModal } from './step-modal';

interface KanbanBoardProperties {
  projectId: string;
  steps: StepResponse[];
}

export function KanbanBoard({ projectId, steps }: KanbanBoardProperties) {
  const [isCreateStepOpen, setIsCreateStepOpen] = useState(false);
  const { activeItem, sensors, handleDragStart, handleDragEnd } = useKanbanDnd(projectId, steps);

  return (
    <>
      <DndContext sensors={sensors} onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          <SortableContext items={steps.map((s) => s.id)} strategy={horizontalListSortingStrategy}>
            {steps.map((step) => (
              <KanbanColumn key={step.id} projectId={projectId} step={step} />
            ))}
          </SortableContext>

          <div className="flex w-72 shrink-0 items-start">
            <Button className="w-full" variant="outline" onClick={() => setIsCreateStepOpen(true)}>
              <PlusIcon />
              Nova Etapa
            </Button>
          </div>
        </div>

        <DragOverlay>
          {activeItem && (
            <KanbanItemCard
              className="rotate-2 shadow-lg"
              item={activeItem}
              onEdit={() => undefined}
            />
          )}
        </DragOverlay>
      </DndContext>

      <StepModal
        mode="create"
        open={isCreateStepOpen}
        projectId={projectId}
        onOpenChange={setIsCreateStepOpen}
      />
    </>
  );
}
