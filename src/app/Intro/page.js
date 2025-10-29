"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import {
  FaGithub,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaCode,
  FaLink,
} from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";

export default function Home() {
  const [userData, setUserData] = useState(null);
  const [summary, setSummary] = useState(null);
  const [techStack, setTechStack] = useState([]);
  const [socialLinks, setSocialLinks] = useState({});
  const [reposCount, setReposCount] = useState(0);
  const [leetcodeData, setLeetcodeData] = useState(null);
  const [loading, setLoading] = useState({ github: false, leetcode: false });
  const [leetcodeError, setLeetcodeError] = useState(null);

  const searchParams = useSearchParams();
  const githubUsername = searchParams.get("username");
  const leetcodeUsername = searchParams.get("leetcode");
  const GITHUB_PAT = process.env.NEXT_PUBLIC_GITHUB_PAT;

  useEffect(() => {
    if (!githubUsername) return;

    const fetchData = async () => {
      setLoading((prev) => ({ ...prev, github: true }));

      try {
        const config = {
          headers: { Authorization: `Bearer ${GITHUB_PAT}` },
        };

        const userResponse = await axios.get(
          `https://api.github.com/users/${githubUsername}`,
          config
        );
        setUserData(userResponse.data);

        const socialData = {
          github: userResponse.data.html_url,
          twitter: userResponse.data.twitter_username
            ? `https://twitter.com/${userResponse.data.twitter_username}`
            : null,
          linkedin: userResponse.data.blog?.includes("linkedin.com")
            ? userResponse.data.blog
            : null,
        };
        setSocialLinks(socialData);

        // Fetch README summary
        try {
          const readmeResponse = await axios.get(
            `https://api.github.com/repos/${githubUsername}/${githubUsername}/readme`,
            config
          );

          if (readmeResponse.data.content) {
            const decodedContent = atob(readmeResponse.data.content);
            const summaryResponse = await axios.post(
              "https://api.together.ai/v1/chat/completions",
              {
                model: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
                messages: [
                  {
                    role: "user",
                    content: `Summarize this GitHub README in 5 sentences, highlighting key technologies used: \n\n ${decodedContent}`,
                  },
                ],
                max_tokens: 200,
              },
              {
                headers: {
                  Authorization: `Bearer f04b2b40610c552d0c201ad73784d82d7bca03d7ec52a47d57715a4a92ef98a8`,
                  "Content-Type": "application/json",
                },
              }
            );
            setSummary(
              summaryResponse.data.choices[0]?.message?.content ||
                "No summary available."
            );
          }
        } catch (readmeError) {
          console.warn("README not found or inaccessible:", readmeError.message);
        }

        // Fetch Repositories for Tech Stack
        const reposResponse = await axios.get(userResponse.data.repos_url, config);
        const topLanguages = new Set();
        reposResponse.data.forEach((repo) => {
          if (repo.language) topLanguages.add(repo.language);
        });
        setTechStack([...topLanguages]);
        setReposCount(reposResponse.data.length);
      } catch (error) {
        console.error("Error fetching GitHub data:", error.response?.data || error.message);
      } finally {
        setLoading((prev) => ({ ...prev, github: false }));
      }
    };

    fetchData();
  }, [githubUsername, GITHUB_PAT]);

  useEffect(() => {
    if (!leetcodeUsername) return;

    const fetchLeetCodeData = async () => {
      setLeetcodeError(null);
      setLoading((prev) => ({ ...prev, leetcode: true }));

      try {
        const response = await axios.get(
          `https://leetcode-stats-api.herokuapp.com/${leetcodeUsername}`
        );

        if (response.data.status === "success") {
          setLeetcodeData({
            totalSolved: response.data.totalSolved,
            easySolved: response.data.easySolved,
            mediumSolved: response.data.mediumSolved,
            hardSolved: response.data.hardSolved,
            acceptanceRate: response.data.acceptanceRate,
            ranking: response.data.ranking,
          });
        } else {
          setLeetcodeError("LeetCode user not found or data unavailable");
        }
      } catch (error) {
        console.error("Error fetching LeetCode data:", error);
        setLeetcodeError("Failed to fetch LeetCode data. Please check the username and try again.");
      } finally {
        setLoading((prev) => ({ ...prev, leetcode: false }));
      }
    };

    fetchLeetCodeData();
  }, [leetcodeUsername]);

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-start px-4 sm:px-6 lg:px-8 py-10 lg:py-20 ">
      <div className="w-full max-w-5xl bg-transparent mt-6 sm:mt-8 md:mt-10 lg:mt-4 xl:mt-0">
        <h1 className="text-3xl font-bold mb-2 text-black text-center sm:text-left">
          Personal Information
        </h1>
        <p className="text-gray-600 mb-6 text-center sm:text-left">
          {githubUsername && `GitHub: @${githubUsername}`}
          {leetcodeUsername && ` | LeetCode: @${leetcodeUsername}`}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Section */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-black">Profile</h2>
            <p className="text-gray-500 mb-4">Your developer profile</p>

            <div className="flex flex-col items-center text-center">
              {loading.github ? (
                <div className="animate-pulse">Loading GitHub profile...</div>
              ) : userData ? (
                <>
                  <Image
                    src={userData.avatar_url}
                    alt="Profile picture"
                    width={96}
                    height={96}
                    className="w-24 h-24 rounded-full mb-4"
                  />
                  <h3 className="text-lg font-semibold text-black">
                    {userData.name || githubUsername}
                  </h3>
                  <p className="text-gray-500">@{userData.login}</p>

                  <div className="flex justify-center space-x-4 mt-4">
                    {socialLinks.github && (
                      <a
                        href={socialLinks.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-800 hover:text-black"
                      >
                        <FaGithub size={24} />
                      </a>
                    )}
                    {leetcodeUsername && (
                      <a
                        href={`https://leetcode.com/${leetcodeUsername}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-800 hover:text-orange-500"
                      >
                        <SiLeetcode size={24} />
                      </a>
                    )}
                  </div>

                  <div className="flex justify-center sm:space-x-8 mt-4 flex-wrap gap-6 sm:gap-8">
                    <div className="text-center">
                      <p className="text-lg font-semibold text-black">
                        {userData.followers || 0}
                      </p>
                      <p className="text-black">Followers</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold text-black">
                        {userData.following || 0}
                      </p>
                      <p className="text-black">Following</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold text-black">{reposCount}</p>
                      <p className="text-black">Repos</p>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-gray-600">No GitHub data available</p>
              )}
            </div>
          </div>

          {/* Detailed Information Section */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-black">Detailed Information</h2>

            {userData && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 flex items-center text-black">
                  <FaGithub className="mr-2 text-black" />
                  GitHub Information
                </h3>

                {userData.location && (
                  <p className="text-gray-600 flex items-center mb-2">
                    <FaMapMarkerAlt className="mr-2 text-red-500" />
                    {userData.location}
                  </p>
                )}

                {userData.blog && (
                  <p className="text-orange-500 mb-2 break-words">
                    <FaLink className="inline mr-2" />
                    <a href={userData.blog} target="_blank" rel="noopener noreferrer">
                      {userData.blog}
                    </a>
                  </p>
                )}

                <p className="text-gray-600 mb-2">
                  {userData.followers} followers · {userData.following} following
                </p>

                <p className="text-gray-600 flex items-center">
                  <FaCalendarAlt className="mr-2" />
                  Joined{" "}
                  {new Date(userData.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                  })}
                </p>

                {userData.bio && (
                  <div className="mt-4 bg-gray-50 p-4 rounded">
                    <h4 className="font-semibold mb-2">Bio</h4>
                    <p className="text-gray-700">{userData.bio}</p>
                  </div>
                )}
              </div>
            )}

            {techStack.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 flex items-center text-black">
                  <FaCode className="mr-2" />
                  Tech Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {techStack.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {leetcodeUsername && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2 flex items-center text-black">
                  <SiLeetcode className="mr-2 text-orange-500" />
                  LeetCode Information
                </h3>

                {loading.leetcode ? (
                  <div className="animate-pulse">Loading LeetCode data...</div>
                ) : leetcodeError ? (
                  <div className="text-red-500 p-3 bg-red-50 rounded">{leetcodeError}</div>
                ) : leetcodeData ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gray-100 p-4 rounded-lg text-center">
                      <p className="text-blue-500 text-2xl font-semibold">
                        {leetcodeData.totalSolved}
                      </p>
                      <p className="text-gray-700">Problems Solved</p>
                      <p className="text-green-500 text-sm mt-1">
                        Easy: {leetcodeData.easySolved} · Medium: {leetcodeData.mediumSolved} · Hard:{" "}
                        {leetcodeData.hardSolved}
                      </p>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg text-center">
                      <p className="text-blue-500 text-2xl font-semibold">
                        #{leetcodeData.ranking}
                      </p>
                      <p className="text-gray-700">Ranking</p>
                      <p className="text-gray-700 text-sm mt-1">
                        Acceptance Rate: {leetcodeData.acceptanceRate}%
                      </p>
                    </div>
                    <a
                      href={`https://leetcode.com/${leetcodeUsername}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="col-span-1 sm:col-span-2 text-center text-blue-500 hover:underline mt-2"
                    >
                      View full LeetCode profile
                    </a>
                  </div>
                ) : (
                  <p className="text-gray-600">No LeetCode data available</p>
                )}
              </div>
            )}
          </div>
        </div>

        {summary && (
          <div className="mt-6 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-black">
              User Profile Summary
            </h2>
            <p className="text-gray-700 whitespace-pre-line">{summary}</p>
          </div>
        )}
      </div>
    </div>
  );
}
