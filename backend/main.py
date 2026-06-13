import json
import shutil
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.responses import FileResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles

load_dotenv()

app = FastAPI(title="SessionIQ API")

UPLOADS_DIR = Path("uploads")
SESSIONS_DIR = Path("sessions")
UPLOADS_DIR.mkdir(exist_ok=True)
SESSIONS_DIR.mkdir(exist_ok=True)

# Serve built frontend
FRONTEND_DIST = Path("../frontend/dist")
if FRONTEND_DIST.exists():
    app.mount("/assets", StaticFiles(directory=str(FRONTEND_DIST / "assets")), name="assets")


# --- Groups ---

@app.get("/api/groups")
def get_groups():
    from services.session_store import list_groups
    return list_groups()


@app.post("/api/groups")
def create_group(
    name: str = Form(...),
    session_type: str = Form("tutoring"),
    extra_context: str = Form(""),
    next_session_date: str = Form(""),
):
    from services.session_store import add_group
    if not name.strip():
        raise HTTPException(400, "Name is required")
    return add_group(name.strip(), session_type, extra_context.strip(), next_session_date.strip())


@app.delete("/api/groups/{name}")
def delete_group(name: str):
    from services.session_store import delete_group as _delete_group
    _delete_group(name)
    return {"deleted": name}


# --- Materials ---

@app.get("/api/materials/{group}")
def get_materials(group: str):
    from services.session_store import list_materials
    return {"files": list_materials(group)}


@app.post("/api/materials/{group}")
async def upload_material(group: str, file: UploadFile = File(...)):
    allowed = {".docx", ".txt", ".md", ".pdf"}
    suffix = Path(file.filename).suffix.lower()
    if suffix not in allowed:
        raise HTTPException(400, f"Unsupported file type. Allowed: {', '.join(allowed)}")

    dest_dir = UPLOADS_DIR / group
    dest_dir.mkdir(parents=True, exist_ok=True)
    dest = dest_dir / file.filename

    with dest.open("wb") as f:
        shutil.copyfileobj(file.file, f)

    return {"filename": file.filename}


@app.delete("/api/materials/{group}/{filename}")
def delete_material(group: str, filename: str):
    path = UPLOADS_DIR / group / filename
    if not path.exists():
        raise HTTPException(404, "File not found")
    path.unlink()
    return {"deleted": filename}


# --- Transcripts ---

@app.post("/api/transcript/{group}")
async def submit_transcript(
    group: str,
    text: str = Form(None),
    file: UploadFile = File(None),
):
    from services.file_parser import extract_text
    from services.session_store import save_session

    if file:
        tmp = Path(f"/tmp/{file.filename}")
        with tmp.open("wb") as f:
            shutil.copyfileobj(file.file, f)
        transcript = extract_text(str(tmp))
        tmp.unlink(missing_ok=True)
    elif text:
        transcript = text.strip()
    else:
        raise HTTPException(400, "Provide either a file or text")

    session_id = save_session(group, {"transcript": transcript})
    return {"session_id": session_id}


# --- Session Plan ---

@app.post("/api/plan/{group}")
def generate_plan(
    group: str,
    session_id: str = Form(None),
    session_type: str = Form("tutoring"),
    extra_context: str = Form(""),
    session_date: str = Form(""),
):
    from services.claude_client import generate_session_plan
    from services.session_store import (
        get_latest_session,
        get_materials_text,
        update_session,
        save_session,
        list_sessions,
    )

    materials = get_materials_text(group)

    if session_id:
        sessions = list_sessions(group)
        session = next((s for s in sessions if s["id"] == session_id), None)
        transcript = (session or {}).get("transcript", "")
    else:
        latest = get_latest_session(group)
        transcript = (latest or {}).get("transcript", "")
        session_id = (latest or {}).get("id")

    plan = generate_session_plan(materials, transcript, group, session_type, extra_context)

    update_data = {"plan": plan, "session_type": session_type}
    if session_date:
        update_data["session_date"] = session_date

    if session_id:
        update_session(group, session_id, update_data)
    else:
        session_id = save_session(group, update_data)

    return {"session_id": session_id, "plan": plan}


