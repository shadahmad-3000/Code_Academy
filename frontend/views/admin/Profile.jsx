import React from "react";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Lock, Key } from 'lucide-react';
import { useAuth } from "@/context/authContext.jsx";
import AdminNavbar from "@/components/Navbars/AdminNavbar.jsx";

const Input = ({ type, name, placeholder, icon: Icon, className }) => (
  <div className="relative">
    {Icon && (
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon size={16} className="text-gray-400" />
      </div>
    )}
    <input
      type={type}
      name={name}
      className={`block w-full ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2 border border-white/10 rounded-md bg-black/40 backdrop-blur-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 ${className}`}
      placeholder={placeholder}
    />
  </div>
);

const Button = ({ type, children, disabled }) => (
  <button
    type={type}
    disabled={disabled}
    className="px-6 py-2 w-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-md hover:opacity-90 transition-opacity"
  >
    {children}
  </button>
);

export default function Profile() {
  const { user: authUser, changePassword } = useAuth();

  const handlePasswordChange = async (values, actions) => {
    try {
      await changePassword({
        id: authUser.id,
        oldPassword: values.oldPassword,
        newPassword: values.newPassword
      });
      actions.resetForm();
      alert("Password changed successfully!");
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <>
      <AdminNavbar nav="User Management" />
      <div className="max-w-md mx-auto mt-10">
        <div className="bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-teal-900/50 backdrop-blur-xl rounded-2xl shadow-2xl">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 text-transparent bg-clip-text">
              Profile
            </h2>
            <p className="text-gray-400">Change Password</p>
          </div>
          <div className="p-6">
            <Formik
              initialValues={{
                oldPassword: "",
                newPassword: "",
                confirmPassword: "",
              }}
              validationSchema={Yup.object({
                oldPassword: Yup.string().required("Current password is required"),
                newPassword: Yup.string()
                  .min(6, "New password must be at least 6 characters")
                  .required("New password is required"),
                confirmPassword: Yup.string()
                  .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
                  .required("Please confirm your new password"),
              })}
              onSubmit={handlePasswordChange}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form className="space-y-6">
                  <div>
                    <Input
                      type="password"
                      name="oldPassword"
                      placeholder="Current Password"
                      icon={Lock}
                      className={touched.oldPassword && errors.oldPassword ? 'border-red-500' : ''}
                    />
                    <ErrorMessage
                      name="oldPassword"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <Input
                      type="password"
                      name="newPassword"
                      placeholder="New Password"
                      icon={Key}
                      className={touched.newPassword && errors.newPassword ? 'border-red-500' : ''}
                    />
                    <ErrorMessage
                      name="newPassword"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <Input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm New Password"
                      icon={Key}
                      className={touched.confirmPassword && errors.confirmPassword ? 'border-red-500' : ''}
                    />
                    <ErrorMessage
                      name="confirmPassword"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <Button type="submit" disabled={isSubmitting}>
                    Change Password
                  </Button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
}
