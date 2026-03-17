# Godo List Frontend — Plano de Implementação

## Status da Implementação

### ✅ Concluído

#### Dependências instaladas
- `zustand`, `@tanstack/react-query`, `@hookform/resolvers`, `react-hook-form`, `zod`
- `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`, `ky`, `sonner`, `next-themes`
- shadcn components: `input`, `label`, `card`, `dialog`, `select`, `badge`, `avatar`, `dropdown-menu`, `sonner`, `skeleton`, `separator`, `textarea`, `checkbox`, `field`

#### Arquivos criados
- `src/types/api.ts` — interfaces TypeScript completas
- `src/stores/auth.store.ts` — zustand com persist
- `src/api/client.ts` — instância ky com hook 401
- `src/api/auth.ts` — signIn / signUp / signOut
- `src/api/projects.ts` — CRUD projects
- `src/api/steps.ts` — CRUD + reposition steps
- `src/api/items.ts` — CRUD + reposition items
- `src/hooks/data/use-projects.ts`
- `src/hooks/data/use-project.ts`
- `src/hooks/data/use-steps.ts`
- `src/hooks/data/use-items.ts`
- `src/hooks/interactions/use-auth-mutations.ts`
- `src/hooks/interactions/use-project-mutations.ts`
- `src/hooks/interactions/use-step-mutations.ts` — com UI otimista
- `src/hooks/interactions/use-item-mutations.ts` — com UI otimista
- `src/providers/query-provider.tsx`
- `src/components/layout/header.tsx`
- `src/components/layout/app-layout.tsx`
- `src/components/projects/project-card.tsx`
- `src/components/projects/project-modal.tsx`
- `src/components/kanban/step-modal.tsx`
- `src/components/kanban/item-modal.tsx`
- `src/components/kanban/kanban-item-card.tsx`
- `src/components/kanban/kanban-column.tsx` — com DndContext interno para itens
- `src/components/kanban/kanban-board.tsx` — DndContext externo para steps

### ❌ Falta Criar

#### Rotas
- `src/routes/__root.tsx` — **ATUALIZAR**: adicionar QueryProvider + Sonner Toaster
- `src/routes/index.tsx` — **ATUALIZAR**: redirect baseado em isAuthenticated
- `src/routes/_auth.tsx` — layout centralizado para auth
- `src/routes/_auth/sign-in.tsx`
- `src/routes/_auth/sign-up.tsx`
- `src/routes/_protected.tsx` — auth guard + AppLayout
- `src/routes/_protected/projects.tsx` — grid de projetos
- `src/routes/_protected/projects.$projectId.tsx` — kanban

---

## Detalhes de Implementação Pendente

### `src/routes/__root.tsx` — Atualizar

```tsx
import { TanStackDevtools } from '@tanstack/react-devtools';
import { createRootRoute, HeadContent, Outlet, Scripts } from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';

import { QueryProvider } from '@/providers/query-provider';
import { Toaster } from '@/components/ui/sonner';
import appCss from '../styles.css?url';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Godo List' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  shellComponent: RootDocument,
  component: () => (
    <QueryProvider>
      <Outlet />
      <Toaster />
    </QueryProvider>
  ),
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head><HeadContent /></head>
      <body>
        {children}
        <TanStackDevtools config={{ position: 'bottom-right' }} plugins={[{ name: 'Tanstack Router', render: <TanStackRouterDevtoolsPanel /> }]} />
        <Scripts />
      </body>
    </html>
  );
}
```

### `src/routes/index.tsx` — Atualizar

```tsx
import { createFileRoute, redirect } from '@tanstack/react-router';
import { useAuthStore } from '@/stores/auth.store';

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated;
    throw redirect({ to: isAuthenticated ? '/projects' : '/sign-in' });
  },
  component: () => null,
});
```

### `src/routes/_auth.tsx`

```tsx
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth')({
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">Godo List</h1>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
```

### `src/routes/_auth/sign-in.tsx`

```tsx
import { createFileRoute, Link } from '@tanstack/react-router';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useSignIn } from '@/hooks/interactions/use-auth-mutations';

const signInSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});
type SignInFormValues = z.infer<typeof signInSchema>;

export const Route = createFileRoute('/_auth/sign-in')({
  component: SignInPage,
});

function SignInPage() {
  const { mutate: signIn, isPending } = useSignIn();
  const form = useForm<SignInFormValues>({ resolver: zodResolver(signInSchema) });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Entrar</CardTitle>
        <CardDescription>Acesse sua conta</CardDescription>
      </CardHeader>
      <form onSubmit={form.handleSubmit((values) => signIn(values))}>
        <CardContent>
          <FieldGroup>
            <Controller control={form.control} name="email" render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input id="email" type="email" aria-invalid={fieldState.invalid} placeholder="voce@exemplo.com" {...field} />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )} />
            <Controller control={form.control} name="password" render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="password">Senha</FieldLabel>
                <Input id="password" type="password" aria-invalid={fieldState.invalid} placeholder="••••••" {...field} />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )} />
          </FieldGroup>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button className="w-full" disabled={isPending} type="submit">Entrar</Button>
          <p className="text-sm text-muted-foreground">
            Não tem conta? <Link className="underline" to="/sign-up">Criar conta</Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
```

### `src/routes/_auth/sign-up.tsx`

```tsx
// Mesmo padrão do sign-in, mas usando useSignUp e texto "Criar Conta"
// Link para /sign-in no rodapé
```

