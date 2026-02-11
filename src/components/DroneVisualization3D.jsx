import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float, MeshDistortMaterial, Sphere, Box, Ring } from '@react-three/drei'
import { motion } from 'framer-motion'

function DroneModel({ position = [0, 0, 0] }) {
    const droneRef = useRef()
    const propRefs = [useRef(), useRef(), useRef(), useRef()]

    useFrame((state) => {
        if (droneRef.current) {
            droneRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
            droneRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.05
        }
        propRefs.forEach((ref, i) => {
            if (ref.current) {
                ref.current.rotation.y += 0.5
            }
        })
    })

    const armPositions = [
        [0.6, 0, 0.6],
        [-0.6, 0, 0.6],
        [0.6, 0, -0.6],
        [-0.6, 0, -0.6]
    ]

    return (
        <group ref={droneRef} position={position}>
            {/* Main body */}
            <Box args={[0.5, 0.12, 0.5]} position={[0, 0, 0]}>
                <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
            </Box>

            {/* Center dome */}
            <Sphere args={[0.15, 16, 16]} position={[0, 0.1, 0]}>
                <meshStandardMaterial color="#D32F2F" emissive="#D32F2F" emissiveIntensity={0.5} metalness={0.9} roughness={0.1} />
            </Sphere>

            {/* Arms and propellers */}
            {armPositions.map((pos, i) => (
                <group key={i} position={pos}>
                    {/* Arm */}
                    <Box args={[0.08, 0.04, 0.6]} rotation={[0, Math.PI / 4 * (i % 2 === 0 ? 1 : -1), 0]}>
                        <meshStandardMaterial color="#222" metalness={0.7} roughness={0.3} />
                    </Box>
                    {/* Motor */}
                    <Box args={[0.12, 0.08, 0.12]} position={[0, 0.04, 0]}>
                        <meshStandardMaterial color="#333" metalness={0.9} roughness={0.1} />
                    </Box>
                    {/* Propeller */}
                    <group ref={propRefs[i]} position={[0, 0.1, 0]}>
                        <Box args={[0.4, 0.01, 0.04]}>
                            <meshStandardMaterial color="#888" transparent opacity={0.7} />
                        </Box>
                    </group>
                </group>
            ))}

            {/* LED indicators */}
            <pointLight position={[0.6, -0.05, 0.6]} color="#00FF41" intensity={0.5} distance={0.5} />
            <pointLight position={[-0.6, -0.05, 0.6]} color="#00FF41" intensity={0.5} distance={0.5} />
            <pointLight position={[0.6, -0.05, -0.6]} color="#D32F2F" intensity={0.5} distance={0.5} />
            <pointLight position={[-0.6, -0.05, -0.6]} color="#D32F2F" intensity={0.5} distance={0.5} />
        </group>
    )
}

function GlowingSphere() {
    const sphereRef = useRef()

    useFrame((state) => {
        if (sphereRef.current) {
            sphereRef.current.rotation.x = state.clock.elapsedTime * 0.2
            sphereRef.current.rotation.y = state.clock.elapsedTime * 0.3
        }
    })

    return (
        <group ref={sphereRef}>
            <Sphere args={[1.5, 64, 64]}>
                <MeshDistortMaterial
                    color="#D32F2F"
                    attach="material"
                    distort={0.3}
                    speed={2}
                    roughness={0.2}
                    metalness={0.8}
                    transparent
                    opacity={0.15}
                />
            </Sphere>

            {/* Orbital rings */}
            <Ring args={[1.8, 1.85, 64]} rotation={[Math.PI / 2, 0, 0]}>
                <meshBasicMaterial color="#D32F2F" transparent opacity={0.3} />
            </Ring>
            <Ring args={[2.1, 2.15, 64]} rotation={[Math.PI / 3, Math.PI / 4, 0]}>
                <meshBasicMaterial color="#00FF41" transparent opacity={0.2} />
            </Ring>
        </group>
    )
}

function ParticleField() {
    const particles = useRef()
    const count = 100

    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 10
        positions[i * 3 + 1] = (Math.random() - 0.5) * 10
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10
    }

    useFrame((state) => {
        if (particles.current) {
            particles.current.rotation.y = state.clock.elapsedTime * 0.05
        }
    })

    return (
        <points ref={particles}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial size={0.02} color="#D32F2F" transparent opacity={0.6} />
        </points>
    )
}

export default function DroneVisualization3D() {
    return (
        <motion.div
            className="drone-viz glass-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="viz-header">
                <span className="viz-title">ASSET VISUALIZATION</span>
                <div className="viz-status">
                    <span>AS04</span>
                    <div className="status-dot pulse"></div>
                </div>
            </div>

            <div className="canvas-container">
                <Canvas
                    camera={{ position: [3, 2, 3], fov: 45 }}
                    gl={{ antialias: true, alpha: true }}
                >
                    <ambientLight intensity={0.2} />
                    <directionalLight position={[5, 5, 5]} intensity={1} color="#fff" />
                    <directionalLight position={[-5, 3, -5]} intensity={0.5} color="#D32F2F" />
                    <pointLight position={[0, -3, 0]} intensity={0.3} color="#00FF41" />

                    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                        <DroneModel />
                    </Float>

                    <GlowingSphere />
                    <ParticleField />

                    <OrbitControls
                        enableZoom={false}
                        enablePan={false}
                        autoRotate
                        autoRotateSpeed={0.5}
                        maxPolarAngle={Math.PI / 1.5}
                        minPolarAngle={Math.PI / 4}
                    />
                </Canvas>
            </div>

            <div className="viz-footer">
                <div className="viz-stat">
                    <span className="stat-label">ALT</span>
                    <span className="stat-value">120m</span>
                </div>
                <div className="viz-stat">
                    <span className="stat-label">SPD</span>
                    <span className="stat-value">45km/h</span>
                </div>
                <div className="viz-stat">
                    <span className="stat-label">HEAD</span>
                    <span className="stat-value">142°</span>
                </div>
            </div>

            <style>{`
        .drone-viz {
          display: flex;
          flex-direction: column;
          overflow: hidden;
          height: 100%;
          min-height: 300px;
        }
        
        .viz-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          border-bottom: 1px solid var(--border-glass);
        }
        
        .viz-title {
          font-family: var(--font-display);
          font-size: 10px;
          font-weight: 600;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 2px;
        }
        
        .viz-status {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-mono);
          font-size: 12px;
          font-weight: 700;
          color: var(--redwing-crimson);
        }
        
        .status-dot {
          width: 8px;
          height: 8px;
          background: var(--phosphor-green);
          border-radius: 50%;
        }
        
        .canvas-container {
          flex: 1;
          min-height: 200px;
          background: radial-gradient(ellipse at center, rgba(211, 47, 47, 0.05) 0%, transparent 70%);
        }
        
        .viz-footer {
          display: flex;
          justify-content: space-around;
          padding: 12px 16px;
          border-top: 1px solid var(--border-glass);
          background: rgba(0, 0, 0, 0.3);
        }
        
        .viz-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }
        
        .stat-label {
          font-family: var(--font-mono);
          font-size: 9px;
          color: #555;
          letter-spacing: 1px;
        }
        
        .stat-value {
          font-family: var(--font-mono);
          font-size: 14px;
          font-weight: 700;
          color: var(--phosphor-green);
          text-shadow: var(--phosphor-glow);
        }
      `}</style>
        </motion.div>
    )
}
