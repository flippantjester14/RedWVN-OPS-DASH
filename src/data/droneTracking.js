// ─── Live Drone Tracking Service ───
// Fetches real-time drone data from the Redwing tracking backend

const TRACKING_API = 'http://100.102.218.97:8061'

// ─── Node/Hub Locations (Paderu–Araku Corridor, AP) ───
export const NODE_LOCATIONS = [
    { name: 'Paderu', lat: 18.0735, lng: 82.5704, type: 'hub', label: 'HUB' },
    { name: 'Araku Valley', lat: 18.3273, lng: 82.8756, type: 'node', label: 'Node' },
    { name: 'Chintapalli', lat: 17.8529, lng: 82.3519, type: 'node', label: 'Node' },
    { name: 'Munchingiputtu', lat: 17.9940, lng: 82.6070, type: 'node', label: 'Node' },
    { name: 'Lothugedda', lat: 18.1080, lng: 82.5180, type: 'node', label: 'Node' },
    { name: 'Sunkarametta', lat: 18.1437, lng: 82.6174, type: 'node', label: 'Node' },
    { name: 'Bheemavaram', lat: 18.0200, lng: 82.5400, type: 'node', label: 'Node' },
    { name: 'Tajangi', lat: 18.2100, lng: 82.7100, type: 'node', label: 'Node' },
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
 * Fetch live drone data from the tracking backend.
 * Returns an array of drone objects with normalized fields.
 */
export async function fetchLiveDrones() {
    try {
        const response = await fetch(`${TRACKING_API}/get_supabase_data`)
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
