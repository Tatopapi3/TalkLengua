'use client'
import { useEffect, useRef } from 'react'

// Ken Perlin's classic permutation table
const BASE_PERM = [
  151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,
  142,8,99,37,240,21,10,23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,
  203,117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,
  74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,
  220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,
  132,187,208,89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,
  186,3,64,52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,
  59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,248,152,2,44,154,163,
  70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,
  178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,
  241,81,51,145,235,249,14,239,107,49,192,214,31,181,199,106,157,184,84,204,
  176,115,121,50,45,127,4,150,254,138,236,205,93,222,114,67,29,24,72,243,141,
  128,195,78,66,215,61,156,180,
]
const P = new Uint8Array(512)
for (let i = 0; i < 512; i++) P[i] = BASE_PERM[i & 255]

function fade(t: number) { return t * t * t * (t * (t * 6 - 15) + 10) }
function lerp(a: number, b: number, t: number) { return a + t * (b - a) }

function grad(hash: number, x: number, y: number, z: number) {
  const h = hash & 15
  const u = h < 8 ? x : y
  const v = h < 4 ? y : (h === 12 || h === 14) ? x : z
  return ((h & 1) ? -u : u) + ((h & 2) ? -v : v)
}

function perlin(x: number, y: number, z: number) {
  const X = Math.floor(x) & 255
  const Y = Math.floor(y) & 255
  const Z = Math.floor(z) & 255
  x -= Math.floor(x); y -= Math.floor(y); z -= Math.floor(z)
  const u = fade(x), v = fade(y), w = fade(z)
  const A = P[X] + Y, B = P[X + 1] + Y
  const AA = P[A] + Z, AB = P[A + 1] + Z
  const BA = P[B] + Z, BB = P[B + 1] + Z
  return lerp(
    lerp(
      lerp(grad(P[AA],     x,     y,     z), grad(P[BA],     x-1, y,   z  ), u),
      lerp(grad(P[AB],     x,     y-1,   z), grad(P[BB],     x-1, y-1, z  ), u), v),
    lerp(
      lerp(grad(P[AA+1],   x,     y,     z-1), grad(P[BA+1], x-1, y,   z-1), u),
      lerp(grad(P[AB+1],   x,     y-1,   z-1), grad(P[BB+1], x-1, y-1, z-1), u), v),
    w)
}

function fbm(x: number, y: number, z: number) {
  return perlin(x, y, z) * 0.5 + perlin(x * 2.1, y * 2.1, z * 1.7) * 0.25
}

function warpedValue(x: number, y: number, t: number) {
  const qx = perlin(x,       y,       t)
  const qy = perlin(x + 5.2, y + 1.3, t + 1.3)
  return fbm(x + 2.0 * qx, y + 2.0 * qy, t)
}

export function AnimatedBackground({ opacity = 0.9 }: { opacity?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    const RES = 5
    let W = 0, H = 0
    let imgData: ImageData | null = null

    // declared before resize so resize() can set it
    let t = 0
    let dirty = true
    let lastX = -1, lastY = -1
    let pendingDelta = 0

    const resize = () => {
      W = Math.ceil(window.innerWidth / RES)
      H = Math.ceil(window.innerHeight / RES)
      canvas.width = W
      canvas.height = H
      canvas.style.width  = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      imgData = ctx.createImageData(W, H)
      dirty = true
    }
    resize()
    window.addEventListener('resize', resize)

    const SENSITIVITY = 0.00025

    const onMouseMove = (e: MouseEvent) => {
      if (lastX >= 0) {
        const dx = e.clientX - lastX
        const dy = e.clientY - lastY
        pendingDelta += Math.sqrt(dx * dx + dy * dy) * SENSITIVITY
        dirty = true
      }
      lastX = e.clientX
      lastY = e.clientY
    }
    window.addEventListener('mousemove', onMouseMove)

    const NS    = 0.009
    const BANDS = 9
    const LW    = 0.09

    let raf: number

    function draw() {
      raf = requestAnimationFrame(draw)

      if (!dirty || !imgData) return
      dirty = false

      t += pendingDelta
      pendingDelta = 0

      const d = imgData.data

      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const n    = warpedValue(x * NS, y * NS, t)
          const band = Math.abs(Math.sin(n * Math.PI * BANDS))
          const edge = Math.max(0, (band - (1 - LW)) / LW)

          const i = (y * W + x) * 4
          if (edge > 0.01) {
            const v   = Math.round(160 + edge * 95)
            d[i]     = v - 10
            d[i + 1] = v - 10
            d[i + 2] = v + 15
            d[i + 3] = 255
          } else {
            d[i]     = 6
            d[i + 1] = 6
            d[i + 2] = 14
            d[i + 3] = 255
          }
        }
      }

      ctx.putImageData(imgData, 0, 0)
    }

    draw()
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        opacity,
        imageRendering: 'auto',
      }}
    />
  )
}
