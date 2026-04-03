import { useState } from 'react'
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Clock, Check, X, Edit3, MapPin } from 'lucide-react'
import { useAppData } from '../hooks/useAppData'
import {
  TRAINING_WEEKS, PHASES, getWeekNumber, getSessionDate, getPhaseForWeek, HYROX_STATIONS
} from '../data/trainingPlan'
import { formatDate, isPast, isToday } from '../utils/formatters'
import { SessionTypeBadge, PhaseBadge, StatusBadge } from '../components/ui/Badge'

function ExerciseList({ exercises }) {
  return (
    <div className="space-y-2 mt-3">
      {exercises.map((ex, i) => (
        <div key={i} className="flex gap-3 bg-[#111118] rounded-xl p-3">
          <div className="w-6 h-6 rounded-full bg-[#f97316]/20 text-[#f97316] text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
            {i + 1}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#f1f5f9]">{ex.exercise}</p>
            <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
              {ex.sets && (
                <span className="text-xs text-[#f97316]">
                  {ex.sets} {ex.sets === 1 ? 'set' : 'sets'}
                </span>
              )}
              {ex.reps && <span className="text-xs text-[#94a3b8]">{ex.reps} reps</span>}
              {ex.distance && (
                <span className="text-xs text-[#94a3b8]">{ex.distance}{ex.unit}</span>
              )}
              {ex.weight && <span className="text-xs text-[#6366f1]">{ex.weight}</span>}
              {ex.rest && <span className="text-xs text-[#475569]">Rest: {ex.rest}</span>}
            </div>
            {ex.notes && <p className="text-xs text-[#475569] mt-1 italic">{ex.notes}</p>}
          </div>
        </div>
      ))}
    </div>
  )
}

