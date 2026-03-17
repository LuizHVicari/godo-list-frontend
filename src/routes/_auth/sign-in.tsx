import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

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
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
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

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  function handleSubmit(values: SignInFormValues) {
    signIn(values);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Entrar</CardTitle>
        <CardDescription>Acesse sua conta</CardDescription>
      </CardHeader>

      <form className="contents" onSubmit={form.handleSubmit(handleSubmit)}>
        <CardContent className="flex flex-col gap-4">
          <FieldGroup>
            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="sign-in-email">Email</FieldLabel>
                  <Input
                    id="sign-in-email"
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
                  <FieldLabel htmlFor="sign-in-password">Senha</FieldLabel>
                  <PasswordInput
                    id="sign-in-password"
                    aria-invalid={fieldState.invalid}
                    placeholder="••••••"
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
            Entrar
          </Button>
          <p className="text-sm text-muted-foreground">
            Não tem conta?{' '}
            <Link className="underline underline-offset-4 hover:text-foreground" to="/sign-up">
              Criar conta
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
