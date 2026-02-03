import { useEffect, useState, useRef, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import { motion } from 'framer-motion'

const TAJANGI_PHC = [18.8234, 84.0012]
const SUNKARAMETTA_PHC = [18.7956, 83.9567]
const MAP_CENTER = [18.81, 83.978]

const droneIconSvg = `
<svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="droneGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="2" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <g filter="url(#droneGlow)">
    <circle cx="18" cy="18" r="7" fill="#D32F2F"/>
    <path d="M18 6L20 11H16L18 6Z" fill="#D32F2F"/>
    <path d="M18 30L16 25H20L18 30Z" fill="#D32F2F"/>
    <path d="M6 18L11 16V20L6 18Z" fill="#D32F2F"/>
    <path d="M30 18L25 20V16L30 18Z" fill="#D32F2F"/>
    <circle cx="9" cy="9" r="3" fill="#D32F2F" opacity="0.8"/>
    <circle cx="27" cy="9" r="3" fill="#D32F2F" opacity="0.8"/>
    <circle cx="9" cy="27" r="3" fill="#D32F2F" opacity="0.8"/>
    <circle cx="27" cy="27" r="3" fill="#D32F2F" opacity="0.8"/>
    <circle cx="18" cy="18" r="2.5" fill="#fff"/>
  </g>
</svg>`

const createDroneIcon = () => L.divIcon({
  html: droneIconSvg,
  className: 'drone-marker',
  iconSize: [36, 36],
  iconAnchor: [18, 18]
})

const phcIcon = L.divIcon({
  html: `<div class="phc-node"><div class="phc-core"></div><div class="phc-scan"></div></div>`,
  className: 'phc-marker-wrapper',
  iconSize: [40, 40],
  iconAnchor: [20, 20]
})

function AnimatedDrone({ route, duration = 20000 }) {
  const [position, setPosition] = useState(route[0])
  const [trail, setTrail] = useState([route[0]])
  const [progress, setProgress] = useState(0)
  const animationRef = useRef(null)
  const startTimeRef = useRef(null)

  useEffect(() => {
    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp
      const elapsed = timestamp - startTimeRef.current
      const newProgress = (elapsed % duration) / duration

      const lat = route[0][0] + (route[1][0] - route[0][0]) * newProgress
      const lng = route[0][1] + (route[1][1] - route[0][1]) * newProgress

      setPosition([lat, lng])
      setProgress(newProgress)
      setTrail(prev => {
        const newTrail = [...prev, [lat, lng]]
        return newTrail.length > 60 ? newTrail.slice(-60) : newTrail
      })

      animationRef.current = requestAnimationFrame(animate)
    }
    animationRef.current = requestAnimationFrame(animate)
    return () => animationRef.current && cancelAnimationFrame(animationRef.current)
  }, [route, duration])

  const droneIcon = useMemo(() => createDroneIcon(), [])

  return (
    <>
      <Polyline
        positions={trail}
        pathOptions={{ color: '#D32F2F', weight: 2.5, opacity: 0.35, lineCap: 'round' }}
      />
      <Marker position={position} icon={droneIcon}>
        <Popup>
          <div className="drone-popup-content">
            <div className="popup-header">AS04</div>
            <div className="popup-row"><span>ALT</span><span>120m</span></div>
            <div className="popup-row"><span>SPD</span><span>45 km/h</span></div>
            <div className="popup-row"><span>PROG</span><span className="green">{(progress * 100).toFixed(0)}%</span></div>
          </div>
        </Popup>
      </Marker>
    </>
  )
}

function MapController() {
  const map = useMap()
  useEffect(() => {
    map.setView(MAP_CENTER, 12)
    setTimeout(() => map.invalidateSize(), 100)
  }, [map])
  return null
}

