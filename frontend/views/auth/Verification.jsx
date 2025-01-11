import React from "react";
import { Layout, Clock } from "lucide-react";
import AdminNavbar from "@/components/Navbars/AdminNavbar.jsx";
import Sidebar from "@/components/Sidebar/Sidebar.jsx";

export default function Verification() {
  return (
    <main className="relative overflow-hidden bg-[#0A0A1E] pt-0">
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
      <div className="relative container mx-auto px-4 py-4 flex flex-col items-start justify-start">
        {/* AdminNavbar */}
        <div className="w-full">
        <div className="md:hidden">
            <Sidebar />
          </div>
          <AdminNavbar nav="Verification" />

          {/* Verification Content */}
          <div className="mt-8 flex justify-center">
            <div className="w-full max-w-2xl">
              <div className="bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-teal-900/50 backdrop-blur-xl rounded-2xl shadow-2xl p-8">
                {/* Verification Header */}
                <div className="mb-12 text-center relative">
                  <div className="inline-block">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl blur transform scale-110" />
                      <div className="relative bg-black p-4 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl">
                        <Clock size={40} className="text-white animate-pulse" />
                      </div>
                    </div>
                  </div>
                  <h1 className="mt-6 text-4xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 text-transparent bg-clip-text">
                    Account Verification Pending
                  </h1>
                  <p className="mt-4 text-slate-400 text-lg">
                    Your account is currently awaiting system verification
                  </p>
                </div>

                {/* Verification Message */}
                <div className="space-y-6 text-center">
                  <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                    <p className="text-slate-300 leading-relaxed">
                      Thank you for registering! Your account is currently under review by our system administrators. This process helps us ensure the security and integrity of our platform.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-cyan-400 text-transparent bg-clip-text">
                      What happens next?
                    </h2>
                    <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-slate-400">
                      <ul className="space-y-2 text-left list-disc list-inside">
                        <li>Our team will review your registration details</li>
                        <li>After verification, you'll have access to the platform</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-8 text-slate-400 text-sm">
                    <p>Please note that this process typically takes 24-48 hours.</p>
                    <p className="mt-2">
                      If you have any urgent concerns, please contact Admin- Mrs.Roshan Ma'am.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}