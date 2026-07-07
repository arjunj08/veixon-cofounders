'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef, useState, useEffect } from 'react'
import * as THREE from 'three'

function ParticleSphere({ isHovered }: { isHovered: boolean }) {
  const pointsRef = useRef<THREE.Points | null>(null)
  const ringRef = useRef<THREE.Mesh | null>(null)
  const coreRef = useRef<THREE.Mesh | null>(null)
  
  const count = 400

  // Generate particles distributed evenly on a sphere
  const [positions, initialPositions] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const initPos = []

    for (let i = 0; i < count; i++) {
      // Golden spiral distribution on sphere
      const phi = Math.acos(1 - (2 * (i + 0.5)) / count)
      const theta = Math.sqrt(count * Math.PI) * phi

      const x = Math.cos(theta) * Math.sin(phi)
      const y = Math.sin(theta) * Math.sin(phi)
      const z = Math.cos(phi)

      pos[i * 3] = x
      pos[i * 3 + 1] = y
      pos[i * 3 + 2] = z

      initPos.push({ x, y, z, phi, theta })
    }

    return [pos, initPos]
  }, [])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    // Spin speed matches hover state
    const speed = isHovered ? 0.9 : 0.28
    
    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * speed
      pointsRef.current.rotation.x = time * speed * 0.4
    }

    if (ringRef.current) {
      // Outer sci-fi ring orbits in opposite direction
      ringRef.current.rotation.x = -time * (speed * 0.5)
      ringRef.current.rotation.y = time * (speed * 0.3)
      const ringScale = 1.35 + Math.sin(time * 2.5) * 0.05
      ringRef.current.scale.set(ringScale, ringScale, ringScale)
    }

    if (coreRef.current) {
      // Core sphere pulses inside
      coreRef.current.rotation.z = -time * 0.2
      const coreScale = 0.38 + Math.sin(time * 4) * 0.04
      coreRef.current.scale.set(coreScale, coreScale, coreScale)
    }

    // Morph the sphere particles with sine waves (energy pulse)
    const geom = pointsRef.current?.geometry
    if (geom) {
      const posAttr = geom.getAttribute('position') as THREE.BufferAttribute
      const noiseScale = isHovered ? 0.26 : 0.13
      const pulseSpeed = isHovered ? 6.0 : 2.8

      for (let i = 0; i < count; i++) {
        const p = initialPositions[i]
        const wave = Math.sin(p.phi * 8 + time * pulseSpeed) * Math.cos(p.theta * 6 + time * pulseSpeed) * noiseScale
        const radius = 1.1 + wave

        posAttr.setXYZ(i, p.x * radius, p.y * radius, p.z * radius)
      }
      posAttr.needsUpdate = true
    }
  })

  // Circular glow texture
  const dotTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 16
    canvas.height = 16
    const ctx = canvas.getContext('2d')
    if (ctx) {
      const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8)
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)')
      grad.addColorStop(0.3, 'rgba(139, 92, 246, 0.8)') // Violet glow
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, 16, 16)
    }
    return new THREE.CanvasTexture(canvas)
  }, [])

  return (
    <group>
      {/* 3D Core Energy Sphere */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial 
          color={isHovered ? '#22d3ee' : '#a78bfa'} 
          wireframe 
          transparent 
          opacity={0.3} 
        />
      </mesh>

      {/* Orbiting wireframe Torus (Sci-Fi orbital shield ring) */}
      <mesh ref={ringRef}>
        <torusGeometry args={[1.1, 0.02, 6, 24]} />
        <meshBasicMaterial
          color={isHovered ? '#06b6d4' : '#6d5df6'}
          wireframe
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Sphere particles shell */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={positions}
            count={count}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.15}
          map={dotTexture}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  )
}

export default function VznMatrixCore() {
  const [hasWebGL, setHasWebGL] = useState(true)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      setHasWebGL(
        !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')))
      )
    } catch {
      setHasWebGL(false)
    }
  }, [])

  if (!hasWebGL) {
    return (
      <div className="h-28 w-28 rounded-full bg-gradient-to-tr from-[var(--purple)] to-[var(--teal)] animate-pulse opacity-80" />
    )
  }

  return (
    <div
      className="relative h-[160px] w-full flex items-center justify-center cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow Backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.15),transparent_60%)] pointer-events-none" />
      
      <Canvas camera={{ position: [0, 0, 2.5], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <ParticleSphere isHovered={isHovered} />
      </Canvas>
    </div>
  )
}
