import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Train from './pages/Train'
import Log from './pages/Log'
import Hyrox from './pages/Hyrox'
import Nutrition from './pages/Nutrition'
import Progress from './pages/Progress'
import CoachHub from './pages/CoachHub'

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/train" element={<Train />} />
          <Route path="/log" element={<Log />} />
          <Route path="/hyrox" element={<Hyrox />} />
          <Route path="/nutrition" element={<Nutrition />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/coach" element={<CoachHub />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
