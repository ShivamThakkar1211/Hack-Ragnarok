"use client";
import { useState } from "react";
import axios from "axios";

const PdfViewer = () => {
  const [pdfUrl, setPdfUrl] = useState("");
  const [error, setError] = useState("");

  const handleFetchPdf = async () => {
    try {
      setError("");
      const response = await axios.get("/api/pdf", {
        responseType: "blob"
      });

      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);

    } catch (error) {
      console.error("Failed to fetch PDF:", error);
      setError("Failed to load PDF. Please try again.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">PDF Viewer</h2>
      <button 
        onClick={handleFetchPdf} 
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
      >
        Fetch PDF
      </button>

      {error && <p className="text-red-500">{error}</p>}

      {pdfUrl ? (
        <div className="mt-4 border rounded-lg overflow-hidden">
          <embed 
            src={pdfUrl} 
            type="application/pdf"
            className="w-full h-[500px]"
          />
        </div>
      ) : (
        <p className="text-gray-500">No PDF loaded yet</p>
      )}
    </div>
  );
};

export default PdfViewer;