function HyroxSimDetails({ stations }) {
  const stationDetails = HYROX_STATIONS.filter(s => stations?.includes(s.id))
  const allStations = stations?.length === 8

  return (
    <div className="mt-3 space-y-2">
      <div className="bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-xl p-3">
        <p className="text-sm font-bold text-[#ef4444] mb-1">
          {allStations ? '8-Station Full Simulation' : `${stationDetails.length}-Station Partial Sim`}
        </p>
        <p className="text-xs text-[#94a3b8]">
          {stationDetails.length} stations + {stationDetails.length} × 1km runs
        </p>
      </div>
      {stationDetails.map((s, i) => (
        <div key={s.id} className="flex items-center gap-3 bg-[#111118] rounded-xl p-3">
          <div className="w-7 h-7 rounded-full bg-[#ef4444]/20 text-[#ef4444] text-xs flex items-center justify-center font-bold">
            {i + 1}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-[#f1f5f9]">{s.icon} {s.name}</p>
            <p className="text-xs text-[#94a3b8]">
              {s.distance ? `${s.distance}${s.unit}` : s.reps ? `${s.reps} ${s.unit}` : ''}
            </p>
          </div>
          {i < stationDetails.length - 1 && (
            <div className="text-right">
              <p className="text-xs text-[#22c55e]">→ 1km run</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function SessionCard({ session, day, date, weekNum, sessionId }) {
  const [expanded, setExpanded] = useState(false)
  const { markSession, getSessionStatus } = useAppData()
  const status = getSessionStatus(sessionId)
  const past = isPast(date)
  const today = isToday(date)

  return (
    <div className={`card overflow-hidden ${today ? 'glow-orange' : ''}`}>
      {/* Header */}
      <button
        className="w-full p-4 text-left"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`text-xs font-bold uppercase tracking-wider ${today ? 'text-[#f97316]' : 'text-[#475569]'}`}>
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </span>
              <span className="text-xs text-[#475569]">·</span>
              <span className={`text-xs ${today ? 'text-[#f97316] font-bold' : 'text-[#475569]'}`}>
                {today ? 'Today' : formatDate(date)}
              </span>
              <SessionTypeBadge type={session.type} />
              {status && <StatusBadge status={status} />}
            </div>
            <h3 className="text-base font-bold text-[#f1f5f9]">{session.title}</h3>
            <div className="flex items-center gap-3 mt-1 text-xs text-[#475569]">
              {session.duration && (
                <span className="flex items-center gap-1"><Clock size={11} /> {session.duration} min</span>
              )}
              {session.distance && (
                <span className="flex items-center gap-1"><MapPin size={11} /> {session.distance} km</span>
              )}
            </div>
          </div>
          <div className="shrink-0 text-[#475569]">
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 pb-4">
          {/* Run details */}
          {session.type === 'run' && (
            <div>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-[#111118] rounded-xl p-3">
                  <p className="text-xs text-[#475569]">Distance</p>
                  <p className="text-xl font-black text-[#22c55e]">{session.distance} km</p>
                </div>
                <div className="bg-[#111118] rounded-xl p-3">
                  <p className="text-xs text-[#475569]">Effort</p>
                  <p className="text-sm font-semibold text-[#f1f5f9]">{session.paceDesc}</p>
                </div>
              </div>
              {session.intervals && (
                <div className="bg-[#6366f1]/10 border border-[#6366f1]/20 rounded-xl p-3 mb-3">
                  <p className="text-xs font-bold text-[#6366f1] mb-2">Interval Details</p>
                  {session.intervals.map((interval, i) => (
                    <p key={i} className="text-sm text-[#f1f5f9]">
                      {interval.reps} × {interval.distance < 1 ? `${interval.distance * 1000}m` : `${interval.distance}km`} @ {interval.pace}
                      {interval.rest && <span className="text-[#475569]"> · {interval.rest}</span>}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Station details */}
          {session.type === 'stations' && session.exercises && (
            <ExerciseList exercises={session.exercises} />
          )}

          {/* Hyrox sim details */}
          {session.type === 'hyrox_sim' && (
            <HyroxSimDetails stations={session.stations} />
          )}

          {/* Race day */}
          {session.type === 'race' && (
            <div className="bg-[#f59e0b]/10 border border-[#f59e0b]/30 rounded-xl p-4">
              <p className="text-lg font-black text-[#f59e0b]">🏆 RACE DAY</p>
              <p className="text-sm text-[#94a3b8] mt-1">{session.notes}</p>
            </div>
          )}

          {/* Notes */}
          {session.notes && session.type !== 'race' && (
            <div className="mt-3 bg-[#111118] rounded-xl p-3">
              <p className="text-xs font-semibold text-[#475569] mb-1">COACH NOTES</p>
              <p className="text-sm text-[#94a3b8] italic">"{session.notes}"</p>
            </div>
          )}

          {/* Status buttons */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => markSession(sessionId, status === 'complete' ? null : 'complete')}
              className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold min-h-[44px] transition-colors ${
                status === 'complete'
                  ? 'bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]/30'
                  : 'bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/20 active:bg-[#22c55e]/20'
              }`}
            >
              <Check size={16} />
              {status === 'complete' ? 'Done ✓' : 'Mark Complete'}
            </button>
            <button
              onClick={() => markSession(sessionId, status === 'skipped' ? null : 'skipped')}
              className={`flex items-center justify-center gap-1 rounded-xl px-3 py-3 text-sm font-semibold min-h-[44px] transition-colors ${
                status === 'skipped'
                  ? 'bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/30'
                  : 'bg-[#111118] text-[#475569] border border-[#2a2a3d] active:bg-[#21212e]'
              }`}
            >
              <X size={16} />
            </button>
            <button
              onClick={() => markSession(sessionId, status === 'modified' ? null : 'modified')}
              className={`flex items-center justify-center gap-1 rounded-xl px-3 py-3 text-sm font-semibold min-h-[44px] transition-colors ${
                status === 'modified'
                  ? 'bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/30'
                  : 'bg-[#111118] text-[#475569] border border-[#2a2a3d] active:bg-[#21212e]'
              }`}
            >
              <Edit3 size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function PhaseHeader({ phase, weekNums }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="h-px flex-1" style={{ backgroundColor: phase.color + '40' }} />
      <div className="flex items-center gap-2 px-2 py-1 rounded-full border" style={{ borderColor: phase.color + '40', backgroundColor: phase.color + '10' }}>
        <span className="text-xs font-black" style={{ color: phase.color }}>{phase.name}</span>
        <span className="text-xs font-semibold text-[#475569]">{phase.label}</span>
        <span className="text-xs text-[#475569]">Wks {weekNums[0]}–{weekNums[weekNums.length - 1]}</span>
      </div>
      <div className="h-px flex-1" style={{ backgroundColor: phase.color + '40' }} />
    </div>
  )
}

export default function Train() {
  const [view, setView] = useState('week') // 'week' | 'all'
  const [selectedWeek, setSelectedWeek] = useState(() => {
    const w = getWeekNumber(new Date())
    return Math.max(1, Math.min(16, w || 1))
  })
  const [splitView, setSplitView] = useState('all') // 'all' | 'hyrox' | 'run'

  const currentWeekNum = getWeekNumber(new Date())
  const inPlan = currentWeekNum >= 1 && currentWeekNum <= 16

  const week = TRAINING_WEEKS[selectedWeek - 1]
  const phase = getPhaseForWeek(selectedWeek)

  const getSessions = (w, wNum) => {
    return Object.entries(w.sessions).map(([day, session]) => ({
      day,
      date: getSessionDate(wNum, day),
      session,
      sessionId: `w${wNum}-${day}`,
    })).filter(({ session }) => {
      if (splitView === 'hyrox') return session.type === 'stations' || session.type === 'hyrox_sim'
      if (splitView === 'run') return session.type === 'run'
      return true
    })
  }

  return (
    <div className="px-4 pt-6 pb-4">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-black text-[#f1f5f9]">Training Plan</h1>
        <p className="text-sm text-[#475569] mt-0.5">16-week Hyrox + Half Marathon program</p>
      </div>

      {/* View toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setView('week')}
          className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors min-h-[44px] ${
            view === 'week' ? 'bg-[#f97316] text-white' : 'bg-[#1a1a24] text-[#475569]'
          }`}
        >
          Week View
        </button>
        <button
          onClick={() => setView('all')}
          className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors min-h-[44px] ${
            view === 'all' ? 'bg-[#f97316] text-white' : 'bg-[#1a1a24] text-[#475569]'
          }`}
        >
          Full Plan
        </button>
      </div>

      {/* Split filter */}
      <div className="flex gap-2 mb-4">
        {['all', 'hyrox', 'run'].map(s => (
          <button
            key={s}
            onClick={() => setSplitView(s)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              splitView === s
                ? s === 'hyrox' ? 'bg-[#6366f1]/30 text-[#818cf8]' : s === 'run' ? 'bg-[#22c55e]/20 text-[#22c55e]' : 'bg-[#f97316]/20 text-[#f97316]'
                : 'bg-[#1a1a24] text-[#475569]'
            }`}
          >
            {s === 'all' ? 'All Sessions' : s === 'hyrox' ? 'Hyrox Split' : 'Run Split'}
          </button>
        ))}
      </div>

      {/* WEEK VIEW */}
      {view === 'week' && week && (
        <div className="space-y-4">
          {/* Week navigator */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedWeek(w => Math.max(1, w - 1))}
              disabled={selectedWeek === 1}
              className="w-11 h-11 rounded-xl bg-[#1a1a24] flex items-center justify-center text-[#94a3b8] disabled:opacity-30"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex-1 text-center">
              <div className="flex items-center justify-center gap-2">
                <p className="text-lg font-black text-[#f1f5f9]">Week {selectedWeek}</p>
                <PhaseBadge phase={week.phase} />
                {selectedWeek === currentWeekNum && inPlan && (
                  <span className="text-xs font-bold text-[#f97316] bg-[#f97316]/10 px-2 py-0.5 rounded-full">Current</span>
                )}
              </div>
              <p className="text-xs text-[#475569] mt-0.5">{week.focus}</p>
            </div>
            <button
              onClick={() => setSelectedWeek(w => Math.min(16, w + 1))}
              disabled={selectedWeek === 16}
              className="w-11 h-11 rounded-xl bg-[#1a1a24] flex items-center justify-center text-[#94a3b8] disabled:opacity-30"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Sessions */}
          <div className="space-y-3">
            {getSessions(week, selectedWeek).map(({ day, date, session, sessionId }) => (
              <SessionCard
                key={sessionId}
                session={session}
                day={day}
                date={date}
                weekNum={selectedWeek}
                sessionId={sessionId}
              />
            ))}
          </div>

          {/* Jump to current */}
          {inPlan && selectedWeek !== currentWeekNum && (
            <button
              onClick={() => setSelectedWeek(currentWeekNum)}
              className="w-full btn-secondary text-sm"
            >
              Jump to Current Week ({currentWeekNum})
            </button>
          )}
        </div>
      )}

      {/* FULL PLAN VIEW */}
      {view === 'all' && (
        <div className="space-y-2">
          {PHASES.map(phase => (
            <div key={phase.id}>
              <PhaseHeader phase={phase} weekNums={phase.weeks} />
              <div className="space-y-2 mt-1">
                {phase.weeks.map(wNum => {
                  const w = TRAINING_WEEKS[wNum - 1]
                  if (!w) return null
                  const sessions = getSessions(w, wNum)
                  const isCurrent = wNum === currentWeekNum && inPlan
                  return (
                    <div key={wNum} className={`card overflow-hidden ${isCurrent ? 'border-[#f97316]/40' : ''}`}>
                      <button
                        className="w-full p-3 text-left"
                        onClick={() => { setSelectedWeek(wNum); setView('week') }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-bold ${isCurrent ? 'text-[#f97316]' : 'text-[#f1f5f9]'}`}>
                                Week {wNum}
                              </span>
                              {isCurrent && <span className="text-xs text-[#f97316] bg-[#f97316]/10 px-1.5 py-0.5 rounded-full font-bold">NOW</span>}
                            </div>
                            <p className="text-xs text-[#475569] mt-0.5 pr-4">{w.focus}</p>
                          </div>
                          <div className="flex gap-1.5">
                            {sessions.map(({ session }) => (
                              <div
                                key={session.type}
                                className="w-2 h-2 rounded-full"
                                style={{
                                  backgroundColor:
                                    session.type === 'run' ? '#22c55e' :
                                    session.type === 'stations' ? '#6366f1' :
                                    session.type === 'hyrox_sim' ? '#ef4444' : '#f59e0b'
                                }}
                              />
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
