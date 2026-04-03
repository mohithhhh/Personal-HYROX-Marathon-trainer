import { useState } from 'react'
import { CheckCircle, ChevronDown, Trash2, Clock, MapPin, Zap, Trophy } from 'lucide-react'
import { useAppData } from '../hooks/useAppData'
import { HYROX_STATIONS } from '../data/trainingPlan'
import { formatDate, formatTime, formatKg } from '../utils/formatters'
import { SessionTypeBadge } from '../components/ui/Badge'

const SESSION_TYPES = [
  { id: 'run', label: 'Run', emoji: '🏃', color: '#22c55e', description: 'Easy, interval, or long run' },
  { id: 'stations', label: 'Stations', emoji: '💪', color: '#6366f1', description: 'Hyrox station training' },
  { id: 'combo', label: 'Combo', emoji: '⚡', color: '#f97316', description: 'Mixed stations + running' },
  { id: 'hyrox_sim', label: 'Hyrox Sim', emoji: '🏋️', color: '#ef4444', description: 'Full simulation day' },
]

const EFFORT_LABELS = ['', 'Very Easy', 'Easy', 'Easy', 'Moderate', 'Moderate', 'Hard', 'Hard', 'Very Hard', 'Max', 'Limit']
const EFFORT_COLORS = ['', '#22c55e', '#22c55e', '#22c55e', '#86efac', '#f59e0b', '#f97316', '#f97316', '#ef4444', '#ef4444', '#dc2626']

function NumberInput({ label, value, onChange, unit, step = 1, min = 0, placeholder = '0' }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[#475569] mb-1.5">{label}</label>
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          step={step}
          min={min}
          className="input-field pr-12"
        />
        {unit && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#475569] font-medium">{unit}</span>
        )}
      </div>
    </div>
  )
}

function TextInput({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[#475569] mb-1.5">{label}</label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={2}
        className="input-field resize-none"
      />
    </div>
  )
}

function EffortSlider({ value, onChange }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-semibold text-[#475569]">Effort Level (RPE)</label>
        <span className="text-sm font-bold" style={{ color: EFFORT_COLORS[value] || '#475569' }}>
          {value}/10 · {EFFORT_LABELS[value] || '—'}
        </span>
      </div>
      <input
        type="range"
        min={1}
        max={10}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, ${EFFORT_COLORS[value] || '#f97316'} 0%, ${EFFORT_COLORS[value] || '#f97316'} ${value * 10}%, #2a2a3d ${value * 10}%, #2a2a3d 100%)`
        }}
      />
      <div className="flex justify-between mt-1">
        <span className="text-xs text-[#475569]">1</span>
        <span className="text-xs text-[#475569]">10</span>
      </div>
    </div>
  )
}

function RunLogger({ data, onChange }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <NumberInput label="Distance (km)" value={data.distance} onChange={v => onChange('distance', v)} unit="km" step={0.1} placeholder="5.0" />
        <NumberInput label="Duration (min)" value={data.duration} onChange={v => onChange('duration', v)} unit="min" placeholder="45" />
      </div>
      <NumberInput label="Avg Pace (min/km)" value={data.pace} onChange={v => onChange('pace', v)} unit="/km" step={0.1} placeholder="6.5" />
      <EffortSlider value={data.effort || 5} onChange={v => onChange('effort', v)} />
      <TextInput
        label="Notes"
        value={data.notes}
        onChange={v => onChange('notes', v)}
        placeholder="How did it feel? Any highlights..."
      />
    </div>
  )
}

