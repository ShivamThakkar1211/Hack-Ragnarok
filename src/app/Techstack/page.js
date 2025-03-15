"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useSearchParams } from "next/navigation";

export default function TechStack() {
  const [userData, setUserData] = useState(null);
  const [summary, setSummary] = useState("Loading summary...");
  const [techStack, setTechStack] = useState([]);
  const searchParams = useSearchParams();
  const username = searchParams.get("username");

  useEffect(() => {
    if (!username) return;

    console.log(`Fetching GitHub data for username: ${username}`);

    const fetchGitHubData = async () => {
      try {
        // Fetch GitHub user details
        const userResponse = await axios.get(`https://api.github.com/users/${username}`);
        setUserData(userResponse.data);

        // Fetch README Content
        let readmeContent = null;
        try {
          const readmeResponse = await axios.get(
            `https://api.github.com/repos/${username}/${username}/readme`
          );

          if (readmeResponse.data.content) {
            readmeContent = atob(readmeResponse.data.content);
            console.log("Decoded README:", readmeContent);
          }
        } catch (error) {
          console.error("README not found or inaccessible:", error.response?.data || error.message);
          setSummary("No README found for this user.");
        }

        // Fetch AI Summary (if README exists)
        if (readmeContent) {
          try {
            const summaryResponse = await axios.post(
              "https://api.together.ai/v1/chat/completions",
              {
                model: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
                messages: [
                  {
                    role: "user",
                    content: `Summarize this GitHub README in 5 sentences, highlighting key technologies used: \n\n ${readmeContent}`,
                  },
                ],
                max_tokens: 200,
              },
              {
                headers: {
                  Authorization: `Bearer 0e33b829155047d690aa9136a54aacd4805a7bac760f192e3c609aa2d2495c81`, // Replace with your actual API key
                  "Content-Type": "application/json",
                },
              }
            );

            const aiSummary = summaryResponse.data.choices?.[0]?.message?.content;
            setSummary(aiSummary || "No summary available.");
          } catch (error) {
            console.error("Error fetching AI summary:", error.response?.data || error.message);
            setSummary("Error generating summary.");
          }
        }

        // Fetch repositories for Tech Stack
        const reposResponse = await axios.get(userResponse.data.repos_url);
        const techLanguages = new Set();
        reposResponse.data.forEach((repo) => {
          if (repo.language) techLanguages.add(repo.language);
        });

        const formattedTechStack = [...techLanguages].map((tech) => ({
          name: tech,
          category: "Programming Language",
          image: `https://skillicons.dev/icons?i=${tech.toLowerCase()}`,
          description: `I use ${tech} for building applications, solving problems, and enhancing my development workflow.`,
          categoryColor: "blue",
        }));

        setTechStack(formattedTechStack);
      } catch (error) {
        console.error("Error fetching data:", error.response?.data || error.message);
      }
    };

    fetchGitHubData();
  }, [username]);

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-r from-green-200 to-green-300">
      <div className="rounded-lg p-8 max-w-2xl w-full mt-[7vh]">
        <h1 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
          Tech Stack
        </h1>
        <p className="text-center text-gray-600 mt-2">{summary}</p>

        <div className="flex justify-center items-center mt-6">
          <div className="border-t border-gray-700 w-1/4"></div>
          <div className="mx-4 text-gray-400">✦</div>
          <div className="border-t border-gray-700 w-1/4"></div>
        </div>

        {/* Tech Stack List */}
        <div className="mt-8">
          {techStack.length > 0 ? (
            techStack.map((tech, index) => (
              <div key={index} className="flex items-start mb-6 text-black">
                <div className="bg-gray-100 rounded-lg">
                  <Image
                    alt={`${tech.name} logo`}
                    className="w-45 h-35 rounded-md"
                    src={tech.image}
                    width={50}
                    height={50}
                    unoptimized
                  />
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold">
                    {tech.name}
                    <span className={`text-sm text-${tech.categoryColor}-600 bg-${tech.categoryColor}-100 px-2 py-1 rounded-full ml-2`}>
                      {tech.category}
                    </span>
                  </h3>
                  <p className="text-gray-600 mt-2">{tech.description}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No tech stack found.</p>
          )}
        </div>

        <div className="flex flex-col items-center mt-12">
          {/* <button className="bg-purple-600 text-white py-2 px-8 rounded-full text-lg hover:bg-purple-700 transition">
            NEXT
          </button> */}
          <footer className="mt-8 text-gray-400">@CodeRagnarok</footer>
        </div>
      </div>
    </div>
  );
}
