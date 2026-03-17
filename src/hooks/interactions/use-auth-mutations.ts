import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';

import { signIn, signOut } from '@/api/auth';
import { useAuthStore } from '@/stores/auth.store';

export function useSignIn() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      signIn(email, password),
    onSuccess: (_data, variables) => {
      queryClient.clear();
      setUser(variables.email);
      navigate({ to: '/projects' });
    },
    onError: () => {
      toast.error('Email ou senha inválidos.');
    },
  });
}

export function useSignOut() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: signOut,
    onSettled: () => {
      queryClient.clear();
      clearAuth();
      navigate({ to: '/sign-in' });
    },
  });
}
