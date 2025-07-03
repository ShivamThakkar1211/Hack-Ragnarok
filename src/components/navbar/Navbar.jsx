'use client';
import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { FaUser, FaStar, FaTrophy, FaGraduationCap, FaDownload } from "react-icons/fa";
import axios from "axios";

const NavbarWithSidebar = ({ children }) => {
  const searchParams = useSearchParams();
  const username = searchParams.get("username");
  const leetcode = searchParams.get("leetcode");
  const { data: session } = useSession();
  const [githubUser, setGithubUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!username) return;

    const fetchGitHubUser = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`https://api.github.com/users/${username}`);
        setGithubUser(response.data);
      } catch (error) {
        console.error("Error fetching GitHub user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubUser();
  }, [username]);

  return (
    <>
      <Head>
        <title>LinkFolio</title>
        <meta name="description" content="Machine Learning Engineer Portfolio" />
      </Head>

      {/* Fixed Sidebar on top of everything */}
      <div className="fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white p-5 z-50">
        <div className="flex flex-col items-center h-full">
          {loading ? (
            <div className="w-20 h-20 bg-gray-700 rounded-full mb-4 animate-pulse"></div>
          ) : githubUser ? (
            <>
              <div className="w-20 h-20 relative mb-4">
                <Image
                  src={githubUser.avatar_url}
                  alt="Profile picture"
                  width={80}
                  height={80}
                  className="rounded-full"
                  priority
                />
              </div>
              <h2 className="text-xl font-bold text-center">
                {githubUser.name || githubUser.login}
              </h2>
              <p className="text-gray-400 mb-8">@{githubUser.login}</p>
            </>
          ) : (
            <>
              <div className="w-20 h-20 bg-blue-500 rounded-full mb-4"></div>
              <h2 className="text-xl font-bold">GitHub User</h2>
              <p className="text-gray-400 mb-8">@{username}</p>
            </>
          )}

          <button className="w-full py-2 bg-yellow-500 text-white rounded-lg font-bold hover:bg-yellow-600 transition mb-8">
            Personal Information
          </button>

          <div className="flex-grow space-y-4 w-full">
            <Link href={`/Intro?username=${username}${leetcode ? `&leetcode=${leetcode}` : ''}`} passHref>
              <div className="flex items-center space-x-3 hover:bg-gray-800 p-2 rounded-md cursor-pointer">
                <FaUser className="text-purple-400" />
                <span>Intro</span>
              </div>
            </Link>

            <Link href={`/Techstack?username=${username}${leetcode ? `&leetcode=${leetcode}` : ''}`} passHref>
              <div className="flex items-center space-x-3 hover:bg-gray-800 p-2 rounded-md cursor-pointer">
                <FaStar className="text-yellow-400" />
                <span>TechStack</span>
              </div>
            </Link>

            <Link href={`/Projects?username=${username}${leetcode ? `&leetcode=${leetcode}` : ''}`} passHref>
              <div className="flex items-center space-x-3 hover:bg-gray-800 p-2 rounded-md cursor-pointer">
                <FaTrophy className="text-blue-400" />
                <span>Projects</span>
              </div>
            </Link>
            <Link href={`/upload-ppt?username=${username}${leetcode ? `&leetcode=${leetcode}` : ''}`} passHref>
              <div className="flex items-center space-x-3 hover:bg-gray-800 p-2 rounded-md cursor-pointer">
                <FaTrophy className="text-blue-400" />
                <span>PPT</span>
              </div>
            </Link>
            <Link href={`/topThree?username=${username}${leetcode ? `&leetcode=${leetcode}` : ''}`} passHref>
              <div className="flex items-center space-x-3 hover:bg-gray-800 p-2 rounded-md cursor-pointer">
                <FaTrophy className="text-blue-400" />
                <span>Top Projects </span>
              </div>
            </Link>

            <Link href={`/Posts?username=${username}${leetcode ? `&leetcode=${leetcode}` : ''}`} passHref>
              <div className="flex items-center space-x-3 hover:bg-gray-800 p-2 rounded-md cursor-pointer">
                <FaGraduationCap className="text-green-400" />
                <span>Posts</span>
              </div>
            </Link>
            <Link href={`/resume-add?username=${username}${leetcode ? `&leetcode=${leetcode}` : ''}`} passHref>
              <div className="flex items-center space-x-3 hover:bg-gray-800 p-2 rounded-md cursor-pointer">
                <FaUser className="text-indigo-400" />
                <span>Add resume</span>
              </div>
            </Link>

            <Link href={`/downloads?username=${username}${leetcode ? `&leetcode=${leetcode}` : ''}`} passHref>
              <div className="flex items-center space-x-3 hover:bg-gray-800 p-2 rounded-md cursor-pointer">
                <FaDownload className="text-red-400" />
                <span>Download</span>
              </div>
            </Link>

            <Link href={`/Enter-url?username=${username}${leetcode ? `&leetcode=${leetcode}` : ''}`} passHref>
              <div className="flex items-center space-x-3 hover:bg-gray-800 p-2 rounded-md cursor-pointer">
                <FaUser className="text-indigo-400" />
                <span>Username</span>
              </div>
            </Link>
          </div>

          <div className="mt-auto w-full">
            {session ? (
              <button
                onClick={() => signOut()}
                className="w-full py-2 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => signIn("google")}
                className="w-full py-2 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition"
              >
                Login with Google
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area with offset for fixed sidebar */}
      <div className="ml-64">
        <div className="bg-gray-100 p-6 min-h-screen">
          {children}
        </div>
      </div>
    </>
  );
};

export default NavbarWithSidebar;
