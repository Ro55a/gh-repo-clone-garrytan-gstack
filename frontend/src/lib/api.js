const BASE = '/api'

async function req(path, method = 'GET', body = null) {
  const res = await fetch(`${BASE}${path}`, { method, body })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail || 'Request failed')
  }
  return res.json()
}

export const api = {
  getGroups: () => req('/groups'),
  createGroup: (name, session_type, extra_context) => {
    const fd = new FormData()
    fd.append('name', name)
    fd.append('session_type', session_type)
    fd.append('extra_context', extra_context || '')
    return req('/groups', 'POST', fd)
  },

  getMaterials: (group) => req(`/materials/${enc(group)}`),
  uploadMaterial: (group, file) => {
    const fd = new FormData()
    fd.append('file', file)
    return req(`/materials/${enc(group)}`, 'POST', fd)
  },
  deleteMaterial: (group, filename) =>
    req(`/materials/${enc(group)}/${enc(filename)}`, 'DELETE'),

  submitTranscript: (group, text, file) => {
    const fd = new FormData()
    if (file) fd.append('file', file)
    else if (text) fd.append('text', text)
    return req(`/transcript/${enc(group)}`, 'POST', fd)
  },

  generatePlan: (group, sessionId, sessionType, extraContext) => {
    const fd = new FormData()
    fd.append('session_type', sessionType || 'tutoring')
    if (sessionId) fd.append('session_id', sessionId)
    if (extraContext) fd.append('extra_context', extraContext)
    return req(`/plan/${enc(group)}`, 'POST', fd)
  },

  generateReport: (group, sessionId, text, file, sessionType) => {
    const fd = new FormData()
    fd.append('session_type', sessionType || 'tutoring')
    if (file) fd.append('file', file)
    else if (text) fd.append('transcript_text', text)
    return req(`/report/${enc(group)}/${sessionId}`, 'POST', fd)
  },

  getSessions: (group) => req(`/sessions/${enc(group)}`),
}

const enc = (s) => encodeURIComponent(s)
