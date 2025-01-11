import React, { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/authContext.jsx";

import Sidebar from "@/components/Sidebar/Sidebar.jsx";
import { ME_LOCALHOST_KEY } from "@/config.js";
import img0 from "@/assets/img/uni-patron.png";

export default function Admin() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    async function fetchData() {
      const user = localStorage.getItem(ME_LOCALHOST_KEY);
      if (!user) {
        navigate("/");
      } else {
        setCurrentUser(JSON.parse(user));
      }
    }
    fetchData();
  }, [navigate]);

  useEffect(() => {
    document.title = "Admin Dashboard | CodeAcademy";
  }, []);

  useEffect(() => {
    if (!isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  return (
    <>
      <main className="relative overflow-hidden bg-[#0A0A1E] pt-0 min-h-screen">
        {/* Static background without animation */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/30 to-teal-900/30" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,0),rgba(17,24,39,1))]" />
        </div>

        {/* Floating elements without animation */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
            >
              <div className="w-32 h-32 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-full blur-xl" />
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="relative container mx-auto px-4 py-4 flex flex-col md:flex-row items-start justify-start">
          {/* Sidebar */}
          <div className="w-full md:w-1/4 mb-4 md:mb-0">
            <Sidebar />
          </div>

          {/* Outlet */}
          <div className="w-full md:w-3/4">
            <Outlet />
          </div>
        </div>
      </main>
    </>
  );
}
