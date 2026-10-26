import * as React from 'react';

export function AnimatedBadge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`relative inline-flex w-fit overflow-hidden rounded-full p-px ${className || ''}`}>
      <span
        aria-hidden
        className="absolute top-1/2 left-1/2 h-5 w-[300px] rounded-full bg-gradient-to-r from-transparent via-transparent to-orange-500 motion-safe:animate-[chai-spin_4s_linear_infinite]"
        style={{ transform: 'translate(-50%,-50%)' }}
      />
      <span className="relative z-10 rounded-full bg-neutral-50 px-4 py-2 text-sm font-medium text-neutral-800 dark:bg-stone-900 dark:text-neutral-100">
        {children}
      </span>
    </span>
  );
}
