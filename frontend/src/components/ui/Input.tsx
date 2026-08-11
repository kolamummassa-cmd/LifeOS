import type { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export function Input({ label, className = '', id, ...rest }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-text-secondary">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`rounded-lg border border-border bg-bg-secondary px-3 py-2 text-sm text-text-primary
          placeholder:text-text-muted focus:border-accent focus:outline-none ${className}`}
        {...rest}
      />
    </div>
  )
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
}

export function Textarea({ label, className = '', id, ...rest }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-text-secondary">
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={`min-h-24 rounded-lg border border-border bg-bg-secondary px-3 py-2 text-sm text-text-primary
          placeholder:text-text-muted focus:border-accent focus:outline-none ${className}`}
        {...rest}
      />
    </div>
  )
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
}

export function Select({ label, className = '', id, children, ...rest }: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-text-secondary">
          {label}
        </label>
      )}
      <select
        id={id}
        className={`rounded-lg border border-border bg-bg-secondary px-3 py-2 text-sm text-text-primary
          focus:border-accent focus:outline-none ${className}`}
        {...rest}
      >
        {children}
      </select>
    </div>
  )
}
