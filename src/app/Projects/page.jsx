"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";

const TOGETHER_AI_API_KEY = "0e33b829155047d690aa9136a54aacd4805a7bac760f192e3c609aa2d2495c81";
const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;  // Replace with your GitHub token
const PER_PAGE = 10;  // Repos per page

const RepoBranch = () => {
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
      const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=${PER_PAGE}&page=${page}`, {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      });

      if (!res.ok) throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);

      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("Unexpected API response format");

      const repoDetails = await Promise.all(
        data.map(async (repo) => {
          let summary = "No summary available";

          try {
            const readmeRes = await fetch(`https://api.github.com/repos/${username}/${repo.name}/readme`, {
              headers: {
                Authorization: `Bearer ${GITHUB_TOKEN}`,
              },
            });

            if (readmeRes.ok) {
              const readmeData = await readmeRes.json();
              const decodedContent = atob(readmeData.content);
              summary = await summarizeWithTogetherAI(decodedContent) || "Failed to generate summary";
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
      const response = await fetch("https://api.together.xyz/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOGETHER_AI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
          messages: [
            { role: "system", content: "Summarize the given GitHub README file briefly." },
            { role: "user", content: readmeContent },
          ],
          max_tokens: 200,
        }),
      });

      if (!response.ok) throw new Error("Failed to get summary");

      const data = await response.json();
      return data.choices?.[0]?.message?.content || "No summary generated";
    } catch (error) {
      console.error("Error summarizing README:", error);
      return "Error generating summary";
    }
  };

  return (
    <div className="min-h-screen mt-[-100vh] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-6">
      <div className="mt-24 bg-white shadow-2xl rounded-xl p-6 max-w-4xl w-full">
        <h2 className="text-4xl font-extrabold text-center text-purple-700 mb-6">GitHub Repositories</h2>

        {loading && repos.length === 0 ? (
          <div className="flex justify-center items-center">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <p className="text-center text-red-500 font-semibold">{error}</p>
        ) : repos.length === 0 ? (
          <p className="text-center text-gray-600 font-semibold">No repositories found.</p>
        ) : (
          <div className="mt-6 space-y-6">
            {repos.map((repo, index) => (
              <div key={repo.id} className="bg-gray-100 p-5 rounded-lg shadow-md relative">
                <span className="absolute -top-3 -left-3 bg-purple-600 text-white w-8 h-8 flex items-center justify-center rounded-full text-lg font-bold">
                  {index + 1}
                </span>
                <p className="text-sm text-gray-500">{repo.created_at}</p>
                <h3 className="text-2xl font-bold text-purple-700">{repo.name}</h3>
                <p className="text-gray-700">
                  Owner: <span className="font-semibold">{repo.owner}</span>
                </p>
                <p className="text-gray-600 mt-2">
                  <strong>Summary:</strong> {repo.summary}
                </p>
                <a href={repo.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline mt-2 inline-block">
                  {repo.url}
                </a>
              </div>
            ))}

            {repos.length % PER_PAGE === 0 && (
              <button
                onClick={() => setPage((prev) => prev + 1)}
                className="w-full mt-6 bg-purple-700 hover:bg-purple-900 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
              >
                Load More
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RepoBranch;
