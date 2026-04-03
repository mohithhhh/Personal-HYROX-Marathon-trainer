import { useState } from 'react'
import { Plus, Minus, Trash2, CheckCircle, Search, Droplets } from 'lucide-react'
import { useAppData } from '../hooks/useAppData'
import { FOODS, FOOD_CATEGORIES, SUPPLEMENTS } from '../data/foods'
import ProgressBar from '../components/ui/ProgressBar'
import ProgressRing from '../components/ui/ProgressRing'

const INNER = { background: 'rgba(51,51,51,0.45)', border: '1px solid rgba(255,102,102,0.12)', borderRadius: 12 }

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
    <div className="glass p-4">
      <div className="flex items-center justify-between mb-4 gap-3">
        <div className="min-w-0">
          <p className="section-title">Today's Macros</p>
          <p className="text-xs text-white/28 mt-0.5 truncate">Target: {proteinTarget}g protein · {caloriesTarget} kcal</p>
        </div>
        <ProgressRing value={totals.protein} max={proteinTarget} size={64} strokeWidth={6}>
          <div className="text-center">
            <p className="text-xs font-black text-white">{Math.round(totals.protein)}</p>
            <p className="text-[9px] text-white/30">g</p>
          </div>
        </ProgressRing>
      </div>

      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-semibold text-white/45">Protein</span>
          <span className="text-xs font-bold text-white/65">
            {Math.round(totals.protein)}g / {proteinTarget}g
          </span>
        </div>
        <ProgressBar value={totals.protein} max={proteinTarget} height={8} />
      </div>

      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-semibold text-white/45">Calories</span>
          <span className="text-xs font-bold text-white/65">
            {Math.round(totals.calories)} / {caloriesTarget} kcal
          </span>
        </div>
        <ProgressBar value={totals.calories} max={caloriesTarget} height={8} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl p-2.5 text-center" style={INNER}>
          <p className="text-lg font-black text-white">{Math.round(totals.carbs)}g</p>
          <p className="text-xs text-white/30">Carbs</p>
        </div>
        <div className="rounded-xl p-2.5 text-center" style={INNER}>
          <p className="text-lg font-black text-white">{Math.round(totals.fat)}g</p>
          <p className="text-xs text-white/30">Fat</p>
        </div>
      </div>

      {totals.protein > 0 && (
        <div className="mt-3 text-center">
          {proteinPct >= 100
            ? <p className="text-xs font-semibold" style={{ color: '#ff6666' }}>Protein target hit! 🎯</p>
            : <p className="text-xs text-white/45">Need {Math.round(proteinTarget - totals.protein)}g more protein today</p>
          }
          {totals.calories > caloriesTarget + 200
            ? <p className="text-xs text-white/45 mt-0.5">{Math.round(totals.calories - caloriesTarget)} kcal over target</p>
            : totals.calories < caloriesTarget - 600
            ? <p className="text-xs text-white/45 mt-0.5">Under-fuelled — eat more to support training</p>
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

  const pillS = (a) => ({
    padding: '0.375rem 0.75rem', borderRadius: 9999, fontSize: '0.75rem', fontWeight: 600,
    whiteSpace: 'nowrap', cursor: 'pointer', transition: 'all 0.15s', flexShrink: 0,
    background: a ? '#ff6666' : 'rgba(51,51,51,0.55)',
    color: a ? '#000' : 'rgba(255,255,255,0.45)',
    border: a ? 'none' : '1px solid rgba(255,102,102,0.15)',
  })

  return (
    <div className="glass p-4 space-y-3">
      <p className="section-title">Add Food</p>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,102,102,0.45)' }} />
        <input type="text" placeholder="Search foods..." value={query}
          onChange={e => setQuery(e.target.value)}
          className="input-field pl-9"
          style={{ fontSize: '16px' }} />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1" style={{ WebkitOverflowScrolling: 'touch' }}>
        <button onClick={() => setCategory('all')} style={pillS(category === 'all')}>All</button>
        {FOOD_CATEGORIES.map(cat => (
          <button key={cat.id} onClick={() => setCategory(cat.id)} style={pillS(category === cat.id)}>
            {cat.name}
          </button>
        ))}
      </div>

      <div className="space-y-2 max-h-72 overflow-y-auto -mx-1 px-1">
        {filtered.map(food => (
          <div key={food.id} className="flex items-center gap-2 rounded-xl p-3" style={INNER}>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white/82 truncate">{food.name}</p>
              <div className="flex gap-2 text-xs text-white/30 mt-0.5 flex-wrap">
                <span className="font-semibold" style={{ color: '#ff6666' }}>{food.protein * getServings(food.id)}g P</span>
                <span>{food.calories * getServings(food.id)} kcal</span>
                <span className="truncate">{food.serving}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setServings(s => ({ ...s, [food.id]: Math.max(0.5, (s[food.id] || 1) - 0.5) }))}
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(51,51,51,0.55)', border: '1px solid rgba(255,102,102,0.15)', color: 'rgba(255,255,255,0.55)' }}
              >
                <Minus size={12} />
              </button>
              <span className="text-xs font-bold text-white/75 w-6 text-center">{getServings(food.id)}</span>
              <button
                onClick={() => setServings(s => ({ ...s, [food.id]: (s[food.id] || 1) + 0.5 }))}
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(51,51,51,0.55)', border: '1px solid rgba(255,102,102,0.15)', color: 'rgba(255,255,255,0.55)' }}
              >
                <Plus size={12} />
              </button>
            </div>
            <button
              onClick={() => handleAdd(food)}
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'rgba(255,102,102,0.18)', border: '1px solid rgba(255,102,102,0.40)', color: '#ff6666' }}
            >
              <Plus size={18} />
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-xs text-white/28 text-center py-4">No foods found. Try a different search.</p>
        )}
      </div>
    </div>
  )
}

