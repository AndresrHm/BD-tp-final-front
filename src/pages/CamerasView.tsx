import { useState, useEffect } from 'react'
import { getParkingStatus } from '../api/parkingApi'
import ParkingSpotGrid from '../components/ParkingSpotGrid'
import CameraSelector from '../components/CameraSelector'
import type { ParkingSpot } from '../types'
import AnalyticsDashboard from '../components/AnalyticsDashboard'

const CAMERA_LIST = ['cam1', 'cam2', 'cam3']

export default function CamerasView() {
  const [camera, setCamera] = useState<string>(CAMERA_LIST[0])
  const [spots, setSpots] = useState<ParkingSpot[]>([])

  useEffect(() => {
    let mounted = true
    getParkingStatus(camera).then(data => {
      if (mounted) setSpots(data)
    })
    return () => {
      mounted = false
    }
  }, [camera])

  return (
    <div className="app-container">
      <div className="page-header">
        <div>
          <CameraSelector cameras={CAMERA_LIST} selected={camera} onSelect={setCamera} />
        </div>
      </div>

      <div className="card">
        <div>
          <h1 style={styles.title}>Cámaras</h1>
          <p style={styles.subtitle}>Monitoreo en tiempo real de las plazas por cámara<strong>{}</strong></p>
        </div>
        <ParkingSpotGrid spots={spots} onToggle={() => { }} />
      </div>
      <div className="card">
        <AnalyticsDashboard />
      </div>
    </div>
  )
}

const styles = {
  title: {
    fontSize: '1.8rem',
    fontWeight: '700',
    margin: '0',
    color: '#1a1a1a',
  },
  subtitle: {
    margin: '0 0 0 0',
    color: '#666',
    fontSize: '0.9rem',
  },
}