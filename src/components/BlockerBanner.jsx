import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function BlockerBanner({ blockerType = 'WEATHER', onLogResolution }) {
  const [timeRemaining, setTimeRemaining] = useState(45298) // seconds
  const [isResolved, setIsResolved] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => Math.max(0, prev - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleResolution = () => {
    setIsResolved(true)
    onLogResolution?.({
      type: blockerType,
      resolvedAt: new Date().toISOString(),
      remainingTime: timeRemaining
    })
  }

  if (isResolved) return null

  return (
    <motion.div
      className="blocker-banner"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <div className="blocker-left">
        <div className="blocker-icon">⚠</div>
        <div className="blocker-info">
          <span className="blocker-label">BLOCKER:</span>
          <span className="blocker-tag">{blockerType}</span>
          <span className="blocker-detail">› REDUCED VISIBILITY OPS</span>
        </div>
      </div>

      <div className="blocker-right">
        <div className="blocker-timer">
          <span className="timer-label">EXPECTED CLEAR:</span>
          <span className="timer-value">{formatTime(timeRemaining)}</span>
        </div>
        <button className="resolution-btn" onClick={handleResolution}>
          <span>✓</span> LOG RESOLUTION
        </button>
      </div>

      <style>{`
        .blocker-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 16px 24px;
          background: #FFFBF0;
          border: 1px solid #F0E6D2;
          border-left: 4px solid #F59E0B;
          border-radius: var(--radius);
        }
        
        .blocker-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .blocker-icon {
          font-size: 20px;
          color: #F59E0B;
        }
        
        .blocker-info {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        
        .blocker-label {
          font-family: var(--font-display);
          font-size: 11px;
          font-weight: 600;
          color: var(--text-secondary);
          letter-spacing: 1px;
        }
        
        .blocker-tag {
          padding: 4px 10px;
          background: #1E1E1E;
          color: white;
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 600;
          border-radius: 4px;
          letter-spacing: 0.5px;
        }
        
        .blocker-detail {
          font-family: var(--font-sans);
          font-size: 13px;
          color: var(--text-secondary);
        }
        
        .blocker-right {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        
        .blocker-timer {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .timer-label {
          font-family: var(--font-sans);
          font-size: 11px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .timer-value {
          font-family: var(--font-mono);
          font-size: 18px;
          font-weight: 700;
          color: #F59E0B;
        }
        
        .resolution-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 16px;
          background: #10B981;
          color: white;
          border: none;
          border-radius: var(--radius-sm);
          font-family: var(--font-display);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 1px;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        
        .resolution-btn:hover {
          background: #059669;
        }
        
        @media (max-width: 768px) {
          .blocker-banner {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
          
          .blocker-right {
            width: 100%;
            justify-content: space-between;
          }
        }
      `}</style>
    </motion.div>
  )
}
