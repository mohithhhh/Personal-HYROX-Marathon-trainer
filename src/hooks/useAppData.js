import { useLocalStorage } from './useLocalStorage'

const DEFAULT_USER = {
  weight: 75, // kg
  targetProtein: 130, // g/day (1.7g/kg)
  targetCalories: 2200,
  name: 'Athlete',
}

const DEFAULT_BODY_METRICS = []
const DEFAULT_WORKOUT_LOGS = []
const DEFAULT_HYROX_SIMS = []
const DEFAULT_NUTRITION_LOGS = []
const DEFAULT_SESSION_STATUS = {}
const DEFAULT_PERSONAL_RECORDS = {}

export function useAppData() {
  const [user, setUser] = useLocalStorage('hh_user', DEFAULT_USER)
  const [bodyMetrics, setBodyMetrics] = useLocalStorage('hh_body_metrics', DEFAULT_BODY_METRICS)
  const [workoutLogs, setWorkoutLogs] = useLocalStorage('hh_workout_logs', DEFAULT_WORKOUT_LOGS)
  const [hyroxSims, setHyroxSims] = useLocalStorage('hh_hyrox_sims', DEFAULT_HYROX_SIMS)
  const [nutritionLogs, setNutritionLogs] = useLocalStorage('hh_nutrition_logs', DEFAULT_NUTRITION_LOGS)
  const [sessionStatus, setSessionStatus] = useLocalStorage('hh_session_status', DEFAULT_SESSION_STATUS)
  const [personalRecords, setPersonalRecords] = useLocalStorage('hh_prs', DEFAULT_PERSONAL_RECORDS)

  // Session status helpers
  const markSession = (sessionId, status) => {
    setSessionStatus(prev => ({ ...prev, [sessionId]: status }))
  }

  const getSessionStatus = (sessionId) => sessionStatus[sessionId] || null

  // Workout log helpers
  const addWorkoutLog = (log) => {
    const newLog = { ...log, id: Date.now().toString(), createdAt: new Date().toISOString() }
    setWorkoutLogs(prev => [newLog, ...prev])
    updatePRs(newLog)
    return newLog
  }

  const updateWorkoutLog = (id, updates) => {
    setWorkoutLogs(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l))
  }

  const deleteWorkoutLog = (id) => {
    setWorkoutLogs(prev => prev.filter(l => l.id !== id))
  }

  // Hyrox simulation helpers
  const addHyroxSim = (sim) => {
    const newSim = { ...sim, id: Date.now().toString(), createdAt: new Date().toISOString() }
    setHyroxSims(prev => [newSim, ...prev])
    // Check if it's a PR
    if (!personalRecords.bestHyroxSim || sim.totalTime < personalRecords.bestHyroxSim) {
      setPersonalRecords(prev => ({ ...prev, bestHyroxSim: sim.totalTime, bestHyroxSimDate: sim.date }))
    }
    return newSim
  }

  // Nutrition helpers
  const getTodayNutrition = () => {
    const today = new Date().toISOString().split('T')[0]
    return nutritionLogs.find(l => l.date === today) || createEmptyNutritionLog(today)
  }

  const createEmptyNutritionLog = (date) => ({
    date,
    meals: [],
    water: 0,
    supplements: { creatine: false, protein_shake: false, vitamin_d3: false, magnesium: false },
  })

  const updateTodayNutrition = (updates) => {
    const today = new Date().toISOString().split('T')[0]
    setNutritionLogs(prev => {
      const idx = prev.findIndex(l => l.date === today)
      if (idx >= 0) {
        const updated = [...prev]
        updated[idx] = { ...updated[idx], ...updates }
        return updated
      }
      return [{ ...createEmptyNutritionLog(today), ...updates }, ...prev]
    })
  }

  const addMeal = (foodEntry) => {
    const today = new Date().toISOString().split('T')[0]
    setNutritionLogs(prev => {
      const idx = prev.findIndex(l => l.date === today)
      const entry = { ...foodEntry, id: Date.now().toString(), time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) }
      if (idx >= 0) {
        const updated = [...prev]
        updated[idx] = { ...updated[idx], meals: [...updated[idx].meals, entry] }
        return updated
      }
      const newLog = createEmptyNutritionLog(today)
      newLog.meals = [entry]
      return [newLog, ...prev]
    })
  }

  const removeMeal = (mealId) => {
    const today = new Date().toISOString().split('T')[0]
    setNutritionLogs(prev => {
      const idx = prev.findIndex(l => l.date === today)
      if (idx < 0) return prev
      const updated = [...prev]
      updated[idx] = { ...updated[idx], meals: updated[idx].meals.filter(m => m.id !== mealId) }
      return updated
    })
  }

  const updateWater = (ml) => {
    const today = new Date().toISOString().split('T')[0]
    setNutritionLogs(prev => {
      const idx = prev.findIndex(l => l.date === today)
      if (idx >= 0) {
        const updated = [...prev]
        updated[idx] = { ...updated[idx], water: ml }
        return updated
      }
      return [{ ...createEmptyNutritionLog(today), water: ml }, ...prev]
    })
  }

  const toggleSupplement = (suppId) => {
    const today = new Date().toISOString().split('T')[0]
    setNutritionLogs(prev => {
      const idx = prev.findIndex(l => l.date === today)
      const base = idx >= 0 ? prev[idx] : createEmptyNutritionLog(today)
      const newSupps = { ...base.supplements, [suppId]: !base.supplements[suppId] }
      if (idx >= 0) {
        const updated = [...prev]
        updated[idx] = { ...updated[idx], supplements: newSupps }
        return updated
      }
      return [{ ...base, supplements: newSupps }, ...prev]
    })
  }

  // Body metrics helpers
  const addBodyMetric = (metric) => {
    const newMetric = { ...metric, id: Date.now().toString() }
    setBodyMetrics(prev => {
      const filtered = prev.filter(m => m.date !== metric.date)
      return [newMetric, ...filtered].sort((a, b) => new Date(b.date) - new Date(a.date))
    })
  }

  const getLatestWeight = () => bodyMetrics[0]?.weight || null

  const getWeightChange = () => {
    if (bodyMetrics.length < 2) return null
    return bodyMetrics[0].weight - bodyMetrics[1].weight
  }

  const getWeeklyWeightChange = () => {
    if (bodyMetrics.length < 2) return null
    const latest = bodyMetrics[0]
    const weekAgo = bodyMetrics.find(m => {
      const diff = (new Date(latest.date) - new Date(m.date)) / (1000 * 60 * 60 * 24)
      return diff >= 5 && diff <= 9
    })
    if (!weekAgo) return null
    return latest.weight - weekAgo.weight
  }

  // PR helpers
  const updatePRs = (log) => {
    if (!log) return
    const updates = {}
    if (log.type === 'run' && log.distance) {
      if (!personalRecords.longestRun || log.distance > personalRecords.longestRun) {
        updates.longestRun = log.distance
        updates.longestRunDate = log.date
      }
      if (log.pace && (!personalRecords.fastestPace || log.pace < personalRecords.fastestPace)) {
        updates.fastestPace = log.pace
        updates.fastestPaceDate = log.date
      }
    }
    if (Object.keys(updates).length > 0) {
      setPersonalRecords(prev => ({ ...prev, ...updates }))
    }
  }

  // Weekly weight warning check
  const isWeightLossTooFast = () => {
    const weeklyChange = getWeeklyWeightChange()
    return weeklyChange !== null && weeklyChange < -0.8
  }

  return {
    user,
    setUser,
    bodyMetrics,
    workoutLogs,
    hyroxSims,
    nutritionLogs,
    sessionStatus,
    personalRecords,
    // Actions
    markSession,
    getSessionStatus,
    addWorkoutLog,
    updateWorkoutLog,
    deleteWorkoutLog,
    addHyroxSim,
    getTodayNutrition,
    addMeal,
    removeMeal,
    updateWater,
    toggleSupplement,
    addBodyMetric,
    getLatestWeight,
    getWeightChange,
    getWeeklyWeightChange,
    isWeightLossTooFast,
    setPersonalRecords,
  }
}
