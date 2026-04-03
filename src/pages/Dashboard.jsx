import { Link } from 'react-router-dom'
import {
  ChevronRight, Flame, Trophy, Clock, Zap, AlertTriangle,
  CheckCircle, Calendar, Dumbbell, Activity, Salad, Timer
} from 'lucide-react'
import { useAppData } from '../hooks/useAppData'
import {
  HYROX_RACE_DATE, HALF_MARATHON_DATE, PLAN_START_DATE,
  getWeekNumber, getPhaseForWeek, getTodaySession, getThisWeekSessions
} from '../data/trainingPlan'
import { getDaysUntil, getWeeksUntil, formatDate, formatKg } from '../utils/formatters'
import { SessionTypeBadge, PhaseBadge, StatusBadge } from '../components/ui/Badge'
import ProgressBar from '../components/ui/ProgressBar'

function CountdownCard({ label, date, icon: Icon }) {
  const days = getDaysUntil(date)
  const weeks = getWeeksUntil(date)
  const past = days < 0
  return (
    <div className="glass p-4 flex-1">
      <div className="flex items-center gap-2 mb-3">
        <Icon size={13} strokeWidth={1.8} className="text-white/35" />
        <span className="section-title">{label}</span>
      </div>
      {past ? (
        <p className="text-sm font-bold text-white/70">Race complete!</p>
      ) : (
        <>
          <p className="text-4xl font-black text-white">{days}</p>
          <p className="text-xs text-white/30 mt-0.5">{weeks}w remaining</p>
          <p className="text-xs text-white/22 mt-1">
            {formatDate(date, { weekday: 'short', month: 'short', day: 'numeric' })}
          </p>
        </>
      )}
    </div>
  )
}

function TodayWorkoutCard({ todayData, status, onMarkStatus }) {
  if (!todayData) {
    return (
      <div className="glass p-5">
        <div className="flex items-center gap-3 mb-2">
          <Calendar size={17} strokeWidth={1.6} className="text-white/25" />
          <span className="text-sm font-semibold text-white/45">Rest Day</span>
        </div>
        <p className="text-xs text-white/28">
          Recover, hydrate, and fuel up. Next session in the Train tab.
        </p>
      </div>
    )
  }

  const { session, day, weekNum } = todayData
  const phase = getPhaseForWeek(weekNum)

  return (
    <div className="glass-active p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs font-bold text-white/38 uppercase tracking-widest">
              Today · Wk {weekNum}
            </span>
            <PhaseBadge phase={phase.id} />
          </div>
          <h2 className="text-xl font-bold text-white">{session.title}</h2>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <SessionTypeBadge type={session.type} />
            {session.duration && (
              <span className="text-xs text-white/32 flex items-center gap-1">
                <Clock size={10} /> {session.duration} min
              </span>
            )}
          </div>
        </div>
        {status && <StatusBadge status={status} />}
      </div>

      {session.type === 'run' && (
        <div className="glass-subtle p-3 mb-3 rounded-xl">
          <div className="flex gap-6">
            <div>
              <p className="text-xs text-white/30">Distance</p>
              <p className="text-2xl font-black text-white">
                {session.distance}<span className="text-sm text-white/35"> km</span>
              </p>
            </div>
            <div>
              <p className="text-xs text-white/30">Effort</p>
              <p className="text-sm font-medium text-white/65 mt-0.5">{session.paceDesc}</p>
            </div>
          </div>
        </div>
      )}

      {session.type === 'stations' && session.exercises && (
        <div className="space-y-1.5 mb-3">
          {session.exercises.slice(0, 3).map((ex, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <span
                className="w-5 h-5 rounded-full text-white/45 text-xs flex items-center justify-center font-bold"
                style={{ background: 'rgba(255,255,255,0.07)' }}
              >
                {i + 1}
              </span>
              <span className="text-white/75 font-medium">{ex.exercise}</span>
              <span className="text-white/28 text-xs ml-auto">
                {ex.distance ? `${ex.sets}×${ex.distance}${ex.unit}` : ex.reps ? `${ex.sets}×${ex.reps}` : ''}
              </span>
            </div>
          ))}
          {session.exercises.length > 3 && (
            <p className="text-xs text-white/28 pl-7">+{session.exercises.length - 3} more</p>
          )}
        </div>
      )}

      {session.type === 'hyrox_sim' && (
        <div className="glass-subtle p-3 mb-3 rounded-xl">
          <p className="text-sm font-semibold text-white/75">Hyrox Simulation Day</p>
          <p className="text-xs text-white/32 mt-0.5">8 stations + 8 × 1km runs</p>
        </div>
      )}

      {session.notes && (
        <p className="text-xs text-white/28 italic mb-3">"{session.notes}"</p>
      )}

      {!status && (
        <div className="flex gap-2">
          <button onClick={() => onMarkStatus('complete')} className="btn-primary flex-1 text-sm">
            <CheckCircle size={15} /> Mark Done
          </button>
          <Link to="/log" className="btn-secondary text-sm px-4">Log It</Link>
        </div>
      )}
      {status === 'complete' && (
        <p className="text-sm font-semibold text-white/75 flex items-center gap-2">
          <CheckCircle size={15} /> Session complete!
        </p>
      )}
    </div>
  )
}

