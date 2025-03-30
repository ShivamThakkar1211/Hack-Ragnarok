'use client'
import { useEffect, useState } from 'react';
import { useSearchParams } from "next/navigation";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode, faFire, faTrophy, faCheckCircle, faCodeBranch, faStar } from '@fortawesome/free-solid-svg-icons';
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

        // Fetch LeetCode data
        const leetcodeResponse = await fetch(`https://leetcode-stats-api.herokuapp.com/${leetcodeUsername}`);
        if (!leetcodeResponse.ok) throw new Error(`LeetCode API error: ${leetcodeResponse.status}`);
        const leetcodeData = await leetcodeResponse.json();

        // Fetch GitHub data
        const githubResponse = await fetch(`https://api.github.com/users/${githubUsername}`);
        if (!githubResponse.ok) throw new Error(`GitHub API error: ${githubResponse.status}`);
        const githubData = await githubResponse.json();

        // GitHub contributions
        let contributions = 0;
        const eventsResponse = await fetch(`https://api.github.com/users/${githubUsername}/events`);
        if (eventsResponse.ok) {
          const eventsData = await eventsResponse.json();
          contributions = eventsData.filter(event => event.type === 'PushEvent').length;
        }

        setLeetcodeData({
          totalSolved: leetcodeData.totalSolved,
          streak: leetcodeData.currentStreak,
          hardSolved: leetcodeData.hardSolved
        });

        setGithubData({
          publicRepos: githubData.public_repos,
          stars: githubData.public_gists, 
          contributions,
          topLanguage: 'JavaScript' 
        });

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (githubUsername && leetcodeUsername) {
      fetchData();
    } else {
      setError("Both GitHub and LeetCode usernames are required");
      setLoading(false);
    }
  }, [githubUsername, leetcodeUsername]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6 text-red-500">
        Error: {error}
      </div>
    );
  }

  const getRangeWidth = (value, max) => `${Math.min((value / max) * 100, 100)}%`;

  return (
    <div className="bg-gray-100 text-gray-800 min-h-screen ml-[20vh] mt-[-100vh]">
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-2">Achievements</h1>
        <p className="text-gray-600 mb-6">Your coding milestones and accomplishments</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LeetCode Achievements */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">
              <FontAwesomeIcon icon={faCode} className="text-yellow-500 mr-2" />
              LeetCode Achievements
            </h2>

            <div className="mb-4">
              <p className="text-gray-600">Solved {leetcodeData?.totalSolved || 0} problems</p>
              <div className="bg-gray-200 rounded-full h-4 w-full">
                <div 
                  className="bg-blue-500 h-4 rounded-full" 
                  style={{ width: getRangeWidth(leetcodeData?.totalSolved || 0, 500) }}
                ></div>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-gray-600">{leetcodeData?.streak || 0} day streak</p>
              <div className="bg-gray-200 rounded-full h-4 w-full">
                <div 
                  className="bg-orange-500 h-4 rounded-full" 
                  style={{ width: getRangeWidth(leetcodeData?.streak || 0, 100) }}
                ></div>
              </div>
            </div>

            <div>
              <p className="text-gray-600">Solved {leetcodeData?.hardSolved || 0} hard problems</p>
              <div className="bg-gray-200 rounded-full h-4 w-full">
                <div 
                  className="bg-red-500 h-4 rounded-full" 
                  style={{ width: getRangeWidth(leetcodeData?.hardSolved || 0, 50) }}
                ></div>
              </div>
            </div>
          </div>

          {/* GitHub Achievements */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">
              <FontAwesomeIcon icon={faGithub} className="text-yellow-500 mr-2" />
              GitHub Achievements
            </h2>

            <div className="mb-4">
              <p className="text-gray-600">{githubData?.contributions || 0} contributions</p>
              <div className="bg-gray-200 rounded-full h-4 w-full">
                <div 
                  className="bg-blue-700 h-4 rounded-full" 
                  style={{ width: getRangeWidth(githubData?.contributions || 0, 1000) }}
                ></div>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-gray-600">Received {githubData?.stars || 0} stars</p>
              <div className="bg-gray-200 rounded-full h-4 w-full">
                <div 
                  className="bg-yellow-500 h-4 rounded-full" 
                  style={{ width: getRangeWidth(githubData?.stars || 0, 100) }}
                ></div>
              </div>
            </div>

            <div>
              <p className="text-gray-600">Most used language: {githubData?.topLanguage || 'Unknown'}</p>
              <div className="bg-gray-200 rounded-full h-4 w-full">
                <div 
                  className="bg-purple-500 h-4 rounded-full" 
                  style={{ width: `100%` }} 
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Achievements;
