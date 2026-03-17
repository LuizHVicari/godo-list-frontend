import { createFileRoute, redirect } from '@tanstack/react-router';

import { AppLayout } from '@/components/layout/app-layout';
import { useAuthStore } from '@/stores/auth.store';

export const Route = createFileRoute('/_protected')({
  beforeLoad: () => {
    if (typeof window === 'undefined') return; // localStorage not available on server
    if (!useAuthStore.getState().isAuthenticated) {
      throw redirect({ to: '/sign-in' });
    }
  },
  component: AppLayout,
});
