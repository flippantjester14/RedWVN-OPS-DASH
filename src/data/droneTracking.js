// ─── Live Drone Tracking Service ───
// Resilient data fetching with retry, caching, and direct Supabase fallback
//
// Primary:  ngrok FMS backend → live MAVLink telemetry
// Fallback: Supabase REST API → drone config/metadata + alarms
// Cache:    Last successful fetch is cached in memory for stale-but-real data

const NGROK_URL = import.meta.env.VITE_TRACKING_API || 'https://tifany-uncalm-melani.ngrok-free.dev'

// Supabase direct access (bypasses ngrok entirely)
const SUPABASE_URL = 'https://iamhgkqkhbiupwjkvvml.supabase.co'
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

// ─── In-memory cache ───
let _cachedDrones = []
let _cachedTimestamp = null
let _cachedMetadata = null       // Supabase drone config
let _cachedAlarms = null         // Supabase alarms
let _consecutiveFailures = 0
const MAX_CACHE_AGE_MS = 5 * 60 * 1000  // 5 minutes max stale data

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

// ─── Supabase direct fetch helpers ───
async function supabaseFetch(table, query = '') {
    const url = `${SUPABASE_URL}/rest/v1/${table}?select=*${query}`
    const response = await fetch(url, {
        headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
        },
    })
    if (!response.ok) throw new Error(`Supabase ${table}: ${response.status}`)
    return response.json()
}

/**
 * Fetch drone metadata directly from Supabase (bypasses ngrok).
 * Returns setup_drones config + active alarms.
 */
export async function fetchDroneMetadata() {
    if (_cachedMetadata) return _cachedMetadata

    try {
        const [drones, alarms] = await Promise.all([
            supabaseFetch('setup_drones'),
            supabaseFetch('alarms', '&alarm=eq.true'),
        ])

        _cachedMetadata = {
            drones: drones || [],
            alarms: alarms || [],
        }

        // Refresh metadata cache every 2 minutes
        setTimeout(() => { _cachedMetadata = null }, 120000)

        return _cachedMetadata
    } catch (err) {
        console.warn('Supabase metadata fetch failed:', err.message)
        return { drones: [], alarms: [] }
    }
}

/**
 * Fetch with retry and timeout.
 */
async function fetchWithRetry(url, options = {}, retries = 2, timeoutMs = 8000) {
    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const controller = new AbortController()
            const timer = setTimeout(() => controller.abort(), timeoutMs)

            const response = await fetch(url, {
                ...options,
                signal: controller.signal,
            })
            clearTimeout(timer)

            if (!response.ok) throw new Error(`HTTP ${response.status}`)
            return response
        } catch (err) {
            if (attempt === retries) throw err
            // Wait briefly before retry (200ms, 500ms)
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
        // Supabase fields
        aircraftName: d.aircraft_name ?? d.drone_id,
        aircraftNo: d.aircraft_no ?? '',
        orderId: d.order_id ?? null,
        flightNo: d.flight_no ?? null,
        payloadWeight: d.payload_weight ?? null,
        takeoffLocation: d.takeoff_location ?? null,
        landingLocation: d.landing_location ?? null,
        lastReceived: d.last_received ?? null,
        // Cache metadata
        _fromCache: false,
    }
}

/**
 * Build drone entries from Supabase metadata when live API is down.
 * These won't have telemetry (lat/lon/speed) but will have drone names and alarm info.
 */
function buildDronesFromMetadata(metadata) {
    if (!metadata || !metadata.drones || metadata.drones.length === 0) return []

    const activeAlarms = new Map()
    if (metadata.alarms) {
        metadata.alarms.forEach(a => {
            if (!activeAlarms.has(a.drone_id)) activeAlarms.set(a.drone_id, [])
            activeAlarms.get(a.drone_id).push(a)
        })
    }

    return metadata.drones
        .filter(d => d.setup)
        .map(d => ({
            id: d.aircraft_name,
            sysid: d.SYSID_THISMAV,
            status: 'unknown',
            lat: null,
            lon: null,
            alt: 0,
            relativeAlt: 0,
            groundspeed: 0,
            airspeed: 0,
            heading: 0,
            climb: 0,
            roll: 0,
            pitch: 0,
            batteryRemaining: null,
            voltage: null,
            currentConsumed: null,
            temperature: null,
            timestamp: null,
            aircraftName: d.aircraft_name,
            aircraftNo: d.tail_no || '',
            orderId: null,
            flightNo: null,
            payloadWeight: null,
            takeoffLocation: null,
            landingLocation: null,
            lastReceived: null,
            _fromCache: false,
            _fromMetadata: true,
            _alarms: activeAlarms.get(d.aircraft_name) || [],
            _network: d.network,
            _cellCount: d.cell_count,
        }))
}

/**
 * Fetch live drone data with resilient retry + caching.
 *
 * Strategy:
 *  1. Try FMS backend via ngrok (with retry + timeout)
 *  2. On success → update cache, reset failure counter
 *  3. On failure → return cached data (marked as stale) if available
 *  4. If no cache → build minimal entries from Supabase metadata
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

    // 3. Fall back to Supabase metadata
    try {
        const metadata = await fetchDroneMetadata()
        const metaDrones = buildDronesFromMetadata(metadata)
        if (metaDrones.length > 0) {
            console.log(`[Tracking] Using Supabase metadata: ${metaDrones.length} drones`)
            return metaDrones
        }
    } catch (err) {
        console.warn('[Tracking] Supabase metadata fallback failed:', err.message)
    }

    // 4. Nothing available
    return []
}
