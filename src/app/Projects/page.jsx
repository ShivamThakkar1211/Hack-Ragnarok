"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const RepoBranch = () => {
  const searchParams = useSearchParams();
  const username = searchParams.get("username"); // Get username from URL
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!username) {
      setError("Username not provided.");
      setLoading(false);
      return;
    }

    const fetchRepos = async () => {
      try {
        const res = await fetch(`https://api.github.com/users/${username}/repos`);
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);

        const data = await res.json();
        if (!Array.isArray(data)) throw new Error("Unexpected API response format");

        setRepos(
          data.map((repo) => ({
            name: repo.name,
            owner: repo.owner?.login || "Unknown",
            url: repo.html_url,
            created_at: new Date(repo.created_at).toDateString(),
          }))
        );
      } catch (error) {
        console.error("Error fetching repositories:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, [username]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center text-purple-600">GitHub Repositories</h2>

      {loading ? (
        <p className="text-center text-gray-500 mt-4">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500 mt-4">{error}</p>
      ) : repos.length === 0 ? (
        <p className="text-center text-gray-500 mt-4">No repositories found.</p>
      ) : (
        <div className="relative mt-8">
          <div className="absolute left-4 top-0 h-full w-1 bg-purple-500"></div>

          {repos.map((repo, index) => (
            <div key={repo.name} className="flex items-start mb-8">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold relative z-10">
                {index + 1}
              </div>

              <div className="ml-6 p-4 bg-white shadow-lg rounded-lg w-full">
                <p className="text-sm text-gray-500">{repo.created_at}</p>
                <h3 className="text-xl font-bold text-purple-700">{repo.name}</h3>
                <p className="text-gray-600">
                  Owner: <span className="font-semibold">{repo.owner}</span>
                </p>
                <a href={repo.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  {repo.url}
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RepoBranch;
