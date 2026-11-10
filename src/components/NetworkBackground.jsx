import { useEffect, useRef } from 'react'

// Subtle animated "network of cables" background: small nodes drifting slowly,
// connected by thin lines when close enough, with gentle mouse interactivity.
export default function NetworkBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let width, height, dpr
    let particles = []
    let animationId
    const mouse = { x: -9999, y: -9999, active: false }

    const LINK_DIST = 150
    const MOUSE_DIST = 200

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = width + 'px'
      canvas.style.height = height + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const area = width * height
      const count = Math.min(90, Math.max(32, Math.round(area / 18000)))
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.3 + 0.9,
      }))
    }

    function onMouseMove(e) {
      mouse.x = e.clientX
      mouse.y = e.clientY
      mouse.active = true
    }
    function onMouseLeave() {
      mouse.active = false
    }
    function onTouchMove(e) {
      if (e.touches && e.touches[0]) {
        mouse.x = e.touches[0].clientX
        mouse.y = e.touches[0].clientY
        mouse.active = true
      }
    }

    function step() {
      ctx.clearRect(0, 0, width, height)

      // move particles
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > width) p.vx *= -1
        if (p.y < 0 || p.y > height) p.vy *= -1

        // gentle drift away from cursor (cable "pushed" by hand feel)
        if (mouse.active) {
          const dx = p.x - mouse.x
          const dy = p.y - mouse.y
          const dist2 = dx * dx + dy * dy
          if (dist2 < MOUSE_DIST * MOUSE_DIST) {
            const dist = Math.sqrt(dist2) || 1
            const force = (1 - dist / MOUSE_DIST) * 0.35
            p.x += (dx / dist) * force
            p.y += (dy / dist) * force
          }
        }
      }

      // draw links
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j]
          const dx = a.x - b.x, dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < LINK_DIST) {
            const alpha = (1 - dist / LINK_DIST) * 0.13
            ctx.strokeStyle = `rgba(59,130,246,${alpha})`
            ctx.lineWidth = 0.7
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }

        // link to mouse cursor if close (highlight cable)
        if (mouse.active) {
          const dx = particles[i].x - mouse.x
          const dy = particles[i].y - mouse.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < MOUSE_DIST) {
            const alpha = (1 - dist / MOUSE_DIST) * 0.18
            ctx.strokeStyle = `rgba(59,130,246,${alpha})`
            ctx.lineWidth = 0.9
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(mouse.x, mouse.y)
            ctx.stroke()
          }
        }
      }

      // draw nodes
      for (const p of particles) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(59,130,246,0.18)'
        ctx.fill()
      }

      // subtle glow at cursor
      if (mouse.active) {
        const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, MOUSE_DIST)
        grad.addColorStop(0, 'rgba(59,130,246,0.03)')
        grad.addColorStop(1, 'rgba(59,130,246,0)')
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(mouse.x, mouse.y, MOUSE_DIST, 0, Math.PI * 2)
        ctx.fill()
      }

      animationId = requestAnimationFrame(step)
    }

    resize()
    step()

    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseleave', onMouseLeave)
    window.addEventListener('touchmove', onTouchMove, { passive: true })

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseleave', onMouseLeave)
      window.removeEventListener('touchmove', onTouchMove)
    }
  }, [])

  return <canvas ref={canvasRef} className="network-bg" />
}
