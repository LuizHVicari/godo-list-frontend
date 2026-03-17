import { Outlet } from '@tanstack/react-router';

import { useAuthStore } from '@/stores/auth.store';

import { Header } from './header';

export function AppLayout() {
  const email = useAuthStore((state) => state.email) ?? '';

  return (
    <div className="flex min-h-svh flex-col">
      <Header email={email} />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
