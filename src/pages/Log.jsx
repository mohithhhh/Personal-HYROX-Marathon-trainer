import { useState } from 'react'
import { CheckCircle, ChevronDown, Trash2, Clock, MapPin, Zap, Activity, Dumbbell, Timer } from 'lucide-react'
import { useAppData } from '../hooks/useAppData'
import { HYROX_STATIONS } from '../data/trainingPlan'
import { formatDate, formatTime } from '../utils/formatters'
import { SessionTypeBadge } from '../components/ui/Badge'

const INNER = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12 }
const INPUT_SM = {
  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)',
  borderRadius: 8, padding: '0.375rem 0.625rem', color: '#fff', outline: 'none', width: '100%',
}

const SESSION_TYPES = [
  { id: 'run', label: 'Run', icon: Activity, desc: 'Easy, interval, or long run' },
  { id: 'stations', label: 'Stations', icon: Dumbbell, desc: 'Hyrox station training' },
  { id: 'combo', label: 'Combo', icon: Zap, desc: 'Mixed stations + run' },
  { id: 'hyrox_sim', label: 'Hyrox Sim', icon: Timer, desc: 'Full simulation' },
]

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-white/32 mb-1.5">{label}</label>
      {children}
    </div>
  )
}

function NumInput({ label, value, onChange, unit, step = 1, min = 0, placeholder = '0' }) {
  return (
    <Field label={label}>
      <div className="relative">
        <input type="number" value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder} step={step} min={min} className="input-field pr-12" />
        {unit && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/28 font-medium">{unit}</span>}
      </div>
    </Field>
  )
}

function EffortSlider({ value, onChange }) {
  const pct = value * 10
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-semibold text-white/32">Effort (RPE)</label>
        <span className="text-sm font-bold text-white/80">{value}/10</span>
      </div>
      <input type="range" min={1} max={10} value={value} onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
        style={{ background: `linear-gradient(to right, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.7) ${pct}%, rgba(255,255,255,0.10) ${pct}%, rgba(255,255,255,0.10) 100%)` }}
      />
    </div>
  )
}

function RunLogger({ data, onChange }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <NumInput label="Distance (km)" value={data.distance} onChange={v => onChange('distance', v)} unit="km" step={0.1} placeholder="5.0" />
        <NumInput label="Duration (min)" value={data.duration} onChange={v => onChange('duration', v)} unit="min" placeholder="45" />
      </div>
      <NumInput label="Avg Pace (min/km)" value={data.pace} onChange={v => onChange('pace', v)} unit="/km" step={0.1} placeholder="6.5" />
      <EffortSlider value={data.effort || 5} onChange={v => onChange('effort', v)} />
      <Field label="Notes">
        <textarea value={data.notes} onChange={e => onChange('notes', e.target.value)}
          placeholder="How did it feel?" rows={2} className="input-field resize-none" />
      </Field>
    </div>
  )
}

