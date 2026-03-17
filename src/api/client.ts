import ky from 'ky';

import { useAuthStore } from '@/stores/auth.store';

export const api = ky.create({
  prefixUrl: import.meta.env['VITE_API_URL'] ?? 'http://localhost:8080',
  credentials: 'include',
  hooks: {
    afterResponse: [
      async (_request, _options, response) => {
        if (response.status === 401 && typeof window !== 'undefined') {
          useAuthStore.getState().clearAuth();
          window.location.href = '/sign-in';
        }
      },
    ],
  },
});