function WeekOverviewCard({ weekSessions }) {
  const { getSessionStatus } = useAppData()
  if (!weekSessions) return null
  const { weekNum, week, sessions } = weekSessions

  return (
    <div className="glass p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="section-title">This Week — Week {weekNum}</p>
          <p className="text-xs text-white/32 mt-0.5">{week.focus}</p>
        </div>
        <Link to="/train" className="text-xs text-white/45 font-semibold flex items-center gap-0.5">
          Full plan <ChevronRight size={13} />
        </Link>
      </div>
      <div className="space-y-2">
        {sessions.map(({ day, date, session }) => {
          const sessionId = `w${weekNum}-${day}`
          const status = getSessionStatus(sessionId)
          const isToday = new Date().toISOString().split('T')[0] === date
          return (
            <div
              key={day}
              className="flex items-center gap-3 p-3 rounded-xl"
              style={{
                background: isToday ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${isToday ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.06)'}`,
              }}
            >
              <div className="text-center min-w-[40px]">
                <p className={`text-xs font-bold uppercase ${isToday ? 'text-white/75' : 'text-white/28'}`}>
                  {day.slice(0, 3)}
                </p>
                <p className="text-xs text-white/22">{formatDate(date)}</p>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white/82 truncate">{session.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <SessionTypeBadge type={session.type} />
                  {session.distance && <span className="text-xs text-white/28">{session.distance}km</span>}
                  {session.duration && <span className="text-xs text-white/28">{session.duration}min</span>}
                </div>
              </div>
              {status
                ? <StatusBadge status={status} />
                : <span className="w-2 h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.10)' }} />
              }
            </div>
          )
        })}
      </div>
    </div>
  )
}

function QuickStatsRow({ appData }) {
  const { workoutLogs, hyroxSims, getLatestWeight, isWeightLossTooFast } = appData
  const latestWeight = getLatestWeight()
  const tooFast = isWeightLossTooFast()
  const completedSessions = Object.values(appData.sessionStatus).filter(s => s === 'complete').length

  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="stat-card items-center text-center">
        <Flame size={17} strokeWidth={1.5} className="text-white/35 mb-1" />
        <p className="text-xl font-black text-white">{completedSessions}</p>
        <p className="text-xs text-white/32">Sessions</p>
      </div>
      <div className="stat-card items-center text-center">
        <Trophy size={17} strokeWidth={1.5} className="text-white/35 mb-1" />
        <p className="text-xl font-black text-white">{hyroxSims.length}</p>
        <p className="text-xs text-white/32">Simulations</p>
      </div>
      <div className={`stat-card items-center text-center ${tooFast ? 'glass-warn' : ''}`}>
        {tooFast
          ? <AlertTriangle size={17} strokeWidth={1.5} className="text-white/65 mb-1" />
          : <Zap size={17} strokeWidth={1.5} className="text-white/35 mb-1" />
        }
        <p className="text-xl font-black text-white">{latestWeight ? formatKg(latestWeight) : '—'}</p>
        <p className="text-xs text-white/32">{tooFast ? 'Weight!' : 'Weight'}</p>
      </div>
    </div>
  )
}

