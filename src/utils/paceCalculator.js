export const RACE_DISTANCES = {
  '5K': 5,
  '10K': 10,
  'Half Marathon': 21.0975,
  'Marathon': 42.195,
}

export const DISTANCE_KEYS = Object.keys(RACE_DISTANCES)

// Parse time string (H:MM:SS or MM:SS) → seconds
export function parseTimeInput(str) {
  if (!str || !str.trim()) return null
  const parts = str.split(':').map(s => parseInt(s, 10) || 0)
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]
  if (parts.length === 2) return parts[0] * 60 + parts[1]
  return parts[0]
}

// Format seconds → M:SS or H:MM:SS
export function formatDurationSec(seconds) {
  if (!seconds || seconds <= 0) return '--:--'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.round(seconds % 60)
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

// Format sec/km → M:SS
export function formatPaceSec(secPerKm) {
  if (!secPerKm || secPerKm <= 0 || !isFinite(secPerKm)) return '--:--'
  const min = Math.floor(secPerKm / 60)
  const sec = Math.round(secPerKm % 60)
  return `${min}:${String(sec).padStart(2, '0')}`
}

// Riegel formula: T2 = T1 × (D2/D1)^1.06
export function riegelPredict(timeSec, fromDistKm, toDistKm) {
  if (!timeSec || !fromDistKm || !toDistKm) return null
  return timeSec * Math.pow(toDistKm / fromDistKm, 1.06)
}

// Returns training pace zones as sec/km ranges
export function calculateTrainingPaces(predictedTimeSec, targetDistKm) {
  if (!predictedTimeSec || !targetDistKm) return null
  const racePace = predictedTimeSec / targetDistKm // sec/km
  return {
    predicted: predictedTimeSec,
    racePace,
    easy:     { min: racePace + 75, max: racePace + 90 },
    marathon: { min: racePace + 20, max: racePace + 35 },
    tempo:    { min: racePace - 5,  max: racePace + 10 },
    vo2max:   { min: racePace - 25, max: racePace - 15 },
    reps:     { min: racePace - 40, max: racePace - 30 },
  }
}

export function kmToMile(secPerKm) {
  return secPerKm * 1.60934
}

export function formatPaceRange(range, useMiles = false) {
  if (!range) return '--:-- – --:--'
  const convert = useMiles ? kmToMile : (x) => x
  const unit = useMiles ? '/mi' : '/km'
  return `${formatPaceSec(convert(range.min))} – ${formatPaceSec(convert(range.max))} ${unit}`
}
