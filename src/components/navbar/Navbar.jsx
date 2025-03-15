'use client'
import React from "react";
import Head from "next/head";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const Navbar = () => {
  const searchParams = useSearchParams();
  const username = searchParams.get("username"); // Get username from URL

  return (
    <>
      <Head>
        <title>LinkFolio</title>
        <meta name="description" content="Machine Learning Engineer Portfolio" />
      </Head>
      <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 w-3xl backdrop-blur-lg bg-white/30 shadow-lg py-4 rounded-2xl">
        <div className="flex justify-between items-center px-6">
          <div className="text-2xl font-bold text-gray-800">
            <span className="text-purple-600">LINK</span>FOLIO
          </div>
          <div className="space-x-8 text-gray-600">
          <Link href={`/Intro?username=${username}`} passHref>
              <span className="hover:text-purple-600 cursor-pointer">Intro</span>
            </Link>
            <Link href={`/Techstack?username=${username}`} passHref>
              <span className="hover:text-purple-600 cursor-pointer">TechStack</span>
            </Link>
            <Link href={`/Projects?username=${username}`} passHref>
              <span className="hover:text-purple-600 cursor-pointer">Projects</span>
            </Link>
            <Link href={`/Posts?username=${username}`} passHref>
              <span className="hover:text-purple-600 cursor-pointer">Posts</span>
            </Link>
            <Link href={`/downloads?username=${username}`} passHref>
              <span className="hover:text-purple-600 cursor-pointer">Download</span>
            </Link>
            <Link href={`/Enter-url?username=${username}`} passHref>
              <span className="hover:text-purple-600 cursor-pointer">Username</span>
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
