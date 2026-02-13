// Google Sheet CSV URL
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1XCoyQfpEQeDmSUYDZdqrWA9KYKH7SFOoBRMXyNqVBm0/export?format=csv&gid=0'

import Papa from 'papaparse'

export async function fetchFlightData() {
    try {
        const response = await fetch(SHEET_URL)
        const csvText = await response.text()

        return new Promise((resolve) => {
            Papa.parse(csvText, {
                header: false, // Headers are messy/multi-line, safer to use index
                skipEmptyLines: true,
                complete: (results) => {
                    // Skip first 3 rows (headers)
                    const rows = results.data.slice(3)

                    const flights = rows.map(row => {
                        // Map CSV columns to our data structure
                        // 0: Date (DD-MM-YYYY)
                        // 1: UAV
                        // 2: Flight ID
                        // 3: Flight Type
                        // 4: Pilot Name
                        // 5: Take Off Location
                        // 6: Landing Location
                        // 7: Distance
                        // 8: Take Off Time (HHMM)
                        // 9: Landing Time (HHMM)
                        // 12: Duration (HH:MM)
                        // 13: Payload

                        // Validate: must have date in DD-MM-YYYY format and UAV id
                        if (!row[0] || !row[1] || !row[0].match(/^\d{2}-\d{2}-\d{4}$/)) return null

                        const formatTime = (t) => {
                            if (!t) return ''
                            // If length 3 (e.g. 900 -> 09:00), length 4 (1700 -> 17:00)
                            const s = t.toString().padStart(4, '0')
                            return `${s.slice(0, 2)}:${s.slice(2)}`
                        }

                        return {
                            date: row[0],
                            uav: row[1],
                            flightId: row[2],
                            type: row[3]?.includes('Live') ? 'Live' : 'Test',
                            pilot: row[4],
                            from: row[5],
                            to: row[6],
                            distance: parseFloat(row[7]) || 0,
                            takeoff: formatTime(row[8]),
                            landing: formatTime(row[9]),
                            duration: row[12] || '00:00',
                            payload: parseInt(row[13]) || 0,
                            // Derived / Mapped fields
                            fls: row[15] === 'Disable' ? 'Disable' : 'Use', // Simplification based on sample
                            precland: row[19]?.includes('On') ? 'On Marker' : (row[19]?.includes('Off') ? 'Off Marker' : 'N/A'),
                            lfao: row[23] || 'N/A',
                            version: row[16] || '',
                            // Extra
                            orderId: row[14] || '',
                            detAlt: row[20] ? parseInt(row[20]) : null,
                            landOff: row[21] ? parseFloat(row[21]) : null
                        }
                    }).filter(Boolean)

                    resolve(flights)
                },
                error: (err) => {
                    console.error('CSV Parse Error:', err)
                    resolve([])
                }
            })
        })
    } catch (error) {
        console.error('Fetch Error:', error)
        return []
    }
}

// ─── Analytics ───
export function computeMetrics(flights) {
    if (!flights || flights.length === 0) return {
        totalDistance: 0, totalFlights: 0, liveCount: 0, testCount: 0,
        uavCount: 0, uavs: [], pilotCount: 0, pilots: [],
        locations: [], locationCount: 0, totalMinutes: 0, totalPayloadKg: 0
    }

    const totalDistance = flights.reduce((s, f) => s + f.distance, 0)
    const totalFlights = flights.length
    const liveFlights = flights.filter(f => f.type === 'Live')
    const testFlights = flights.filter(f => f.type === 'Test')
    const uavs = [...new Set(flights.map(f => f.uav))]
    const pilots = [...new Set(flights.map(f => f.pilot))]
    const locations = [...new Set(flights.flatMap(f => [f.from, f.to]))]
    const totalMinutes = flights.reduce((s, f) => {
        if (!f.duration) return s
        const [h, m] = f.duration.split(':').map(Number)
        return s + (h || 0) * 60 + (m || 0)
    }, 0)
    const totalPayloadKg = flights.reduce((s, f) => s + f.payload, 0) / 1000

    return {
        totalDistance: Math.round(totalDistance),
        totalFlights,
        liveCount: liveFlights.length,
        testCount: testFlights.length,
        uavCount: uavs.length,
        uavs,
        pilotCount: pilots.length,
        pilots,
        locations,
        locationCount: locations.length,
        totalMinutes,
        totalPayloadKg: Math.round(totalPayloadKg * 100) / 100,
    }
}

export function getRouteStats(flights) {
    const routes = {}
    flights.filter(f => f.from !== f.to).forEach(f => {
        const key = `${f.from} → ${f.to}`
        if (!routes[key]) routes[key] = { route: key, count: 0, totalDist: 0, avgDuration: 0, durations: [] }
        routes[key].count++
        routes[key].totalDist += f.distance
        if (f.duration) {
            const [h, m] = f.duration.split(':').map(Number)
            routes[key].durations.push((h || 0) * 60 + (m || 0))
        }
    })
    return Object.values(routes).map(r => ({
        ...r,
        avgDuration: r.durations.length ? Math.round(r.durations.reduce((a, b) => a + b, 0) / r.durations.length) : 0,
        totalDist: Math.round(r.totalDist),
    })).sort((a, b) => b.count - a.count)
}

