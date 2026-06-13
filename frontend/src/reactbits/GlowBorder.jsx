import { motion } from 'framer-motion'

export default function GlowBorder({ children, onClick, className = '', color = '#06B6D4' }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className={`relative px-4 py-2 rounded-xl font-medium text-white transition-all ${className}`}
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: `1px solid ${color}55`,
        boxShadow: `0 0 0 0 ${color}00`,
      }}
      onHoverStart={(e) => {
        if (e.target.style) e.target.style.boxShadow = `0 0 20px ${color}40`
      }}
      onHoverEnd={(e) => {
        if (e.target.style) e.target.style.boxShadow = `0 0 0 0 ${color}00`
      }}
    >
      <span className="flex items-center gap-2">{children}</span>
    </motion.button>
  )
}
