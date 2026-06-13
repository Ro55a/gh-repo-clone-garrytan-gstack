import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import {
  BookOpen, Users, Briefcase, Heart, Plus, Trash2,
  Upload, FileText, Zap, TrendingUp, History,
  Copy, ChevronDown, ChevronUp, X, ArrowLeft
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { useAsync } from '../hooks/useApi'
import ShinyButton from '../reactbits/ShinyButton'
import GlowBorder from '../reactbits/GlowBorder'
import AnimatedList from '../reactbits/AnimatedList'
import TiltCard from '../reactbits/TiltCard'
import { Alert, Badge, Modal, Input, Select, Textarea, Tabs, Spinner } from '../components/ui'

const SESSION_TYPES = [
  { id: 'tutoring', label: '1-on-1 Tutoring', icon: BookOpen, color: '#4F46E5' },
  { id: 'group', label: 'Group Class', icon: Users, color: '#7C3AED' },
  { id: 'meeting', label: 'Business Meeting', icon: Briefcase, color: '#06B6D4' },
  { id: 'coaching', label: 'Coaching', icon: Heart, color: '#10B981' },
]

const typeColor = (t) => SESSION_TYPES.find((s) => s.id === t)?.color || '#4F46E5'
const TypeIcon = ({ type, size = 16 }) => {
  const T = SESSION_TYPES.find((s) => s.id === type)
  return T ? <T.icon size={size} style={{ color: T.color }} /> : <BookOpen size={size} />
}

function formatTs(ts) {
  if (!ts || ts.length < 15) return ts
  return `${ts.slice(0, 4)}-${ts.slice(4, 6)}-${ts.slice(6, 8)} ${ts.slice(9, 11)}:${ts.slice(11, 13)}`
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({ groups, selected, onSelect, onAddGroup }) {
  const navigate = useNavigate()
  return (
    <aside className="w-64 shrink-0 bg-sidebar border-r border-border flex flex-col h-screen sticky top-0">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-violet flex items-center justify-center">
            <Zap size={14} className="text-white" />
          </div>
          <span className="font-bold">SessionIQ</span>
        </div>
        <button onClick={() => navigate('/')} className="text-muted hover:text-white transition-colors" title="Home">
          <ArrowLeft size={16} />
        </button>
      </div>

      <div className="p-3">
        <GlowBorder onClick={onAddGroup} className="w-full justify-center text-sm py-2.5">
          <Plus size={15} /> New Group
        </GlowBorder>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        <p className="px-2 py-1 text-xs text-muted uppercase tracking-widest font-medium">Groups</p>
        <AnimatedList
          items={groups}
          keyFn={(g) => g.name}
          renderItem={(g) => (
            <button
              onClick={() => onSelect(g)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-left ${
                selected?.name === g.name
                  ? 'bg-primary/20 text-white border border-primary/30'
                  : 'text-muted hover:text-white hover:bg-white/5'
              }`}
            >
              <TypeIcon type={g.session_type} size={15} />
              <span className="flex-1 truncate font-medium">{g.name}</span>
            </button>
          )}
        />
        {!groups.length && (
          <p className="px-3 py-4 text-xs text-muted text-center">No groups yet. Add one above.</p>
        )}
      </div>
    </aside>
  )
}

// ─── Add Group Modal ───────────────────────────────────────────────────────────

function AddGroupModal({ open, onClose, onCreated }) {
  const [name, setName] = useState('')
  const [type, setType] = useState('tutoring')
  const [context, setContext] = useState('')
  const { loading, error, run } = useAsync()

  const submit = async () => {
    const g = await run(() => api.createGroup(name.trim(), type, context.trim()))
    if (g) { onCreated(g); onClose(); setName(''); setContext('') }
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
        <Select label="Session Type" value={type} onChange={(e) => setType(e.target.value)}>
          {SESSION_TYPES.map((t) => (
            <option key={t.id} value={t.id}>{t.label}</option>
          ))}
        </Select>
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

// ─── Materials Tab ─────────────────────────────────────────────────────────────

function MaterialsTab({ group }) {
  const [files, setFiles] = useState([])
  const [alert, setAlert] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const { loading, run } = useAsync()

  const load = useCallback(async () => {
    const d = await api.getMaterials(group.name)
    setFiles(d.files || [])
  }, [group.name])

  useEffect(() => { load() }, [load])

  const upload = async (fileList) => {
    for (const file of fileList) {
      const allowed = ['.docx', '.txt', '.md']
      const ext = '.' + file.name.split('.').pop().toLowerCase()
      if (!allowed.includes(ext)) {
        setAlert({ type: 'error', msg: `${file.name}: unsupported type. Use DOCX, TXT, or MD.` })
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

  return (
    <div>
      <h2 className="text-xl font-semibold mb-1">Reference Materials</h2>
      <p className="text-muted text-sm mb-6">Upload documents, notes, or curriculum files for this group. Supports DOCX, TXT, and Markdown.</p>

      <AnimatePresence>{alert && <Alert message={alert.msg} type={alert.type} onDismiss={() => setAlert(null)} />}</AnimatePresence>

      {/* Drop zone */}
      <motion.label
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); upload(e.dataTransfer.files) }}
        animate={{ borderColor: dragOver ? '#4F46E5' : '#2A2A3A', background: dragOver ? 'rgba(79,70,229,0.08)' : 'rgba(255,255,255,0.02)' }}
        className="flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-2xl p-10 cursor-pointer transition-colors mb-6"
      >
        <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
          <Upload size={22} className="text-primary" />
        </div>
        <div className="text-center">
          <p className="font-medium mb-1">Drop files here or click to upload</p>
          <p className="text-muted text-sm">DOCX, TXT, Markdown</p>
        </div>
        <input type="file" className="hidden" multiple accept=".docx,.txt,.md" onChange={(e) => upload(e.target.files)} />
      </motion.label>

      {/* File list */}
      {loading && <div className="flex justify-center py-4"><Spinner /></div>}
      <AnimatedList
        items={files}
        keyFn={(f) => f}
        renderItem={(f) => (
          <div className="flex items-center gap-3 p-3 bg-surface border border-border rounded-xl mb-2 group">
            <FileText size={16} className="text-muted shrink-0" />
            <span className="flex-1 text-sm truncate">{f}</span>
            <button
              onClick={() => remove(f)}
              className="text-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
            >
              <Trash2 size={15} />
            </button>
          </div>
        )}
      />
      {!files.length && !loading && (
        <p className="text-center text-muted text-sm py-4">No files uploaded yet.</p>
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
  const [plan, setPlan] = useState('')
  const [sessionId, setSessionId] = useState(null)
  const [alert, setAlert] = useState(null)
  const { loading, error, run } = useAsync()

  const generate = async () => {
    setAlert(null)
    let sid = null

    // Save transcript first if provided
    if (inputMode === 'paste' && transcript.trim()) {
      const t = await run(() => api.submitTranscript(group.name, transcript.trim(), null))
      if (!t) return
      sid = t.session_id
    } else if (inputMode === 'file' && file) {
      const t = await run(() => api.submitTranscript(group.name, null, file))
      if (!t) return
      sid = t.session_id
    }

    const result = await run(() => api.generatePlan(group.name, sid, sessionType, group.extra_context))
    if (result) {
      setPlan(result.plan)
      setSessionId(result.session_id)
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-1">Generate Session Plan</h2>
      <p className="text-muted text-sm mb-6">Paste your last Granola transcript and Claude will generate a structured plan for your next session.</p>

      <AnimatePresence>{(error || alert) && <Alert message={error || alert?.msg} type={alert?.type || 'error'} onDismiss={() => setAlert(null)} />}</AnimatePresence>

      <div className="space-y-4 mb-6">
        <Select label="Session type" value={sessionType} onChange={(e) => setSessionType(e.target.value)}>
          {SESSION_TYPES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
        </Select>

        <Tabs
          tabs={[{ id: 'paste', label: 'Paste transcript', icon: FileText }, { id: 'file', label: 'Upload file', icon: Upload }]}
          active={inputMode}
          onChange={setInputMode}
        />

        {inputMode === 'paste' && (
          <Textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Paste your Granola transcript here... (leave blank for first session)"
          />
        )}
        {inputMode === 'file' && (
          <div className="space-y-2">
            <label className="text-sm text-muted">Transcript file</label>
            <input
              type="file"
              accept=".docx,.txt,.md"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full text-sm text-muted file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-border file:bg-surface file:text-white file:text-xs file:cursor-pointer"
            />
          </div>
        )}
      </div>

      <ShinyButton onClick={generate} disabled={loading} className="w-full py-3">
        {loading ? <><Spinner size={16} /> Generating plan...</> : <><Zap size={16} /> Generate Session Plan</>}
      </ShinyButton>

      {plan && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 bg-surface border border-border rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-accent">Session Plan</span>
            <button
              onClick={() => navigator.clipboard.writeText(plan)}
              className="flex items-center gap-1.5 text-xs text-muted hover:text-white transition-colors"
            >
              <Copy size={13} /> Copy
            </button>
          </div>
          <div className="prose-dark max-h-96 overflow-y-auto">
            <ReactMarkdown>{plan}</ReactMarkdown>
          </div>
        </motion.div>
      )}
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

  return (
    <div>
      <h2 className="text-xl font-semibold mb-1">Improvement Report</h2>
      <p className="text-muted text-sm mb-6">After your session, provide the transcript and get honest feedback on how it went and how to improve.</p>

      <AnimatePresence>{(error || alert) && <Alert message={error || alert?.msg} type={alert?.type || 'error'} onDismiss={() => setAlert(null)} />}</AnimatePresence>

      <div className="space-y-4 mb-6">
        <Select label="Session to compare against" value={selectedSession} onChange={(e) => setSelectedSession(e.target.value)}>
          <option value="">-- Select session --</option>
          {sessions.filter((s) => s.plan).map((s) => (
            <option key={s.id} value={s.id}>{formatTs(s.id)} — has plan</option>
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
            accept=".docx,.txt,.md"
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

      <ShinyButton onClick={generate} disabled={loading || !selectedSession} className="w-full py-3"
        style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)' }}>
        {loading ? <><Spinner size={16} /> Generating report...</> : <><TrendingUp size={16} /> Generate Improvement Report</>}
      </ShinyButton>

      {report && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 bg-surface border border-border rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium" style={{ color: '#10B981' }}>Improvement Report</span>
            <button
              onClick={() => navigator.clipboard.writeText(report)}
              className="flex items-center gap-1.5 text-xs text-muted hover:text-white transition-colors"
            >
              <Copy size={13} /> Copy
            </button>
          </div>
          <div className="prose-dark max-h-96 overflow-y-auto">
            <ReactMarkdown>{report}</ReactMarkdown>
          </div>
        </motion.div>
      )}
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
      <h2 className="text-xl font-semibold mb-1">Session History</h2>
      <p className="text-muted text-sm mb-6">All past sessions with their plans, transcripts, and reports.</p>

      {!sessions.length && <p className="text-center text-muted text-sm py-8">No sessions yet.</p>}

      <div className="space-y-3">
        {sessions.map((s) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface border border-border rounded-2xl overflow-hidden"
          >
            <button
              onClick={() => setExpanded(expanded === s.id ? null : s.id)}
              className="w-full flex items-center gap-3 p-4 text-left hover:bg-white/5 transition-colors"
            >
              <div>
                <p className="font-medium text-sm">{formatTs(s.id)}</p>
                <div className="flex gap-1.5 mt-1">
                  {s.plan && <Badge color="indigo">Plan</Badge>}
                  {s.report && <Badge color="emerald">Report</Badge>}
                  {(s.transcript || s.lesson_transcript) && <Badge color="cyan">Transcript</Badge>}
                </div>
              </div>
              <div className="ml-auto text-muted">
                {expanded === s.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </button>

            <AnimatePresence>
              {expanded === s.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-border overflow-hidden"
                >
                  <div className="p-4 space-y-4">
                    {s.plan && (
                      <div>
                        <p className="text-xs font-semibold text-accent mb-2 uppercase tracking-wider">Lesson Plan</p>
                        <div className="prose-dark max-h-64 overflow-y-auto bg-bg rounded-xl p-4 text-sm">
                          <ReactMarkdown>{s.plan}</ReactMarkdown>
                        </div>
                      </div>
                    )}
                    {s.report && (
                      <div>
                        <p className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: '#10B981' }}>Improvement Report</p>
                        <div className="prose-dark max-h-64 overflow-y-auto bg-bg rounded-xl p-4 text-sm">
                          <ReactMarkdown>{s.report}</ReactMarkdown>
                        </div>
                      </div>
                    )}
                    {(s.transcript || s.lesson_transcript) && (
                      <div>
                        <p className="text-xs font-semibold text-muted mb-2 uppercase tracking-wider">Transcript</p>
                        <pre className="max-h-48 overflow-y-auto bg-bg rounded-xl p-4 text-xs text-muted whitespace-pre-wrap">
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

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar
        groups={groups}
        selected={selected}
        onSelect={(g) => { setSelected(g); setTab('materials') }}
        onAddGroup={() => setAddOpen(true)}
      />

      <main className="flex-1 overflow-y-auto">
        {!selected ? (
          <div className="flex flex-col items-center justify-center h-full min-h-screen text-center p-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-violet flex items-center justify-center mb-5">
              <Zap size={28} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Welcome to SessionIQ</h2>
            <p className="text-muted text-sm max-w-xs mb-6">Add your first group or participant to get started.</p>
            <ShinyButton onClick={() => setAddOpen(true)}>
              <Plus size={16} /> Add Group
            </ShinyButton>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto p-8">
            {/* Group header */}
            <div className="flex items-center gap-3 mb-8">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${typeColor(selected.session_type)}22`, border: `1px solid ${typeColor(selected.session_type)}44` }}
              >
                <TypeIcon type={selected.session_type} size={18} />
              </div>
              <div>
                <h1 className="text-xl font-bold">{selected.name}</h1>
                <p className="text-muted text-xs">
                  {SESSION_TYPES.find((t) => t.id === selected.session_type)?.label}
                  {selected.extra_context ? ` · ${selected.extra_context}` : ''}
                </p>
              </div>
            </div>

            <Tabs tabs={MAIN_TABS} active={tab} onChange={setTab} />

            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
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
