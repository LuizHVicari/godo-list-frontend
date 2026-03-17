import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
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
import { FieldGroup } from '@/components/ui/field';
import { FormInput, FormPasswordInput } from '@/components/ui/form';
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
            <FormInput
              control={form.control}
              id="sign-in-email"
              label="Email"
              name="email"
              placeholder="voce@exemplo.com"
              type="email"
            />
            <FormPasswordInput
              control={form.control}
              id="sign-in-password"
              label="Senha"
              name="password"
              placeholder="••••••"
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
