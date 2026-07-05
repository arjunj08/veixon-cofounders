'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef, useState, useEffect } from 'react'
import * as THREE from 'three'

interface OathPortalProps {
  oathLength: number
}

function PortalScene({ oathLength }: { oathLength: number }) {
  const pointsRef = useRef<THREE.Points | null>(null)
  const sphereRef = useRef<THREE.Mesh | null>(null)
  const count = 180

  // Calculate coordinates for the ring
  const [positions, initialPositions] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const init = []

    for (let i = 0; i < count; i++) {
      const angle = (i * Math.PI * 2) / count
      const radius = 1.4

      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius
      const z = (Math.random() - 0.5) * 0.1

      pos[i * 3] = x
      pos[i * 3 + 1] = y
      pos[i * 3 + 2] = z

      init.push({ x, y, z, angle, radius })
    }

    return [pos, init]
  }, [])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    const geom = pointsRef.current?.geometry
    if (!geom) return
    const posAttr = geom.getAttribute('position') as THREE.BufferAttribute

    // Spin speed and energy multiplier based on how long the typed oath is (0 to 200)
    const completionRatio = Math.min(oathLength / 200, 1.0)
    const speed = 0.5 + completionRatio * 2.0
    const waveIntensity = 0.05 + completionRatio * 0.15

    if (pointsRef.current) {
      pointsRef.current.rotation.z = time * speed
    }

    if (sphereRef.current) {
      sphereRef.current.rotation.y = time * 0.2
      sphereRef.current.rotation.x = time * 0.1
      // Pulsate the center sphere scale slightly
      const scale = 0.65 + Math.sin(time * 3) * 0.04 + completionRatio * 0.15
      sphereRef.current.scale.set(scale, scale, scale)
    }

    // Animate individual points in a wavy, expanding ring
    for (let i = 0; i < count; i++) {
      const pt = initialPositions[i]
      const currentRadius = pt.radius + Math.sin(time * 3 + pt.angle * 6) * waveIntensity
      const x = Math.cos(pt.angle) * currentRadius
      const y = Math.sin(pt.angle) * currentRadius
      const z = Math.sin(time * 4 + pt.angle * 5) * 0.15

      posAttr.setXYZ(i, x, y, z)
    }

    posAttr.needsUpdate = true
  })

  // Circular texture
  const particleTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 16
    canvas.height = 16
    const ctx = canvas.getContext('2d')
    if (ctx) {
      const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8)
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)')
      grad.addColorStop(0.3, 'rgba(6, 182, 212, 0.8)') // Teal/Cyan core
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, 16, 16)
    }
    return new THREE.CanvasTexture(canvas)
  }, [])

  const completionRatio = Math.min(oathLength / 200, 1.0)

  return (
    <group>
      {/* Center energy core */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color={completionRatio > 0.5 ? '#06B6D4' : '#7C3AED'}
          emissive={completionRatio > 0.5 ? '#22D3EE' : '#6366f1'}
          emissiveIntensity={0.25 + completionRatio * 0.6}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Orbiting ring of code particles */}
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
          size={0.12 + completionRatio * 0.08}
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
    <div className="relative h-[200px] w-full flex items-center justify-center pointer-events-none">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.1),transparent_60%)] pointer-events-none" />
      <Canvas camera={{ position: [0, 0, 2.5], fov: 60 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[2, 2, 2]} intensity={1.5} />
        <PortalScene oathLength={oathLength} />
      </Canvas>
    </div>
  )
}
