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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#111118]/95 backdrop-blur-xl border-t border-[#2a2a3d] bottom-nav-safe">
      <div className="flex items-stretch justify-around max-w-lg mx-auto">
        {NAV_ITEMS.map(({ to, label, icon: Icon, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 py-2 px-3 flex-1 min-h-[56px] transition-colors ${
                isActive
                  ? 'text-[#f97316]'
                  : 'text-[#475569] active:text-[#94a3b8]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`relative transition-transform ${isActive ? 'scale-110' : ''}`}>
                  <Icon
                    size={22}
                    strokeWidth={isActive ? 2.5 : 1.8}
                    className={isActive ? 'text-[#f97316]' : 'text-[#475569]'}
                  />
                  {isActive && (
                    <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#f97316]" />
                  )}
                </div>
                <span className={`text-[10px] font-medium ${isActive ? 'text-[#f97316]' : 'text-[#475569]'}`}>
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