function PlanProgressCard() {
  const today = new Date()
  const weekNum = getWeekNumber(today)
  const planStart = new Date(PLAN_START_DATE)
  const hyroxDate = new Date(HYROX_RACE_DATE)
  const totalDays = (hyroxDate - planStart) / (1000 * 60 * 60 * 24)
  const doneDays = Math.max(0, (today - planStart) / (1000 * 60 * 60 * 24))
  const pct = Math.min(100, Math.round((doneDays / totalDays) * 100))
  const inPlan = weekNum >= 1 && weekNum <= 16

  if (!inPlan) {
    const daysToStart = getDaysUntil(PLAN_START_DATE)
    if (daysToStart > 0) {
      return (
        <div className="glass p-4">
          <p className="section-title mb-2">Training Plan</p>
          <p className="text-sm text-white/55">
            Plan starts in <span className="text-white font-bold">{daysToStart} days</span>
          </p>
          <p className="text-xs text-white/28 mt-1">June 1, 2026 — build your base now.</p>
        </div>
      )
    }
    return null
  }

  const phase = getPhaseForWeek(weekNum)
  const weeksLeft = 16 - weekNum + 1

  return (
    <div className="glass p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="section-title">Plan Progress</p>
          <p className="text-sm font-semibold text-white mt-0.5">Week {weekNum} of 16</p>
        </div>
        <div className="text-right">
          <PhaseBadge phase={phase.id} />
          <p className="text-xs text-white/28 mt-1">{weeksLeft} wks left</p>
        </div>
      </div>
      <ProgressBar value={doneDays} max={totalDays} height={6} />
      <div className="flex justify-between mt-1.5">
        <span className="text-xs text-white/22">Jun 1</span>
        <span className="text-xs text-white/55 font-semibold">{pct}%</span>
        <span className="text-xs text-white/22">Sep 20</span>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const appData = useAppData()
  const { markSession, getSessionStatus } = appData

  const today = new Date()
  const todayData = getTodaySession()
  const weekSessions = getThisWeekSessions()

  const todaySessionId = todayData ? `w${todayData.weekNum}-${todayData.day}` : null
  const todayStatus = todaySessionId ? getSessionStatus(todaySessionId) : null

  const handleMarkStatus = (status) => {
    if (todaySessionId) markSession(todaySessionId, status)
  }

  const hour = today.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="px-4 pt-6 pb-4 space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-white/28">{greeting}</p>
          <h1 className="text-2xl font-black text-white mt-0.5">HyroxHalf</h1>
          <p className="text-xs text-white/22 mt-0.5">
            {today.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-white/28">Hyrox in</p>
          <p className="text-2xl font-black text-white">
            {getDaysUntil(HYROX_RACE_DATE)}<span className="text-sm text-white/35">d</span>
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <CountdownCard label="Hyrox Race" date={HYROX_RACE_DATE} icon={Dumbbell} />
        <CountdownCard label="Half Marathon" date={HALF_MARATHON_DATE} icon={Activity} />
      </div>

      <PlanProgressCard />

      <div>
        <p className="section-title mb-2">Today's Session</p>
        <TodayWorkoutCard todayData={todayData} status={todayStatus} onMarkStatus={handleMarkStatus} />
      </div>

      {weekSessions && <WeekOverviewCard weekSessions={weekSessions} />}

      <div>
        <p className="section-title mb-2">Your Stats</p>
        <QuickStatsRow appData={appData} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Link to="/nutrition" className="glass p-4 flex items-center gap-3 active:bg-white/8 transition-colors">
          <Salad size={20} strokeWidth={1.5} className="text-white/35 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-white/82">Nutrition</p>
            <p className="text-xs text-white/28">Log your food</p>
          </div>
        </Link>
        <Link to="/hyrox" className="glass p-4 flex items-center gap-3 active:bg-white/8 transition-colors">
          <Timer size={20} strokeWidth={1.5} className="text-white/35 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-white/82">Hyrox Sim</p>
            <p className="text-xs text-white/28">Run a simulation</p>
          </div>
        </Link>
      </div>

      {appData.isWeightLossTooFast() && (
        <div className="glass-warn p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle size={17} strokeWidth={1.6} className="text-white/65 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-bold text-white/88">Weight loss too fast</p>
              <p className="text-xs text-white/42 mt-1">
                Losing &gt;0.8 kg/week risks muscle loss. Increase calories by 200–300 kcal/day.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
