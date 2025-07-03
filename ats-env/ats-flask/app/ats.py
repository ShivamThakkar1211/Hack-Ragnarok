import re
import PyPDF2

# Expected sections in the resume
EXPECTED_SECTIONS = ["experience", "education", "skills", "projects", "contact"]

# Example Job Description
EXAMPLE_JOB_DESCRIPTION = """
We are looking for a Full Stack Developer experienced in React, Node.js, JavaScript, REST APIs, and Git.
Knowledge of Docker and AWS is a plus.
"""

# Extract text from PDF
def extract_text_from_pdf(file_path):
    with open(file_path, "rb") as file:
        reader = PyPDF2.PdfReader(file)
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""
        return text.lower()

# Extract keywords from text
def extract_keywords(text):
    return list(set(re.findall(r"\b[a-zA-Z]{3,}\b", text.lower())))

# Calculate ATS Score
def calculate_ats_score(resume_text, job_description):
    resume_keywords = extract_keywords(resume_text)
    jd_keywords = extract_keywords(job_description)

    # Keyword Score
    matched_keywords = [kw for kw in jd_keywords if kw in resume_keywords]
    keyword_score = len(matched_keywords) / len(jd_keywords) * 100 if jd_keywords else 0

    # Section Score
    section_score = len([s for s in EXPECTED_SECTIONS if s in resume_text]) / len(EXPECTED_SECTIONS) * 100

    # Contact Info Score
    contact_score = 100 if re.search(r"[\w\.-]+@[\w\.-]+", resume_text) else 50

    # Total ATS Score
    total_score = round((keyword_score + section_score + contact_score) / 3)

    # Suggestions for improvement
    suggestions = []
    if keyword_score < 70:
        suggestions.append("Add more job-specific keywords.")
    if section_score < 100:
        suggestions.append("Include all recommended sections.")
    if contact_score < 100:
        suggestions.append("Include valid contact information (email/phone).")

    return {
        "Total ATS Score": total_score,
        "Keyword Score": round(keyword_score, 2),
        "Section Score": round(section_score, 2),
        "Contact Score": contact_score,
        "Missing Keywords": list(set(jd_keywords) - set(matched_keywords)),
        "Suggestions": suggestions,
    }