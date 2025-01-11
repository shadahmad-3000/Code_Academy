import React, { useState, useEffect } from 'react';
import { Clipboard, Calendar, ExternalLink } from 'lucide-react';
import AdminNavbar from "@/components/Navbars/AdminNavbar.jsx";
import { useAuth } from "@/context/authContext.jsx";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Function to find links in text and convert them to clickable links
const parseDescription = (description) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return description.split(urlRegex).map((part, index) => 
    urlRegex.test(part) ? (
      <a 
        key={index} 
        href={part} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-blue-600 hover:underline inline-flex items-center"
      >
        {part}
        <ExternalLink size={12} className="ml-1" />
      </a>
    ) : part
  );
};

const AssignmentCard = ({
  title,
  description,
  course,
  dueDate,
  onDelete,
  _id
}) => {
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    setShowScrollTop(scrollTop > 100);
  };

  const scrollToTop = (e) => {
    e.currentTarget.closest('.description-scroll-container').scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 dark:border-gray-700 relative"
      >
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Assignment Details Column */}
            <div className="lg:col-span-3" onClick={() => setShowDescriptionModal(true)}>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white cursor-pointer">{title}</h3>
              <div className="mt-2 text-gray-500 dark:text-gray-400 text-sm">{course}</div>
              
              {/* Due Date */}
              <div className="flex items-center gap-2 mt-3">
                <Calendar size={16} className="text-gray-400 dark:text-gray-500" />
                <span className="text-gray-500 dark:text-gray-400 text-sm">
                  {formatDate(dueDate)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description Modal */}
      {showDescriptionModal && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowDescriptionModal(false)}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h3>
                  <div className="text-gray-500 dark:text-gray-400">{course}</div>
                </div>
                <button 
                  onClick={() => setShowDescriptionModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-white"
                >
                  ✕
                </button>
              </div>
              <div className="flex items-center gap-2 mt-2 text-gray-500 dark:text-gray-400">
                <Calendar size={16} />
                <span>{formatDate(dueDate)}</span>
              </div>
            </div>

            <div 
              className="description-scroll-container overflow-y-auto max-h-[60vh] relative p-6"
              onScroll={handleScroll}
            >
              <div className="text-gray-600 dark:text-gray-300 space-y-4">
                <p>{parseDescription(description)}</p>
              </div>

              {showScrollTop && (
                <button 
                  onClick={scrollToTop}
                  className="fixed bottom-10 right-10 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
                  aria-label="Scroll to Top"
                >
                  <ArrowUp size={24} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const Assignments = () => {
  const { fetchAssignmentByCourse, currentAssignment, isAuthenticated, user, loading, error } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchAssignmentByCourse(user._id);
    }
  }, [isAuthenticated]);

  const handleAssignmentSubmit = (file) => {
    console.log('Submitted file:', file);
    // Add logic to handle assignment submission
  };

  return (
    <>
      <AdminNavbar nav="Assignments" />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-12 text-center relative">
          <div className="inline-block">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl blur transform scale-110" />
              <div className="relative bg-black p-4 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl">
                <Clipboard size={40} className="text-white" />
              </div>
            </div>
          </div>
          <h1 className="mt-6 text-4xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 text-transparent bg-clip-text">
            Assignments
          </h1>
          <p className="mt-2 text-slate-400">
            View and Submit Course Assignments
          </p>
        </div>

        <div className="space-y-6">
          {currentAssignment?.assignments && currentAssignment?.assignments?.length > 0 ? (
            currentAssignment?.assignments?.map((assignment, index) => (
              <AssignmentCard
                key={index}
                title={assignment.title}
                description={assignment.description}
                dueDate={assignment.dueDate}
              />
            ))
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p>No assignments available</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Assignments;