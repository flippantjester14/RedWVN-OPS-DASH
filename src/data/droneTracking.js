// ─── Live Drone Tracking Service ───
// Resilient data fetching with retry + caching
//
// Primary:  ngrok FMS backend → live MAVLink telemetry
// Fallback: Cached last-known data (up to 5 min)
// Final:    Empty array → App.jsx shows UAV stats from Google Sheet flight logs

const NGROK_URL = import.meta.env.VITE_TRACKING_API || 'https://tifany-uncalm-melani.ngrok-free.dev'

// In dev → Vite proxy; in prod → Vercel serverless function
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

// ─── In-memory cache ───
let _cachedDrones = []
let _cachedTimestamp = null
let _consecutiveFailures = 0
const MAX_CACHE_AGE_MS = 5 * 60 * 1000  // 5 min max stale

/**
 * Get cache status info for UI display
 */
export function getCacheStatus() {
    if (!_cachedTimestamp) return { isStale: false, isCached: false, age: 0, failCount: 0 }
    const age = Date.now() - _cachedTimestamp
    return {
        isStale: _consecutiveFailures > 0,
        isCached: _cachedDrones.length > 0,
        age,
        ageText: formatAge(age),
        failCount: _consecutiveFailures,
        lastSuccess: _cachedTimestamp ? new Date(_cachedTimestamp) : null,
    }
}

function formatAge(ms) {
    const sec = Math.floor(ms / 1000)
    if (sec < 60) return `${sec}s ago`
    const min = Math.floor(sec / 60)
    if (min < 60) return `${min}m ago`
    return `${Math.floor(min / 60)}h ${min % 60}m ago`
}

/**
 * Fetch with retry and timeout.
 */
async function fetchWithRetry(url, options = {}, retries = 2, timeoutMs = 8000) {
    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const controller = new AbortController()
            const timer = setTimeout(() => controller.abort(), timeoutMs)
            const response = await fetch(url, { ...options, signal: controller.signal })
            clearTimeout(timer)
            if (!response.ok) throw new Error(`HTTP ${response.status}`)
            return response
        } catch (err) {
            if (attempt === retries) throw err
            await new Promise(r => setTimeout(r, (attempt + 1) * 250))
        }
    }
}

/**
 * Normalize a drone record from the FMS API into our standard format.
 */
function normalizeDrone(d) {
    return {
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
        aircraftName: d.aircraft_name ?? d.drone_id,
        aircraftNo: d.aircraft_no ?? '',
        orderId: d.order_id ?? null,
        flightNo: d.flight_no ?? null,
        payloadWeight: d.payload_weight ?? null,
        takeoffLocation: d.takeoff_location ?? null,
        landingLocation: d.landing_location ?? null,
        lastReceived: d.last_received ?? null,
        _fromCache: false,
    }
}

/**
 * Fetch live drone data with resilient retry + caching.
 *
 * Strategy:
 *  1. Try FMS backend via ngrok (with retry + timeout)
 *  2. On success → update cache, reset failure counter
 *  3. On failure → return cached data (marked as stale) if < 5 min old
 *  4. If no cache → return [] (App.jsx falls back to UAV stats from Google Sheet)
 */
export async function fetchLiveDrones() {
    // 1. Try FMS backend
    try {
        const response = await fetchWithRetry(getApiUrl('/get_supabase_data'), {
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true',
            },
        })

        const data = await response.json()
        if (!data || JSON.stringify(data) === '{}') {
            throw new Error('Empty response from FMS')
        }

        // Success — normalize and cache
        const drones = Array.isArray(data) ? data : Object.values(data)
        const normalized = drones.filter(d => d.drone_id).map(normalizeDrone)

        if (normalized.length > 0) {
            _cachedDrones = normalized
            _cachedTimestamp = Date.now()
            _consecutiveFailures = 0
            console.log(`[Tracking] Live data: ${normalized.length} drones`)
        }

        return normalized
    } catch (err) {
        _consecutiveFailures++
        console.warn(`[Tracking] FMS fetch failed (attempt #${_consecutiveFailures}):`, err.message)
    }

    // 2. Return cached data if still fresh enough
    if (_cachedDrones.length > 0 && _cachedTimestamp) {
        const age = Date.now() - _cachedTimestamp
        if (age < MAX_CACHE_AGE_MS) {
            console.log(`[Tracking] Using cached data (${formatAge(age)}, ${_cachedDrones.length} drones)`)
            return _cachedDrones.map(d => ({ ...d, _fromCache: true }))
        }
        console.log(`[Tracking] Cache expired (${formatAge(age)})`)
    }

    // 3. No live data — App.jsx falls back to UAV stats from the Google Sheet
    return []
}
