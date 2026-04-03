import { useState } from 'react'
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Clock, Check, X, Edit3, MapPin, Flag } from 'lucide-react'
import { useAppData } from '../hooks/useAppData'
import { TRAINING_WEEKS, PHASES, getWeekNumber, getSessionDate, getPhaseForWeek, HYROX_STATIONS } from '../data/trainingPlan'
import { formatDate, isToday } from '../utils/formatters'
import { SessionTypeBadge, PhaseBadge, StatusBadge } from '../components/ui/Badge'

const INNER = { background: 'rgba(51,51,51,0.45)', border: '1px solid rgba(255,102,102,0.12)', borderRadius: 12 }
const INNER_MID = { background: 'rgba(51,51,51,0.65)', border: '1px solid rgba(255,102,102,0.22)', borderRadius: 12 }

function ExerciseList({ exercises }) {
  return (
    <div className="space-y-2 mt-3">
      {exercises.map((ex, i) => (
        <div key={i} className="flex gap-3 p-3 rounded-xl" style={INNER}>
          <div className="w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold shrink-0 mt-0.5"
            style={{ background: 'rgba(255,102,102,0.15)', color: '#ff6666' }}>
            {i + 1}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white/82">{ex.exercise}</p>
            <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
              {ex.sets && <span className="text-xs text-white/52">{ex.sets} {ex.sets === 1 ? 'set' : 'sets'}</span>}
              {ex.reps && <span className="text-xs text-white/38">{ex.reps} reps</span>}
              {ex.distance && <span className="text-xs text-white/38">{ex.distance}{ex.unit}</span>}
              {ex.weight && <span className="text-xs text-white/52">{ex.weight}</span>}
              {ex.rest && <span className="text-xs" style={{ color: 'rgba(255,102,102,0.45)' }}>Rest: {ex.rest}</span>}
            </div>
            {ex.notes && <p className="text-xs text-white/25 mt-1 italic">{ex.notes}</p>}
          </div>
        </div>
      ))}
    </div>
  )
}

function HyroxSimDetails({ stations }) {
  const details = HYROX_STATIONS.filter(s => stations?.includes(s.id))
  return (
    <div className="mt-3 space-y-2">
      <div className="p-3 rounded-xl" style={INNER_MID}>
        <p className="text-sm font-bold text-white/78">
          {details.length === 8 ? 'Full 8-Station Simulation' : `${details.length}-Station Partial Sim`}
        </p>
        <p className="text-xs text-white/32 mt-0.5">{details.length} stations + {details.length} × 1km runs</p>
      </div>
      {details.map((s, i) => (
        <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl" style={INNER}>
          <div className="w-7 h-7 rounded-full text-xs flex items-center justify-center font-bold"
            style={{ background: 'rgba(255,102,102,0.15)', color: '#ff6666' }}>{i + 1}</div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-white/80">{s.name}</p>
            <p className="text-xs text-white/30">{s.distance ? `${s.distance}${s.unit}` : `${s.reps} ${s.unit}`}</p>
          </div>
          {i < details.length - 1 && <p className="text-xs" style={{ color: 'rgba(255,102,102,0.45)' }}>→ 1km run</p>}
        </div>
      ))}
    </div>
  )
}

