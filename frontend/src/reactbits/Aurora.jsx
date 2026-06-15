import { useEffect, useRef } from 'react'

export default function Aurora({ colorStops = ['#4F46E5', '#7C3AED', '#06B6D4'], speed = 0.4, amplitude = 1.0, className = '' }) {
  const canvasRef = useRef(null)
  const animRef = useRef(null)
  const timeRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      timeRef.current += speed * 0.01
      const t = timeRef.current
      const w = canvas.width
      const h = canvas.height

      ctx.clearRect(0, 0, w, h)

      // Draw multiple aurora waves
      colorStops.forEach((color, i) => {
        const offset = (i / colorStops.length) * Math.PI * 2
        const gradient = ctx.createRadialGradient(
          w * (0.3 + 0.4 * Math.sin(t + offset)),
          h * (0.3 + 0.3 * Math.cos(t * 0.7 + offset)),
          0,
          w * 0.5,
          h * 0.5,
          w * 0.8
        )
        gradient.addColorStop(0, color + 'AA')
        gradient.addColorStop(0.5, color + '44')
        gradient.addColorStop(1, 'transparent')

        ctx.globalCompositeOperation = i === 0 ? 'source-over' : 'screen'
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, w, h)
      })

      // Noise layer for depth
      ctx.globalCompositeOperation = 'source-over'
      const grad = ctx.createLinearGradient(0, 0, 0, h)
      grad.addColorStop(0, 'rgba(10,10,15,0.3)')
      grad.addColorStop(1, 'rgba(10,10,15,0.7)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, w, h)

      animRef.current = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animRef.current)
    }
  }, [colorStops, speed, amplitude])

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
      style={{ display: 'block' }}
    />
  )
}
