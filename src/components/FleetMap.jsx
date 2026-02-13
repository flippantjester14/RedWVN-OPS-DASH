import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { useState, useEffect } from 'react'
import L from 'leaflet'

// Fix for default marker icon in Leaflet with Webpack/Vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// Custom drone icon (using a simple SVG as a placeholder or standard marker with rotation if possible, 
// but for now standard marker is safer)
// Custom drone icon
const droneIcon = new L.DivIcon({
    className: 'drone-marker',
    html: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 32px; height: 32px; color: #FF2080; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3)); transform: rotate(-45deg);">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
  </svg>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -10],
})

function MapController({ center, zoom }) {
    const map = useMap()
    useEffect(() => {
        map.flyTo(center, zoom)
    }, [center, zoom, map])
    return null
}

const MOCK_DRONES = [
    { id: 'AS04', lat: 18.2, lng: 82.6, status: 'Active', speed: 45, alt: 120, bat: 78 },
    { id: 'AS02', lat: 18.25, lng: 82.68, status: 'Standby', speed: 0, alt: 0, bat: 95 },
]

export default function FleetMap() {
    const [layer, setLayer] = useState('street') // 'street' or 'sat'
    const [drones, setDrones] = useState(MOCK_DRONES)

    // Simulate movement
    useEffect(() => {
        const interval = setInterval(() => {
            setDrones(prev => prev.map(d => {
                if (d.status !== 'Active') return d
                return {
                    ...d,
                    lat: d.lat + (Math.random() - 0.5) * 0.001,
                    lng: d.lng + (Math.random() - 0.5) * 0.001,
                    alt: Math.max(0, d.alt + (Math.random() - 0.5) * 2)
                }
            }))
        }, 2000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="map-wrapper">
            <div className="map-controls">
                <button
                    className={`map-btn ${layer === 'street' ? 'active' : ''}`}
                    onClick={() => setLayer('street')}
                >
                    Street
                </button>
                <button
                    className={`map-btn ${layer === 'sat' ? 'active' : ''}`}
                    onClick={() => setLayer('sat')}
                >
                    Satellite
                </button>
            </div>

            <MapContainer
                center={[18.22, 82.65]}
                zoom={11}
                style={{ height: '100%', width: '100%', borderRadius: '12px' }}
                zoomControl={false}
            >
                {/* Layers */}
                {layer === 'street' ? (
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                ) : (
                    <TileLayer
                        attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    />
                )}

                {/* Drones */}
                {drones.map(d => (
                    <Marker
                        key={d.id}
                        position={[d.lat, d.lng]}
                        icon={droneIcon}
                    >
                        <Popup>
                            <div style={{ fontFamily: 'var(--font)', minWidth: 120 }}>
                                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{d.id}</div>
                                <div style={{ fontSize: 12, color: '#666' }}>
                                    Status: <strong>{d.status}</strong><br />
                                    Speed: {d.speed} km/h<br />
                                    Alt: {Math.round(d.alt)}m<br />
                                    Bat: {d.bat}%
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    )
}
