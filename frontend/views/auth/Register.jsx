import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/authContext.jsx";
import { Terminal, Code2, Loader2, UserPlus, Lock, Mail, Eye, EyeOff, GraduationCap, LogIn } from "lucide-react";

export default function StudentRegister() {
  const { signup, isAuthenticated } = useAuth();
  const [backendError, setBackendError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "CodeAcademy Student Registration";
    if (isAuthenticated) {
      navigate("/student-dashboard");
    }
  }, [isAuthenticated]);

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    
    if (password.length >= 8) strength += 1;
    if (password.match(/[A-Z]/)) strength += 1;
    if (password.match(/[a-z]/)) strength += 1;
    if (password.match(/[0-9]/)) strength += 1;
    if (password.match(/[^A-Za-z0-9]/)) strength += 1;
    
    return strength;
  };

  const getStrengthLabel = (strength) => {
    switch (strength) {
      case 0: return { text: "Very Weak", color: "bg-red-500" };
      case 1: return { text: "Weak", color: "bg-orange-500" };
      case 2: return { text: "Fair", color: "bg-yellow-500" };
      case 3: return { text: "Good", color: "bg-blue-500" };
      case 4:
      case 5: return { text: "Excellent", color: "bg-green-500" };
      default: return { text: "", color: "" };
    }
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(/[A-Z]/, "Must contain at least one uppercase letter")
      .matches(/[a-z]/, "Must contain at least one lowercase letter")
      .matches(/[0-9]/, "Must contain at least one number")
      .matches(/[^A-Za-z0-9]/, "Must contain at least one special character")
      .test("password-strength", "Password must be at least 'Good'", 
        function(value) {
          return calculatePasswordStrength(value || '') >= 3;
        })
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Please confirm your password'),
  });

  const handlePasswordChange = (e, setFieldValue) => {
    const password = e.target.value;
    setFieldValue('password', password);
    setPasswordStrength(calculatePasswordStrength(password));
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0A0A1E] animate-fade-in-down">
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
      <div className="relative min-h-screen w-full overflow-hidden px-4 py-8 flex items-center justify-center">
        <div className="w-full max-w-md mx-auto relative">
          {/* Logo section */}
          <div className="mb-8 md:mb-12 text-center relative">
            <div className="inline-block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl blur transform scale-110" />
                <div className="relative bg-black p-4 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl">
                  <GraduationCap size={32} className="text-white md:w-10 md:h-10" />
                </div>
              </div>
            </div>
            <h1 className="mt-6 text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 text-transparent bg-clip-text">
              Student Registration
            </h1>
            <p className="mt-2 text-sm md:text-base text-slate-400">Begin your learning journey today</p>
          </div>

          {/* Registration card */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-3xl blur-xl transform scale-105" />
            <div className="relative bg-black/40 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-2xl border border-white/10">
              {backendError && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-6 backdrop-blur-xl">
                  <div className="flex items-center">
                    <Code2 size={20} className="mr-2" />
                    <p className="text-sm">{backendError}</p>
                  </div>
                </div>
              )}

              <Formik
                initialValues={{
                  email: "",
                  password: "",
                  confirmPassword: ""
                }}
                validationSchema={validationSchema}
                onSubmit={async (values, actions) => {
                  try {
                    await signup({ ...values, role: 'student' });
                    actions.resetForm();
                    navigate("/dashboard");
                  } catch (error) {
                    console.log(error.message);
                    setBackendError(error.message);
                  } finally {
                    actions.setSubmitting(false);
                  }
                }}
              >
                {({ isSubmitting, setFieldValue }) => (
                  <Form className="space-y-4 md:space-y-6">
                    <div className="space-y-4">
                      {/* Email Field */}
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Email Address
                        </label>
                        <div className="relative group">
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                            <Field
                              type="email"
                              name="email"
                              className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                              placeholder="Enter your email..."
                            />
                          </div>
                        </div>
                        <ErrorMessage
                          name="email"
                          component="p"
                          className="mt-1 text-sm text-red-400"
                        />
                      </div>

                      {/* Password Field */}
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Password
                        </label>
                        <div className="relative group">
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                            <Field
                              type={showPassword ? "text" : "password"}
                              name="password"
                              className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-12 py-3 text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                              placeholder="Create password..."
                              onChange={(e) => handlePasswordChange(e, setFieldValue)}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
                            >
                              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </div>
                        <ErrorMessage
                          name="password"
                          component="p"
                          className="mt-1 text-sm text-red-400"
                        />
                        
                        {/* Password Strength Meter */}
                        <div className="mt-2">
                          <div className="h-1 w-full bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${getStrengthLabel(passwordStrength).color} transition-all duration-300`}
                              style={{ width: `${(passwordStrength / 5) * 100}%` }}
                            />
                          </div>
                          <p className={`text-xs mt-1 ${getStrengthLabel(passwordStrength).color.replace('bg-', 'text-')}`}>
                            Strength: {getStrengthLabel(passwordStrength).text}
                          </p>
                        </div>
                      </div>

                      {/* Confirm Password Field */}
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Confirm Password
                        </label>
                        <div className="relative group">
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                            <Field
                              type={showConfirmPassword ? "text" : "password"}
                              name="confirmPassword"
                              className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-12 py-3 text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                              placeholder="Confirm password..."
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
                            >
                              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </div>
                        <ErrorMessage
                          name="confirmPassword"
                          component="p"
                          className="mt-1 text-sm text-red-400"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || passwordStrength < 3}
                      className="w-full relative group mt-6"
                    >
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt" />
                      <div className={`relative flex items-center justify-center space-x-2 rounded-xl py-3 px-4 transition-all ${passwordStrength >= 3 ? 'bg-black' : 'bg-gray-800'}`}>
                        {isSubmitting ? (
                          <Loader2 className="animate-spin h-5 w-5 text-white" />
                        ) : (
                          <>
                            <span className={`font-semibold ${passwordStrength >= 3 ? 'text-white' : 'text-gray-400'}`}>
                              Register as Student
                            </span>
                            <UserPlus className={`w-5 h-5 ${passwordStrength >= 3 ? 'text-white' : 'text-gray-400'} group-hover:translate-x-1 transition-transform`} />
                          </>
                        )}
                      </div>
                    </button>

                    <Link 
      to="/" 
      className="w-full relative group block mt-6"
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-300" />
      <div className="relative flex items-center justify-center space-x-2 bg-black/50 rounded-xl py-3 px-4 border border-white/10 backdrop-blur-sm transition-all group-hover:bg-black/80">
        <LogIn className="w-5 h-5 text-purple-400 group-hover:text-cyan-400 transition-colors flex-shrink-0" />
        <span className="text-sm font-medium text-slate-300 group-hover:text-white text-center">
          Already have an account? Sign in here!
        </span>
      </div>
    </Link>
                  </Form>
                )}
              </Formik>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center mt-6 md:mt-8 text-sm text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text font-medium">
            CodeAcademy Learning Platform © {new Date().getFullYear()}
          </p>
        </div>
      </div>
      <style jsx>{`
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
        .animate-fade-in-down {
          animation: fadeInDown 0.7s ease-out;
        }
      `}</style>
    </div>
  );
}