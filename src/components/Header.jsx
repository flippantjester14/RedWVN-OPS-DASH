import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function Header() {
  const [time, setTime] = useState(new Date())
  const [sats, setSats] = useState(17)
  const [latency, setLatency] = useState(34)

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
      setSats(prev => {
        const delta = Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0
        return Math.max(14, Math.min(19, prev + delta))
      })
      setLatency(prev => {
        const delta = Math.floor(Math.random() * 10) - 5
        return Math.max(28, Math.min(52, prev + delta))
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatIST = (date) => {
    const options = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'Asia/Kolkata'
    }
    return date.toLocaleTimeString('en-IN', options)
  }

  const formatDate = (date) => {
    const options = {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'Asia/Kolkata'
    }
    return date.toLocaleDateString('en-IN', options)
  }

  return (
    <header className="header">
      <div className="header-left">
        <motion.div
          className="logo"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="logo-icon glow-red">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <path d="M20 3L37 12V28L20 37L3 28V12L20 3Z" stroke="#D32F2F" strokeWidth="2" fill="none" />
              <path d="M20 9L31 15V25L20 31L9 25V15L20 9Z" fill="rgba(211, 47, 47, 0.15)" />
              <circle cx="20" cy="20" r="5" fill="#D32F2F" />
              <path d="M20 15V25M15 20H25" stroke="#0a0a0a" strokeWidth="2" />
            </svg>
          </div>
          <div className="logo-text">
            <span className="logo-title">REDWING</span>
            <span className="logo-subtitle">OPS COMMAND</span>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="header-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="hud-group">
          <div className="hud-item">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="hud-icon flicker">
              <circle cx="7" cy="7" r="3" fill="#00FF41" />
              <path d="M7 1V3M7 11V13M1 7H3M11 7H13" stroke="#00FF41" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span className="hud-value flicker">{sats}</span>
            <span className="hud-label">SATS</span>
          </div>

          <div className="system-status">
            <div className="status-dot glow-red"></div>
            <span className="status-text">SYSTEM LIVE</span>
          </div>

          <div className="hud-item">
            <span className="hud-label">C2</span>
            <span className="hud-value latency">{latency}ms</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="header-right"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="ist-clock">
          <span className="clock-time">{formatIST(time)} <span className="clock-zone">IST</span></span>
          <span className="clock-date">{formatDate(time)}</span>
        </div>
      </motion.div>

      <style>{`
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 24px;
          background: linear-gradient(180deg, rgba(20, 20, 20, 0.98) 0%, rgba(10, 10, 10, 0.95) 100%);
          border-bottom: 1px solid var(--border-glass);
          position: sticky;
          top: 0;
          z-index: 1000;
          backdrop-filter: blur(12px);
        }
        
        .header-left, .header-right {
          flex: 1;
        }
        
        .header-right {
          display: flex;
          justify-content: flex-end;
        }
        
        .header-center {
          flex: 0 0 auto;
        }
        
        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .logo-text {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        
        .logo-title {
          font-family: var(--font-display);
          font-size: 18px;
          font-weight: 700;
          color: var(--redwing-crimson);
          letter-spacing: 3px;
          line-height: 1.1;
          text-shadow: var(--redwing-glow);
        }
        
        .logo-subtitle {
          font-family: var(--font-mono);
          font-size: 9px;
          font-weight: 500;
          color: #666;
          letter-spacing: 4px;
        }
        
        .hud-group {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        
        .hud-item {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-sm);
        }
        
        .hud-icon {
          flex-shrink: 0;
        }
        
        .hud-value {
          font-family: var(--font-mono);
          font-size: 14px;
          font-weight: 600;
          color: var(--phosphor-green);
        }
        
        .hud-value.latency {
          color: var(--cyan-data);
        }
        
        .hud-label {
          font-family: var(--font-mono);
          font-size: 10px;
          color: #666;
          letter-spacing: 1px;
        }
        
        .system-status {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 18px;
          background: rgba(211, 47, 47, 0.08);
          border: 1px solid rgba(211, 47, 47, 0.25);
          border-radius: var(--radius);
        }
        
        .status-dot {
          width: 10px;
          height: 10px;
          background: var(--redwing-crimson);
          border-radius: 50%;
        }
        
        .status-text {
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 600;
          color: var(--redwing-crimson);
          letter-spacing: 1.5px;
          text-shadow: var(--redwing-glow);
        }
        
        .ist-clock {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          font-family: var(--font-mono);
        }
        
        .clock-time {
          font-size: 18px;
          font-weight: 600;
          color: var(--text-primary);
          letter-spacing: 1px;
        }
        
        .clock-zone {
          font-size: 11px;
          color: var(--cyan-data);
          margin-left: 4px;
        }
        
        .clock-date {
          font-size: 10px;
          color: #666;
          letter-spacing: 0.5px;
        }
        
        @media (max-width: 1024px) {
          .hud-item {
            display: none;
          }
        }
        
        @media (max-width: 768px) {
          .header {
            padding: 10px 16px;
            flex-wrap: wrap;
            gap: 10px;
          }
          
          .header-left, .header-right {
            flex: 0 0 auto;
          }
          
          .header-center {
            order: 3;
            flex: 1 0 100%;
            display: flex;
            justify-content: center;
          }
          
          .logo-text {
            display: none;
          }
          
          .clock-time {
            font-size: 15px;
          }
          
          .clock-date {
            display: none;
          }
        }
      `}</style>
    </header>
  )
}
