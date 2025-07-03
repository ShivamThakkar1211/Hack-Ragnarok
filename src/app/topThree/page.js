"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { FaStar, FaCodeBranch, FaGithub } from "react-icons/fa";

const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN; // Replace with your GitHub token

const TopRepos = () => {
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
          `https://api.github.com/search/repositories?q=user:${username}&sort=stars&order=desc&per_page=3`, // Use search API for sorting by stars
          {
            headers: {
              Authorization: `Bearer ${GITHUB_TOKEN}`,
              Accept: "application/vnd.github.v3+json",
            },
          }
        );

        if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);

        const data = await response.json();
        const repos = data.items;

        if (!Array.isArray(repos)) throw new Error("Unexpected API response format");

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
          rank: index + 1, // Add rank for display
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 to-purple-800">
        <div className="text-white text-2xl font-semibold">Loading top repositories...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 to-purple-800">
        <div className="text-red-400 text-xl font-semibold p-6 bg-white bg-opacity-10 rounded-xl">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-900 to-purple-800 py-12 px-4 mt-[-100vh]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">
              {username}&#39;s Top Projects
          </h1>
          <p className="text-xl text-blue-200">
            The 3 highest-starred repositories on GitHub
          </p>
        </div>

        {topRepos.length === 0 ? (
          <div className="text-center text-white text-xl">No repositories found for this user.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topRepos.map((repo) => (
              <div
                key={repo.id}
                className="bg-white rounded-xl shadow-2xl overflow-hidden transition-transform hover:scale-105"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold text-gray-800 truncate">
                      {repo.name}
                    </h2>
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                      #{repo.rank}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4">{repo.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="inline-flex items-center bg-blue-50 text-blue-800 text-sm px-3 py-1 rounded-full">
                      <FaStar className="mr-1" /> {repo.stars} stars
                    </span>
                    <span className="inline-flex items-center bg-green-50 text-green-800 text-sm px-3 py-1 rounded-full">
                      <FaCodeBranch className="mr-1" /> {repo.forks} forks
                    </span>
                    {repo.language && (
                      <span className="inline-flex items-center bg-purple-50 text-purple-800 text-sm px-3 py-1 rounded-full">
                        {repo.language}
                      </span>
                    )}
                  </div>

                  <div className="text-sm text-gray-500 space-y-1">
                    <p>Created: {repo.created_at}</p>
                    <p>Updated: {repo.updated_at}</p>
                  </div>
                </div>

                <div className="bg-gray-50 px-6 py-3">
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <FaGithub className="mr-2" /> View on GitHub
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-white text-blue-900 font-bold rounded-lg hover:bg-gray-100 transition"
          >
            <FaGithub className="mr-2 text-xl" />
            View Full GitHub Profile
          </a>
        </div>
      </div>
    </div>
  );
};

export default TopRepos;
