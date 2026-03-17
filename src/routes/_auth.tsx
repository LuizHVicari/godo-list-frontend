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
          <p className="mt-1 text-sm text-muted-foreground">Gerencie seus projetos</p>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
