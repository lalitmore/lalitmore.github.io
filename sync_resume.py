#!/usr/bin/env python3
"""
sync_resume.py  —  FREE, LOCAL resume → content.js sync
=========================================================
Reads your resume (PDF / DOCX / TXT), extracts structured
data using regex + heuristic parsing, and rewrites content.js
to reflect what changed.

No API key. No internet connection. No cost. Ever.

USAGE
-----
    python sync_resume.py resume.pdf
    python sync_resume.py resume.pdf --dry-run   # preview, write nothing
    python sync_resume.py resume.pdf --report    # show what was extracted

INSTALL (one-time, free packages)
---------------------------------
    pip install -r requirements.txt
"""

import argparse
import json
import re
import sys
from datetime import datetime
from difflib import SequenceMatcher
from pathlib import Path


# ─────────────────────────────────────────────────────────────
# TEXT EXTRACTION
# ─────────────────────────────────────────────────────────────

def extract_text(path: Path) -> str:
    """Pull plain text from PDF, DOCX, or TXT."""
    suffix = path.suffix.lower()

    if suffix == ".pdf":
        try:
            import pdfplumber
        except ImportError:
            sys.exit("Run:  pip install pdfplumber")
        pages = []
        with pdfplumber.open(path) as pdf:
            for page in pdf.pages:
                pages.append(page.extract_text() or "")
        return "\n".join(pages).strip()

    if suffix == ".docx":
        try:
            import docx
        except ImportError:
            sys.exit("Run:  pip install python-docx")
        doc = docx.Document(str(path))
        return "\n".join(p.text for p in doc.paragraphs).strip()

    if suffix in (".txt", ".md"):
        return path.read_text(encoding="utf-8", errors="ignore").strip()

    sys.exit(f"Unsupported format '{suffix}'. Use .pdf, .docx, or .txt")


# ─────────────────────────────────────────────────────────────
# SECTION SPLITTER
# ─────────────────────────────────────────────────────────────

# Keywords that reliably identify section headers
_SECTION_PATTERNS = {
    "summary":    re.compile(r"^(summary|objective|profile|about me)$", re.I),
    "education":  re.compile(r"^(education|academic background)$", re.I),
    "experience": re.compile(r"^(experience|work experience|employment|internship[s]?)$", re.I),
    "projects":   re.compile(r"^(projects?|personal projects?|selected projects?|academic projects?)$", re.I),
    "skills":     re.compile(r"^(skills?|technical skills?|technologies|tools?|core competencies)$", re.I),
}


def _is_section_header(line: str) -> str | None:
    """Return the section key if this line looks like a header, else None."""
    clean = line.strip().rstrip(":").rstrip("-").rstrip("=").strip()
    if not clean or len(clean) > 60:
        return None
    for key, pat in _SECTION_PATTERNS.items():
        if pat.match(clean):
            return key
    return None


def split_sections(text: str) -> dict[str, str]:
    """
    Splits the resume text into named sections.
    Everything before the first recognised header goes into 'header'
    (which usually contains name + contact info).
    """
    sections: dict[str, list[str]] = {"header": []}
    current = "header"

    for line in text.splitlines():
        key = _is_section_header(line)
        if key:
            current = key
            sections.setdefault(current, [])
        else:
            sections.setdefault(current, []).append(line)

    return {k: "\n".join(v).strip() for k, v in sections.items()}


# ─────────────────────────────────────────────────────────────
# FIELD EXTRACTORS
# ─────────────────────────────────────────────────────────────

def extract_name(header: str) -> str | None:
    """First non-empty, non-email, non-URL line is usually the name."""
    for line in header.splitlines():
        line = line.strip()
        if not line:
            continue
        if re.search(r"[@|/\\(]|https?://|\d{3}", line):
            continue
        if len(line.split()) <= 5:
            return line
    return None


def extract_email(text: str) -> str | None:
    m = re.search(r"[\w.\-+]+@[\w.\-]+\.\w{2,}", text)
    return m.group(0) if m else None


def extract_location(header: str) -> str | None:
    """Look for 'City, ST' or 'City, State' patterns."""
    m = re.search(
        r"\b([A-Z][a-zA-Z\s\-]+),\s*([A-Z]{2}|[A-Z][a-z]+)\b",
        header,
    )
    return m.group(0) if m else None


def extract_gpa(text: str) -> str | None:
    m = re.search(r"\bGPA[:\s]+(\d\.\d+)\s*/\s*(\d\.\d+)", text, re.I)
    if m:
        return f"{m.group(1)} / {m.group(2)}"
    m = re.search(r"\bGPA[:\s]+(\d\.\d+)", text, re.I)
    return f"{m.group(1)} / 4.0" if m else None


