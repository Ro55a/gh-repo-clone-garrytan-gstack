from pathlib import Path


def extract_text(file_path: str) -> str:
    path = Path(file_path)
    suffix = path.suffix.lower()

    if suffix == ".docx":
        from docx import Document
        doc = Document(file_path)
        return "\n".join(p.text for p in doc.paragraphs if p.text.strip())

    if suffix in (".txt", ".md"):
        return path.read_text(encoding="utf-8")

    if suffix == ".pdf":
        import fitz  # pymupdf
        doc = fitz.open(file_path)
        return "\n".join(page.get_text() for page in doc)

    raise ValueError(f"Unsupported file type: {suffix}")
