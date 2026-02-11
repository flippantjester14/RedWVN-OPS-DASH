// Complete flight data from Redwing spreadsheet — ALL rows
export const FLIGHT_DATA = [
    { date: '08-11-2025', uav: 'AS04', flightId: 'ATOL', type: 'Test', pilot: 'Mohan Kumar', from: 'Paderu', to: 'Paderu', distance: 0, takeoff: '17:00', landing: '17:02', duration: '00:02', payload: 0, fls: 'Disable', precland: 'On Marker', lfao: 'Disable', version: 'V 2.0' },
    { date: '08-11-2025', uav: 'AS04', flightId: 'ATOL', type: 'Test', pilot: 'Mohan Kumar', from: 'Paderu', to: 'Paderu', distance: 0, takeoff: '17:05', landing: '17:07', duration: '00:02', payload: 0, fls: 'Disable', precland: 'On Marker', lfao: 'Disable', version: 'V 2.0' },
    { date: '08-11-2025', uav: 'AS04', flightId: 'ATOL', type: 'Test', pilot: 'Mohan Kumar', from: 'Paderu', to: 'Paderu', distance: 0, takeoff: '17:11', landing: '17:13', duration: '00:02', payload: 0, fls: 'Disable', precland: 'On Marker', lfao: 'Disable', version: 'V 2.0' },
    { date: '11-11-2025', uav: 'AS04', flightId: 'ATOL', type: 'Test', pilot: 'Ankush Kavir', from: 'Paderu', to: 'Paderu', distance: 0, takeoff: '14:42', landing: '14:44', duration: '00:02', payload: 0, fls: 'Disable', precland: 'On Marker', lfao: 'Disable', version: 'V 2.0' },
    { date: '11-11-2025', uav: 'AS04', flightId: 'AP01TF01L01', type: 'Test', pilot: 'Mohan Kumar', from: 'Paderu', to: 'Paderu', distance: 19.6, takeoff: '15:10', landing: '15:25', duration: '00:15', payload: 350, fls: 'Disable', precland: 'On Marker', lfao: 'Disable', version: 'V 2.0' },
    { date: '11-11-2025', uav: 'AS04', flightId: 'AP01TF02L01', type: 'Test', pilot: 'Mohan Kumar', from: 'Paderu', to: 'Paderu', distance: 19.6, takeoff: '15:45', landing: '16:00', duration: '00:15', payload: 2000, fls: 'Disable', precland: 'On Marker', lfao: 'Disable', version: 'V 2.0' },
    { date: '11-11-2025', uav: 'AS04', flightId: 'AP01TF03L01', type: 'Test', pilot: 'Mohan Kumar', from: 'Paderu', to: 'Paderu', distance: 10.6, takeoff: '16:45', landing: '16:54', duration: '00:09', payload: 2000, fls: 'Disable', precland: 'On Marker', lfao: 'Disable', version: 'V 2.0' },
    { date: '12-11-2025', uav: 'AS05', flightId: 'ATOL', type: 'Test', pilot: 'Ankush Kavir', from: 'Paderu', to: 'Paderu', distance: 0, takeoff: '15:28', landing: '15:30', duration: '00:02', payload: 0, fls: 'Disable', precland: 'On Marker', lfao: 'Didn\'t Test', version: 'V 2.0' },
    { date: '12-11-2025', uav: 'AS05', flightId: 'ATOL', type: 'Test', pilot: 'Ankush Kavir', from: 'Paderu', to: 'Paderu', distance: 0, takeoff: '15:38', landing: '15:40', duration: '00:02', payload: 1950, fls: 'Disable', precland: 'On Marker', lfao: 'Didn\'t Test', version: 'V 2.0' },
    { date: '12-11-2025', uav: 'AS05', flightId: 'AP01TF04L01', type: 'Test', pilot: 'Krupa Sagar', from: 'Paderu', to: 'Paderu', distance: 38.1, takeoff: '16:11', landing: '16:38', duration: '00:27', payload: 1950, fls: 'Disable', precland: 'On Marker', lfao: 'Worked', version: 'V 2.0' },
    { date: '13-11-2025', uav: 'AS04', flightId: 'AP01TF05L01', type: 'Test', pilot: 'Mohan Kumar', from: 'Paderu', to: 'Tajangi', distance: 38.6, takeoff: '14:05', landing: '14:33', duration: '00:28', payload: 1950, fls: 'Disable', precland: 'On Marker', lfao: 'Worked', version: 'V 2.0' },
    { date: '13-11-2025', uav: 'AS04', flightId: 'AP01TF05L02', type: 'Test', pilot: 'Krupa Sagar', from: 'Tajangi', to: 'Paderu', distance: 36.1, takeoff: '15:36', landing: '16:02', duration: '00:26', payload: 1950, fls: 'Disable', precland: 'On Marker', lfao: 'Worked', version: 'V 2.0' },
    { date: '22-11-2025', uav: 'AS04', flightId: 'ATOL', type: 'Test', pilot: 'Mohan Kumar', from: 'Paderu', to: 'Paderu', distance: 0, takeoff: '13:19', landing: '13:21', duration: '00:02', payload: 0, fls: 'Disable', precland: 'On Marker', detAlt: 33, lfao: 'Didn\'t Test', version: 'V 2.0' },
    { date: '22-11-2025', uav: 'AS04', flightId: 'ATOL', type: 'Test', pilot: 'Krupa Sagar', from: 'Paderu', to: 'Paderu', distance: 0, takeoff: '13:26', landing: '13:28', duration: '00:02', payload: 0, fls: 'Disable', precland: 'On Marker', detAlt: 30, lfao: 'Didn\'t Test', version: 'V 2.0' },
    { date: '22-11-2025', uav: 'AS04', flightId: 'AP01TF06L01', type: 'Test', pilot: 'Mohan Kumar', from: 'Paderu', to: 'Paderu', distance: 19, takeoff: '13:53', landing: '14:08', duration: '00:15', payload: 350, fls: 'Disable', precland: 'Off Marker', detAlt: 35, lfao: 'Didn\'t Test', version: 'V 2.0' },
    { date: '22-11-2025', uav: 'AS04', flightId: 'AP01TF07L01', type: 'Test', pilot: 'Krupa Sagar', from: 'Paderu', to: 'Paderu', distance: 10, takeoff: '14:25', landing: '14:38', duration: '00:13', payload: 350, fls: 'Disable', precland: 'On Marker', detAlt: 34, lfao: 'Didn\'t Test', version: 'V 2.0' },
    { date: '23-11-2025', uav: 'AS04', flightId: 'AP01TF08L01', type: 'Test', pilot: 'Mohan Kumar', from: 'Paderu', to: 'Chintapalli', distance: 48.2, takeoff: '12:21', landing: '12:57', duration: '00:36', payload: 350, fls: 'Disable', precland: 'Off Marker', lfao: 'Partially Worked', version: 'V 2.0' },
    { date: '23-11-2025', uav: 'AS04', flightId: 'AP01TF08L02', type: 'Test', pilot: 'Krupa Sagar', from: 'Chintapalli', to: 'Paderu', distance: 45.8, takeoff: '13:49', landing: '14:20', duration: '00:31', payload: 350, fls: 'Disable', precland: 'On Marker', detAlt: 34, lfao: 'Worked', version: 'V 2.0' },
    { date: '23-11-2025', uav: 'AS04', flightId: 'AP01TF09L01', type: 'Test', pilot: 'Mohan Kumar', from: 'Paderu', to: 'Chintapalli', distance: 48.2, takeoff: '15:14', landing: '15:50', duration: '00:36', payload: 1950, fls: 'Disable', precland: 'On Marker', lfao: 'Partially Worked', version: 'V 2.0' },
    { date: '23-11-2025', uav: 'AS04', flightId: 'AP01TF09L02', type: 'Test', pilot: 'Krupa Sagar', from: 'Chintapalli', to: 'Paderu', distance: 45.8, takeoff: '16:25', landing: '16:56', duration: '00:31', payload: 1950, fls: 'Disable', precland: 'On Marker', detAlt: 35, lfao: 'Worked', version: 'V 2.0' },
    { date: '24-11-2025', uav: 'AS04', flightId: 'AP01TF10L01', type: 'Test', pilot: 'Mohan Kumar', from: 'Paderu', to: 'Araku Valley', distance: 34.7, takeoff: '15:15', landing: '15:42', duration: '00:27', payload: 1950, fls: 'Disable', precland: 'On Marker', lfao: 'Worked', version: 'V 2.0' },
    { date: '24-11-2025', uav: 'AS04', flightId: 'AP01TF10L02', type: 'Test', pilot: 'Krupa Sagar', from: 'Araku Valley', to: 'Paderu', distance: 37.7, takeoff: '16:16', landing: '16:42', duration: '00:26', payload: 1950, fls: 'Disable', precland: 'On Marker', lfao: 'Partially Worked', version: 'V 2.0' },
    { date: '25-11-2025', uav: 'AS04', flightId: 'AP01TF11L01', type: 'Test', pilot: 'Mohan Kumar', from: 'Paderu', to: 'Munchingiputtu', distance: 37, takeoff: '12:46', landing: '13:14', duration: '00:28', payload: 1450, fls: 'Disable', precland: 'On Marker', lfao: 'Partially Worked', version: 'V 2.0' },
    { date: '25-11-2025', uav: 'AS04', flightId: 'AP01TF11L02', type: 'Test', pilot: 'Ankush Kavir', from: 'Munchingiputtu', to: 'Paderu', distance: 40.2, takeoff: '13:51', landing: '14:18', duration: '00:27', payload: 1800, fls: 'Disable', precland: 'On Marker', lfao: 'Worked', version: 'V 2.0' },
    { date: '27-11-2025', uav: 'AS04', flightId: 'AP01TF12L01', type: 'Test', pilot: 'Mohan Kumar', from: 'Paderu', to: 'Sunkarametta', distance: 37.3, takeoff: '13:37', landing: '14:05', duration: '00:28', payload: 1450, fls: 'Disable', precland: 'On Marker', lfao: 'Worked', version: 'V 2.0' },
    { date: '27-11-2025', uav: 'AS04', flightId: 'AP01TF12L02', type: 'Test', pilot: 'Ankush Kavir', from: 'Sunkarametta', to: 'Paderu', distance: 40.5, takeoff: '14:36', landing: '15:06', duration: '00:30', payload: 1800, fls: 'Disable', precland: 'On Marker', detAlt: 34, landOff: 0.28, lfao: 'Partially Worked', version: 'V 2.0' },
    { date: '29-11-2025', uav: 'AS04', flightId: 'AP01TF13L01', type: 'Test', pilot: 'Mohan Kumar', from: 'Paderu', to: 'Lothugedda', distance: 36.2, takeoff: '12:21', landing: '12:48', duration: '00:27', payload: 300, fls: 'Disable', precland: 'Off Marker', detAlt: 41, lfao: 'Partially Worked', version: 'V 2.0' },
    { date: '29-11-2025', uav: 'AS04', flightId: 'AP01TF13L02', type: 'Test', pilot: 'Krupa Sagar', from: 'Lothugedda', to: 'Paderu', distance: 36.8, takeoff: '13:20', landing: '13:49', duration: '00:29', payload: 300, fls: 'Disable', precland: 'On Marker', detAlt: 34, landOff: 0.55, lfao: 'Worked', version: 'V 2.0' },
    { date: '02-12-2025', uav: 'AS04', flightId: 'AP01TF14L01', type: 'Test', pilot: 'Mohan Kumar', from: 'Paderu', to: 'Bheemavaram', distance: 58.8, takeoff: '11:13', landing: '11:57', duration: '00:44', payload: 300, fls: 'Disable', precland: 'Off Marker', lfao: 'Partially Worked', version: 'V 2.0' },
    { date: '02-12-2025', uav: 'AS04', flightId: 'AP01TF14L02', type: 'Test', pilot: 'Ankush Kavir', from: 'Bheemavaram', to: 'Paderu', distance: 58.9, takeoff: '12:35', landing: '13:15', duration: '00:40', payload: 300, fls: 'Disable', precland: 'On Marker', detAlt: 34, landOff: 0.5, lfao: 'Worked', version: 'V 2.0' },
    { date: '05-12-2025', uav: 'AS04', flightId: 'AP01LF15L01', type: 'Live', pilot: 'Krupa Sagar', from: 'Paderu', to: 'Araku Valley', distance: 34.7, takeoff: '11:12', landing: '11:38', duration: '00:26', payload: 0, fls: 'Use', precland: 'On Marker', lfao: 'Worked', version: 'V 2.0' },
    { date: '05-12-2025', uav: 'AS04', flightId: 'AP01LF15L02', type: 'Live', pilot: 'Mohan Kumar', from: 'Araku Valley', to: 'Paderu', distance: 37.7, takeoff: '12:03', landing: '12:29', duration: '00:26', payload: 0, fls: 'Use', precland: 'Off Marker', detAlt: 45, landOff: 1.3, lfao: 'Partially Worked', version: 'V 2.0' },
    { date: '05-12-2025', uav: 'AS04', flightId: 'AP01LF16L01', type: 'Live', pilot: 'Ankush Kavir', from: 'Paderu', to: 'Araku Valley', distance: 34.7, takeoff: '12:58', landing: '13:24', duration: '00:26', payload: 0, fls: 'Use', precland: 'On Marker', lfao: 'Worked', version: 'V 2.0' },
    { date: '05-12-2025', uav: 'AS04', flightId: 'AP01LF16L02', type: 'Live', pilot: 'Mohan Kumar', from: 'Araku Valley', to: 'Paderu', distance: 37.7, takeoff: '13:55', landing: '14:20', duration: '00:25', payload: 0, fls: 'Use', precland: 'Off Marker', detAlt: 43, landOff: 1.1, lfao: 'Partially Worked', version: 'V 2.0' },
    { date: '05-12-2025', uav: 'AS04', flightId: 'AP01LF17L01', type: 'Live', pilot: 'Krupa Sagar', from: 'Paderu', to: 'Araku Valley', distance: 34.7, takeoff: '15:19', landing: '15:44', duration: '00:25', payload: 1950, fls: 'Use', precland: 'On Marker', lfao: 'Worked', version: 'V 2.0' },
    { date: '05-12-2025', uav: 'AS04', flightId: 'AP01LF17L02', type: 'Live', pilot: 'Mohan Kumar', from: 'Araku Valley', to: 'Paderu', distance: 37.7, takeoff: '16:06', landing: '16:33', duration: '00:27', payload: 1950, fls: 'Use', precland: 'On Marker', detAlt: 44, landOff: 0.9, lfao: 'Partially Worked', version: 'V 2.0' },
    { date: '06-12-2025', uav: 'AS05', flightId: 'AP01LF18L01', type: 'Live', pilot: 'Ankush Kavir', from: 'Paderu', to: 'Araku Valley', distance: 34.7, takeoff: '11:41', landing: '12:07', duration: '00:26', payload: 0, fls: 'Use', precland: 'Off Marker', landOff: 0.8, lfao: 'Worked', version: 'V 2.0' },
    { date: '06-12-2025', uav: 'AS05', flightId: 'AP01LF18L02', type: 'Live', pilot: 'Mohan Kumar', from: 'Araku Valley', to: 'Paderu', distance: 37.7, takeoff: '12:26', landing: '12:52', duration: '00:26', payload: 0, fls: 'Use', precland: 'Off Marker', landOff: 1.2, lfao: 'Partially Worked', version: 'V 2.0' },
    { date: '06-12-2025', uav: 'AS05', flightId: 'AP01LF19L01', type: 'Live', pilot: 'Krupa Sagar', from: 'Paderu', to: 'Araku Valley', distance: 34.7, takeoff: '13:08', landing: '13:34', duration: '00:26', payload: 0, fls: 'Use', precland: 'On Marker', lfao: 'Worked', version: 'V 2.0' },
    { date: '06-12-2025', uav: 'AS05', flightId: 'AP01LF19L02', type: 'Live', pilot: 'Mohan Kumar', from: 'Araku Valley', to: 'Paderu', distance: 37.7, takeoff: '13:49', landing: '14:15', duration: '00:26', payload: 0, fls: 'Use', precland: 'Off Marker', lfao: 'Partially Worked', version: 'V 2.0' },
    { date: '06-12-2025', uav: 'AS05', flightId: 'AP01LF20L01', type: 'Live', pilot: 'Ankush Kavir', from: 'Paderu', to: 'Araku Valley', distance: 34.7, takeoff: '15:15', landing: '15:41', duration: '00:26', payload: 1950, fls: 'Use', precland: 'On Marker', lfao: 'Worked', version: 'V 2.0', remarks: 'Servo jam during FLS check — motors armed briefly then disarmed. Reboot fixed.' },
    { date: '06-12-2025', uav: 'AS05', flightId: 'AP01LF20L02', type: 'Live', pilot: 'Mohan Kumar', from: 'Araku Valley', to: 'Paderu', distance: 37.7, takeoff: '15:55', landing: '16:21', duration: '00:26', payload: 1950, fls: 'Use', precland: 'Off Marker', lfao: 'Partially Worked', version: 'V 2.0' },
    { date: '08-12-2025', uav: 'AS05', flightId: 'AP01LF21L01', type: 'Live', pilot: 'Mohan Kumar', from: 'Paderu', to: 'Araku Valley', distance: 34.7, takeoff: '11:28', landing: '11:54', duration: '00:26', payload: 0, fls: 'Use', precland: 'On Marker', lfao: 'Worked', version: 'V 2.0' },
    { date: '08-12-2025', uav: 'AS05', flightId: 'AP01LF21L02', type: 'Live', pilot: 'Krupa Sagar', from: 'Araku Valley', to: 'Paderu', distance: 37.7, takeoff: '12:10', landing: '12:36', duration: '00:26', payload: 0, fls: 'Use', precland: 'Off Marker', detAlt: 43, landOff: 1.4, lfao: 'Partially Worked', version: 'V 2.0' },
    { date: '08-12-2025', uav: 'AS05', flightId: 'AP01LF22L01', type: 'Live', pilot: 'Mohan Kumar', from: 'Paderu', to: 'Araku Valley', distance: 34.7, takeoff: '12:57', landing: '13:22', duration: '00:25', payload: 1950, fls: 'Use', precland: 'On Marker', lfao: 'Worked', version: 'V 2.0' },
    { date: '08-12-2025', uav: 'AS05', flightId: 'AP01LF22L02', type: 'Live', pilot: 'Krupa Sagar', from: 'Araku Valley', to: 'Paderu', distance: 37.7, takeoff: '13:40', landing: '14:06', duration: '00:26', payload: 1950, fls: 'Use', precland: 'Off Marker', detAlt: 44, landOff: 1.6, lfao: 'Partially Worked', version: 'V 2.0' },
    { date: '08-12-2025', uav: 'AS05', flightId: 'AP01LF23L01', type: 'Live', pilot: 'Mohan Kumar', from: 'Paderu', to: 'Araku Valley', distance: 34.7, takeoff: '16:17', landing: '16:42', duration: '00:25', payload: 1950, fls: 'Use', precland: 'On Marker', lfao: 'Worked', version: 'V 2.0' },
    { date: '08-12-2025', uav: 'AS05', flightId: 'AP01LF23L02', type: 'Live', pilot: 'Krupa Sagar', from: 'Araku Valley', to: 'Paderu', distance: 37.7, takeoff: '16:57', landing: '17:24', duration: '00:27', payload: 1950, fls: 'Use', precland: 'Off Marker', detAlt: 44, landOff: 1.5, lfao: 'Partially Worked', version: 'V 2.0' },
    { date: '09-12-2025', uav: 'AS04', flightId: 'AP01LF24L01', type: 'Live', pilot: 'Mohan Kumar', from: 'Paderu', to: 'Araku Valley', distance: 34.7, takeoff: '10:52', landing: '11:22', duration: '00:30', payload: 1450, fls: 'Use', precland: 'On Marker', detAlt: 26, lfao: 'Worked', version: 'V 2.0' },
    { date: '09-12-2025', uav: 'AS04', flightId: 'AP01LF24L02', type: 'Live', pilot: 'Lake Sai Sivaji', from: 'Araku Valley', to: 'Paderu', distance: 37.7, takeoff: '11:38', landing: '12:03', duration: '00:25', payload: 1450, fls: 'Use', precland: 'Off Marker', detAlt: 38, landOff: 0.9, lfao: 'Partially Worked', version: 'V 2.0' },
    { date: '09-12-2025', uav: 'AS04', flightId: 'AP01LF25L01', type: 'Live', pilot: 'Mohan Kumar', from: 'Paderu', to: 'Araku Valley', distance: 34.7, takeoff: '12:26', landing: '12:56', duration: '00:30', payload: 1450, fls: 'Use', precland: 'On Marker', lfao: 'Worked', version: 'V 2.0' },
]

// ─── Analytics ───
export function computeMetrics(flights) {
    const totalDistance = flights.reduce((s, f) => s + f.distance, 0)
    const totalFlights = flights.length
    const liveFlights = flights.filter(f => f.type === 'Live')
    const testFlights = flights.filter(f => f.type === 'Test')
    const uavs = [...new Set(flights.map(f => f.uav))]
    const pilots = [...new Set(flights.map(f => f.pilot))]
    const locations = [...new Set(flights.flatMap(f => [f.from, f.to]))]
    const totalMinutes = flights.reduce((s, f) => {
        const [h, m] = f.duration.split(':').map(Number)
        return s + h * 60 + m
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
        const [h, m] = f.duration.split(':').map(Number)
        routes[key].durations.push(h * 60 + m)
    })
    return Object.values(routes).map(r => ({
        ...r,
        avgDuration: Math.round(r.durations.reduce((a, b) => a + b, 0) / r.durations.length),
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
        const [h, m] = f.duration.split(':').map(Number)
        pilots[f.pilot].minutes += h * 60 + m
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
        const [h, m] = f.duration.split(':').map(Number)
        uavs[f.uav].minutes += h * 60 + m
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
