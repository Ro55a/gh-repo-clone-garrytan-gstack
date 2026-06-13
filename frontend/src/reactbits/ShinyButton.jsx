import { motion } from 'framer-motion'
import { useRef } from 'react'

export default function ShinyButton({ children, onClick, disabled = false, className = '' }) {
  const ref = useRef(null)

  const handleMouseMove = (e) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    ref.current.style.setProperty('--x', `${x}px`)
    ref.current.style.setProperty('--y', `${y}px`)
  }

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      disabled={disabled}
      onMouseMove={handleMouseMove}
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      className={`relative overflow-hidden px-6 py-3 rounded-xl font-semibold text-white transition-all
        bg-gradient-to-r from-primary to-violet
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}`}
      style={{
        background: disabled ? undefined : 'linear-gradient(135deg, #4F46E5, #7C3AED)',
      }}
    >
      <span
        className="pointer-events-none absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
        style={{
          background: 'radial-gradient(circle at var(--x, 50%) var(--y, 50%), rgba(255,255,255,0.2) 0%, transparent 60%)',
        }}
      />
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
    </motion.button>
  )
}
