import { cn } from '../lib/utils';

export const menuToggleClass =
  'relative inline-flex h-9 w-9 items-center justify-center rounded-lg outline-none transition-colors hover:bg-accent/60 focus-visible:ring-[3px] focus-visible:ring-ring/50';

export function MenuGlyph({ open }: { open: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path
          d="M3 6h12"
          className={cn('origin-center transition-transform duration-200', open && 'translate-y-[3px] rotate-45')}
        />
        <path
          d="M3 9h12"
          className={cn('transition-opacity duration-200', open && 'opacity-0')}
        />
        <path
          d="M3 12h12"
          className={cn('origin-center transition-transform duration-200', open && '-translate-y-[3px] -rotate-45')}
        />
      </g>
    </svg>
  );
}

export function MenuToggle({ open, onClick, className }: { open: boolean; onClick: () => void; className?: string }) {
  return (
    <button type="button" aria-label={open ? 'Close menu' : 'Open menu'} onClick={onClick} className={cn(menuToggleClass, className)}>
      <MenuGlyph open={open} />
    </button>
  );
}
