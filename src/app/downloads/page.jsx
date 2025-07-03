"use client";
import { useState } from "react";
import axios from "axios";

const PdfUploader = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [pdfUrl, setPdfUrl] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://127.0.0.1:5000/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setMessage(`Upload successful: ${response.data.message}`);
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessage("Failed to upload PDF.");
    }
  };

  // ✅ Fetch PDF from MongoDB
  const handleFetchPdf = async () => {
    try {
      const response = await axios.get("/api/pdf", {
        responseType: "blob"  // Get binary PDF data
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      setMessage("PDF fetched successfully!");
    } catch (error) {
      console.error("Failed to fetch PDF:", error);
      setMessage("Failed to fetch PDF.");
    }
  };

  // ✅ Download PDF
  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = "document.pdf";
      link.click();
    }
  };

  return (
    <div className="p-4 mt-[-100vh]">
      <h2 className="text-xl font-bold">PDF Uploader</h2>
      
      {/* Upload Section */}
      <input 
        type="file" 
        accept=".pdf" 
        onChange={handleFileChange} 
        className="border p-2 my-2" 
      />
      <button 
        onClick={handleUpload} 
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mx-2"
      >
        Upload
      </button>

      {/* Fetch and Download Section */}
      <button 
        onClick={handleFetchPdf} 
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 mx-2"
      >
        Fetch PDF
      </button>

      {pdfUrl && (
        <>
          <button 
            onClick={handleDownload} 
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 mx-2"
          >
            Download PDF
          </button>

          {/* Display PDF */}
          <div className="mt-4">
            <iframe src={pdfUrl} className="w-full h-[1000px]" />
          </div>
        </>
      )}

      {message && <p className="mt-4">{message}</p>}
    </div>
  );
};

export default PdfUploader;
