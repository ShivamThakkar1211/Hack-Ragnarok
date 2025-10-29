'use client';
import { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

export default function PDFUploader() {
  const { data: session } = useSession();
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) return setMessage("Please select a PDF file");
    if (!session?.user?.id) return setMessage("Please sign in to upload files");

    setIsLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const res = await axios.post("/api/upload-pdf", formData, {
        headers: { "Content-Type": "multipart/form-data" },
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-700 to-yellow-400 px-4">
      <div className="bg-white/95 backdrop-blur-md shadow-xl rounded-2xl p-8 w-full max-w-lg text-gray-800">
        <h1 className="text-3xl font-bold mb-4 text-center">
          {session?.user ? "Upload Your PDF" : "Please Sign In"}
        </h1>

        {session?.user && (
          <>
            <div className="mb-6">
              <label className="block mb-2 font-semibold">Select PDF File</label>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={handleUpload}
              disabled={isLoading}
              className={`w-full py-2 rounded-md text-white font-semibold transition ${
                isLoading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isLoading ? "Uploading..." : "Upload PDF"}
            </button>
          </>
        )}

        {message && (
          <p
            className={`mt-4 text-center font-medium ${
              message.toLowerCase().includes("fail")
                ? "text-red-500"
                : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
