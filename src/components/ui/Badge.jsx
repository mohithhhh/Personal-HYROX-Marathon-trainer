export default function Badge({ children, bright = false, className = '' }) {
  return (
    <span
      className={`inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-full border ${className}`}
      style={
        bright
          ? { background: 'rgba(255,102,102,0.20)', borderColor: 'rgba(255,102,102,0.50)', color: '#ff6666' }
          : { background: 'rgba(51,51,51,0.60)', borderColor: 'rgba(255,102,102,0.18)', color: 'rgba(255,255,255,0.45)' }
      }
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
