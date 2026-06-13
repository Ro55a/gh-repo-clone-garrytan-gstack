# SessionIQ — Project Context

## What This App Does
SessionIQ is an AI-powered session planner for tutors, coaches, teachers, and meeting hosts. Users upload transcripts or paste them in, and Claude generates structured session plans and improvement reports. Built by a Hebrew Bar/Bat Mitzvah tutor but designed for 4 session types: 1-on-1 Tutoring, Group Class, Business Meeting, Coaching.

## How to Run
```
cd backend
py -m uvicorn main:app --port 8000
```
Open http://localhost:8000 — the backend serves the built React frontend from `frontend/dist/`. There is **no separate frontend server** needed.

To rebuild after frontend changes:
```
cd frontend
npm install
npm run build
```
Then commit `frontend/dist/` to git so the user can `git pull` without needing Node.js.

## Tech Stack
- **Backend**: FastAPI + Python, single server on port 8000
- **Frontend**: React + Vite + Tailwind CSS, built into `frontend/dist/`
- **AI**: Anthropic Claude (`claude-sonnet-4-6`) via `anthropic` Python SDK
- **Storage**: JSON files (no database) — `backend/groups.json`, `backend/sessions/{group}/*.json`, `backend/uploads/{group}/`
- **Animations**: Framer Motion, custom Skiper UI components (copy-paste, MIT)
- **Design**: Glassmorphism, mesh gradients, noise textures, dark theme

## File Structure
```
/
├── backend/
│   ├── main.py                    # FastAPI app, serves /api/* and frontend/dist
│   ├── requirements.txt
│   ├── .env                       # ANTHROPIC_API_KEY=sk-ant-... (never commit)
│   └── services/
│       ├── claude_client.py       # Plan + report generation, SESSION_TYPE_CONTEXTS
│       ├── session_store.py       # JSON file storage
│       └── file_parser.py         # .docx, .txt, .md, .pdf parsing
├── frontend/
│   ├── dist/                      # Pre-built, committed to git
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Landing.jsx        # Public landing page (full premium redesign)
│   │   │   └── Dashboard.jsx      # Main app (sidebar, tabs, plan/report/history)
│   │   ├── components/ui/index.jsx # Alert, Badge, Modal, Input, Select, Textarea, Tabs, Spinner
│   │   ├── skiper/                # Copy-paste Skiper UI components
│   │   │   ├── Marquee.jsx
│   │   │   ├── CardStack.jsx
│   │   │   ├── ApplePlayButton.jsx
│   │   │   └── VercelScrollBlur.jsx
│   │   ├── reactbits/             # Animation components (Aurora, BlurText, TiltCard, etc.)
│   │   ├── lib/
│   │   │   ├── api.js             # All API calls to backend
│   │   │   └── utils.js           # cn() helper (clsx + tailwind-merge)
│   │   └── hooks/useApi.js        # useAsync hook
│   ├── tailwind.config.js         # Colors: bg, surface, sidebar, border, primary, violet, accent, coral, gold
│   ├── vite.config.js             # base: '/' (important — must stay as '/' not './')
│   └── index.css                  # .glass, .glass-card, .glass-strong, .gradient-border, .noise, .grid-bg, .glow-*, .text-gradient, .prose-dark, .tab-pill
└── CLAUDE.md                      # This file
```

## Key API Endpoints
| Method | Path | Purpose |
|--------|------|---------|
| GET | /api/groups | List all groups |
| POST | /api/groups | Create group (name, session_type, extra_context, next_session_date) |
| DELETE | /api/groups/{name} | Delete group |
| POST | /api/groups/{name}/sessions | Submit transcript (text or file) |
| POST | /api/groups/{name}/sessions/{id}/plan | Generate session plan |
| POST | /api/groups/{name}/sessions/{id}/report | Generate improvement report |
| GET | /api/groups/{name}/sessions | List sessions |
| GET | /api/groups/{name}/materials | List uploaded files |
| POST | /api/groups/{name}/materials | Upload file |
| DELETE | /api/groups/{name}/materials/{filename} | Delete file |

## Session Types
```python
SESSION_TYPES = ['tutoring', 'group', 'meeting', 'coaching']
```
Each has a tailored Claude prompt in `backend/services/claude_client.py` → `SESSION_TYPE_CONTEXTS`.

## Design System (Tailwind)
- Colors: `bg` (#0A0A0F), `surface` (#13131A), `sidebar` (#0D0D14), `border` (#1E1E2E), `primary` (#4F46E5), `violet` (#7C3AED), `accent` (#06B6D4), `coral` (#FF6B6B), `gold` (#FFD93D), `muted` (#6B7280)
- CSS utilities: `.glass`, `.glass-card`, `.glass-strong`, `.gradient-border`, `.grid-bg`, `.glow-primary`, `.text-gradient`, `.tab-pill`, `.prose-dark`

## User Profile
- Windows user, non-technical (uses `py` not `python`)
- Uses Cursor as their IDE
- Accesses the app at http://localhost:8000 only
- Has had issues with: npm execution policy, SSL cert errors, git pull not refreshing dist
- API key stored in `backend/.env` (key was previously exposed — user should rotate it)

## Git Branch
Active development branch: `claude/eloquent-hawking-twcjk3`
PR: https://github.com/Ro55a/gh-repo-clone-garrytan-gstack/pull/1

## Important Notes
- **Never change `base` in `vite.config.js`** from `'/'` to `'./'` — causes blank white screen on sub-routes
- **Always commit `frontend/dist/`** after building — user doesn't run npm locally
- **Never touch** `backend/sessions/`, `backend/uploads/`, `backend/groups.json` — user's live data
- **Never commit `.env`** — it's in .gitignore
- Supported file uploads: `.docx`, `.txt`, `.md`, `.pdf` (uses pymupdf for PDF, not pypdf)
