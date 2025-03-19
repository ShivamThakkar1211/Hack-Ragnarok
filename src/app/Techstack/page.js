"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useSearchParams } from "next/navigation";

export default function TechStack() {
  const [userData, setUserData] = useState(null);
  const [techStack, setTechStack] = useState([]);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const username = searchParams.get("username");

  const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

  useEffect(() => {
    if (!username) return;

    const fetchGitHubData = async () => {
      try {
        if (!GITHUB_TOKEN) {
          console.error("GitHub token is missing.");
          setError("Missing GitHub token.");
          return;
        }

        const headers = {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          "Content-Type": "application/json",
        };

        // Fetch GitHub user details
        const userResponse = await axios.get(`https://api.github.com/users/${username}`, {
          headers,
        });

        setUserData(userResponse.data);

        // Fetch repositories
        const reposResponse = await axios.get(userResponse.data.repos_url, { headers });

        if (reposResponse.data && reposResponse.data.length) {
          const techLanguages = new Set();

          reposResponse.data.forEach((repo) => {
            if (repo.language) {
              techLanguages.add(repo.language);
            }
          });

          const formattedTechStack = [...techLanguages].map((tech) => ({
            name: tech,
            category: "Programming Language",
            image: `https://skillicons.dev/icons?i=${tech.toLowerCase()}`,
            description: `I use ${tech} for building applications.`,
            categoryColor: "blue",
          }));

          setTechStack(formattedTechStack);
        }
      } catch (error) {
        console.error("Error fetching data:", error.response?.data || error.message);
        setError("Failed to fetch GitHub data. Please try again later.");
      }
    };

    fetchGitHubData();
  }, [username, GITHUB_TOKEN]);

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="rounded-lg p-8 max-w-3xl w-full shadow-md bg-white mt-28">
        
        {/* GitHub README-Style Summary Section */}
        {userData && (
          <div className="mb-8">
            <div className="flex items-center">
              <Image
                src={userData.avatar_url}
                alt={userData.name}
                width={100}
                height={100}
                className="rounded-full border-4 border-gray-300 shadow-lg"
              />
              <div className="ml-6">
                <h2 className="text-3xl font-bold text-gray-900">{userData.name}</h2>
                <p className="text-gray-600">{userData.bio || "No bio available"}</p>
                <div className="mt-2 text-sm text-gray-500">
                  <span>👥 {userData.followers} followers</span> ·
                  <span> ⭐ {userData.public_repos} repos</span> ·
                  <span> 📍 {userData.location || "Location not available"}</span>
                </div>
                <div className="flex gap-4 mt-4">
                  <a
                    href={userData.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                  >
                    🔗 GitHub Profile
                  </a>
                  {userData.blog && (
                    <a
                      href={userData.blog.startsWith("http") ? userData.blog : `https://${userData.blog}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition"
                    >
                      🌐 Website
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* GitHub Stats Badges */}
            <div className="flex justify-center mt-6">
              <img
                src={`https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&theme=radical`}
                alt="GitHub Stats"
                className="rounded-lg shadow-md"
              />
            </div>
          </div>
        )}

        {/* Tech Stack Section */}
        <h1 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
          Tech Stack
        </h1>

        <div className="flex justify-center items-center mt-6">
          <div className="border-t border-gray-700 w-1/4"></div>
          <div className="mx-4 text-gray-400">✦</div>
          <div className="border-t border-gray-700 w-1/4"></div>
        </div>

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
          <footer className="mt-8 text-gray-400">@CodeRagnarok</footer>
        </div>
      </div>
    </div>
  );
}
