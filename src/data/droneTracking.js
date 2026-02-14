// ─── Live Drone Tracking Service ───
// Fetches real-time drone data from the Redwing FMS backend
//
// DEV:  Vite proxy → /tracking-api/* → ngrok URL (bypasses CORS + interstitial)
// PROD: Vercel serverless function → /api/tracking (same bypass)
// To change the ngrok URL, edit VITE_TRACKING_API in .env

const NGROK_URL = import.meta.env.VITE_TRACKING_API || 'https://tifany-uncalm-melani.ngrok-free.dev'

// Supabase anon key — used by the FMS backend for auth
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhbWhna3FraGJpdXB3amt2dm1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5ODI2OTgsImV4cCI6MjA3MDU1ODY5OH0.EAv2d5ekddn_So4hkqVqotnc4o9rVrGmlVdiTqS2AbM'

// In dev → Vite proxy; in prod → Vercel serverless function; fallback → direct
function getApiUrl(path) {
    if (import.meta.env.DEV) return `/tracking-api${path}`
    return `/api/tracking?path=${encodeURIComponent(path)}`
}

// ─── Node/Hub Locations (Paderu–Araku Corridor, AP) — verified coords ───
export const NODE_LOCATIONS = [
    { name: 'Paderu', lat: 18.0833, lng: 82.6670, type: 'hub', label: 'HUB' },
    { name: 'Araku Valley', lat: 18.3273, lng: 82.8756, type: 'node', label: 'Node' },
    { name: 'Chintapalli', lat: 17.8707, lng: 82.3518, type: 'node', label: 'Node' },
    { name: 'Munchingiputtu', lat: 18.3663, lng: 82.5086, type: 'node', label: 'Node' },
    { name: 'Lothugedda', lat: 17.9622, lng: 82.3942, type: 'node', label: 'Node' },
    { name: 'Sunkarametta', lat: 18.2783, lng: 82.9675, type: 'node', label: 'Node' },
    { name: 'Bheemavaram', lat: 18.0480, lng: 82.7390, type: 'node', label: 'Node' },
    { name: 'Tajangi', lat: 17.8709, lng: 82.4942, type: 'node', label: 'Node' },
]

// Status mapping from API values to display
export const STATUS_MAP = {
    flying: { label: 'FLYING', color: 'var(--green)', colorHex: '#00C853', cssClass: 'green' },
    on_ground: { label: 'ON GROUND', color: 'var(--blue)', colorHex: '#0694A2', cssClass: 'blue' },
    disconnected: { label: 'DISCONNECTED', color: 'var(--amber)', colorHex: '#D03801', cssClass: 'amber' },
    powered_off: { label: 'POWERED OFF', color: 'var(--text-3)', colorHex: '#374151', cssClass: 'grey' },
    unknown: { label: 'UNKNOWN', color: 'var(--text-3)', colorHex: '#9CA3AF', cssClass: 'grey' },
}

export function getStatusInfo(status) {
    return STATUS_MAP[status] || STATUS_MAP.unknown
}

/**
 * Fetch live drone data from the Redwing FMS backend.
 * Returns an array of drone objects with normalized fields.
 */
export async function fetchLiveDrones() {
    try {
        const response = await fetch(getApiUrl('/get_supabase_data'), {
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true',
            },
        })
        if (!response.ok) {
            console.warn('Drone tracking API error:', response.status)
            return []
        }

        const data = await response.json()
        if (!data || JSON.stringify(data) === '{}') return []

        // API returns an array of drone records
        const drones = Array.isArray(data) ? data : Object.values(data)

        return drones
            .filter(d => d.drone_id)
            .map(d => ({
                id: d.drone_id,
                sysid: d.sysid,
                status: d.status || 'unknown',
                lat: d.lat ?? null,
                lon: d.lon ?? null,
                alt: d.alt ?? 0,
                relativeAlt: d.relative_alt ? d.relative_alt / 1000 : 0,
                groundspeed: d.groundspeed ?? 0,
                airspeed: d.airspeed ?? 0,
                heading: d.hdg ?? d.heading ?? 0,
                climb: d.climb ?? 0,
                roll: d.roll ?? 0,
                pitch: d.pitch ?? 0,
                batteryRemaining: d.battery_remaining ?? null,
                voltage: d.processed_voltage ?? d.voltage ?? null,
                currentConsumed: d.current_consumed ?? null,
                temperature: d.system_temperature ?? null,
                timestamp: d.timestamp ?? null,
                // Supabase fields
                aircraftName: d.aircraft_name ?? d.drone_id,
                aircraftNo: d.aircraft_no ?? '',
                orderId: d.order_id ?? null,
                flightNo: d.flight_no ?? null,
                payloadWeight: d.payload_weight ?? null,
                takeoffLocation: d.takeoff_location ?? null,
                landingLocation: d.landing_location ?? null,
                lastReceived: d.last_received ?? null,
            }))
    } catch (error) {
        console.warn('Failed to fetch live drones:', error.message)
        return []
    }
}
