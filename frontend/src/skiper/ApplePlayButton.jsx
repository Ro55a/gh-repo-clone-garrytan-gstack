import { motion } from 'framer-motion'

export default function ApplePlayButton({ children, onClick, className = '' }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`relative group overflow-hidden rounded-2xl px-8 py-4 font-semibold text-white ${className}`}
      style={{
        background: 'linear-gradient(135deg, rgba(79,70,229,0.9), rgba(124,58,237,0.9))',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.2)',
        boxShadow: '0 8px 32px rgba(79,70,229,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
      }}
    >
      {/* Shimmer sweep */}
      <motion.span
        initial={{ x: '-100%', opacity: 0 }}
        whileHover={{ x: '200%', opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 pointer-events-none"
      />
      {/* Noise texture */}
      <span
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  )
}
