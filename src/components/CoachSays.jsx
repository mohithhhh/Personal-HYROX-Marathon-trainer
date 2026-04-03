import { COACHES, PHILOSOPHY_CARDS } from '../utils/coachData'

function getCardForSession(session, day) {
  if (!session) return null
  const { type } = session
  if (type === 'hyrox_sim') return PHILOSOPHY_CARDS.find(c => c.id === 'hyrox_sim')
  if (type === 'stations') return PHILOSOPHY_CARDS.find(c => c.id === 'stations')
  if (type === 'run') {
    const isTempo = !!(session.intervals) || /tempo|interval/i.test(session.title || '')
    if (day === 'saturday' && !isTempo) return PHILOSOPHY_CARDS.find(c => c.id === 'long_run')
    if (isTempo) return PHILOSOPHY_CARDS.find(c => c.id === 'tempo')
    return PHILOSOPHY_CARDS.find(c => c.id === 'easy_run')
  }
  return null
}

function getSavedPace(session, day) {
  try {
    const saved = JSON.parse(localStorage.getItem('mcmillan_paces') || 'null')
    if (!saved || !session || session.type !== 'run') return null
    const isTempo = !!(session.intervals) || /tempo|interval/i.test(session.title || '')
    const isSat = day === 'saturday'
    if (isTempo) return { label: 'Tempo target', range: saved.tempo }
    if (isSat) return { label: 'Long run target', range: saved.easy }
    return { label: 'Easy run target', range: saved.easy }
  } catch (_) { return null }
}

function fmtPaceRange(range) {
  if (!range) return null
  const fmt = s => {
    const min = Math.floor(s / 60)
    const sec = Math.round(s % 60)
    return `${min}:${String(sec).padStart(2, '0')}`
  }
  return `${fmt(range.min)} – ${fmt(range.max)} /km`
}

export default function CoachSays({ session, day }) {
  const card = getCardForSession(session, day)
  if (!card) return null

  const primary = COACHES[card.quoteCoach]
  const tipC = COACHES[card.tipCoach]
  const pace = getSavedPace(session, day)

  return (
    <div className="mt-3 rounded-xl p-3 space-y-2"
      style={{ background: `${primary.color}0e`, border: `1px solid ${primary.color}28` }}>
      <p className="text-xs font-black uppercase tracking-wider text-white/35">Coach says</p>

      {/* Quote */}
      <div className="flex items-start gap-2">
        <span className="text-xs font-bold shrink-0 px-1.5 py-0.5 rounded mt-0.5"
          style={{ background: `${primary.color}22`, color: primary.color }}>
          {primary.name.split(' ').pop()}
        </span>
        <p className="text-xs text-white/60 italic leading-relaxed">"{card.quote}"</p>
      </div>

      {/* Tip */}
      {card.tip && card.tip !== card.quote && (
        <div className="flex items-start gap-2">
          <span className="text-xs font-bold shrink-0 px-1.5 py-0.5 rounded mt-0.5"
            style={{ background: `${tipC.color}22`, color: tipC.color }}>
            Tip
          </span>
          <p className="text-xs text-white/42 leading-relaxed">{card.tip}</p>
        </div>
      )}

      {/* McMillan pace from calculator */}
      {pace && pace.range && (
        <div className="flex items-center justify-between rounded-lg px-2.5 py-2 mt-1"
          style={{ background: `${COACHES.mcmillan.color}12`, border: `1px solid ${COACHES.mcmillan.color}28` }}>
          <span className="text-xs font-bold" style={{ color: COACHES.mcmillan.color }}>
            McMillan · {pace.label}
          </span>
          <span className="text-xs font-black text-white/72" style={{ fontFamily: 'monospace' }}>
            {fmtPaceRange(pace.range)}
          </span>
        </div>
      )}
    </div>
  )
}
