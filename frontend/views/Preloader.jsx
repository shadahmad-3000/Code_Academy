import React from 'react';
import { Terminal } from 'lucide-react';

const Preloader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0A1E]">
      {/* Static background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/30 to-teal-900/30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,0),rgba(17,24,39,1))]" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float opacity-100"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 0.5}s`,
              animationDuration: `${Math.random() * 5 + 5}s`,
            }}
          >
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-full blur-xl transition-all duration-1000 hover:scale-110" />
          </div>
        ))}
      </div>

      {/* Loading content */}
      <div className="relative flex flex-col items-center opacity-100 animate-scale-up">
        {/* Glowing icon */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl blur transform scale-150 animate-pulse" />
          <div className="relative bg-black/50 p-6 rounded-2xl border border-white/10 backdrop-blur-xl transition-all duration-500 hover:scale-105 hover:rotate-3">
            <Terminal size={48} className="text-white animate-bounce" />
          </div>
        </div>

        {/* Loading text */}
        <div className="text-center relative">
          <h6 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 text-transparent bg-clip-text animate-pulse transition-all duration-700">
            INITIALIZING
          </h6>
          <div className="mt-4 flex items-center space-x-2">
            <p className="text-slate-400 font-semibold">One moment</p>
            <span className="inline-flex space-x-1">
              {[...Array(3)].map((_, i) => (
                <span
                  key={i}
                  className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </span>
          </div>
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
          100% { transform: translateY(0px) rotate(360deg); }
        }
        @keyframes scaleUp {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-float {
          animation: float 20s ease infinite;
        }
        .animate-scale-up {
          animation: scaleUp 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Preloader;