"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaCode, FaGithub, FaFileUpload } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import axios from "axios";
import { useSession } from "next-auth/react";

export default function GitHubUser() {
  const { data: session } = useSession();
  const [githubUsername, setGithubUsername] = useState("");
  const [leetcodeUsername, setLeetcodeUsername] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true); // 🟣 sidebar toggle state

  const router = useRouter();

  const handleSearch = () => {
    setError(null);

    if (!githubUsername.trim()) {
      setError("Please enter at least your GitHub username.");
      return;
    }

    const params = new URLSearchParams();
    params.append("username", githubUsername);
    if (leetcodeUsername.trim()) params.append("leetcode", leetcodeUsername);
    router.push(`/Intro?${params.toString()}`);
  };

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
    <div
      className={`relative min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-900 via-purple-800 to-pink-700 overflow-hidden transition-all duration-500 ${
        sidebarOpen ? "md:ml-[25vh]" : "md:ml-0"
      }`}
    >
      {/* 🔘 Sidebar Toggle Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute top-5 left-5 z-20 bg-white/20 backdrop-blur-md text-white px-3 py-2 rounded-md hover:bg-white/30 transition"
      >
        {sidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
      </button>

      {/* Animated gradient overlay */}
      <div
        className="absolute inset-0 opacity-50 bg-gradient-to-r from-blue-700 via-purple-600 to-pink-500 animate-[gradient_10s_ease_infinite]"
        style={{
          backgroundSize: "200% 200%",
          zIndex: 0,
        }}
      />

      {/* Card Container */}
      <div className="relative z-10 w-full max-w-md bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 text-center border border-white/30 transition-all hover:shadow-pink-500/30">
        <div className="flex justify-center space-x-4 mb-6">
          <FaGithub className="text-gray-800 text-3xl" />
          <FaCode className="text-purple-700 text-3xl" />
        </div>

        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-700 to-pink-500 bg-clip-text text-transparent mb-2">
          LinkFolio
        </h1>
        <p className="text-gray-600 mb-8 font-medium">
          Connect your coding profiles and upload your resume
        </p>

        <div className="text-left space-y-5">
          {/* GitHub */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1 flex items-center">
              <FaGithub className="text-gray-700 mr-2" /> GitHub Username
            </label>
            <div className="flex">
              <span className="bg-gray-200 px-3 py-2 border border-r-0 rounded-l-md text-gray-700">
                github.com/
              </span>
              <input
                type="text"
                className="w-full px-4 py-2 border text-gray-700 border-l-0 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-r-md"
                placeholder="your-github-username"
                value={githubUsername}
                onChange={(e) => setGithubUsername(e.target.value.trimStart())}
              />
            </div>
          </div>

          {/* LeetCode */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1 flex items-center">
              <SiLeetcode className="text-orange-500 mr-2" /> LeetCode Username
            </label>
            <input
              type="text"
              className="w-full border rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="your-leetcode-username"
              value={leetcodeUsername}
              onChange={(e) => setLeetcodeUsername(e.target.value.trimStart())}
            />
          </div>

          {/* File Upload */}
          {session?.user && (
            <div>
              <label className="block text-gray-700 font-semibold mb-1 flex items-center">
                <FaFileUpload className="text-blue-600 mr-2" /> Upload PDF Resume
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="block w-full text-gray-700 border rounded p-2 focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={handleUpload}
                disabled={isLoading}
                className={`mt-3 w-full py-2 rounded-md text-white font-semibold transition ${
                  isLoading
                    ? "bg-purple-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90"
                }`}
              >
                {isLoading ? "Uploading..." : "Upload PDF"}
              </button>
              {message && (
                <p
                  className={`mt-2 text-sm ${
                    message.toLowerCase().includes("fail")
                      ? "text-red-500"
                      : "text-green-500"
                  }`}
                >
                  {message}
                </p>
              )}
            </div>
          )}

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <button
            onClick={handleSearch}
            className="mt-6 w-full py-2 bg-gradient-to-r from-orange-500 to-yellow-400 text-white font-bold rounded-lg hover:opacity-90 transition"
          >
            Create Portfolio
          </button>
        </div>
      </div>

      {/* Gradient animation keyframes */}
      <style jsx global>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </div>
  );
}
