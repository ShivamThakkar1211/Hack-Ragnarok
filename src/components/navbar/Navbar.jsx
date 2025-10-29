'use client';
import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import {
  FaUser,
  FaStar,
  FaTrophy,
  FaGraduationCap,
  FaDownload,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import axios from "axios";

const NavbarWithSidebar = ({ children }) => {
  const searchParams = useSearchParams();
  const username = searchParams.get("username");
  const leetcode = searchParams.get("leetcode");
  const { data: session } = useSession();

  const [githubUser, setGithubUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // start hidden always

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

  const links = [
    { href: `/Intro`, label: "Intro", icon: <FaUser className="text-purple-400" /> },
    { href: `/Techstack`, label: "TechStack", icon: <FaStar className="text-yellow-400" /> },
    { href: `/Projects`, label: "Projects", icon: <FaTrophy className="text-blue-400" /> },
    { href: `/upload-ppt`, label: "PPT", icon: <FaTrophy className="text-blue-400" /> },
    { href: `/topThree`, label: "Top Projects", icon: <FaTrophy className="text-blue-400" /> },
    { href: `/Posts`, label: "Posts", icon: <FaGraduationCap className="text-green-400" /> },
    { href: `/resume-add`, label: "Add Resume", icon: <FaUser className="text-indigo-400" /> },
    { href: `/downloads`, label: "Download", icon: <FaDownload className="text-red-400" /> },
    { href: `/Enter-url`, label: "Username", icon: <FaUser className="text-indigo-400" /> },
  ];

  const fullLink = (href) =>
    `${href}?username=${username}${leetcode ? `&leetcode=${leetcode}` : ""}`;

  return (
    <>
      <Head>
        <title>LinkFolio</title>
        <meta name="description" content="Machine Learning Engineer Portfolio" />
      </Head>

      {/* TOP NAVBAR */}
      <div className="fixed top-0 left-0 right-0 bg-gray-900 text-white flex items-center justify-between px-4 py-3 z-50 shadow-md">
        <h1 className="text-lg font-bold">LinkFolio</h1>

        {/* Toggle button always visible */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="focus:outline-none"
        >
          {sidebarOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
        </button>
      </div>

      {/* SIDEBAR */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white p-5 z-40 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col items-center h-full pt-20 overflow-y-auto">
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
            {links.map((link, index) => (
              <Link key={index} href={fullLink(link.href)} passHref>
                <div
                  className="flex items-center space-x-3 hover:bg-gray-800 p-2 rounded-md cursor-pointer"
                  onClick={() => setSidebarOpen(false)} // auto-hide on click
                >
                  {link.icon}
                  <span>{link.label}</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-6 w-full">
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

      {/* MAIN CONTENT AREA */}
      <div
        className={`transition-all duration-300 bg-gray-100 min-h-screen p-6 pt-20 mt-[-100vh]  ${
          sidebarOpen ? "md:ml-64" : "md:ml-0  "
        }`}
      >
        {children}
      </div>
    </>
  );
};

export default NavbarWithSidebar;
