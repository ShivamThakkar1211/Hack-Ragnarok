'use client'
import { useEffect, useState } from 'react';
import { useSearchParams } from "next/navigation";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode, faFire, faTrophy } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

const Achievements = () => {
  const [leetcodeData, setLeetcodeData] = useState(null);
  const [githubData, setGithubData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const searchParams = useSearchParams();
  const githubUsername = searchParams.get("username");
  const leetcodeUsername = searchParams.get("leetcode");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // LeetCode data
        const leetcodeRes = await fetch(`https://leetcode-stats-api.herokuapp.com/${leetcodeUsername}`);
        if (!leetcodeRes.ok) throw new Error("Failed to fetch LeetCode data");
        const leetData = await leetcodeRes.json();

        // GitHub data
        const githubRes = await fetch(`https://api.github.com/users/${githubUsername}`);
        if (!githubRes.ok) throw new Error("Failed to fetch GitHub data");
        const gitData = await githubRes.json();

        // GitHub contributions
        let contributions = 0;
        const eventsRes = await fetch(`https://api.github.com/users/${githubUsername}/events`);
        if (eventsRes.ok) {
          const eventsData = await eventsRes.json();
          contributions = eventsData.filter(event => event.type === 'PushEvent').length;
        }

        setLeetcodeData({
          totalSolved: leetData.totalSolved,
          streak: leetData.currentStreak,
          hardSolved: leetData.hardSolved
        });

        setGithubData({
          publicRepos: gitData.public_repos,
          stars: gitData.public_gists,
          contributions,
          topLanguage: 'JavaScript'
        });

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (githubUsername && leetcodeUsername) fetchData();
    else {
      setError("Both GitHub and LeetCode usernames are required");
      setLoading(false);
    }
  }, [githubUsername, leetcodeUsername]);

  const getRangeWidth = (value, max) => `${Math.min((value / max) * 100, 100)}%`;

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-yellow-400">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-red-600 text-lg font-semibold">{error}</p>
      </div>
    );

  return (
    <div className="bg-gradient-to-br from-blue-900 via-blue-700 to-yellow-400 min-h-screen py-16 px-4 flex items-center justify-center">
      <div className="bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl max-w-5xl w-full p-8 md:p-12">
        <h1 className="text-4xl font-extrabold mb-2 text-center text-gray-800">
          Achievements
        </h1>
        <p className="text-center text-gray-500 mb-10">
          Your coding milestones and accomplishments 🚀
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* LeetCode Section */}
          <div className="bg-gradient-to-br from-yellow-100 to-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              <FontAwesomeIcon icon={faCode} className="text-yellow-500 mr-2" />
              LeetCode Achievements
            </h2>

            <div className="space-y-4">
              <div>
                <p className="text-gray-600">Solved {leetcodeData?.totalSolved || 0} problems</p>
                <div className="bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-500 h-3 rounded-full"
                    style={{ width: getRangeWidth(leetcodeData?.totalSolved || 0, 500) }}
                  ></div>
                </div>
              </div>

              <div>
                <p className="text-gray-600">{leetcodeData?.streak || 0} day streak</p>
                <div className="bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-orange-500 h-3 rounded-full"
                    style={{ width: getRangeWidth(leetcodeData?.streak || 0, 100) }}
                  ></div>
                </div>
              </div>

              <div>
                <p className="text-gray-600">Solved {leetcodeData?.hardSolved || 0} hard problems</p>
                <div className="bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-red-500 h-3 rounded-full"
                    style={{ width: getRangeWidth(leetcodeData?.hardSolved || 0, 50) }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* GitHub Section */}
          <div className="bg-gradient-to-br from-gray-100 to-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              <FontAwesomeIcon icon={faGithub} className="text-gray-700 mr-2" />
              GitHub Achievements
            </h2>

            <div className="space-y-4">
              <div>
                <p className="text-gray-600">{githubData?.contributions || 0} contributions</p>
                <div className="bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-700 h-3 rounded-full"
                    style={{ width: getRangeWidth(githubData?.contributions || 0, 1000) }}
                  ></div>
                </div>
              </div>

              <div>
                <p className="text-gray-600">Received {githubData?.stars || 0} stars</p>
                <div className="bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-yellow-500 h-3 rounded-full"
                    style={{ width: getRangeWidth(githubData?.stars || 0, 100) }}
                  ></div>
                </div>
              </div>

              <div>
                <p className="text-gray-600">Most used language: {githubData?.topLanguage || 'Unknown'}</p>
                <div className="bg-gray-200 rounded-full h-3">
                  <div className="bg-purple-500 h-3 rounded-full w-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-10">
          Built with ❤️ by LinkFolio
        </p>
      </div>
    </div>
  );
};

export default Achievements;
