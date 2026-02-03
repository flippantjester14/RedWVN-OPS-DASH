import { useState, useEffect, useRef } from 'react'
import { motion, useSpring } from 'framer-motion'

function Sparkline({ data, color = '#00FF41', width = 60, height = 24 }) {
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - (val / 100) * height
    return `${x},${y}`
  }).join(' ')

  return (
    <svg width={width} height={height} className="sparkline">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
        style={{ filter: `drop-shadow(0 0 3px ${color}40)` }}
      />
      <circle
        cx={(data.length - 1) / (data.length - 1) * width}
        cy={height - (data[data.length - 1] / 100) * height}
        r="2"
        fill={color}
        style={{ filter: `drop-shadow(0 0 4px ${color})` }}
      />
    </svg>
  )
}

function AnimatedNumber({ value, decimals = 0 }) {
  const [displayValue, setDisplayValue] = useState(0)
  const spring = useSpring(0, { stiffness: 40, damping: 20 })

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
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
      <span className="v-bar-label">{label}</span>
    </div>
  )
}

export default function MetricCard({ title, label, value, trend, type = 'default', delay = 0, showBars = false }) {
  const [sparkData, setSparkData] = useState(() =>
    Array.from({ length: 20 }, () => Math.random() * 40 + 50)
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setSparkData(prev => {
        const newData = [...prev.slice(1), Math.random() * 40 + 50]
        return newData
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const getAccentColor = () => {
    switch (type) {
      case 'success': return 'var(--phosphor-green)'
      case 'warning': return 'var(--amber-warning)'
      case 'danger': case 'live': return 'var(--redwing-crimson)'
      default: return 'var(--text-primary)'
    }
  }

  const getGlowClass = () => {
    switch (type) {
      case 'success': return 'text-glow-green'
      case 'live': case 'danger': return 'text-glow-red'
      default: return ''
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <div className="metric-header">
        <span className="metric-label">{label || title}</span>
        {trend !== undefined && (
          <div className={`metric-trend ${trend >= 0 ? 'up' : 'down'}`}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d={trend >= 0 ? "M5 2L8 6H2L5 2Z" : "M5 8L2 4H8L5 8Z"} fill="currentColor" />
            </svg>
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>

      <div className="metric-body">
        <div className="metric-main">
          {isLive && <div className="live-dot glow-red"></div>}
          <div className={`metric-value ${getGlowClass()}`} style={{ color: getAccentColor() }}>
            {parsed.hasKm ? (
              <><AnimatedNumber value={parsed.num} /><span className="unit">km</span></>
            ) : parsed.hasPercent ? (
              <><AnimatedNumber value={parsed.num} decimals={2} /><span className="unit">%</span></>
            ) : parsed.hasDrones ? (
              <><AnimatedNumber value={parsed.num} /><span className="unit-text">Drones</span></>
            ) : (
              <span>{value}</span>
            )}
          </div>
        </div>

        {showBars ? (
          <div className="subsystem-bars">
            <VerticalBar value={85} label="SIG" color="var(--phosphor-green)" />
            <VerticalBar value={78} label="BAT" color="var(--amber-warning)" />
            <VerticalBar value={62} label="TMP" color="var(--cyan-data)" />
          </div>
        ) : (
          <div className="sparkline-container">
            <Sparkline
              data={sparkData}
              color={type === 'success' ? '#00FF41' : type === 'warning' ? '#FFA726' : '#00BCD4'}
            />
          </div>
        )}
      </div>

      <div className="metric-footer">
        <span className="metric-title">{title}</span>
      </div>

      <style>{`
        .metric-card {
          padding: 18px 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          transition: transform 0.2s ease;
        }
        
        .metric-card:hover {
          transform: translateY(-2px);
        }
        
        .metric-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .metric-label {
          font-family: var(--font-display);
          font-size: 10px;
          font-weight: 600;
          color: #555;
          text-transform: uppercase;
          letter-spacing: 1.5px;
        }
        
        .metric-trend {
          display: flex;
          align-items: center;
          gap: 3px;
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 600;
        }
        
        .metric-trend.up { color: var(--phosphor-green); }
        .metric-trend.down { color: var(--redwing-crimson); }
        
        .metric-body {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        
        .metric-main {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .live-dot {
          width: 12px;
          height: 12px;
          background: var(--redwing-crimson);
          border-radius: 50%;
          flex-shrink: 0;
        }
        
        .metric-value {
          font-family: var(--font-mono);
          font-size: 32px;
          font-weight: 700;
          letter-spacing: -1px;
          display: flex;
          align-items: baseline;
          gap: 4px;
          line-height: 1;
        }
        
        .unit {
          font-size: 16px;
          font-weight: 500;
          opacity: 0.5;
        }
        
        .unit-text {
          font-size: 14px;
          font-weight: 500;
          opacity: 0.5;
          margin-left: 4px;
        }
        
        .sparkline-container {
          flex-shrink: 0;
          opacity: 0.8;
        }
        
        .subsystem-bars {
          display: flex;
          gap: 8px;
          flex-shrink: 0;
        }
        
        .v-bar {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        
        .v-bar-track {
          width: 6px;
          height: 32px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 3px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }
        
        .v-bar-fill {
          width: 100%;
          border-radius: 3px;
        }
        
        .v-bar-label {
          font-family: var(--font-mono);
          font-size: 8px;
          color: #555;
          letter-spacing: 0.5px;
        }
        
        .metric-footer {
          padding-top: 10px;
          border-top: 1px solid rgba(255, 255, 255, 0.04);
        }
        
        .metric-title {
          font-size: 11px;
          color: #666;
        }
        
        @media (max-width: 768px) {
          .metric-value {
            font-size: 26px;
          }
          
          .sparkline-container {
            display: none;
          }
        }
      `}</style>
    </motion.div>
  )
}
