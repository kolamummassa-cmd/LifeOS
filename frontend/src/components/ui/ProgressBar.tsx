export default function ProgressBar({
  value,
  label,
}: {
  value: number
  label?: string
}) {
  const pct = Math.max(0, Math.min(100, value))
  return (
    <div>
      {label && (
        <div className="mb-1 flex justify-between text-xs text-text-muted">
          <span>{label}</span>
          <span>{Math.round(pct)}%</span>
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-bg-secondary">
        <div
          className="h-full rounded-full bg-accent transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
