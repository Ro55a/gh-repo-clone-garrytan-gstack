import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

function Step({ step, index, scrollYProgress, total }) {
  const start = index / total
  const end = (index + 1) / total

  const opacity = useTransform(scrollYProgress, [start, start + 0.1, end - 0.1, end], [0.3, 1, 1, 0.3])
  const blur = useTransform(scrollYProgress, [start, start + 0.1, end - 0.1, end], [8, 0, 0, 8])
  const y = useTransform(scrollYProgress, [start, start + 0.15], [30, 0])

  return (
    <motion.div
      style={{ opacity, filter: blur.get ? undefined : undefined, y }}
      className="py-16"
    >
      <motion.div style={{ filter: useTransform(blur, (v) => `blur(${v}px)`) }}>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-5xl font-black text-white/10">{String(index + 1).padStart(2, '0')}</span>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-violet flex items-center justify-center">
            <step.icon size={16} className="text-white" />
          </div>
        </div>
        <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
        <p className="text-muted leading-relaxed max-w-sm">{step.desc}</p>
      </motion.div>
    </motion.div>
  )
}

export default function VercelScrollBlur({ steps }) {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  return (
    <div ref={containerRef} style={{ height: `${steps.length * 60}vh` }} className="relative">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 w-full grid md:grid-cols-2 gap-16 items-center">
          <div>
            {steps.map((step, i) => (
              <Step
                key={i}
                step={step}
                index={i}
                scrollYProgress={scrollYProgress}
                total={steps.length}
              />
            ))}
          </div>
          <div className="hidden md:block">
            <div className="glass-card rounded-3xl p-1 shadow-2xl" style={{ boxShadow: '0 0 80px rgba(79,70,229,0.3)' }}>
              <div className="bg-surface rounded-[22px] p-6 min-h-64 flex items-center justify-center">
                <div className="text-center text-muted text-sm">App preview</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
