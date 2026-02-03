import { useState } from 'react'
import { motion } from 'framer-motion'

export default function MissionReplay() {
    const [position, setPosition] = useState(72)
    const [isPlaying, setIsPlaying] = useState(false)

    const events = [
        { time: '09:12', label: 'LAUNCH', position: 5 },
        { time: '09:28', label: 'WP-1', position: 25 },
        { time: '09:45', label: 'DELIVERY', position: 55 },
        { time: '10:02', label: 'RTB', position: 80 },
    ]

    return (
        <motion.div
            className="replay-bar"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
        >
            <div className="replay-controls">
                <button className="replay-btn" onClick={() => setIsPlaying(!isPlaying)}>
                    {isPlaying ? (
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <rect x="3" y="2" width="3" height="10" fill="currentColor" rx="1" />
                            <rect x="8" y="2" width="3" height="10" fill="currentColor" rx="1" />
                        </svg>
                    ) : (
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M3 2L12 7L3 12V2Z" fill="currentColor" />
                        </svg>
                    )}
                </button>
                <span className="replay-label">MISSION REPLAY</span>
            </div>

            <div className="timeline-container">
                <div className="timeline-track">
                    <motion.div
                        className="timeline-progress"
                        style={{ width: `${position}%` }}
                    />

                    {events.map((event, i) => (
                        <div
                            key={i}
                            className="timeline-event"
                            style={{ left: `${event.position}%` }}
                        >
                            <div className="event-marker"></div>
                            <div className="event-tooltip">
                                <span className="event-time">{event.time}</span>
                                <span className="event-label">{event.label}</span>
                            </div>
                        </div>
                    ))}

                    <div
                        className="timeline-scrubber"
                        style={{ left: `${position}%` }}
                    />
                </div>
            </div>

            <div className="replay-time">
                <span className="time-current">00:48:22</span>
                <span className="time-sep">/</span>
                <span className="time-total">01:12:45</span>
            </div>

            <style>{`
        .replay-bar {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 12px 20px;
          background: linear-gradient(180deg, rgba(20, 20, 20, 0.95) 0%, rgba(14, 14, 14, 0.98) 100%);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius);
          backdrop-filter: blur(10px);
        }
        
        .replay-controls {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }
        
        .replay-btn {
          width: 32px;
          height: 32px;
          background: rgba(211, 47, 47, 0.1);
          border: 1px solid rgba(211, 47, 47, 0.3);
          border-radius: 50%;
          color: var(--redwing-crimson);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }
        
        .replay-btn:hover {
          background: rgba(211, 47, 47, 0.2);
          transform: scale(1.05);
        }
        
        .replay-label {
          font-family: var(--font-display);
          font-size: 10px;
          font-weight: 600;
          color: #555;
          letter-spacing: 2px;
        }
        
        .timeline-container {
          flex: 1;
          padding: 0 10px;
        }
        
        .timeline-track {
          position: relative;
          height: 6px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 3px;
          cursor: pointer;
        }
        
        .timeline-progress {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          background: linear-gradient(90deg, var(--redwing-crimson) 0%, rgba(211, 47, 47, 0.6) 100%);
          border-radius: 3px;
          box-shadow: 0 0 10px rgba(211, 47, 47, 0.4);
        }
        
        .timeline-event {
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
        }
        
        .event-marker {
          width: 10px;
          height: 10px;
          background: #333;
          border: 2px solid #555;
          border-radius: 50%;
          transition: all 0.2s ease;
        }
        
        .timeline-event:hover .event-marker {
          background: var(--phosphor-green);
          border-color: var(--phosphor-green);
          box-shadow: 0 0 8px rgba(0, 255, 65, 0.5);
        }
        
        .event-tooltip {
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          padding: 4px 8px;
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 6px;
          white-space: nowrap;
          opacity: 0;
          visibility: hidden;
          transition: all 0.2s ease;
          margin-bottom: 8px;
        }
        
        .timeline-event:hover .event-tooltip {
          opacity: 1;
          visibility: visible;
        }
        
        .event-time {
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--phosphor-green);
          display: block;
        }
        
        .event-label {
          font-family: var(--font-mono);
          font-size: 9px;
          color: #888;
          letter-spacing: 1px;
        }
        
        .timeline-scrubber {
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 14px;
          height: 14px;
          background: var(--redwing-crimson);
          border: 2px solid #fff;
          border-radius: 50%;
          box-shadow: 0 0 12px rgba(211, 47, 47, 0.6);
          cursor: grab;
        }
        
        .timeline-scrubber:active {
          cursor: grabbing;
        }
        
        .replay-time {
          display: flex;
          align-items: center;
          gap: 4px;
          font-family: var(--font-mono);
          font-size: 12px;
          flex-shrink: 0;
        }
        
        .time-current {
          color: var(--text-primary);
        }
        
        .time-sep {
          color: #444;
        }
        
        .time-total {
          color: #666;
        }
        
        @media (max-width: 768px) {
          .replay-label {
            display: none;
          }
          
          .event-tooltip {
            display: none;
          }
          
          .replay-bar {
            padding: 10px 14px;
          }
        }
      `}</style>
        </motion.div>
    )
}
