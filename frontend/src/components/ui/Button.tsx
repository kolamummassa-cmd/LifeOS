import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  children: ReactNode
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-accent text-white hover:bg-blue-600',
  secondary: 'bg-card text-text-primary border border-border hover:border-accent',
  ghost: 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-card',
  danger: 'bg-danger text-white hover:bg-red-600',
}

export default function Button({
  variant = 'primary',
  className = '',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium
        transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
