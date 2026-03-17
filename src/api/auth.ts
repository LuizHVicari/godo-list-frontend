import { api } from './client';

export function signIn(email: string, password: string): Promise<void> {
  return api.post('v1/auth/sign-in', { json: { email, password } }).then(() => undefined);
}

export function signUp(email: string, password: string): Promise<void> {
  return api.post('v1/auth/sign-up', { json: { email, password } }).then(() => undefined);
}

export function signOut(): Promise<void> {
  return api.post('v1/auth/sign-out').then(() => undefined);
}
