import { motion, AnimatePresence } from 'framer-motion'
import { X, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'

export function Spinner({ size = 16, className = '' }) {
  return (
    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }} className={className} style={{ width: size, height: size }}>
      <Loader2 size={size} />
    </motion.div>
  )
}

export function Alert({ message, type = 'error', onDismiss }) {
  if (!message) return null
  const isError = type === 'error'
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
      className="flex items-start gap-3 p-3.5 rounded-xl text-xs mb-4"
      style={{
        background: isError ? 'rgba(255,107,107,0.08)' : 'rgba(180,255,69,0.06)',
        border: `1px solid ${isError ? 'rgba(255,107,107,0.25)' : 'rgba(180,255,69,0.2)'}`,
        color: isError ? '#FF8080' : '#B4FF45',
      }}
    >
      {isError ? <AlertCircle size={14} className="shrink-0 mt-0.5" /> : <CheckCircle size={14} className="shrink-0 mt-0.5" />}
      <span className="flex-1">{message}</span>
      {onDismiss && (
        <button onClick={onDismiss} className="shrink-0 opacity-50 hover:opacity-100" style={{ color: 'inherit' }}>
          <X size={12} />
        </button>
      )}
    </motion.div>
  )
}

export function Badge({ children, color = 'indigo' }) {
  const styles = {
    indigo:  { background: 'rgba(79,70,229,0.15)',  color: '#818CF8', border: '1px solid rgba(79,70,229,0.25)' },
    violet:  { background: 'rgba(124,58,237,0.15)', color: '#A78BFA', border: '1px solid rgba(124,58,237,0.25)' },
    cyan:    { background: 'rgba(6,182,212,0.12)',   color: '#67E8F9', border: '1px solid rgba(6,182,212,0.25)' },
    emerald: { background: 'rgba(16,185,129,0.12)',  color: '#6EE7B7', border: '1px solid rgba(16,185,129,0.25)' },
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium" style={styles[color] || styles.indigo}>
      {children}
    </span>
  )
}

export function Modal({ open, onClose, title, children }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
          onClick={(e) => e.target === e.currentTarget && onClose()}>
          <motion.div initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md rounded-xl p-6 shadow-2xl"
            style={{ background: '#0E0E12', border: '1px solid #1C1C26' }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-bold text-base" style={{ color: '#EEEAE2', letterSpacing: '-0.01em' }}>{title}</h3>
              <button onClick={onClose} className="p-1 transition-colors" style={{ color: '#4D4B58' }}
                onMouseEnter={e => e.currentTarget.style.color = '#EEEAE2'} onMouseLeave={e => e.currentTarget.style.color = '#4D4B58'}>
                <X size={16} />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function Input({ label, ...props }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="label-upper">{label}</label>}
      <input {...props} className="w-full rounded-lg px-3 py-2.5 text-xs outline-none transition-all"
        style={{ background: '#080809', border: '1px solid #1C1C26', color: '#EEEAE2', caretColor: '#B4FF45' }}
        onFocus={e => e.currentTarget.style.borderColor = '#26262F'}
        onBlur={e => e.currentTarget.style.borderColor = '#1C1C26'} />
    </div>
  )
}

export function Select({ label, children, ...props }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="label-upper">{label}</label>}
      <select {...props} className="w-full rounded-lg px-3 py-2.5 text-xs outline-none transition-all appearance-none cursor-pointer"
        style={{ background: '#080809', border: '1px solid #1C1C26', color: '#EEEAE2' }}
        onFocus={e => e.currentTarget.style.borderColor = '#26262F'} onBlur={e => e.currentTarget.style.borderColor = '#1C1C26'}>
        {children}
      </select>
    </div>
  )
}

export function Textarea({ label, ...props }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="label-upper">{label}</label>}
      <textarea {...props} className="w-full rounded-lg px-3 py-2.5 text-xs outline-none transition-all resize-vertical min-h-[120px]"
        style={{ background: '#080809', border: '1px solid #1C1C26', color: '#EEEAE2', caretColor: '#B4FF45' }}
        onFocus={e => e.currentTarget.style.borderColor = '#26262F'} onBlur={e => e.currentTarget.style.borderColor = '#1C1C26'} />
    </div>
  )
}

export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex gap-1 p-1 rounded-xl mb-5" style={{ background: '#080809', border: '1px solid #1C1C26' }}>
      {tabs.map((tab) => (
        <button key={tab.id} onClick={() => onChange(tab.id)}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all"
          style={{ background: active === tab.id ? '#1C1C26' : 'transparent', color: active === tab.id ? '#EEEAE2' : '#4D4B58', border: active === tab.id ? '1px solid #26262F' : '1px solid transparent' }}>
          {tab.icon && <tab.icon size={12} />}
          {tab.label}
        </button>
      ))}
    </div>
  )
}
