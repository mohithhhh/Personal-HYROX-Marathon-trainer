export default function ProgressBar({ value, max, height = 6, className = '', showLabel = false }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  return (
    <div className={className}>
      <div className="w-full rounded-full overflow-hidden" style={{ height, backgroundColor: 'rgba(255,255,255,0.08)' }}>
        <div
          className="rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${pct}%`,
            height,
            background: pct >= 80
              ? 'rgba(255,255,255,0.9)'
              : 'rgba(255,255,255,0.55)',
          }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between mt-1">
          <span className="text-xs text-white/35">{value}</span>
          <span className="text-xs text-white/35">{max}</span>
        </div>
      )}
    </div>
  )
}