# --- Improvement Report ---

@app.post("/api/report/{group}/{session_id}")
async def generate_report(
    group: str,
    session_id: str,
    transcript_text: str = Form(None),
    session_type: str = Form("tutoring"),
    file: UploadFile = File(None),
):
    from services.claude_client import generate_improvement_report
    from services.session_store import list_sessions, update_session

    sessions = list_sessions(group)
    session = next((s for s in sessions if s["id"] == session_id), None)

    if file:
        from services.file_parser import extract_text
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
        raise HTTPException(400, "No session transcript available.")

    plan = (session or {}).get("plan", "")
    if not plan:
        raise HTTPException(400, "No session plan found. Generate a plan first.")

    effective_type = session_type or (session or {}).get("session_type", "tutoring")
    report = generate_improvement_report(plan, transcript, group, effective_type)

    update_session(group, session_id, {"report": report, "lesson_transcript": transcript})
    return {"report": report}


# --- Streaming Plan ---

@app.post("/api/plan/{group}/stream")
def stream_plan(
    group: str,
    session_id: str = Form(None),
    session_type: str = Form("tutoring"),
    extra_context: str = Form(""),
    session_date: str = Form(""),
):
    from services.claude_client import stream_session_plan, SESSION_TYPE_CONTEXTS
    from services.session_store import (
        get_latest_session,
        get_materials_text,
        update_session,
        save_session,
        list_sessions,
    )

    materials = get_materials_text(group)

    if session_id:
        sessions = list_sessions(group)
        session = next((s for s in sessions if s["id"] == session_id), None)
        transcript = (session or {}).get("transcript", "")
    else:
        latest = get_latest_session(group)
        transcript = (latest or {}).get("transcript", "")
        session_id = (latest or {}).get("id")

    full_text = []

    def generate():
        for chunk in stream_session_plan(materials, transcript, group, session_type, extra_context):
            full_text.append(chunk)
            yield f"data: {json.dumps(chunk)}\n\n"
        plan = "".join(full_text)
        update_data = {"plan": plan, "session_type": session_type}
        if session_date:
            update_data["session_date"] = session_date
        nonlocal session_id
        if session_id:
            update_session(group, session_id, update_data)
        else:
            session_id = save_session(group, update_data)
        yield f"data: {json.dumps({'__done__': True, 'session_id': session_id})}\n\n"

    return StreamingResponse(generate(), media_type="text/event-stream")


# --- Streaming Report ---

@app.post("/api/report/{group}/{session_id}/stream")
async def stream_report(
    group: str,
    session_id: str,
    transcript_text: str = Form(None),
    session_type: str = Form("tutoring"),
    file: UploadFile = File(None),
):
    from services.claude_client import stream_improvement_report
    from services.session_store import list_sessions, update_session

    sessions = list_sessions(group)
    session = next((s for s in sessions if s["id"] == session_id), None)

    if file:
        from services.file_parser import extract_text
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
        raise HTTPException(400, "No session transcript available.")

    plan = (session or {}).get("plan", "")
    if not plan:
        raise HTTPException(400, "No session plan found. Generate a plan first.")

    effective_type = session_type or (session or {}).get("session_type", "tutoring")
    full_text = []

    def generate():
        for chunk in stream_improvement_report(plan, transcript, group, effective_type):
            full_text.append(chunk)
            yield f"data: {json.dumps(chunk)}\n\n"
        report = "".join(full_text)
        update_session(group, session_id, {"report": report, "lesson_transcript": transcript})
        yield f"data: {json.dumps({'__done__': True})}\n\n"

    return StreamingResponse(generate(), media_type="text/event-stream")


# --- Sessions ---

@app.get("/api/sessions/{group}")
def get_sessions(group: str):
    from services.session_store import list_sessions
    return list_sessions(group)


# --- Serve frontend for all other routes ---

@app.get("/{full_path:path}")
def serve_frontend(full_path: str):
    index = FRONTEND_DIST / "index.html"
    if index.exists():
        return FileResponse(str(index))
    return {"message": "SessionIQ API running. Frontend not built yet."}
