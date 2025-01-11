import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authContext.jsx";
import Sidebar from "@/components/Sidebar/Sidebar.jsx";
import { ME_LOCALHOST_KEY } from "@/config.js";
import {
  Terminal,
  Layout,
  Users,
  CalendarPlus,
  ListTodo,
  Settings,
  Shield,
  MessageSquare,
  BookOpen,
  Code,
  GraduationCap,
  ClipboardCheck,
  FolderKanban,
  BookMarked,
  FileCheck,
  BriefcaseBusiness,
  FileDigit
} from "lucide-react";
import AdminNavbar from "@/components/Navbars/AdminNavbar.jsx";

const MenuCard = ({ icon: Icon, title, description, to, gradient }) => {
  const navigate = useNavigate();

  return (
    <div onClick={() => navigate(to)} className="relative group cursor-pointer">
      <div
        className={`absolute -inset-0.5 ${gradient} rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200`}
      />
      <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10 transition-all duration-300 group-hover:translate-y-[-2px]">
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 text-transparent bg-clip-text">
              {title}
            </h3>
            <p className="text-slate-400 text-sm mt-1">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(undefined);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const user = localStorage.getItem(ME_LOCALHOST_KEY);
      if (!user) {
        navigate("/");
      } else {
        setCurrentUser(JSON.parse(user));
      }
      // Add a slight delay to enable smooth loading transition
      setTimeout(() => setIsLoaded(true), 100);
    }
    fetchData();
  }, [navigate]);

  useEffect(() => {
    if (!isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  return (
    <>
      <main 
        className={`relative overflow-hidden bg-[#0A0A1E] pt-0 transition-all duration-1000 ease-in-out ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Static background without animation */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/30 to-teal-900/30 transition-all duration-1000" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,0),rgba(17,24,39,1))] transition-all duration-1000" />
        </div>

        {/* Floating elements with smoother animation */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute transition-all duration-[5000ms] ease-in-out"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: isLoaded ? 1 : 0,
                transform: isLoaded ? 'scale(1)' : 'scale(0.5)',
              }}
            >
              <div className="w-32 h-32 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-full blur-xl" />
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="relative container mx-auto px-4 py-4 flex flex-col md:flex-row items-start justify-start">
          {/* Sidebar */}
          <div className="w-full md:w-1/4 mb-4 md:mb-0 md:hidden">
            <Sidebar />
          </div>
          <div className="w-full">
            <AdminNavbar nav="Dashboard" />

            <div className={`
              container mx-auto mt-4 px-4 py-8 
              bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-teal-900/50 
              backdrop-blur-xl rounded-2xl shadow-2xl
              transition-all duration-1000 ease-in-out
              ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
            `}>
              {/* Dashboard Header */}
              <div className="mb-12 text-center relative">
                <div className="inline-block">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl blur transform scale-110" />
                    <div className="relative bg-black p-4 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl">
                      <Layout size={40} className="text-white" />
                    </div>
                  </div>
                </div>
                <h1 className="mt-6 text-4xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 text-transparent bg-clip-text">
                  Welcome to Dashboard
                </h1>
                <p className="mt-2 text-slate-400">
                  Manage your academic activities and resources
                </p>
              </div>

              {/* Control Panel Sections */}
              <div className="space-y-12">
                {/* Student Access Section - Role 1 */}
                {currentUser && currentUser.roles.some((role) => role.name === "1") && (
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 text-transparent bg-clip-text mb-6">
                      Student Resources
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <MenuCard
                        icon={ClipboardCheck}
                        title="Assignments"
                        description="View and submit course assignments"
                        to="/student/assignments"
                        gradient="bg-gradient-to-r from-blue-600 to-indigo-600"
                      />
                      <MenuCard
                        icon={Code}
                        title="Coding Contests"
                        description="Access coding competition platforms"
                        to="/student/contests"
                        gradient="bg-gradient-to-r from-yellow-600 to-orange-600"
                      />
                      <MenuCard
                        icon={BriefcaseBusiness}
                        title="Opportunity"
                        description="Opt for job opportunities"
                        to="/student/opportunities"
                        gradient="bg-gradient-to-r from-violet-600 to-purple-600"
                      />
                    </div>
                  </div>
                )}

                {/* Teacher Access Section - Role 2 */}
                {currentUser && currentUser.roles.some((role) => role.name === "2") && (
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 text-transparent bg-clip-text mb-6">
                      Teacher Controls
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <MenuCard
                        icon={ClipboardCheck}
                        title="Assignments"
                        description="Create and grade assignments"
                        to="/teacher/assignments"
                        gradient="bg-gradient-to-r from-green-600 to-teal-600"
                      />
                    </div>
                  </div>
                )}

                {/* Administration Area - Role 3 */}
                {currentUser && currentUser.roles.some((role) => role.name === "3") && (
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 text-transparent bg-clip-text mb-6">
                      Administration
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <MenuCard
                        icon={Users}
                        title="User Management"
                        description="Manage users, roles and enrollments"
                        to="/admin/users"
                        gradient="bg-gradient-to-r from-red-600 to-pink-600"
                      />
                      <MenuCard
                        icon={Code}
                        title="Contest Management"
                        description="Manage coding contest platform links"
                        to="/admin/contests"
                        gradient="bg-gradient-to-r from-purple-600 to-blue-600"
                      />
                      <MenuCard
                        icon={BriefcaseBusiness}
                        title="Opportunity Administration"
                        description="Managing opportunities"
                        to="/admin/opportunities"
                        gradient="bg-gradient-to-r from-cyan-600 to-teal-600"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}