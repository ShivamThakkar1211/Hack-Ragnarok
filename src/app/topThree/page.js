"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { FaStar, FaCodeBranch, FaGithub } from "react-icons/fa";

const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

export default function TopRepos() {
  const searchParams = useSearchParams();
  const username = searchParams.get("username");
  const [topRepos, setTopRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTopRepos = async () => {
      if (!username) {
        setError("Username not provided.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://api.github.com/search/repositories?q=user:${username}&sort=stars&order=desc&per_page=3`,
          {
            headers: {
              Authorization: `Bearer ${GITHUB_TOKEN}`,
              Accept: "application/vnd.github.v3+json",
            },
          }
        );

        if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);

        const data = await response.json();
        const repos = data.items || [];

        const topThree = repos.map((repo, index) => ({
          id: repo.id,
          name: repo.name,
          description: repo.description || "No description available",
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          language: repo.language || "Not specified",
          url: repo.html_url,
          created_at: new Date(repo.created_at).toLocaleDateString(),
          updated_at: new Date(repo.updated_at).toLocaleDateString(),
          rank: index + 1,
        }));

        setTopRepos(topThree);
      } catch (err) {
        console.error("Error fetching repositories:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTopRepos();
  }, [username]);

  // Loader
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-900 via-purple-800 to-pink-700">
        <div className="text-white text-2xl font-semibold animate-pulse">
          Loading top repositories...
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-900 via-purple-800 to-pink-700">
        <div className="text-red-400 text-xl font-semibold p-6 bg-white/10 rounded-2xl backdrop-blur-md shadow-xl">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-900 via-purple-800 to-pink-700 flex items-center justify-center px-6 sm:px-12 md:px-[10vh] lg:px-[20vh] py-20">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3 tracking-tight">
            {username}’s <span className="text-pink-300">Top Projects</span>
          </h1>
          <p className="text-lg text-blue-200">
            The 3 most-starred repositories from this developer
          </p>
        </div>

        {/* Repositories */}
        {topRepos.length === 0 ? (
          <div className="text-center text-white text-xl">
            No repositories found for this user.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {topRepos.map((repo) => (
              <div
                key={repo.id}
                className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 hover:scale-[1.02] border border-white/30"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="text-2xl font-bold text-gray-800 truncate">
                      {repo.name}
                    </h2>
                    <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
                      #{repo.rank}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4 min-h-[60px]">
                    {repo.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="inline-flex items-center bg-yellow-50 text-yellow-800 text-sm px-3 py-1 rounded-full">
                      <FaStar className="mr-1" /> {repo.stars} Stars
                    </span>
                    <span className="inline-flex items-center bg-green-50 text-green-800 text-sm px-3 py-1 rounded-full">
                      <FaCodeBranch className="mr-1" /> {repo.forks} Forks
                    </span>
                    {repo.language && (
                      <span className="inline-flex items-center bg-purple-50 text-purple-800 text-sm px-3 py-1 rounded-full">
                        {repo.language}
                      </span>
                    )}
                  </div>

                  <div className="text-sm text-gray-500 space-y-1">
                    <p>📅 Created: {repo.created_at}</p>
                    <p>🕓 Updated: {repo.updated_at}</p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 text-center rounded-b-3xl">
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center text-white font-medium hover:opacity-90 transition"
                  >
                    <FaGithub className="mr-2" /> View on GitHub
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* GitHub Profile Button */}
        <div className="mt-16 text-center">
          <a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-3 rounded-full text-white font-bold bg-gradient-to-r from-pink-600 to-purple-600 hover:opacity-90 transition transform hover:scale-105 shadow-lg"
          >
            <FaGithub className="mr-2 text-xl" />
            Visit Full GitHub Profile
          </a>
        </div>
      </div>
    </div>
  );
}
