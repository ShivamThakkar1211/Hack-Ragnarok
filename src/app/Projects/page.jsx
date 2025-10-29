"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";

const TOGETHER_AI_API_KEY =
  "0e33b829155047d690aa9136a54aacd4805a7bac760f192e3c609aa2d2495c81";
const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
const PER_PAGE = 10;

export default function RepoBranch() {
  const searchParams = useSearchParams();
  const username = searchParams.get("username");

  const [repos, setRepos] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchRepos = useCallback(async () => {
    if (!username) {
      setError("Username not provided.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `https://api.github.com/users/${username}/repos?per_page=${PER_PAGE}&page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      if (!res.ok)
        throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);

      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("Unexpected API response format");

      const repoDetails = await Promise.all(
        data.map(async (repo) => {
          let summary = "No summary available";
          try {
            const readmeRes = await fetch(
              `https://api.github.com/repos/${username}/${repo.name}/readme`,
              {
                headers: { Authorization: `Bearer ${GITHUB_TOKEN}` },
              }
            );

            if (readmeRes.ok) {
              const readmeData = await readmeRes.json();
              const decodedContent = atob(readmeData.content);
              summary =
                (await summarizeWithTogetherAI(decodedContent)) ||
                "Failed to generate summary";
            }
          } catch {
            summary = "Failed to load README";
          }

          return {
            id: repo.id,
            name: repo.name,
            owner: repo.owner?.login || "Unknown",
            url: repo.html_url,
            created_at: new Date(repo.created_at).toDateString(),
            summary,
          };
        })
      );

      setRepos((prev) => [...prev, ...repoDetails]);
    } catch (error) {
      console.error("Error fetching repositories:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [username, page]);

  useEffect(() => {
    if (username) fetchRepos();
  }, [username, page, fetchRepos]);

  const summarizeWithTogetherAI = async (readmeContent) => {
    try {
      const response = await fetch(
        "https://api.together.xyz/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOGETHER_AI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
            messages: [
              {
                role: "system",
                content: "Summarize the given GitHub README file briefly.",
              },
              { role: "user", content: readmeContent },
            ],
            max_tokens: 200,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to get summary");
      const data = await response.json();
      return data.choices?.[0]?.message?.content || "No summary generated";
    } catch (error) {
      console.error("Error summarizing README:", error);
      return "Error generating summary";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex justify-center items-center p-4 sm:p-8">
      <div className="mt-28 bg-white/95 backdrop-blur-lg shadow-2xl rounded-3xl p-6 sm:p-10 w-full max-w-5xl mx-auto border border-gray-100">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 mb-8">
          GitHub Repositories
        </h2>

        {/* Loader */}
        {loading && repos.length === 0 && (
          <div className="flex justify-center py-10">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="text-center text-red-500 font-semibold">{error}</p>
        )}

        {/* Empty State */}
        {!loading && !error && repos.length === 0 && (
          <p className="text-center text-gray-500 font-medium">
            No repositories found.
          </p>
        )}

        {/* Repository Cards */}
        <div className="grid sm:grid-cols-2 gap-6 mt-6">
          {repos.map((repo, index) => (
            <div
              key={repo.id}
              className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 sm:p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden border border-gray-200"
            >
              <div className="absolute top-0 right-0 bg-gradient-to-l from-purple-600 to-pink-500 text-white px-3 py-1 text-sm rounded-bl-xl font-semibold">
                #{index + 1}
              </div>

              <p className="text-xs text-gray-500 mb-1">{repo.created_at}</p>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">
                {repo.name}
              </h3>
              <p className="text-sm text-gray-500 mb-2">
                👤 Owner:{" "}
                <span className="font-semibold text-gray-700">
                  {repo.owner}
                </span>
              </p>

              <p className="text-gray-700 text-sm leading-relaxed mb-3 line-clamp-3">
                <strong className="text-purple-700">Summary:</strong>{" "}
                {repo.summary}
              </p>

              <a
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 transition px-4 py-2 rounded-lg"
              >
                🔗 View on GitHub
              </a>
            </div>
          ))}
        </div>

        {/* Load More */}
        {repos.length > 0 && repos.length % PER_PAGE === 0 && (
          <div className="flex justify-center mt-10">
            <button
              onClick={() => setPage((prev) => prev + 1)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
