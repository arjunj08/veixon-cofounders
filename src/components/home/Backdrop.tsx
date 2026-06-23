'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

// ---- shared interaction state ----
const pointer = { x: 0, y: 0 }
const scroll = { p: 0, smooth: 0 }
if (typeof window !== 'undefined') {
  window.addEventListener('mousemove', (e) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1
    pointer.y = -((e.clientY / window.innerHeight) * 2 - 1)
  })
  window.addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - window.innerHeight
    scroll.p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
  }, { passive: true })
}

const FAR = -28
const PR = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1

// ---------- procedural textures (canvas, no external assets) ----------
function rn(seed: number) { return (a: number, b: number) => { const n = Math.sin((a * 127.1 + b * 311.7 + seed) * 1.0) * 43758.5453; return n - Math.floor(n) } }
function fbmTex(make: (d: Uint8ClampedArray, S: number) => void) {
  const S = 256, c = document.createElement('canvas'); c.width = c.height = S
  const x = c.getContext('2d')!; const img = x.createImageData(S, S); make(img.data, S); x.putImageData(img, 0, 0)
  return new THREE.CanvasTexture(c)
}
function rockTex(r: number, g: number, bl: number, rough: number, seed: number) {
  const n = rn(seed)
  const vv = (a: number, b: number) => { const ai = Math.floor(a), bi = Math.floor(b), af = a - ai, bf = b - bi, tl = n(ai, bi), tr = n(ai + 1, bi), blq = n(ai, bi + 1), br = n(ai + 1, bi + 1), u = af * af * (3 - 2 * af), v = bf * bf * (3 - 2 * bf); return tl * (1 - u) * (1 - v) + tr * u * (1 - v) + blq * (1 - u) * v + br * u * v }
  const fb = (a: number, b: number) => { let s = 0, am = 0.5, f = 1; for (let o = 0; o < 5; o++) { s += am * vv(a * f, b * f); f *= 2; am *= 0.5 } return s }
  return fbmTex((d, S) => { for (let y = 0; y < S; y++) for (let xx = 0; xx < S; xx++) { const nn = fb(xx / S * 6, y / S * 6), sh = (nn - 0.5) * rough * 150, i = (y * S + xx) * 4; d[i] = Math.max(0, Math.min(255, r + sh)); d[i + 1] = Math.max(0, Math.min(255, g + sh)); d[i + 2] = Math.max(0, Math.min(255, bl + sh)); d[i + 3] = 255 } })
}
function gasTex(bands: number[][], seed: number) {
  const n = rn(seed)
  const vv = (a: number, b: number) => { const ai = Math.floor(a), bi = Math.floor(b), af = a - ai, bf = b - bi, tl = n(ai, bi), tr = n(ai + 1, bi), blq = n(ai, bi + 1), br = n(ai + 1, bi + 1), u = af * af * (3 - 2 * af), v = bf * bf * (3 - 2 * bf); return tl * (1 - u) * (1 - v) + tr * u * (1 - v) + blq * (1 - u) * v + br * u * v }
  return fbmTex((d, S) => { for (let y = 0; y < S; y++) { const wob = Math.sin(y / S * Math.PI * 14) * 0.015; for (let xx = 0; xx < S; xx++) { let t = y / S + wob + vv(xx / S * 3, y / S * 22) * 0.04; t = Math.max(0, Math.min(0.999, t)); const fp = t * (bands.length - 1), bi = Math.floor(fp), bf = fp - bi, c0 = bands[bi], c1 = bands[Math.min(bands.length - 1, bi + 1)], st = (vv(xx / S * 8, y / S * 40) - 0.5) * 30, i = (y * S + xx) * 4; d[i] = Math.max(0, Math.min(255, c0[0] + (c1[0] - c0[0]) * bf + st)); d[i + 1] = Math.max(0, Math.min(255, c0[1] + (c1[1] - c0[1]) * bf + st)); d[i + 2] = Math.max(0, Math.min(255, c0[2] + (c1[2] - c0[2]) * bf + st)); d[i + 3] = 255 } } })
}
function cloudTex(seed: number) {
  const n = rn(seed)
  const vv = (a: number, b: number) => { const ai = Math.floor(a), bi = Math.floor(b), af = a - ai, bf = b - bi, tl = n(ai, bi), tr = n(ai + 1, bi), blq = n(ai, bi + 1), br = n(ai + 1, bi + 1), u = af * af * (3 - 2 * af), v = bf * bf * (3 - 2 * bf); return tl * (1 - u) * (1 - v) + tr * u * (1 - v) + blq * (1 - u) * v + br * u * v }
  const fb = (a: number, b: number) => { let s = 0, am = 0.5, f = 1; for (let o = 0; o < 6; o++) { s += am * vv(a * f, b * f); f *= 2; am *= 0.5 } return s }
  return fbmTex((d, S) => { for (let y = 0; y < S; y++) for (let xx = 0; xx < S; xx++) { const nn = fb(xx / S * 3.5 + seed, y / S * 3.5 - seed), dx = xx / S - 0.5, dy = y / S - 0.5, rr = Math.min(1, Math.sqrt(dx * dx + dy * dy) * 2.1), fall = Math.pow(Math.max(0, 1 - rr), 1.6), a = Math.max(0, (nn - 0.34)) * 1.9 * fall, i = (y * S + xx) * 4; d[i] = 255; d[i + 1] = 255; d[i + 2] = 255; d[i + 3] = Math.min(255, a * 255) } })
}

