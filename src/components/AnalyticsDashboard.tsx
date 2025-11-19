import { useEffect, useState } from 'react';


// CSS
const styles = {
    container: {
        padding: '1rem',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        minHeight: '33vh',
        color: '#333',
    },
    header: {
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
    },
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
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '1.5rem',
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
        border: '1px solid #eee',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        transition: 'transform 0.2s ease',
    },
    iconContainer: {
        width: '50px',
        height: '50px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    cardContent: {
        flex: 1,
    },
    cardLabel: {
        fontSize: '0.75rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        color: '#888',
        fontWeight: '600',
        marginBottom: '0.25rem',
    },
    cardValue: {
        fontSize: '1.5rem',
        fontWeight: '800',
        margin: 0,
        color: '#2d3748',
    },
    button: {
        padding: '0.5rem 1rem',
        backgroundColor: 'white',
        border: '1px solid #ddd',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '0.9rem',
        fontWeight: '600',
        color: '#555',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
    },
    errorBanner: {
        backgroundColor: '#fff3cd',
        color: '#856404',
        padding: '1rem',
        borderRadius: '8px',
        marginBottom: '1.5rem',
        border: '1px solid #ffeeba',
    }
};

// Iconos
const Icons = {
    Percent: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="5" x2="5" y2="19"></line>
            <circle cx="6.5" cy="6.5" r="2.5"></circle>
            <circle cx="17.5" cy="17.5" r="2.5"></circle>
        </svg>
    ),
    TrendingUp: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
            <polyline points="17 6 23 6 23 12"></polyline>
        </svg>
    ),
    TrendingDown: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
            <polyline points="17 18 23 18 23 12"></polyline>
        </svg>
    ),
    MapPin: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
        </svg>
    ),
    AlertTriangle: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
    ),
    Activity: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
        </svg>
    ),
    Refresh: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 4v6h-6"></path>
            <path d="M1 20v-6h6"></path>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
        </svg>
    )
};

// API
const API_BASE_URL = 'http://localhost:8000/analytics';

const fetchAPI = async (endpoint) => {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        if (!response.ok) throw new Error(`Status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
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

// Card component
const StatCard = ({ title, value, icon: Icon, color, bgColor, loading }) => (
    <div style={styles.card}>
        <div style={{ ...styles.iconContainer, backgroundColor: bgColor, color: color }}>
            <Icon />
        </div>
        <div style={styles.cardContent}>
            <p style={styles.cardLabel}>{title}</p>
            {loading ? (
                <div style={{ height: '24px', width: '60%', backgroundColor: '#f0f0f0', borderRadius: '4px' }}></div>
            ) : (
                <h3 style={styles.cardValue}>{value !== null && value !== undefined ? value : 'N/A'}</h3>
            )}
        </div>
    </div>
);

// Componente principal
export default function AnalyticsDashboard({ currentCamera = "cam1" }) {
    const [metrics, setMetrics] = useState({
        occupancy: 0,
        topRow: null,
        peakHour: null,
        leastBusyHour: null,
        excessive: null,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [occ, row, peak, low, exc] = await Promise.all([
                apiService.getOccupancyPct(currentCamera),
                apiService.getTopRow(),
                apiService.getPeakHour(),
                apiService.getLeastBusyHour(),
                apiService.getCurrentExcessive()
            ]);

            setMetrics({ occupancy: occ, topRow: row, peakHour: peak, leastBusyHour: low, excessive: exc });
            setLastUpdated(new Date());
        } catch (err) {
            console.warn("Usando datos mock por error de conexión");
            setMetrics({
                occupancy: 0.45, topRow: 2, peakHour: "18:00", leastBusyHour: "03:00", excessive: "A-12"
            });
            setError("No se pudo conectar al backend (localhost:8000). Mostrando datos simulados.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
        const interval = setInterval(loadData, 30000);
        return () => clearInterval(interval);
    }, [currentCamera]);

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>Dashboard de Analítica</h1>
                    <p style={styles.subtitle}>Cámara actual: <strong>{currentCamera.toUpperCase()}</strong></p>
                </div>

                <button onClick={loadData} disabled={loading} style={styles.button}>
                    <Icons.Refresh />
                    {loading ? 'Cargando...' : 'Actualizar'}
                </button>
            </div>

            {error && (
                <div style={styles.errorBanner}>
                    <strong>Modo Offline:</strong> {error}
                </div>
            )}

            <div style={styles.grid}>
                <StatCard
                    title="Ocupación Actual"
                    value={`${(metrics.occupancy * 100).toFixed(0)}%`}
                    icon={Icons.Percent}
                    color="#2563eb"
                    bgColor="#dbeafe"
                    loading={loading}
                />
                <StatCard
                    title="Hora Pico Histórica"
                    value={metrics.peakHour}
                    icon={Icons.TrendingUp}
                    color="#e11d48"
                    bgColor="#ffe4e6"
                    loading={loading}
                />
                <StatCard
                    title="Hora Valle"
                    value={metrics.leastBusyHour}
                    icon={Icons.TrendingDown}
                    color="#059669"
                    bgColor="#d1fae5"
                    loading={loading}
                />
                <StatCard
                    title="Fila Más Usada"
                    value={metrics.topRow ? `Fila ${metrics.topRow}` : null}
                    icon={Icons.MapPin}
                    color="#7c3aed"
                    bgColor="#ede9fe"
                    loading={loading}
                />
                <StatCard
                    title="Uso Excesivo (>24h)"
                    value={metrics.excessive ? `Plaza ${metrics.excessive}` : "Ninguno"}
                    icon={Icons.AlertTriangle}
                    color="#d97706"
                    bgColor="#fef3c7"
                    loading={loading}
                />
                <StatCard
                    title="Estado Sistema"
                    value={error ? "Offline" : "Online"}
                    icon={Icons.Activity}
                    color={error ? "#64748b" : "#0891b2"}
                    bgColor={error ? "#f1f5f9" : "#cffafe"}
                    loading={loading}
                />
            </div>

            {lastUpdated && (
                <p style={{ textAlign: 'right', marginTop: '2rem', fontSize: '0.8rem', color: '#999' }}>
                    Última actualización: {lastUpdated.toLocaleTimeString()}
                </p>
            )}
        </div>
    );
}