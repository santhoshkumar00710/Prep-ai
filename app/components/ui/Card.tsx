'use client';

import { HTMLAttributes, forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'bordered';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

const variantStyles = {
  default: 'glass',
  elevated: 'glass-elevated',
  bordered: 'bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-2xl',
};

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    { variant = 'default', padding = 'md', hover = false, className = '', children, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={[
          variantStyles[variant],
          paddingStyles[padding],
          hover
            ? 'cursor-pointer transition-all duration-200 hover:border-[var(--border-brand)] hover:shadow-lg hover:shadow-indigo-900/20 hover:-translate-y-0.5'
            : '',
          className,
        ].join(' ')}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// Sub-components
export function CardHeader({ className = '', children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`mb-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className = '', children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={`text-lg font-semibold text-[var(--text-primary)] ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({ className = '', children, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={`text-sm text-[var(--text-secondary)] mt-1 ${className}`} {...props}>
      {children}
    </p>
  );
}
