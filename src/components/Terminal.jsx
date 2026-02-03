import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const LOG_TYPES = {
  BAT: { prefix: '[BAT]', color: '#FFEB3B' },
  EKF: { prefix: '[EKF]', color: '#00BCD4' },
  GPS: { prefix: '[GPS]', color: '#9C27B0' },
  MAV: { prefix: '[MAV]', color: '#2196F3' },
  SYS: { prefix: '[SYS]', color: '#00FF41' },
  CMD: { prefix: '[CMD]', color: '#D32F2F' }
}

const SAMPLE_LOGS = [
  { type: 'MAV', message: 'Heartbeat OK - ID:1' },
  { type: 'EKF', message: 'FIXED - Lane 0 Active' },
  { type: 'GPS', message: '18 SATS | HDOP 0.7' },
  { type: 'BAT', message: '23.1V | 82%' },
  { type: 'SYS', message: 'Systems nominal' },
  { type: 'MAV', message: 'AUTO | WP 4/8' },
  { type: 'GPS', message: 'Velocity OK' },
  { type: 'BAT', message: '22.9V | 79%' },
  { type: 'EKF', message: 'IMU0 Gyro OK' },
  { type: 'SYS', message: 'Link 100%' },
  { type: 'CMD', message: 'Route confirmed' },
  { type: 'MAV', message: 'ETA: 2m 18s' }
]

export default function Terminal() {
  const [logs, setLogs] = useState([])
  const [cursorVisible, setCursorVisible] = useState(true)
  const containerRef = useRef(null)
  const logIndexRef = useRef(0)

  useEffect(() => {
    const initialLogs = SAMPLE_LOGS.slice(0, 5).map((log, i) => ({
      ...log,
      id: i,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' })
    }))
    setLogs(initialLogs)
    logIndexRef.current = 5

    const logInterval = setInterval(() => {
      const newLog = {
        ...SAMPLE_LOGS[logIndexRef.current % SAMPLE_LOGS.length],
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' })
      }
      setLogs(prev => prev.length > 60 ? [...prev.slice(-60), newLog] : [...prev, newLog])
      logIndexRef.current++
    }, 2200)

    const cursorInterval = setInterval(() => setCursorVisible(v => !v), 530)

    return () => {
      clearInterval(logInterval)
      clearInterval(cursorInterval)
    }
  }, [])

  useEffect(() => {
    if (containerRef.current) containerRef.current.scrollTop = containerRef.current.scrollHeight
  }, [logs])

  return (
    <motion.div
      className="terminal glass-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
    >
      <div className="terminal-header">
        <div className="terminal-title">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <rect x="1" y="1" width="10" height="10" rx="2" stroke="#D32F2F" strokeWidth="1.2" fill="none" />
            <path d="M3 4L5 6L3 8" stroke="#D32F2F" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6 8H9" stroke="#D32F2F" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          <span>MAVLINK FEED</span>
        </div>
        <div className="live-badge">
          <span>LIVE</span>
          <div className="live-dot pulse"></div>
        </div>
      </div>

      <div className="terminal-body" ref={containerRef}>
        {logs.map((log) => (
          <div key={log.id} className="log-entry">
            <span className="log-time">{log.timestamp}</span>
            <span className="log-tag" style={{ color: LOG_TYPES[log.type]?.color }}>{LOG_TYPES[log.type]?.prefix}</span>
            <span className="log-msg">{log.message}</span>
          </div>
        ))}
      </div>

      <div className="terminal-input">
        <span className="prompt">UPLINK&gt;</span>
        <span className="input-text">READY FOR UPLINK...</span>
        <span className={`cursor ${cursorVisible ? 'visible' : ''}`}>█</span>
      </div>

      <style>{`
        .terminal {
          display: flex;
          flex-direction: column;
          overflow: hidden;
          height: 100%;
          min-height: 280px;
        }
        
        .terminal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 16px;
          border-bottom: 1px solid var(--border-glass);
          flex-shrink: 0;
        }
        
        .terminal-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-display);
          font-size: 10px;
          font-weight: 600;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 2px;
        }
        
        .live-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 3px 8px;
          background: rgba(211, 47, 47, 0.1);
          border: 1px solid rgba(211, 47, 47, 0.2);
          border-radius: 6px;
        }
        
        .live-badge span {
          font-family: var(--font-mono);
          font-size: 9px;
          font-weight: 600;
          color: var(--redwing-crimson);
          letter-spacing: 1px;
        }
        
        .live-dot {
          width: 6px;
          height: 6px;
          background: var(--redwing-crimson);
          border-radius: 50%;
        }
        
        .terminal-body {
          flex: 1;
          padding: 10px 14px;
          overflow-y: auto;
          font-family: var(--font-mono);
          font-size: 11px;
          line-height: 1.7;
          background: rgba(0, 0, 0, 0.2);
        }
        
        .log-entry {
          display: flex;
          gap: 10px;
          margin-bottom: 1px;
        }
        
        .log-time {
          color: #444;
          flex-shrink: 0;
        }
        
        .log-tag {
          font-weight: 700;
          flex-shrink: 0;
          min-width: 40px;
        }
        
        .log-msg {
          color: #aaa;
        }
        
        .terminal-input {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          background: rgba(0, 0, 0, 0.4);
          border-top: 1px solid var(--border-glass);
          font-family: var(--font-mono);
          font-size: 11px;
        }
        
        .prompt {
          color: var(--phosphor-green);
          font-weight: 600;
          text-shadow: 0 0 8px rgba(0, 255, 65, 0.4);
        }
        
        .input-text {
          color: #555;
        }
        
        .cursor {
          color: var(--phosphor-green);
          opacity: 0;
          text-shadow: 0 0 6px rgba(0, 255, 65, 0.5);
        }
        
        .cursor.visible {
          opacity: 1;
        }
      `}</style>
    </motion.div>
  )
}
