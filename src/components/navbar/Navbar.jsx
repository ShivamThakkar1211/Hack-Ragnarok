import React from "react";
import Head from "next/head";
import Link from "next/link";

const Navbar = () => {
  return (
    <>
      <Head>
        <title>LinkFolio</title>
        <meta
          name="description"
          content="Machine Learning Engineer Portfolio"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
        />
      </Head>
      <nav className=" fixed top-4 left-1/2 transform -translate-x-1/2 w-3xl backdrop-blur-lg bg-white/30 shadow-lg py-4 rounded-2xl">
        <div className="flex justify-between items-center px-6">
          <div className="text-2xl font-bold text-gray-800">
            <span className="text-purple-600">LINK</span>FOLIO
          </div>
          <div className="space-x-8 text-gray-600">
            <Link href="/" passHref>
              <span className="hover:text-purple-600 cursor-pointer">
                Intro
              </span>
            </Link>
            <Link href="/Techstack" passHref>
              <span className="hover:text-purple-600 cursor-pointer">
                TechStack
              </span>
            </Link>
            <Link href="/Projects" passHref>
              <span className="hover:text-purple-600 cursor-pointer">
                Projects
              </span>
            </Link>
            <Link href="/Posts" passHref>
              <span className="hover:text-purple-600 cursor-pointer">
                Posts
              </span>
            </Link>
            <Link href="/downloads" passHref>
              <span className="hover:text-purple-600 cursor-pointer">
                Download
              </span>
            </Link>
            <Link href="/downloads" passHref>
              <span className="hover:text-purple-600 cursor-pointer">
                Sign-in
              </span>
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
