"use client";
import { useState } from "react";
import axios from "axios";

const PdfUploader = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setMessage("");
      const response = await axios.post("http://127.0.0.1:5000/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(`✅ Upload successful: ${response.data.message}`);
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessage("❌ Failed to upload PDF.");
    } finally {
      setLoading(false);
    }
  };

  const handleFetchPdf = async () => {
    try {
      setLoading(true);
      setMessage("");
      const response = await axios.get("/api/pdf", {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      setMessage("✅ PDF fetched successfully!");
    } catch (error) {
      console.error("Failed to fetch PDF:", error);
      setMessage("❌ Failed to fetch PDF.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = "document.pdf";
      link.click();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 ml-[20vh] p-4 sm:p-8">
      <div className="bg-white w-full max-w-2xl shadow-xl rounded-2xl p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          📄 PDF Uploader
        </h2>

        {/* File Input */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-4">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="border border-gray-300 rounded-md p-2 w-full sm:w-auto flex-grow text-gray-700"
          />
          <button
            onClick={handleUpload}
            disabled={loading}
            className={`mt-3 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200 ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>

        {/* Fetch & Download Controls */}
        <div className="flex flex-wrap gap-3 justify-center mt-4">
          <button
            onClick={handleFetchPdf}
            disabled={loading}
            className={`bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200 ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Fetching..." : "Fetch PDF"}
          </button>

          {pdfUrl && (
            <button
              onClick={handleDownload}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
            >
              Download PDF
            </button>
          )}
        </div>

        {/* Message */}
        {message && (
          <p
            className={`mt-4 text-center font-semibold ${
              message.includes("❌") ? "text-red-600" : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}

        {/* PDF Preview */}
        {pdfUrl && (
          <div className="mt-6">
            <iframe
              src={pdfUrl}
              className="w-full h-[500px] sm:h-[700px] rounded-lg border"
            ></iframe>
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfUploader;
