import { createFileRoute, redirect } from '@tanstack/react-router';

import { useAuthStore } from '@/stores/auth.store';

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    if (typeof window === 'undefined') throw redirect({ to: '/sign-in' });
    throw redirect({
      to: useAuthStore.getState().isAuthenticated ? '/projects' : '/sign-in',
    });
  },
  component: () => null,
});
