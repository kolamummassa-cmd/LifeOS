import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export default function Card({ children, className = '', ...rest }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-border bg-card p-5 ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
}