export default function LiveMap() {
  const route = [TAJANGI_PHC, SUNKARAMETTA_PHC]
  const safetyCorridorOffset = 0.008

  const corridorPath = [
    [TAJANGI_PHC[0] + safetyCorridorOffset, TAJANGI_PHC[1]],
    [SUNKARAMETTA_PHC[0] + safetyCorridorOffset, SUNKARAMETTA_PHC[1]],
    [SUNKARAMETTA_PHC[0] - safetyCorridorOffset, SUNKARAMETTA_PHC[1]],
    [TAJANGI_PHC[0] - safetyCorridorOffset, TAJANGI_PHC[1]],
    [TAJANGI_PHC[0] + safetyCorridorOffset, TAJANGI_PHC[1]]
  ]

  return (
    <motion.div
      className="map-container glass-card"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="map-header">
        <span className="map-title">GEOSPATIAL CONTROL</span>
        <div className="map-status">
          <div className="status-dot glow-green"></div>
          <span>2 NODES ACTIVE</span>
        </div>
      </div>

      <div className="map-wrapper">
        <MapContainer center={MAP_CENTER} zoom={12} style={{ height: '100%', width: '100%' }} zoomControl={true}>
          <MapController />
          <TileLayer attribution='&copy; CARTO' url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

          <Polyline positions={corridorPath} pathOptions={{ color: '#D32F2F', fillColor: '#D32F2F', fillOpacity: 0.05, weight: 0, fill: true }} />
          <Polyline positions={corridorPath} pathOptions={{ color: '#D32F2F', weight: 1, opacity: 0.3, dashArray: '4, 4' }} />

          <Circle center={TAJANGI_PHC} radius={2000} pathOptions={{ color: '#D32F2F', fillColor: '#D32F2F', fillOpacity: 0.04, weight: 1.5, dashArray: '6, 4' }} />
          <Circle center={SUNKARAMETTA_PHC} radius={2000} pathOptions={{ color: '#D32F2F', fillColor: '#D32F2F', fillOpacity: 0.04, weight: 1.5, dashArray: '6, 4' }} />

          <Polyline positions={route} pathOptions={{ color: 'rgba(211, 47, 47, 0.2)', weight: 2, dashArray: '8, 8' }} />

          <Marker position={TAJANGI_PHC} icon={phcIcon}>
            <Popup><div className="phc-popup"><strong>Tajangi PHC</strong><span className="online">● ONLINE</span></div></Popup>
          </Marker>
          <Marker position={SUNKARAMETTA_PHC} icon={phcIcon}>
            <Popup><div className="phc-popup"><strong>Sunkarametta PHC</strong><span className="online">● ONLINE</span></div></Popup>
          </Marker>

          <AnimatedDrone route={route} duration={18000} />
        </MapContainer>
      </div>

      <style>{`
        .map-container {
          display: flex;
          flex-direction: column;
          overflow: hidden;
          height: 100%;
        }
        
        .map-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 18px;
          border-bottom: 1px solid var(--border-glass);
          flex-shrink: 0;
        }
        
        .map-title {
          font-family: var(--font-display);
          font-size: 11px;
          font-weight: 600;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 2px;
        }
        
        .map-status {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--phosphor-green);
          font-weight: 500;
          letter-spacing: 1px;
        }
        
        .status-dot {
          width: 8px;
          height: 8px;
          background: var(--phosphor-green);
          border-radius: 50%;
        }
        
        .map-wrapper {
          flex: 1;
          min-height: 300px;
        }
        
        .phc-node {
          position: relative;
          width: 40px;
          height: 40px;
        }
        
        .phc-core {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 14px;
          height: 14px;
          background: var(--phosphor-green);
          border: 2px solid #0a0a0a;
          border-radius: 50%;
          box-shadow: 0 0 12px rgba(0, 255, 65, 0.5);
          z-index: 2;
        }
        
        .phc-scan {
          position: absolute;
          top: 0;
          left: 0;
          width: 40px;
          height: 40px;
          border: 2px solid transparent;
          border-top-color: rgba(211, 47, 47, 0.6);
          border-radius: 50%;
          animation: scan-line 3s linear infinite;
        }
        
        @keyframes scan-line {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .drone-marker {
          filter: drop-shadow(0 0 8px rgba(211, 47, 47, 0.5));
        }
        
        .leaflet-popup-content-wrapper {
          background: #1a1a1a !important;
          border: 1px solid #333 !important;
          border-radius: 12px !important;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6) !important;
        }
        
        .leaflet-popup-tip { background: #1a1a1a !important; }
        
        .drone-popup-content {
          font-family: var(--font-mono);
          font-size: 11px;
          padding: 4px;
        }
        
        .popup-header {
          color: #D32F2F;
          font-weight: 700;
          font-size: 13px;
          margin-bottom: 6px;
          text-shadow: 0 0 8px rgba(211, 47, 47, 0.5);
        }
        
        .popup-row {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 2px;
        }
        
        .popup-row span:first-child { color: #666; }
        .popup-row span:last-child { color: #fff; }
        .popup-row .green { color: #00FF41; }
        
        .phc-popup {
          font-family: var(--font-sans);
          padding: 4px;
        }
        
        .phc-popup strong {
          display: block;
          margin-bottom: 4px;
          color: #fff;
        }
        
        .phc-popup .online {
          color: #00FF41;
          font-size: 11px;
        }
      `}</style>
    </motion.div>
  )
}
