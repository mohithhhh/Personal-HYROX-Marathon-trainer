// Time formatting utilities

export function formatTime(seconds) {
  if (!seconds && seconds !== 0) return '—'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

export function formatPace(minPerKm) {
  if (!minPerKm) return '—'
  const min = Math.floor(minPerKm)
  const sec = Math.round((minPerKm - min) * 60)
  return `${min}:${String(sec).padStart(2, '0')} /km`
}

export function parseTimeToSeconds(timeStr) {
  if (!timeStr) return 0
  const parts = timeStr.split(':').map(Number)
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]
  if (parts.length === 2) return parts[0] * 60 + parts[1]
  return Number(timeStr)
}

export function formatDate(dateStr, opts = {}) {
  if (!dateStr) return ''
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    ...opts,
  })
}

export function formatDateFull(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function getDaysUntil(dateStr) {
  const target = new Date(dateStr + 'T00:00:00')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diff = target - today
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function getWeeksUntil(dateStr) {
  return Math.ceil(getDaysUntil(dateStr) / 7)
}

export function isToday(dateStr) {
  const today = new Date().toISOString().split('T')[0]
  return dateStr === today
}

export function isPast(dateStr) {
  const today = new Date().toISOString().split('T')[0]
  return dateStr < today
}

export function getRelativeDay(dateStr) {
  const today = new Date().toISOString().split('T')[0]
  if (dateStr === today) return 'Today'
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  if (dateStr === tomorrow.toISOString().split('T')[0]) return 'Tomorrow'
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  if (dateStr === yesterday.toISOString().split('T')[0]) return 'Yesterday'
  return formatDate(dateStr, { weekday: 'short' })
}

export function formatKg(val) {
  if (!val && val !== 0) return '—'
  return `${Number(val).toFixed(1)} kg`
}

export function generateId() {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}
