import json
from datetime import datetime
from pathlib import Path

SESSIONS_DIR = Path("sessions")
GROUPS_FILE = Path("groups.json")
UPLOADS_DIR = Path("uploads")


def list_groups() -> list[dict]:
    if not GROUPS_FILE.exists():
        return []
    return json.loads(GROUPS_FILE.read_text())


def add_group(name: str, session_type: str = "tutoring", extra_context: str = "") -> dict:
    groups = list_groups()
    existing = next((g for g in groups if g["name"] == name), None)
    if existing:
        existing["session_type"] = session_type or existing.get("session_type", "tutoring")
        existing["extra_context"] = extra_context or existing.get("extra_context", "")
        GROUPS_FILE.write_text(json.dumps(groups, indent=2))
        return existing

    group = {"name": name, "session_type": session_type, "extra_context": extra_context}
    groups.append(group)
    GROUPS_FILE.write_text(json.dumps(groups, indent=2))

    (SESSIONS_DIR / name).mkdir(parents=True, exist_ok=True)
    (UPLOADS_DIR / name).mkdir(parents=True, exist_ok=True)
    return group


def list_sessions(group: str) -> list[dict]:
    group_dir = SESSIONS_DIR / group
    if not group_dir.exists():
        return []
    sessions = []
    for f in sorted(group_dir.glob("*.json"), reverse=True):
        data = json.loads(f.read_text())
        sessions.append({"id": f.stem, **data})
    return sessions


def get_latest_session(group: str) -> dict | None:
    sessions = list_sessions(group)
    return sessions[0] if sessions else None


def save_session(group: str, data: dict) -> str:
    session_id = datetime.utcnow().strftime("%Y%m%dT%H%M%S")
    path = SESSIONS_DIR / group / f"{session_id}.json"
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps({"timestamp": session_id, **data}, indent=2))
    return session_id


def update_session(group: str, session_id: str, data: dict):
    path = SESSIONS_DIR / group / f"{session_id}.json"
    existing = json.loads(path.read_text()) if path.exists() else {}
    existing.update(data)
    path.write_text(json.dumps(existing, indent=2))


def list_materials(group: str) -> list[str]:
    upload_dir = UPLOADS_DIR / group
    if not upload_dir.exists():
        return []
    return [f.name for f in upload_dir.iterdir() if f.is_file()]


def get_materials_text(group: str) -> str:
    upload_dir = UPLOADS_DIR / group
    if not upload_dir.exists():
        return ""
    from services.file_parser import extract_text
    parts = []
    for f in sorted(upload_dir.iterdir()):
        if f.is_file():
            try:
                parts.append(f"--- {f.name} ---\n{extract_text(str(f))}")
            except Exception:
                pass
    return "\n\n".join(parts)
