import { useState } from 'react'
import { Plus, Minus, Trash2, CheckCircle, Search, Droplets, Target } from 'lucide-react'
import { useAppData } from '../hooks/useAppData'
import { FOODS, FOOD_CATEGORIES, SUPPLEMENTS } from '../data/foods'
import ProgressBar from '../components/ui/ProgressBar'
import ProgressRing from '../components/ui/ProgressRing'

const WATER_STEPS_ML = [250, 500, 750, 1000, 1250, 1500, 1750, 2000, 2500, 3000]

function MacroSummary({ meals, user }) {
  const totals = meals.reduce((acc, meal) => ({
    protein: acc.protein + (meal.protein || 0) * meal.servings,
    calories: acc.calories + (meal.calories || 0) * meal.servings,
    carbs: acc.carbs + (meal.carbs || 0) * meal.servings,
    fat: acc.fat + (meal.fat || 0) * meal.servings,
  }), { protein: 0, calories: 0, carbs: 0, fat: 0 })

  const proteinTarget = user.targetProtein || 130
  const caloriesTarget = user.targetCalories || 2200
  const proteinPct = Math.min(100, (totals.protein / proteinTarget) * 100)

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="section-title">Today's Macros</p>
          <p className="text-xs text-[#475569] mt-0.5">Target: {proteinTarget}g protein · {caloriesTarget} kcal</p>
        </div>
        <ProgressRing value={totals.protein} max={proteinTarget} size={64} strokeWidth={6} color={proteinPct >= 80 ? '#22c55e' : '#f97316'}>
          <div className="text-center">
            <p className="text-xs font-black text-[#f1f5f9]">{Math.round(totals.protein)}</p>
            <p className="text-[9px] text-[#475569]">g</p>
          </div>
        </ProgressRing>
      </div>

      {/* Protein */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-semibold text-[#94a3b8]">Protein</span>
          <span className="text-xs font-bold" style={{ color: proteinPct >= 80 ? '#22c55e' : '#f97316' }}>
            {Math.round(totals.protein)}g / {proteinTarget}g
          </span>
        </div>
        <ProgressBar value={totals.protein} max={proteinTarget} color={proteinPct >= 80 ? '#22c55e' : '#f97316'} height={8} />
      </div>

      {/* Calories */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-semibold text-[#94a3b8]">Calories</span>
          <span className="text-xs font-bold text-[#6366f1]">
            {Math.round(totals.calories)} / {caloriesTarget} kcal
          </span>
        </div>
        <ProgressBar value={totals.calories} max={caloriesTarget} color="#6366f1" height={8} />
      </div>

      {/* Carbs & Fat */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#111118] rounded-xl p-2.5 text-center">
          <p className="text-lg font-black text-[#f1f5f9]">{Math.round(totals.carbs)}g</p>
          <p className="text-xs text-[#475569]">Carbs</p>
        </div>
        <div className="bg-[#111118] rounded-xl p-2.5 text-center">
          <p className="text-lg font-black text-[#f1f5f9]">{Math.round(totals.fat)}g</p>
          <p className="text-xs text-[#475569]">Fat</p>
        </div>
      </div>

      {totals.protein > 0 && (
        <div className="mt-3 text-center">
          {proteinPct >= 100
            ? <p className="text-xs text-[#22c55e] font-semibold">✓ Protein target hit! Great job.</p>
            : <p className="text-xs text-[#f97316]">Need {Math.round(proteinTarget - totals.protein)}g more protein today</p>
          }
          {totals.calories > caloriesTarget + 200
            ? <p className="text-xs text-[#ef4444] mt-0.5">⚠ {Math.round(totals.calories - caloriesTarget)} kcal over target</p>
            : totals.calories < caloriesTarget - 600
            ? <p className="text-xs text-[#f59e0b] mt-0.5">Under-fuelled — eat more to support training</p>
            : null
          }
        </div>
      )}
    </div>
  )
}

function FoodSearch({ onAdd }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [servings, setServings] = useState({})

  const filtered = FOODS.filter(f => {
    const matchesCat = category === 'all' || f.category === category
    const matchesQ = !query || f.name.toLowerCase().includes(query.toLowerCase())
    return matchesCat && matchesQ
  })

  const getServings = (id) => servings[id] || 1

  const handleAdd = (food) => {
    const s = getServings(food.id)
    onAdd({
      foodId: food.id,
      name: food.name,
      serving: food.serving,
      servings: s,
      protein: food.protein * s,
      calories: food.calories * s,
      carbs: food.carbs * s,
      fat: food.fat * s,
    })
    setServings(prev => ({ ...prev, [food.id]: 1 }))
  }

  return (
    <div className="card p-4 space-y-3">
      <p className="section-title">Add Food</p>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#475569]" />
        <input
          type="text"
          placeholder="Search foods..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="input-field pl-9"
        />
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        <button
          onClick={() => setCategory('all')}
          className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${category === 'all' ? 'bg-[#f97316] text-white' : 'bg-[#1a1a24] text-[#475569]'}`}
        >
          All
        </button>
        {FOOD_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${category === cat.id ? 'bg-[#f97316] text-white' : 'bg-[#1a1a24] text-[#475569]'}`}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {/* Food list */}
      <div className="space-y-2 max-h-72 overflow-y-auto -mx-1 px-1">
        {filtered.map(food => (
          <div key={food.id} className="flex items-center gap-2 bg-[#111118] rounded-xl p-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#f1f5f9] truncate">{food.name}</p>
              <div className="flex gap-2 text-xs text-[#475569] mt-0.5">
                <span className="text-[#22c55e] font-semibold">{food.protein * getServings(food.id)}g P</span>
                <span>{food.calories * getServings(food.id)} kcal</span>
                <span className="truncate">{food.serving}</span>
              </div>
            </div>
            {/* Servings adjuster */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setServings(s => ({ ...s, [food.id]: Math.max(0.5, (s[food.id] || 1) - 0.5) }))}
                className="w-7 h-7 rounded-lg bg-[#21212e] flex items-center justify-center text-[#94a3b8] active:bg-[#2a2a3d]"
              >
                <Minus size={12} />
              </button>
              <span className="text-xs font-bold text-[#f1f5f9] w-6 text-center">{getServings(food.id)}</span>
              <button
                onClick={() => setServings(s => ({ ...s, [food.id]: (s[food.id] || 1) + 0.5 }))}
                className="w-7 h-7 rounded-lg bg-[#21212e] flex items-center justify-center text-[#94a3b8] active:bg-[#2a2a3d]"
              >
                <Plus size={12} />
              </button>
            </div>
            <button
              onClick={() => handleAdd(food)}
              className="w-9 h-9 rounded-xl bg-[#f97316]/20 text-[#f97316] flex items-center justify-center active:bg-[#f97316]/40"
            >
              <Plus size={18} />
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-xs text-[#475569] text-center py-4">No foods found. Try a different search.</p>
        )}
      </div>
    </div>
  )
}

function MealLog({ meals, onRemove }) {
  if (!meals.length) return (
    <div className="card p-4 text-center">
      <p className="text-sm text-[#475569]">No food logged yet today.</p>
      <p className="text-xs text-[#475569] mt-1">Add meals below ↓</p>
    </div>
  )
  return (
    <div className="card p-4 space-y-2">
      <p className="section-title">Today's Food</p>
      {meals.map(meal => (
        <div key={meal.id} className="flex items-center gap-2 bg-[#111118] rounded-xl p-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-[#f1f5f9] truncate">{meal.name}</p>
              {meal.servings !== 1 && (
                <span className="text-xs text-[#475569] shrink-0">×{meal.servings}</span>
              )}
            </div>
            <div className="flex gap-2 text-xs mt-0.5">
              <span className="text-[#22c55e] font-bold">{Math.round(meal.protein)}g P</span>
              <span className="text-[#475569]">{Math.round(meal.calories)} kcal</span>
              {meal.time && <span className="text-[#475569]">{meal.time}</span>}
            </div>
          </div>
          <button
            onClick={() => onRemove(meal.id)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#475569] active:text-[#ef4444]"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}
    </div>
  )
}

function WaterTracker({ water, onUpdate }) {
  const TARGET_ML = 3000
  const pct = Math.min(100, (water / TARGET_ML) * 100)

  const steps = [500, 1000, 1500, 2000, 2500, 3000]

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Droplets size={18} className="text-[#6366f1]" />
          <p className="text-sm font-bold text-[#f1f5f9]">Water Intake</p>
        </div>
        <span className="text-sm font-black text-[#6366f1]">{water}ml / {TARGET_ML}ml</span>
      </div>

      <ProgressBar value={water} max={TARGET_ML} color="#6366f1" height={10} className="mb-3" />

      {/* Quick add buttons */}
      <div className="flex flex-wrap gap-2">
        {[250, 500, 750].map(ml => (
          <button
            key={ml}
            onClick={() => onUpdate(Math.min(TARGET_ML, water + ml))}
            className="flex-1 min-w-0 py-2 rounded-xl bg-[#6366f1]/10 text-[#818cf8] text-xs font-semibold active:bg-[#6366f1]/20 min-h-[44px]"
          >
            +{ml}ml
          </button>
        ))}
        <button
          onClick={() => onUpdate(0)}
          className="px-3 py-2 rounded-xl bg-[#111118] text-[#475569] text-xs font-semibold active:bg-[#21212e] min-h-[44px]"
        >
          Reset
        </button>
      </div>

      {/* Preset buttons */}
      <div className="flex flex-wrap gap-2 mt-2">
        {steps.map(ml => (
          <button
            key={ml}
            onClick={() => onUpdate(ml)}
            className={`flex-1 min-w-0 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              water === ml ? 'bg-[#6366f1]/30 text-[#818cf8]' : 'bg-[#111118] text-[#475569]'
            }`}
          >
            {ml/1000}L
          </button>
        ))}
      </div>

      {water >= TARGET_ML && (
        <p className="text-xs text-[#22c55e] text-center mt-2 font-semibold">💧 Daily water target hit!</p>
      )}
    </div>
  )
}

function SupplementCard({ supp, checked, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`flex items-start gap-3 p-3 rounded-xl border transition-all min-h-[44px] text-left w-full ${
        checked
          ? 'border-opacity-40 bg-opacity-10'
          : 'border-[#2a2a3d] bg-[#111118]'
      }`}
      style={checked ? { borderColor: `${supp.color}60`, backgroundColor: `${supp.color}10` } : {}}
    >
      <div
        className="w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0 transition-all"
        style={{ borderColor: checked ? supp.color : '#333348', backgroundColor: checked ? `${supp.color}20` : 'transparent' }}
      >
        {checked && <CheckCircle size={14} style={{ color: supp.color }} />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-[#f1f5f9]">{supp.name}</p>
          <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ color: supp.color, backgroundColor: `${supp.color}15` }}>
            {supp.dose}
          </span>
        </div>
        <p className="text-xs text-[#475569] mt-0.5">{supp.timing}</p>
        {!checked && <p className="text-xs text-[#475569] mt-0.5 italic">{supp.why}</p>}
      </div>
    </button>
  )
}

function SupplementsSection({ supplements, onToggle }) {
  return (
    <div className="card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="section-title">Supplements</p>
        <p className="text-xs text-[#475569]">
          {Object.values(supplements).filter(Boolean).length} / {SUPPLEMENTS.length} done
        </p>
      </div>
      {SUPPLEMENTS.map(supp => (
        <SupplementCard
          key={supp.id}
          supp={supp}
          checked={!!supplements[supp.id]}
          onToggle={() => onToggle(supp.id)}
        />
      ))}
    </div>
  )
}

function UserTargetCard({ user, onUpdate }) {
  const [editing, setEditing] = useState(false)
  const [weight, setWeight] = useState(user.weight)

  const save = () => {
    const w = Number(weight)
    if (w > 0) {
      onUpdate({ ...user, weight: w, targetProtein: Math.round(w * 1.7) })
    }
    setEditing(false)
  }

  const minProtein = Math.round(user.weight * 1.6)
  const maxProtein = Math.round(user.weight * 2)

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="section-title">Your Targets</p>
        {!editing && (
          <button onClick={() => setEditing(true)} className="text-xs text-[#f97316]">Edit weight</button>
        )}
      </div>
      {editing ? (
        <div className="flex gap-2">
          <input
            type="number"
            value={weight}
            onChange={e => setWeight(e.target.value)}
            className="input-field flex-1"
            placeholder="75"
          />
          <button onClick={save} className="btn-primary px-4 text-sm">Save</button>
        </div>
      ) : (
        <div className="flex gap-3">
          <div className="flex-1 bg-[#111118] rounded-xl p-3 text-center">
            <p className="text-xl font-black text-[#f1f5f9]">{user.weight}kg</p>
            <p className="text-xs text-[#475569]">Body Weight</p>
          </div>
          <div className="flex-1 bg-[#111118] rounded-xl p-3 text-center">
            <p className="text-xl font-black text-[#22c55e]">{user.targetProtein}g</p>
            <p className="text-xs text-[#475569]">Protein Target</p>
          </div>
          <div className="flex-1 bg-[#111118] rounded-xl p-3 text-center">
            <p className="text-xl font-black text-[#6366f1]">{user.targetCalories}</p>
            <p className="text-xs text-[#475569]">Cal Target</p>
          </div>
        </div>
      )}
      <p className="text-xs text-[#475569] mt-2">
        Range: {minProtein}–{maxProtein}g/day (1.6–2g × {user.weight}kg)
      </p>
    </div>
  )
}

export default function Nutrition() {
  const { user, setUser, getTodayNutrition, addMeal, removeMeal, updateWater, toggleSupplement } = useAppData()
  const todayLog = getTodayNutrition()

  return (
    <div className="px-4 pt-6 pb-4 space-y-4">
      <h1 className="text-2xl font-black text-[#f1f5f9]">Nutrition</h1>

      {/* Targets */}
      <UserTargetCard user={user} onUpdate={setUser} />

      {/* Macro summary */}
      <MacroSummary meals={todayLog.meals} user={user} />

      {/* Today's meals */}
      <MealLog meals={todayLog.meals} onRemove={removeMeal} />

      {/* Food search */}
      <FoodSearch onAdd={addMeal} />

      {/* Water */}
      <WaterTracker water={todayLog.water} onUpdate={updateWater} />

      {/* Supplements */}
      <SupplementsSection supplements={todayLog.supplements} onToggle={toggleSupplement} />
    </div>
  )
}
