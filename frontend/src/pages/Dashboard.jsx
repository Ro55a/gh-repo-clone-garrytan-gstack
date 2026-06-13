import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import {
  BookOpen, Users, Briefcase, Heart, Plus, Trash2,
  Upload, FileText, Zap, TrendingUp, History,
  Copy, ChevronDown, ChevronUp, ArrowLeft, Calendar, Clock,
  Sparkles, FolderOpen
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { useAsync } from '../hooks/useApi'
import ShinyButton from '../reactbits/ShinyButton'
import AnimatedList from '../reactbits/AnimatedList'
import { Alert, Badge, Modal, Input, Select, Textarea, Tabs, Spinner } from '../components/ui'

const SESSION_TYPES = [
  { id: 'tutoring', label: '1-on-1 Tutoring', icon: BookOpen, color: '#4F46E5', gradient: 'from-indigo-500 to-violet-600' },
  { id: 'group', label: 'Group Class', icon: Users, color: '#7C3AED', gradient: 'from-violet-500 to-purple-700' },
  { id: 'meeting', label: 'Business Meeting', icon: Briefcase, color: '#06B6D4', gradient: 'from-cyan-500 to-sky-600' },
  { id: 'coaching', label: 'Coaching', icon: Heart, color: '#10B981', gradient: 'from-emerald-500 to-teal-600' },
]

const typeColor = (t) => SESSION_TYPES.find((s) => s.id === t)?.color || '#4F46E5'
const typeGradient = (t) => SESSION_TYPES.find((s) => s.id === t)?.gradient || 'from-indigo-500 to-violet-600'
const TypeIcon = ({ type, size = 16 }) => {
  const T = SESSION_TYPES.find((s) => s.id === type)
  return T ? <T.icon size={size} style={{ color: T.color }} /> : <BookOpen size={size} />
}

// ─── Session Type Grid Picker ──────────────────────────────────────────────────

function SessionTypePicker({ value, onChange }) {
  return (
    <div>
      <p className="text-xs text-muted mb-2 font-medium uppercase tracking-widest">Session Type</p>
      <div className="grid grid-cols-2 gap-2">
        {SESSION_TYPES.map((t) => {
          const active = value === t.id
          return (
            <motion.button
              key={t.id}
              onClick={() => onChange(t.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className={`relative flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all overflow-hidden ${
                active
                  ? 'border-transparent text-white'
                  : 'border-border bg-surface/50 text-muted hover:text-white hover:border-white/10'
              }`}
              style={active ? { background: `linear-gradient(135deg, ${t.color}33, ${t.color}11)`, borderColor: `${t.color}55` } : {}}
            >
              {active && (
                <motion.div
                  layoutId="type-active"
                  className="absolute inset-0 rounded-xl"
                  style={{ background: `linear-gradient(135deg, ${t.color}22, ${t.color}08)`, border: `1px solid ${t.color}44` }}
                />
              )}
              <div
                className="relative z-10 w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: active ? `${t.color}33` : 'rgba(255,255,255,0.05)' }}
              >
                <t.icon size={14} style={{ color: active ? t.color : undefined }} />
              </div>
              <span className="relative z-10 text-xs font-medium leading-tight">{t.label}</span>
              {active && <div className="absolute top-2 right-2 z-10 w-1.5 h-1.5 rounded-full" style={{ background: t.color }} />}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({ groups, selected, onSelect, onAddGroup }) {
  const navigate = useNavigate()
  return (
    <aside className="w-64 shrink-0 flex flex-col h-screen sticky top-0 glass-strong border-r border-white/5">
      {/* gradient top border */}
      <div className="h-0.5 w-full" style={{ background: 'linear-gradient(90deg, #4F46E5, #7C3AED, #06B6D4)' }} />

      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-violet flex items-center justify-center shadow-lg" style={{ boxShadow: '0 0 16px rgba(79,70,229,0.5)' }}>
            <Zap size={15} className="text-white" />
          </div>
          <span className="font-bold text-sm tracking-wide">SessionIQ</span>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/')}
          className="text-muted hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5"
          title="Home"
        >
          <ArrowLeft size={15} />
        </motion.button>
      </div>

      <div className="p-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={onAddGroup}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all"
          style={{
            background: 'linear-gradient(135deg, rgba(79,70,229,0.3), rgba(124,58,237,0.2))',
            border: '1px solid rgba(79,70,229,0.4)',
            color: 'rgba(255,255,255,0.9)',
          }}
        >
          <Plus size={15} /> New Group
        </motion.button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        <p className="px-3 py-2 text-xs text-muted/60 uppercase tracking-widest font-semibold">Groups</p>
        <AnimatedList
          items={groups}
          keyFn={(g) => g.name}
          renderItem={(g) => {
            const active = selected?.name === g.name
            const color = typeColor(g.session_type)
            return (
              <button
                onClick={() => onSelect(g)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-left relative overflow-hidden group`}
              >
                {active && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-xl"
                    style={{ background: `linear-gradient(135deg, ${color}22, ${color}0a)`, border: `1px solid ${color}33` }}
                  />
                )}
                {active && (
                  <div className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r" style={{ background: color }} />
                )}
                {!active && (
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'rgba(255,255,255,0.03)' }} />
                )}
                <div className="relative z-10 shrink-0" style={{ color: active ? color : undefined }}>
                  <TypeIcon type={g.session_type} size={15} />
                </div>
                <div className="relative z-10 flex-1 min-w-0">
                  <p className={`font-medium truncate text-xs ${active ? 'text-white' : 'text-muted group-hover:text-white'}`}>{g.name}</p>
                  {g.next_session_date && (
                    <p className="text-xs text-muted/60 truncate flex items-center gap-1 mt-0.5">
                      <Calendar size={9} /> {g.next_session_date}
                    </p>
                  )}
                </div>
              </button>
            )
          }}
        />
        {!groups.length && (
          <p className="px-3 py-6 text-xs text-muted/50 text-center">No groups yet.<br />Add one above.</p>
        )}
      </div>

      <div className="p-4 border-t border-white/5">
        <p className="text-xs text-muted/40 text-center">Powered by Claude AI</p>
      </div>
    </aside>
  )
}

// ─── Add Group Modal ───────────────────────────────────────────────────────────

function AddGroupModal({ open, onClose, onCreated }) {
  const [name, setName] = useState('')
  const [type, setType] = useState('tutoring')
  const [context, setContext] = useState('')
  const [nextDate, setNextDate] = useState('')
  const { loading, error, run } = useAsync()

  const submit = async () => {
    const g = await run(() => api.createGroup(name.trim(), type, context.trim(), nextDate.trim()))
    if (g) { onCreated(g); onClose(); setName(''); setContext(''); setNextDate('') }
  }

  return (
    <Modal open={open} onClose={onClose} title="Add Group or Participant">
      <div className="space-y-4">
        <Alert message={error} />
        <Input
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Emma Cohen, Marketing Team, Friday Group..."
          onKeyDown={(e) => e.key === 'Enter' && submit()}
        />
        <SessionTypePicker value={type} onChange={setType} />
        <Input
          label="Next session date (optional)"
          value={nextDate}
          onChange={(e) => setNextDate(e.target.value)}
          placeholder="e.g. 20 June 2026, every Thursday..."
          type="text"
        />
        <Textarea
          label="Additional context (optional)"
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="e.g. preparing for Bar Mitzvah, Q3 strategy review, beginner level..."
          style={{ minHeight: 80 }}
        />
        <div className="flex justify-end gap-2 pt-1">
          <button onClick={onClose} className="px-4 py-2 text-sm text-muted hover:text-white transition-colors">Cancel</button>
          <ShinyButton onClick={submit} disabled={!name.trim() || loading} className="text-sm px-5 py-2">
            {loading && <Spinner size={14} />} Add Group
          </ShinyButton>
        </div>
      </div>
    </Modal>
  )
}

// ─── Upload Zone ───────────────────────────────────────────────────────────────

function UploadZone({ onUpload }) {
  const [dragOver, setDragOver] = useState(false)
  const angleRef = useRef(0)
  const [angle, setAngle] = useState(0)

  useEffect(() => {
    if (!dragOver) return
    const id = setInterval(() => {
      angleRef.current = (angleRef.current + 3) % 360
      setAngle(angleRef.current)
    }, 16)
    return () => clearInterval(id)
  }, [dragOver])

  return (
    <motion.label
      onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => { e.preventDefault(); setDragOver(false); onUpload(e.dataTransfer.files) }}
      animate={{ scale: dragOver ? 1.01 : 1 }}
      className="flex flex-col items-center justify-center gap-3 rounded-2xl p-10 cursor-pointer mb-6 transition-all relative overflow-hidden"
      style={dragOver ? {
        background: `conic-gradient(from ${angle}deg, #4F46E5, #7C3AED, #06B6D4, #4F46E5) border-box`,
        border: '1px solid transparent',
        padding: '1px',
      } : {
        border: '2px dashed rgba(255,255,255,0.1)',
        background: 'rgba(255,255,255,0.02)',
      }}
    >
      <div className={`flex flex-col items-center justify-center gap-3 w-full rounded-2xl p-9 ${dragOver ? 'bg-bg' : ''}`}>
        <motion.div
          animate={{ rotate: dragOver ? 360 : 0, scale: dragOver ? 1.15 : 1 }}
          transition={{ duration: dragOver ? 1 : 0.3, repeat: dragOver ? Infinity : 0, ease: 'linear' }}
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(79,70,229,0.2)', border: '1px solid rgba(79,70,229,0.3)' }}
        >
          <Upload size={22} className="text-primary" />
        </motion.div>
        <div className="text-center">
          <p className="font-medium mb-1 text-sm">{dragOver ? 'Drop to upload' : 'Drop files here or click to upload'}</p>
          <p className="text-muted text-xs">DOCX, PDF, TXT, Markdown</p>
        </div>
        <input type="file" className="hidden" multiple accept=".docx,.txt,.md,.pdf" onChange={(e) => onUpload(e.target.files)} />
      </div>
    </motion.label>
  )
}

// ─── Materials Tab ─────────────────────────────────────────────────────────────

function MaterialsTab({ group }) {
  const [files, setFiles] = useState([])
  const [alert, setAlert] = useState(null)
  const { loading, run } = useAsync()

  const load = useCallback(async () => {
    const d = await api.getMaterials(group.name)
    setFiles(d.files || [])
  }, [group.name])

  useEffect(() => { load() }, [load])

  const upload = async (fileList) => {
    for (const file of fileList) {
      const allowed = ['.docx', '.txt', '.md', '.pdf']
      const ext = '.' + file.name.split('.').pop().toLowerCase()
      if (!allowed.includes(ext)) {
        setAlert({ type: 'error', msg: `${file.name}: unsupported type. Use DOCX, TXT, PDF, or MD.` })
        return
      }
    }
    await run(async () => {
      for (const file of fileList) await api.uploadMaterial(group.name, file)
    })
    setAlert({ type: 'success', msg: 'Uploaded successfully.' })
    load()
  }

  const remove = async (filename) => {
    await run(() => api.deleteMaterial(group.name, filename))
    load()
  }

  const extColor = (f) => {
    const ext = f.split('.').pop().toLowerCase()
    if (ext === 'pdf') return '#FF6B6B'
    if (ext === 'docx') return '#4F46E5'
    if (ext === 'md') return '#06B6D4'
    return '#6B7280'
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-1">Reference Materials</h2>
      <p className="text-muted text-sm mb-6">Upload documents, notes, or curriculum files. Supports DOCX, PDF, TXT, Markdown.</p>

      <AnimatePresence>{alert && <Alert message={alert.msg} type={alert.type} onDismiss={() => setAlert(null)} />}</AnimatePresence>

      <UploadZone onUpload={upload} />

      {loading && <div className="flex justify-center py-4"><Spinner /></div>}

      <AnimatedList
        items={files}
        keyFn={(f) => f}
        renderItem={(f) => (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 p-3.5 glass-card rounded-xl mb-2 group hover:border-white/10 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${extColor(f)}22`, border: `1px solid ${extColor(f)}44` }}>
              <FileText size={14} style={{ color: extColor(f) }} />
            </div>
            <span className="flex-1 text-sm truncate text-white/80">{f}</span>
            <span className="text-xs font-mono uppercase text-muted/50 mr-1">{f.split('.').pop()}</span>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => remove(f)}
              className="text-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
            >
              <Trash2 size={14} />
            </motion.button>
          </motion.div>
        )}
      />
      {!files.length && !loading && (
        <div className="text-center py-12">
          <FolderOpen size={32} className="mx-auto text-muted/30 mb-3" />
          <p className="text-muted text-sm">No files uploaded yet.</p>
        </div>
      )}
    </div>
  )
}

// ─── Plan Tab ──────────────────────────────────────────────────────────────────

function PlanTab({ group }) {
  const [inputMode, setInputMode] = useState('paste')
  const [transcript, setTranscript] = useState('')
  const [file, setFile] = useState(null)
  const [sessionType, setSessionType] = useState(group.session_type || 'tutoring')
  const [sessionDate, setSessionDate] = useState('')
  const [plan, setPlan] = useState('')
  const [alert, setAlert] = useState(null)
  const { loading, error, run } = useAsync()

  const generate = async () => {
    setAlert(null)
    let sid = null

    if (inputMode === 'paste' && transcript.trim()) {
      const t = await run(() => api.submitTranscript(group.name, transcript.trim(), null))
      if (!t) return
      sid = t.session_id
    } else if (inputMode === 'file' && file) {
      const t = await run(() => api.submitTranscript(group.name, null, file))
      if (!t) return
      sid = t.session_id
    }

    const result = await run(() => api.generatePlan(group.name, sid, sessionType, group.extra_context, sessionDate))
    if (result) setPlan(result.plan)
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-1">Generate Session Plan</h2>
      <p className="text-muted text-sm mb-6">Paste your last transcript and Claude will generate a structured plan for your next session.</p>

      <AnimatePresence>{(error || alert) && <Alert message={error || alert?.msg} type={alert?.type || 'error'} onDismiss={() => setAlert(null)} />}</AnimatePresence>

      <div className="space-y-5 mb-6">
        <SessionTypePicker value={sessionType} onChange={setSessionType} />

        <Input
          label="Next session date (optional)"
          value={sessionDate}
          onChange={(e) => setSessionDate(e.target.value)}
          placeholder="e.g. 20 June 2026"
        />

        <Tabs
          tabs={[{ id: 'paste', label: 'Paste transcript', icon: FileText }, { id: 'file', label: 'Upload file', icon: Upload }]}
          active={inputMode}
          onChange={setInputMode}
        />

        {inputMode === 'paste' && (
          <Textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Paste your transcript here... (leave blank for first session)"
          />
        )}
        {inputMode === 'file' && (
          <input
            type="file"
            accept=".docx,.txt,.md,.pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full text-sm text-muted file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-border file:bg-surface file:text-white file:text-xs file:cursor-pointer"
          />
        )}
      </div>

      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onClick={generate}
        disabled={loading}
        className="w-full py-3.5 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
        style={{
          background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
          boxShadow: loading ? 'none' : '0 8px 32px rgba(79,70,229,0.4)',
        }}
      >
        {loading ? <><Spinner size={16} /> Generating plan...</> : <><Sparkles size={16} /> Generate Session Plan</>}
      </motion.button>

      <AnimatePresence>
        {plan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-6 gradient-border overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <span className="text-sm font-semibold text-accent">Session Plan</span>
                  {sessionDate && (
                    <span className="text-xs text-muted flex items-center gap-1 ml-1">
                      <Calendar size={11} /> {sessionDate}
                    </span>
                  )}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => navigator.clipboard.writeText(plan)}
                  className="flex items-center gap-1.5 text-xs text-muted hover:text-white transition-colors px-2.5 py-1.5 rounded-lg hover:bg-white/5"
                >
                  <Copy size={12} /> Copy
                </motion.button>
              </div>
              <div className="prose-dark max-h-96 overflow-y-auto pr-2">
                <ReactMarkdown>{plan}</ReactMarkdown>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Report Tab ────────────────────────────────────────────────────────────────

function ReportTab({ group }) {
  const [sessions, setSessions] = useState([])
  const [selectedSession, setSelectedSession] = useState('')
  const [inputMode, setInputMode] = useState('paste')
  const [transcript, setTranscript] = useState('')
  const [file, setFile] = useState(null)
  const [report, setReport] = useState('')
  const [alert, setAlert] = useState(null)
  const { loading, error, run } = useAsync()

  useEffect(() => {
    api.getSessions(group.name).then((s) => {
      setSessions(s)
      const withPlan = s.find((x) => x.plan)
      if (withPlan) setSelectedSession(withPlan.id)
    })
  }, [group.name])

  const generate = async () => {
    if (!selectedSession) { setAlert({ msg: 'Select a session to compare against.', type: 'error' }); return }
    const result = await run(() =>
      api.generateReport(group.name, selectedSession,
        inputMode === 'paste' ? transcript : null,
        inputMode === 'file' ? file : null,
        group.session_type)
    )
    if (result) setReport(result.report)
  }

  const sessionLabel = (s) => {
    const date = s.session_date || s.created_at || s.id
    return `${date} — has plan`
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-1">Improvement Report</h2>
      <p className="text-muted text-sm mb-6">Provide a transcript from a completed session and get honest, detailed feedback on how to improve.</p>

      <AnimatePresence>{(error || alert) && <Alert message={error || alert?.msg} type={alert?.type || 'error'} onDismiss={() => setAlert(null)} />}</AnimatePresence>

      <div className="space-y-4 mb-6">
        <Select label="Session to compare against" value={selectedSession} onChange={(e) => setSelectedSession(e.target.value)}>
          <option value="">-- Select session --</option>
          {sessions.filter((s) => s.plan).map((s) => (
            <option key={s.id} value={s.id}>{sessionLabel(s)}</option>
          ))}
          {!sessions.filter((s) => s.plan).length && (
            <option disabled>No sessions with plans yet — generate a plan first</option>
          )}
        </Select>

        <Tabs
          tabs={[
            { id: 'paste', label: 'Paste transcript', icon: FileText },
            { id: 'file', label: 'Upload file', icon: Upload },
            { id: 'saved', label: 'Use saved', icon: History },
          ]}
          active={inputMode}
          onChange={setInputMode}
        />

        {inputMode === 'paste' && (
          <Textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Paste the transcript from the session you just finished..."
          />
        )}
        {inputMode === 'file' && (
          <input
            type="file"
            accept=".docx,.txt,.md,.pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full text-sm text-muted file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-border file:bg-surface file:text-white file:text-xs file:cursor-pointer"
          />
        )}
        {inputMode === 'saved' && (
          <p className="text-muted text-sm p-3 bg-surface rounded-xl border border-border">
            The transcript saved with the selected session will be used.
          </p>
        )}
      </div>

      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onClick={generate}
        disabled={loading || !selectedSession}
        className="w-full py-3.5 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
        style={{
          background: 'linear-gradient(135deg, #059669, #0d9488)',
          boxShadow: (!loading && selectedSession) ? '0 8px 32px rgba(16,185,129,0.3)' : 'none',
        }}
      >
        {loading ? <><Spinner size={16} /> Generating report...</> : <><TrendingUp size={16} /> Generate Improvement Report</>}
      </motion.button>

      <AnimatePresence>
        {report && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-6 rounded-2xl overflow-hidden"
            style={{ border: '1px solid rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.05)' }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#10B981' }} />
                  <span className="text-sm font-semibold" style={{ color: '#10B981' }}>Improvement Report</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => navigator.clipboard.writeText(report)}
                  className="flex items-center gap-1.5 text-xs text-muted hover:text-white transition-colors px-2.5 py-1.5 rounded-lg hover:bg-white/5"
                >
                  <Copy size={12} /> Copy
                </motion.button>
              </div>
              <div className="prose-dark max-h-96 overflow-y-auto pr-2">
                <ReactMarkdown>{report}</ReactMarkdown>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── History Tab ───────────────────────────────────────────────────────────────

function HistoryTab({ group }) {
  const [sessions, setSessions] = useState([])
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    api.getSessions(group.name).then(setSessions)
  }, [group.name])

  return (
    <div>
      <h2 className="text-xl font-bold mb-1">Session History</h2>
      <p className="text-muted text-sm mb-6">All past sessions with their plans, transcripts, and reports.</p>

      {!sessions.length && (
        <div className="text-center py-16">
          <History size={32} className="mx-auto text-muted/30 mb-3" />
          <p className="text-muted text-sm">No sessions yet.</p>
        </div>
      )}

      <div className="space-y-3">
        {sessions.map((s, i) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="glass-card rounded-2xl overflow-hidden hover:border-white/10 transition-colors"
          >
            <button
              onClick={() => setExpanded(expanded === s.id ? null : s.id)}
              className="w-full flex items-center gap-3 p-4 text-left hover:bg-white/3 transition-colors"
            >
              <div className="w-9 h-9 rounded-xl glass flex items-center justify-center shrink-0">
                <Calendar size={15} className="text-muted" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">
                  {s.session_date || s.created_at || s.id}
                </p>
                {s.session_date && s.created_at && (
                  <p className="text-xs text-muted flex items-center gap-1 mt-0.5">
                    <Clock size={9} /> Created {s.created_at}
                  </p>
                )}
                <div className="flex gap-1.5 mt-2">
                  {s.plan && <Badge color="indigo">Plan</Badge>}
                  {s.report && <Badge color="emerald">Report</Badge>}
                  {(s.transcript || s.lesson_transcript) && <Badge color="cyan">Transcript</Badge>}
                </div>
              </div>
              <motion.div
                animate={{ rotate: expanded === s.id ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="text-muted"
              >
                <ChevronDown size={16} />
              </motion.div>
            </button>

            <AnimatePresence>
              {expanded === s.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border-t border-white/5 overflow-hidden"
                >
                  <div className="p-5 space-y-5">
                    {s.plan && (
                      <div>
                        <p className="text-xs font-bold text-accent mb-3 uppercase tracking-widest flex items-center gap-1.5">
                          <Zap size={11} /> Session Plan
                        </p>
                        <div className="prose-dark max-h-64 overflow-y-auto bg-bg/50 rounded-xl p-4 text-sm border border-accent/10">
                          <ReactMarkdown>{s.plan}</ReactMarkdown>
                        </div>
                      </div>
                    )}
                    {s.report && (
                      <div>
                        <p className="text-xs font-bold mb-3 uppercase tracking-widest flex items-center gap-1.5" style={{ color: '#10B981' }}>
                          <TrendingUp size={11} /> Improvement Report
                        </p>
                        <div className="prose-dark max-h-64 overflow-y-auto bg-bg/50 rounded-xl p-4 text-sm" style={{ border: '1px solid rgba(16,185,129,0.15)' }}>
                          <ReactMarkdown>{s.report}</ReactMarkdown>
                        </div>
                      </div>
                    )}
                    {(s.transcript || s.lesson_transcript) && (
                      <div>
                        <p className="text-xs font-bold text-muted mb-3 uppercase tracking-widest">Transcript</p>
                        <pre className="max-h-48 overflow-y-auto bg-bg/50 rounded-xl p-4 text-xs text-muted whitespace-pre-wrap border border-white/5">
                          {s.transcript || s.lesson_transcript}
                        </pre>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ─── Dashboard root ────────────────────────────────────────────────────────────

const MAIN_TABS = [
  { id: 'materials', label: 'Materials', icon: FileText },
  { id: 'plan', label: 'Session Plan', icon: Zap },
  { id: 'report', label: 'Report', icon: TrendingUp },
  { id: 'history', label: 'History', icon: History },
]

export default function Dashboard() {
  const [groups, setGroups] = useState([])
  const [selected, setSelected] = useState(null)
  const [tab, setTab] = useState('materials')
  const [addOpen, setAddOpen] = useState(false)

  const loadGroups = useCallback(async () => {
    const g = await api.getGroups()
    setGroups(g)
    if (!selected && g.length) setSelected(g[0])
  }, [selected])

  useEffect(() => { loadGroups() }, [])

  const handleGroupCreated = (g) => {
    loadGroups()
    setSelected(g)
    setTab('materials')
  }

  const color = selected ? typeColor(selected.session_type) : '#4F46E5'

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar
        groups={groups}
        selected={selected}
        onSelect={(g) => { setSelected(g); setTab('materials') }}
        onAddGroup={() => setAddOpen(true)}
      />

      <main className="flex-1 overflow-y-auto relative">
        {/* Subtle mesh background */}
        <div className="absolute inset-0 pointer-events-none opacity-30" style={{ background: 'radial-gradient(at 80% 0%, rgba(79,70,229,0.15) 0px, transparent 50%), radial-gradient(at 0% 100%, rgba(6,182,212,0.1) 0px, transparent 50%)' }} />

        {!selected ? (
          <div className="relative flex flex-col items-center justify-center h-full min-h-screen text-center p-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-violet flex items-center justify-center mb-6 shadow-2xl"
              style={{ boxShadow: '0 0 60px rgba(79,70,229,0.4)' }}
            >
              <Zap size={32} className="text-white" />
            </motion.div>
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-3xl font-black mb-3"
            >
              Welcome to SessionIQ
            </motion.h2>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="text-muted text-sm max-w-xs mb-8"
            >
              Add your first group or participant to get started with AI-powered session planning.
            </motion.p>
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
              <ShinyButton onClick={() => setAddOpen(true)}>
                <Plus size={16} /> Add Group
              </ShinyButton>
            </motion.div>
          </div>
        ) : (
          <div className="relative max-w-3xl mx-auto p-8">
            {/* Group header */}
            <motion.div
              key={selected.name}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 mb-8 p-5 glass-card rounded-2xl"
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: `linear-gradient(135deg, ${color}33, ${color}11)`, border: `1px solid ${color}44` }}
              >
                <TypeIcon type={selected.session_type} size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-black">{selected.name}</h1>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: `${color}22`, color, border: `1px solid ${color}33` }}>
                    {SESSION_TYPES.find((t) => t.id === selected.session_type)?.label}
                  </span>
                  {selected.extra_context && (
                    <p className="text-muted text-xs truncate max-w-xs">{selected.extra_context}</p>
                  )}
                  {selected.next_session_date && (
                    <p className="text-xs flex items-center gap-1" style={{ color: '#06B6D4' }}>
                      <Calendar size={11} /> Next: {selected.next_session_date}
                    </p>
                  )}
                  {selected.created_at && (
                    <p className="text-xs text-muted/50 flex items-center gap-1">
                      <Clock size={10} /> Added {selected.created_at}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Pill tab bar */}
            <div className="tab-pill mb-8">
              {MAIN_TABS.map((t) => {
                const active = tab === t.id
                return (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className="relative flex items-center gap-1.5 px-4 py-2 rounded-[9px] text-sm font-medium transition-all z-10"
                    style={{ color: active ? 'white' : 'rgba(255,255,255,0.4)' }}
                  >
                    {active && (
                      <motion.div
                        layoutId="tab-indicator"
                        className="absolute inset-0 rounded-[9px]"
                        style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
                      />
                    )}
                    <t.icon size={14} className="relative z-10" />
                    <span className="relative z-10">{t.label}</span>
                  </button>
                )
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.18 }}
              >
                {tab === 'materials' && <MaterialsTab group={selected} />}
                {tab === 'plan' && <PlanTab group={selected} />}
                {tab === 'report' && <ReportTab group={selected} />}
                {tab === 'history' && <HistoryTab group={selected} />}
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </main>

      <AddGroupModal open={addOpen} onClose={() => setAddOpen(false)} onCreated={handleGroupCreated} />
    </div>
  )
}
