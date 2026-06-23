'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

function AuthParticles() {
  const ref = useRef<THREE.Points>(null)
  const [color, setColor] = useState('rgb(83, 74, 183)')
  const positions = useMemo(() => {
    const buffer = new Float32Array(80 * 3)
    for (let i = 0; i < 80; i++) {
      buffer[i * 3] = (Math.random() - 0.5) * 18
      buffer[i * 3 + 1] = (Math.random() - 0.5) * 10
      buffer[i * 3 + 2] = (Math.random() - 0.5) * 12
    }
    return buffer
  }, [])

  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.y = Math.sin(clock.elapsedTime * 0.08) * 0.08
  })

  useEffect(() => {
    setColor(getComputedStyle(document.documentElement).getPropertyValue('--purple').trim())
  }, [])

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={80} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.055} color={color} transparent opacity={0.2} />
    </points>
  )
}

export default function AuthCanvas() {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 55 }} gl={{ antialias: true, alpha: true }} className="h-full w-full">
      <ambientLight intensity={0.4} />
      <AuthParticles />
    </Canvas>
  )
}
