import json
import os
from datetime import datetime
from pathlib import Path

SESSIONS_DIR = Path("sessions")
STUDENTS_FILE = Path("students.json")
UPLOADS_DIR = Path("uploads")


def list_students() -> list[dict]:
    if not STUDENTS_FILE.exists():
        return []
    return json.loads(STUDENTS_FILE.read_text())


def add_student(name: str, bnai_mitzvah_date: str = "") -> dict:
    students = list_students()
    existing = next((s for s in students if s["name"] == name), None)
    if existing:
        if bnai_mitzvah_date:
            existing["bnai_mitzvah_date"] = bnai_mitzvah_date
            STUDENTS_FILE.write_text(json.dumps(students, indent=2))
        return existing

    student = {"name": name, "bnai_mitzvah_date": bnai_mitzvah_date}
    students.append(student)
    STUDENTS_FILE.write_text(json.dumps(students, indent=2))

    (SESSIONS_DIR / name).mkdir(parents=True, exist_ok=True)
    (UPLOADS_DIR / name).mkdir(parents=True, exist_ok=True)
    return student


def list_sessions(student: str) -> list[dict]:
    student_dir = SESSIONS_DIR / student
    if not student_dir.exists():
        return []
    sessions = []
    for f in sorted(student_dir.glob("*.json"), reverse=True):
        data = json.loads(f.read_text())
        sessions.append({"id": f.stem, **data})
    return sessions


def get_latest_session(student: str) -> dict | None:
    sessions = list_sessions(student)
    return sessions[0] if sessions else None


def save_session(student: str, data: dict) -> str:
    session_id = datetime.utcnow().strftime("%Y%m%dT%H%M%S")
    path = SESSIONS_DIR / student / f"{session_id}.json"
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps({"timestamp": session_id, **data}, indent=2))
    return session_id


def update_session(student: str, session_id: str, data: dict):
    path = SESSIONS_DIR / student / f"{session_id}.json"
    existing = json.loads(path.read_text()) if path.exists() else {}
    existing.update(data)
    path.write_text(json.dumps(existing, indent=2))


def list_materials(student: str) -> list[str]:
    upload_dir = UPLOADS_DIR / student
    if not upload_dir.exists():
        return []
    return [f.name for f in upload_dir.iterdir() if f.is_file()]


def get_materials_text(student: str) -> str:
    upload_dir = UPLOADS_DIR / student
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
