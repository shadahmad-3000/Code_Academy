import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Lock, Key, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from "@/context/authContext.jsx";
import AdminNavbar from "@/components/Navbars/AdminNavbar.jsx";

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

export default function Account() {
  const { user, changePassword } = useAuth();
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handlePasswordChange = async (values, actions) => {
    try {
      await changePassword({
        _id: user._id,
        oldPassword: values.oldPassword,
        newPassword: values.newPassword
      });
      actions.resetForm();
      setPasswordStrength(0);
    } catch (error) {
      console.error("Password change failed", error);
    }
  };

  const handleNewPasswordInput = (e, setFieldValue) => {
    const password = e.target.value;
    setFieldValue('newPassword', password);
    setPasswordStrength(calculatePasswordStrength(password));
  };

  return (
    <>
      <AdminNavbar nav="Account" />
      <div className="mx-auto mt-10">
        <div className="bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-teal-900/50 backdrop-blur-xl rounded-2xl shadow-2xl">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-center text-2xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 text-transparent bg-clip-text">
              Account Config
            </h2>
            <p className="text-gray-400 text-center">Change Password</p>
          </div>
          <div className="max-w-md mx-auto p-6">
            <Formik
              initialValues={{
                oldPassword: "",
                newPassword: "",
                confirmPassword: "",
              }}
              validationSchema={Yup.object({
                oldPassword: Yup.string().required("Current password is required"),
                newPassword: Yup.string()
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
                  .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
                  .required("Please confirm your new password"),
              })}
              onSubmit={handlePasswordChange}
            >
              {({ isSubmitting, errors, touched, setFieldValue }) => (
                <Form className="space-y-6">
                  {/* Current Password Field */}
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Current Password</label>
                    <div className="relative group">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                        <Field
                          type={showOldPassword ? "text" : "password"}
                          name="oldPassword"
                          className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-12 py-3 text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                          placeholder="Current password..."
                        />
                        <button
                          type="button"
                          onClick={() => setShowOldPassword(!showOldPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
                        >
                          {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                    <ErrorMessage
                      name="oldPassword"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* New Password Field */}
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
                          name="newPassword"
                          className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-12 py-3 text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                          placeholder="Create password..."
                          onChange={(e) => handleNewPasswordInput(e, setFieldValue)}
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
                      name="newPassword"
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

                  {/* Submit Button */}
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
                            Change Password
                          </span>
                          <Lock className={`w-5 h-5 ${passwordStrength >= 3 ? 'text-white' : 'text-gray-400'} group-hover:translate-x-1 transition-transform`} />
                        </>
                      )}
                    </div>
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
}