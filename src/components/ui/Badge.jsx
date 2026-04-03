export default function Badge({ children, color = '#f97316', className = '' }) {
  return (
    <span
      className={`inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-full ${className}`}
      style={{ backgroundColor: `${color}22`, color }}
    >
      {children}
    </span>
  )
}

export function SessionTypeBadge({ type }) {
  const config = {
    run: { label: 'Run', color: '#22c55e' },
    stations: { label: 'Stations', color: '#6366f1' },
    combo: { label: 'Combo', color: '#f97316' },
    hyrox_sim: { label: 'Hyrox Sim', color: '#ef4444' },
    race: { label: 'Race Day', color: '#f59e0b' },
  }
  const { label, color } = config[type] || { label: type, color: '#94a3b8' }
  return <Badge color={color}>{label}</Badge>
}

export function PhaseBadge({ phase }) {
  const colors = { 1: '#6366f1', 2: '#f97316', 3: '#ef4444', 4: '#22c55e' }
  const labels = { 1: 'Foundation', 2: 'Build', 3: 'Peak', 4: 'Taper' }
  return <Badge color={colors[phase] || '#94a3b8'}>{labels[phase] || `Phase ${phase}`}</Badge>
}

export function StatusBadge({ status }) {
  const config = {
    complete: { label: '✓ Done', color: '#22c55e' },
    skipped: { label: '✕ Skipped', color: '#ef4444' },
    modified: { label: '~ Modified', color: '#f59e0b' },
  }
  if (!status) return null
  const { label, color } = config[status] || { label: status, color: '#94a3b8' }
  return <Badge color={color}>{label}</Badge>
}
