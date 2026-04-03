import { useState } from 'react'
import { ExternalLink, Users, BookOpen, Calculator, Library } from 'lucide-react'
import { COACHES, PHILOSOPHY_CARDS, RESOURCES } from '../utils/coachData'
import PaceCalculator from '../components/PaceCalculator'
import CoachCard from '../components/CoachCard'
import ResourceCard from '../components/ResourceCard'

const TABS = [
  { id: 'coaches',    label: 'Coaches',    icon: Users },
  { id: 'paces',      label: 'Pace Calc',  icon: Calculator },
  { id: 'philosophy', label: 'Philosophy', icon: BookOpen },
  { id: 'resources',  label: 'Resources',  icon: Library },
]

const tabS = (a) => ({
  flex: 1, padding: '0.45rem 0.25rem', borderRadius: '0.65rem', fontSize: '0.72rem', fontWeight: 700,
  minHeight: 40, cursor: 'pointer', transition: 'all 0.15s', textAlign: 'center',
  background: a ? '#fff' : 'rgba(255,255,255,0.06)',
  color: a ? '#000' : 'rgba(255,255,255,0.38)',
  border: a ? 'none' : '1px solid rgba(255,255,255,0.09)',
})

function CoachesSection() {
  return (
    <div className="space-y-4">
      <div className="glass p-4">
        <div className="flex items-center gap-2 mb-1">
          <Users size={14} className="text-white/38" />
          <p className="text-sm font-black text-white/88">Your unified training philosophy</p>
        </div>
        <p className="text-xs text-white/28 mb-4">5 coaches. One system. Each contributes their specific expertise.</p>
        <div className="space-y-2">
          {Object.values(COACHES).map(coach => (
            <div key={coach.id} className="flex items-center justify-between p-3 rounded-xl"
              style={{ background: `${coach.color}0e`, border: `1px solid ${coach.color}28` }}>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold" style={{ color: coach.color }}>{coach.name}</p>
                <p className="text-xs text-white/35 mt-0.5">{coach.role}</p>
              </div>
              <a href={coach.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0 ml-3"
                style={{ background: `${coach.color}18`, border: `1px solid ${coach.color}30` }}>
                <ExternalLink size={13} style={{ color: coach.color }} />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Coach color legend */}
      <div className="glass p-3">
        <p className="text-xs text-white/35 mb-2 font-semibold uppercase tracking-wider">Colour coding</p>
        <div className="flex flex-wrap gap-2">
          {Object.values(COACHES).map(c => (
            <div key={c.id} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: c.color }} />
              <span className="text-xs text-white/42">{c.name.split(' ')[0]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function PacesSection() {
  return (
    <div className="space-y-4">
      <PaceCalculator />
      <div className="glass p-4">
        <p className="text-xs font-black text-white/55 mb-2">How it works</p>
        <p className="text-xs text-white/35 leading-relaxed">
          Riegel's formula — T₂ = T₁ × (D₂ / D₁)^1.06 — predicts your target race time from any
          recent result. Training paces are derived from your predicted race pace using McMillan's
          zone methodology. Saved paces appear automatically in your session cards on the Train tab.
        </p>
      </div>
    </div>
  )
}

function PhilosophySection() {
  return (
    <div className="space-y-4">
      <div className="glass p-3">
        <div className="flex items-center gap-2">
          <BookOpen size={13} className="text-white/35" />
          <p className="text-xs text-white/42">What the coaches say about each session type.</p>
        </div>
      </div>
      {PHILOSOPHY_CARDS.map(card => (
        <CoachCard key={card.id} card={card} />
      ))}
    </div>
  )
}

function ResourcesSection() {
  const [filterCoach, setFilterCoach] = useState('all')
  const filtered = filterCoach === 'all' ? RESOURCES : RESOURCES.filter(r => r.coach === filterCoach)

  const pillS = (a, color) => ({
    padding: '0.3rem 0.75rem', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 700,
    cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap',
    background: a ? (color || 'rgba(255,255,255,0.85)') : 'rgba(255,255,255,0.06)',
    color: a ? (color ? '#fff' : '#000') : 'rgba(255,255,255,0.38)',
    border: a ? `1px solid ${color || 'rgba(255,255,255,0.5)'}` : '1px solid rgba(255,255,255,0.09)',
  })

  return (
    <div className="space-y-3">
      {/* Filter pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
        <button style={pillS(filterCoach === 'all', null)} onClick={() => setFilterCoach('all')}>All</button>
        {Object.values(COACHES).map(c => (
          <button key={c.id} style={pillS(filterCoach === c.id, c.color)} onClick={() => setFilterCoach(c.id)}>
            {c.name.split(' ')[0]}
          </button>
        ))}
      </div>

      <p className="text-xs text-white/30 px-1">
        {filtered.length} resources. All links open the original source.
      </p>

      <div className="grid grid-cols-2 gap-3">
        {filtered.map(r => (
          <ResourceCard key={r.id} resource={r} />
        ))}
      </div>
    </div>
  )
}

export default function CoachHub() {
  const [tab, setTab] = useState('coaches')

  return (
    <div className="px-4 pt-6 pb-4">
      <div className="mb-5">
        <h1 className="text-2xl font-black text-white">Coach Hub</h1>
        <p className="text-sm text-white/28 mt-0.5">5 coaches. One unified training system.</p>
      </div>

      <div className="flex gap-1.5 mb-5">
        {TABS.map(({ id, label }) => (
          <button key={id} onClick={() => setTab(id)} style={tabS(tab === id)}>{label}</button>
        ))}
      </div>

      {tab === 'coaches' && <CoachesSection />}
      {tab === 'paces' && <PacesSection />}
      {tab === 'philosophy' && <PhilosophySection />}
      {tab === 'resources' && <ResourcesSection />}
    </div>
  )
}
