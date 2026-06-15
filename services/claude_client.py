import anthropic

_client = None


def _get_client() -> anthropic.Anthropic:
    global _client
    if _client is None:
        _client = anthropic.Anthropic()
    return _client


def generate_lesson_plan(
    materials_text: str,
    last_transcript: str,
    student_name: str,
    bnai_mitzvah_date: str = "",
) -> str:
    date_info = f" Their Bar/Bat Mitzvah date is {bnai_mitzvah_date}." if bnai_mitzvah_date else ""
    student_context = f"Student: {student_name}.{date_info}"

    user_content = f"""STUDENT INFO:
{student_context}

PORTION MATERIALS:
{materials_text or "(No materials uploaded yet)"}

TRANSCRIPT OF LAST LESSON:
{last_transcript or "(No previous lesson transcript)"}

Please generate a lesson plan for the next session."""

    message = _get_client().messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2048,
        system="""You are helping an amateur Hebrew teacher plan their next lesson with a Bar/Bat Mitzvah student.
The student needs to learn to read and chant their Torah or Haftarah portion with correct Hebrew pronunciation and trope (cantillation melodies).

Based on the student's portion materials and the transcript of the last lesson, generate a practical, concrete lesson plan for the next session.

Structure the plan with these sections:
## Lesson Goals
## Review from Last Session (based on transcript)
## New Material to Cover (specific lines or sections)
## Trope Patterns to Practice
## Pronunciation Focus Points
## Suggested Activities & Pacing
## Notes for the Teacher

Be specific — reference actual lines, words, or trope names where possible. Keep it practical for an amateur teacher.""",
        messages=[{"role": "user", "content": user_content}],
    )
    return message.content[0].text


def generate_improvement_report(
    lesson_plan: str,
    lesson_transcript: str,
    student_name: str,
) -> str:
    user_content = f"""Student: {student_name}

LESSON PLAN THAT WAS FOLLOWED:
{lesson_plan}

TRANSCRIPT OF THE LESSON:
{lesson_transcript}

Please give me feedback on how the lesson went and how I can improve my teaching."""

    message = _get_client().messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2048,
        system="""You are giving honest, constructive feedback to an amateur Hebrew teacher who teaches kids to read and chant their Bar/Bat Mitzvah Torah and Haftarah portions.

Analyze the lesson transcript against the lesson plan and write a personal improvement report directly addressed to the teacher (use "you").

Structure the report with:
## What Went Well
## What to Try Differently
## Student Signals You Can Watch For
## Specific Suggestions for Next Session
## Overall Reflection

Be warm but honest. Focus on teaching technique — how clearly you explained things, how you paced the lesson, how you encouraged the student, and what you can do differently. Give specific, actionable advice tied to what actually happened in the transcript.""",
        messages=[{"role": "user", "content": user_content}],
    )
    return message.content[0].text
