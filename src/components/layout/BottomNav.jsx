import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Dumbbell, PlusCircle, Target, TrendingUp } from 'lucide-react'

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/train', label: 'Train', icon: Dumbbell },
  { to: '/log', label: 'Log', icon: PlusCircle },
  { to: '/hyrox', label: 'Hyrox', icon: Target },
  { to: '/progress', label: 'Progress', icon: TrendingUp },
]

export default function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bottom-nav-safe"
      style={{
        background: 'rgba(0,0,0,0.90)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        borderTop: '1px solid rgba(255,102,102,0.18)',
      }}
    >
      <div className="flex items-stretch justify-around max-w-lg mx-auto">
        {NAV_ITEMS.map(({ to, label, icon: Icon, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            className="flex flex-col items-center justify-center gap-1 py-2 px-3 flex-1 min-h-[56px] transition-all"
          >
            {({ isActive }) => (
              <>
                <div className={`transition-all ${isActive ? 'scale-110' : ''}`}>
                  <Icon
                    size={21}
                    strokeWidth={isActive ? 2.2 : 1.6}
                    color={isActive ? '#ff6666' : 'rgba(255,255,255,0.28)'}
                  />
                </div>
                <span
                  className="text-[10px] font-semibold"
                  style={{ color: isActive ? '#ff6666' : 'rgba(255,255,255,0.28)' }}
                >
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
