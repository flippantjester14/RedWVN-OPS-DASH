import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function TabNavigation({ tabs, activeTab, onTabChange }) {
    return (
        <div className="tab-navigation">
            <div className="tab-list">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => onTabChange(tab.id)}
                    >
                        {tab.icon && <span className="tab-icon">{tab.icon}</span>}
                        <span className="tab-label">{tab.label}</span>
                        {activeTab === tab.id && (
                            <motion.div
                                className="tab-indicator"
                                layoutId="tabIndicator"
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            />
                        )}
                    </button>
                ))}
            </div>

            <style>{`
        .tab-navigation {
          display: flex;
          justify-content: center;
          padding: 8px 16px;
          background: rgba(10, 10, 10, 0.8);
          border-bottom: 1px solid var(--border-glass);
          backdrop-filter: blur(10px);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        
        .tab-list {
          display: flex;
          gap: 4px;
          padding: 4px;
          background: rgba(26, 26, 26, 0.8);
          border-radius: 12px;
          border: 1px solid var(--border-glass);
        }
        
        .tab-item {
          position: relative;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: transparent;
          border: none;
          border-radius: 8px;
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 600;
          color: #666;
          letter-spacing: 1px;
          cursor: pointer;
          transition: color 0.2s ease;
          text-transform: uppercase;
        }
        
        .tab-item:hover:not(.active) {
          color: #888;
        }
        
        .tab-item.active {
          color: var(--text-primary);
        }
        
        .tab-icon {
          display: flex;
          align-items: center;
          font-size: 14px;
        }
        
        .tab-indicator {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(211, 47, 47, 0.15) 0%, rgba(211, 47, 47, 0.05) 100%);
          border: 1px solid rgba(211, 47, 47, 0.3);
          border-radius: 8px;
          z-index: -1;
          box-shadow: 0 0 20px rgba(211, 47, 47, 0.1);
        }
        
        @media (max-width: 768px) {
          .tab-navigation {
            padding: 6px 12px;
          }
          
          .tab-item {
            padding: 8px 12px;
            font-size: 10px;
          }
          
          .tab-label {
            display: none;
          }
          
          .tab-icon {
            font-size: 16px;
          }
        }
        
        @media (min-width: 769px) {
          .tab-icon {
            display: none;
          }
        }
      `}</style>
        </div>
    )
}
