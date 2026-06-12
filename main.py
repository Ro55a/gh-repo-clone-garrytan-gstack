import shutil
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

load_dotenv()

app = FastAPI(title="Bar/Bat Mitzvah Lesson Planner")

UPLOADS_DIR = Path("uploads")
SESSIONS_DIR = Path("sessions")
UPLOADS_DIR.mkdir(exist_ok=True)
SESSIONS_DIR.mkdir(exist_ok=True)

app.mount("/static", StaticFiles(directory="frontend"), name="static")


@app.get("/")
def index():
    return FileResponse("frontend/index.html")


# --- Students ---

@app.get("/students")
def get_students():
    from services.session_store import list_students
    return list_students()


@app.post("/students")
def create_student(name: str = Form(...), bnai_mitzvah_date: str = Form("")):
    from services.session_store import add_student
    if not name.strip():
        raise HTTPException(400, "Student name is required")
    return add_student(name.strip(), bnai_mitzvah_date.strip())


# --- Materials ---

@app.get("/materials/{student}")
def get_materials(student: str):
    from services.session_store import list_materials
    return {"files": list_materials(student)}


@app.post("/materials/{student}")
async def upload_material(student: str, file: UploadFile = File(...)):
    allowed = {".docx", ".txt", ".md"}
    suffix = Path(file.filename).suffix.lower()
    if suffix not in allowed:
        raise HTTPException(400, f"Unsupported file type. Allowed: {', '.join(allowed)}")

    dest_dir = UPLOADS_DIR / student
    dest_dir.mkdir(parents=True, exist_ok=True)
    dest = dest_dir / file.filename

    with dest.open("wb") as f:
        shutil.copyfileobj(file.file, f)

    return {"filename": file.filename}


@app.delete("/materials/{student}/{filename}")
def delete_material(student: str, filename: str):
    path = UPLOADS_DIR / student / filename
    if not path.exists():
        raise HTTPException(404, "File not found")
    path.unlink()
    return {"deleted": filename}


# --- Transcripts ---

@app.post("/transcript/{student}")
async def submit_transcript(
    student: str,
    text: str = Form(None),
    file: UploadFile = File(None),
):
    from services.file_parser import extract_text
    from services.session_store import save_session

    if file:
        suffix = Path(file.filename).suffix.lower()
        tmp = Path(f"/tmp/{file.filename}")
        with tmp.open("wb") as f:
            shutil.copyfileobj(file.file, f)
        transcript = extract_text(str(tmp))
        tmp.unlink(missing_ok=True)
    elif text:
        transcript = text.strip()
    else:
        raise HTTPException(400, "Provide either a file or text")

    session_id = save_session(student, {"transcript": transcript})
    return {"session_id": session_id}


# --- Lesson Plan ---

@app.post("/plan/{student}")
def generate_plan(student: str, session_id: str = Form(None)):
    from services.claude_client import generate_lesson_plan
    from services.session_store import (
        get_latest_session,
        list_students,
        get_materials_text,
        update_session,
        save_session,
    )

    students = list_students()
    student_info = next((s for s in students if s["name"] == student), {})
    bnai_mitzvah_date = student_info.get("bnai_mitzvah_date", "")

    materials = get_materials_text(student)

    if session_id:
        from services.session_store import list_sessions
        sessions = list_sessions(student)
        session = next((s for s in sessions if s["id"] == session_id), None)
        transcript = (session or {}).get("transcript", "")
    else:
        latest = get_latest_session(student)
        transcript = (latest or {}).get("transcript", "")
        session_id = (latest or {}).get("id")

    plan = generate_lesson_plan(materials, transcript, student, bnai_mitzvah_date)

    if session_id:
        update_session(student, session_id, {"plan": plan})
    else:
        session_id = save_session(student, {"plan": plan})

    return {"session_id": session_id, "plan": plan}


# --- Improvement Report ---

@app.post("/report/{student}/{session_id}")
def generate_report(student: str, session_id: str, transcript_text: str = Form(None), file: UploadFile = File(None)):
    from services.claude_client import generate_improvement_report
    from services.session_store import list_sessions, update_session, save_session
    import shutil

    sessions = list_sessions(student)
    session = next((s for s in sessions if s["id"] == session_id), None)

    if file:
        from services.file_parser import extract_text
        suffix = Path(file.filename).suffix.lower()
        tmp = Path(f"/tmp/{file.filename}")
        with tmp.open("wb") as f:
            shutil.copyfileobj(file.file, f)
        transcript = extract_text(str(tmp))
        tmp.unlink(missing_ok=True)
    elif transcript_text:
        transcript = transcript_text.strip()
    elif session and session.get("transcript"):
        transcript = session["transcript"]
    else:
        raise HTTPException(400, "No lesson transcript available. Provide a transcript for this lesson.")

    plan = (session or {}).get("plan", "")
    if not plan:
        raise HTTPException(400, "No lesson plan found for this session. Generate a plan first.")

    report = generate_improvement_report(plan, transcript, student)

    update_session(student, session_id, {"report": report, "lesson_transcript": transcript})
    return {"report": report}


# --- Sessions ---

@app.get("/sessions/{student}")
def get_sessions(student: str):
    from services.session_store import list_sessions
    return list_sessions(student)
