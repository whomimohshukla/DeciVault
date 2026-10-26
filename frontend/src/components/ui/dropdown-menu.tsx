import * as React from 'react';
import { cn } from '../../lib/utils';

const DropdownMenuContext = React.createContext<{ open: boolean; setOpen: (v: boolean) => void } | null>(null);

export function DropdownMenu({ open, onOpenChange, children }: { open?: boolean; onOpenChange?: (v: boolean) => void; children: React.ReactNode }) {
  const [internal, setInternal] = React.useState(false);
  const isOpen = open !== undefined ? open : internal;
  const setOpen = onOpenChange || setInternal;
  return <DropdownMenuContext.Provider value={{ open: isOpen, setOpen }}>{children}</DropdownMenuContext.Provider>;
}

export function DropdownMenuTrigger({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const ctx = React.useContext(DropdownMenuContext)!;
  return (
    <button type="button" onClick={() => ctx.setOpen(!ctx.open)} className={className} {...props}>
      {children}
    </button>
  );
}

export function DropdownMenuContent({ children, className, align = 'end' }: { children: React.ReactNode; className?: string; align?: string }) {
  const ctx = React.useContext(DropdownMenuContext)!;
  if (!ctx.open) return null;
  return (
    <div className="relative">
      <div className={cn('absolute mt-2 rounded-xl border border-orange-50/10 bg-background/80 backdrop-blur-lg p-2', align === 'end' ? 'right-0' : 'left-0', className)}>
        {children}
      </div>
    </div>
  );
}

export function DropdownMenuItem({ children, className, onSelect, ...props }: React.HTMLAttributes<HTMLDivElement> & { onSelect?: (e: any) => void }) {
  return (
    <div
      className={cn('rounded-lg px-3 py-2 cursor-pointer hover:bg-accent/60', className)}
      onClick={(e) => onSelect?.(e)}
      {...props}
    >
      {children}
    </div>
  );
}
