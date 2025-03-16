"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const TOGETHER_AI_API_KEY = "0e33b829155047d690aa9136a54aacd4805a7bac760f192e3c609aa2d2495c81"; // Replace with your API key

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

        const repoDetails = await Promise.all(
          data.map(async (repo) => {
            let summary = "No summary available";

            try {
              // Fetch README file
              const readmeRes = await fetch(`https://api.github.com/repos/${username}/${repo.name}/readme`);
              if (readmeRes.ok) {
                const readmeData = await readmeRes.json();
                const decodedContent = atob(readmeData.content); // Decode Base64 README

                // Send README to Together AI for summarization
                const aiSummary = await summarizeWithTogetherAI(decodedContent);
                summary = aiSummary || "Failed to generate summary";
              }
            } catch {
              summary = "Failed to load README";
            }

            return {
              name: repo.name,
              owner: repo.owner?.login || "Unknown",
              url: repo.html_url,
              created_at: new Date(repo.created_at).toDateString(),
              summary,
            };
          })
        );

        setRepos(repoDetails);
      } catch (error) {
        console.error("Error fetching repositories:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, [username]);

  // Function to send README content to Together AI and get a summary
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
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-6">
      <div className="mt-24 bg-white shadow-2xl rounded-xl p-6 max-w-4xl w-full">
        <h2 className="text-4xl font-extrabold text-center text-purple-700 mb-6">GitHub Repositories</h2>

        {loading ? (
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
              <div key={repo.name} className="bg-gray-100 p-5 rounded-lg shadow-md relative">
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
          </div>
        )}
      </div>
    </div>
  );
};

export default RepoBranch;
