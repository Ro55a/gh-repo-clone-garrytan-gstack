import anthropic

_client = None

SESSION_TYPE_CONTEXTS = {
    "tutoring": {
        "label": "1-on-1 tutoring session",
        "plan_focus": "learning objectives, knowledge gaps to address, exercises to try, pacing for the individual student",
        "report_focus": "how clearly you explained concepts, how the student responded, what scaffolding worked, what to try differently",
    },
    "group": {
        "label": "group class",
        "plan_focus": "group pacing, activities for different levels, engagement strategies, which concepts to cover",
        "report_focus": "group dynamics, participation balance, whether activities landed, how to adjust for different learners",
    },
    "meeting": {
        "label": "business meeting",
        "plan_focus": "agenda items, decisions to reach, action items to track, time allocation per topic",
        "report_focus": "whether goals were met, action items captured, decisions made, what to improve in how you run the meeting",
    },
    "coaching": {
        "label": "coaching session",
        "plan_focus": "client goals, progress since last session, exercises or reflections to explore, breakthroughs to build on",
        "report_focus": "quality of your questions, how the client responded, whether you stayed client-led, what to do differently",
    },
}


def _get_client() -> anthropic.Anthropic:
    global _client
    if _client is None:
        _client = anthropic.Anthropic()
    return _client


def generate_session_plan(
    materials_text: str,
    last_transcript: str,
    group_name: str,
    session_type: str = "tutoring",
    extra_context: str = "",
) -> str:
    ctx = SESSION_TYPE_CONTEXTS.get(session_type, SESSION_TYPE_CONTEXTS["tutoring"])

    user_content = f"""GROUP/PARTICIPANT: {group_name}
SESSION TYPE: {ctx['label']}
{f'ADDITIONAL CONTEXT: {extra_context}' if extra_context else ''}

REFERENCE MATERIALS:
{materials_text or '(No materials uploaded yet)'}

TRANSCRIPT OF LAST SESSION:
{last_transcript or '(No previous session transcript — this may be the first session)'}

Please generate a plan for the next session."""

    message = _get_client().messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2048,
        system=f"""You are an expert planning assistant helping someone prepare for their next {ctx['label']}.

Based on the reference materials and the transcript of the last session, generate a practical, concrete session plan.

Focus on: {ctx['plan_focus']}.

Structure your plan with these sections:
## Session Goals
## Review / Follow-up from Last Session
## Main Content / Agenda
## Activities & Timing
## Key Points to Watch For
## Notes

Be specific and actionable. Reference actual content from the materials and transcript where relevant.""",
        messages=[{"role": "user", "content": user_content}],
    )
    return message.content[0].text


def generate_improvement_report(
    session_plan: str,
    session_transcript: str,
    group_name: str,
    session_type: str = "tutoring",
) -> str:
    ctx = SESSION_TYPE_CONTEXTS.get(session_type, SESSION_TYPE_CONTEXTS["tutoring"])

    user_content = f"""GROUP/PARTICIPANT: {group_name}
SESSION TYPE: {ctx['label']}

SESSION PLAN THAT WAS FOLLOWED:
{session_plan}

TRANSCRIPT OF THE SESSION:
{session_transcript}

Please give me honest feedback on how this session went, covering both how I can improve as a tutor and how the student can improve in their learning."""

    message = _get_client().messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2048,
        system=f"""You are giving honest, constructive feedback on a {ctx['label']}.

Analyze the session transcript against the plan and write a report with two clear parts:

PART 1 — TUTOR IMPROVEMENT (addressed directly to the tutor using "you"):
Focus on: {ctx['report_focus']}.

Structure Part 1 with:
## What You Did Well
## What You Can Do Differently
## Specific Suggestions for Your Next Session

PART 2 — STUDENT PROGRESS & DEVELOPMENT:
Focus on: what the student understood well, where they struggled, specific areas and skills they need to practice, and recommended next steps for their learning.

Structure Part 2 with:
## Student Strengths Observed
## Areas the Student Needs to Work On
## Recommended Practice for the Student
## Overall Student Progress

Be warm but honest. Give specific, actionable feedback tied to what actually happened in the transcript.""",
        messages=[{"role": "user", "content": user_content}],
    )
    return message.content[0].text


def stream_session_plan(materials_text, last_transcript, group_name, session_type="tutoring", extra_context=""):
    ctx = SESSION_TYPE_CONTEXTS.get(session_type, SESSION_TYPE_CONTEXTS["tutoring"])
    user_content = f"""GROUP/PARTICIPANT: {group_name}
SESSION TYPE: {ctx['label']}
{f'ADDITIONAL CONTEXT: {extra_context}' if extra_context else ''}

REFERENCE MATERIALS:
{materials_text or '(No materials uploaded yet)'}

TRANSCRIPT OF LAST SESSION:
{last_transcript or '(No previous session transcript — this may be the first session)'}

Please generate a plan for the next session."""

    with _get_client().messages.stream(
        model="claude-sonnet-4-6",
        max_tokens=2048,
        system=f"""You are an expert planning assistant helping someone prepare for their next {ctx['label']}.

Based on the reference materials and the transcript of the last session, generate a practical, concrete session plan.

Focus on: {ctx['plan_focus']}.

Structure your plan with these sections:
## Session Goals
## Review / Follow-up from Last Session
## Main Content / Agenda
## Activities & Timing
## Key Points to Watch For
## Notes

Be specific and actionable. Reference actual content from the materials and transcript where relevant.""",
        messages=[{"role": "user", "content": user_content}],
    ) as stream:
        for text in stream.text_stream:
            yield text


def stream_improvement_report(session_plan, session_transcript, group_name, session_type="tutoring"):
    ctx = SESSION_TYPE_CONTEXTS.get(session_type, SESSION_TYPE_CONTEXTS["tutoring"])
    user_content = f"""GROUP/PARTICIPANT: {group_name}
SESSION TYPE: {ctx['label']}

SESSION PLAN THAT WAS FOLLOWED:
{session_plan}

TRANSCRIPT OF THE SESSION:
{session_transcript}

Please give me honest feedback on how this session went, covering both how I can improve as a tutor and how the student can improve in their learning."""

    with _get_client().messages.stream(
        model="claude-sonnet-4-6",
        max_tokens=2048,
        system=f"""You are giving honest, constructive feedback on a {ctx['label']}.

Analyze the session transcript against the plan and write a report with two clear parts:

PART 1 — TUTOR IMPROVEMENT (addressed directly to the tutor using "you"):
Focus on: {ctx['report_focus']}.

Structure Part 1 with:
## What You Did Well
## What You Can Do Differently
## Specific Suggestions for Your Next Session

PART 2 — STUDENT PROGRESS & DEVELOPMENT:
Focus on: what the student understood well, where they struggled, specific areas and skills they need to practice, and recommended next steps for their learning.

Structure Part 2 with:
## Student Strengths Observed
## Areas the Student Needs to Work On
## Recommended Practice for the Student
## Overall Student Progress

Be warm but honest. Give specific, actionable feedback tied to what actually happened in the transcript.""",
        messages=[{"role": "user", "content": user_content}],
    ) as stream:
        for text in stream.text_stream:
            yield text
