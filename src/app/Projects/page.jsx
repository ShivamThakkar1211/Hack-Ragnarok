'use client'
import React from "react";
import Head from "next/head";

const Projects = () => {
  return (
    <>
      <Head>
        <title>Projects</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <style jsx>{`
        body {
          font-family: "Roboto", sans-serif;
          background: linear-gradient(to right, #f8f9fa, #e0e7ff);
        }
      `}</style>

      <div className="flex flex-col items-center justify-center min-h-screen p-4 mt-[10vh]">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Projects
          </h1>
          <p className="mt-4 text-gray-600 w-full max-w-[600px] mx-auto">
            Over the course of the year, I spent a significant amount of time creating resources and
            tools for the community and many projects for brands.
          </p>
          <div className="mt-2 flex justify-center items-center">
            <span className="text-gray-400 mx-2">•</span>
            <span className="text-gray-400 mx-2">•</span>
            <span className="text-gray-400 mx-2">•</span>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-[1200px]">
          {/* Project 1 */}
          <div className="bg-white rounded-lg shadow-lg p-4 max-w-[350px] w-full">
            <div className="relative">
              <img
                alt="Analytics for E-commerce illustration"
                className="rounded-t-lg w-full h-auto object-cover"
                src="https://storage.googleapis.com/a1aa/image/ECgIrT7TOJpIfQc4nIGDubCAYRQoD3IkgyJbQjoc4cY.jpg"
              />
              <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                NEW
              </span>
            </div>
            <h2 className="mt-4 text-lg font-bold text-black">Analytics for E-commerce</h2>
            <p className="mt-2 text-gray-600">
              Developed a machine learning model to forecast product demand, optimizing inventory
              management.
            </p>
          </div>

          {/* Project 2 */}
          <div className="bg-white rounded-lg shadow-lg p-4 max-w-[350px] w-full">
            <div className="relative">
              <img
                alt="Customer Segmentation illustration"
                className="rounded-t-lg w-full h-auto object-cover"
                src="https://storage.googleapis.com/a1aa/image/Xv086LbRRT3RJymRCJv2qnbvFUHogWN6h0QStF_L7KM.jpg"
              />
            </div>
            <h2 className="mt-4 text-lg font-bold text-black">Customer Segmentation</h2>
            <p className="mt-2 text-gray-600">
              Implemented clustering algorithms to segment customers based on purchasing behavior.
            </p>
          </div>

          {/* Project 3 */}
          <div className="bg-white rounded-lg shadow-lg p-4 max-w-[350px] w-full">
            <div className="relative">
              <img
                alt="Sentiment Analysis illustration"
                className="rounded-t-lg w-full h-auto object-cover"
                src="https://storage.googleapis.com/a1aa/image/-ZnSXqsyfBbjXpjQB3qeCvNwA5m16k07d0rm275QqN4.jpg"
              />
              <span className="absolute top-2 left-2 bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded">
                UPDATE
              </span>
            </div>
            <h2 className="mt-4 text-lg font-bold text-black">Sentiment Analysis</h2>
            <p className="mt-2 text-gray-600">
              Developed a natural language processing (NLP) model to analyze public sentiment towards
              a brand.
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center mt-12">
            <button className="bg-purple-600 text-white py-2 px-8 rounded-full text-lg hover:bg-purple-700 transition">
              NEXT
            </button>

            <footer className="mt-8 text-gray-400">@CodeRagnarok</footer>
          </div>
      </div>
    </>
  );
};

export default Projects;
