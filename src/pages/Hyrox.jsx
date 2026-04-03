import { useState } from 'react'
import { Plus, Trophy, Clock, ChevronDown, ChevronRight, TrendingDown, Target } from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts'
import { useAppData } from '../hooks/useAppData'
import { HYROX_STATIONS } from '../data/trainingPlan'
import { formatTime, formatDate, parseTimeToSeconds } from '../utils/formatters'

const STATION_LIST = HYROX_STATIONS

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
      {/* Total Time Banner */}
      {totalTime > 0 && (
        <div className="card p-4 text-center border-[#ef4444]/30 bg-[#ef4444]/5">
          <p className="text-xs text-[#94a3b8] mb-1">Current Total Time</p>
          <p className="text-4xl font-black text-[#ef4444]">{formatTime(totalTime)}</p>
          <div className="flex justify-center gap-4 mt-2 text-xs text-[#475569]">
            <span>Stations: {formatTime(totalStationTime)}</span>
            <span>Runs: {formatTime(totalRunTime)}</span>
          </div>
        </div>
      )}

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

      {/* Station + Run sequence */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-[#475569] uppercase tracking-wider">Stations & Runs</p>
        {STATION_LIST.map((station, i) => (
          <div key={station.id} className="space-y-2">
            {/* Run before station */}
            <div className="bg-[#22c55e]/5 border border-[#22c55e]/20 rounded-xl p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#22c55e]/20 text-[#22c55e] text-xs flex items-center justify-center font-bold">{i+1}</span>
                  <span className="text-sm font-semibold text-[#22c55e]">1km Run</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="sec"
                    value={runSplits[i]}
                    onChange={e => updateRun(i, e.target.value)}
                    className="w-20 bg-[#111118] text-right text-sm font-bold text-[#22c55e] px-2 py-1.5 rounded-lg border border-[#22c55e]/20 focus:outline-none focus:border-[#22c55e]/50"
                  />
                  <span className="text-xs text-[#475569] w-6">s</span>
                </div>
              </div>
              {runSplits[i] && <p className="text-xs text-[#22c55e]/60 mt-1 text-right">{formatTime(Number(runSplits[i]))}</p>}
            </div>

            {/* Station */}
            <div className="bg-[#111118] border border-[#2a2a3d] rounded-xl p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{station.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-bold text-[#f1f5f9]">{station.name}</p>
                  <p className="text-xs text-[#475569]">
                    {station.distance ? `${station.distance}${station.unit}` : `${station.reps} ${station.unit}`}
                  </p>
                </div>
                {stations[station.id]?.time && (
                  <span className="text-sm font-black text-[#f97316]">{formatTime(Number(stations[station.id].time))}</span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-[#475569] block mb-1">Time (sec)</label>
                  <input
                    type="number"
                    placeholder="e.g. 280"
                    value={stations[station.id]?.time || ''}
                    onChange={e => updateStation(station.id, 'time', e.target.value)}
                    className="w-full bg-[#21212e] border border-[#333348] rounded-lg px-3 py-2 text-sm text-[#f1f5f9] focus:outline-none focus:border-[#f97316]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#475569] block mb-1">
                    {station.unit === 'reps' ? 'Reps Done' : 'Weight (kg)'}
                  </label>
                  <input
                    type="number"
                    placeholder={station.unit === 'reps' ? '100' : '20'}
                    value={station.unit === 'reps' ? (stations[station.id]?.reps || '') : (stations[station.id]?.weight || '')}
                    onChange={e => updateStation(station.id, station.unit === 'reps' ? 'reps' : 'weight', e.target.value)}
                    className="w-full bg-[#21212e] border border-[#333348] rounded-lg px-3 py-2 text-sm text-[#f1f5f9] focus:outline-none focus:border-[#f97316]"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Notes */}
      <div>
        <label className="block text-xs font-semibold text-[#475569] mb-1.5">Notes</label>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="How did it go? Any station PRs or struggles?"
          rows={2}
          className="input-field resize-none"
        />
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

function SimCard({ sim, bestTime, isFirst }) {
  const [expanded, setExpanded] = useState(false)
  const isBest = sim.totalTime === bestTime
  const simNum = isFirst ? null : null

  return (
    <div className={`card overflow-hidden ${isBest ? 'border-[#f59e0b]/40 bg-[#f59e0b]/5' : ''}`}>
      <button className="w-full p-4 text-left" onClick={() => setExpanded(e => !e)}>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {isBest && <span className="text-xs font-black text-[#f59e0b] bg-[#f59e0b]/10 px-2 py-0.5 rounded-full">🏆 PB</span>}
              <span className="text-xs text-[#475569]">{formatDate(sim.date, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
            </div>
            <p className="text-3xl font-black text-[#f1f5f9]">{formatTime(sim.totalTime)}</p>
          </div>
          <div className="text-right">
            <ChevronDown size={18} className={`text-[#475569] transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </div>
        </div>
        <div className="flex gap-4 mt-2 text-xs text-[#475569]">
          <span>Stations: {formatTime(sim.stations.reduce((s, st) => s + (st.time || 0), 0))}</span>
          <span>Runs: {formatTime(sim.runSplits.reduce((s, t) => s + (t || 0), 0))}</span>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-[#2a2a3d] pt-3 space-y-3">
          {/* Splits table */}
          <div>
            <p className="text-xs font-semibold text-[#475569] uppercase tracking-wider mb-2">Split Times</p>
            <div className="space-y-1.5">
              {sim.stations.map((st, i) => (
                <div key={st.id}>
                  {/* Run split */}
                  <div className="flex items-center justify-between py-1 px-2">
                    <span className="text-xs text-[#22c55e]">Run {i + 1} (1km)</span>
                    <span className="text-xs font-bold text-[#22c55e]">
                      {sim.runSplits[i] ? formatTime(sim.runSplits[i]) : '—'}
                    </span>
                  </div>
                  {/* Station */}
                  <div className="flex items-center justify-between py-1 px-2 bg-[#111118] rounded-lg">
                    <span className="text-xs text-[#94a3b8]">{st.name}</span>
                    <div className="flex items-center gap-2">
                      {st.weight && <span className="text-xs text-[#6366f1]">{st.weight}kg</span>}
                      {st.reps && <span className="text-xs text-[#6366f1]">{st.reps} reps</span>}
                      <span className="text-xs font-bold text-[#f97316]">
                        {st.time ? formatTime(st.time) : '—'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {sim.notes && (
            <div className="bg-[#111118] rounded-xl p-3">
              <p className="text-xs text-[#475569] italic">"{sim.notes}"</p>
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
    date: formatDate(sim.date),
    total: Math.round(sim.totalTime / 60 * 10) / 10,
    stations: Math.round(sim.stations.reduce((s, st) => s + (st.time || 0), 0) / 60 * 10) / 10,
    runs: Math.round(sim.runSplits.reduce((s, t) => s + (t || 0), 0) / 60 * 10) / 10,
  }))

  const best = Math.min(...data.map(d => d.total))

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-bold text-[#f1f5f9]">Simulation Progress</p>
        <div className="flex items-center gap-1 text-xs text-[#22c55e]">
          <TrendingDown size={12} /> Faster over time
        </div>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3d" />
          <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 11 }} />
          <YAxis tick={{ fill: '#475569', fontSize: 11 }} unit="m" />
          <Tooltip
            contentStyle={{ backgroundColor: '#1a1a24', border: '1px solid #333348', borderRadius: 8 }}
            labelStyle={{ color: '#94a3b8', fontSize: 11 }}
            itemStyle={{ color: '#f1f5f9', fontSize: 11 }}
            formatter={(val, name) => [`${val} min`, name === 'total' ? 'Total' : name === 'stations' ? 'Stations' : 'Runs']}
          />
          <ReferenceLine y={best} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'PB', fill: '#f59e0b', fontSize: 10 }} />
          <Line type="monotone" dataKey="total" stroke="#ef4444" strokeWidth={2.5} dot={{ fill: '#ef4444', r: 4 }} name="total" />
          <Line type="monotone" dataKey="stations" stroke="#f97316" strokeWidth={1.5} dot={false} strokeDasharray="4 2" name="stations" />
          <Line type="monotone" dataKey="runs" stroke="#22c55e" strokeWidth={1.5} dot={false} strokeDasharray="4 2" name="runs" />
        </LineChart>
      </ResponsiveContainer>
      <div className="flex justify-center gap-4 mt-2">
        <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-[#ef4444]" /><span className="text-xs text-[#475569]">Total</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-[#f97316] opacity-70" /><span className="text-xs text-[#475569]">Stations</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-[#22c55e] opacity-70" /><span className="text-xs text-[#475569]">Runs</span></div>
      </div>
    </div>
  )
}

export default function Hyrox() {
  const { hyroxSims, addHyroxSim } = useAppData()
  const [view, setView] = useState('history') // 'history' | 'new'

  const bestTime = hyroxSims.length ? Math.min(...hyroxSims.map(s => s.totalTime)) : null

  const handleSave = (sim) => {
    addHyroxSim(sim)
    setView('history')
  }

  return (
    <div className="px-4 pt-6 pb-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-2xl font-black text-[#f1f5f9]">Hyrox Tracker</h1>
          <p className="text-sm text-[#475569] mt-0.5">{hyroxSims.length} simulation{hyroxSims.length !== 1 ? 's' : ''} logged</p>
        </div>
        {bestTime && (
          <div className="text-right">
            <p className="text-xs text-[#f59e0b] font-bold flex items-center gap-1 justify-end"><Trophy size={12} /> Best Time</p>
            <p className="text-lg font-black text-[#f59e0b]">{formatTime(bestTime)}</p>
          </div>
        )}
      </div>

      {/* Stations reference card */}
      <div className="card p-4 mb-4">
        <p className="text-xs font-semibold text-[#475569] uppercase tracking-wider mb-2">The 8 Stations (in order)</p>
        <div className="grid grid-cols-2 gap-1.5">
          {STATION_LIST.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2 text-xs">
              <span className="w-4 h-4 rounded-full bg-[#f97316]/20 text-[#f97316] flex items-center justify-center font-bold text-[10px]">{i+1}</span>
              <span className="text-[#94a3b8]">{s.icon} {s.name}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-[#475569] mt-2">+ 1km run before each station = 8km total running</p>
      </div>

      {/* View toggle */}
      <div className="flex gap-2 mb-5">
        <button
          onClick={() => setView('history')}
          className={`flex-1 py-2 rounded-xl text-sm font-semibold min-h-[44px] transition-colors ${view === 'history' ? 'bg-[#f97316] text-white' : 'bg-[#1a1a24] text-[#475569]'}`}
        >
          History
        </button>
        <button
          onClick={() => setView('new')}
          className={`flex-1 py-2 rounded-xl text-sm font-semibold min-h-[44px] transition-colors flex items-center justify-center gap-2 ${view === 'new' ? 'bg-[#f97316] text-white' : 'bg-[#1a1a24] text-[#475569]'}`}
        >
          <Plus size={16} /> Log New Sim
        </button>
      </div>

      {view === 'new' && (
        <SimForm onSave={handleSave} onCancel={() => setView('history')} />
      )}

      {view === 'history' && (
        <div className="space-y-4">
          {/* Chart */}
          <SimProgressChart sims={hyroxSims} />

          {/* Sim list */}
          {hyroxSims.length === 0 ? (
            <div className="card p-8 text-center">
              <Target size={40} className="text-[#2a2a3d] mx-auto mb-3" />
              <p className="text-[#94a3b8] font-semibold">No simulations yet</p>
              <p className="text-xs text-[#475569] mt-1 mb-4">Log your first Hyrox simulation to start tracking your progress.</p>
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
