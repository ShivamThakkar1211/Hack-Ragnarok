'use client';
import { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

export default function PDFUploader() {
  const { data: session } = useSession();
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a PDF file");
      return;
    }

    if (!session || !session.user?.id) {
      setMessage("Please sign in to upload files");
      return;
    }

    setIsLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const res = await axios.post("/api/upload-pdf", formData, {
        headers: { 
          "Content-Type": "multipart/form-data"
        }
      });

      setMessage(res.data.message || "Upload successful!");
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Upload failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: "600px",
      margin: "2rem auto",
      padding: "2rem",
      border: "1px solid #ddd",
      borderRadius: "8px",
      backgroundColor: "#f9f9f9",
      marginTop: "-90vh"
    }} >
      <h1 style={{ marginBottom: "1.5rem", color: "#333" }}>
        {session?.user ? "Upload Your PDF" : "Please Sign In"}
      </h1>

      {session?.user && (
        <>
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
              PDF File:
            </label>
            <input 
              type="file" 
              accept=".pdf" 
              onChange={handleFileChange}
              style={{ display: "block" }}
            />
          </div>

          <button
            onClick={handleUpload}
            disabled={isLoading || !session?.user}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#0070f3",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? "Uploading..." : "Upload PDF"}
          </button>
        </>
      )}

      {message && (
        <p style={{ marginTop: "1rem", color: message.includes("failed") ? "#e53e3e" : "#38a169", fontWeight: "bold" }}>
          {message}
        </p>
      )}
    </div>
  );
}
