import BottomNav from './BottomNav'

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-dvh bg-[#09090f]">
      <main className="flex-1 content-with-nav overflow-y-auto">
        <div className="max-w-lg mx-auto">
          {children}
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
