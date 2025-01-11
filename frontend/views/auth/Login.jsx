import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/authContext.jsx";
import { Terminal, Code2, Loader2, ChevronRight, Lock, Mail, UserPlus } from "lucide-react";

export default function Login() {
  const { signin, isAuthenticated } = useAuth();
  const [backendError, setBackendError] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "CodeAcademy Login";
    if (isAuthenticated) {
      navigate("/admin");
    }
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen relative bg-[#0A0A1E] overflow-y-auto">
      {/* Animated gradient background - Fixed position */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/30 to-teal-900/30 animate-gradient" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,0),rgba(17,24,39,1))]" />
      </div>

      {/* Floating elements - Fixed position */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`,
            }}
          >
            <div className="w-32 h-32 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-full blur-xl" />
          </div>
        ))}
      </div>

      {/* Main content with entrance animation */}
      <div className="relative min-h-screen py-12 px-4 flex items-center justify-center animate-fade-in-down">
      <div className="w-full max-w-md mx-auto relative">
          {/* Glowing accent elements */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-purple-500/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-cyan-500/30 rounded-full blur-3xl" />

          {/* Logo section with 3D effect */}
          <div className="mb-8 sm:mb-12 text-center relative">
            <div className="inline-block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl blur transform scale-110" />
                <div className="relative bg-black p-4 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl">
                  <Terminal size={40} className="text-white" />
                </div>
              </div>
            </div>
            <h1 className="mt-6 text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 text-transparent bg-clip-text px-4">
              A Step Towards Success
            </h1>
            <p className="mt-2 text-slate-400">Discover the Future of Students</p>
          </div>

          {/* Login card with glassmorphism effect */}
          <div className="relative mx-4">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-3xl blur-xl transform scale-105" />
            <div className="relative bg-black/40 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10">
              {backendError && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-6 backdrop-blur-xl">
                  <div className="flex items-center">
                    <Code2 size={20} className="mr-2 flex-shrink-0" />
                    <p className="text-sm">{backendError}</p>
                  </div>
                </div>
              )}

              <Formik
                initialValues={formData}
                enableReinitialize
                validationSchema={Yup.object({
                  email: Yup.string()
                    .required("Email is required"),
                  password: Yup.string().required("Password is required"),
                })}
                onSubmit={async (values, actions) => {
                  try {
                    await signin(values);
                    setFormData(values);
                    actions.resetForm();
                    actions.setSubmitting(false);
                    navigate("/dashboard");
                  } catch (error) {
                    console.log(error.message);
                    setBackendError(error.message);
                  }
                }}
              >
                {({ isSubmitting, handleSubmit }) => (
                  <Form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <div className="relative">
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Email
                        </label>
                        <div className="relative group">
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                            <Field
                              type="email"
                              className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                              placeholder="Enter your email..."
                              name="email"
                            />
                          </div>
                        </div>
                        <ErrorMessage
                          component="p"
                          name="email"
                          className="mt-1 text-sm text-red-400"
                        />
                      </div>

                      <div className="relative">
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Password
                        </label>
                        <div className="relative group">
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                            <Field
                              type="password"
                              className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                              placeholder="Enter your password..."
                              name="password"
                            />
                          </div>
                        </div>
                        <ErrorMessage
                          component="p"
                          name="password"
                          className="mt-1 text-sm text-red-400"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full relative group"
                    >
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt" />
                      <div className="relative flex items-center justify-center space-x-2 bg-black rounded-xl py-4 px-4 transition-all">
                        {isSubmitting ? (
                          <Loader2 className="animate-spin h-5 w-5 text-white" />
                        ) : (
                          <>
                            <span className="text-white font-semibold">Sign In</span>
                            <ChevronRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </div>
                    </button>

                    {/* Registration Call-to-Action */}
                    <Link 
                      to="/signup" 
                      className="w-full relative group block mt-6"
                    >
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-300" />
                      <div className="relative flex items-center justify-center space-x-2 bg-black/50 rounded-xl py-3 px-4 border border-white/10 backdrop-blur-sm transition-all group-hover:bg-black/80">
                        <UserPlus className="w-5 h-5 text-purple-400 group-hover:text-cyan-400 transition-colors flex-shrink-0" />
                        <span className="text-sm font-medium text-slate-300 group-hover:text-white text-center">
                          New here? Create your account!
                        </span>
                      </div>
                    </Link>
                  </Form>
                )}
              </Formik>
            </div>
          </div>

          {/* Footer with gradient text */}
          <p className="text-center mt-8 text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text font-medium px-4">
            CodeAcademy-IU Learning Platform © {new Date().getFullYear()}
          </p>
        </div>
      </div>

      {/* Add custom styles for animations */}
      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
          100% { transform: translateY(0px) rotate(360deg); }
        }
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-gradient {
          animation: gradient 15s ease infinite;
          background-size: 400% 400%;
        }
        .animate-float {
          animation: float 20s ease infinite;
        }
        .animate-fade-in-down {
          animation: fadeInDown 0.7s ease-out;
        }
        .animate-tilt {
          animation: tilt 10s infinite linear;
        }
      `}</style>
    </div>
  );
}