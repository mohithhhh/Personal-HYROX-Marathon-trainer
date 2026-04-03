export default function ProgressBar({ value, max, color = '#f97316', height = 6, className = '', showLabel = false }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  return (
    <div className={className}>
      <div className="w-full rounded-full overflow-hidden" style={{ height, backgroundColor: '#2a2a3d' }}>
        <div
          className="rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%`, height, backgroundColor: color }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between mt-1">
          <span className="text-xs text-[#475569]">{value}</span>
          <span className="text-xs text-[#475569]">{max}</span>
        </div>
      )}
    </div>
  )
}
