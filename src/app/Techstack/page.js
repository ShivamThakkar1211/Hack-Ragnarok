import React from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function TechStack() {
  const techStacks = [
    {
      name: "Python",
      category: "Machine Learning",
      image:
        "https://storage.googleapis.com/a1aa/image/yYBfY3tu0NGhz_s2kDNcX5xo6Muh1a1SmLB3PQBhlb4.jpg",
      description:
        "Python is my go-to language for building machine learning models, data preprocessing, and automation tasks.",
      categoryColor: "purple",
    },
    {
      name: "TensorFlow",
      category: "Deep Learning",
      image:
        "https://storage.googleapis.com/a1aa/image/_n12P2X_xzbQuVdH0S1dCYVkPAE-Vna6uTPVA1WzLJo.jpg",
      description:
        "I use TensorFlow for training and deploying deep learning models for tasks like image recognition and NLP.",
      categoryColor: "pink",
    },
    {
      name: "MongoDB",
      category: "Database",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg",
      description:
        "MongoDB is my preferred NoSQL database for building scalable and flexible applications.",
      categoryColor: "green",
    },
    {
      name: "OpenAI",
      category: "AI/ML",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg",
      description:
        "I use OpenAI APIs for generative AI tasks like text generation, chatbots, and automation.",
      categoryColor: "blue",
    },
    {
      name: "React",
      category: "Frontend Framework",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
      description:
        "React is my go-to frontend library for building interactive and dynamic user interfaces.",
      categoryColor: "cyan",
    },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-r from-green-200 to-green-300">
      <div className="rounded-lg p-8 max-w-2xl w-full mt-[7vh]">
        <h1 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
          Tech Stack
        </h1>
        <p className="text-center text-gray-600 mt-2">
          Sharing my on-the-go tech stack from working, managing, coding and
          more
        </p>

        <div className="flex justify-center items-center mt-6">
          <div className="border-t border-gray-700 w-1/4"></div>
          <div className="mx-4 text-gray-400">✦</div>
          <div className="border-t border-gray-700 w-1/4"></div>
        </div>

        {/* Toggle Buttons */}
        <div className="flex justify-center items-center mt-4">
          <button className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-gray-600 mr-2">
            <i className="fas fa-th"></i>
          </button>
          <button className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white">
            <i className="fas fa-list"></i>
          </button>
        </div>

        <h2 className="text-center text-gray-400 mt-8 tracking-widest">
          LANGUAGES AND FRAMEWORKS
        </h2>

        {/* Tech Stack List */}
        <div className="mt-8">
          {techStacks.map((tech, index) => (
            <div key={index} className="flex items-start mb-6 text-black">
              <div className=" bg-gray-100 rounded-lg">
                <img
                  alt={`${tech.name} logo`}
                  className="w-45 h-35 rounded-md"
                  src={tech.image}
                />
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-semibold">
                  {tech.name}
                  <span
                    className={`text-sm text-${tech.categoryColor}-600 bg-${tech.categoryColor}-100 px-2 py-1 rounded-full ml-2`}
                  >
                    {tech.category}
                  </span>
                </h3>
                <p className="text-gray-600 mt-2">{tech.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center mt-12">
          <button className="bg-purple-600 text-white py-2 px-8 rounded-full text-lg hover:bg-purple-700 transition">
            NEXT
          </button>

          <footer className="mt-8 text-gray-400">@CodeRagnarok</footer>
        </div>
      </div>
    </div>
  );
}
