"use client";

import Image from "next/image";
import { Roboto } from "next/font/google";
import Navbar from "@/components/navbar/Navbar";
import { FaTwitter, FaLinkedin, FaMedium } from "react-icons/fa"; // Importing social icons

const roboto = Roboto({ weight: ["400", "500", "700"], subsets: ["latin"] });

export default function Home() {
  return (
    <div
      className={`bg-gradient-to-r from-purple-300 via-pink-300 to-yellow-300 min-h-screen flex flex-col items-center ${roboto.className}`}
    >
      <main className="flex-grow flex flex-col items-center mt-[20vh]">
        <Image
          src="https://storage.googleapis.com/a1aa/image/-jLv7SAEvYxbu2PX-14b2CaEQzoSOiWLw37KLFfeblc.jpg"
          alt="Portrait of a person"
          width={200}
          height={150}
          className="rounded-lg shadow-md"
        />
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-900 to-purple-400 bg-clip-text text-transparent mt-6">
          Introduction
        </h1>
        <p className="text-center text-gray-900 mt-4 px-4 max-w-xl">
          Hi, I'm Riya Singh, a Machine Learning Engineer with a strong
          background in developing and deploying data-driven solutions. I have a
          passion for leveraging artificial intelligence to solve complex
          problems and enhance user experiences.
        </p>
        {/* Social Media Links */}
        <div className="flex space-x-4 mt-6">
          <a
            className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-blue-600 transition"
            href="#"
          >
            <FaTwitter className="text-xl" /> {/* Twitter Icon */}
            <span>Twitter</span>
          </a>

          <a
            className="flex items-center space-x-2 bg-blue-700 text-white px-4 py-2 rounded-full shadow-md hover:bg-blue-800 transition"
            href="#"
          >
            <FaLinkedin className="text-xl" /> {/* LinkedIn Icon */}
            <span>LinkedIn</span>
          </a>

          <a
            className="flex items-center space-x-2 bg-pink-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-pink-600 transition"
            href="#"
          >
            <FaMedium className="text-xl" /> {/* Medium Icon */}
            <span>Medium</span>
          </a>
        </div>
        <div className=" space-y-8 mt-16 px-35 py-12 bg-opacity-80  w-full max-w-3xl">
          {/* Work Experience */}
          <div>
            <h2 className="text-xl font-semibold text-black">
              Work Experience
            </h2>
            <p className="text-gray-600 text-justify ">
              I have worked on machine learning models for predictive analytics,
              sentiment analysis, recommendation systems, and computer vision.
            </p>
          </div>

          {/* Leadership & Community Involvement */}
          <div>
            <h2 className="text-xl font-semibold text-black">
              Leadership & Community Involvement
            </h2>
            <p className="text-gray-600 text-justify">
              As an Assistant Co-Organizer at GDG Cloud Chandigarh, I actively
              contribute to the Google Developer Community.
            </p>
          </div>

          {/* Professional Experience */}
          <div>
            <h2 className="text-xl font-semibold text-black">
              Professional Experience
            </h2>
            <p className="text-gray-600 text-justify">
              I have had the privilege of working on cutting-edge research and
              technology through my internships at DRDO and NCUE, Taiwan.
            </p>
          </div>

          {/* Next Button */}
          {/* Next Button and Footer Centered */}
          <div className="flex flex-col items-center mt-12">
            <button className="bg-purple-600 text-white py-2 px-8 rounded-full text-lg hover:bg-purple-700 transition">
              NEXT
            </button>

            <footer className="mt-8 text-gray-400">@CodeRagnarok</footer>
          </div>
        </div>
      </main>
    </div>
  );
}
