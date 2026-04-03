import { AlertTriangle, Lightbulb } from 'lucide-react'
import { COACHES } from '../utils/coachData'
import { generateInsights } from '../utils/insightRules'

export default function TrainingInsights({ workoutLogs, nutritionLogs, hyroxSims, bodyMetrics }) {
  const insights = generateInsights({ workoutLogs, nutritionLogs, hyroxSims, bodyMetrics })
  if (insights.length === 0) return null

  return (
    <div className="glass p-4">
      <p className="text-sm font-black text-white/82 mb-3">Training Insights</p>
      <div className="space-y-3">
        {insights.map(insight => {
          const coach = COACHES[insight.coach]
          return (
            <div key={insight.id} className="rounded-xl p-3"
              style={{ background: `${coach.color}0e`, border: `1px solid ${coach.color}2e` }}>
              <div className="flex items-start gap-2">
                <div className="shrink-0 mt-0.5">
                  {insight.type === 'warning'
                    ? <AlertTriangle size={13} style={{ color: coach.color }} />
                    : <Lightbulb size={13} style={{ color: coach.color }} />}
                </div>
                <div>
                  <p className="text-xs font-black mb-0.5" style={{ color: coach.color }}>
                    {coach.name}
                  </p>
                  <p className="text-xs text-white/60 leading-relaxed">{insight.text}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
