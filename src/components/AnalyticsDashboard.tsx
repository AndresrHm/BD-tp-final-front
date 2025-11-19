import React, { useEffect, useState } from 'react';

// Servicios API simulados para el ejemplo (Integrados para evitar errores de import)
const API_BASE_URL = 'http://localhost:8000/analytics';

const fetchAPI = async (endpoint) => {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        if (!response.ok) throw new Error(`Status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.warn(`Error fetching ${endpoint}, using mock data.`);
        throw error;
    }
};

const apiService = {
    getOccupancyPct: async (img) => (await fetchAPI(`/occupancy/${img}`)).occupancy_pct,
    getTopSpots: async () => (await fetchAPI('/top_spots')).top_spots,
    getTopRow: async () => (await fetchAPI('/top_row')).row,
    getCurrentExcessive: async () => (await fetchAPI('/current_excessive')).spot,
    getPeakHour: async () => (await fetchAPI('/peak_hour')).hour,
    getLeastBusyHour: async () => (await fetchAPI('/least_busy_hour')).hour
};

// Iconos SVG
const Icons = {
    Percent: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="5" x2="5" y2="19"></line><circle cx="6.5" cy="6.5" r="2.5"></circle><circle cx="17.5" cy="17.5" r="2.5"></circle></svg>,
    TrendingUp: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>,
    TrendingDown: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline></svg>,
    MapPin: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>,
    AlertTriangle: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>,
    Activity: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
};

const StatCard = ({ title, value, icon: Icon, colorClass, bgClass, loading }) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${bgClass} ${colorClass}`}>
            <Icon />
        </div>
        <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">{title}</p>
            {loading ? (
                <div className="h-8 w-24 bg-slate-100 rounded animate-pulse"></div>
            ) : (
                <h3 className="text-2xl font-extrabold text-slate-800">{value !== null && value !== undefined ? value : 'N/A'}</h3>
            )}
        </div>
    </div>
);

export default function AnalyticsDashboard({ currentCamera = "cam1" }) {
    const [metrics, setMetrics] = useState({
        occupancy: 0, topRow: null, peakHour: null, leastBusyHour: null, excessive: null,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [occ, row, peak, low, exc] = await Promise.all([
                    apiService.getOccupancyPct(currentCamera),
                    apiService.getTopRow(),
                    apiService.getPeakHour(),
                    apiService.getLeastBusyHour(),
                    apiService.getCurrentExcessive()
                ]);
                setMetrics({ occupancy: occ, topRow: row, peakHour: peak, leastBusyHour: low, excessive: exc });
            } catch (err) {
                // Mocks en caso de error
                setMetrics({ occupancy: 0.45, topRow: 2, peakHour: "18:00", leastBusyHour: "03:00", excessive: "A-12" });
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [currentCamera]);

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 style={styles.title}>Dashboard de Analítica</h1>
                    <p style={styles.subtitle}>Cámara actual: <strong>{currentCamera.toUpperCase()}</strong></p>
                </div>
                <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded">Últimos 30 días</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <StatCard title="Ocupación" value={`${(metrics.occupancy * 100).toFixed(0)}%`} icon={Icons.Percent} colorClass="text-blue-600" bgClass="bg-blue-50" loading={loading} />
                <StatCard title="Hora Pico" value={metrics.peakHour} icon={Icons.TrendingUp} colorClass="text-rose-600" bgClass="bg-rose-50" loading={loading} />
                <StatCard title="Hora Valle" value={metrics.leastBusyHour} icon={Icons.TrendingDown} colorClass="text-emerald-600" bgClass="bg-emerald-50" loading={loading} />
                <StatCard title="Fila Top" value={metrics.topRow ? `Fila ${metrics.topRow}` : '-'} icon={Icons.MapPin} colorClass="text-violet-600" bgClass="bg-violet-50" loading={loading} />
                <StatCard title="Uso Excesivo" value={metrics.excessive || 'Ninguno'} icon={Icons.AlertTriangle} colorClass="text-amber-600" bgClass="bg-amber-50" loading={loading} />
                <StatCard title="Estado" value="Online" icon={Icons.Activity} colorClass="text-cyan-600" bgClass="bg-cyan-50" loading={loading} />
            </div>
        </div>
    );
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