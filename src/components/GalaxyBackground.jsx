import { useEffect, useRef } from 'react'
import { useTheme } from '../context/ThemeContext'

// Twinkling starfield with a subtle mouse-parallax "3D depth" feel.
// Dark mode: bright stars on a deep nebula sky.
// Light mode: soft pastel sparkles on a bright sky, same galaxy concept lightened up.
export default function GalaxyBackground() {
  const { theme } = useTheme()
  const canvasRef = useRef(null)
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const isDark = theme === 'dark'
    let raf
    let stars = []
    let w = 0
    let h = 0
    let t = 0

    function generateStars() {
      const count = Math.min(240, Math.floor((w * h) / 6500))
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.3 + 0.35,
        depth: Math.random() * 0.6 + 0.15,
        twinkleSpeed: Math.random() * 0.025 + 0.006,
        twinklePhase: Math.random() * Math.PI * 2,
        baseAlpha: isDark ? Math.random() * 0.5 + 0.35 : Math.random() * 0.32 + 0.16,
        tint: isDark
          ? (Math.random() < 0.12 ? 'a5c8ff' : Math.random() < 0.18 ? 'e0c2ff' : 'ffffff')
          : (Math.random() < 0.34 ? 'a9c3ff' : Math.random() < 0.6 ? 'd7bbff' : 'ffcf9e'),
      }))
    }

    function resize() {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
      generateStars()
    }

    function onMouseMove(e) {
      mouseRef.current.x = e.clientX / w - 0.5
      mouseRef.current.y = e.clientY / h - 0.5
    }

    function hexToRgb(hex) {
      const n = parseInt(hex, 16)
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
    }

    function draw() {
      t += 1
      ctx.clearRect(0, 0, w, h)
      const mx = mouseRef.current.x
      const my = mouseRef.current.y
      stars.forEach((s) => {
        const twinkle = Math.sin(t * s.twinkleSpeed + s.twinklePhase) * 0.35 + 0.65
        const alpha = s.baseAlpha * twinkle
        const px = s.x + mx * s.depth * 34
        const py = s.y + my * s.depth * 34
        const [r, g, b] = hexToRgb(s.tint)
        ctx.beginPath()
        ctx.arc(px, py, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`
        ctx.fill()
        // soft glow on the slightly bigger stars, for a little depth
        if (s.r > 1.1) {
          ctx.beginPath()
          ctx.arc(px, py, s.r * 3, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${r},${g},${b},${alpha * (isDark ? 0.08 : 0.12)})`
          ctx.fill()
        }
      })
      raf = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMouseMove)
    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [theme])

  return <canvas ref={canvasRef} className="galaxy-bg" />
}
