import { useState } from 'react'
import { Plus, Trophy, ChevronDown, TrendingDown, Target } from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts'
import { useAppData } from '../hooks/useAppData'
import { HYROX_STATIONS } from '../data/trainingPlan'
import { formatTime, formatDate } from '../utils/formatters'

const STATION_LIST = HYROX_STATIONS

const INNER = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12 }
const INPUT_SM = {
  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)',
  borderRadius: 8, padding: '0.375rem 0.625rem', color: '#fff', outline: 'none', width: '100%',
}

function SimForm({ onSave, onCancel }) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [stations, setStations] = useState({})
  const [runSplits, setRunSplits] = useState(Array(8).fill(''))
  const [notes, setNotes] = useState('')

  const updateStation = (id, field, value) => {
    setStations(prev => ({ ...prev, [id]: { ...(prev[id] || {}), [field]: value } }))
  }

  const updateRun = (i, val) => {
    setRunSplits(prev => { const next = [...prev]; next[i] = val; return next })
  }

  const totalStationTime = STATION_LIST.reduce((sum, s) => sum + Number(stations[s.id]?.time || 0), 0)
  const totalRunTime = runSplits.reduce((sum, t) => sum + Number(t || 0), 0)
  const totalTime = totalStationTime + totalRunTime

  const handleSave = () => {
    const sim = {
      date,
      stations: STATION_LIST.map(s => ({
        id: s.id,
        name: s.name,
        time: Number(stations[s.id]?.time || 0),
        weight: stations[s.id]?.weight,
        reps: stations[s.id]?.reps,
      })),
      runSplits: runSplits.map(Number),
      totalTime,
      notes,
    }
    onSave(sim)
  }

  return (
    <div className="space-y-4">
      {totalTime > 0 && (
        <div className="p-4 rounded-2xl text-center" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.13)' }}>
          <p className="text-xs text-white/30 mb-1">Running Total</p>
          <p className="text-4xl font-black text-white">{formatTime(totalTime)}</p>
          <div className="flex justify-center gap-4 mt-2 text-xs text-white/30">
            <span>Stations: {formatTime(totalStationTime)}</span>
            <span>Runs: {formatTime(totalRunTime)}</span>
          </div>
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-white/32 mb-1.5">Date</label>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="input-field" style={{ colorScheme: 'dark' }} />
      </div>

      <div className="space-y-2">
        <p className="section-title">Stations & Runs</p>
        {STATION_LIST.map((station, i) => (
          <div key={station.id} className="space-y-2">
            {/* Run before station */}
            <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full text-white/45 text-xs flex items-center justify-center font-bold"
                  style={{ background: 'rgba(255,255,255,0.08)' }}>
                  {i + 1}
                </span>
                <span className="text-sm font-semibold text-white/60">1km Run</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="sec"
                  value={runSplits[i]}
                  onChange={e => updateRun(i, e.target.value)}
                  className="w-20 text-right text-sm font-bold text-white/75 focus:outline-none"
                  style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.75)' }}
                />
                <span className="text-xs text-white/28">s</span>
              </div>
            </div>
            {runSplits[i] && (
              <p className="text-xs text-white/38 text-right pr-1">{formatTime(Number(runSplits[i]))}</p>
            )}

            {/* Station */}
            <div className="rounded-xl p-3" style={INNER}>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1">
                  <p className="text-sm font-bold text-white/82">{station.name}</p>
                  <p className="text-xs text-white/30">
                    {station.distance ? `${station.distance}${station.unit}` : `${station.reps} ${station.unit}`}
                  </p>
                </div>
                {stations[station.id]?.time && (
                  <span className="text-sm font-black text-white/70">{formatTime(Number(stations[station.id].time))}</span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-white/28 block mb-1">Time (sec)</label>
                  <input type="number" placeholder="e.g. 280" value={stations[station.id]?.time || ''}
                    onChange={e => updateStation(station.id, 'time', e.target.value)} style={INPUT_SM} />
                </div>
                <div>
                  <label className="text-xs text-white/28 block mb-1">
                    {station.unit === 'reps' ? 'Reps Done' : 'Weight (kg)'}
                  </label>
                  <input type="number"
                    placeholder={station.unit === 'reps' ? '100' : '20'}
                    value={station.unit === 'reps' ? (stations[station.id]?.reps || '') : (stations[station.id]?.weight || '')}
                    onChange={e => updateStation(station.id, station.unit === 'reps' ? 'reps' : 'weight', e.target.value)}
                    style={INPUT_SM} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div>
        <label className="block text-xs font-semibold text-white/32 mb-1.5">Notes</label>
        <textarea value={notes} onChange={e => setNotes(e.target.value)}
          placeholder="How did it go? Any station PRs or struggles?" rows={2}
          className="input-field resize-none" />
      </div>

      <div className="flex gap-3">
        <button onClick={onCancel} className="btn-secondary flex-1">Cancel</button>
        <button onClick={handleSave} className="btn-primary flex-1 gap-2">
          <Trophy size={16} /> Save Sim
        </button>
      </div>
    </div>
  )
}

function SimCard({ sim, bestTime }) {
  const [expanded, setExpanded] = useState(false)
  const isBest = sim.totalTime === bestTime

  return (
    <div className={`glass overflow-hidden ${isBest ? 'glass-active' : ''}`}>
      <button className="w-full p-4 text-left" onClick={() => setExpanded(e => !e)}>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {isBest && (
                <span className="text-xs font-black text-white bg-white/15 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Trophy size={10} /> PB
                </span>
              )}
              <span className="text-xs text-white/30">{formatDate(sim.date, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
            </div>
            <p className="text-3xl font-black text-white">{formatTime(sim.totalTime)}</p>
          </div>
          <ChevronDown size={18} className={`text-white/28 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </div>
        <div className="flex gap-4 mt-2 text-xs text-white/30">
          <span>Stations: {formatTime(sim.stations.reduce((s, st) => s + (st.time || 0), 0))}</span>
          <span>Runs: {formatTime(sim.runSplits.reduce((s, t) => s + (t || 0), 0))}</span>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 pt-3 space-y-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <div>
            <p className="section-title mb-2">Split Times</p>
            <div className="space-y-1.5">
              {sim.stations.map((st, i) => (
                <div key={st.id}>
                  <div className="flex items-center justify-between py-1 px-2">
                    <span className="text-xs text-white/45">Run {i + 1} (1km)</span>
                    <span className="text-xs font-bold text-white/55">
                      {sim.runSplits[i] ? formatTime(sim.runSplits[i]) : '—'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1 px-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <span className="text-xs text-white/38">{st.name}</span>
                    <div className="flex items-center gap-2">
                      {st.weight && <span className="text-xs text-white/45">{st.weight}kg</span>}
                      {st.reps && <span className="text-xs text-white/45">{st.reps} reps</span>}
                      <span className="text-xs font-bold text-white/70">
                        {st.time ? formatTime(st.time) : '—'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {sim.notes && (
            <div className="rounded-xl p-3" style={INNER}>
              <p className="text-xs text-white/38 italic">"{sim.notes}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function SimProgressChart({ sims }) {
  if (sims.length < 2) return null
  const data = [...sims].reverse().map((sim, i) => ({
    name: `Sim ${i + 1}`,
    total: Math.round(sim.totalTime / 60 * 10) / 10,
    stations: Math.round(sim.stations.reduce((s, st) => s + (st.time || 0), 0) / 60 * 10) / 10,
    runs: Math.round(sim.runSplits.reduce((s, t) => s + (t || 0), 0) / 60 * 10) / 10,
  }))

  const best = Math.min(...data.map(d => d.total))

  return (
    <div className="glass p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-bold text-white/82">Simulation Progress</p>
        <div className="flex items-center gap-1 text-xs text-white/45">
          <TrendingDown size={12} /> Improving
        </div>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.28)', fontSize: 11 }} />
          <YAxis tick={{ fill: 'rgba(255,255,255,0.28)', fontSize: 11 }} unit="m" />
          <Tooltip
            contentStyle={{ backgroundColor: 'rgba(8,8,8,0.92)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8 }}
            labelStyle={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}
            itemStyle={{ color: 'rgba(255,255,255,0.75)', fontSize: 11 }}
            formatter={(val, name) => [`${val} min`, name === 'total' ? 'Total' : name === 'stations' ? 'Stations' : 'Runs']}
          />
          <ReferenceLine y={best} stroke="rgba(255,255,255,0.35)" strokeDasharray="3 3"
            label={{ value: 'PB', fill: 'rgba(255,255,255,0.45)', fontSize: 10 }} />
          <Line type="monotone" dataKey="total" stroke="rgba(255,255,255,0.85)" strokeWidth={2.5} dot={{ fill: 'rgba(255,255,255,0.85)', r: 4 }} name="total" />
          <Line type="monotone" dataKey="stations" stroke="rgba(255,255,255,0.45)" strokeWidth={1.5} dot={false} strokeDasharray="4 2" name="stations" />
          <Line type="monotone" dataKey="runs" stroke="rgba(255,255,255,0.30)" strokeWidth={1.5} dot={false} strokeDasharray="4 2" name="runs" />
        </LineChart>
      </ResponsiveContainer>
      <div className="flex justify-center gap-4 mt-2">
        <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-white/80" /><span className="text-xs text-white/30">Total</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-white/40" /><span className="text-xs text-white/30">Stations</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-white/25" /><span className="text-xs text-white/30">Runs</span></div>
      </div>
    </div>
  )
}

const tabS = (a) => ({
  flex: 1, padding: '0.5rem', borderRadius: '0.75rem', fontSize: '0.875rem', fontWeight: 600,
  minHeight: 44, cursor: 'pointer', transition: 'all 0.15s',
  background: a ? '#fff' : 'rgba(255,255,255,0.06)', color: a ? '#000' : 'rgba(255,255,255,0.38)',
  border: a ? 'none' : '1px solid rgba(255,255,255,0.09)',
})

export default function Hyrox() {
  const { hyroxSims, addHyroxSim } = useAppData()
  const [view, setView] = useState('history')

  const bestTime = hyroxSims.length ? Math.min(...hyroxSims.map(s => s.totalTime)) : null

  const handleSave = (sim) => {
    addHyroxSim(sim)
    setView('history')
  }

  return (
    <div className="px-4 pt-6 pb-4">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-2xl font-black text-white">Hyrox Tracker</h1>
          <p className="text-sm text-white/30 mt-0.5">{hyroxSims.length} simulation{hyroxSims.length !== 1 ? 's' : ''} logged</p>
        </div>
        {bestTime && (
          <div className="text-right">
            <p className="text-xs text-white/55 font-bold flex items-center gap-1 justify-end">
              <Trophy size={12} /> Best Time
            </p>
            <p className="text-lg font-black text-white">{formatTime(bestTime)}</p>
          </div>
        )}
      </div>

      {/* Stations reference */}
      <div className="glass p-4 mb-4">
        <p className="section-title mb-2">The 8 Stations (in order)</p>
        <div className="grid grid-cols-2 gap-1.5">
          {STATION_LIST.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2 text-xs">
              <span className="w-4 h-4 rounded-full text-white/45 flex items-center justify-center font-bold text-[10px]"
                style={{ background: 'rgba(255,255,255,0.08)' }}>{i + 1}</span>
              <span className="text-white/55">{s.name}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-white/28 mt-2">+ 1km run before each station = 8km total running</p>
      </div>

      {/* View toggle */}
      <div className="flex gap-2 mb-5">
        <button onClick={() => setView('history')} style={tabS(view === 'history')}>History</button>
        <button onClick={() => setView('new')} style={{ ...tabS(view === 'new'), display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <Plus size={16} /> Log New Sim
        </button>
      </div>

      {view === 'new' && (
        <SimForm onSave={handleSave} onCancel={() => setView('history')} />
      )}

      {view === 'history' && (
        <div className="space-y-4">
          <SimProgressChart sims={hyroxSims} />

          {hyroxSims.length === 0 ? (
            <div className="glass p-8 text-center">
              <Target size={40} className="text-white/12 mx-auto mb-3" />
              <p className="text-white/55 font-semibold">No simulations yet</p>
              <p className="text-xs text-white/28 mt-1 mb-4">Log your first Hyrox simulation to start tracking your progress.</p>
              <button onClick={() => setView('new')} className="btn-primary mx-auto">
                Log First Sim
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="section-title">All Simulations</p>
              {hyroxSims.map((sim, i) => (
                <SimCard key={sim.id} sim={sim} bestTime={bestTime} isFirst={i === 0} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
