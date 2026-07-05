'use client'

import { useEffect, useRef } from 'react'
import type * as THREE from 'three'

export default function CosmicBackdrop() {
  const mountRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = mountRef.current
    if (!el) return

    let cancelled = false
    let cleanup: (() => void) | null = null

    // Dynamically import Three.js to avoid SSR errors
    import('three').then((THREE) => {
      if (cancelled || !mountRef.current) return
      const container = mountRef.current

      /* ── renderer ── */
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setSize(container.offsetWidth, container.offsetHeight)
      renderer.outputColorSpace = THREE.SRGBColorSpace
      renderer.domElement.style.position = 'absolute'
      renderer.domElement.style.inset = '0'
      renderer.domElement.style.pointerEvents = 'none'
      container.appendChild(renderer.domElement)

      const scene = new THREE.Scene()
      const cam = new THREE.PerspectiveCamera(50, container.offsetWidth / container.offsetHeight, 0.1, 400)
      
      // Position camera so the tilted solar system is centered and fits the screen nicely
      cam.position.set(0, 5.5, 11)
      cam.lookAt(0, 0, 0)

      /* ── resize ── */
      const onResize = () => {
        renderer.setSize(container.offsetWidth, container.offsetHeight)
        cam.aspect = container.offsetWidth / container.offsetHeight
        cam.updateProjectionMatrix()
      }
      window.addEventListener('resize', onResize)

      /* ── helpers ── */
      const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)))
      const lerp = (a: number, b: number, t: number) => a + (b - a) * t

      // Seeded random noise generator
      function _rn(seed: number) {
        return function (a: number, b: number) {
          const n = Math.sin(a * 127.1 + b * 311.7 + seed) * 43758.5453
          return n - Math.floor(n)
        }
      }

      /* ── procedural planet textures & bump maps ── */
      function makePlanetMaps(p: {
        type: string
        seed: number
        color?: number[]
        rough?: number
        isEarth?: boolean
        isGas?: boolean
        bands?: number[][]
      }) {
        const S = 128
        const canvas = document.createElement('canvas')
        canvas.width = canvas.height = S
        const ctx = canvas.getContext('2d')!

        const bumpCanvas = document.createElement('canvas')
        bumpCanvas.width = bumpCanvas.height = S
        const bCtx = bumpCanvas.getContext('2d')!

        const rn = _rn(p.seed || 1)
        function vv(x: number, y: number) {
          const xi = Math.floor(x)
          const yi = Math.floor(y)
          const xf = x - xi
          const yf = y - yi
          const tl = rn(xi, yi)
          const tr = rn(xi + 1, yi)
          const bl = rn(xi, yi + 1)
          const br = rn(xi + 1, yi+1)
          const u = xf * xf * (3 - 2 * xf)
          const v = yf * yf * (3 - 2 * yf)
          return tl * (1 - u) * (1 - v) + tr * u * (1 - v) + bl * (1 - u) * v + br * u * v
        }

        function fb(x: number, y: number, octs: number) {
          let val = 0
          let am = 0.5
          let fr = 1
          for (let o = 0; o < octs; o++) {
            val += am * vv(x * fr, y * fr)
            fr *= 2.0
            am *= 0.5
          }
          return val
        }

        const img = ctx.createImageData(S, S)
        const d = img.data
        const bImg = bCtx.createImageData(S, S)
        const bd = bImg.data

        if (p.type === 'mercury') {
          for (let y = 0; y < S; y++) {
            for (let x = 0; x < S; x++) {
              const n = fb(x / S * 9, y / S * 9, 6)
              const crater = fb(x / S * 18 + 1.3, y / S * 18 + 2.1, 4)
              let base = lerp(90, 160, n)
              if (crater > 0.6) base -= (crater - 0.6) * 180
              const i = (y * S + x) * 4
              d[i] = clamp(base + 25)
              d[i + 1] = clamp(base + 12)
              d[i + 2] = clamp(base - 10)
              d[i + 3] = 255
              bd[i] = bd[i + 1] = bd[i + 2] = clamp(crater * 180 + n * 60)
              bd[i + 3] = 255
            }
          }
        } else if (p.type === 'venus') {
          for (let y = 0; y < S; y++) {
            for (let x = 0; x < S; x++) {
              const n = fb(x / S * 5, y / S * 5, 6)
              const swirl = fb(x / S * 12 + n * 0.3, y / S * 4, 3)
              const r = clamp(lerp(220, 255, n) + swirl * 20)
              const g = clamp(lerp(150, 210, n) + swirl * 15)
              const bv = clamp(lerp(40, 80, n))
              const i = (y * S + x) * 4
              d[i] = r
              d[i + 1] = g
              d[i + 2] = bv
              d[i + 3] = 255
              bd[i] = bd[i + 1] = bd[i + 2] = clamp(n * 220)
              bd[i + 3] = 255
            }
          }
        } else if (p.type === 'earth') {
          for (let y = 0; y < S; y++) {
            const lat = Math.abs(y / S - 0.5) * 2
            for (let x = 0; x < S; x++) {
              const n = fb(x / S * 7, y / S * 7, 7)
              const cloud = fb(x / S * 11 + 2.5, y / S * 11 + 1.5, 4)
              const polar = lat > 0.82
              let r = 0, g = 0, b = 0, h = 0
              if (polar && lat > 0.88 + n * 0.04) {
                r = 245
                g = 250
                b = 255
              } else if (n > 0.47) {
                const altitude = (n - 0.47) * 3.5
                if (altitude < 0.4) {
                  r = clamp(20 + altitude * 40)
                  g = clamp(190 + altitude * 30)
                  b = clamp(50 + altitude * 20)
                } else if (altitude < 0.75) {
                  r = clamp(160 + altitude * 50)
                  g = clamp(135 + altitude * 35)
                  b = clamp(70 + altitude * 25)
                } else {
                  r = clamp(210 + altitude * 30)
                  g = clamp(195 + altitude * 25)
                  b = clamp(180 + altitude * 20)
                }
                h = clamp((n - 0.47) * 2.5 * 255)
              } else {
                const depth = (0.47 - n) * 4
                r = clamp(lerp(0, 10, depth))
                g = clamp(lerp(90, 40, depth))
                b = clamp(lerp(255, 190, depth))
              }
              if (cloud > 0.52 && !polar) {
                const cl = Math.min(1, (cloud - 0.52) * 4.5)
                r = clamp(lerp(r, 245, cl))
                g = clamp(lerp(g, 248, cl))
                b = clamp(lerp(b, 255, cl))
              }
              const i = (y * S + x) * 4
              d[i] = r
              d[i + 1] = g
              d[i + 2] = b
              d[i + 3] = 255
              bd[i] = bd[i + 1] = bd[i + 2] = h
              bd[i + 3] = 255
            }
          }
        } else if (p.type === 'mars') {
          for (let y = 0; y < S; y++) {
            const lat = Math.abs(y / S - 0.5) * 2
            for (let x = 0; x < S; x++) {
              const n = fb(x / S * 8, y / S * 8, 6)
              const dust = fb(x / S * 18 + 3, y / S * 18 + 2, 4)
              const canyon = y > S * 0.42 && y < S * 0.58 && fb(x / S * 4, y / S * 40, 3) > 0.55
              let r = 0, g = 0, b = 0, h = 0
              if (lat > 0.84 && n > 0.42) {
                r = 250
                g = 252
                b = 255
              } else if (canyon) {
                r = clamp(140 - dust * 20)
                g = clamp(45 - dust * 15)
                b = clamp(20 - dust * 10)
              } else {
                r = clamp(lerp(210, 250, n) + dust * 20)
                g = clamp(lerp(60, 100, n) + dust * 10)
                b = clamp(lerp(25, 45, n) + dust * 5)
              }
              h = clamp(n * 200)
              const i = (y * S + x) * 4
              d[i] = r
              d[i + 1] = g
              d[i + 2] = b
              d[i + 3] = 255
              bd[i] = bd[i + 1] = bd[i + 2] = h
              bd[i + 3] = 255
            }
          }
        } else if (p.isGas && p.bands) {
          const bands = p.bands
          for (let y = 0; y < S; y++) {
            const lat = Math.abs(y / S - 0.5) * 2
            const wob = Math.sin(y / S * Math.PI * 14) * 0.014
            for (let x = 0; x < S; x++) {
              const turb = vv(x / S * 4, y / S * 22) * 0.03
              let t = (y / S) + wob + turb
              t = ((t % 1) + 1) % 1
              const fp = t * (bands.length - 1)
              const bi = Math.floor(fp)
              const bf = fp - bi
              const c0 = bands[bi]
              const c1 = bands[Math.min(bands.length - 1, bi + 1)]
              const polar = Math.max(0, lat - 0.75) * 4
              const i = (y * S + x) * 4
              d[i] = clamp((c0[0] + (c1[0] - c0[0]) * bf) * lerp(1, 0.75, polar))
              d[i + 1] = clamp((c0[1] + (c1[1] - c0[1]) * bf) * lerp(1, 0.75, polar))
              d[i + 2] = clamp((c0[2] + (c1[2] - c0[2]) * bf) * lerp(1, 0.7, polar))
              d[i + 3] = 255
              bd[i] = bd[i + 1] = bd[i + 2] = 0
              bd[i + 3] = 255
            }
          }
          if (p.type === 'jupiter') {
            for (let y = 0; y < S; y++) {
              for (let x = 0; x < S; x++) {
                const gx = (x / S - 0.55) * 2.8
                const gy = (y / S - 0.46) * 4.5
                const grs = Math.max(0, 1 - Math.sqrt(gx * gx + gy * gy))
                if (grs > 0) {
                  const i = (y * S + x) * 4
                  d[i] = clamp(lerp(d[i], 225, grs * 0.85))
                  d[i + 1] = clamp(lerp(d[i + 1], 40, grs * 0.85))
                  d[i + 2] = clamp(lerp(d[i + 2], 20, grs * 0.85))
                }
              }
            }
          }
        } else if (p.type === 'neptune') {
          for (let y = 0; y < S; y++) {
            for (let x = 0; x < S; x++) {
              const n = fb(x / S * 6, y / S * 6, 5)
              const storm = fb(x / S * 14 + 1.8, y / S * 14 + 0.8, 4)
              const band = Math.sin(y / S * Math.PI * 10) * 0.04
              const i = (y * S + x) * 4
              d[i] = clamp(15 + n * 30 + band * 20)
              d[i + 1] = clamp(60 + n * 45 + band * 15)
              d[i + 2] = 255
              if (storm > 0.68) {
                const sc = (storm - 0.68) * 3.5
                d[i] = clamp(d[i] + sc * 90)
                d[i + 1] = clamp(d[i + 1] + sc * 90)
                d[i + 2] = clamp(d[i + 2] + sc * 50)
              }
              d[i + 3] = 255
              bd[i] = bd[i + 1] = bd[i + 2] = clamp(n * 180)
              bd[i + 3] = 255
            }
          }
        } else {
          const col = p.color || [128, 128, 128]
          for (let y = 0; y < S; y++) {
            for (let x = 0; x < S; x++) {
              const n = fb(x / S * 6, y / S * 6, 5)
              const sh = (n - 0.5) * (p.rough || 0.5) * 140
              const i = (y * S + x) * 4
              d[i] = clamp(col[0] + sh)
              d[i + 1] = clamp(col[1] + sh)
              d[i + 2] = clamp(col[2] + sh)
              d[i + 3] = 255
              const val = Math.floor(n * 255)
              bd[i] = bd[i + 1] = bd[i + 2] = val
              bd[i + 3] = 255
            }
          }
        }

        ctx.putImageData(img, 0, 0)
        bCtx.putImageData(bImg, 0, 0)
        return {
          map: new THREE.CanvasTexture(canvas),
          bumpMap: new THREE.CanvasTexture(bumpCanvas),
        }
      }

      /* ── starry background field ── */
      const starGeo = new THREE.BufferGeometry()
      const starPositions = new Float32Array(2400)
      for (let i = 0; i < 2400; i++) starPositions[i] = (Math.random() - 0.5) * 350
      starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
      const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.16, transparent: true, opacity: 0.65 })
      const starPoints = new THREE.Points(starGeo, starMat)
      scene.add(starPoints)

      /* ── solar system group (tilted) ── */
      const solarG = new THREE.Group()
      solarG.position.set(0, -0.5, 0)
      solarG.rotation.x = 0.38 // Beautiful tilted orbital plane
      scene.add(solarG)

      /* ── sun ── */
      const sunMat = new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 } },
        vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
        fragmentShader: `
          uniform float uTime;
          varying vec2 vUv;
          float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
          float noise(vec2 p){ vec2 i=floor(p); vec2 f=fract(p); vec2 u=f*f*(3.0-2.0*f);
            return mix(mix(hash(i),hash(i+vec2(1.0,0.0)),u.x),mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0,1.0)),u.x),u.y); }
          float fbm(vec2 p){ float v=0.0; float a=0.5; for(int i=0;i<5;i++){ v+=a*noise(p); p*=2.1; a*=0.5; } return v; }
          void main(){
            vec2 uv=vUv*2.0-1.0;
            float d=length(uv);
            float n=fbm(uv*3.0+uTime*0.35);
            float n2=fbm(uv*6.0-uTime*0.2+n);
            vec3 hot=vec3(1.0,0.95,0.6);
            vec3 mid=vec3(1.0,0.45,0.05);
            vec3 cool=vec3(0.7,0.1,0.0);
            vec3 col=mix(cool,mix(mid,hot,n2),n);
            float edge=1.0-smoothstep(0.78,0.99,d+n2*0.18);
            gl_FragColor=vec4(col*edge*1.3,edge);
          }`,
        transparent: true,
      })
      const sun = new THREE.Mesh(new THREE.SphereGeometry(0.8, 64, 64), sunMat)
      solarG.add(sun)

      // Solid bright core for sun
      const sunCore = new THREE.Mesh(
        new THREE.SphereGeometry(0.55, 48, 48),
        new THREE.MeshBasicMaterial({ color: 0xfff4d6 })
      )
      solarG.add(sunCore)

      // Sun glow sprite (dynamic glow)
      function makeSunGlow(rgb: string, size: number, op: number) {
        const S = 256
        const c = document.createElement('canvas')
        c.width = c.height = S
        const x = c.getContext('2d')!
        const g = x.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2)
        g.addColorStop(0, 'rgba(' + rgb + ',' + op + ')')
        g.addColorStop(0.22, 'rgba(' + rgb + ',' + op * 0.55 + ')')
        g.addColorStop(1, 'rgba(' + rgb + ',0)')
        x.fillStyle = g
        x.fillRect(0, 0, S, S)
        const sp = new THREE.Sprite(
          new THREE.SpriteMaterial({
            map: new THREE.CanvasTexture(c),
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            transparent: true,
          })
        )
        sp.scale.set(size, size, 1)
        return sp
      }
      solarG.add(makeSunGlow('255,172,58', 4.0, 0.65))
      solarG.add(makeSunGlow('255,112,30', 7.0, 0.35))

      // Sun corona
      const corona = new THREE.Mesh(
        new THREE.SphereGeometry(0.8, 48, 48),
        new THREE.ShaderMaterial({
          transparent: true,
          side: THREE.BackSide,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          uniforms: { uC: { value: new THREE.Color(0xffb347) } },
          vertexShader:
            'varying vec3 vN;varying vec3 vV;void main(){vN=normalize(normalMatrix*normal);vec4 mv=modelViewMatrix*vec4(position,1.0);vV=normalize(-mv.xyz);gl_Position=projectionMatrix*mv;}',
          fragmentShader:
            'uniform vec3 uC;varying vec3 vN;varying vec3 vV;void main(){float f=pow(1.0-max(dot(vN,vV),0.0),1.5);gl_FragColor=vec4(uC,f);}',
        })
      )
      corona.scale.setScalar(1.65)
      solarG.add(corona)

      /* ── scaled-down planet parameters with high color saturation ── */
      const PLAN = [
        { r: 1.8, s: 0.08, color: [220, 110, 50], rough: 0.55, seed: 1, spd: 0.50, bumpScale: 0.04, type: 'mercury' },
        { r: 2.4, s: 0.12, color: [255, 180, 40], rough: 0.25, seed: 2, spd: 0.37, bumpScale: 0.02, type: 'venus' },
        { r: 3.0, s: 0.14, isEarth: true, seed: 3, spd: 0.31, type: 'earth' },
        { r: 3.6, s: 0.10, color: [240, 65, 30], rough: 0.55, seed: 4, spd: 0.25, bumpScale: 0.05, type: 'mars' },
        {
          r: 4.8,
          s: 0.32,
          isGas: true,
          bands: [
            [235, 140, 60],
            [170, 70, 40],
            [250, 210, 150],
            [140, 50, 30],
            [220, 160, 90],
          ],
          seed: 11,
          spd: 0.14,
          type: 'jupiter',
        },
        {
          r: 6.0,
          s: 0.26,
          isGas: true,
          bands: [
            [245, 200, 100],
            [215, 150, 60],
            [255, 225, 150],
          ],
          seed: 12,
          spd: 0.10,
          ring: true,
          type: 'saturn',
        },
        {
          r: 7.0,
          s: 0.18,
          isGas: true,
          bands: [
            [50, 220, 200],
            [100, 240, 220],
            [30, 200, 180],
          ],
          seed: 13,
          spd: 0.075,
          type: 'uranus',
        },
        { r: 8.0, s: 0.18, seed: 14, spd: 0.058, type: 'neptune' },
      ]

      const planets: { orb: THREE.Group; spd: number; mesh: THREE.Mesh; startAngle: number }[] = []
      const orbitMaterials: THREE.LineBasicMaterial[] = []

      PLAN.forEach((p) => {
        const orb = new THREE.Group()
        // Inclined orbits for depth
        orb.rotation.x = (Math.random() - 0.5) * 0.08
        const startAngle = Math.random() * Math.PI * 2
        orb.rotation.y = startAngle

        const maps = makePlanetMaps(p)
        const pl = new THREE.Mesh(
          new THREE.SphereGeometry(p.s, 40, 40),
          new THREE.MeshStandardMaterial({
            map: maps.map,
            bumpMap: p.isGas ? null : maps.bumpMap,
            bumpScale: p.isGas ? 0 : p.bumpScale || 0.03,
            roughness: p.isGas ? 0.9 : p.rough || 0.6,
            metalness: p.isGas ? 0.05 : 0.08,
            emissive: new THREE.Color(0x0a0c10),
            emissiveIntensity: 0.15,
          })
        )
        pl.position.x = p.r
        pl.rotation.z = 0.25
        orb.add(pl)

        // Saturn ring
        if (p.ring) {
          const rg = new THREE.Mesh(
            new THREE.RingGeometry(p.s * 1.45, p.s * 2.5, 72),
            new THREE.MeshBasicMaterial({ color: 0xffcc44, transparent: true, opacity: 0.75, side: THREE.DoubleSide })
          )
          rg.rotation.x = Math.PI / 2.3
          rg.position.x = p.r
          orb.add(rg)
        }

        // Draw orbital path
        const oc = new THREE.EllipseCurve(0, 0, p.r, p.r, 0, Math.PI * 2, false, 0)
        const op = oc.getPoints(180).map((q) => new THREE.Vector3(q.x, 0, q.y))
        const og = new THREE.BufferGeometry().setFromPoints(op)
        const orbitMat = new THREE.LineBasicMaterial({ color: 0x534ab7, transparent: true, opacity: 0.28 })
        orbitMaterials.push(orbitMat)
        orb.add(new THREE.LineLoop(og, orbitMat))

        solarG.add(orb)
        planets.push({ orb, spd: p.spd, mesh: pl, startAngle })
      })

      /* ── asteroid belt ── */
      const asteroidG = new THREE.Group()
      function createAsteroidBelt(rad: number, count: number, spread: number) {
        const pos = new Float32Array(count * 3)
        for (let i = 0; i < count; i++) {
          const a = Math.random() * Math.PI * 2
          const rr = rad + (Math.random() - 0.5) * spread
          pos[i * 3] = Math.cos(a) * rr
          pos[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.5
          pos[i * 3 + 2] = Math.sin(a) * rr
        }
        const g = new THREE.BufferGeometry()
        g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
        const pts = new THREE.Points(
          g,
          new THREE.PointsMaterial({
            color: 0xcdb78a,
            size: 0.055,
            transparent: true,
            opacity: 0.85,
            sizeAttenuation: true,
          })
        )
        asteroidG.add(pts)
      }
      createAsteroidBelt(4.2, 900, 0.3) // Asteroid belt between Mars & Jupiter
      solarG.add(asteroidG)

      /* ── lights ── */
      // Bright neutral white ambient light so that shadowing doesn't look dull or dark grey
      solarG.add(new THREE.AmbientLight(0xffffff, 0.85))
      const sunLight = new THREE.PointLight(0xfff2d6, 3.2, 320)
      solarG.add(sunLight)

      /* ── ambient dust ── */
      const dustCount = 400
      const dustPos = new Float32Array(dustCount * 3)
      for (let i = 0; i < dustCount; i++) {
        const r = 1.1 + Math.random() * 6.0
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(Math.random() * 2 - 1)
        dustPos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
        dustPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.45
        dustPos[i * 3 + 2] = r * Math.cos(phi)
      }
      const dustGeom = new THREE.BufferGeometry()
      dustGeom.setAttribute('position', new THREE.BufferAttribute(dustPos, 3))
      const dustMat = new THREE.PointsMaterial({
        color: 0x6d5df6,
        size: 0.07,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
      const dustPoints = new THREE.Points(dustGeom, dustMat)
      solarG.add(dustPoints)

      /* ── mouse parallax ── */
      const ptr = { x: 0, y: 0 }
      const onMouse = (e: MouseEvent) => {
        ptr.x = (e.clientX / window.innerWidth - 0.5) * 2
        ptr.y = -(e.clientY / window.innerHeight - 0.5) * 2
      }
      window.addEventListener('mousemove', onMouse)

      /* ── MutationObserver (to dynamically swap theme assets cleanly without render loop polling) ── */
      let isDarkTheme = !document.documentElement.classList.contains('light')
      const applyThemeState = (dark: boolean) => {
        isDarkTheme = dark
        starPoints.visible = dark
        dustPoints.visible = dark
        asteroidG.visible = dark
        orbitMaterials.forEach((m) => {
          m.color.setHex(dark ? 0xbcd0ea : 0x534ab7)
          m.opacity = dark ? 0.18 : 0.42
        })
      }
      applyThemeState(isDarkTheme)

      const observer = new MutationObserver(() => {
        const dark = !document.documentElement.classList.contains('light')
        if (dark !== isDarkTheme) {
          applyThemeState(dark)
        }
      })
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

      /* ── render loop ── */
      let raf: number
      const clock = new THREE.Clock()

      const render = () => {
        raf = requestAnimationFrame(render)
        const t = clock.getElapsedTime()
        
        sunMat.uniforms.uTime.value = t
        sun.rotation.y = t * 0.05

        // Absolute time-dependent planet orbit positions to guarantee absolute 60fps smoothing
        planets.forEach((p) => {
          p.orb.rotation.y = p.startAngle + t * p.spd * 0.08
          p.mesh.rotation.y = t * 0.35
        })

        // Slowly rotate stardust points
        if (isDarkTheme) {
          dustPoints.rotation.y = t * 0.015
        }

        // Highly responsive, stutter-free floating camera interpolation
        const targetX = ptr.x * 1.6
        const targetY = ptr.y * 1.0 + 5.5
        cam.position.x += (targetX - cam.position.x) * 0.05
        cam.position.y += (targetY - cam.position.y) * 0.05
        cam.lookAt(0, 0, 0)

        renderer.render(scene, cam)
      }
      render()

      cleanup = () => {
        cancelled = true
        cancelAnimationFrame(raf)
        observer.disconnect()
        window.removeEventListener('resize', onResize)
        window.removeEventListener('mousemove', onMouse)
        renderer.dispose()
        if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement)
      }
    })

    return () => {
      cancelled = true
      cleanup?.()
    }
  }, [])

  return (
    <div
      ref={mountRef}
      aria-hidden
      className="absolute inset-0 pointer-events-none z-0"
      style={{ overflow: 'hidden' }}
    />
  )
}
