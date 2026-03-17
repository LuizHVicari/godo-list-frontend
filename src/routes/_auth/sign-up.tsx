import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { signUp } from '@/api/auth';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FieldGroup } from '@/components/ui/field';
import { FormInput, FormPasswordInput } from '@/components/ui/form';

const signUpSchema = z
  .object({
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Mínimo 6 caracteres'),
    confirmPassword: z.string().min(6, 'Mínimo 6 caracteres'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

type SignUpFormValues = z.infer<typeof signUpSchema>;

export const Route = createFileRoute('/_auth/sign-up')({
  component: SignUpPage,
});

function SignUpPage() {
  const navigate = useNavigate();

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  const isPending = form.formState.isSubmitting;

  async function handleSubmit(values: SignUpFormValues) {
    try {
      await signUp(values.email, values.password);
      toast.success('Conta criada! Faça login para continuar.');
      navigate({ to: '/sign-in' });
    } catch {
      toast.error('Não foi possível criar a conta.');
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Criar conta</CardTitle>
        <CardDescription>Crie sua conta gratuitamente</CardDescription>
      </CardHeader>

      <form className="contents" onSubmit={form.handleSubmit(handleSubmit)}>
        <CardContent className="flex flex-col gap-4">
          <FieldGroup>
            <FormInput
              control={form.control}
              id="sign-up-email"
              label="Email"
              name="email"
              placeholder="voce@exemplo.com"
              type="email"
            />
            <FormPasswordInput
              control={form.control}
              id="sign-up-password"
              label="Senha"
              name="password"
              placeholder="Mínimo 6 caracteres"
            />
            <FormPasswordInput
              control={form.control}
              id="sign-up-confirm-password"
              label="Confirmar senha"
              name="confirmPassword"
              placeholder="Repita a senha"
            />
          </FieldGroup>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <Button className="w-full" disabled={isPending} type="submit">
            Criar conta
          </Button>
          <p className="text-sm text-muted-foreground">
            Já tem conta?{' '}
            <Link className="underline underline-offset-4 hover:text-foreground" to="/sign-in">
              Entrar
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
