import { LogOutIcon } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSignOut } from '@/hooks/interactions/use-auth-mutations';

type HeaderProperties = React.ComponentProps<'header'> & { email: string };

export function Header({ email, className, ...rest }: HeaderProperties) {
  const { mutate: signOut, isPending } = useSignOut();

  return (
    <header
      className={`flex items-center justify-between border-b px-6 py-3 ${className ?? ''}`}
      {...rest}
    >
      <span className="text-lg font-semibold">Godo List</span>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost">
            <Avatar className="size-8">
              <AvatarFallback>{email[0]?.toUpperCase() ?? '?'}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem disabled className="text-xs text-muted-foreground">
            {email}
          </DropdownMenuItem>
          <DropdownMenuItem disabled={isPending} onClick={() => signOut()}>
            <LogOutIcon />
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
