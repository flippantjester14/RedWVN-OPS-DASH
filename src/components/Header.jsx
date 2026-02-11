import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function Header() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'Asia/Kolkata'
    })
  }

  return (
    <motion.header
      className="header"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="header-left">
        <div className="logo">
          <span className="logo-text">REDWING</span>
          <span className="logo-tag">OPS</span>
        </div>
      </div>

      <nav className="header-nav">
        <a href="#overview" className="nav-link active">Overview</a>
        <a href="#fleet" className="nav-link">Fleet</a>
        <a href="#intelligence" className="nav-link">Intelligence</a>
        <a href="#logs" className="nav-link">Logs</a>
      </nav>

      <div className="header-right">
        <div className="time-display">
          <span className="time-value">{formatTime(currentTime)}</span>
          <span className="time-zone">IST</span>
        </div>
        <div className="status-pill">
          <span className="status-dot"></span>
          <span>OPERATIONAL</span>
        </div>
      </div>

      <style>{`
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 24px;
          background: var(--bg-card);
          border-bottom: 1px solid var(--border-subtle);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        
        .header-left {
          display: flex;
          align-items: center;
        }
        
        .logo {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .logo-text {
          font-family: var(--font-display);
          font-size: 18px;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.5px;
        }
        
        .logo-tag {
          padding: 2px 6px;
          background: var(--accent-primary);
          color: white;
          font-family: var(--font-mono);
          font-size: 9px;
          font-weight: 600;
          border-radius: 4px;
          letter-spacing: 0.5px;
        }
        
        .header-nav {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        
        .nav-link {
          padding: 8px 14px;
          font-family: var(--font-sans);
          font-size: 13px;
          font-weight: 500;
          color: var(--text-muted);
          text-decoration: none;
          border-radius: var(--radius-sm);
          transition: all 0.15s ease;
        }
        
        .nav-link:hover {
          color: var(--text-secondary);
          background: var(--bg-muted);
        }
        
        .nav-link.active {
          color: var(--text-primary);
          font-weight: 600;
        }
        
        .header-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .time-display {
          display: flex;
          align-items: baseline;
          gap: 4px;
        }
        
        .time-value {
          font-family: var(--font-mono);
          font-size: 13px;
          font-weight: 500;
          color: var(--text-primary);
        }
        
        .time-zone {
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--text-muted);
        }
        
        .status-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 10px;
          background: rgba(34, 197, 94, 0.1);
          border-radius: 20px;
        }
        
        .status-dot {
          width: 6px;
          height: 6px;
          background: var(--accent-success);
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }
        
        .status-pill span:last-child {
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 600;
          color: var(--accent-success);
          letter-spacing: 0.5px;
        }
        
        @media (max-width: 768px) {
          .header {
            padding: 10px 16px;
          }
          
          .header-nav {
            display: none;
          }
          
          .time-display {
            display: none;
          }
        }
      `}</style>
    </motion.header>
  )
}