export function getPilotStats(flights) {
    const pilots = {}
    flights.forEach(f => {
        if (!pilots[f.pilot]) pilots[f.pilot] = { name: f.pilot, flights: 0, live: 0, test: 0, distance: 0, minutes: 0 }
        pilots[f.pilot].flights++
        if (f.type === 'Live') pilots[f.pilot].live++
        else pilots[f.pilot].test++
        pilots[f.pilot].distance += f.distance
        if (f.duration) {
            const [h, m] = f.duration.split(':').map(Number)
            pilots[f.pilot].minutes += (h || 0) * 60 + (m || 0)
        }
    })
    return Object.values(pilots).sort((a, b) => b.flights - a.flights)
}

export function getUAVStats(flights) {
    const uavs = {}
    flights.forEach(f => {
        if (!uavs[f.uav]) uavs[f.uav] = { id: f.uav, flights: 0, live: 0, test: 0, distance: 0, minutes: 0, payload: 0 }
        uavs[f.uav].flights++
        if (f.type === 'Live') uavs[f.uav].live++
        else uavs[f.uav].test++
        uavs[f.uav].distance += f.distance
        uavs[f.uav].payload += f.payload
        if (f.duration) {
            const [h, m] = f.duration.split(':').map(Number)
            uavs[f.uav].minutes += (h || 0) * 60 + (m || 0)
        }
    })
    return Object.values(uavs)
}

export function getDailyStats(flights) {
    const days = {}
    flights.forEach(f => {
        if (!days[f.date]) days[f.date] = { date: f.date, flights: 0, distance: 0, live: 0, test: 0 }
        days[f.date].flights++
        days[f.date].distance += f.distance
        if (f.type === 'Live') days[f.date].live++
        else days[f.date].test++
    })
    return Object.values(days).sort((a, b) => {
        const [da, ma, ya] = a.date.split('-').map(Number)
        const [db, mb, yb] = b.date.split('-').map(Number)
        return new Date(ya, ma - 1, da) - new Date(yb, mb - 1, db)
    })
}

export function getNodeStats(flights) {
    const nodes = {}
    flights.forEach(f => {
        ;[f.from, f.to].forEach(loc => {
            if (!nodes[loc]) nodes[loc] = { name: loc, totalFlights: 0, takeoffs: 0, landings: 0, deliveries: 0 }
            nodes[loc].totalFlights++
        })
        nodes[f.from].takeoffs++
        nodes[f.to].landings++
        if (f.type === 'Live') nodes[f.to].deliveries++
    })
    return Object.values(nodes).sort((a, b) => b.totalFlights - a.totalFlights)
}

// Helper to filter flights by time period
export function filterFlightsByPeriod(flights, period) {
    if (!flights) return []
    if (period === 'all') return [...flights]

    const parseDate = (dStr) => {
        if (!dStr) return null
        const [d, m, y] = dStr.split('-').map(Number)
        return new Date(y, m - 1, d)
    }

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    // Get Monday of the current week (Mon=1, Sun=0 → shift Sun to 7)
    const dayOfWeek = now.getDay() || 7 // Sun=0 becomes 7
    const monday = new Date(today)
    monday.setDate(today.getDate() - (dayOfWeek - 1))

    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6)

    return flights.filter(f => {
        const d = parseDate(f.date)
        if (!d) return false

        if (period === 'daily') {
            return d.getTime() === today.getTime()
        }
        if (period === 'weekly') {
            return d >= monday && d <= sunday
        }
        return true
    })
}

// Medical Ops Stats
export function getMedicalOpsStats(flights) {
    if (!flights || flights.length === 0) return {
        deliveries: [],
        totalDeliveries: 0,
        totalPayloadG: 0,
        totalPayloadKg: 0,
        routes: [],
        daily: []
    }

    const medFlights = flights.filter(f => f.orderId && f.orderId.trim())
    const totalPayloadG = medFlights.reduce((s, f) => s + f.payload, 0)

    // Route breakdown
    const routeMap = {}
    // Daily breakdown for charts
    const dayMap = {}

    medFlights.forEach(f => {
        // Route stats
        const rKey = `${f.from} → ${f.to}`
        if (!routeMap[rKey]) routeMap[rKey] = { route: rKey, count: 0, payload: 0 }
        routeMap[rKey].count++
        routeMap[rKey].payload += f.payload

        // Daily stats
        if (!dayMap[f.date]) dayMap[f.date] = { date: f.date, count: 0, payload: 0 }
        dayMap[f.date].count++
        dayMap[f.date].payload += f.payload
    })

    const daily = Object.values(dayMap).sort((a, b) => {
        const [da, ma, ya] = a.date.split('-').map(Number)
        const [db, mb, yb] = b.date.split('-').map(Number)
        return new Date(ya, ma - 1, da) - new Date(yb, mb - 1, db)
    })

    return {
        deliveries: medFlights,
        totalDeliveries: medFlights.length,
        totalPayloadG,
        totalPayloadKg: Math.round(totalPayloadG / 10) / 100,
        routes: Object.values(routeMap).sort((a, b) => b.count - a.count),
        daily
    }
}
