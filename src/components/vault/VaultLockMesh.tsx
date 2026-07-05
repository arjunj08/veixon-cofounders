'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Torus, Cylinder } from '@react-three/drei'
import { useMemo, useRef, useState, useEffect } from 'react'
import * as THREE from 'three'

interface VaultLockMeshProps {
  taskCompletion: number
  accountability: number
  traction: boolean
}

function LockScene({ taskCompletion, accountability, traction }: VaultLockMeshProps) {
  const groupRef = useRef<THREE.Group | null>(null)
  const dialRef = useRef<THREE.Mesh | null>(null)
  const velocityRef = useRef(0.015)
  const isDragging = useRef(false)

  // Rotate the lock dial dynamically
  useFrame(() => {
    if (!dialRef.current || !groupRef.current) return

    // Standard slow rotation
    if (!isDragging.current) {
      dialRef.current.rotation.y += velocityRef.current
      // Apply friction/decay to spin velocity back to base speed
      velocityRef.current += (0.005 - velocityRef.current) * 0.05
    }

    // Dynamic tilt animation
    groupRef.current.rotation.x = Math.sin(Date.now() * 0.001) * 0.08
    groupRef.current.rotation.z = Math.cos(Date.now() * 0.0015) * 0.05
  })

  // Dial tick marks
  const ticks = useMemo(() => {
    const pts = []
    const count = 20
    const radius = 1.35
    for (let i = 0; i < count; i++) {
      const angle = (i * Math.PI * 2) / count
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      pts.push(new THREE.Vector3(x, 0.05, z))
    }
    return pts
  }, [])

  return (
    <group ref={groupRef}>
      {/* Outer Dial casing (Chamber) */}
      <Cylinder args={[1.7, 1.8, 0.3, 32]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial
          color="#1e1b4b"
          metalness={0.9}
          roughness={0.2}
          emissive="#534ab7"
          emissiveIntensity={0.1}
        />
      </Cylinder>

      {/* Rotating Dial Ring */}
      <mesh
        ref={dialRef}
        onPointerDown={() => {
          isDragging.current = true
        }}
        onPointerUp={() => {
          isDragging.current = false
        }}
        onPointerMove={(e) => {
          if (isDragging.current) {
            velocityRef.current = e.movementX * 0.005
          }
        }}
      >
        {/* Main Dial wheel */}
        <Cylinder args={[1.4, 1.5, 0.25, 32]} position={[0, 0, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#312e81" metalness={0.95} roughness={0.15} />
        </Cylinder>

        {/* Ticks on Dial Ring */}
        {ticks.map((pt, i) => (
          <mesh key={i} position={[pt.x, pt.z, 0.18]}>
            <boxGeometry args={[0.04, 0.08, 0.04]} />
            <meshBasicMaterial color={i % 5 === 0 ? '#10B981' : '#818CF8'} />
          </mesh>
        ))}
      </mesh>

      {/* Inner Lock Knob / Combination Grip */}
      <Cylinder args={[0.7, 0.85, 0.4, 6]} position={[0, 0, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial
          color="#4f46e5"
          metalness={0.99}
          roughness={0.1}
          emissive="#4f46e5"
          emissiveIntensity={traction ? 0.3 : 0.05}
        />
      </Cylinder>

      {/* Center Lock Core Status indicator */}
      <Cylinder args={[0.2, 0.2, 0.05, 16]} position={[0, 0, 0.42]} rotation={[Math.PI / 2, 0, 0]}>
        <meshBasicMaterial color={traction ? '#10B981' : '#EF4444'} />
      </Cylinder>

      {/* Circular Glowing Ring */}
      <Torus args={[1.5, 0.03, 8, 32]} position={[0, 0, 0.08]}>
        <meshBasicMaterial color="#6366f1" transparent opacity={0.6} />
      </Torus>
    </group>
  )
}

export default function VaultLockMesh({ taskCompletion, accountability, traction }: VaultLockMeshProps) {
  const [hasWebGL, setHasWebGL] = useState(true)

  // Verify WebGL support
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      const support = !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      )
      setHasWebGL(support)
    } catch {
      setHasWebGL(false)
    }
  }, [])

  if (!hasWebGL) {
    return null
  }

  return (
    <div className="relative h-[240px] w-[240px] mx-auto overflow-hidden cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [0, 0, 3.8], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        <pointLight position={[-5, -5, -3]} intensity={0.8} color="#4f46e5" />
        <LockScene
          taskCompletion={taskCompletion}
          accountability={accountability}
          traction={traction}
        />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  )
}