def extract_graduation(text: str) -> str | None:
    # e.g. "May 2026" or "Expected December 2025"
    months = (
        "January|February|March|April|May|June|"
        "July|August|September|October|November|December"
    )
    m = re.search(
        rf"(?:Expected|Graduating|Graduation)?[:\s]*({months})\s+(20\d{{2}})",
        text, re.I,
    )
    return f"{m.group(1)} {m.group(2)}" if m else None


def extract_degree(text: str) -> str | None:
    m = re.search(
        r"(B\.?S\.?|B\.?A\.?|M\.?S\.?|Master[s']?|Bachelor[s']?)"
        r"[^\n]{0,80}(Computer Science|Data Science|Software|Information|Engineering)",
        text, re.I,
    )
    return re.sub(r"\s+", " ", m.group(0)).strip() if m else None


def extract_university(edu_block: str) -> str | None:
    """First non-empty, non-degree line in the education block."""
    for line in edu_block.splitlines():
        line = line.strip()
        if not line:
            continue
        if re.search(
            r"(B\.S|B\.A|M\.S|GPA|Expected|Bachelor|Master|\d{4})", line, re.I
        ):
            continue
        if len(line) > 5:
            return line
    return None


# ─────────────────────────────────────────────────────────────
# PROJECT PARSER
# ─────────────────────────────────────────────────────────────

# Roof colours to cycle through
_COLORS = ["blue", "red", "orange", "green", "purple", "gold"]


def _extract_metrics(text: str) -> list[dict]:
    """
    Pull out number+unit pairs as metrics.
    Each entry is (pattern, fixed_label_or_None).
    When fixed_label is None, group(2) of the match is used as the label.
    """
    patterns = [
        (re.compile(r"(\d[\d,\.]+[kKmMbB]?)\s*(ops?/s(?:ec)?|rps|qps)", re.I), None),
        (re.compile(r"(\d[\d,\.]+)\s*(ms)\b", re.I),                            "ms latency"),
        (re.compile(r"(\d[\d,\.]+)\s*%",       re.I),                            "% accuracy"),
        (re.compile(r"([\d\.]+)\s*(ROC-AUC|AUC|F1|IoU|BLEU)", re.I),            None),
        (re.compile(r"(\d[\d,\.]+[kKmMbB]?)\s*(users?|rows?|images?)",  re.I),  None),
        (re.compile(r"(\d[\d,\.]+[kKmMbB]?)\s*(ops?)\b", re.I),                 None),
    ]
    results: list[dict] = []
    seen: set[str] = set()
    for pat, fixed_lab in patterns:
        for m in pat.finditer(text):
            val = m.group(1).replace(",", "")
            lab = fixed_lab if fixed_lab else m.group(2)
            key = f"{val}-{lab}".lower()
            if key not in seen and len(results) < 3:
                results.append({"val": val, "lab": lab})
                seen.add(key)
    return results


def _extract_tech_tags(line: str) -> list[str]:
    """
    Pull technology names from a line such as:
      'DistKV | Go, gRPC, Docker'
      'Tech: Python, FastAPI, PostgreSQL'
      'Built with React, TypeScript, and AWS'
    """
    # Strip the project title part (before first | or :)
    for sep in ["|", "–", "—", "·"]:
        if sep in line:
            line = line.split(sep, 1)[1]
            break
    if re.match(r"tech(?:nologies)?[:\s]", line, re.I):
        line = re.sub(r"tech(?:nologies)?[:\s]", "", line, flags=re.I)
    # Strip "and", "with", "using"
    line = re.sub(r"\b(and|with|using|via)\b", ",", line, flags=re.I)
    # Split on common delimiters
    raw = re.split(r"[,/;]+", line)
    tags = []
    for t in raw:
        t = t.strip().strip(".()")
        # Keep if it looks like a technology name (1-25 chars, not a sentence)
        if 1 < len(t) <= 25 and " " not in t or re.match(r"[A-Z]", t):
            if len(t.split()) <= 3:
                tags.append(t)
    return tags[:6]


