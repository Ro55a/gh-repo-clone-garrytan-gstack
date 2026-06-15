import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import {
  BookOpen, Users, Briefcase, Heart, Plus, Trash2,
  Upload, FileText, Zap, TrendingUp, History,
  Copy, ChevronDown, ArrowLeft, Calendar, Clock,
  Sparkles, FolderOpen
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { useAsync } from '../hooks/useApi'
import { Alert, Badge, Modal, Input, Select, Textarea, Tabs, Spinner } from '../components/ui'

const SESSION_TYPES = [
  { id: 'tutoring', label: '1-on-1 Tutoring',  icon: BookOpen,  color: '#4F46E5' },
  { id: 'group',    label: 'Group Class',        icon: Users,     color: '#7C3AED' },
  { id: 'meeting',  label: 'Business Meeting',   icon: Briefcase, color: '#06B6D4' },
  { id: 'coaching', label: 'Coaching',            icon: Heart,     color: '#10B981' },
]

const typeColor = (t) => SESSION_TYPES.find((s) => s.id === t)?.color || '#4F46E5'
const TypeIcon = ({ type, size = 16 }) => {
  const T = SESSION_TYPES.find((s) => s.id === type)
  return T ? <T.icon size={size} style={{ color: T.color }} /> : <BookOpen size={size} />
}

// ─── Session Type Picker ──────────────────────────────────────────────────────

function SessionTypePicker({ value, onChange }) {
  return (
    <div>
      <p className="label-upper mb-2.5">Session Type</p>
      <div className="grid grid-cols-2 gap-1.5">
        {SESSION_TYPES.map((t) => {
          const active = value === t.id
          return (
            <motion.button
              key={t.id}
              onClick={() => onChange(t.id)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2.5 p-3 rounded-lg text-left transition-all relative overflow-hidden"
              style={{
                background: active ? `${t.color}14` : '#0E0E12',
                border: `1px solid ${active ? t.color + '35' : '#1C1C26'}`,
                color: active ? '#EEEAE2' : '#4D4B58',
              }}
            >
              {active && (
                <motion.div layoutId="type-active" className="absolute inset-0 rounded-lg"
                  style={{ background: `${t.color}0a`, border: `1px solid ${t.color}25` }} />
              )}
              <div className="relative z-10 w-6 h-6 rounded flex items-center justify-center shrink-0"
                style={{ background: active ? `${t.color}25` : '#1C1C26' }}>
                <t.icon size={12} style={{ color: active ? t.color : '#4D4B58' }} />
              </div>
              <span className="relative z-10 text-xs font-medium">{t.label}</span>
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
    <aside className="w-60 shrink-0 flex flex-col h-screen sticky top-0" style={{ background: '#0B0B0E', borderRight: '1px solid #1C1C26' }}>
      {/* Header */}
      <div className="px-4 py-5 flex items-center justify-between" style={{ borderBottom: '1px solid #1C1C26' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded flex items-center justify-center" style={{ background: '#B4FF45' }}>
            <Zap size={13} style={{ color: '#080809' }} />
          </div>
          <span className="font-display font-bold text-xs" style={{ color: '#EEEAE2', letterSpacing: '0.08em' }}>SESSIONIQ</span>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/')}
          className="p-1.5 rounded transition-colors"
          style={{ color: '#4D4B58' }}
          onMouseEnter={e => e.currentTarget.style.color = '#EEEAE2'}
          onMouseLeave={e => e.currentTarget.style.color = '#4D4B58'}
          title="Home"
        >
          <ArrowLeft size={14} />
        </motion.button>
      </div>

      {/* Add button */}
      <div className="px-3 pt-3 pb-2">
        <motion.button
          whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
          onClick={onAddGroup}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold transition-all"
          style={{ background: '#B4FF45', color: '#080809', fontFamily: 'Syne, sans-serif' }}
        >
          <Plus size={13} /> New Group
        </motion.button>
      </div>

      {/* Groups list */}
      <div className="flex-1 overflow-y-auto px-2 py-1">
        <p className="px-2 py-2 label-upper">Groups</p>
        {groups.map((g) => {
          const active = selected?.name === g.name
          const color = typeColor(g.session_type)
          return (
            <button
              key={g.name}
              onClick={() => onSelect(g)}
              className="w-full flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg text-left relative overflow-hidden group mb-0.5"
              style={{ background: active ? `${color}10` : 'transparent', border: `1px solid ${active ? color + '25' : 'transparent'}` }}
            >
              {!active && (
                <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: '#0E0E12' }} />
              )}
              {active && <div className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r" style={{ background: color }} />}
              <div className="relative z-10 shrink-0">
                <TypeIcon type={g.session_type} size={13} />
              </div>
              <div className="relative z-10 flex-1 min-w-0">
                <p className="text-xs font-medium truncate" style={{ color: active ? '#EEEAE2' : '#6B6875' }}>
                  {g.name}
                </p>
                {g.next_session_date && (
                  <p className="text-[10px] flex items-center gap-1 mt-0.5" style={{ color: '#4D4B58' }}>
                    <Calendar size={8} /> {g.next_session_date}
                  </p>
                )}
              </div>
            </button>
          )
        })}
        {!groups.length && (
          <p className="px-2 py-6 text-center" style={{ fontSize: 11, color: '#4D4B58' }}>No groups yet.</p>
        )}
      </div>

      <div className="px-4 py-3" style={{ borderTop: '1px solid #1C1C26' }}>
        <p style={{ fontSize: 10, color: '#3A3A45', textAlign: 'center', letterSpacing: '0.06em' }}>POWERED BY CLAUDE AI</p>
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
        <Input label="Name" value={name} onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Emma Cohen, Marketing Team, Friday Group..."
          onKeyDown={(e) => e.key === 'Enter' && submit()} />
        <SessionTypePicker value={type} onChange={setType} />
        <Input label="Next session date (optional)" value={nextDate} onChange={(e) => setNextDate(e.target.value)}
          placeholder="e.g. 20 June 2026, every Thursday..." type="text" />
        <Textarea label="Additional context (optional)" value={context} onChange={(e) => setContext(e.target.value)}
          placeholder="e.g. preparing for Bar Mitzvah, Q3 strategy review..." style={{ minHeight: 80 }} />
        <div className="flex justify-end gap-2 pt-1">
          <button onClick={onClose} className="px-4 py-2 text-xs transition-colors" style={{ color: '#4D4B58' }}
            onMouseEnter={e => e.currentTarget.style.color = '#EEEAE2'} onMouseLeave={e => e.currentTarget.style.color = '#4D4B58'}>
            Cancel
          </button>
          <motion.button onClick={submit} disabled={!name.trim() || loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs font-bold disabled:opacity-40 transition-all"
            style={{ background: '#B4FF45', color: '#080809', fontFamily: 'Syne, sans-serif' }}>
            {loading && <Spinner size={12} />} Add Group
          </motion.button>
        </div>
      </div>
    </Modal>
  )
}

// ─── Upload Zone ───────────────────────────────────────────────────────────────

function UploadZone({ onUpload }) {
  const [dragOver, setDragOver] = useState(false)
  return (
    <motion.label
      onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => { e.preventDefault(); setDragOver(false); onUpload(e.dataTransfer.files) }}
      animate={{ scale: dragOver ? 1.005 : 1 }}
      className="flex flex-col items-center justify-center gap-3 rounded-xl p-10 cursor-pointer mb-6 transition-all"
      style={{
        border: `1px dashed ${dragOver ? 'rgba(180,255,69,0.4)' : '#1C1C26'}`,
        background: dragOver ? 'rgba(180,255,69,0.03)' : 'rgba(255,255,255,0.01)',
      }}
    >
      <motion.div
        animate={{ scale: dragOver ? 1.1 : 1 }}
        className="w-10 h-10 rounded-lg flex items-center justify-center"
        style={{ background: '#1C1C26', border: '1px solid #26262F' }}
      >
        <Upload size={18} style={{ color: dragOver ? '#B4FF45' : '#4D4B58' }} />
      </motion.div>
      <div className="text-center">
        <p className="text-xs font-medium mb-1" style={{ color: dragOver ? '#EEEAE2' : '#6B6875' }}>
          {dragOver ? 'Drop to upload' : 'Drop files here or click to upload'}
        </p>
        <p style={{ fontSize: 10, color: '#4D4B58', letterSpacing: '0.06em' }}>DOCX · PDF · TXT · MARKDOWN</p>
      </div>
      <input type="file" className="hidden" multiple accept=".docx,.txt,.md,.pdf" onChange={(e) => onUpload(e.target.files)} />
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
      const ext = '.' + file.name.split('.').pop().toLowerCase()
      if (!['.docx', '.txt', '.md', '.pdf'].includes(ext)) {
        setAlert({ type: 'error', msg: `${file.name}: unsupported type.` }); return
      }
    }
    await run(async () => { for (const file of fileList) await api.uploadMaterial(group.name, file) })
    setAlert({ type: 'success', msg: 'Uploaded successfully.' })
    load()
  }

  const remove = async (filename) => { await run(() => api.deleteMaterial(group.name, filename)); load() }

  const extColor = (f) => {
    const ext = f.split('.').pop().toLowerCase()
    return ext === 'pdf' ? '#FF6B6B' : ext === 'docx' ? '#4F46E5' : ext === 'md' ? '#06B6D4' : '#4D4B58'
  }

  return (
    <div>
      <h2 className="font-display font-bold text-xl mb-1" style={{ color: '#EEEAE2', letterSpacing: '-0.02em' }}>Reference Materials</h2>
      <p className="text-xs mb-6" style={{ color: '#4D4B58' }}>Upload documents, notes, or curriculum files. Supports DOCX, PDF, TXT, Markdown.</p>
      <AnimatePresence>{alert && <Alert message={alert.msg} type={alert.type} onDismiss={() => setAlert(null)} />}</AnimatePresence>
      <UploadZone onUpload={upload} />
      {loading && <div className="flex justify-center py-4"><Spinner /></div>}
      <div className="space-y-1.5">
        {files.map((f) => (
          <motion.div key={f} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 p-3.5 rounded-xl group transition-colors"
            style={{ background: '#0E0E12', border: '1px solid #1C1C26' }}>
            <div className="w-7 h-7 rounded flex items-center justify-center shrink-0" style={{ background: `${extColor(f)}15`, border: `1px solid ${extColor(f)}30` }}>
              <FileText size={12} style={{ color: extColor(f) }} />
            </div>
            <span className="flex-1 text-xs truncate" style={{ color: '#EEEAE2' }}>{f}</span>
            <span style={{ fontSize: 9, fontFamily: 'monospace', color: '#4D4B58', marginRight: 4, letterSpacing: '0.06em' }}>
              {f.split('.').pop().toUpperCase()}
            </span>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => remove(f)}
              className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#4D4B58' }}
              onMouseEnter={e => e.currentTarget.style.color = '#FF6B6B'} onMouseLeave={e => e.currentTarget.style.color = '#4D4B58'}>
              <Trash2 size={12} />
            </motion.button>
          </motion.div>
        ))}
      </div>
      {!files.length && !loading && (
        <div className="text-center py-12">
          <FolderOpen size={28} className="mx-auto mb-3" style={{ color: '#2E2E3A' }} />
          <p style={{ fontSize: 12, color: '#4D4B58' }}>No files uploaded yet.</p>
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
      if (!t) return; sid = t.session_id
    } else if (inputMode === 'file' && file) {
      const t = await run(() => api.submitTranscript(group.name, null, file))
      if (!t) return; sid = t.session_id
    }
    const result = await run(() => api.generatePlan(group.name, sid, sessionType, group.extra_context, sessionDate))
    if (result) setPlan(result.plan)
  }

  return (
    <div>
      <h2 className="font-display font-bold text-xl mb-1" style={{ color: '#EEEAE2', letterSpacing: '-0.02em' }}>Generate Session Plan</h2>
      <p className="text-xs mb-6" style={{ color: '#4D4B58' }}>Paste your last transcript and Claude will generate a structured plan for your next session.</p>
      <AnimatePresence>{(error || alert) && <Alert message={error || alert?.msg} type={alert?.type || 'error'} onDismiss={() => setAlert(null)} />}</AnimatePresence>

      <div className="space-y-5 mb-6">
        <SessionTypePicker value={sessionType} onChange={setSessionType} />
        <Input label="Next session date (optional)" value={sessionDate} onChange={(e) => setSessionDate(e.target.value)} placeholder="e.g. 20 June 2026" />
        <Tabs tabs={[{ id: 'paste', label: 'Paste transcript', icon: FileText }, { id: 'file', label: 'Upload file', icon: Upload }]} active={inputMode} onChange={setInputMode} />
        {inputMode === 'paste' && (
          <Textarea value={transcript} onChange={(e) => setTranscript(e.target.value)} placeholder="Paste your transcript here... (leave blank for first session)" />
        )}
        {inputMode === 'file' && (
          <input type="file" accept=".docx,.txt,.md,.pdf" onChange={(e) => setFile(e.target.files[0])}
            className="w-full text-xs text-muted file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-border file:bg-surface file:text-ink file:text-xs file:cursor-pointer" />
        )}
      </div>

      <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} onClick={generate} disabled={loading}
        className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-40 transition-all"
        style={{ background: '#B4FF45', color: '#080809', fontFamily: 'Syne, sans-serif' }}>
        {loading ? <><Spinner size={14} /> Generating plan...</> : <><Sparkles size={14} /> Generate Session Plan</>}
      </motion.button>

      <AnimatePresence>
        {plan && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mt-6 rounded-xl overflow-hidden" style={{ background: '#0E0E12', border: '1px solid #1C1C26' }}>
            <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #1C1C26' }}>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#B4FF45' }} />
                <span className="text-xs font-bold" style={{ color: '#B4FF45', fontFamily: 'Syne, sans-serif', letterSpacing: '0.06em' }}>SESSION PLAN</span>
                {sessionDate && <span className="text-xs flex items-center gap-1" style={{ color: '#4D4B58' }}><Calendar size={9} /> {sessionDate}</span>}
              </div>
              <motion.button whileHover={{ scale: 1.05 }} onClick={() => navigator.clipboard.writeText(plan)}
                className="flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors" style={{ color: '#4D4B58' }}
                onMouseEnter={e => e.currentTarget.style.color = '#EEEAE2'} onMouseLeave={e => e.currentTarget.style.color = '#4D4B58'}>
                <Copy size={10} /> Copy
              </motion.button>
            </div>
            <div className="p-5 prose-dark max-h-96 overflow-y-auto">
              <ReactMarkdown>{plan}</ReactMarkdown>
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
    const result = await run(() => api.generateReport(group.name, selectedSession, inputMode === 'paste' ? transcript : null, inputMode === 'file' ? file : null, group.session_type))
    if (result) setReport(result.report)
  }

  return (
    <div>
      <h2 className="font-display font-bold text-xl mb-1" style={{ color: '#EEEAE2', letterSpacing: '-0.02em' }}>Improvement Report</h2>
      <p className="text-xs mb-6" style={{ color: '#4D4B58' }}>Provide a transcript from a completed session and get honest, detailed feedback on how to improve.</p>
      <AnimatePresence>{(error || alert) && <Alert message={error || alert?.msg} type={alert?.type || 'error'} onDismiss={() => setAlert(null)} />}</AnimatePresence>

      <div className="space-y-4 mb-6">
        <Select label="Session to compare against" value={selectedSession} onChange={(e) => setSelectedSession(e.target.value)}>
          <option value="">-- Select session --</option>
          {sessions.filter((s) => s.plan).map((s) => (
            <option key={s.id} value={s.id}>{s.session_date || s.created_at || s.id} — has plan</option>
          ))}
          {!sessions.filter((s) => s.plan).length && <option disabled>No sessions with plans yet</option>}
        </Select>
        <Tabs tabs={[{ id: 'paste', label: 'Paste transcript', icon: FileText }, { id: 'file', label: 'Upload file', icon: Upload }, { id: 'saved', label: 'Use saved', icon: History }]}
          active={inputMode} onChange={setInputMode} />
        {inputMode === 'paste' && <Textarea value={transcript} onChange={(e) => setTranscript(e.target.value)} placeholder="Paste the transcript from the session you just finished..." />}
        {inputMode === 'file' && (
          <input type="file" accept=".docx,.txt,.md,.pdf" onChange={(e) => setFile(e.target.files[0])}
            className="w-full text-xs text-muted file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-border file:bg-surface file:text-ink file:text-xs file:cursor-pointer" />
        )}
        {inputMode === 'saved' && (
          <p className="text-xs p-3 rounded-xl" style={{ color: '#4D4B58', background: '#0E0E12', border: '1px solid #1C1C26' }}>
            The transcript saved with the selected session will be used.
          </p>
        )}
      </div>

      <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} onClick={generate} disabled={loading || !selectedSession}
        className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-40 transition-all"
        style={{ background: '#10B981', color: '#080809', fontFamily: 'Syne, sans-serif' }}>
        {loading ? <><Spinner size={14} /> Generating report...</> : <><TrendingUp size={14} /> Generate Improvement Report</>}
      </motion.button>

      <AnimatePresence>
        {report && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mt-6 rounded-xl overflow-hidden" style={{ background: '#0A140E', border: '1px solid rgba(16,185,129,0.2)' }}>
            <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(16,185,129,0.15)' }}>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#10B981' }} />
                <span className="text-xs font-bold" style={{ color: '#10B981', fontFamily: 'Syne, sans-serif', letterSpacing: '0.06em' }}>IMPROVEMENT REPORT</span>
              </div>
              <motion.button whileHover={{ scale: 1.05 }} onClick={() => navigator.clipboard.writeText(report)}
                className="flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors" style={{ color: '#4D4B58' }}
                onMouseEnter={e => e.currentTarget.style.color = '#EEEAE2'} onMouseLeave={e => e.currentTarget.style.color = '#4D4B58'}>
                <Copy size={10} /> Copy
              </motion.button>
            </div>
            <div className="p-5 prose-dark max-h-96 overflow-y-auto">
              <ReactMarkdown>{report}</ReactMarkdown>
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

  useEffect(() => { api.getSessions(group.name).then(setSessions) }, [group.name])

  return (
    <div>
      <h2 className="font-display font-bold text-xl mb-1" style={{ color: '#EEEAE2', letterSpacing: '-0.02em' }}>Session History</h2>
      <p className="text-xs mb-6" style={{ color: '#4D4B58' }}>All past sessions with their plans, transcripts, and reports.</p>

      {!sessions.length && (
        <div className="text-center py-16">
          <History size={28} className="mx-auto mb-3" style={{ color: '#2E2E3A' }} />
          <p style={{ fontSize: 12, color: '#4D4B58' }}>No sessions yet.</p>
        </div>
      )}

      <div className="space-y-2">
        {sessions.map((s, i) => (
          <motion.div key={s.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            className="rounded-xl overflow-hidden" style={{ background: '#0E0E12', border: '1px solid #1C1C26' }}>
            <button onClick={() => setExpanded(expanded === s.id ? null : s.id)}
              className="w-full flex items-center gap-3 p-4 text-left transition-colors"
              style={{ background: 'transparent' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#1C1C26' }}>
                <Calendar size={13} style={{ color: '#4D4B58' }} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold" style={{ color: '#EEEAE2' }}>{s.session_date || s.created_at || s.id}</p>
                {s.session_date && s.created_at && (
                  <p className="flex items-center gap-1 mt-0.5" style={{ fontSize: 10, color: '#4D4B58' }}>
                    <Clock size={8} /> Created {s.created_at}
                  </p>
                )}
                <div className="flex gap-1.5 mt-2">
                  {s.plan && <Badge color="indigo">Plan</Badge>}
                  {s.report && <Badge color="emerald">Report</Badge>}
                  {(s.transcript || s.lesson_transcript) && <Badge color="cyan">Transcript</Badge>}
                </div>
              </div>
              <motion.div animate={{ rotate: expanded === s.id ? 180 : 0 }} transition={{ duration: 0.18 }} style={{ color: '#4D4B58' }}>
                <ChevronDown size={14} />
              </motion.div>
            </button>

            <AnimatePresence>
              {expanded === s.id && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                  className="overflow-hidden" style={{ borderTop: '1px solid #1C1C26' }}>
                  <div className="p-5 space-y-5">
                    {s.plan && (
                      <div>
                        <p className="label-upper mb-3 flex items-center gap-1.5" style={{ color: '#B4FF45' }}>
                          <Zap size={9} /> Session Plan
                        </p>
                        <div className="prose-dark max-h-64 overflow-y-auto rounded-xl p-4" style={{ background: '#080809', border: '1px solid #1C1C26', fontSize: 12 }}>
                          <ReactMarkdown>{s.plan}</ReactMarkdown>
                        </div>
                      </div>
                    )}
                    {s.report && (
                      <div>
                        <p className="label-upper mb-3 flex items-center gap-1.5" style={{ color: '#10B981' }}>
                          <TrendingUp size={9} /> Improvement Report
                        </p>
                        <div className="prose-dark max-h-64 overflow-y-auto rounded-xl p-4" style={{ background: '#080809', border: '1px solid rgba(16,185,129,0.15)', fontSize: 12 }}>
                          <ReactMarkdown>{s.report}</ReactMarkdown>
                        </div>
                      </div>
                    )}
                    {(s.transcript || s.lesson_transcript) && (
                      <div>
                        <p className="label-upper mb-3">Transcript</p>
                        <pre className="max-h-48 overflow-y-auto rounded-xl p-4 whitespace-pre-wrap" style={{ fontSize: 11, color: '#4D4B58', background: '#080809', border: '1px solid #1C1C26' }}>
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
  { id: 'materials', label: 'Materials',     icon: FileText  },
  { id: 'plan',      label: 'Session Plan',  icon: Zap       },
  { id: 'report',    label: 'Report',        icon: TrendingUp },
  { id: 'history',   label: 'History',       icon: History   },
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

  const handleGroupCreated = (g) => { loadGroups(); setSelected(g); setTab('materials') }
  const color = selected ? typeColor(selected.session_type) : '#4F46E5'

  return (
    <div className="flex min-h-screen" style={{ background: '#080809' }}>
      <Sidebar groups={groups} selected={selected} onSelect={(g) => { setSelected(g); setTab('materials') }} onAddGroup={() => setAddOpen(true)} />

      <main className="flex-1 overflow-y-auto">
        {!selected ? (
          <div className="flex flex-col items-center justify-center h-full min-h-screen text-center p-10">
            <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="w-16 h-16 rounded-xl flex items-center justify-center mb-6"
              style={{ background: '#B4FF45' }}>
              <Zap size={28} style={{ color: '#080809' }} />
            </motion.div>
            <motion.h2 initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
              className="font-display font-bold text-2xl mb-3" style={{ color: '#EEEAE2', letterSpacing: '-0.02em' }}>
              Welcome to SessionIQ
            </motion.h2>
            <motion.p initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}
              className="text-xs mb-8 max-w-xs" style={{ color: '#4D4B58', lineHeight: 1.7 }}>
              Add your first group or participant to get started with AI-powered session planning.
            </motion.p>
            <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
              <motion.button onClick={() => setAddOpen(true)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold"
                style={{ background: '#B4FF45', color: '#080809', fontFamily: 'Syne, sans-serif' }}>
                <Plus size={15} /> Add Group
              </motion.button>
            </motion.div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto p-8">
            {/* Group header */}
            <motion.div key={selected.name} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 mb-8 p-5 rounded-xl"
              style={{ background: '#0E0E12', border: '1px solid #1C1C26' }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `${color}14`, border: `1px solid ${color}28` }}>
                <TypeIcon type={selected.session_type} size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="font-display font-bold text-lg mb-1" style={{ color: '#EEEAE2', letterSpacing: '-0.02em' }}>{selected.name}</h1>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="text-xs px-2 py-0.5 rounded font-medium" style={{ background: `${color}15`, color, border: `1px solid ${color}25` }}>
                    {SESSION_TYPES.find((t) => t.id === selected.session_type)?.label}
                  </span>
                  {selected.extra_context && <p className="text-xs truncate max-w-xs" style={{ color: '#4D4B58' }}>{selected.extra_context}</p>}
                  {selected.next_session_date && (
                    <p className="text-xs flex items-center gap-1" style={{ color: '#06B6D4' }}><Calendar size={9} /> Next: {selected.next_session_date}</p>
                  )}
                  {selected.created_at && (
                    <p className="text-xs flex items-center gap-1" style={{ color: '#4D4B58' }}><Clock size={9} /> Added {selected.created_at}</p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Tab bar */}
            <div className="tab-pill mb-8">
              {MAIN_TABS.map((t) => {
                const active = tab === t.id
                return (
                  <button key={t.id} onClick={() => setTab(t.id)}
                    className="relative flex items-center gap-1.5 px-3.5 py-2 rounded text-xs font-medium transition-colors z-10"
                    style={{ color: active ? '#EEEAE2' : '#4D4B58' }}>
                    {active && (
                      <motion.div layoutId="tab-indicator" className="absolute inset-0 rounded"
                        style={{ background: '#1C1C26', border: '1px solid #26262F' }} />
                    )}
                    <t.icon size={12} className="relative z-10" />
                    <span className="relative z-10">{t.label}</span>
                  </button>
                )
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.16 }}>
                {tab === 'materials' && <MaterialsTab group={selected} />}
                {tab === 'plan'      && <PlanTab group={selected} />}
                {tab === 'report'    && <ReportTab group={selected} />}
                {tab === 'history'   && <HistoryTab group={selected} />}
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </main>

      <AddGroupModal open={addOpen} onClose={() => setAddOpen(false)} onCreated={handleGroupCreated} />
    </div>
  )
}
