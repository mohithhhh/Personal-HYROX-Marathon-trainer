import { Link } from 'react-router-dom'
import { ChevronRight, Flame, Trophy, Clock, Zap, AlertTriangle, CheckCircle, Calendar } from 'lucide-react'
import { useAppData } from '../hooks/useAppData'
import {
  HYROX_RACE_DATE, HALF_MARATHON_DATE, PLAN_START_DATE,
  getWeekNumber, getPhaseForWeek, getTodaySession, getThisWeekSessions, TRAINING_WEEKS
} from '../data/trainingPlan'
import { getDaysUntil, getWeeksUntil, formatDate, formatTime, formatKg } from '../utils/formatters'
import { SessionTypeBadge, PhaseBadge, StatusBadge } from '../components/ui/Badge'
import ProgressBar from '../components/ui/ProgressBar'
import ProgressRing from '../components/ui/ProgressRing'

function CountdownCard({ label, date, color, icon }) {
  const days = getDaysUntil(date)
  const weeks = getWeeksUntil(date)
  const isPast = days < 0
  return (
    <div className="card p-4 flex-1">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">{icon}</span>
        <span className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wide">{label}</span>
      </div>
      {isPast ? (
        <p className="text-sm font-bold text-[#22c55e]">Race day has passed!</p>
      ) : (
        <>
          <p className="text-3xl font-black" style={{ color }}>{days}</p>
          <p className="text-xs text-[#475569] mt-0.5">days away · {weeks} weeks</p>
          <p className="text-xs text-[#475569] mt-1">{formatDate(date, { weekday: 'short', month: 'short', day: 'numeric' })}</p>
        </>
      )}
    </div>
  )
}