def _split_project_blocks(text: str) -> list[str]:
    """
    Split a projects section into individual project blocks.
    Heuristic: a new project starts on a line that doesn't begin
    with a bullet/dash and isn't purely descriptive prose.
    """
    lines = text.splitlines()
    blocks: list[list[str]] = []
    current: list[str] = []

    for line in lines:
        stripped = line.strip()
        if not stripped:
            continue
        # Detect project title line: not a bullet, not starting with lowercase,
        # short enough to be a title (< 100 chars)
        is_title = (
            stripped
            and not stripped[0] in ("•", "-", "*", "·", "–", "○")
            and stripped[0].isupper()
            and len(stripped) < 100
            and not re.match(r"^(the|a |an |this |we |i )", stripped, re.I)
        )
        if is_title and current:
            # Check it doesn't just look like a continuation sentence
            if re.search(r"[|│]|Tech:|built with|technologies", stripped, re.I) or (
                current
                and len(current) >= 2
            ):
                blocks.append(current)
                current = [stripped]
                continue
        current.append(stripped)

    if current:
        blocks.append(current)

    return ["\n".join(b) for b in blocks if b]


def parse_projects(proj_block: str) -> list[dict]:
    """Parse the PROJECTS section into a list of project dicts."""
    blocks = _split_project_blocks(proj_block)
    projects = []

    for i, block in enumerate(blocks):
        lines = block.splitlines()
        if not lines:
            continue

        title_line = lines[0].strip()

        # Extract title: everything before | or – or (
        title = re.split(r"[|│–—(]", title_line)[0].strip()
        if not title or len(title) > 60:
            continue

        # Extract tags from the title line
        tags = _extract_tech_tags(title_line)

        # If no tags from title line, look for a "Tech:" line
        if not tags:
            for line in lines[1:]:
                if re.match(r"tech(?:nologies)?[:\s]", line, re.I):
                    tags = _extract_tech_tags(line)
                    break

        # Description: bullet points joined
        desc_parts = []
        for line in lines[1:]:
            stripped = line.lstrip("•-*·○–").strip()
            if stripped and not re.match(r"tech(?:nologies)?[:\s]", stripped, re.I):
                desc_parts.append(stripped)

        desc = " ".join(desc_parts[:3])  # keep it concise
        if len(desc) > 250:
            desc = desc[:247].rsplit(" ", 1)[0] + "..."

        metrics = _extract_metrics(block)

        projects.append({
            "title": title,
            "desc": desc or title,
            "tags": tags,
            "metrics": metrics,
            "raw_block": block,
        })

    return projects


# ─────────────────────────────────────────────────────────────
# SKILLS PARSER
# ─────────────────────────────────────────────────────────────

def parse_skills(skills_block: str) -> dict[str, list[str]]:
    """
    Parse skills section into {category: [items]}.
    Handles both categorised ('Languages: Python, Go') and
    flat list formats.
    """
    categories: dict[str, list[str]] = {}
    current_cat = "General"

    for line in skills_block.splitlines():
        line = line.strip().lstrip("•-*")
        if not line:
            continue
        # "Category: item1, item2, item3"
        if ":" in line and line.index(":") < 30:
            cat, _, rest = line.partition(":")
            cat = cat.strip().title()
            items = [i.strip() for i in re.split(r"[,|/]", rest) if i.strip()]
            if items:
                categories[cat] = items
                current_cat = cat
                continue
        # Plain comma-separated on a line
        items = [i.strip() for i in re.split(r"[,|/]", line) if i.strip()]
        if len(items) >= 2:
            existing = categories.get(current_cat, [])
            categories[current_cat] = existing + items

    return categories


# ─────────────────────────────────────────────────────────────
# EXPERIENCE PARSER
# ─────────────────────────────────────────────────────────────

_DATE_RANGE = re.compile(
    r"((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*\d{4})"
    r"\s*[-–—to]+\s*"
    r"((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*\d{4}|Present|Current)",
    re.I,
)


def parse_experience(exp_block: str) -> list[dict]:
    entries = []
    lines = [l.strip() for l in exp_block.splitlines() if l.strip()]
    i = 0
    while i < len(lines):
        line = lines[i]
        date_m = _DATE_RANGE.search(line)
        if date_m:
            company = re.sub(str(_DATE_RANGE.pattern), "", line, flags=re.I).strip()
            title = lines[i + 1].strip() if i + 1 < len(lines) else ""
            entries.append({
                "company": company or title,
                "title": title,
                "dates": f"{date_m.group(1)} – {date_m.group(2)}",
            })
        i += 1
    return entries


# ─────────────────────────────────────────────────────────────
# MERGE INTO content.js
# ─────────────────────────────────────────────────────────────

def _fuzzy_match(a: str, b: str) -> float:
    return SequenceMatcher(None, a.lower(), b.lower()).ratio()