function StationRow({ station, data, onChange }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-xl overflow-hidden" style={INNER}>
      <button className="w-full flex items-center gap-3 p-3 text-left" onClick={() => setOpen(o => !o)}>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white/82">{station.name}</p>
          <p className="text-xs text-white/30">{station.distance ? `${station.distance}${station.unit}` : `${station.reps} ${station.unit}`}</p>
        </div>
        {data.time && <span className="text-xs font-bold text-white/70 mr-1">{formatTime(Number(data.time))}</span>}
        <ChevronDown size={15} className={`text-white/28 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-3 pb-3 pt-1 space-y-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-white/28 block mb-1">Time (sec)</label>
              <input type="number" value={data.time || ''} onChange={e => onChange('time', e.target.value)}
                placeholder="240" style={INPUT_SM} />
            </div>
            <div>
              <label className="text-xs text-white/28 block mb-1">{station.unit === 'reps' ? 'Reps' : 'Weight (kg)'}</label>
              <input type="number" value={station.unit === 'reps' ? (data.reps || '') : (data.weight || '')}
                onChange={e => onChange(station.unit === 'reps' ? 'reps' : 'weight', e.target.value)}
                placeholder={station.unit === 'reps' ? '100' : '20'} style={INPUT_SM} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function StationsLogger({ data, onChange }) {
  const updateStation = (id, field, value) => onChange('stations', { ...data.stations, [id]: { ...(data.stations[id] || {}), [field]: value } })
  return (
    <div className="space-y-3">
      <p className="text-xs text-white/28">Tap each station to log.</p>
      {HYROX_STATIONS.map(s => (
        <StationRow key={s.id} station={s} data={data.stations?.[s.id] || {}}
          onChange={(field, value) => updateStation(s.id, field, value)} />
      ))}
      <NumInput label="Total Duration (min)" value={data.duration} onChange={v => onChange('duration', v)} unit="min" />
      <Field label="Notes">
        <textarea value={data.notes} onChange={e => onChange('notes', e.target.value)}
          placeholder="How did it feel?" rows={2} className="input-field resize-none" />
      </Field>
    </div>
  )
}

function HyroxSimLogger({ data, onChange }) {
  const updateStation = (id, field, value) => onChange('stations', { ...data.stations, [id]: { ...(data.stations[id] || {}), [field]: value } })
  const updateRun = (i, val) => {
    const splits = [...(data.runSplits || Array(8).fill(''))]
    splits[i] = val
    onChange('runSplits', splits)
  }

  const stationSecs = HYROX_STATIONS.reduce((s, st) => s + Number(data.stations?.[st.id]?.time || 0), 0)
  const runSecs = (data.runSplits || []).reduce((s, t) => s + Number(t || 0), 0)
  const total = stationSecs + runSecs

  return (
    <div className="space-y-4">
      {total > 0 && (
        <div className="p-4 rounded-2xl text-center" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.13)' }}>
          <p className="text-xs text-white/30 mb-1">Running Total</p>
          <p className="text-4xl font-black text-white">{formatTime(total)}</p>
          <div className="flex justify-center gap-4 mt-2 text-xs text-white/30">
            <span>Stations: {formatTime(stationSecs)}</span>
            <span>Runs: {formatTime(runSecs)}</span>
          </div>
        </div>
      )}
      {HYROX_STATIONS.map((station, i) => (
        <div key={station.id} className="space-y-2">
          <div className="flex items-center justify-between p-2.5 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <span className="text-xs font-semibold text-white/55">Run {i + 1} — 1km</span>
            <div className="flex items-center gap-2">
              <input type="number" placeholder="sec" value={(data.runSplits || [])[i] || ''}
                onChange={e => updateRun(i, e.target.value)}
                className="w-20 text-right text-xs font-bold text-white/75 focus:outline-none"
                style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.75)' }} />
              <span className="text-xs text-white/28">s</span>
            </div>
          </div>
          <StationRow station={station} data={data.stations?.[station.id] || {}}
            onChange={(field, value) => updateStation(station.id, field, value)} />
        </div>
      ))}
      <Field label="Notes">
        <textarea value={data.notes} onChange={e => onChange('notes', e.target.value)}
          placeholder="PRs? Struggles? Highlights..." rows={2} className="input-field resize-none" />
      </Field>
    </div>
  )
}

function LogHistory({ logs, onDelete }) {
  if (!logs.length) return (
    <div className="text-center py-10">
      <p className="text-white/38">No sessions logged yet.</p>
      <p className="text-xs text-white/22 mt-1">Log your first session above.</p>
    </div>
  )
  return (
    <div className="space-y-3">
      {logs.slice(0, 20).map(log => (
        <div key={log.id} className="glass p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <SessionTypeBadge type={log.type} />
                <span className="text-xs text-white/30">{formatDate(log.date)}</span>
              </div>
              <div className="flex gap-4 text-sm">
                {log.distance && (
                  <span className="flex items-center gap-1 text-white/75 font-semibold">
                    <MapPin size={11} className="text-white/35" /> {log.distance}km
                  </span>
                )}
                {log.duration && (
                  <span className="flex items-center gap-1 text-white/42">
                    <Clock size={11} /> {log.duration}min
                  </span>
                )}
                {log.effort && (
                  <span className="flex items-center gap-1 text-white/42">
                    <Zap size={11} /> RPE {log.effort}
                  </span>
                )}
              </div>
              {log.notes && <p className="text-xs text-white/28 mt-1.5 italic">"{log.notes}"</p>}
            </div>
            <button onClick={() => onDelete(log.id)}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-white/25 active:text-white/60">
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Log() {
  const { addWorkoutLog, deleteWorkoutLog, workoutLogs } = useAppData()
  const [tab, setTab] = useState('log')
  const [type, setType] = useState('run')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ distance: '', duration: '', pace: '', effort: 5, notes: '', stations: {}, runSplits: Array(8).fill('') })

  const updateField = (field, value) => setForm(d => ({ ...d, [field]: value }))

  const handleSubmit = () => {
    if (!date) return
    addWorkoutLog({
      type, date,
      distance: form.distance ? Number(form.distance) : undefined,
      duration: form.duration ? Number(form.duration) : undefined,
      pace: form.pace ? Number(form.pace) : undefined,
      effort: form.effort,
      notes: form.notes,
      stations: (type === 'stations' || type === 'hyrox_sim') ? form.stations : undefined,
      runSplits: type === 'hyrox_sim' ? form.runSplits.map(Number).filter(Boolean) : undefined,
    })
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setForm({ distance: '', duration: '', pace: '', effort: 5, notes: '', stations: {}, runSplits: Array(8).fill('') })
    }, 2000)
  }

  const tabS = (a) => ({
    flex: 1, padding: '0.5rem', borderRadius: '0.75rem', fontSize: '0.875rem', fontWeight: 600,
    minHeight: 44, cursor: 'pointer', transition: 'all 0.15s',
    background: a ? '#fff' : 'rgba(255,255,255,0.06)', color: a ? '#000' : 'rgba(255,255,255,0.38)',
    border: a ? 'none' : '1px solid rgba(255,255,255,0.09)',
  })

  return (
    <div className="px-4 pt-6 pb-4">
      <h1 className="text-2xl font-black text-white mb-4">Log Session</h1>
      <div className="flex gap-2 mb-5">
        <button onClick={() => setTab('log')} style={tabS(tab === 'log')}>Log Session</button>
        <button onClick={() => setTab('history')} style={tabS(tab === 'history')}>History</button>
      </div>

      {tab === 'log' && (
        <div className="space-y-5">
          {submitted && (
            <div className="glass p-4 flex items-center gap-3" style={{ border: '1px solid rgba(255,255,255,0.25)' }}>
              <CheckCircle size={18} strokeWidth={1.8} className="text-white/80" />
              <p className="text-sm font-semibold text-white/80">Session logged!</p>
            </div>
          )}

          <div>
            <p className="section-title mb-2">Session Type</p>
            <div className="grid grid-cols-2 gap-2">
              {SESSION_TYPES.map(t => {
                const Icon = t.icon
                const active = type === t.id
                return (
                  <button key={t.id} onClick={() => setType(t.id)}
                    className="p-3 rounded-xl text-left min-h-[44px]"
                    style={{
                      background: active ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.04)',
                      border: active ? '1px solid rgba(255,255,255,0.28)' : '1px solid rgba(255,255,255,0.07)',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Icon size={18} strokeWidth={1.6} className={active ? 'text-white/85' : 'text-white/32'} />
                      <div>
                        <p className={`text-sm font-bold ${active ? 'text-white' : 'text-white/60'}`}>{t.label}</p>
                        <p className="text-xs text-white/25">{t.desc}</p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <Field label="Date">
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="input-field" style={{ colorScheme: 'dark' }} />
          </Field>

          {type === 'run' && <RunLogger data={form} onChange={updateField} />}
          {type === 'stations' && <StationsLogger data={form} onChange={updateField} />}
          {type === 'combo' && (
            <div className="space-y-4">
              <RunLogger data={form} onChange={updateField} />
              <StationsLogger data={form} onChange={updateField} />
            </div>
          )}
          {type === 'hyrox_sim' && <HyroxSimLogger data={form} onChange={updateField} />}

          <button onClick={handleSubmit} disabled={submitted} className="btn-primary w-full text-base">
            <CheckCircle size={17} />
            {submitted ? 'Logged!' : 'Save Session'}
          </button>
        </div>
      )}

      {tab === 'history' && <LogHistory logs={workoutLogs} onDelete={deleteWorkoutLog} />}
    </div>
  )
}
