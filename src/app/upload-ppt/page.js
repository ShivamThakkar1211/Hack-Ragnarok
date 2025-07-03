"use client";

import { useState } from "react";
import axios from "axios";

const UploadPPT = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (
      selectedFile &&
      (selectedFile.type === "application/vnd.ms-powerpoint" ||
        selectedFile.type ===
          "application/vnd.openxmlformats-officedocument.presentationml.presentation")
    ) {
      setFile(selectedFile);
      setError("");
    } else {
      setFile(null);
      setError("Please upload a valid PPT or PPTX file.");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("No file selected.");
      return;
    }

    const formData = new FormData();
    formData.append("ppt", file);

    try {
      setUploading(true);
      const response = await axios.post("/api/upload-ppt", formData);

      if (response.data.success) {
        setMessage("File uploaded successfully!");
        setFile(null);
      } else {
        setError(response.data.message || "Failed to upload.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError("Error uploading the file.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-4">Upload PPT File</h1>

        <input
          type="file"
          accept=".ppt,.pptx"
          onChange={handleFileChange}
          className="border border-gray-300 p-2 rounded-md w-full"
        />

        {file && (
          <div className="mt-4">
            <p className="text-green-600">File: {file.name}</p>
            <p className="text-gray-600">Size: {(file.size / 1024).toFixed(2)} KB</p>
          </div>
        )}

        {error && <p className="text-red-500 mt-2">{error}</p>}
        {message && <p className="text-green-500 mt-2">{message}</p>}

        <button
          onClick={handleUpload}
          className={`mt-4 w-full bg-blue-500 text-white py-2 rounded-md ${
            uploading ? "opacity-50" : "hover:bg-blue-600"
          }`}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>
    </div>
  );
};

export default UploadPPT;
