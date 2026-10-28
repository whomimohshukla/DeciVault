import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon: any;
  title: string;
  description: string;
  action?: ReactNode;
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-text-secondary" />
      </div>
      <h3 className="text-lg font-medium text-text-primary mb-2">{title}</h3>
      <p className="text-sm text-text-secondary mb-6 max-w-sm mx-auto">{description}</p>
      {action}
    </div>
  );
}
