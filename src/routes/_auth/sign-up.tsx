import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { Controller, useForm } from 'react-hook-form';
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
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { PasswordInput } from '@/components/ui/password-input';
import { Input } from '@/components/ui/input';

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
            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="sign-up-email">Email</FieldLabel>
                  <Input
                    id="sign-up-email"
                    type="email"
                    aria-invalid={fieldState.invalid}
                    placeholder="voce@exemplo.com"
                    {...field}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="sign-up-password">Senha</FieldLabel>
                  <PasswordInput
                    id="sign-up-password"
                    aria-invalid={fieldState.invalid}
                    placeholder="Mínimo 6 caracteres"
                    {...field}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="confirmPassword"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="sign-up-confirm-password">Confirmar senha</FieldLabel>
                  <PasswordInput
                    id="sign-up-confirm-password"
                    aria-invalid={fieldState.invalid}
                    placeholder="Repita a senha"
                    {...field}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
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