function SessionCard({ session, day, date, sessionId }) {
  const [expanded, setExpanded] = useState(false)
  const { markSession, getSessionStatus } = useAppData()
  const status = getSessionStatus(sessionId)
  const today = isToday(date)

  return (
    <div className="overflow-hidden rounded-2xl" style={{
      background: today ? 'rgba(255,102,102,0.12)' : 'rgba(51,51,51,0.50)',
      border: today ? '1px solid rgba(255,102,102,0.45)' : '1px solid rgba(255,102,102,0.14)',
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
    }}>
      <button className="w-full p-4 text-left" onClick={() => setExpanded(e => !e)}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`text-xs font-bold uppercase tracking-wider ${today ? 'text-white/80' : 'text-white/28'}`}>
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </span>
              <span className="text-white/15">·</span>
              <span className={`text-xs ${today ? 'font-bold' : 'text-white/25'}`}
                style={today ? { color: '#ff6666' } : {}}>
                {today ? 'Today' : formatDate(date)}
              </span>
              <SessionTypeBadge type={session.type} />
              {status && <StatusBadge status={status} />}
            </div>
            <h3 className="text-base font-bold text-white/88">{session.title}</h3>
            <div className="flex items-center gap-3 mt-1 text-xs text-white/26">
              {session.duration && <span className="flex items-center gap-1"><Clock size={10} /> {session.duration} min</span>}
              {session.distance && <span className="flex items-center gap-1"><MapPin size={10} /> {session.distance} km</span>}
            </div>
          </div>
          <span className="text-white/22 shrink-0">
            {expanded ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
          </span>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4">
          {session.type === 'run' && (
            <>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="p-3 rounded-xl" style={INNER}>
                  <p className="text-xs text-white/28">Distance</p>
                  <p className="text-2xl font-black text-white">{session.distance}<span className="text-sm text-white/30"> km</span></p>
                </div>
                <div className="p-3 rounded-xl" style={INNER}>
                  <p className="text-xs text-white/28">Effort</p>
                  <p className="text-sm font-medium text-white/58 mt-0.5">{session.paceDesc}</p>
                </div>
              </div>
              {session.intervals && (
                <div className="p-3 rounded-xl mb-3" style={INNER_MID}>
                  <p className="text-xs font-bold mb-2" style={{ color: 'rgba(255,102,102,0.65)' }}>Interval Details</p>
                  {session.intervals.map((iv, i) => (
                    <p key={i} className="text-sm text-white/70">
                      {iv.reps} × {iv.distance < 1 ? `${iv.distance * 1000}m` : `${iv.distance}km`} @ {iv.pace}
                      {iv.rest && <span className="text-white/30"> · {iv.rest}</span>}
                    </p>
                  ))}
                </div>
              )}
            </>
          )}
          {session.type === 'stations' && session.exercises && <ExerciseList exercises={session.exercises} />}
          {session.type === 'hyrox_sim' && <HyroxSimDetails stations={session.stations} />}
          {session.type === 'race' && (
            <div className="p-4 rounded-xl" style={INNER_MID}>
              <div className="flex items-center gap-2 mb-2">
                <Flag size={15} strokeWidth={1.6} style={{ color: '#ff6666' }} />
                <p className="text-base font-black text-white">Race Day</p>
              </div>
              <p className="text-sm text-white/45">{session.notes}</p>
            </div>
          )}
          {session.notes && session.type !== 'race' && (
            <div className="mt-3 p-3 rounded-xl" style={INNER}>
              <p className="text-xs font-semibold mb-1" style={{ color: 'rgba(255,102,102,0.45)' }}>Coach Notes</p>
              <p className="text-sm text-white/40 italic">"{session.notes}"</p>
            </div>
          )}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => markSession(sessionId, status === 'complete' ? null : 'complete')}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold min-h-[44px]"
              style={{
                background: status === 'complete' ? 'rgba(255,102,102,0.25)' : 'rgba(51,51,51,0.55)',
                border: `1px solid ${status === 'complete' ? 'rgba(255,102,102,0.60)' : 'rgba(255,102,102,0.18)'}`,
                color: status === 'complete' ? '#ff6666' : 'rgba(255,255,255,0.48)',
              }}
            >
              <Check size={14} />{status === 'complete' ? 'Done' : 'Complete'}
            </button>
            {[['skipped', X], ['modified', Edit3]].map(([s, Icon]) => (
              <button key={s}
                onClick={() => markSession(sessionId, status === s ? null : s)}
                className="flex items-center justify-center rounded-xl px-4 py-3 min-h-[44px]"
                style={{
                  background: status === s ? 'rgba(255,102,102,0.15)' : 'rgba(51,51,51,0.40)',
                  border: `1px solid ${status === s ? 'rgba(255,102,102,0.40)' : 'rgba(255,102,102,0.10)'}`,
                  color: status === s ? '#ff6666' : 'rgba(255,255,255,0.35)',
                }}
              >
                <Icon size={14} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function Train() {
  const [view, setView] = useState('week')
  const [selectedWeek, setSelectedWeek] = useState(() => Math.max(1, Math.min(16, getWeekNumber(new Date()) || 1)))
  const [splitView, setSplitView] = useState('all')

  const currentWeekNum = getWeekNumber(new Date())
  const inPlan = currentWeekNum >= 1 && currentWeekNum <= 16
  const week = TRAINING_WEEKS[selectedWeek - 1]

  const getSessions = (w, wNum) =>
    Object.entries(w.sessions).map(([day, session]) => ({
      day, date: getSessionDate(wNum, day), session, sessionId: `w${wNum}-${day}`,
    })).filter(({ session }) => {
      if (splitView === 'hyrox') return session.type === 'stations' || session.type === 'hyrox_sim'
      if (splitView === 'run') return session.type === 'run'
      return true
    })

  const tabS = (a) => ({
    flex: 1, padding: '0.5rem', borderRadius: '0.75rem', fontSize: '0.875rem', fontWeight: 600,
    minHeight: 44, cursor: 'pointer', transition: 'all 0.15s',
    background: a ? '#ff6666' : 'rgba(51,51,51,0.55)',
    color: a ? '#000' : 'rgba(255,255,255,0.45)',
    border: a ? 'none' : '1px solid rgba(255,102,102,0.15)',
  })
  const pillS = (a) => ({
    flex: 1, padding: '0.35rem 0.25rem', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 600,
    cursor: 'pointer', transition: 'all 0.15s',
    background: a ? 'rgba(255,102,102,0.18)' : 'transparent',
    color: a ? '#ff6666' : 'rgba(255,255,255,0.30)',
    border: a ? '1px solid rgba(255,102,102,0.35)' : '1px solid transparent',
  })

  return (
    <div className="px-4 pt-6 pb-4">
      <div className="mb-4">
        <h1 className="text-2xl font-black text-white">Training Plan</h1>
        <p className="text-sm text-white/30 mt-0.5">16-week Hyrox + Half Marathon program</p>
      </div>
      <div className="flex gap-2 mb-4">
        <button onClick={() => setView('week')} style={tabS(view === 'week')}>Week View</button>
        <button onClick={() => setView('all')} style={tabS(view === 'all')}>Full Plan</button>
      </div>
      <div className="flex gap-2 mb-4">
        {['all', 'hyrox', 'run'].map(s => (
          <button key={s} onClick={() => setSplitView(s)} style={pillS(splitView === s)}>
            {s === 'all' ? 'All Sessions' : s === 'hyrox' ? 'Hyrox' : 'Running'}
          </button>
        ))}
      </div>

      {view === 'week' && week && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setSelectedWeek(w => Math.max(1, w - 1))} disabled={selectedWeek === 1}
              className="w-11 h-11 rounded-xl flex items-center justify-center disabled:opacity-20"
              style={{ background: 'rgba(51,51,51,0.55)', border: '1px solid rgba(255,102,102,0.18)', color: '#ff6666' }}>
              <ChevronLeft size={19} />
            </button>
            <div className="flex-1 text-center">
              <div className="flex items-center justify-center gap-2">
                <p className="text-lg font-black text-white">Week {selectedWeek}</p>
                <PhaseBadge phase={week.phase} />
                {selectedWeek === currentWeekNum && inPlan && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(255,102,102,0.18)', border: '1px solid rgba(255,102,102,0.40)', color: '#ff6666' }}>
                    Now
                  </span>
                )}
              </div>
              <p className="text-xs text-white/26 mt-0.5">{week.focus}</p>
            </div>
            <button onClick={() => setSelectedWeek(w => Math.min(16, w + 1))} disabled={selectedWeek === 16}
              className="w-11 h-11 rounded-xl flex items-center justify-center disabled:opacity-20"
              style={{ background: 'rgba(51,51,51,0.55)', border: '1px solid rgba(255,102,102,0.18)', color: '#ff6666' }}>
              <ChevronRight size={19} />
            </button>
          </div>
          <div className="space-y-3">
            {getSessions(week, selectedWeek).map(p => (
              <SessionCard key={p.sessionId} {...p} />
            ))}
          </div>
          {inPlan && selectedWeek !== currentWeekNum && (
            <button onClick={() => setSelectedWeek(currentWeekNum)} className="btn-secondary w-full text-sm">
              Jump to Current Week ({currentWeekNum})
            </button>
          )}
        </div>
      )}

      {view === 'all' && (
        <div className="space-y-2">
          {PHASES.map(phase => (
            <div key={phase.id}>
              <div className="flex items-center gap-3 py-2">
                <div className="h-px flex-1" style={{ background: 'rgba(255,102,102,0.15)' }} />
                <div className="flex items-center gap-2 px-3 py-1 rounded-full"
                  style={{ background: 'rgba(51,51,51,0.55)', border: '1px solid rgba(255,102,102,0.22)' }}>
                  <span className="text-xs font-black" style={{ color: '#ff6666' }}>{phase.name}</span>
                  <span className="text-xs text-white/35">{phase.label}</span>
                </div>
                <div className="h-px flex-1" style={{ background: 'rgba(255,102,102,0.15)' }} />
              </div>
              <div className="space-y-2">
                {phase.weeks.map(wNum => {
                  const w = TRAINING_WEEKS[wNum - 1]
                  if (!w) return null
                  const sessions = getSessions(w, wNum)
                  const isCurrent = wNum === currentWeekNum && inPlan
                  return (
                    <div key={wNum} className="overflow-hidden rounded-2xl" style={{
                      background: isCurrent ? 'rgba(255,102,102,0.10)' : 'rgba(51,51,51,0.40)',
                      border: isCurrent ? '1px solid rgba(255,102,102,0.40)' : '1px solid rgba(255,102,102,0.10)',
                    }}>
                      <button className="w-full p-3 text-left" onClick={() => { setSelectedWeek(wNum); setView('week') }}>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-bold ${isCurrent ? '' : 'text-white/68'}`}
                                style={isCurrent ? { color: '#ff6666' } : {}}>Week {wNum}</span>
                              {isCurrent && (
                                <span className="text-xs font-bold px-1.5 py-0.5 rounded-full"
                                  style={{ background: 'rgba(255,102,102,0.18)', border: '1px solid rgba(255,102,102,0.38)', color: '#ff6666' }}>
                                  NOW
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-white/28 mt-0.5 pr-4">{w.focus}</p>
                          </div>
                          <div className="flex gap-1.5">
                            {sessions.map(({ session }, i) => (
                              <div key={i} className="w-2 h-2 rounded-full"
                                style={{ background: session.type === 'hyrox_sim' ? '#ff6666' : 'rgba(255,102,102,0.30)' }} />
                            ))}
                          </div>
                        </div>
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
