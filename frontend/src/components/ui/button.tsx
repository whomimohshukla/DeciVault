const buttonVariants = ({ variant = 'default' }: { variant?: 'default' | 'solid' | 'outline' } = {}) => {
  if (variant === 'solid') {
    return 'btn-asym inline-flex h-9 items-center gap-2 bg-white px-4 text-sm font-medium text-black transition-colors duration-200 hover:bg-neutral-200';
  }
  if (variant === 'outline') {
    return 'btn-asym-mirror inline-flex h-9 items-center gap-2 border border-orange-50/15 bg-transparent px-4 text-sm font-medium transition-colors hover:bg-black/90 hover:border-orange-50/30';
  }
  return 'inline-flex h-8 min-w-24 items-center justify-center rounded-md bg-primary px-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90';
};

export { buttonVariants };
