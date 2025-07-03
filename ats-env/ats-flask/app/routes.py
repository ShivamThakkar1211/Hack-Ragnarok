import os
from flask import Blueprint, request, jsonify
from app.ats import extract_text_from_pdf, calculate_ats_score, EXAMPLE_JOB_DESCRIPTION

ats_bp = Blueprint("ats", __name__)

UPLOAD_FOLDER = "app/uploads"

@ats_bp.route("/analyze", methods=["POST"])
def analyze_resume():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    if file and file.filename.endswith(".pdf"):
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(file_path)

        resume_text = extract_text_from_pdf(file_path)
        ats_result = calculate_ats_score(resume_text, EXAMPLE_JOB_DESCRIPTION)

        os.remove(file_path)  # Clean up after processing
        return jsonify(ats_result)

    return jsonify({"error": "Invalid file format. Only PDFs are allowed."}), 400