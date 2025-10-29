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
          setError("Missing GitHub token.");
          return;
        }

        const headers = {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          "Content-Type": "application/json",
        };

        // Fetch user data
        const userResponse = await axios.get(
          `https://api.github.com/users/${username}`,
          { headers }
        );
        setUserData(userResponse.data);

        // Fetch repos
        const reposResponse = await axios.get(userResponse.data.repos_url, {
          headers,
        });

        if (reposResponse.data?.length) {
          const languages = new Set();

          reposResponse.data.forEach((repo) => {
            if (repo.language) languages.add(repo.language);
          });

          const formatted = [...languages].map((tech) => ({
            name: tech,
            category: "Programming Language",
            image: `https://skillicons.dev/icons?i=${tech.toLowerCase()}`,
            description: `I frequently use ${tech} in my projects.`,
            color: "blue",
          }));

          setTechStack(formatted);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch GitHub data. Please try again later.");
      }
    };

    fetchGitHubData();
  }, [username, GITHUB_TOKEN]);

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-red-500 text-lg font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 md:px-10 py-10 transition-all duration-300">
      <div className="w-full max-w-6xl bg-white/70 backdrop-blur-lg shadow-2xl rounded-2xl p-6 sm:p-10 mt-20 sm:mt-24">
        {/* --- GITHUB HEADER --- */}
        {userData && (
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-10 mb-10">
            <Image
              src={userData.avatar_url}
              alt={userData.name}
              width={100}
              height={100}
              className="rounded-full border-4 border-indigo-300 shadow-lg"
            />
            <div className="text-center sm:text-left">
              <h2 className="text-3xl font-bold text-gray-900">
                {userData.name}
              </h2>
              <p className="text-gray-600 mt-1">
                {userData.bio || "No bio available"}
              </p>

              <div className="flex flex-wrap gap-3 mt-3 text-sm text-gray-500 justify-center sm:justify-start">
                <span>👥 {userData.followers} followers</span>
                <span>⭐ {userData.public_repos} repos</span>
                {userData.location && <span>📍 {userData.location}</span>}
              </div>

              <div className="flex gap-3 mt-5 justify-center sm:justify-start">
                <a
                  href={userData.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
                >
                  🔗 GitHub Profile
                </a>
                {userData.blog && (
                  <a
                    href={
                      userData.blog.startsWith("http")
                        ? userData.blog
                        : `https://${userData.blog}`
                    }
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
        )}

        {/* --- GITHUB STATS --- */}
        {userData && (
          <div className="flex justify-center mb-12">
            <Image
              src={`https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&theme=radical`}
              alt="GitHub Stats"
              width={500}
              height={200}
              className="rounded-lg shadow-lg"
              unoptimized
            />
          </div>
        )}

        {/* --- TECH STACK HEADER --- */}
        <h1 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-pink-500 to-purple-500 mb-10">
          Tech Stack
        </h1>

        {/* --- TECH STACK GRID --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {techStack.length > 0 ? (
            techStack.map((tech, i) => (
              <div
                key={i}
                className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-5 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex-shrink-0">
                  <Image
                    src={tech.image}
                    alt={`${tech.name} logo`}
                    width={40}
                    height={40}
                    unoptimized
                    className="rounded-md"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    {tech.name}
                    <span
                      className={`text-xs bg-${tech.color}-100 text-${tech.color}-600 px-2 py-0.5 rounded-full`}
                    >
                      {tech.category}
                    </span>
                  </h3>
                  <p className="text-gray-500 mt-1 text-sm">{tech.description}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              No tech stack found.
            </p>
          )}
        </div>

        {/* --- FOOTER --- */}
        <footer className="mt-16 text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} <span className="font-medium">LinkFolio</span> · Crafted by <span className="text-indigo-500">@CodeRagnarok</span>
        </footer>
      </div>
    </div>
  );
}
