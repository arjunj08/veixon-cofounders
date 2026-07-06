'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef, useState, useEffect } from 'react'
import * as THREE from 'three'

interface OathPortalProps {
  oathLength: number
}

function PortalScene({ oathLength }: { oathLength: number }) {
  const pointsRef = useRef<THREE.Points | null>(null)
  const pointsOuterRef = useRef<THREE.Points | null>(null)
  const sphereRef = useRef<THREE.Mesh | null>(null)
  const ringRef = useRef<THREE.Mesh | null>(null)
  
  const countInner = 300
  const countOuter = 200

  // Calculate coordinates for the inner ring
  const [positionsInner, initialPositionsInner] = useMemo(() => {
    const pos = new Float32Array(countInner * 3)
    const init = []

    for (let i = 0; i < countInner; i++) {
      const angle = (i * Math.PI * 2) / countInner
      const radius = 1.3

      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius
      const z = (Math.random() - 0.5) * 0.15

      pos[i * 3] = x
      pos[i * 3 + 1] = y
      pos[i * 3 + 2] = z

      init.push({ x, y, z, angle, radius })
    }

    return [pos, init]
  }, [])

  // Calculate coordinates for the outer ring (opposite orbit)
  const [positionsOuter, initialPositionsOuter] = useMemo(() => {
    const pos = new Float32Array(countOuter * 3)
    const init = []

    for (let i = 0; i < countOuter; i++) {
      const angle = (i * Math.PI * 2) / countOuter
      const radius = 1.8

      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius
      const z = (Math.random() - 0.5) * 0.25

      pos[i * 3] = x
      pos[i * 3 + 1] = y
      pos[i * 3 + 2] = z

      init.push({ x, y, z, angle, radius })
    }

    return [pos, init]
  }, [])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    const completionRatio = Math.min(oathLength / 200, 1.0)
    
    const speed = 0.6 + completionRatio * 2.5
    const waveIntensityInner = 0.08 + completionRatio * 0.18
    const waveIntensityOuter = 0.05 + completionRatio * 0.22

    // Spin inner particles
    if (pointsRef.current) {
      pointsRef.current.rotation.z = time * speed
      pointsRef.current.rotation.y = Math.sin(time * 0.5) * 0.2
    }

    // Spin outer particles (reverse orbit)
    if (pointsOuterRef.current) {
      pointsOuterRef.current.rotation.z = -time * (speed * 0.7)
      pointsOuterRef.current.rotation.x = Math.cos(time * 0.5) * 0.2
    }

    // Rotate core wireframe torus
    if (ringRef.current) {
      ringRef.current.rotation.x = time * 0.8
      ringRef.current.rotation.y = time * 0.5
      const scale = 0.95 + completionRatio * 0.3
      ringRef.current.scale.set(scale, scale, scale)
    }

    // Scale and rotate core sphere
    if (sphereRef.current) {
      sphereRef.current.rotation.y = time * 0.5
      sphereRef.current.rotation.x = time * 0.3
      const scale = 0.65 + Math.sin(time * 3) * 0.05 + completionRatio * 0.25
      sphereRef.current.scale.set(scale, scale, scale)
    }

    // Animate inner points
    const geomInner = pointsRef.current?.geometry
    if (geomInner) {
      const posAttr = geomInner.getAttribute('position') as THREE.BufferAttribute
      for (let i = 0; i < countInner; i++) {
        const pt = initialPositionsInner[i]
        const currentRadius = pt.radius + Math.sin(time * 4.5 + pt.angle * 8) * waveIntensityInner
        const x = Math.cos(pt.angle) * currentRadius
        const y = Math.sin(pt.angle) * currentRadius
        const z = Math.sin(time * 5 + pt.angle * 6) * 0.25
        posAttr.setXYZ(i, x, y, z)
      }
      posAttr.needsUpdate = true
    }

    // Animate outer points
    const geomOuter = pointsOuterRef.current?.geometry
    if (geomOuter) {
      const posAttr = geomOuter.getAttribute('position') as THREE.BufferAttribute
      for (let i = 0; i < countOuter; i++) {
        const pt = initialPositionsOuter[i]
        const currentRadius = pt.radius + Math.cos(time * 3.5 + pt.angle * 5) * waveIntensityOuter
        const x = Math.cos(pt.angle) * currentRadius
        const y = Math.sin(pt.angle) * currentRadius
        const z = Math.cos(time * 3 + pt.angle * 8) * 0.3
        posAttr.setXYZ(i, x, y, z)
      }
      posAttr.needsUpdate = true
    }
  })

  // Circular glow texture for high fidelity particles
  const particleTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 32
    canvas.height = 32
    const ctx = canvas.getContext('2d')
    if (ctx) {
      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16)
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)')
      grad.addColorStop(0.2, 'rgba(129, 140, 248, 0.9)') // Indigo aura
      grad.addColorStop(0.4, 'rgba(6, 182, 212, 0.6)')   // Cyan glow
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, 32, 32)
    }
    return new THREE.CanvasTexture(canvas)
  }, [])

  const completionRatio = Math.min(oathLength / 200, 1.0)
  const coreColor = completionRatio > 0.5 ? '#06b6d4' : '#6366f1'
  const emissiveColor = completionRatio > 0.5 ? '#22d3ee' : '#818cf8'

  return (
    <group>
      {/* 3D Glowing Core Sphere */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[0.52, 32, 32]} />
        <meshPhysicalMaterial
          color={coreColor}
          emissive={emissiveColor}
          emissiveIntensity={0.5 + completionRatio * 1.5}
          roughness={0.1}
          metalness={0.9}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Orbiting wireframe Torus (Sci-Fi orbital shield ring) */}
      <mesh ref={ringRef}>
        <torusGeometry args={[0.82, 0.04, 8, 32]} />
        <meshBasicMaterial
          color={completionRatio > 0.5 ? '#22d3ee' : '#a5b4fc'}
          wireframe
          transparent
          opacity={0.4 + completionRatio * 0.4}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Concentric Inner Particle Ring */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={positionsInner}
            count={countInner}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.12 + completionRatio * 0.08}
          map={particleTexture}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Outer Counter-Orbiting Particle Dust Ring */}
      <points ref={pointsOuterRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={positionsOuter}
            count={countOuter}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.1 + completionRatio * 0.06}
          map={particleTexture}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  )
}

export default function OathPortal({ oathLength }: OathPortalProps) {
  const [hasWebGL, setHasWebGL] = useState(true)

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
      <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-tr from-[var(--purple)] to-[var(--teal)] animate-pulse opacity-85" />
    )
  }

  return (
    <div className="relative h-[220px] w-full flex items-center justify-center pointer-events-none">
      {/* Background glowing halo */}
      <div 
        className="absolute h-36 w-36 rounded-full blur-[40px] opacity-40 transition-colors duration-500" 
        style={{
          background: oathLength > 100 
            ? 'radial-gradient(circle, var(--teal) 0%, transparent 70%)' 
            : 'radial-gradient(circle, var(--purple) 0%, transparent 70%)'
        }}
      />
      <Canvas camera={{ position: [0, 0, 2.5], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} intensity={1.5} />
        <pointLight position={[-5, -5, -5]} intensity={0.5} />
        <PortalScene oathLength={oathLength} />
      </Canvas>
    </div>
  )
}
