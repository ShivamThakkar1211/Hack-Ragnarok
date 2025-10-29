"use client";

import { useState } from "react";
import axios from "axios";

export default function UploadPPT() {
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
      setMessage("");
    } else {
      setFile(null);
      setError("⚠️ Please upload a valid PPT or PPTX file.");
      setMessage("");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("ppt", file);

    try {
      setUploading(true);
      setError("");
      setMessage("");

      const response = await axios.post("/api/upload-ppt", formData);

      if (response.data.success) {
        setMessage("✅ File uploaded successfully!");
        setFile(null);
      } else {
        setError(response.data.message || "Upload failed. Try again.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError("❌ Error uploading file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center p-4 sm:p-8">
      <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-6 sm:p-10 max-w-lg w-full border border-gray-200">
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 mb-6">
          Upload Your PPT
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Upload PowerPoint files (.ppt or .pptx) securely to process and analyze.
        </p>

        {/* File Input */}
        <div className="relative group">
          <input
            type="file"
            accept=".ppt,.pptx"
            onChange={handleFileChange}
            className="border-2 border-dashed border-gray-300 rounded-xl w-full p-5 text-gray-700 cursor-pointer transition duration-300 hover:border-purple-500 hover:bg-purple-50 focus:outline-none"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition">
            <span className="text-purple-500 font-semibold">📂 Drop your file here</span>
          </div>
        </div>

        {/* File Info */}
        {file && (
          <div className="mt-5 bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-purple-700 font-medium">📄 {file.name}</p>
            <p className="text-gray-500 text-sm mt-1">
              Size: {(file.size / 1024).toFixed(2)} KB
            </p>
          </div>
        )}

        {/* Status Messages */}
        {error && <p className="text-red-500 mt-4 text-center font-medium">{error}</p>}
        {message && (
          <p className="text-green-600 mt-4 text-center font-semibold">{message}</p>
        )}

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={uploading}
          className={`mt-6 w-full py-3 rounded-xl text-white font-semibold transition duration-300 transform hover:scale-105 ${
            uploading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90"
          }`}
        >
          {uploading ? "Uploading..." : "Upload File"}
        </button>

        {/* Loader Animation */}
        {uploading && (
          <div className="flex justify-center mt-6">
            <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
}
