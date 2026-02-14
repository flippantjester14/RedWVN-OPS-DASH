import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet'
import { useState, useEffect } from 'react'
import L from 'leaflet'
import { NODE_LOCATIONS, getStatusInfo } from '../data/droneTracking'

// Fix for default marker icon in Leaflet with Webpack/Vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// Custom drone icon
function createDroneIcon(status) {
    const info = getStatusInfo(status)
    const color = info.colorHex
    return new L.DivIcon({
        className: 'drone-marker',
        html: `<svg viewBox="0 0 24 24" fill="currentColor" style="width: 36px; height: 36px; color: ${color}; filter: drop-shadow(0 2px 6px rgba(0,0,0,0.4)); transform: rotate(45deg);">
    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
  </svg>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -12],
    })
}

// Hub icon (larger, distinct)
const hubIcon = new L.DivIcon({
    className: 'hub-marker',
    html: `<div style="
        width: 32px; height: 32px;
        background: linear-gradient(135deg, #FF2080, #FF6B9D);
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(255,32,128,0.5), 0 0 0 4px rgba(255,32,128,0.2);
        display: flex; align-items: center; justify-content: center;
        font-size: 14px; font-weight: 800; color: white;
    ">H</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18],
})

// Node icon (smaller dot)
const nodeIcon = new L.DivIcon({
    className: 'node-marker',
    html: `<div style="
        width: 22px; height: 22px;
        background: linear-gradient(135deg, #3D5AFE, #536DFE);
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 6px rgba(61,90,254,0.4);
        display: flex; align-items: center; justify-content: center;
        font-size: 8px; font-weight: 700; color: white;
    ">N</div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -14],
})

function FitBounds({ drones }) {
    const map = useMap()
    useEffect(() => {
        const points = [
            ...NODE_LOCATIONS.map(n => [n.lat, n.lng]),
            ...drones.filter(d => d.lat && d.lon).map(d => [d.lat, d.lon]),
        ]
        if (points.length > 1) {
            map.fitBounds(points, { padding: [30, 30], maxZoom: 13 })
        }
    }, []) // only on mount
    return null
}

export default function FleetMap({ drones = [] }) {
    const [layer, setLayer] = useState('street')

    const center = [18.07, 82.57] // Paderu area default

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
                center={center}
                zoom={11}
                style={{ height: '100%', width: '100%', borderRadius: '12px' }}
                zoomControl={false}
            >
                {/* Map layers */}
                {layer === 'street' ? (
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                ) : (
                    <TileLayer
                        attribution='Tiles &copy; Esri'
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    />
                )}

                <FitBounds drones={drones} />

                {/* Hub & Node markers */}
                {NODE_LOCATIONS.map(node => (
                    <Marker
                        key={node.name}
                        position={[node.lat, node.lng]}
                        icon={node.type === 'hub' ? hubIcon : nodeIcon}
                    >
                        <Popup>
                            <div style={{ fontFamily: 'var(--font)', minWidth: 130 }}>
                                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>
                                    {node.type === 'hub' ? '🏠 ' : '📍 '}{node.name}
                                </div>
                                <div style={{ fontSize: 11, color: '#666', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                    {node.type === 'hub' ? 'Operations Hub' : 'Delivery Node'}
                                </div>
                                <div style={{ fontSize: 10, color: '#999', marginTop: 4, fontFamily: 'monospace' }}>
                                    {node.lat.toFixed(4)}°N, {node.lng.toFixed(4)}°E
                                </div>
                            </div>
                        </Popup>
                        {/* Range circle for hub */}
                        {node.type === 'hub' && (
                            <Circle
                                center={[node.lat, node.lng]}
                                radius={5000}
                                pathOptions={{
                                    color: '#FF2080',
                                    fillColor: '#FF2080',
                                    fillOpacity: 0.04,
                                    weight: 1,
                                    dashArray: '6 4',
                                }}
                            />
                        )}
                    </Marker>
                ))}

                {/* Live drone markers */}
                {drones.filter(d => d.lat && d.lon).map(d => {
                    const statusInfo = getStatusInfo(d.status)
                    return (
                        <Marker
                            key={d.id}
                            position={[d.lat, d.lon]}
                            icon={createDroneIcon(d.status)}
                        >
                            <Popup>
                                <div style={{ fontFamily: 'var(--font)', minWidth: 150 }}>
                                    <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{d.aircraftName || d.id}</div>
                                    <div style={{
                                        fontSize: 10, fontWeight: 700, letterSpacing: 0.5,
                                        padding: '2px 8px', borderRadius: 10, display: 'inline-block',
                                        background: statusInfo.colorHex + '20',
                                        color: statusInfo.colorHex, marginBottom: 8,
                                    }}>
                                        {statusInfo.label}
                                    </div>
                                    <div style={{ fontSize: 12, color: '#555', lineHeight: 1.8 }}>
                                        <div>🚀 Speed: <strong>{(d.groundspeed || 0).toFixed(1)} m/s</strong></div>
                                        <div>📐 Alt: <strong>{Math.round(d.alt || 0)}m</strong></div>
                                        <div>🧭 HDG: <strong>{Math.round(d.heading || 0)}°</strong></div>
                                        {d.batteryRemaining != null && (
                                            <div>🔋 Bat: <strong>{d.batteryRemaining}%</strong></div>
                                        )}
                                        {d.voltage != null && (
                                            <div>⚡ Voltage: <strong>{d.voltage.toFixed(1)}V</strong></div>
                                        )}
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    )
                })}
            </MapContainer>
        </div>
    )
}
