'use client'

import { useEffect, useRef } from 'react'

export default function CosmicBackdrop() {
  const mountRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = mountRef.current
    if (!el) return

    // Dynamically import Three.js to avoid SSR issues
    let cancelled = false
    let cleanup: (() => void) | null = null

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
      const cam = new THREE.PerspectiveCamera(55, container.offsetWidth / container.offsetHeight, 0.1, 400)
      cam.position.set(0, 6, 22)
      cam.lookAt(0, 0, 0)

      /* ── resize ── */
      const onResize = () => {
        renderer.setSize(container.offsetWidth, container.offsetHeight)
        cam.aspect = container.offsetWidth / container.offsetHeight
        cam.updateProjectionMatrix()
      }
      window.addEventListener('resize', onResize)

      /* ── star field ── */
      const starGeo = new THREE.BufferGeometry()
      const starPositions = new Float32Array(2400)
      for (let i = 0; i < 2400; i++) starPositions[i] = (Math.random() - 0.5) * 350
      starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
      const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.22, transparent: true, opacity: 0.7 })
      scene.add(new THREE.Points(starGeo, starMat))

      /* ── procedural planet texture ── */
      function makePlanetTex(seed: number, type: string) {
        const S = 256
        const c = document.createElement('canvas')
        c.width = c.height = S
        const ctx = c.getContext('2d')!
        const palettes: Record<string, string[]> = {
          rocky:    ['#8c5e3c','#a07040','#6b4226','#c49a6c','#b87333'],
          earth:    ['#1a6b3c','#2e8b57','#1e90ff','#228b22','#006400'],
          ice:      ['#a8d8ea','#d0eaf8','#7ec8e3','#b8d4e8','#90bcd4'],
          gas:      ['#c8a04a','#e8c876','#b89040','#d4b460','#f0d890'],
          desert:   ['#d4944c','#c0784c','#e8b06c','#b86c3c','#f0c880'],
          purple:   ['#6a4c93','#8b6fc0','#9b59b6','#7d3c98','#a78bca'],
          lava:     ['#cc3300','#ff6600','#991100','#ff4400','#dd2200'],
          teal:     ['#008b8b','#20b2aa','#00ced1','#40e0d0','#00b4b4'],
        }
        const types = Object.keys(palettes)
        const tKey = types[seed % types.length]
        const p = palettes[tKey]
        const img = ctx.createImageData(S, S)
        const d = img.data
        function rnd(x: number, y: number) {
          const n = Math.sin(x * 127.1 + y * 311.7 + seed * 57.3) * 43758.5453
          return n - Math.floor(n)
        }
        for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
          const n = rnd(x / 32, y / 32) * 0.5 + rnd(x / 16, y / 16) * 0.3 + rnd(x / 8, y / 8) * 0.2
          const col = p[Math.floor(n * p.length) % p.length]
          const r2 = parseInt(col.slice(1, 3), 16)
          const g2 = parseInt(col.slice(3, 5), 16)
          const b2 = parseInt(col.slice(5, 7), 16)
          const idx = (y * S + x) * 4
          d[idx] = r2; d[idx + 1] = g2; d[idx + 2] = b2; d[idx + 3] = 255
        }
        ctx.putImageData(img, 0, 0)
        return new THREE.CanvasTexture(c)
      }

      /* ── sun shader ── */
      const sunMat = new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 } },
        vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
        fragmentShader: `
          uniform float uTime;
          varying vec2 vUv;
          float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
          float noise(vec2 p){ vec2 i=floor(p); vec2 f=fract(p); vec2 u=f*f*(3.-2.*f);
            return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y); }
          float fbm(vec2 p){ float v=0.; float a=.5; for(int i=0;i<5;i++){ v+=a*noise(p); p*=2.1; a*=.5; } return v; }
          void main(){
            vec2 uv=vUv*2.-1.;
            float d=length(uv);
            float n=fbm(uv*3.+uTime*.35);
            float n2=fbm(uv*6.-uTime*.2+n);
            vec3 hot=vec3(1.,.95,.6);
            vec3 mid=vec3(1.,.45,.05);
            vec3 cool=vec3(.7,.1,.0);
            vec3 col=mix(cool,mix(mid,hot,n2),n);
            float edge=1.-smoothstep(.78,.99,d+n2*.18);
            gl_FragColor=vec4(col*edge*1.3,edge);
          }`,
        transparent: true,
      })
      const sun = new THREE.Mesh(new THREE.SphereGeometry(2.2, 64, 64), sunMat)
      scene.add(sun)

      // Sun glow
      const glowMat = new THREE.SpriteMaterial({
        map: (() => {
          const gc = document.createElement('canvas'); gc.width = gc.height = 128
          const gx = gc.getContext('2d')!
          const gr = gx.createRadialGradient(64, 64, 0, 64, 64, 64)
          gr.addColorStop(0, 'rgba(255,200,80,0.55)')
          gr.addColorStop(0.4, 'rgba(255,120,20,0.18)')
          gr.addColorStop(1, 'rgba(255,80,0,0)')
          gx.fillStyle = gr; gx.fillRect(0, 0, 128, 128)
          return new THREE.CanvasTexture(gc)
        })(),
        transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      })
      const sunGlow = new THREE.Sprite(glowMat)
      sunGlow.scale.setScalar(11)
      scene.add(sunGlow)

      /* ── planets ── */
      const planetData = [
        { r: 0.28, dist: 4.2,  speed: 1.80, seed: 1, color: 0x8c6040 },
        { r: 0.45, dist: 5.8,  speed: 1.20, seed: 2, color: 0xd4a060 },
        { r: 0.5,  dist: 7.5,  speed: 0.90, seed: 3, color: 0x2e6baa },
        { r: 0.35, dist: 9.2,  speed: 0.70, seed: 4, color: 0xb84c30 },
        { r: 0.9,  dist: 12.0, speed: 0.42, seed: 5, color: 0xc8a050 },
        { r: 0.78, dist: 14.5, speed: 0.30, seed: 6, color: 0xa0b8c0 },
        { r: 0.62, dist: 17.0, speed: 0.20, seed: 7, color: 0x6090b0 },
        { r: 0.55, dist: 19.5, speed: 0.13, seed: 8, color: 0x3050a0 },
      ]

      const planets = planetData.map((pd) => {
        const mesh = new THREE.Mesh(
          new THREE.SphereGeometry(pd.r, 40, 40),
          new THREE.MeshStandardMaterial({
            map: makePlanetTex(pd.seed, 'rocky'),
            roughness: 0.85, metalness: 0.05,
          })
        )
        mesh.userData = { dist: pd.dist, speed: pd.speed, angle: Math.random() * Math.PI * 2 }

        // orbit ring
        const orbitGeo = new THREE.RingGeometry(pd.dist - 0.01, pd.dist + 0.01, 96)
        const orbitMat = new THREE.MeshBasicMaterial({ color: 0x6d5df6, side: THREE.DoubleSide, transparent: true, opacity: 0.15 })
        const orbit = new THREE.Mesh(orbitGeo, orbitMat)
        orbit.rotation.x = Math.PI / 2
        scene.add(orbit)
        scene.add(mesh)
        return mesh
      })

      /* ── ambient & point lights ── */
      scene.add(new THREE.AmbientLight(0x1a1030, 0.6))
      const sunLight = new THREE.PointLight(0xff9040, 2.5, 80)
      scene.add(sunLight)

      /* ── stardust particles ── */
      const dustCount = 600
      const dustPos = new Float32Array(dustCount * 3)
      const dustAngles = new Float32Array(dustCount)
      const dustRadii = new Float32Array(dustCount)
      const dustSpeeds = new Float32Array(dustCount)
      for (let i = 0; i < dustCount; i++) {
        const angle = Math.random() * Math.PI * 2
        const rad = 3 + Math.random() * 18
        dustAngles[i] = angle; dustRadii[i] = rad
        dustSpeeds[i] = 0.002 + Math.random() * 0.006
        dustPos[i * 3] = Math.cos(angle) * rad
        dustPos[i * 3 + 1] = (Math.random() - 0.5) * 5
        dustPos[i * 3 + 2] = Math.sin(angle) * rad
      }
      const dustGeo = new THREE.BufferGeometry()
      dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3))
      const dustMat = new THREE.PointsMaterial({ color: 0xffcc44, size: 0.12, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false })
      const dust = new THREE.Points(dustGeo, dustMat)
      scene.add(dust)

      /* ── mouse parallax ── */
      const ptr = { x: 0, y: 0 }
      const onMouse = (e: MouseEvent) => {
        ptr.x = (e.clientX / window.innerWidth - 0.5) * 2
        ptr.y = -(e.clientY / window.innerHeight - 0.5) * 2
      }
      window.addEventListener('mousemove', onMouse)

      /* ── render loop ── */
      let raf: number
      const clock = new THREE.Clock()
      const render = () => {
        raf = requestAnimationFrame(render)
        const t = clock.getElapsedTime()
        sunMat.uniforms.uTime.value = t
        sun.rotation.y = t * 0.06

        planets.forEach((p) => {
          p.userData.angle += p.userData.speed * 0.004
          p.position.x = Math.cos(p.userData.angle) * p.userData.dist
          p.position.z = Math.sin(p.userData.angle) * p.userData.dist
          p.rotation.y += 0.005
        })

        // update dust
        const dp = dustGeo.getAttribute('position') as THREE.BufferAttribute
        for (let i = 0; i < dustCount; i++) {
          dustAngles[i] += dustSpeeds[i]
          dp.setX(i, Math.cos(dustAngles[i]) * dustRadii[i])
          dp.setZ(i, Math.sin(dustAngles[i]) * dustRadii[i])
        }
        dp.needsUpdate = true

        // parallax camera
        cam.position.x += (ptr.x * 3 - cam.position.x) * 0.02
        cam.position.y += (ptr.y * 2 + 6 - cam.position.y) * 0.02
        cam.lookAt(0, 0, 0)

        renderer.render(scene, cam)
      }
      render()

      cleanup = () => {
        cancelled = true
        cancelAnimationFrame(raf)
        window.removeEventListener('resize', onResize)
        window.removeEventListener('mousemove', onMouse)
        renderer.dispose()
        if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement)
      }
    })

    return () => { cancelled = true; cleanup?.() }
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