function StationRow({ station, data, onChange }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="bg-[#111118] rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center gap-3 p-3 text-left"
        onClick={() => setOpen(o => !o)}
      >
        <span className="text-lg">{station.icon}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#f1f5f9]">{station.name}</p>
          <p className="text-xs text-[#475569]">
            {station.distance ? `${station.distance}${station.unit}` : `${station.reps} ${station.unit}`}
          </p>
        </div>
        <div className="flex items-center gap-2 text-right shrink-0">
          {data.time && <span className="text-xs font-bold text-[#f97316]">{formatTime(Number(data.time))}</span>}
          <ChevronDown size={16} className={`text-[#475569] transition-transform ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>
      {open && (
        <div className="px-3 pb-3 pt-1 space-y-2 border-t border-[#2a2a3d]">
          <div className="grid grid-cols-2 gap-2">
            <NumberInput label="Time (sec)" value={data.time} onChange={v => onChange('time', v)} unit="s" placeholder="240" />
            {station.unit === 'reps'
              ? <NumberInput label="Reps Done" value={data.reps} onChange={v => onChange('reps', v)} unit="reps" placeholder="100" />
              : <NumberInput label="Weight (kg)" value={data.weight} onChange={v => onChange('weight', v)} unit="kg" step={0.5} placeholder="20" />
            }
          </div>
        </div>
      )}
    </div>
  )
}

function StationsLogger({ data, onChange }) {
  const updateStation = (stationId, field, value) => {
    onChange('stations', {
      ...data.stations,
      [stationId]: { ...(data.stations[stationId] || {}), [field]: value }
    })
  }
  return (
    <div className="space-y-3">
      <p className="text-xs text-[#475569]">Tap each station to log details.</p>
      {HYROX_STATIONS.map(station => (
        <StationRow
          key={station.id}
          station={station}
          data={data.stations?.[station.id] || {}}
          onChange={(field, value) => updateStation(station.id, field, value)}
        />
      ))}
      <NumberInput label="Total Duration (min)" value={data.duration} onChange={v => onChange('duration', v)} unit="min" />
      <TextInput label="Notes" value={data.notes} onChange={v => onChange('notes', v)} placeholder="How did it feel?" />
    </div>
  )
}

function HyroxSimLogger({ data, onChange }) {
  const updateStation = (stationId, field, value) => {
    onChange('stations', {
      ...data.stations,
      [stationId]: { ...(data.stations[stationId] || {}), [field]: value }
    })
  }
  const updateRunSplit = (idx, value) => {
    const splits = [...(data.runSplits || Array(8).fill(''))]
    splits[idx] = value
    onChange('runSplits', splits)
  }

  const totalTime = (() => {
    const stationSecs = HYROX_STATIONS.reduce((sum, s) => {
      const t = Number(data.stations?.[s.id]?.time || 0)
      return sum + t
    }, 0)
    const runSecs = (data.runSplits || []).reduce((sum, t) => sum + Number(t || 0), 0)
    return stationSecs + runSecs
  })()

  return (
    <div className="space-y-4">
      {totalTime > 0 && (
        <div className="bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-xl p-4 text-center">
          <p className="text-xs text-[#475569]">Running Total Time</p>
          <p className="text-3xl font-black text-[#ef4444]">{formatTime(totalTime)}</p>
        </div>
      )}

      {HYROX_STATIONS.map((station, i) => (
        <div key={station.id} className="space-y-2">
          {/* Run before station */}
          <div className="flex items-center gap-2">
            <div className="w-1 h-8 rounded-full bg-[#22c55e]/30" />
            <div className="flex-1 bg-[#22c55e]/5 border border-[#22c55e]/20 rounded-lg p-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-[#22c55e]">Run {i + 1} — 1km</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="250"
                  value={(data.runSplits || [])[i] || ''}
                  onChange={e => updateRunSplit(i, e.target.value)}
                  className="w-20 bg-transparent text-right text-xs font-bold text-[#22c55e] focus:outline-none"
                />
                <span className="text-xs text-[#475569]">s</span>
              </div>
            </div>
          </div>

          {/* Station */}
          <StationRow
            station={station}
            data={data.stations?.[station.id] || {}}
            onChange={(field, value) => updateStation(station.id, field, value)}
          />
        </div>
      ))}
      <TextInput label="Notes / How did it go?" value={data.notes} onChange={v => onChange('notes', v)} placeholder="Highlight any PRs, struggles, or breakthroughs..." />
    </div>
  )
}

function LogHistory({ logs, onDelete }) {
  if (!logs.length) return (
    <div className="text-center py-8">
      <p className="text-[#475569]">No sessions logged yet.</p>
      <p className="text-xs text-[#475569] mt-1">Log your first session above!</p>
    </div>
  )
  return (
    <div className="space-y-3">
      {logs.slice(0, 20).map(log => (
        <div key={log.id} className="card p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <SessionTypeBadge type={log.type} />
                <span className="text-xs text-[#475569]">{formatDate(log.date)}</span>
              </div>
              <div className="flex gap-4 text-sm">
                {log.distance && (
                  <span className="flex items-center gap-1 text-[#22c55e] font-semibold">
                    <MapPin size={12} /> {log.distance}km
                  </span>
                )}
                {log.duration && (
                  <span className="flex items-center gap-1 text-[#475569]">
                    <Clock size={12} /> {log.duration}min
                  </span>
                )}
                {log.effort && (
                  <span className="flex items-center gap-1 font-semibold" style={{ color: EFFORT_COLORS[log.effort] }}>
                    <Zap size={12} /> RPE {log.effort}
                  </span>
                )}
              </div>
              {log.notes && <p className="text-xs text-[#475569] mt-1.5 italic">"{log.notes}"</p>}
            </div>
            <button
              onClick={() => onDelete(log.id)}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-[#475569] active:text-[#ef4444] active:bg-[#ef4444]/10"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Log() {
  const { addWorkoutLog, deleteWorkoutLog, workoutLogs } = useAppData()
  const [tab, setTab] = useState('log') // 'log' | 'history'
  const [type, setType] = useState('run')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    distance: '', duration: '', pace: '', effort: 5, notes: '',
    stations: {}, runSplits: Array(8).fill(''),
  })

  const updateField = (field, value) => setFormData(d => ({ ...d, [field]: value }))

  const handleSubmit = () => {
    if (!date) return
    const log = {
      type,
      date,
      distance: formData.distance ? Number(formData.distance) : undefined,
      duration: formData.duration ? Number(formData.duration) : undefined,
      pace: formData.pace ? Number(formData.pace) : undefined,
      effort: formData.effort,
      notes: formData.notes,
      stations: type === 'stations' || type === 'hyrox_sim' ? formData.stations : undefined,
      runSplits: type === 'hyrox_sim' ? formData.runSplits.map(Number).filter(Boolean) : undefined,
    }
    addWorkoutLog(log)
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ distance: '', duration: '', pace: '', effort: 5, notes: '', stations: {}, runSplits: Array(8).fill('') })
    }, 2000)
  }

  return (
    <div className="px-4 pt-6 pb-4">
      <h1 className="text-2xl font-black text-[#f1f5f9] mb-4">Log Session</h1>

      {/* Tab */}
      <div className="flex gap-2 mb-5">
        {['log', 'history'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold min-h-[44px] transition-colors ${
              tab === t ? 'bg-[#f97316] text-white' : 'bg-[#1a1a24] text-[#475569]'
            }`}
          >
            {t === 'log' ? '+ Log Session' : 'History'}
          </button>
        ))}
      </div>

      {tab === 'log' && (
        <div className="space-y-5">
          {/* Success state */}
          {submitted && (
            <div className="card p-4 border-[#22c55e]/40 bg-[#22c55e]/10 flex items-center gap-3">
              <CheckCircle size={20} className="text-[#22c55e]" />
              <p className="text-sm font-semibold text-[#22c55e]">Session logged! Keep it up!</p>
            </div>
          )}

          {/* Session type */}
          <div>
            <p className="section-title mb-2">Session Type</p>
            <div className="grid grid-cols-2 gap-2">
              {SESSION_TYPES.map(t => (
                <button
                  key={t.id}
                  onClick={() => setType(t.id)}
                  className={`p-3 rounded-xl text-left transition-colors min-h-[44px] border ${
                    type === t.id
                      ? 'border-2'
                      : 'border-[#2a2a3d] bg-[#1a1a24]'
                  }`}
                  style={type === t.id ? { borderColor: t.color, backgroundColor: `${t.color}15` } : {}}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{t.emoji}</span>
                    <div>
                      <p className="text-sm font-bold text-[#f1f5f9]">{t.label}</p>
                      <p className="text-xs text-[#475569]">{t.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-semibold text-[#475569] mb-1.5">Date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="input-field"
              style={{ colorScheme: 'dark' }}
            />
          </div>

          {/* Session-specific fields */}
          {type === 'run' && <RunLogger data={formData} onChange={updateField} />}
          {type === 'stations' && <StationsLogger data={formData} onChange={updateField} />}
          {type === 'combo' && (
            <div className="space-y-4">
              <RunLogger data={formData} onChange={updateField} />
              <StationsLogger data={formData} onChange={updateField} />
            </div>
          )}
          {type === 'hyrox_sim' && <HyroxSimLogger data={formData} onChange={updateField} />}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={submitted}
            className="btn-primary w-full text-base gap-2"
          >
            <CheckCircle size={18} />
            {submitted ? 'Logged!' : 'Save Session'}
          </button>
        </div>
      )}

      {tab === 'history' && (
        <LogHistory logs={workoutLogs} onDelete={deleteWorkoutLog} />
      )}
    </div>
  )
}
