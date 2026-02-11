import { useEffect, useState, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline } from 'react-leaflet'
import L from 'leaflet'

const TAJANGI = [18.8234, 84.0012]
const SUNKARAMETTA = [18.7956, 83.9567]
const CENTER = [18.81, 83.978]

const droneIcon = L.divIcon({
  html: `<svg width="26" height="26" viewBox="0 0 26 26">
    <circle cx="13" cy="13" r="5" fill="#FF2080"/>
    <circle cx="13" cy="13" r="2" fill="white"/>
    <circle cx="6" cy="6" r="2.5" fill="#FF2080" opacity="0.5"/>
    <circle cx="20" cy="6" r="2.5" fill="#FF2080" opacity="0.5"/>
    <circle cx="6" cy="20" r="2.5" fill="#FF2080" opacity="0.5"/>
    <circle cx="20" cy="20" r="2.5" fill="#FF2080" opacity="0.5"/>
  </svg>`,
  className: '', iconSize: [26, 26], iconAnchor: [13, 13]
})

const nodeIcon = L.divIcon({
  html: `<div style="width:10px;height:10px;background:#00C853;border-radius:50%;border:2px solid white;box-shadow:0 1px 6px rgba(0,0,0,0.2)"></div>`,
  className: '', iconSize: [10, 10], iconAnchor: [5, 5]
})

function AnimatedDrone({ route, duration = 16000 }) {
  const [pos, setPos] = useState(route[0])
  const start = useRef(null)
  const raf = useRef(null)
  useEffect(() => {
    const tick = (t) => {
      if (!start.current) start.current = t
      const p = ((t - start.current) % (duration * 2)) / duration
      const f = p > 1 ? 2 - p : p
      setPos([
        route[0][0] + (route[1][0] - route[0][0]) * f,
        route[0][1] + (route[1][1] - route[0][1]) * f
      ])
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [route, duration])
  return <Marker position={pos} icon={droneIcon} />
}

export default function LiveMap() {
  const route = [TAJANGI, SUNKARAMETTA]
  return (
    <MapContainer center={CENTER} zoom={12} style={{ height: '100%', width: '100%', minHeight: 300, borderRadius: 0 }} zoomControl={true}>
      <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
      <Circle center={TAJANGI} radius={1500} pathOptions={{ color: '#3D5AFE', fillColor: '#3D5AFE', fillOpacity: 0.06, weight: 1.5, dashArray: '5,5' }} />
      <Circle center={SUNKARAMETTA} radius={1500} pathOptions={{ color: '#3D5AFE', fillColor: '#3D5AFE', fillOpacity: 0.06, weight: 1.5, dashArray: '5,5' }} />
      <Polyline positions={route} pathOptions={{ color: '#FF2080', weight: 2, opacity: 0.3, dashArray: '8,8' }} />
      <Marker position={TAJANGI} icon={nodeIcon}><Popup><strong>Tajangi PHC</strong></Popup></Marker>
      <Marker position={SUNKARAMETTA} icon={nodeIcon}><Popup><strong>Sunkarametta PHC</strong></Popup></Marker>
      <AnimatedDrone route={route} />
    </MapContainer>
  )
}
