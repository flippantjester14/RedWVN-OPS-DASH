import { useState, useEffect, useRef } from 'react'

const LOGS = [
  { type: 'MAV', color: '#6E6E73', msg: 'Heartbeat OK — ID:1 COMP:1' },
  { type: 'EKF', color: '#0071E3', msg: 'FIXED — Lane 0 Active | IMU0' },
  { type: 'GPS', color: '#5856D6', msg: '18 SATS | HDOP 0.7 | 3D Fix' },
  { type: 'BAT', color: '#FF9F0A', msg: '23.1V | Cell Min: 3.85V | 82%' },
  { type: 'SYS', color: '#30D158', msg: 'ARMED | Mode: AUTO | WP 4/8' },
  { type: 'CMD', color: '#FF453A', msg: 'NAV_WAYPOINT accepted' },
  { type: 'MAV', color: '#6E6E73', msg: 'MISSION_ITEM_REACHED #4' },
  { type: 'GPS', color: '#5856D6', msg: 'Velocity 12.4 m/s | Track OK' },
  { type: 'EKF', color: '#0071E3', msg: 'IMU0 Gyro Cal: PASS' },
  { type: 'BAT', color: '#FF9F0A', msg: '22.6V | 142 cycles | Health OK' },
]

export default function Terminal() {
  const [logs, setLogs] = useState([])
  const ref = useRef(null)
  const idx = useRef(0)

  useEffect(() => {
    const init = LOGS.slice(0, 4).map((l, i) => ({
      ...l, id: i,
      ts: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' })
    }))
    setLogs(init)
    idx.current = 4

    const iv = setInterval(() => {
      const l = LOGS[idx.current % LOGS.length]
      setLogs(prev => [...prev.slice(-40), {
        ...l, id: Date.now(),
        ts: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' })
      }])
      idx.current++
    }, 2500)
    return () => clearInterval(iv)
  }, [])

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight
  }, [logs])

  return (
    <div className="log-scroll" ref={ref} style={{ height: '100%', overflowY: 'auto' }}>
      {logs.map(l => (
        <div className="log-line" key={l.id}>
          <span className="log-time">{l.ts}</span>
          <span className="log-tag" style={{ color: l.color }}>[{l.type}]</span>
          <span className="log-msg">{l.msg}</span>
        </div>
      ))}
    </div>
  )
}
