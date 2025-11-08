import { useState, useEffect } from "react";
import { getParkingStatus } from "../api/parkingApi";
import ParkingSpotGrid from "../components/ParkingSpotGrid";
import CameraSelector from "../components/CameraSelector";
import type { ParkingSpot } from "../types";

const CAMERA_LIST = ["cam1", "cam2", "cam3"];

export default function CamerasView() {
  const [camera, setCamera] = useState<string>(CAMERA_LIST[0]);
  const [spots, setSpots] = useState<ParkingSpot[]>([]);

  useEffect(() => {
    let mounted = true;
    getParkingStatus(camera).then((data) => {
      if (mounted) setSpots(data);
    });
    return () => {
      mounted = false;
    };
  }, [camera]);

  return (
    <div className="app-container">
      <div className="page-header">
        <div>
          <div className="page-title">Cámaras</div>
          <div className="page-sub">Monitoreo en tiempo real de las plazas por cámara</div>
        </div>
        <div>
          <CameraSelector cameras={CAMERA_LIST} selected={camera} onSelect={setCamera} />
        </div>
      </div>

      <div className="card">
        <ParkingSpotGrid spots={spots} onToggle={() => {}} />
      </div>
    </div>
  );
}
