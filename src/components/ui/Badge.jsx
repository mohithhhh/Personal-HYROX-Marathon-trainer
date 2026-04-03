export default function Badge({ children, bright = false, className = '' }) {
  return (
    <span
      className={`inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-full border ${
        bright
          ? 'bg-white/15 border-white/30 text-white'
          : 'bg-white/6 border-white/10 text-white/45'
      } ${className}`}
    >
      {children}
    </span>
  )
}

export function SessionTypeBadge({ type }) {
  const labels = { run: 'Run', stations: 'Stations', combo: 'Combo', hyrox_sim: 'Sim', race: 'Race Day' }
  return <Badge>{labels[type] || type}</Badge>
}

export function PhaseBadge({ phase }) {
  const labels = { 1: 'Foundation', 2: 'Build', 3: 'Peak', 4: 'Taper' }
  return <Badge>{labels[phase] || `Phase ${phase}`}</Badge>
}

export function StatusBadge({ status }) {
  const config = { complete: 'Done', skipped: 'Skipped', modified: 'Modified' }
  if (!status) return null
  return <Badge bright={status === 'complete'}>{config[status] || status}</Badge>
}
