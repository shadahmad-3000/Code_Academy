import React, { useEffect } from 'react';
import { Trophy, Users, Target, Clock, Link as LinkIcon } from 'lucide-react';
import AdminNavbar from "@/components/Navbars/AdminNavbar.jsx";
import { useAuth } from "@/context/authContext.jsx";

// UI Components from Scratch
const Card = ({ children, className = '' }) => (
  <div className={`bg-gray-800 rounded-lg shadow-lg overflow-hidden ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-xl font-bold text-white ${className}`}>
    {children}
  </h3>
);

const ContestCard = ({
  title,
  platformName,
  startDate,
  endDate,
  link,
  description
}) => {
  // Helper function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('default', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate contest duration
  const calculateDuration = (start, end) => {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const durationMs = endTime - startTime;
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <Card className="w-full">
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <CardTitle>{title}</CardTitle>
            <p className="text-gray-400 mt-2">{platformName}</p>
            {description && (
              <p className="text-gray-300 mt-4 text-sm line-clamp-3">
                {description}
              </p>
            )}
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-gray-400" />
              <span className="text-gray-300">
                {formatDate(startDate)} - {formatDate(endDate)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Target size={16} className="text-gray-400" />
              <span className="text-gray-300">
                Duration: {calculateDuration(startDate, endDate)}
              </span>
            </div>
            {link && (
              <div className="flex items-center gap-2">
                <LinkIcon size={16} className="text-gray-400" />
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Access Contest
                </a>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const CodingContests = () => {
  const { contests, getContest, isAuthenticated, user, loading, error } = useAuth();
  useEffect(() => {
    if (isAuthenticated) {
      getContest();
    }
  }, [isAuthenticated]);
  return (
    <>
      <AdminNavbar nav="Coding Contests" />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-12 text-center relative">
          <div className="inline-block">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl blur transform scale-110" />
              <div className="relative bg-black p-4 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl">
                <Trophy size={40} className="text-white" />
              </div>
            </div>
          </div>
          <h1 className="mt-6 text-4xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 text-transparent bg-clip-text">
            Coding Contests
          </h1>
          <p className="mt-2 text-slate-400">
            Participate in competitive programming challenges
          </p>
        </div>

        <div className="space-y-6">

          {contests && contests.length > 0 ? (
            contests.map((contest, index) => (
              <ContestCard
                key={index}
                title={contest.title}
                platform={contest.platform}
                startDate={contest.startDate}
                endDate={contest.endDate}
                link={contest.link}
                description={contest.description}
              />
            ))
          ) : (
            <p>No contests available.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default CodingContests;