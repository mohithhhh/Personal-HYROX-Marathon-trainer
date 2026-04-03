import { ExternalLink } from 'lucide-react'
import { COACHES } from '../utils/coachData'

const INNER = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12 }

const COACH_CREDITS = {
  fitzgerald: 'Strength Running',
  bennett: 'Nike Run Club',
  parkes: 'YouTube',
  mcmillan: 'McMillan Running',
  mta: 'Marathon Training Academy',
}

export default function CoachCard({ card }) {
  const primaryCoach = COACHES[card.quoteCoach]
  const tipCoach = COACHES[card.tipCoach]

  return (
    <div className="glass p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-black text-white/90">{card.title}</p>
          <p className="text-xs text-white/28 mt-0.5">{card.sessions}</p>
        </div>
      </div>

      {/* Coach tags */}
      <div className="flex flex-wrap gap-1.5">
        {card.coaches.map(cId => {
          const c = COACHES[cId]
          return (
            <span key={cId} className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ background: `${c.color}20`, color: c.color, border: `1px solid ${c.color}40` }}>
              {c.name}
            </span>
          )
        })}
      </div>

      {/* Quote block */}
      <div className="rounded-xl p-3" style={INNER}>
        <p className="text-xs font-bold mb-2" style={{ color: primaryCoach.color }}>
          {primaryCoach.name} · {COACH_CREDITS[card.quoteCoach]}
        </p>
        <p className="text-sm text-white/70 italic leading-relaxed">"{card.quote}"</p>
      </div>

      {/* Tip block */}
      {card.tip && (
        <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12 }}>
          <p className="text-xs font-bold mb-1.5 uppercase tracking-wider" style={{ color: tipCoach.color }}>
            {tipCoach.name} — Coach Tip
          </p>
          <p className="text-sm text-white/58 leading-relaxed">{card.tip}</p>
        </div>
      )}

      {/* External link */}
      {card.link && (
        <a href={card.link} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs font-semibold transition-colors"
          style={{ color: 'rgba(255,255,255,0.32)' }}>
          <ExternalLink size={11} />
          Read more on {COACH_CREDITS[card.quoteCoach]}
        </a>
      )}
    </div>
  )
}
