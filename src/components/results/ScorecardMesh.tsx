'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Line } from '@react-three/drei'
import { useMemo, useRef, useState, useEffect } from 'react'
import * as THREE from 'three'

interface ScoreData {
  score: number
  explanation: string
}

interface ScorecardMeshProps {
  data: Record<string, ScoreData>
}

const KEYS = ['market', 'moat', 'timing', 'founderFit', 'monetisation', 'executionRisk']

function MeshScene({ data, isHovered }: { data: Record<string, ScoreData>; isHovered: boolean }) {
  const groupRef = useRef<THREE.Group | null>(null)
  const pointerRef = useRef({ x: 0, y: 0 })

  // Animate the rotation and tilt based on mouse interaction
  useFrame((state) => {
    if (!groupRef.current) return

    // Idle auto-rotation
    groupRef.current.rotation.y += 0.006

    // Tilt camera/mesh slightly based on pointer position
    const targetX = state.pointer.x * 0.4
    const targetY = state.pointer.y * 0.4

    pointerRef.current.x += (targetX - pointerRef.current.x) * 0.1
    pointerRef.current.y += (targetY - pointerRef.current.y) * 0.1

    groupRef.current.rotation.x = pointerRef.current.y
    groupRef.current.rotation.z = -pointerRef.current.x * 0.5
  })

  // Extract score values (default to 5 if not found)
  const scores = useMemo(() => {
    return KEYS.map((k) => Number(data[k]?.score ?? 5))
  }, [data])

  const maxRadius = 3.5

  // Calculate the vertices for the 3D radar mesh
  const { vertices, indices, linePoints } = useMemo(() => {
    const verts: number[] = []
    const linePts: [number, number, number][] = []

    // Center point (offset along Z to make it a 3D cone/umbrella)
    verts.push(0, 0, 0.4)

    // Calculate outer score vertices
    KEYS.forEach((_, i) => {
      const angle = (i * Math.PI * 2) / 6
      const r = (scores[i] / 10) * maxRadius
      const x = Math.cos(angle) * r
      const y = Math.sin(angle) * r
      const z = 0 // flat base offset

      verts.push(x, y, z)
      linePts.push([x, y, z])
    })

    // Indices for building 6 triangular faces (fan structure)
    // Face 0: center (0), vertex 1, vertex 2
    // Face 5: center (0), vertex 6, vertex 1
    const inds: number[] = []
    for (let i = 1; i <= 6; i++) {
      const next = i === 6 ? 1 : i + 1
      inds.push(0, i, next)
    }

    return {
      vertices: new Float32Array(verts),
      indices: new Uint16Array(inds),
      linePoints: [...linePts, linePts[0]], // Close the loop
    }
  }, [scores])

  // Concentric background grid rings (scores 3, 6, 10)
  const gridRings = useMemo(() => {
    const rings = [3, 6, 10]
    return rings.map((val) => {
      const pts: [number, number, number][] = []
      const r = (val / 10) * maxRadius
      for (let i = 0; i <= 32; i++) {
        const angle = (i * Math.PI * 2) / 32
        pts.push([Math.cos(angle) * r, Math.sin(angle) * r, 0])
      }
      return pts
    })
  }, [])

  // Background radial axis lines
  const axisLines = useMemo(() => {
    return KEYS.map((_, i) => {
      const angle = (i * Math.PI * 2) / 6
      const x = Math.cos(angle) * maxRadius
      const y = Math.sin(angle) * maxRadius
      return [[0, 0, 0], [x, y, 0]] as [number, number, number][]
    })
  }, [])

  return (
    <group ref={groupRef}>
      {/* Dynamic Radar Polygon Mesh (Solid Fill) */}
      <mesh>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={vertices}
            count={7}
            itemSize={3}
          />
          <bufferAttribute
            attach="index"
            array={indices}
            count={indices.length}
            itemSize={1}
          />
        </bufferGeometry>
        <meshPhongMaterial
          color="#8B5CF6"
          emissive="#7C3AED"
          emissiveIntensity={0.3}
          side={THREE.DoubleSide}
          transparent
          opacity={0.35}
          shininess={100}
        />
      </mesh>

      {/* Scorecard Glowing Border line */}
      <Line
        points={linePoints}
        color="#8B5CF6"
        lineWidth={3}
      />

      {/* Grid rings (Reference markings) */}
      {gridRings.map((pts, i) => (
        <Line
          key={i}
          points={pts}
          color="#3B82F6"
          lineWidth={1}
          dashed
          dashSize={0.1}
          gapSize={0.05}
          opacity={0.3}
          transparent
        />
      ))}

      {/* Radial axes lines */}
      {axisLines.map((pts, i) => (
        <Line
          key={i}
          points={pts}
          color="#334155"
          lineWidth={1.5}
          opacity={0.4}
          transparent
        />
      ))}

      {/* Small spheres on data points */}
      {linePoints.slice(0, 6).map((pt, i) => (
        <mesh key={i} position={pt}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color={KEYS[i] === 'executionRisk' ? '#EF4444' : '#06B6D4'} />
        </mesh>
      ))}
    </group>
  )
}

export default function ScorecardMesh({ data }: ScorecardMeshProps) {
  const [hasWebGL, setHasWebGL] = useState(true)
  const [isHovered, setIsHovered] = useState(false)

  // Verify WebGL availability
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
    // Fallback: 2D Blueprint graphic/message
    return (
      <div className="flex h-full w-full flex-col items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-6 text-center text-sm text-[var(--text-muted)]">
        <div className="h-28 w-28 rounded-full border border-dashed border-[var(--purple)]/40 flex items-center justify-center animate-pulse mb-4">
          <div className="h-16 w-16 rounded-full border border-[var(--purple)]/60 flex items-center justify-center">
            <span className="text-[var(--purple)] text-xs font-mono">3D</span>
          </div>
        </div>
        <p className="font-semibold text-white">WebGL Disabled or Unsupported</p>
        <p className="mt-1 text-xs">Enable hardware acceleration in your browser settings to view the interactive 3D Scorecard model.</p>
      </div>
    )
  }

  return (
    <div 
      className="relative h-[320px] w-full rounded-2xl border border-[var(--border)] bg-[#050505]/40 backdrop-blur-sm overflow-hidden group/canvas"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Title Tag overlay */}
      <div className="absolute left-4 top-4 z-10 font-mono text-[10px] text-[var(--purple)] uppercase tracking-wider bg-[var(--purple)]/10 px-2 py-0.5 rounded border border-[var(--purple)]/30">
        3D DNA Radar View
      </div>

      <div className="absolute right-4 top-4 z-10 font-mono text-[9px] text-[var(--text-muted)]">
        DRAG TO ROTATE
      </div>

      <Canvas camera={{ position: [0, 0, 4.5], fov: 60 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} />
        <pointLight position={[-10, -10, -5]} intensity={0.6} color="#7C3AED" />
        <MeshScene data={data} isHovered={isHovered} />
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  )
}