function MealLog({ meals, onRemove }) {
  if (!meals.length) return (
    <div className="glass p-4 text-center">
      <p className="text-sm text-white/38">No food logged yet today.</p>
      <p className="text-xs text-white/22 mt-1">Add meals below.</p>
    </div>
  )
  return (
    <div className="glass p-4 space-y-2">
      <p className="section-title">Today's Food</p>
      {meals.map(meal => (
        <div key={meal.id} className="flex items-center gap-2 rounded-xl p-3" style={INNER}>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-semibold text-white/82 truncate">{meal.name}</p>
              {meal.servings !== 1 && (
                <span className="text-xs text-white/30 shrink-0">×{meal.servings}</span>
              )}
            </div>
            <div className="flex gap-2 text-xs mt-0.5">
              <span className="font-bold" style={{ color: '#ff6666' }}>{Math.round(meal.protein)}g P</span>
              <span className="text-white/30">{Math.round(meal.calories)} kcal</span>
              {meal.time && <span className="text-white/28">{meal.time}</span>}
            </div>
          </div>
          <button onClick={() => onRemove(meal.id)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-white/25 active:text-white/60 shrink-0">
            <Trash2 size={14} />
          </button>
        </div>
      ))}
    </div>
  )
}

function WaterTracker({ water, onUpdate }) {
  const TARGET_ML = 3000
  const steps = [500, 1000, 1500, 2000, 2500, 3000]

  return (
    <div className="glass p-4">
      <div className="flex items-center justify-between mb-3 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Droplets size={18} style={{ color: '#ff6666', flexShrink: 0 }} />
          <p className="text-sm font-bold text-white/82">Water Intake</p>
        </div>
        <span className="text-sm font-black shrink-0" style={{ color: '#ff6666' }}>{water}ml / {TARGET_ML}ml</span>
      </div>

      <ProgressBar value={water} max={TARGET_ML} height={10} className="mb-3" />

      <div className="flex flex-wrap gap-2">
        {[250, 500, 750].map(ml => (
          <button key={ml} onClick={() => onUpdate(Math.min(TARGET_ML, water + ml))}
            className="flex-1 min-w-0 py-2 rounded-xl text-xs font-semibold min-h-[44px]"
            style={{ background: 'rgba(51,51,51,0.55)', border: '1px solid rgba(255,102,102,0.18)', color: 'rgba(255,255,255,0.65)' }}>
            +{ml}ml
          </button>
        ))}
        <button onClick={() => onUpdate(0)}
          className="px-3 py-2 rounded-xl text-xs font-semibold min-h-[44px]"
          style={{ background: 'rgba(51,51,51,0.35)', color: 'rgba(255,255,255,0.38)' }}>
          Reset
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mt-2">
        {steps.map(ml => (
          <button key={ml} onClick={() => onUpdate(ml)}
            className="flex-1 min-w-0 py-1.5 rounded-lg text-xs font-medium transition-colors"
            style={{
              background: water === ml ? 'rgba(255,102,102,0.18)' : 'rgba(51,51,51,0.35)',
              color: water === ml ? '#ff6666' : 'rgba(255,255,255,0.30)',
              border: water === ml ? '1px solid rgba(255,102,102,0.35)' : '1px solid transparent',
            }}>
            {ml / 1000}L
          </button>
        ))}
      </div>

      {water >= TARGET_ML && (
        <p className="text-xs text-center mt-2 font-semibold" style={{ color: '#ff6666' }}>Daily water target hit! 💧</p>
      )}
    </div>
  )
}

function SupplementCard({ supp, checked, onToggle }) {
  return (
    <button onClick={onToggle}
      className="flex items-start gap-3 p-3 rounded-xl border transition-all min-h-[44px] text-left w-full"
      style={checked
        ? { background: 'rgba(255,102,102,0.12)', border: '1px solid rgba(255,102,102,0.40)' }
        : { background: 'rgba(51,51,51,0.35)', border: '1px solid rgba(255,102,102,0.10)' }
      }>
      <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0 transition-all"
        style={checked
          ? { borderColor: '#ff6666', background: 'rgba(255,102,102,0.18)' }
          : { borderColor: 'rgba(255,102,102,0.25)', background: 'transparent' }
        }>
        {checked && <CheckCircle size={14} style={{ color: '#ff6666' }} />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-semibold text-white/82">{supp.name}</p>
          <span className="text-xs font-bold px-1.5 py-0.5 rounded shrink-0"
            style={{ background: 'rgba(51,51,51,0.65)', color: 'rgba(255,102,102,0.70)' }}>
            {supp.dose}
          </span>
        </div>
        <p className="text-xs text-white/30 mt-0.5">{supp.timing}</p>
        {!checked && <p className="text-xs text-white/22 mt-0.5 italic">{supp.why}</p>}
      </div>
    </button>
  )
}

function SupplementsSection({ supplements, onToggle }) {
  return (
    <div className="glass p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="section-title">Supplements</p>
        <p className="text-xs text-white/28">
          {Object.values(supplements).filter(Boolean).length} / {SUPPLEMENTS.length} done
        </p>
      </div>
      {SUPPLEMENTS.map(supp => (
        <SupplementCard key={supp.id} supp={supp} checked={!!supplements[supp.id]} onToggle={() => onToggle(supp.id)} />
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
    <div className="glass p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="section-title">Your Targets</p>
        {!editing && (
          <button onClick={() => setEditing(true)} className="text-xs font-semibold" style={{ color: 'rgba(255,102,102,0.65)' }}>Edit weight</button>
        )}
      </div>
      {editing ? (
        <div className="flex gap-2">
          <input type="number" value={weight} onChange={e => setWeight(e.target.value)}
            className="input-field flex-1" placeholder="75" style={{ fontSize: '16px' }} />
          <button onClick={save} className="btn-primary px-4 text-sm shrink-0">Save</button>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-xl p-3 text-center" style={INNER}>
            <p className="text-xl font-black text-white">{user.weight}<span className="text-xs text-white/40">kg</span></p>
            <p className="text-xs text-white/30 mt-0.5">Weight</p>
          </div>
          <div className="rounded-xl p-3 text-center" style={INNER}>
            <p className="text-xl font-black" style={{ color: '#ff6666' }}>{user.targetProtein}<span className="text-xs" style={{ color: 'rgba(255,102,102,0.50)' }}>g</span></p>
            <p className="text-xs text-white/30 mt-0.5">Protein</p>
          </div>
          <div className="rounded-xl p-3 text-center" style={INNER}>
            <p className="text-lg font-black text-white">{user.targetCalories}</p>
            <p className="text-xs text-white/30 mt-0.5">Calories</p>
          </div>
        </div>
      )}
      <p className="text-xs text-white/28 mt-2">
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
      <h1 className="text-2xl font-black text-white">Nutrition</h1>
      <UserTargetCard user={user} onUpdate={setUser} />
      <MacroSummary meals={todayLog.meals} user={user} />
      <MealLog meals={todayLog.meals} onRemove={removeMeal} />
      <FoodSearch onAdd={addMeal} />
      <WaterTracker water={todayLog.water} onUpdate={updateWater} />
      <SupplementsSection supplements={todayLog.supplements} onToggle={toggleSupplement} />
    </div>
  )
}
