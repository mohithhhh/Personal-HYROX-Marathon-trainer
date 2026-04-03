import { ExternalLink } from 'lucide-react'
import { COACHES } from '../utils/coachData'

const FORMAT_ACTION = {
  'Article': 'Read',
  'Video': 'Watch',
  'Podcast': 'Listen',
  'Tool': 'Open',
  'App / Audio': 'Download',
}

export default function ResourceCard({ resource }) {
  const coach = COACHES[resource.coach]
  const action = FORMAT_ACTION[resource.format] || 'Open'

  return (
    <div className="glass p-3 flex flex-col gap-2 min-h-0">
      {/* Coach tag + format */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold px-2 py-0.5 rounded-full shrink-0"
          style={{ background: `${coach.color}20`, color: coach.color, border: `1px solid ${coach.color}35` }}>
          {coach.name.split(' ')[0]}
        </span>
        <span className="text-xs text-white/25 truncate">{resource.format}</span>
      </div>

      {/* Title */}
      <p className="text-sm font-bold text-white/82 leading-snug">{resource.title}</p>

      {/* Summary */}
      <p className="text-xs text-white/40 leading-relaxed flex-1">{resource.summary}</p>

      {/* CTA */}
      <a href={resource.url} target="_blank" rel="noopener noreferrer"
        className="flex items-center justify-center gap-1.5 text-xs font-bold rounded-lg px-3 py-2 mt-1"
        style={{ background: `${coach.color}18`, color: coach.color, border: `1px solid ${coach.color}30` }}>
        <ExternalLink size={11} />
        {action}
      </a>
    </div>
  )
}
