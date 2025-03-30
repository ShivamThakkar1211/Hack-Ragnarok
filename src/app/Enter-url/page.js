"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaCode, FaGithub } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";

export default function GitHubUser() {
  const [githubUsername, setGithubUsername] = useState("");
  const [leetcodeUsername, setLeetcodeUsername] = useState("");
  const [error, setError] = useState(null);
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

  return (
    <div className="relative min-h-screen overflow-hidden z-[1] mt-[-100vh]">
      {/* Gradient background */}
      <div 
        className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-700 to-yellow-400"
        style={{
          backgroundSize: '200% 200%',
          animation: 'gradient 15s ease infinite'
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
            <p className="text-gray-600 mb-6">Enter your GitHub and LeetCode usernames to create your portfolio</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-bold mb-2 flex items-center" htmlFor="github-username">
                  <FaGithub className="text-gray-700 mr-2" />
                  GitHub Username
                </label>
                <div className="flex">
                  <span className="bg-gray-200 px-4 py-2 border border-r-0 rounded-l-md text-gray-700">
                    github.com/
                  </span>
                  <input
                    id="github-username"
                    type="text"
                    className="w-full px-4 py-2 border text-gray-700 border-l-0 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-r-md"
                    placeholder="your-github-username"
                    value={githubUsername}
                    onChange={(e) => setGithubUsername(e.target.value.trimStart())}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 font-bold mb-2 flex items-center" htmlFor="leetcode-username">
                  <SiLeetcode className="text-orange-500 mr-2" />
                  LeetCode Username
                </label>
                <input
                  id="leetcode-username"
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="your-leetcode-username"
                  value={leetcodeUsername}
                  onChange={(e) => setLeetcodeUsername(e.target.value.trimStart())}
                />
              </div>
              
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              
              <div className="pt-2">
                <button
                  onClick={handleSearch}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 transition w-full"
                  type="button"
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