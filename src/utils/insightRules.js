export function generateInsights({ workoutLogs, nutritionLogs, hyroxSims, bodyMetrics }) {
  const insights = []

  // Rule 1: Longest run stagnant for 3+ weeks
  const runLogs = (workoutLogs || []).filter(l => l.type === 'run' && l.distance)
  if (runLogs.length >= 3) {
    const allMax = Math.max(...runLogs.map(l => l.distance))
    const peakLog = runLogs.find(l => l.distance === allMax)
    if (peakLog) {
      const weeksSince = (new Date() - new Date(peakLog.date || peakLog.createdAt)) / (7 * 24 * 60 * 60 * 1000)
      const recentMax = Math.max(...runLogs.slice(0, 3).map(l => l.distance))
      if (weeksSince >= 3 && recentMax < allMax) {
        insights.push({
          id: 'run_stagnant',
          coach: 'fitzgerald',
          text: "Stagnation is a signal. Your longest run hasn't improved in over 3 weeks. Add 0.5km to next Saturday's long run.",
          type: 'tip',
        })
      }
    }
  }

  // Rule 2: Protein avg < 100g for last 3 days
  const today = new Date()
  const last3Dates = [0, 1, 2].map(d => {
    const dt = new Date(today)
    dt.setDate(dt.getDate() - d)
    return dt.toISOString().split('T')[0]
  })
  const recentNutrition = (nutritionLogs || []).filter(l => last3Dates.includes(l.date))
  if (recentNutrition.length >= 2) {
    const avgProtein = recentNutrition.reduce((sum, l) => {
      return sum + (l.meals || []).reduce((s, m) => s + (m.protein || 0), 0)
    }, 0) / recentNutrition.length
    if (avgProtein < 100) {
      insights.push({
        id: 'low_protein',
        coach: 'mta',
        text: "Muscle repair needs protein. You've averaged under 100g/day for the last 3 days. Prioritise chicken, eggs, or paneer at lunch today.",
        type: 'warning',
      })
    }
  }

  // Rule 3: Last 2 Hyrox sims — no improvement
  const sims = hyroxSims || []
  if (sims.length >= 2) {
    const [latest, prev] = sims
    if (latest.totalTime >= prev.totalTime) {
      insights.push({
        id: 'sim_no_improve',
        coach: 'mcmillan',
        text: "Fitness takes 10–14 days to show up in performance. Trust the process — improvements lag the training. Your next sim will be better.",
        type: 'tip',
      })
    }
  }

  // Rule 4: No session logged in 5+ days
  const logs = workoutLogs || []
  if (logs.length > 0) {
    const lastDate = new Date(logs[0].date || logs[0].createdAt)
    const daysSince = Math.floor((new Date() - lastDate) / (24 * 60 * 60 * 1000))
    if (daysSince >= 5) {
      insights.push({
        id: 'no_session',
        coach: 'bennett',
        text: "Consistency is the only secret. One missed week won't break you — but the habit of missing will. Get back out there.",
        type: 'warning',
      })
    }
  }

  // Rule 5: Weight loss > 0.8kg in one week
  const metrics = bodyMetrics || []
  if (metrics.length >= 2) {
    const latest = metrics[0]
    const weekAgo = metrics.find(m => {
      const diff = (new Date(latest.date) - new Date(m.date)) / (1000 * 60 * 60 * 24)
      return diff >= 5 && diff <= 9
    })
    if (weekAgo && (latest.weight - weekAgo.weight) < -0.8) {
      insights.push({
        id: 'weight_fast',
        coach: 'fitzgerald',
        text: "You're losing weight too fast. At this rate you're burning muscle, not just fat. Eat more — especially protein.",
        type: 'warning',
      })
    }
  }

  return insights
}
