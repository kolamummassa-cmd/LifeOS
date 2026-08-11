export const STATUS_OPTIONS = [
  { value: 'discovered', label: 'Discovered' },
  { value: 'want_to_learn', label: 'Want to Learn' },
  { value: 'currently_learning', label: 'Currently Learning' },
  { value: 'completed', label: 'Completed' },
  { value: 'applied', label: 'Applied' },
  { value: 'reviewed', label: 'Reviewed' },
  { value: 'mastered', label: 'Mastered' },
]

export const STATUS_LABELS: Record<string, string> = Object.fromEntries(
  STATUS_OPTIONS.map((s) => [s.value, s.label])
)