### `src/routes/_protected.tsx`

```tsx
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { AppLayout } from '@/components/layout/app-layout';
import { useAuthStore } from '@/stores/auth.store';

export const Route = createFileRoute('/_protected')({
  beforeLoad: () => {
    if (!useAuthStore.getState().isAuthenticated) {
      throw redirect({ to: '/sign-in' });
    }
  },
  component: () => <AppLayout />,
});
```

### `src/routes/_protected/projects.tsx`

```tsx
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

export const Route = createFileRoute('/_protected/projects')({
  component: ProjectsPage,
});

function ProjectsPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useListProjects();
  const deleteProject = useDeleteProject();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectResponse | null>(null);

  const projects = data?.data ?? [];

  if (isLoading) {
    return (
      <div className="p-6">
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
          <PlusIcon /> Novo Projeto
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
          <p className="text-lg">Nenhum projeto ainda.</p>
          <p className="text-sm">Crie seu primeiro projeto!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => navigate({ to: '/projects/$projectId', params: { projectId: project.id } })}
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
```

### `src/routes/_protected/projects.$projectId.tsx`

```tsx
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

  const steps = stepsData?.data ?? [];

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex items-center gap-3">
        <Button asChild size="icon-sm" variant="ghost">
          <Link to="/projects"><ArrowLeftIcon /></Link>
        </Button>
        <h1 className="text-xl font-semibold">{project?.name ?? '...'}</h1>
      </div>

      {isLoading ? (
        <div className="flex gap-4">
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
```

---

## Observações Importantes

### Formulários (nova abordagem shadcn radix-nova)
- NÃO existe `Form` wrapper como no shadcn antigo
- Usar `Field`, `FieldLabel`, `FieldError`, `FieldGroup` do `src/components/ui/field.tsx`
- Usar `Controller` do react-hook-form com `zodResolver`
- Padrão:
```tsx
<Controller
  control={form.control}
  name="fieldName"
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor="id">Label</FieldLabel>
      <Input id="id" aria-invalid={fieldState.invalid} {...field} />
      <FieldError errors={[fieldState.error]} />
    </Field>
  )}
/>
```

### KanbanColumn — DndContext Aninhado
- O `kanban-column.tsx` tem seu próprio `DndContext` para itens (aninhado no board)
- O `useSortable` da coluna registra no DndContext do board (externo)
- O `useSortable` dos itens registra no DndContext da coluna (interno)
- A coluna precisa do `useRepositionItems` hook para persistir a ordem

### Sonner + next-themes
- O `src/components/ui/sonner.tsx` usa `useTheme` do `next-themes`
- `next-themes` já está no node_modules (como dep transitiva)
- O `ThemeProvider` do `next-themes` NÃO precisa ser adicionado se não houver toggle de tema
- Se der erro de `useTheme`, substituir o Toaster por: `<Sonner theme="light" ... />`

### ESLint `unicorn/prevent-abbreviations`
- Evitar: `params`, `props` (spread), `err`, `cb`, `fn`, `ref`, `res`, `req`
- Usar: `parameters`, `{ ...rest }`, `error`, `callback`, `handler`, `reference`, `response`, `request`
- Arquivos em `src/components/ui/**` são ignorados pelo ESLint

### Prettier
- `semi: true` — usar ponto-e-vírgula
- `singleQuote: true` — aspas simples em JS/TS
- `printWidth: 100`

### TanStack Start (SSR)
- O `__root.tsx` usa `shellComponent` para a estrutura HTML
- Adicionar `component` com QueryProvider + Outlet + Toaster
- Em `client.ts`, o hook 401 já tem guard `typeof window !== 'undefined'`

### Rota `_auth` e `_protected` — Nomenclatura TanStack Router
- `_auth.tsx` → layout sem path (pathless layout)
- `_auth/sign-in.tsx` → path `/sign-in`
- `_auth/sign-up.tsx` → path `/sign-up`
- `_protected.tsx` → layout sem path com `beforeLoad` guard
- `_protected/projects.tsx` → path `/projects`
- `_protected/projects.$projectId.tsx` → path `/projects/$projectId`

### KanbanColumn — precisa de DndContext interno para itens
```tsx
// Dentro de KanbanColumn, após o useSortable para a coluna:
const repositionItems = useRepositionItems(projectId, step.id);

function handleItemDragEnd(event: DragEndEvent) {
  const { active, over } = event;
  if (!over || active.id === over.id) return;
  const oldIndex = items.findIndex((item) => item.id === active.id);
  const newIndex = items.findIndex((item) => item.id === over.id);
  if (oldIndex === -1 || newIndex === -1) return;
  const reordered = arrayMove(items, oldIndex, newIndex);
  repositionItems.mutate({
    items: reordered.map((item, index) => ({ id: item.id, position: index + 1 })),
  });
}

// No JSX da coluna, envolver os itens com:
<DndContext sensors={sensors} onDragEnd={handleItemDragEnd}>
  <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
    {items.map((item) => (
      <KanbanItemCard key={item.id} item={item} onEdit={() => { setEditingItem(item); }} />
    ))}
  </SortableContext>
</DndContext>
```

### ItemModal dentro de KanbanColumn
- `KanbanColumn` deve ter estado local `editingItem: ItemResponse | null`
- Ao clicar no card → `setEditingItem(item)`
- Renderizar `<ItemModal>` com `defaultValues={editingItem}` quando não nulo
