import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const NODES = [
  { id: 'PHC-01', name: 'Tajangi PHC', status: 'online', signal: 98, battery: 82 },
  { id: 'PHC-02', name: 'Sunkarametta PHC', status: 'online', signal: 94, battery: 76 }
]

export default function NodeMonitor() {
  const [sparkData, setSparkData] = useState(
    Array.from({ length: 8 }, () => Math.random() * 30 + 50)
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setSparkData(prev => [...prev.slice(1), Math.random() * 30 + 50])
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      className="node-monitor glass-card"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.35 }}
    >
      <div className="monitor-header">
        <span className="monitor-title">Node Health</span>
        <span className="node-count">2 <span>Active</span></span>
      </div>

      <div className="node-list">
        {NODES.map((node) => (
          <div key={node.id} className="node-item">
            <div className="node-row">
              <span className="node-dot" style={{ background: 'var(--accent-success)' }}></span>
              <span className="node-name">{node.name}</span>
              <span className="node-status">{node.status.toUpperCase()}</span>
            </div>
            <div className="node-stats">
              <span>{node.signal}% <small>SIG</small></span>
              <span>{node.battery}% <small>BAT</small></span>
            </div>
          </div>
        ))}
      </div>

      <div className="signal-graph">
        <span className="graph-label">Network Latency</span>
        <svg viewBox="0 0 100 30" className="mini-graph">
          <polyline
            fill="none"
            stroke="var(--accent-primary)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={sparkData.map((v, i) => `${i * 12.5},${30 - v * 0.3}`).join(' ')}
          />
        </svg>
      </div>

      <style>{`
        .node-monitor {
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        
        .monitor-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          border-bottom: 1px solid var(--border-subtle);
        }
        
        .monitor-title {
          font-family: var(--font-display);
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
        }
        
        .node-count {
          font-family: var(--font-mono);
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
        }
        
        .node-count span {
          font-family: var(--font-sans);
          font-size: 10px;
          font-weight: 500;
          color: var(--accent-success);
          margin-left: 4px;
        }
        
        .node-list {
          flex: 1;
          padding: 12px 16px;
        }
        
        .node-item {
          padding: 10px 0;
          border-bottom: 1px solid var(--border-subtle);
        }
        
        .node-item:last-child {
          border-bottom: none;
        }
        
        .node-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }
        
        .node-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }
        
        .node-name {
          font-family: var(--font-sans);
          font-size: 12px;
          font-weight: 500;
          color: var(--text-primary);
          flex: 1;
        }
        
        .node-status {
          font-family: var(--font-mono);
          font-size: 9px;
          font-weight: 600;
          color: var(--accent-success);
          letter-spacing: 0.3px;
        }
        
        .node-stats {
          display: flex;
          gap: 12px;
          margin-left: 14px;
        }
        
        .node-stats span {
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 500;
          color: var(--text-primary);
        }
        
        .node-stats small {
          font-family: var(--font-sans);
          font-size: 9px;
          color: var(--text-muted);
          margin-left: 2px;
        }
        
        .signal-graph {
          padding: 12px 16px;
          border-top: 1px solid var(--border-subtle);
          background: var(--bg-muted);
        }
        
        .graph-label {
          display: block;
          font-family: var(--font-sans);
          font-size: 10px;
          color: var(--text-muted);
          margin-bottom: 8px;
        }
        
        .mini-graph {
          width: 100%;
          height: 30px;
        }
      `}</style>
    </motion.div>
  )
}