def _map_skill_category(cat: str) -> dict[str, str]:
    """Map a parsed skill category name to content.js color."""
    cat_l = cat.lower()
    if any(x in cat_l for x in ["lang", "program"]):
        return {"label": "Languages", "color": "red"}
    if any(x in cat_l for x in ["ml", "data", "ai", "learn", "deep"]):
        return {"label": "ML / Data", "color": "orange"}
    if any(x in cat_l for x in ["system", "backend", "database", "db"]):
        return {"label": "Systems", "color": "green"}
    if any(x in cat_l for x in ["infra", "cloud", "devops", "tool", "deploy"]):
        return {"label": "Infra", "color": "purple"}
    if any(x in cat_l for x in ["web", "front", "ui", "react", "frame"]):
        return {"label": "Web / Frontend", "color": "blue"}
    return {"label": cat.title(), "color": "gold"}


def merge(content: dict, parsed: dict) -> tuple[dict, list[str]]:
    """
    Merge parsed resume data into the existing content dict.
    Returns (updated_content, list_of_change_descriptions).
    """
    changes: list[str] = []
    c = json.loads(json.dumps(content))  # deep copy

    # ── name / email ──
    if parsed.get("name") and parsed["name"] != c.get("name"):
        changes.append(f"Name: {c.get('name')!r} → {parsed['name']!r}")
        c["name"] = parsed["name"]

    # ── about specs ──
    specs = {s["key"]: i for i, s in enumerate(c.get("about", {}).get("specs", []))}

    def update_spec(key: str, new_val: str):
        if new_val and key in specs:
            old = c["about"]["specs"][specs[key]]["val"]
            if old != new_val:
                changes.append(f"Spec {key}: {old!r} → {new_val!r}")
                c["about"]["specs"][specs[key]]["val"] = new_val

    update_spec("LOCATION", parsed.get("location", ""))
    update_spec("GPA", parsed.get("gpa", ""))
    update_spec("GRADUATION", parsed.get("graduation", ""))

    # ── skills ──
    parsed_skills = parsed.get("skills", {})
    if parsed_skills:
        new_skills = []
        for cat, items in parsed_skills.items():
            if not items:
                continue
            meta = _map_skill_category(cat)
            new_skills.append({**meta, "items": items})
        if new_skills:
            changes.append(f"Skills: {len(new_skills)} categories refreshed")
            c["skills"] = new_skills

    # ── projects ──
    new_projects_raw = parsed.get("projects", [])
    if new_projects_raw:
        existing = {p["title"]: p for p in c.get("projects", [])}
        merged_projects = []

        for i, np in enumerate(new_projects_raw):
            title = np["title"]
            # Find the best-matching existing project to preserve links/color/setNum
            best_match = None
            best_score = 0.0
            for et in existing:
                score = _fuzzy_match(title, et)
                if score > best_score:
                    best_score, best_match = score, et

            color = _COLORS[i % len(_COLORS)]
            set_num = f"SET #{i + 1:03d}"
            links = [{"label": "View Code", "url": "#", "primary": True},
                     {"label": "Live Demo \u2197", "url": "#"}]
            category = "swe"  # default; override below

            if best_match and best_score > 0.6:
                ep = existing[best_match]
                color = ep.get("color", color)
                set_num = ep.get("setNum", set_num)
                links = ep.get("links", links)
                category = ep.get("category", category)
                if best_match != title:
                    changes.append(f"Project renamed: {best_match!r} → {title!r}")
            else:
                changes.append(f"Project added: {title!r}")

            # Infer category from tags
            ds_tags = {"python", "pytorch", "tensorflow", "ml", "data", "pandas",
                       "numpy", "sklearn", "xgboost", "spark", "nlp", "transformers",
                       "jupyter", "matplotlib", "r", "statistics", "sql"}
            tag_set = {t.lower() for t in np.get("tags", [])}
            if tag_set & ds_tags:
                category = "ds"
            elif any(t.lower() in {"go", "rust", "c++", "java", "typescript",
                                    "node", "react", "docker", "kubernetes",
                                    "grpc", "distributed"} for t in np.get("tags", [])):
                category = "swe"

            # Use parsed metrics if available, else fall back to existing
            metrics = np.get("metrics") or (existing.get(best_match or "", {}).get("metrics", []))

            merged_projects.append({
                "setNum": set_num,
                "category": category,
                "badge": "ML / DATA" if category == "ds" else "SWE",
                "color": color,
                "title": title,
                "desc": np["desc"],
                "metrics": metrics,
                "tags": np["tags"] or existing.get(best_match or "", {}).get("tags", []),
                "links": links,
            })

        # Flag removed projects
        new_titles = {p["title"] for p in merged_projects}
        for old_title in existing:
            if not any(_fuzzy_match(old_title, nt) > 0.6 for nt in new_titles):
                changes.append(f"Project removed (not in resume): {old_title!r}")

        # Update project count in stats
        c["projects"] = merged_projects
        for s in c.get("stats", []):
            if s.get("lab", "").lower() == "projects":
                s["val"] = f"{len(merged_projects):02d}"

    return c, changes


