import { useState } from 'react'
import { Calculator, RotateCcw, ArrowLeftRight } from 'lucide-react'
import {
  RACE_DISTANCES, DISTANCE_KEYS, parseTimeInput, formatDurationSec,
  riegelPredict, calculateTrainingPaces, formatPaceRange,
} from '../utils/paceCalculator'
import { COACHES } from '../utils/coachData'

const MCMILLAN_COLOR = COACHES.mcmillan.color

const INNER = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12 }

const PACE_ZONES = [
  { key: 'easy',     label: 'Easy Run',         desc: 'Conversational, aerobic base' },
  { key: 'marathon', label: 'Marathon Pace',     desc: 'Sustainable for 3–5 hours' },
  { key: 'tempo',    label: 'Tempo / Threshold', desc: 'Comfortably hard, 20–60 min' },
  { key: 'vo2max',   label: 'VO2max Interval',   desc: 'Hard efforts, 3–8 min reps' },
  { key: 'reps',     label: 'Speed / Reps',      desc: 'Short, fast repetitions' },
]

const selectStyle = {
  background: 'rgba(51,51,51,0.55)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 10,
  color: 'white',
  fontSize: 14,
  padding: '10px 12px',
  width: '100%',
  outline: 'none',
}

export default function PaceCalculator() {
  const [fromDist, setFromDist] = useState('5K')
  const [fromTime, setFromTime] = useState('')
  const [toDist, setToDist] = useState('Half Marathon')
  const [useMiles, setUseMiles] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const calculate = () => {
    setError('')
    const timeSec = parseTimeInput(fromTime)
    if (!timeSec || timeSec <= 0) {
      setError('Enter a valid time (e.g. 0:25:00 or 25:00)')
      return
    }
    const d1 = RACE_DISTANCES[fromDist]
    const d2 = RACE_DISTANCES[toDist]
    const predicted = riegelPredict(timeSec, d1, d2)
    const paces = calculateTrainingPaces(predicted, d2)
    setResult(paces)
    try {
      localStorage.setItem('mcmillan_paces', JSON.stringify({
        ...paces,
        targetDist: toDist,
        savedAt: new Date().toISOString(),
      }))
    } catch (_) {}
  }

  const reset = () => { setResult(null); setFromTime(''); setError('') }

  return (
    <div className="glass p-4">
      <div className="flex items-center gap-2 mb-4">
        <Calculator size={15} style={{ color: MCMILLAN_COLOR }} />
        <p className="text-sm font-black text-white/90">McMillan Pace Calculator</p>
        <span className="text-xs text-white/25 ml-auto">Riegel formula</span>
      </div>

      <div className="space-y-3 mb-4">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-white/35 block mb-1.5">Recent race distance</label>
            <select value={fromDist} onChange={e => setFromDist(e.target.value)} style={selectStyle}>
              {DISTANCE_KEYS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-white/35 block mb-1.5">Race time (H:MM:SS)</label>
            <input
              value={fromTime}
              onChange={e => setFromTime(e.target.value)}
              placeholder="0:25:00"
              style={{ ...selectStyle, fontFamily: 'monospace', letterSpacing: '0.05em', fontSize: 16 }}
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-white/35 block mb-1.5">Target race</label>
          <select value={toDist} onChange={e => setToDist(e.target.value)} style={selectStyle}>
            {DISTANCE_KEYS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        {error && <p className="text-xs" style={{ color: '#ff6666' }}>{error}</p>}

        <div className="flex gap-2">
          <button
            onClick={calculate}
            disabled={!fromTime}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold"
            style={{
              background: fromTime ? MCMILLAN_COLOR : 'rgba(51,51,51,0.55)',
              color: fromTime ? '#fff' : 'rgba(255,255,255,0.28)',
              border: 'none', minHeight: 44, cursor: fromTime ? 'pointer' : 'not-allowed',
            }}
          >
            <Calculator size={15} /> Calculate
          </button>
          {result && (
            <button
              onClick={reset}
              className="flex items-center justify-center gap-1 rounded-xl px-4 py-3"
              style={{ background: 'rgba(51,51,51,0.55)', border: '1px solid rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.45)', minHeight: 44 }}
            >
              <RotateCcw size={14} />
            </button>
          )}
        </div>
      </div>

      {result && (
        <div className="space-y-3">
          {/* Predicted time + unit toggle */}
          <div className="flex items-center gap-2">
            <div className="flex-1 rounded-xl p-3" style={INNER}>
              <p className="text-xs text-white/32">Predicted {toDist}</p>
              <p className="text-xl font-black" style={{ color: MCMILLAN_COLOR }}>
                {formatDurationSec(result.predicted)}
              </p>
            </div>
            <button
              onClick={() => setUseMiles(m => !m)}
              className="flex items-center gap-1.5 rounded-xl px-3 py-3 text-xs font-semibold"
              style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.50)', border: '1px solid rgba(255,255,255,0.10)', minHeight: 44 }}
            >
              <ArrowLeftRight size={12} />
              {useMiles ? 'mi' : 'km'}
            </button>
          </div>

          {/* Pace zones */}
          <div className="space-y-2">
            {PACE_ZONES.map(zone => (
              <div key={zone.key} className="flex items-center justify-between p-3 rounded-xl" style={INNER}>
                <div>
                  <p className="text-xs font-bold text-white/75">{zone.label}</p>
                  <p className="text-xs text-white/28">{zone.desc}</p>
                </div>
                <p className="text-sm font-black text-white/80" style={{ fontFamily: 'monospace' }}>
                  {formatPaceRange(result[zone.key], useMiles)}
                </p>
              </div>
            ))}
          </div>

          <p className="text-xs text-white/25 text-center pt-1">
            Paces saved — visible on your training sessions
          </p>
        </div>
      )}
    </div>
  )
}
