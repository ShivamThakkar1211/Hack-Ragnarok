"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { FaGithub, FaMapMarkerAlt, FaUsers, FaTwitter, FaLinkedin } from "react-icons/fa";
import { Suspense } from "react";

export default function Home() {
  const [userData, setUserData] = useState(null);
  const [summary, setSummary] = useState(null);
  const [techStack, setTechStack] = useState([]);
  const [socialLinks, setSocialLinks] = useState({});
  const searchParams = useSearchParams();
  const username = searchParams.get("username");

  useEffect(() => {
    if (!username) return;

    console.log(`Fetching GitHub data for username: ${username}`);

    const fetchGitHubData = async () => {
      try {
        const userResponse = await axios.get(`https://api.github.com/users/${username}`);
        setUserData(userResponse.data);

        // Extract social links from bio if available
        const socialData = {
          github: userResponse.data.html_url,
          twitter: userResponse.data.twitter_username
            ? `https://twitter.com/${userResponse.data.twitter_username}`
            : null,
          linkedin: userResponse.data.blog?.includes("linkedin.com") ? userResponse.data.blog : null,
        };
        setSocialLinks(socialData);

        // Fetch README content
        const readmeResponse = await axios.get(
          `https://api.github.com/repos/${username}/${username}/readme`
        );

        if (readmeResponse.data.content) {
          const decodedContent = atob(readmeResponse.data.content);

          const summaryResponse = await axios.post(
            "https://api.together.ai/v1/chat/completions",
            {
              model: "meta-llama/Llama-3.3-70B-Instruct-Turbo", // Updated model
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
                Authorization: `Bearer 0e33b829155047d690aa9136a54aacd4805a7bac760f192e3c609aa2d2495c81`, // Replace with actual API key
                "Content-Type": "application/json",
              },
            }
          );

          setSummary(summaryResponse.data.choices[0]?.message?.content || "No summary available.");
        }

        // Fetch repositories for Tech Stack
        const reposResponse = await axios.get(userResponse.data.repos_url);
        const topLanguages = new Set();
        reposResponse.data.forEach((repo) => {
          if (repo.language) topLanguages.add(repo.language);
        });
        setTechStack([...topLanguages]);
      } catch (error) {
        console.error("Error fetching data:", error.response?.data || error.message);
      }
    };

    fetchGitHubData();
  }, [username]);

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center">
      <main className="flex-grow flex flex-col items-center mt-24 p-6 bg-white shadow-lg rounded-lg w-[90%] max-w-xl text-center">
        {userData ? (
          <>
            <Image
              src={userData.avatar_url}
              alt="GitHub Avatar"
              width={150}
              height={150}
              className="rounded-full shadow-md border-4 border-indigo-500"
            />
            <h1 className="text-3xl font-bold text-indigo-800 mt-4">{userData.name || "No Name Provided"}</h1>
            <p className="text-gray-600 text-sm mt-2">@{userData.login}</p>
            {userData.bio && <p className="text-gray-700 mt-4">{userData.bio}</p>}

            <div className="flex items-center justify-center space-x-6 mt-4 text-gray-700">
              {userData.location && (
                <p className="flex items-center space-x-2">
                  <FaMapMarkerAlt className="text-red-500" />
                  <span>{userData.location}</span>
                </p>
              )}
              <p className="flex items-center space-x-2">
                <FaUsers className="text-blue-500" />
                <span>{userData.followers} Followers</span>
              </p>
            </div>

            {/* Tech Stack */}
            {techStack.length > 0 && (
              <div className="mt-6 bg-gray-50 p-4 rounded shadow">
                <h2 className="text-lg font-semibold text-indigo-700">Tech Stack:</h2>
                <div className="flex flex-wrap justify-center gap-2 mt-2">
                  {techStack.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-indigo-200 text-indigo-800 text-sm rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Social Links */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-indigo-700">Social Links:</h2>
              <div className="flex justify-center space-x-4 mt-2">
                {socialLinks.github && (
                  <a
                    href={socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-black transition"
                  >
                    <FaGithub size={24} />
                  </a>
                )}
                {socialLinks.twitter && (
                  <a
                    href={socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 transition"
                  >
                    <FaTwitter size={24} />
                  </a>
                )}
                {socialLinks.linkedin && (
                  <a
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 hover:text-blue-900 transition"
                  >
                    <FaLinkedin size={24} />
                  </a>
                )}
              </div>
            </div>

            {/* README Summary */}
            {/* {summary && (
              <div className="mt-6 bg-gray-50 p-4 rounded shadow">
                <h2 className="text-lg font-semibold text-indigo-700">README Summary:</h2>
                <p className="text-gray-700 mt-2">{summary}</p>
              </div>
            )} */}
          </>
        ) : (
          <p className="text-gray-600 text-lg">Loading user details...</p>
        )}
      </main>
    </div>
  );
}
