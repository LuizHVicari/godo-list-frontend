import { useState } from 'react';

import { type DragEndEvent, type DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { repositionItems, updateItem as updateItemApi } from '@/api/items';
import { queryKeys } from '@/hooks/query-keys';
import { useRepositionSteps } from '@/hooks/interactions/use-step-mutations';
import type { ItemResponse, ListItemsResponse, RepositionItemsRequest, StepResponse } from '@/types/api';

function resolveTargetStepId(
  overData: Record<string, unknown> | undefined,
  overId: string,
): string | null {
  if (overData?.type === 'item') return (overData.item as ItemResponse).step_id;
  if (overData?.type === 'step') return overId;
  return null;
}

export function useKanbanDnd(projectId: string, steps: StepResponse[]) {
  const [activeItem, setActiveItem] = useState<ItemResponse | null>(null);

  const queryClient = useQueryClient();
  const repositionStepsMutation = useRepositionSteps(projectId);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  function handleDragStart(event: DragStartEvent) {
    const data = event.active.data.current;
    if (data?.type === 'item') setActiveItem(data.item as ItemResponse);
  }

  async function handleStepReorder(activeId: string, overId: string) {
    const oldIndex = steps.findIndex((s) => s.id === activeId);
    const newIndex = steps.findIndex((s) => s.id === overId);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(steps, oldIndex, newIndex);
    repositionStepsMutation.mutate({
      steps: reordered.map((s, index) => ({ id: s.id, position: index + 1 })),
    });
  }

  async function handleItemReorderSameColumn(
    activeId: string,
    overId: string,
    stepId: string,
  ) {
    const queryKey = queryKeys.items.all(projectId, stepId);
    const cached = queryClient.getQueryData<ListItemsResponse>(queryKey);
    if (!cached) return;

    const sorted = [...cached.results].sort((a, b) => a.position - b.position);
    const oldIndex = sorted.findIndex((it) => it.id === activeId);
    const newIndex = sorted.findIndex((it) => it.id === overId);
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

    try {
      await repositionItems(projectId, stepId, repositionData);
      await queryClient.invalidateQueries({ queryKey });
    } catch {
      queryClient.invalidateQueries({ queryKey });
      toast.error('Erro ao reordenar itens.');
    }
  }

  async function handleItemMoveToColumn(item: ItemResponse, targetStepId: string) {
    const sourceKey = queryKeys.items.all(projectId, item.step_id);
    const targetKey = queryKeys.items.all(projectId, targetStepId);

    const targetCached = queryClient.getQueryData<ListItemsResponse>(targetKey);
    const targetItems = targetCached
      ? [...targetCached.results].sort((a, b) => a.position - b.position)
      : [];

    const insertPosition = targetItems.reduce((max, it) => Math.max(max, it.position), 0) + 1;

    queryClient.setQueryData<ListItemsResponse>(sourceKey, (old) =>
      old ? { ...old, results: old.results.filter((it) => it.id !== item.id), total: old.total - 1 } : old,
    );
    queryClient.setQueryData<ListItemsResponse>(targetKey, (old) => {
      const entry = { ...item, step_id: targetStepId, position: insertPosition };
      if (!old) return { total: 1, results: [entry] };
      return { ...old, total: old.total + 1, results: [...old.results, entry] };
    });

    try {
      await updateItemApi(projectId, item.step_id, item.id, {
        name: item.name,
        description: item.description,
        priority: item.priority,
        is_completed: item.is_completed,
        position: insertPosition,
        step_id: targetStepId,
      });
    } catch {
      toast.error('Erro ao mover item.');
    } finally {
      queryClient.invalidateQueries({ queryKey: sourceKey });
      queryClient.invalidateQueries({ queryKey: targetKey });
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveItem(null);

    if (!over || active.id === over.id) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    if (activeData?.type === 'step' && overData?.type === 'step') {
      await handleStepReorder(active.id as string, over.id as string);
      return;
    }

    if (activeData?.type !== 'item') return;

    const activeItemData = activeData.item as ItemResponse;
    const targetStepId = resolveTargetStepId(
      overData as Record<string, unknown> | undefined,
      over.id as string,
    );
    if (!targetStepId) return;

    if (activeItemData.step_id === targetStepId) {
      await handleItemReorderSameColumn(active.id as string, over.id as string, targetStepId);
      return;
    }

    await handleItemMoveToColumn(activeItemData, targetStepId);
  }

  return { activeItem, sensors, handleDragStart, handleDragEnd };
}