# ─────────────────────────────────────────────────────────────
# CONTENT.JS I/O
# ─────────────────────────────────────────────────────────────

def load_content(path: Path) -> dict:
    raw = path.read_text(encoding="utf-8")
    start, end = raw.find("{"), raw.rfind("}")
    if start == -1 or end == -1:
        sys.exit("Could not find the JSON object in content.js")
    return json.loads(raw[start:end + 1])


def write_content(path: Path, data: dict) -> None:
    if path.exists():
        bak = path.with_suffix(".js.bak")
        bak.write_text(path.read_text(encoding="utf-8"), encoding="utf-8")
        print(f"  Backed up old file → {bak.name}")
    header = (
        "/* Auto-updated by sync_resume.py on "
        + datetime.now().strftime("%Y-%m-%d %H:%M")
        + ". Edit freely — re-running the script will reformat this block. */\n"
    )
    path.write_text(
        header + "window.SITE_CONTENT = " + json.dumps(data, indent=2, ensure_ascii=False) + ";\n",
        encoding="utf-8",
    )


# ─────────────────────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Sync content.js from your resume (free, no API)")
    parser.add_argument("resume", type=Path, help="Resume file (.pdf, .docx, or .txt)")
    parser.add_argument("--content", type=Path, default=Path("content.js"))
    parser.add_argument("--dry-run", action="store_true", help="Show changes, write nothing")
    parser.add_argument("--report", action="store_true", help="Print what was extracted and exit")
    args = parser.parse_args()

    if not args.resume.exists():
        sys.exit(f"File not found: {args.resume}")
    if not args.content.exists():
        sys.exit(f"File not found: {args.content}")

    print(f"Extracting text from {args.resume.name}…")
    text = extract_text(args.resume)
    if len(text.strip()) < 40:
        sys.exit("Could not extract meaningful text. Is the PDF a scanned image?")

    print("Parsing sections…")
    sections = split_sections(text)

    parsed = {
        "name":       extract_name(sections.get("header", "")),
        "email":      extract_email(sections.get("header", "") + text),
        "location":   extract_location(sections.get("header", "")),
        "gpa":        extract_gpa(sections.get("education", text)),
        "graduation": extract_graduation(sections.get("education", text)),
        "degree":     extract_degree(sections.get("education", text)),
        "university": extract_university(sections.get("education", "")),
        "projects":   parse_projects(sections.get("projects", "")),
        "skills":     parse_skills(sections.get("skills", "")),
        "experience": parse_experience(sections.get("experience", "")),
    }

    if args.report:
        print("\n── EXTRACTED DATA ──────────────────────────")
        for k, v in parsed.items():
            if k in ("projects", "skills", "experience"):
                print(f"\n{k.upper()}:")
                if isinstance(v, list):
                    for item in v:
                        if isinstance(item, dict):
                            item_disp = {ik: iv for ik, iv in item.items() if ik != "raw_block"}
                            print(f"  {item_disp}")
                        else:
                            print(f"  {item}")
                else:
                    for ck, cv in v.items():
                        print(f"  {ck}: {cv}")
            else:
                print(f"{k}: {v}")
        print("─────────────────────────────────────────────")
        return

    print("Loading current content.js…")
    current = load_content(args.content)

    print("Merging…")
    updated, changes = merge(current, parsed)

    if not changes:
        print("No changes detected. content.js is already up to date.")
        return

    print(f"\n{len(changes)} change(s) detected:")
    for ch in changes:
        print(f"  • {ch}")

    if args.dry_run:
        print("\n[dry-run] Nothing written. Remove --dry-run to apply.")
        return

    write_content(args.content, updated)
    print(f"\n✅ {args.content} updated.")
    print("   Review with: git diff content.js")
    print("   Then:        git add content.js && git commit -m 'Sync resume' && git push")


if __name__ == "__main__":
    main()
