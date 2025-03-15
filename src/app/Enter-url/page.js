"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GitHubUser() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSearch = () => {
    setError(null);

    if (!username.trim()) {
      setError("Please enter a GitHub username.");
      return;
    }

    // Encode the query parameter before redirecting
    router.push(`/Intro?username=${encodeURIComponent(username)}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
          GitHub Profile
        </h2>

        <div className="flex">
          <span className="bg-gray-200 px-4 py-2 border border-r-0 rounded-l-md text-gray-700">
            github.com/
          </span>
          <input
            id="github-username"
            type="text"
            className="w-full px-4 py-2 border text-black border-l-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter GitHub username"
            value={username}
            onChange={(e) => setUsername(e.target.value.trimStart())}
            aria-label="GitHub username"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition"
          >
            Search
          </button>
        </div>

        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
      </div>
    </div>
  );
}
