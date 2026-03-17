import { useState } from 'react';

import { EyeIcon, EyeOffIcon } from 'lucide-react';

import { Button } from './button';
import { Input } from './input';

export function PasswordInput({ className, ...rest }: React.ComponentProps<'input'>) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        className={`pr-10 ${className ?? ''}`}
        type={visible ? 'text' : 'password'}
        {...rest}
      />
      <Button
        className="absolute right-0 top-0 h-full px-2.5 text-muted-foreground hover:text-foreground"
        size="icon"
        tabIndex={-1}
        type="button"
        variant="ghost"
        onClick={() => setVisible((previous) => !previous)}
      >
        {visible ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
      </Button>
    </div>
  );
}
