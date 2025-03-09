export default function DownloadShare() {
    return (
      <div className=" bg-gradient-to-r from-blue-100 to-pink-100 font-roboto flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-yellow-500 mt-[11vh]">
            Download and <span className="text-pink-500">Share</span>
          </h1>
          <p className="text-gray-600 mt-2">
            Share the amazing portfolio by LinkFolio via link or downloading the slides and sharing them as a slideshow.
          </p>
          <div className="flex items-center justify-center mt-4">
            <hr className="w-16 border-t border-gray-300" />
            <i className="fas fa-ellipsis-h mx-2 text-gray-400"></i>
            <hr className="w-16 border-t border-gray-300" />
          </div>
          <div className="flex justify-center mt-4">
            <button className="bg-pink-200 text-pink-600 font-semibold py-2 px-4 rounded-full flex items-center">
              <i className="fab fa-github mr-2"></i>
              Github
            </button>
          </div>
        </div>
        <div className="mt-8">
          <img
            alt="A close-up of a keyboard with red and orange lights, with a bold red banner in the center that says 'LET'S DRAW ATTENTION!' and '@CODERAGNAROK' at the bottom right"
            className="rounded-lg shadow-lg"
            height="200"
            src="https://storage.googleapis.com/a1aa/image/n5pPH_k2VtGCIQx7zBwBRe8rw4UskOXieY8tkeF7MoE.jpg"
            width="350"
          />
        </div>
        <div className="flex flex-col items-center mt-12">
            <button className="bg-purple-600 text-white py-2 px-8 rounded-full text-lg hover:bg-purple-700 transition">
              Download
            </button>

            <footer className="mt-8 text-gray-400">@CodeRagnarok</footer>
          </div>
      </div>
    );
  }
  