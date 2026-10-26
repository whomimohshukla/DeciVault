import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className, hover = false }: CardProps) {
  return (
    <div className={cn(
      'bg-card rounded-xl border border-border shadow-card p-6',
      hover && 'transition-all duration-150 hover:shadow-card-hover hover:border-gray-300',
      className
    )}>
      {children}
    </div>
  );
}
