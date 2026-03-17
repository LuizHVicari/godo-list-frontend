import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cva, type VariantProps } from 'class-variance-authority';
import { GripVerticalIcon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utilities';
import type { ItemPriority, ItemResponse } from '@/types/api';

const priorityVariants = cva('', {
  variants: {
    priority: {
      none: 'bg-muted text-muted-foreground',
      low: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
      high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
      critical: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    },
  },
  defaultVariants: { priority: 'none' },
});

const priorityLabels: Record<ItemPriority, string> = {
  none: 'Nenhuma',
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
  critical: 'Crítica',
};

interface KanbanItemCardProperties
  extends React.ComponentProps<typeof Card>, VariantProps<typeof priorityVariants> {
  item: ItemResponse;
  onEdit: () => void;
}

export function KanbanItemCard({ item, onEdit, className, ...rest }: KanbanItemCardProperties) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
    data: { type: 'item', item },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      className={cn(
        'cursor-grab touch-none transition-shadow hover:shadow-md active:cursor-grabbing',
        className,
      )}
      style={style}
      {...attributes}
      {...listeners}
      {...rest}
    >
      <CardContent className="flex items-start gap-2 p-3" onClick={onEdit}>
        <GripVerticalIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

        <div className="min-w-0 flex-1 space-y-1">
          <p
            className={cn(
              'text-sm leading-snug font-medium',
              item.is_completed && 'text-muted-foreground line-through',
            )}
          >
            {item.name}
          </p>

          {item.description && (
            <p className="line-clamp-2 text-xs text-muted-foreground">{item.description}</p>
          )}

          {item.priority !== 'none' && (
            <Badge className={cn('text-xs', priorityVariants({ priority: item.priority }))}>
              {priorityLabels[item.priority]}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
