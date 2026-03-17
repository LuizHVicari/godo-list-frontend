import { useState } from 'react';

import {
  DndContext,
  type DragEndEvent,
  type DragStartEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, horizontalListSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import { useQueryClient } from '@tanstack/react-query';
import { PlusIcon } from 'lucide-react';
import { toast } from 'sonner';

import { repositionItems, updateItem as updateItemApi } from '@/api/items';
import { Button } from '@/components/ui/button';
import { itemQueryKeys } from '@/hooks/data/use-items';
import { useRepositionSteps } from '@/hooks/interactions/use-step-mutations';
import type { ItemResponse, ListItemsResponse, RepositionItemsRequest, StepResponse } from '@/types/api';

import { KanbanColumn } from './kanban-column';
import { KanbanItemCard } from './kanban-item-card';
import { StepModal } from './step-modal';

interface KanbanBoardProperties {
  projectId: string;
  steps: StepResponse[];
}

export function KanbanBoard({ projectId, steps }: KanbanBoardProperties) {
  const [isCreateStepOpen, setIsCreateStepOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<ItemResponse | null>(null);

  const queryClient = useQueryClient();
  const repositionStepsMutation = useRepositionSteps(projectId);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const stepIds = steps.map((step) => step.id);

  function handleDragStart(event: DragStartEvent) {
    const data = event.active.data.current;
    if (data?.type === 'item') setActiveItem(data.item as ItemResponse);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveItem(null);

    if (!over || active.id === over.id) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    if (activeData?.type === 'step' && overData?.type === 'step') {
      const oldIndex = steps.findIndex((s) => s.id === active.id);
      const newIndex = steps.findIndex((s) => s.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return;

      const reordered = arrayMove(steps, oldIndex, newIndex);
      repositionStepsMutation.mutate({
        steps: reordered.map((s, index) => ({ id: s.id, position: index + 1 })),
      });
      return;
    }

    if (activeData?.type === 'item') {
      const activeItemData = activeData.item as ItemResponse;
      const sourceStepId = activeItemData.step_id;

      let targetStepId: string;
      if (overData?.type === 'item') {
        targetStepId = (overData.item as ItemResponse).step_id;
      } else if (overData?.type === 'step') {
        targetStepId = over.id as string;
      } else {
        return;
      }

      if (sourceStepId === targetStepId) {
        const queryKey = itemQueryKeys.all(projectId, sourceStepId);
        const cached = queryClient.getQueryData<ListItemsResponse>(queryKey);
        if (!cached) return;

        const sorted = [...cached.results].sort((a, b) => a.position - b.position);
        const oldIndex = sorted.findIndex((it) => it.id === active.id);
        const newIndex = sorted.findIndex((it) => it.id === over.id);
        if (oldIndex === -1 || newIndex === -1) return;

        const reordered = arrayMove(sorted, oldIndex, newIndex);
        const repositionData: RepositionItemsRequest = {
          items: reordered.map((it, index) => ({ id: it.id, position: index + 1 })),
        };

        queryClient.setQueryData<ListItemsResponse>(queryKey, (old) => {
          if (!old) return old;
          const updated = old.results.map((item) => {
            const found = repositionData.items.find((it) => it.id === item.id);
            return found ? { ...item, position: found.position } : item;
          });
          return { ...old, results: updated };
        });

        repositionItems(projectId, sourceStepId, repositionData)
          .then(() => queryClient.invalidateQueries({ queryKey }))
          .catch(() => {
            queryClient.invalidateQueries({ queryKey });
            toast.error('Erro ao reordenar itens.');
          });
      } else {
        const sourceKey = itemQueryKeys.all(projectId, sourceStepId);
        const targetKey = itemQueryKeys.all(projectId, targetStepId);

        const targetCached = queryClient.getQueryData<ListItemsResponse>(targetKey);
        const targetItems = targetCached
          ? [...targetCached.results].sort((a, b) => a.position - b.position)
          : [];

        const maxPosition = targetItems.reduce((max, it) => Math.max(max, it.position), 0);
        const insertPosition = maxPosition + 1;

        queryClient.setQueryData<ListItemsResponse>(sourceKey, (old) =>
          old
            ? { ...old, results: old.results.filter((it) => it.id !== activeItemData.id), total: old.total - 1 }
            : old,
        );
        queryClient.setQueryData<ListItemsResponse>(targetKey, (old) => {
          const entry = { ...activeItemData, step_id: targetStepId, position: insertPosition };
          if (!old) return { total: 1, results: [entry] };
          return { ...old, total: old.total + 1, results: [...old.results, entry] };
        });

        updateItemApi(projectId, sourceStepId, activeItemData.id, {
          name: activeItemData.name,
          description: activeItemData.description,
          priority: activeItemData.priority,
          is_completed: activeItemData.is_completed,
          position: insertPosition,
          step_id: targetStepId,
        })
          .catch(() => toast.error('Erro ao mover item.'))
          .finally(() => {
            queryClient.invalidateQueries({ queryKey: sourceKey });
            queryClient.invalidateQueries({ queryKey: targetKey });
          });
      }
    }
  }

  return (
    <>
      <DndContext sensors={sensors} onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          <SortableContext items={stepIds} strategy={horizontalListSortingStrategy}>
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
            <KanbanItemCard className="rotate-2 shadow-lg" item={activeItem} onEdit={() => undefined} />
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
