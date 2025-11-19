import { useEffect, useState } from 'react'
import MetricsChart from '../components/MetricsChart'
import { getMetrics } from '../api/parkingApi'
import type { MetricPoint } from '../types'

export default function MetricsView() {
  const [data, setData] = useState<MetricPoint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    getMetrics().then(d => {
      if (mounted) {
        setData(d)
        setLoading(false)
      }
    })
    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="app-container">
      <div className="page-header">
        <div>
          <div className="page-title">Métricas</div>
          <div className="page-sub">Tendencia de ocupación</div>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div>Cargando métricas...</div>
        ) : (
          <div className="metrics-figure">
            <MetricsChart data={data} />
          </div>
        )}
        <div className="foot-note">Los datos son ficticios para propósitos de desarrollo.</div>
      </div>
    </div>
  )
}
