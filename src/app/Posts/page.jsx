import React from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Timeline = () => {
  const events = [
    {
      date: "Jan 10, 2025",
      title: "Started a new job at XYZ Corp",
      description: "Excited to begin my journey as a software engineer!",
    },
    {
      date: "Feb 5, 2025",
      title: "Mastering TensorFlow",
      description:
        "TensorFlow is revolutionizing AI development, enabling seamless deep learning and neural network modeling—let's explore its power and potential! 🚀",
      tags: ["Twitter", "TensorFlow"],
      image:
        "https://storage.googleapis.com/a1aa/image/a7cuiQygZ6kxJpnjumaieHQ9LzfCDz3yp48nDKZnE6M.jpg",
    },
    {
      date: "Mar 15, 2025",
      title: "Published an article on AI Ethics",
      description: "Discussing the importance of responsible AI development.",
    },
  ];
  const timelineData = [
    {
      date: "Jan 30, 2025",
      tags: ["Twitter", "Deep Learning"],
      title: "Deep Learning: Unlocking the Future of AI🚀",
      description:
        "From self-driving cars to medical diagnostics, deep learning is transforming industries with its ability to mimic human intelligence—let's dive into its impact! 🔥",
      images: [
        "https://storage.googleapis.com/a1aa/image/jdC87O0FHW99nRHQq4QtZFdbpqZZ61wCtxGPikfMD_k.jpg",
        "https://storage.googleapis.com/a1aa/image/z262vTLsbosKhyC74AE6pU2AearYqyuLhGyepCCHKnI.jpg",
        "https://storage.googleapis.com/a1aa/image/qNqSzTFEecGxCpSMd6K6wFTmAraxHZKbDJH6PNPAdrk.jpg",
        "https://storage.googleapis.com/a1aa/image/2ZTL8kI4f886UcJdO54booCYitlCAR4f02RyzWWCt2w.jpg",
        "https://storage.googleapis.com/a1aa/image/CxiTvHn3XVQwKntL3hAQCYfk6VXxtPyzFRTojvKrP5g.jpg",
        "https://storage.googleapis.com/a1aa/image/k6ZdXgmZal5pwXguXpOq9k9aTXIDvEfvIy5jCmn2YgY.jpg",
      ],
      color: "bg-blue-500",
    },
    {
      date: "Jan 14, 2025",
      tags: ["CNN"],
      title: "Convolutional Neural Networks: Powering Vision in AI🔍",
      description:
        "CNNs are the backbone of modern computer vision, enabling machines to see and understand images like never before—let's explore their magic! 🚀",
      color: "bg-blue-500",
    },
    {
      date: "Jan 5, 2025",
      tags: ["Internship"],
      title: "DRDO Internship for Web Development",
      description:
        "CNNs are the backbone of modern computer vision, enabling machines to see and understand images like never before—let's explore their magic! 🚀",
      color: "bg-green-500",
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen font-roboto">
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mt-[8vh]">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-600">
            Recent Posts & Timeline
          </h1>
          <p className="mt-4 text-gray-600">
            A linear view of milestones and notable moments. Check other updates
            on Twitter or LinkedIn.
          </p>
          <div className="mt-6 flex justify-center space-x-4">
            <a
              className="px-4 py-2 bg-blue-500 text-white rounded-full flex items-center space-x-2"
              href="#"
            >
              <i className="fab fa-twitter"></i>
              <span>Twitter</span>
            </a>
            <a
              className="px-4 py-2 bg-indigo-500 text-white rounded-full flex items-center space-x-2"
              href="#"
            >
              <i className="fab fa-linkedin"></i>
              <span>LinkedIn</span>
            </a>
            <a
              className="px-4 py-2 bg-pink-500 text-white rounded-full flex items-center space-x-2"
              href="#"
            >
              <i className="fab fa-instagram"></i>
              <span>Instagram</span>
            </a>
          </div>
        </div>
        <div className="mt-12 space-y-8">
          {events.map((event, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className="text-gray-500 w-24 flex-shrink-0">
                {event.date}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">
                  {event.title}
                </h2>
                <p className="mt-2 text-gray-700">{event.description}</p>
                {event.tags && (
                  <div className="flex space-x-2 mt-2">
                    {event.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {event.image && (
                  <div className="mt-4">
                    <img
                      alt={event.title}
                      className="rounded-lg"
                      src={event.image}
                      width="400"
                      height="100"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto relative">
          <div className="absolute top-0 left-4 w-0.5 h-full bg-gray-200"></div>
          <div className="space-y-8">
            {timelineData.map((item, index) => (
              <div key={index} className="relative flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div
                    className={`h-2.5 w-2.5 rounded-full ${item.color} mt-1.5`}
                  ></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-gray-500">{item.date}</div>
                  <div className="mt-1 flex items-center space-x-2">
                    {item.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="mt-2 text-lg font-semibold text-gray-900">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-gray-700">{item.description}</p>
                  {item.images && (
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      {item.images.map((img, imgIndex) => (
                        <img
                          key={imgIndex}
                          src={img}
                          alt={`Image ${imgIndex + 1}`}
                          className="w-full h-24 object-cover rounded"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center mt-12">
        <button className="bg-purple-600 text-white py-2 px-8 rounded-full text-lg hover:bg-purple-700 transition">
          NEXT
        </button>

        <footer className="mt-8 text-gray-400">@CodeRagnarok</footer>
      </div>
    </div>
  );
};

export default Timeline;
