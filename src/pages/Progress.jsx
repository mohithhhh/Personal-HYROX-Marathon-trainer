import { useState } from 'react'
import { AlertTriangle, Trophy, TrendingUp, Scale, Plus, Download } from 'lucide-react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Area, AreaChart
} from 'recharts'
import { useAppData } from '../hooks/useAppData'
import { formatDate, formatKg, formatTime } from '../utils/formatters'
import ProgressBar from '../components/ui/ProgressBar'
import TrainingInsights from '../components/TrainingInsights'

const CHART_TOOLTIP_STYLE = {
  contentStyle: { backgroundColor: 'rgba(8,8,8,0.92)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8 },
  labelStyle: { color: 'rgba(255,255,255,0.38)', fontSize: 11 },
  itemStyle: { color: 'rgba(255,255,255,0.75)', fontSize: 11 },
}

const INNER = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12 }

function WeightChart({ metrics }) {
  if (metrics.length < 2) return null
  const data = [...metrics].reverse().map(m => ({
    date: formatDate(m.date, { month: 'short', day: 'numeric' }),
    weight: m.weight,
  }))

  const minWeight = Math.min(...data.map(d => d.weight)) - 1
  const maxWeight = Math.max(...data.map(d => d.weight)) + 1

  return (
    <div className="glass p-4">
      <p className="text-sm font-bold text-white/82 mb-3">Weight Over Time</p>
      <ResponsiveContainer width="100%" height={160}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
          <defs>
            <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="rgba(255,255,255,0.4)" stopOpacity={1} />
              <stop offset="95%" stopColor="rgba(255,255,255,0)" stopOpacity={1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.28)', fontSize: 10 }} />
          <YAxis domain={[minWeight, maxWeight]} tick={{ fill: 'rgba(255,255,255,0.28)', fontSize: 10 }} unit="kg" />
          <Tooltip {...CHART_TOOLTIP_STYLE} formatter={(v) => [`${v}kg`, 'Weight']} />
          <Area type="monotone" dataKey="weight" stroke="rgba(255,255,255,0.65)" strokeWidth={2}
            fill="url(#weightGrad)" dot={{ fill: 'rgba(255,255,255,0.65)', r: 3 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

function RunDistanceChart({ logs }) {
  const runLogs = logs.filter(l => l.type === 'run' && l.distance)
  if (runLogs.length < 2) return null
  const data = [...runLogs].reverse().slice(0, 20).map((l, i) => ({
    date: formatDate(l.date, { month: 'short', day: 'numeric' }),
    distance: l.distance,
  }))

  return (
    <div className="glass p-4">
      <p className="text-sm font-bold text-white/82 mb-3">Run Distance Progress</p>
      <ResponsiveContainer width="100%" height={140}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.28)', fontSize: 10 }} />
          <YAxis tick={{ fill: 'rgba(255,255,255,0.28)', fontSize: 10 }} unit="km" />
          <Tooltip {...CHART_TOOLTIP_STYLE} formatter={(v) => [`${v}km`, 'Distance']} />
          <Bar dataKey="distance" fill="rgba(255,255,255,0.55)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

function PRCard({ title, value, date, unit }) {
  if (!value) return null
  return (
    <div className="rounded-xl p-3 flex items-start gap-3" style={INNER}>
      <Trophy size={16} className="text-white/35 mt-0.5 shrink-0" />
      <div className="flex-1">
        <p className="text-xs text-white/38 font-semibold uppercase tracking-wide">{title}</p>
        <p className="text-lg font-black text-white/82">{value}{unit}</p>
        {date && <p className="text-xs text-white/28 mt-0.5">{formatDate(date)}</p>}
      </div>
    </div>
  )
}

function PersonalRecords({ prs, hyroxSims, workoutLogs }) {
  const bestSim = hyroxSims.length ? Math.min(...hyroxSims.map(s => s.totalTime)) : null
  const bestSimDate = hyroxSims.find(s => s.totalTime === bestSim)?.date

  const longestRun = workoutLogs
    .filter(l => l.type === 'run' && l.distance)
    .reduce((max, l) => l.distance > max.val ? { val: l.distance, date: l.date } : max, { val: 0, date: null })

  const bestPace = workoutLogs
    .filter(l => l.type === 'run' && l.pace)
    .reduce((best, l) => l.pace < best.val ? { val: l.pace, date: l.date } : best, { val: Infinity, date: null })

  const hasPRs = longestRun.val > 0 || bestPace.val < Infinity || bestSim

  return (
    <div className="glass p-4">
      <div className="flex items-center gap-2 mb-3">
        <Trophy size={16} className="text-white/35" />
        <p className="text-sm font-bold text-white/82">Personal Records</p>
      </div>
      {!hasPRs ? (
        <p className="text-sm text-white/38 text-center py-4">Log sessions to track your PRs!</p>
      ) : (
        <div className="space-y-2">
          {longestRun.val > 0 && (
            <PRCard title="Longest Run" value={longestRun.val} unit="km" date={longestRun.date} />
          )}
          {bestPace.val < Infinity && (
            <PRCard title="Best Avg Pace"
              value={`${Math.floor(bestPace.val)}:${String(Math.round((bestPace.val % 1) * 60)).padStart(2, '0')}`}
              unit="/km" date={bestPace.date} />
          )}
          {bestSim && (
            <PRCard title="Best Hyrox Sim" value={formatTime(bestSim)} unit="" date={bestSimDate} />
          )}
          {prs.fastest1km && (
            <PRCard title="Fastest 1km" value={formatTime(prs.fastest1km)} unit="" date={prs.fastest1kmDate} />
          )}
        </div>
      )}
    </div>
  )
}

function BodyMetricsForm({ onSave }) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [weight, setWeight] = useState('')
  const [waist, setWaist] = useState('')
  const [chest, setChest] = useState('')
  const [arms, setArms] = useState('')
  const [open, setOpen] = useState(false)

  const handleSave = () => {
    if (!weight) return
    onSave({ date, weight: Number(weight), waist: waist ? Number(waist) : undefined, chest: chest ? Number(chest) : undefined, arms: arms ? Number(arms) : undefined })
    setWeight(''); setWaist(''); setChest(''); setArms(''); setOpen(false)
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="btn-secondary w-full gap-2">
        <Plus size={16} /> Log Body Metrics
      </button>
    )
  }

  return (
    <div className="glass p-4 space-y-3">
      <p className="section-title">Log Body Metrics</p>
      <div>
        <label className="block text-xs font-semibold text-white/32 mb-1">Date</label>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="input-field" style={{ colorScheme: 'dark' }} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-white/32 mb-1">Weight (kg) *</label>
          <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="75.0" step="0.1" className="input-field" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-white/32 mb-1">Waist (cm)</label>
          <input type="number" value={waist} onChange={e => setWaist(e.target.value)} placeholder="85" className="input-field" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-white/32 mb-1">Chest (cm)</label>
          <input type="number" value={chest} onChange={e => setChest(e.target.value)} placeholder="95" className="input-field" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-white/32 mb-1">Arms (cm)</label>
          <input type="number" value={arms} onChange={e => setArms(e.target.value)} placeholder="35" className="input-field" />
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={() => setOpen(false)} className="btn-secondary flex-1 text-sm">Cancel</button>
        <button onClick={handleSave} disabled={!weight} className="btn-primary flex-1 text-sm gap-1">
          <Scale size={15} /> Save
        </button>
      </div>
    </div>
  )
}

function WeightSummary({ metrics, isWarning }) {
  const latest = metrics[0]
  const prev = metrics[1]
  if (!latest) return null

  const change = prev ? latest.weight - prev.weight : null
  const weeklyChange = (() => {
    if (metrics.length < 2) return null
    const weekAgoEntry = metrics.find(m => {
      const diff = (new Date(latest.date) - new Date(m.date)) / (1000 * 60 * 60 * 24)
      return diff >= 5 && diff <= 9
    })
    if (!weekAgoEntry) return null
    return latest.weight - weekAgoEntry.weight
  })()

  return (
    <div className={isWarning ? 'glass-warn p-4' : 'glass p-4'}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-bold text-white/82">Body Weight</p>
        {isWarning && (
          <div className="flex items-center gap-1 text-xs text-white/70 font-semibold">
            <AlertTriangle size={14} /> Too Fast
          </div>
        )}
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl p-3 text-center" style={INNER}>
          <p className="text-xl font-black text-white">{latest.weight}<span className="text-xs text-white/30">kg</span></p>
          <p className="text-xs text-white/30">Current</p>
        </div>
        <div className="rounded-xl p-3 text-center" style={INNER}>
          {change !== null ? (
            <>
              <p className="text-xl font-black text-white flex items-center justify-center gap-0.5">
                {change > 0 ? '+' : ''}{change.toFixed(1)}<span className="text-xs text-white/30">kg</span>
              </p>
              <p className="text-xs text-white/30">Since last</p>
            </>
          ) : <p className="text-xs text-white/28 mt-3">—</p>}
        </div>
        <div className="rounded-xl p-3 text-center" style={INNER}>
          {weeklyChange !== null ? (
            <>
              <p className="text-xl font-black text-white flex items-center justify-center gap-0.5">
                {weeklyChange > 0 ? '+' : ''}{weeklyChange.toFixed(1)}<span className="text-xs text-white/30">kg</span>
              </p>
              <p className="text-xs text-white/30">This week</p>
            </>
          ) : <p className="text-xs text-white/28 mt-3">—</p>}
        </div>
      </div>

      {isWarning && (
        <div className="mt-3 rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <p className="text-xs font-bold text-white/75">Weight loss too fast!</p>
          <p className="text-xs text-white/42 mt-1">
            Losing &gt;0.8kg/week risks muscle loss. Increase daily calories by 200–300 kcal and ensure protein intake is ≥{Math.round((metrics[0]?.weight || 75) * 1.7)}g/day.
          </p>
        </div>
      )}
    </div>
  )
}

function TrainingStats({ workoutLogs, sessionStatus }) {
  const totalSessions = workoutLogs.length
  const completedFromPlan = Object.values(sessionStatus).filter(s => s === 'complete').length
  const skippedFromPlan = Object.values(sessionStatus).filter(s => s === 'skipped').length
  const totalRunKm = workoutLogs
    .filter(l => l.type === 'run' && l.distance)
    .reduce((sum, l) => sum + l.distance, 0)

  return (
    <div className="glass p-4">
      <p className="text-sm font-bold text-white/82 mb-3">Training Overview</p>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl p-3 text-center" style={INNER}>
          <p className="text-2xl font-black text-white">{totalSessions}</p>
          <p className="text-xs text-white/30">Sessions Logged</p>
        </div>
        <div className="rounded-xl p-3 text-center" style={INNER}>
          <p className="text-2xl font-black text-white">{totalRunKm.toFixed(1)}</p>
          <p className="text-xs text-white/30">Total km Run</p>
        </div>
        <div className="rounded-xl p-3 text-center" style={INNER}>
          <p className="text-2xl font-black text-white">{completedFromPlan}</p>
          <p className="text-xs text-white/30">Plan Sessions Done</p>
        </div>
        <div className="rounded-xl p-3 text-center" style={INNER}>
          <p className="text-2xl font-black text-white/55">{skippedFromPlan}</p>
          <p className="text-xs text-white/30">Sessions Skipped</p>
        </div>
      </div>
    </div>
  )
}

function ExportButton({ workoutLogs }) {
  const handleExport = () => {
    const headers = ['Date', 'Type', 'Distance(km)', 'Duration(min)', 'Pace', 'Effort', 'Notes']
    const rows = workoutLogs.map(l => [
      l.date, l.type, l.distance || '', l.duration || '', l.pace || '', l.effort || '', (l.notes || '').replace(/,/g, ';')
    ])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `hyroxhalf-log-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <button onClick={handleExport} className="btn-secondary w-full text-sm gap-2">
      <Download size={15} /> Export Workout Log as CSV
    </button>
  )
}

const TABS = ['overview', 'weight', 'runs']

const tabS = (a) => ({
  flex: 1, padding: '0.5rem', borderRadius: '0.75rem', fontSize: '0.75rem', fontWeight: 600,
  minHeight: 44, cursor: 'pointer', transition: 'all 0.15s', textTransform: 'capitalize',
  background: a ? '#fff' : 'rgba(255,255,255,0.06)', color: a ? '#000' : 'rgba(255,255,255,0.38)',
  border: a ? 'none' : '1px solid rgba(255,255,255,0.09)',
})

export default function Progress() {
  const { workoutLogs, hyroxSims, bodyMetrics, nutritionLogs, sessionStatus, personalRecords, addBodyMetric, isWeightLossTooFast } = useAppData()
  const [tab, setTab] = useState('overview')
  const warning = isWeightLossTooFast()

  return (
    <div className="px-4 pt-6 pb-4">
      <div className="flex items-start justify-between mb-4">
        <h1 className="text-2xl font-black text-white">Progress</h1>
        {warning && (
          <div className="flex items-center gap-1 text-xs text-white/70 font-bold px-2 py-1 rounded-full"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.20)' }}>
            <AlertTriangle size={12} /> Weight Warning
          </div>
        )}
      </div>

      <div className="flex gap-2 mb-5">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={tabS(tab === t)}>{t}</button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="space-y-4">
          <TrainingInsights workoutLogs={workoutLogs} nutritionLogs={nutritionLogs} hyroxSims={hyroxSims} bodyMetrics={bodyMetrics} />
          <TrainingStats workoutLogs={workoutLogs} sessionStatus={sessionStatus} />
          <PersonalRecords prs={personalRecords} hyroxSims={hyroxSims} workoutLogs={workoutLogs} />
          <ExportButton workoutLogs={workoutLogs} />
        </div>
      )}

      {tab === 'weight' && (
        <div className="space-y-4">
          <WeightSummary metrics={bodyMetrics} isWarning={warning} />
          <WeightChart metrics={bodyMetrics} />
          <BodyMetricsForm onSave={addBodyMetric} />

          {bodyMetrics.length > 0 && (
            <div className="glass p-4">
              <p className="section-title mb-3">Weight Log</p>
              <div className="space-y-2">
                {bodyMetrics.slice(0, 10).map((m, i) => {
                  const prev = bodyMetrics[i + 1]
                  const change = prev ? m.weight - prev.weight : null
                  return (
                    <div key={m.id} className="flex items-center justify-between py-2"
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <span className="text-xs text-white/38">{formatDate(m.date, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-white/82">{m.weight}kg</span>
                        {change !== null && (
                          <span className="text-xs font-semibold text-white/45">
                            {change > 0 ? '+' : ''}{change.toFixed(1)}
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'runs' && (
        <div className="space-y-4">
          <RunDistanceChart logs={workoutLogs} />

          {workoutLogs.filter(l => l.type === 'run').length === 0 ? (
            <div className="glass p-8 text-center">
              <TrendingUp size={40} className="text-white/12 mx-auto mb-3" />
              <p className="text-white/55">No runs logged yet</p>
              <p className="text-xs text-white/28 mt-1">Log your runs in the Log tab to see progress here.</p>
            </div>
          ) : (
            <div className="glass p-4">
              <p className="section-title mb-3">Run History</p>
              <div className="space-y-2">
                {workoutLogs.filter(l => l.type === 'run' && l.distance).slice(0, 15).map(l => (
                  <div key={l.id} className="flex items-center justify-between py-2"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <div>
                      <span className="text-xs text-white/38">{formatDate(l.date, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                      <p className="text-sm font-bold text-white/75">{l.distance}km</p>
                    </div>
                    <div className="text-right">
                      {l.duration && <p className="text-xs text-white/30">{l.duration} min</p>}
                      {l.pace && <p className="text-xs text-white/55 font-semibold">{Math.floor(l.pace)}:{String(Math.round((l.pace % 1) * 60)).padStart(2, '0')}/km</p>}
                      {l.effort && <p className="text-xs text-white/30">RPE {l.effort}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