function Scene({ mode }: { mode: 'galaxy' | 'solar' }) {
  const { camera, scene } = useThree()
  const modeRef = useRef(mode); modeRef.current = mode
  const lastMode = useRef<string>('')

  const b = useMemo(() => {
    const mob = typeof window !== 'undefined' && window.innerWidth < 768
    const root = new THREE.Group()
    scene.fog = new THREE.Fog(0x05030f, 8, 70)

    // ---- clouds (corridor, biased below) ----
    const CT = cloudTex(0)
    const CN = mob ? 360 : 720
    const cp = new Float32Array(CN * 3), cs = new Float32Array(CN)
    for (let i = 0; i < CN; i++) { cp[i * 3] = (Math.random() - 0.5) * 36; cp[i * 3 + 1] = -1 - Math.random() * 7 + (Math.random() < 0.4 ? Math.random() * 10 : 0); cp[i * 3 + 2] = 11 - Math.random() * 33; cs[i] = 8 + Math.random() * 13 }
    const cg = new THREE.BufferGeometry(); cg.setAttribute('position', new THREE.BufferAttribute(cp, 3)); cg.setAttribute('aS', new THREE.BufferAttribute(cs, 1))
    const cloudMat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.NormalBlending,
      uniforms: { uTex: { value: CT }, uOp: { value: 0.62 }, uC: { value: new THREE.Color(0x9fb0e8) } },
      vertexShader: 'attribute float aS;uniform float uOp;varying float vO;void main(){vec4 mv=modelViewMatrix*vec4(position,1.0);gl_Position=projectionMatrix*mv;gl_PointSize=aS*300.0*(1.0/-mv.z);vO=uOp;}',
      fragmentShader: 'uniform sampler2D uTex;uniform vec3 uC;varying float vO;void main(){vec4 t=texture2D(uTex,gl_PointCoord);gl_FragColor=vec4(uC,t.a*vO);}',
    })
    root.add(new THREE.Points(cg, cloudMat))

    // ---- galaxy ----
    const galaxyG = new THREE.Group(); galaxyG.position.set(0, 1.2, FAR); galaxyG.rotation.x = 0.95; root.add(galaxyG)
    const spinG = new THREE.Group(); galaxyG.add(spinG)
    const Ns = mob ? 14000 : 26000, Nn = mob ? 4500 : 9000, Nc = 200, N = Ns + Nn + Nc, R = 9, ARMS = 5
    const pos = new Float32Array(N * 3), col = new Float32Array(N * 3), siz = new Float32Array(N), sd = new Float32Array(N), ty = new Float32Array(N)
    const C = (h: string) => new THREE.Color(h), white = C('#ffffff'), pinkHot = C('#ff4f8b'), pink = C('#ff85c2'), mag = C('#c45cff'), purp = C('#7a5cff'), blue = C('#3a6bff'), tmp = new THREE.Color()
    const arm = (rad: number): [number, number] => { const bb = (Math.floor(Math.random() * ARMS) / ARMS) * 6.2831, sp = rad * 0.8; return [Math.cos(bb + sp) * rad, Math.sin(bb + sp) * rad] }
    const colByT = (t: number) => { if (t < 0.16) return tmp.copy(white).lerp(pink, t / 0.16); if (t < 0.45) return tmp.copy(pink).lerp(mag, (t - 0.16) / 0.29); if (t < 0.7) return tmp.copy(mag).lerp(purp, (t - 0.45) / 0.25); return tmp.copy(purp).lerp(blue, (t - 0.7) / 0.3) }
    const sct = (p: number) => Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * p
    let k = 0
    const put = (x: number, y: number, z: number, c: THREE.Color, s: number, t: number) => { pos[k * 3] = x; pos[k * 3 + 1] = y; pos[k * 3 + 2] = z; col[k * 3] = c.r; col[k * 3 + 1] = c.g; col[k * 3 + 2] = c.b; siz[k] = s; sd[k] = Math.random(); ty[k] = t; k++ }
    for (let i = 0; i < Ns; i++) { const rad = Math.pow(Math.random(), 0.6) * R, a = arm(rad), t = rad / R; let c = colByT(t).clone(); const rr = Math.random(); if (rr < 0.07) c = white.clone(); else if (rr < 0.11) c = pinkHot.clone(); put(a[0] + sct(0.13 + rad * 0.045), sct(0.12 + rad * 0.012), a[1] + sct(0.13 + rad * 0.045), c, 8 + Math.random() * 16, 0) }
    for (let i = 0; i < Nn; i++) { const rad = Math.pow(Math.random(), 0.5) * R, a = arm(rad), t = rad / R, j = rad / R + 0.3; let c: THREE.Color; if (t < 0.35) c = pink.clone(); else if (t < 0.65) c = mag.clone().lerp(purp, 0.5); else c = blue.clone().lerp(purp, 0.4); put(a[0] + (Math.random() - 0.5) * 1.05 * j, (Math.random() - 0.5) * (0.3 + rad * 0.04), a[1] + (Math.random() - 0.5) * 1.05 * j, c, 95 + Math.random() * 175, 1) }
    for (let i = 0; i < Nc; i++) { const rad = Math.random() * 0.7, a = Math.random() * 6.2831; put(Math.cos(a) * rad, (Math.random() - 0.5) * 0.16, Math.sin(a) * rad, white.clone().lerp(pink, Math.random() * 0.3), 55 + Math.random() * 110, 1) }
    const gg = new THREE.BufferGeometry()
    gg.setAttribute('position', new THREE.BufferAttribute(pos, 3)); gg.setAttribute('aColor', new THREE.BufferAttribute(col, 3)); gg.setAttribute('aSize', new THREE.BufferAttribute(siz, 1)); gg.setAttribute('aSeed', new THREE.BufferAttribute(sd, 1)); gg.setAttribute('aType', new THREE.BufferAttribute(ty, 1))
    const galaxyMat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uPR: { value: PR } }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: 'attribute vec3 aColor;attribute float aSize,aSeed,aType;uniform float uTime,uPR;varying vec3 vC;varying float vTw;varying float vT;void main(){vec4 mv=modelViewMatrix*vec4(position,1.0);gl_Position=projectionMatrix*mv;gl_PointSize=aSize*uPR*(1.0/-mv.z);vC=aColor;vT=aType;vTw=aType>0.5?1.0:(0.5+0.5*sin(uTime*1.6+aSeed*6.2831));}',
      fragmentShader: 'varying vec3 vC;varying float vTw;varying float vT;void main(){vec2 c=gl_PointCoord-0.5;float d=length(c);if(d>0.5)discard;float a=vT>0.5?smoothstep(0.5,0.0,d)*0.15:pow(smoothstep(0.5,0.0,d),1.6);gl_FragColor=vec4(vC,a*vTw);}',
    })
    spinG.add(new THREE.Points(gg, galaxyMat))

    // ---- solar system ----
    const solarG = new THREE.Group(); solarG.position.set(0, 0.4, FAR); solarG.rotation.x = 0.42; solarG.visible = false; root.add(solarG)
    solarG.add(new THREE.Mesh(new THREE.SphereGeometry(1.5, 48, 48), new THREE.MeshBasicMaterial({ color: 0xfff2c0 })))
    const corona = new THREE.Mesh(new THREE.SphereGeometry(1.5, 48, 48), new THREE.ShaderMaterial({ transparent: true, side: THREE.BackSide, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: { uC: { value: new THREE.Color(0xffc24d) } }, vertexShader: 'varying vec3 vN;varying vec3 vV;void main(){vN=normalize(normalMatrix*normal);vec4 mv=modelViewMatrix*vec4(position,1.0);vV=normalize(-mv.xyz);gl_Position=projectionMatrix*mv;}', fragmentShader: 'uniform vec3 uC;varying vec3 vN;varying vec3 vV;void main(){float f=pow(1.0-max(dot(vN,vV),0.0),1.6);gl_FragColor=vec4(uC,f);}' }))
    corona.scale.setScalar(2.6); solarG.add(corona)
    const sunLight = new THREE.PointLight(0xfff0d0, 2.6, 200); solarG.add(sunLight)
    root.add(new THREE.AmbientLight(0x223344, 0.35))
    const PLAN = [
      { r: 2.7, s: 0.16, tex: rockTex(150, 140, 130, 0.7, 1), spd: 0.5 },
      { r: 3.5, s: 0.30, tex: rockTex(205, 170, 120, 0.35, 2), spd: 0.34 },
      { r: 4.5, s: 0.32, tex: rockTex(70, 120, 180, 0.9, 3), spd: 0.27 },
      { r: 5.4, s: 0.22, tex: rockTex(190, 90, 60, 0.6, 4), spd: 0.2 },
      { r: 7.6, s: 0.78, tex: gasTex([[210, 180, 140], [170, 120, 80], [220, 200, 165], [150, 100, 70], [200, 160, 120]], 11), spd: 0.12 },
      { r: 9.6, s: 0.6, tex: gasTex([[225, 205, 155], [205, 180, 125], [230, 215, 175]], 12), spd: 0.09, ring: true },
      { r: 11.4, s: 0.42, tex: gasTex([[70, 110, 210], [90, 140, 225], [60, 95, 190]], 13), spd: 0.06 },
    ] as const
    const planets: { orb: THREE.Group; spd: number; mesh: THREE.Mesh }[] = []
    PLAN.forEach((p) => {
      const orb = new THREE.Group(); orb.rotation.x = (Math.random() - 0.5) * 0.12; orb.rotation.y = Math.random() * 6.28
      const pl = new THREE.Mesh(new THREE.SphereGeometry(p.s, 32, 32), new THREE.MeshStandardMaterial({ map: p.tex, roughness: 0.92, metalness: 0.05 })); pl.position.x = p.r; orb.add(pl)
      if ((p as any).ring) { const rg = new THREE.Mesh(new THREE.RingGeometry(p.s * 1.4, p.s * 2.3, 64), new THREE.MeshBasicMaterial({ color: 0xd8c79a, transparent: true, opacity: 0.55, side: THREE.DoubleSide })); rg.rotation.x = Math.PI / 2.2; rg.position.x = p.r; orb.add(rg) }
      const oc = new THREE.EllipseCurve(0, 0, p.r, p.r, 0, Math.PI * 2), op = oc.getPoints(160).map((q) => new THREE.Vector3(q.x, 0, q.y)), og = new THREE.BufferGeometry().setFromPoints(op)
      orb.add(new THREE.LineLoop(og, new THREE.LineBasicMaterial({ color: 0x8aa0c8, transparent: true, opacity: 0.12 })))
      solarG.add(orb); planets.push({ orb, spd: p.spd, mesh: pl })
    })
    // asteroid belt
    const beltN = 900, bpos = new Float32Array(beltN * 3)
    for (let i = 0; i < beltN; i++) { const a = Math.random() * 6.2831, rr = 6.4 + (Math.random() - 0.5) * 0.5; bpos[i * 3] = Math.cos(a) * rr; bpos[i * 3 + 1] = (Math.random() - 0.5) * 0.25; bpos[i * 3 + 2] = Math.sin(a) * rr }
    const bg = new THREE.BufferGeometry(); bg.setAttribute('position', new THREE.BufferAttribute(bpos, 3))
    const belt1 = new THREE.Points(bg, new THREE.PointsMaterial({ color: 0xb89a6a, size: 0.05, transparent: true, opacity: 0.85, sizeAttenuation: true })); solarG.add(belt1)

    // space background (stars + nebula) for solar mode
    const spaceBg = new THREE.Group(); spaceBg.position.z = FAR; spaceBg.visible = false; root.add(spaceBg)
    const SN = mob ? 800 : 1600, sp = new Float32Array(SN * 3)
    for (let i = 0; i < SN; i++) { const r = 20 + Math.random() * 40, th = Math.random() * 6.2831, ph = Math.acos(Math.random() * 2 - 1); sp[i * 3] = r * Math.sin(ph) * Math.cos(th); sp[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th); sp[i * 3 + 2] = r * Math.cos(ph) }
    const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.BufferAttribute(sp, 3))
    spaceBg.add(new THREE.Points(sg, new THREE.PointsMaterial({ color: 0xffffff, size: 0.12, transparent: true, opacity: 0.85, sizeAttenuation: true })))

    return { root, cloudMat, galaxyMat, galaxyG, spinG, solarG, spaceBg, belt1, planets }
  }, [scene])

  useFrame((state, dt) => {
    scroll.smooth += (scroll.p - scroll.smooth) * Math.min(1, dt * 3)
    const t = state.clock.elapsedTime
    const travel = Math.min(1, scroll.smooth / 0.45)
    const ease = travel * travel * (3 - 2 * travel)
    const cam = camera as THREE.PerspectiveCamera
    cam.position.z = 10 + (-14 - 10) * ease // fly from z=10 to z=-14 → galaxy (at -28) fills the window
    cam.position.x += (pointer.x * 0.5 - cam.position.x) * Math.min(1, dt * 2)
    cam.position.y += (pointer.y * 0.4 + 1.0 * ease - cam.position.y) * Math.min(1, dt * 2)
    cam.lookAt(0, 1.0 * ease + 1.0, FAR)

    b.cloudMat.uniforms.uOp.value = 0.62 * (1 - Math.min(1, scroll.smooth / 0.3))

    const dark = modeRef.current === 'galaxy'
    b.galaxyG.visible = dark
    b.solarG.visible = !dark
    b.spaceBg.visible = !dark

    if (dark) {
      b.galaxyMat.uniforms.uTime.value = t
      b.spinG.rotation.y += dt * 0.045
      b.galaxyG.rotation.x += (0.95 + pointer.y * 0.1 - b.galaxyG.rotation.x) * Math.min(1, dt * 2)
      b.galaxyG.rotation.z += (pointer.x * 0.1 - b.galaxyG.rotation.z) * Math.min(1, dt * 2)
    } else {
      b.planets.forEach((p) => { p.orb.rotation.y += p.spd * dt; p.mesh.rotation.y += dt * 0.3 })
      b.belt1.rotation.y += dt * 0.02
      b.solarG.rotation.y += dt * 0.02
      b.solarG.rotation.x += (0.42 + pointer.y * 0.06 - b.solarG.rotation.x) * Math.min(1, dt * 2)
      b.solarG.rotation.z += (pointer.x * 0.06 - b.solarG.rotation.z) * Math.min(1, dt * 2)
    }

    if (modeRef.current !== lastMode.current) {
      lastMode.current = modeRef.current
      const bg = dark ? 0x05030f : 0x071210
      scene.background = new THREE.Color(bg)
      if (scene.fog) (scene.fog as THREE.Fog).color.set(bg)
    }
  })

  return <primitive object={b.root} />
}

export default function Backdrop({ mode = 'galaxy' }: { mode?: 'galaxy' | 'solar' }) {
  const mobile = typeof window !== 'undefined' && window.innerWidth < 768
  return (
    <Canvas
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      dpr={[1, mobile ? 1.5 : 2]}
      camera={{ position: [0, 0, 10], fov: 55 }}
      style={{ position: 'fixed', inset: 0 }}
    >
      <color attach="background" args={[mode === 'galaxy' ? '#05030f' : '#071210']} />
      <Scene mode={mode} />
    </Canvas>
  )
}
