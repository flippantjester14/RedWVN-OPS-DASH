import { useState, useEffect, useRef } from 'react'
import { motion, useSpring } from 'framer-motion'

function Sparkline({ data, color = '#0EA5E9', width = 50, height = 20 }) {
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - (val / 100) * height
    return `${x},${y}`
  }).join(' ')

  return (
    <svg width={width} height={height}>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
        opacity="0.6"
      />
    </svg>
  )
}

function AnimatedNumber({ value, decimals = 0 }) {
  const [displayValue, setDisplayValue] = useState(0)
  const spring = useSpring(0, { stiffness: 50, damping: 20 })

  useEffect(() => {
    spring.set(value)
  }, [value, spring])

  useEffect(() => {
    const unsubscribe = spring.on('change', (v) => setDisplayValue(v))
    return () => unsubscribe()
  }, [spring])

  if (decimals > 0) return <span>{displayValue.toFixed(decimals)}</span>
  return <span>{Math.round(displayValue).toLocaleString()}</span>
}

function VerticalBar({ value, label, color }) {
  return (
    <div className="v-bar">
      <div className="v-bar-track">
        <motion.div
          className="v-bar-fill"
          style={{ background: color }}
          initial={{ height: 0 }}
          animate={{ height: `${value}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      <span className="v-bar-label">{label}</span>
    </div>
  )
}

export default function MetricCard({ title, label, value, trend, type = 'default', delay = 0, showBars = false }) {
  const [sparkData] = useState(() =>
    Array.from({ length: 12 }, () => Math.random() * 40 + 50)
  )

  const getAccentColor = () => {
    switch (type) {
      case 'success': return 'var(--accent-success)'
      case 'warning': return 'var(--accent-warning)'
      case 'danger': case 'live': return 'var(--accent-danger)'
      default: return 'var(--accent-primary)'
    }
  }

  const parseValue = (val) => {
    if (typeof val === 'string') {
      const num = parseFloat(val.replace(/[^0-9.]/g, ''))
      return {
        num,
        hasPercent: val.includes('%'),
        hasKm: val.includes('km'),
        hasDrones: val.toLowerCase().includes('drone')
      }
    }
    return { num: val, hasPercent: false, hasKm: false, hasDrones: false }
  }

  const parsed = parseValue(value)
  const isLive = type === 'live'

  return (
    <motion.div
      className="metric-card glass-card"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <div className="metric-header">
        <span className="metric-label">{label}</span>
        {trend !== undefined && (
          <span className={`metric-trend ${trend >= 0 ? 'up' : 'down'}`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
        {!trend && <Sparkline data={sparkData} color={getAccentColor()} />}
      </div>

      <div className="metric-body">
        <div className="metric-main">
          {isLive && <span className="live-dot"></span>}
          <span className="metric-value" style={{ color: getAccentColor() }}>
            {parsed.hasKm ? (
              <><AnimatedNumber value={parsed.num} /><span className="unit">km</span></>
            ) : parsed.hasPercent ? (
              <><AnimatedNumber value={parsed.num} decimals={2} /><span className="unit">%</span></>
            ) : parsed.hasDrones ? (
              <><AnimatedNumber value={parsed.num} /><span className="unit-text">Drones</span></>
            ) : (
              <span>{value}</span>
            )}
          </span>
        </div>

        {showBars && (
          <div className="subsystem-bars">
            <VerticalBar value={85} label="SIG" color="var(--accent-success)" />
            <VerticalBar value={78} label="BAT" color="var(--accent-warning)" />
            <VerticalBar value={62} label="TMP" color="var(--accent-primary)" />
          </div>
        )}
      </div>

      <div className="metric-footer">
        <span className="metric-title">{title}</span>
      </div>

      <style>{`
        .metric-card {
          padding: 16px 18px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .metric-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .metric-label {
          font-family: var(--font-sans);
          font-size: 11px;
          font-weight: 500;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }
        
        .metric-trend {
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 600;
        }
        
        .metric-trend.up { color: var(--accent-success); }
        .metric-trend.down { color: var(--accent-danger); }
        
        .metric-body {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        
        .metric-main {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .live-dot {
          width: 8px;
          height: 8px;
          background: var(--accent-danger);
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }
        
        .metric-value {
          font-family: var(--font-mono);
          font-size: 28px;
          font-weight: 600;
          letter-spacing: -0.5px;
          display: flex;
          align-items: baseline;
          gap: 3px;
          line-height: 1;
        }
        
        .unit {
          font-size: 14px;
          font-weight: 500;
          opacity: 0.6;
        }
        
        .unit-text {
          font-size: 12px;
          font-weight: 500;
          opacity: 0.6;
          margin-left: 4px;
        }
        
        .subsystem-bars {
          display: flex;
          gap: 6px;
        }
        
        .v-bar {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
        }
        
        .v-bar-track {
          width: 5px;
          height: 28px;
          background: var(--bg-muted);
          border-radius: 2px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }
        
        .v-bar-fill {
          width: 100%;
          border-radius: 2px;
        }
        
        .v-bar-label {
          font-family: var(--font-mono);
          font-size: 8px;
          color: var(--text-muted);
        }
        
        .metric-footer {
          padding-top: 8px;
          border-top: 1px solid var(--border-subtle);
        }
        
        .metric-title {
          font-size: 12px;
          color: var(--text-secondary);
        }
        
        @media (max-width: 768px) {
          .metric-value { font-size: 24px; }
        }
      `}</style>
    </motion.div>
  )
}
