import { motion, AnimatePresence } from 'framer-motion'
import { X, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'

export function Spinner({ size = 16, className = '' }) {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
      className={className}
      style={{ width: size, height: size }}
    >
      <Loader2 size={size} />
    </motion.div>
  )
}

export function Alert({ message, type = 'error', onDismiss }) {
  if (!message) return null
  const isError = type === 'error'
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className={`flex items-start gap-3 p-3 rounded-xl text-sm mb-4 ${
        isError
          ? 'bg-red-500/10 border border-red-500/30 text-red-300'
          : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
      }`}
    >
      {isError ? <AlertCircle size={16} className="shrink-0 mt-0.5" /> : <CheckCircle size={16} className="shrink-0 mt-0.5" />}
      <span className="flex-1">{message}</span>
      {onDismiss && (
        <button onClick={onDismiss} className="shrink-0 opacity-60 hover:opacity-100">
          <X size={14} />
        </button>
      )}
    </motion.div>
  )
}

export function Badge({ children, color = 'indigo' }) {
  const colors = {
    indigo: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    violet: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
    cyan: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    emerald: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${colors[color] || colors.indigo}`}>
      {children}
    </span>
  )
}

export function Modal({ open, onClose, title, children }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-surface border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-lg">{title}</h3>
              <button onClick={onClose} className="text-muted hover:text-white transition-colors">
                <X size={18} />
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
      {label && <label className="text-sm text-muted">{label}</label>}
      <input
        {...props}
        className="w-full bg-bg border border-border rounded-xl px-3 py-2.5 text-sm text-white placeholder-muted focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all"
      />
    </div>
  )
}

export function Select({ label, children, ...props }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="text-sm text-muted">{label}</label>}
      <select
        {...props}
        className="w-full bg-bg border border-border rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all appearance-none cursor-pointer"
      >
        {children}
      </select>
    </div>
  )
}

export function Textarea({ label, ...props }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="text-sm text-muted">{label}</label>}
      <textarea
        {...props}
        className="w-full bg-bg border border-border rounded-xl px-3 py-2.5 text-sm text-white placeholder-muted focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all resize-vertical min-h-[120px]"
      />
    </div>
  )
}

export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex gap-1 p-1 bg-bg rounded-xl border border-border mb-5">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            active === tab.id
              ? 'bg-surface text-white shadow-sm'
              : 'text-muted hover:text-white'
          }`}
        >
          {tab.icon && <tab.icon size={14} />}
          {tab.label}
        </button>
      ))}
    </div>
  )
}