function TodayWorkoutCard({ todayData, status, onMarkStatus }) {
  if (!todayData) {
    return (
      <div className="card p-5">
        <div className="flex items-center gap-3 mb-2">
          <Calendar size={20} className="text-[#475569]" />
          <span className="font-semibold text-[#94a3b8]">No Training Today</span>
        </div>
        <p className="text-sm text-[#475569]">Rest day — recover, hydrate, and fuel up.</p>
        <p className="text-xs text-[#475569] mt-2">Next session: check the Train tab.</p>
      </div>
    )
  }

  const { session, day, weekNum } = todayData
  const phase = getPhaseForWeek(weekNum)

  return (
    <div className="card p-5 glow-orange">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-[#f97316] uppercase tracking-wider">Today · Week {weekNum}</span>
            <PhaseBadge phase={phase.id} />
          </div>
          <h2 className="text-xl font-bold text-[#f1f5f9]">{session.title}</h2>
          <div className="flex items-center gap-2 mt-1">
            <SessionTypeBadge type={session.type} />
            {session.duration && (
              <span className="text-xs text-[#475569] flex items-center gap-1">
                <Clock size={11} /> {session.duration} min
              </span>
            )}
          </div>
        </div>
        {status && <StatusBadge status={status} />}
      </div>

      {session.type === 'run' && (
        <div className="bg-[#111118] rounded-xl p-3 mb-3">
          <div className="flex gap-4">
            <div>
              <p className="text-xs text-[#475569]">Distance</p>
              <p className="text-lg font-bold text-[#22c55e]">{session.distance} km</p>
            </div>
            <div>
              <p className="text-xs text-[#475569]">Pace</p>
              <p className="text-sm font-semibold text-[#f1f5f9]">{session.paceDesc}</p>
            </div>
          </div>
        </div>
      )}

      {session.type === 'stations' && session.exercises && (
        <div className="space-y-1.5 mb-3">
          {session.exercises.slice(0, 3).map((ex, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <span className="w-5 h-5 rounded-full bg-[#f97316]/20 text-[#f97316] text-xs flex items-center justify-center font-bold">{i + 1}</span>
              <span className="text-[#f1f5f9] font-medium">{ex.exercise}</span>
              <span className="text-[#475569] text-xs ml-auto">
                {ex.distance ? `${ex.sets}×${ex.distance}${ex.unit}` : ex.sets ? `${ex.sets}×${ex.reps}` : ''}
              </span>
            </div>
          ))}
          {session.exercises.length > 3 && (
            <p className="text-xs text-[#475569] pl-7">+{session.exercises.length - 3} more exercises</p>
          )}
        </div>
      )}

      {session.type === 'hyrox_sim' && (
        <div className="bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-xl p-3 mb-3">
          <p className="text-sm font-semibold text-[#ef4444]">Hyrox Simulation Day</p>
          <p className="text-xs text-[#94a3b8] mt-1">{session.stations?.length || 8} stations + runs</p>
        </div>
      )}

      {session.notes && (
        <p className="text-xs text-[#475569] italic mb-3">"{session.notes}"</p>
      )}

      {!status && (
        <div className="flex gap-2">
          <button
            onClick={() => onMarkStatus('complete')}
            className="flex-1 btn-primary py-2 text-sm gap-2"
          >
            <CheckCircle size={15} /> Mark Done
          </button>
          <Link to="/log" className="btn-secondary py-2 px-4 text-sm">
            Log It
          </Link>
        </div>
      )}
      {status === 'complete' && (
        <p className="text-sm font-semibold text-[#22c55e] flex items-center gap-2">
          <CheckCircle size={16} /> Session complete! Great work.
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
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="section-title">This Week — Week {weekNum}</p>
          <p className="text-xs text-[#475569] mt-0.5">{week.focus}</p>
        </div>
        <Link to="/train" className="text-xs text-[#f97316] font-semibold flex items-center gap-0.5">
          Full plan <ChevronRight size={14} />
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
              className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                isToday ? 'bg-[#f97316]/10 border border-[#f97316]/20' : 'bg-[#111118]'
              }`}
            >
              <div className="text-center min-w-[40px]">
                <p className={`text-xs font-bold uppercase ${isToday ? 'text-[#f97316]' : 'text-[#475569]'}`}>
                  {day.slice(0, 3)}
                </p>
                <p className="text-xs text-[#475569]">{formatDate(date)}</p>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#f1f5f9] truncate">{session.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <SessionTypeBadge type={session.type} />
                  {session.distance && <span className="text-xs text-[#475569]">{session.distance}km</span>}
                  {session.duration && <span className="text-xs text-[#475569]">{session.duration}min</span>}
                </div>
              </div>
              {status ? (
                <StatusBadge status={status} />
              ) : (
                <span className="w-2 h-2 rounded-full bg-[#2a2a3d]" />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function QuickStatsRow({ appData }) {
  const { workoutLogs, hyroxSims, bodyMetrics, getLatestWeight, isWeightLossTooFast } = appData
  const latestWeight = getLatestWeight()
  const tooFast = isWeightLossTooFast()
  const completedSessions = Object.values(appData.sessionStatus).filter(s => s === 'complete').length
  const totalSims = hyroxSims.length
  const latestSim = hyroxSims[0]

  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="stat-card items-center text-center">
        <Flame size={20} className="text-[#f97316] mb-1" />
        <p className="text-xl font-black text-[#f1f5f9]">{completedSessions}</p>
        <p className="text-xs text-[#475569]">Sessions Done</p>
      </div>
      <div className="stat-card items-center text-center">
        <Trophy size={20} className="text-[#f59e0b] mb-1" />
        <p className="text-xl font-black text-[#f1f5f9]">{totalSims}</p>
        <p className="text-xs text-[#475569]">Hyrox Sims</p>
      </div>
      <div className={`stat-card items-center text-center ${tooFast ? 'border-[#ef4444]/40' : ''}`}>
        {tooFast ? (
          <AlertTriangle size={20} className="text-[#ef4444] mb-1" />
        ) : (
          <Zap size={20} className="text-[#22c55e] mb-1" />
        )}
        <p className="text-xl font-black text-[#f1f5f9]">{latestWeight ? formatKg(latestWeight) : '—'}</p>
        <p className="text-xs text-[#475569]">{tooFast ? 'Weight ⚠️' : 'Current Weight'}</p>
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
        <div className="card p-4">
          <p className="section-title mb-2">Training Plan</p>
          <p className="text-sm text-[#94a3b8]">Plan starts in <span className="text-[#f97316] font-bold">{daysToStart} days</span></p>
          <p className="text-xs text-[#475569] mt-1">June 1, 2026 — use this time to build a base.</p>
        </div>
      )
    }
    return null
  }

  const phase = getPhaseForWeek(weekNum)
  const weeksLeft = 16 - weekNum + 1

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="section-title">Plan Progress</p>
          <p className="text-sm font-semibold text-[#f1f5f9] mt-0.5">Week {weekNum} of 16</p>
        </div>
        <div className="text-right">
          <PhaseBadge phase={phase.id} />
          <p className="text-xs text-[#475569] mt-1">{weeksLeft} weeks left</p>
        </div>
      </div>
      <ProgressBar value={doneDays} max={totalDays} color="#f97316" height={8} />
      <div className="flex justify-between mt-1.5">
        <span className="text-xs text-[#475569]">Jun 1</span>
        <span className="text-xs text-[#f97316] font-semibold">{pct}%</span>
        <span className="text-xs text-[#475569]">Sep 20</span>
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
  const weekNum = getWeekNumber(today)

  const todaySessionId = todayData
    ? `w${todayData.weekNum}-${todayData.day}`
    : null
  const todayStatus = todaySessionId ? getSessionStatus(todaySessionId) : null

  const handleMarkStatus = (status) => {
    if (todaySessionId) markSession(todaySessionId, status)
  }

  const greeting = () => {
    const h = today.getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="px-4 pt-6 pb-4 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[#475569]">{greeting()}</p>
          <h1 className="text-2xl font-black text-gradient">HyroxHalf</h1>
          <p className="text-xs text-[#475569] mt-0.5">
            {today.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-[#475569]">Hyrox</p>
          <p className="text-lg font-black text-[#f97316]">{getDaysUntil(HYROX_RACE_DATE)}d</p>
        </div>
      </div>

      {/* Countdown Cards */}
      <div className="flex gap-3">
        <CountdownCard label="Hyrox Race" date={HYROX_RACE_DATE} color="#f97316" icon="🏋️" />
        <CountdownCard label="Half Marathon" date={HALF_MARATHON_DATE} color="#6366f1" icon="🏃" />
      </div>

      {/* Plan Progress */}
      <PlanProgressCard />

      {/* Today's Workout */}
      <div>
        <p className="section-title mb-2">Today's Session</p>
        <TodayWorkoutCard
          todayData={todayData}
          status={todayStatus}
          onMarkStatus={handleMarkStatus}
        />
      </div>

      {/* This Week */}
      {weekSessions && <WeekOverviewCard weekSessions={weekSessions} />}

      {/* Quick Stats */}
      <div>
        <p className="section-title mb-2">Your Stats</p>
        <QuickStatsRow appData={appData} />
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 gap-3">
        <Link to="/nutrition" className="card p-4 flex items-center gap-3 active:bg-[#21212e]">
          <span className="text-2xl">🥗</span>
          <div>
            <p className="text-sm font-semibold text-[#f1f5f9]">Nutrition</p>
            <p className="text-xs text-[#475569]">Log your food</p>
          </div>
        </Link>
        <Link to="/hyrox" className="card p-4 flex items-center gap-3 active:bg-[#21212e]">
          <span className="text-2xl">⚡</span>
          <div>
            <p className="text-sm font-semibold text-[#f1f5f9]">Hyrox Sim</p>
            <p className="text-xs text-[#475569]">Run a simulation</p>
          </div>
        </Link>
      </div>

      {/* Warning */}
      {appData.isWeightLossTooFast() && (
        <div className="card p-4 border-[#ef4444]/40 bg-[#ef4444]/5">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-[#ef4444] mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-bold text-[#ef4444]">Weight Loss Too Fast</p>
              <p className="text-xs text-[#94a3b8] mt-1">You're losing more than 0.8kg/week — risk of muscle loss. Increase calories by 200–300 kcal/day.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
