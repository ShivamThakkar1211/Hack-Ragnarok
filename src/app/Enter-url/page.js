"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaCode, FaGithub } from "react-icons/fa";
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
  const router = useRouter();

  const handleSearch = () => {
    setError(null);

    if (!githubUsername.trim()) {
      setError("Please enter at least your GitHub username.");
      return;
    }

    const params = new URLSearchParams();
    params.append("username", githubUsername);
    if (leetcodeUsername.trim()) {
      params.append("leetcode", leetcodeUsername);
    }

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
        headers: {
          "Content-Type": "multipart/form-data",
        },
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
    <div className="relative min-h-screen overflow-hidden z-[1] mt-[-100vh]">
      {/* Gradient background */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-700 to-yellow-400"
        style={{
          backgroundSize: "200% 200%",
          animation: "gradient 15s ease infinite",
        }}
      ></div>

      {/* Content container */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="text-center w-full px-4">
          <div className="mb-8 flex justify-center space-x-4">
            <FaGithub className="text-white text-3xl" />
            <FaCode className="text-white text-3xl" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">LinkFolio</h1>
          <p className="text-lg text-white mb-8">Connect your coding profiles</p>

          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Connect Your Profiles</h2>
            <p className="text-gray-600 mb-6">
              Enter your GitHub and LeetCode usernames to create your portfolio
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-bold mb-2 flex items-center">
                  <FaGithub className="text-gray-700 mr-2" />
                  GitHub Username
                </label>
                <div className="flex">
                  <span className="bg-gray-200 px-4 py-2 border border-r-0 rounded-l-md text-gray-700">
                    github.com/
                  </span>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border text-gray-700 border-l-0 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-r-md"
                    placeholder="your-github-username"
                    value={githubUsername}
                    onChange={(e) => setGithubUsername(e.target.value.trimStart())}
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2 flex items-center">
                  <SiLeetcode className="text-orange-500 mr-2" />
                  LeetCode Username
                </label>
                <input
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="your-leetcode-username"
                  value={leetcodeUsername}
                  onChange={(e) => setLeetcodeUsername(e.target.value.trimStart())}
                />
              </div>

              {/* PDF Upload Section */}
              {session?.user && (
                <div>
                  <label className="block text-gray-700 font-bold mb-2">Upload PDF</label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="block w-full text-gray-700 border rounded p-2"
                  />
                  <button
                    onClick={handleUpload}
                    disabled={isLoading}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-2"
                  >
                    {isLoading ? "Uploading..." : "Upload PDF"}
                  </button>
                  {message && (
                    <p className={`mt-2 ${message.includes("failed") ? "text-red-500" : "text-green-500"}`}>
                      {message}
                    </p>
                  )}
                </div>
              )}

              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

              <div className="pt-2">
                <button
                  onClick={handleSearch}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 transition w-full"
                >
                  Create Portfolio
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

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
