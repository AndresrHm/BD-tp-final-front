import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import CamerasView from './pages/CamerasView'
import MetricsView from './pages/MetricsView'

export default function App() {
  return (
    <BrowserRouter>
      <div className="p-4 flex flex-col min-h-screen bg-gray-50">
        <header className="app-nav app-container">
          <div className="brand">
            <div className="brand-logo">P</div>
            <div>
              <div className="page-title">Estacionamiento</div>
              <div className="page-sub">Monitoreo y métricas</div>
            </div>
          </div>

          <div className="nav-links">
            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Cámaras
            </NavLink>
            <NavLink to="/metrics" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Métricas
            </NavLink>
          </div>
        </header>

        <main className="app-container">
          <Routes>
            <Route path="/" element={<CamerasView />} />
            <Route path="/metrics" element={<MetricsView />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}