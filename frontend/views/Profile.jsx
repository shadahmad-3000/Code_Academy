import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
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
  const { editUserProfile, user } = useAuth();

  const validationSchema = Yup.object({
    email: Yup.string().required('Email is required'),
    identification: Yup.string().required('Identification is required'),
    name: Yup.string().required('Name is required'),
    lastname: Yup.string().required('Lastname is required'),
    birth_date: Yup.string().required('Birth date is required'),
    sgpi: Yup.string(),
    cgpi: Yup.string(),
    year: Yup.string(),
    course: Yup.string(),
    phone: Yup.string().required('Phone is required'),
    country: Yup.string().required('Country is required'),
    state: Yup.string().required('State is required'),
    address: Yup.string().required('Address is required'),
  });

  return (
    <>
      <AdminNavbar nav="User Management" />
      <div className="mx-auto mt-10">
        <div className="bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-teal-900/50 backdrop-blur-xl rounded-2xl shadow-2xl">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 text-transparent bg-clip-text">
              Profile
            </h2>
            <p className="text-gray-400">Update Profile</p>
          </div>
          <div className="p-6">
            <Formik
              initialValues={{
                email: user.email || '',
                identification: user.identification || '',
                name: user.name || '',
                lastname: user.lastname || '',
                birth_date: user.birth_date || '',
                sgpi: user.sgpi || '',
                cgpi: user.cgpi || '',
                year: user.year || '',
                course: user.course || '',
                phone: user.phone || '',
                country: user.country || '',
                state: user.state || '',
                address: user.address || '',
              }}
              validationSchema={validationSchema}
              onSubmit={async (values, actions) => {
                try {
                  await editUserProfile(values, user._id);
                  actions.setSubmitting(false);
                } catch (error) {
                  console.error('Error updating user:', error);
                  actions.setSubmitting(false);
                }
              }}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Personal Information */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Email</label>
                      <Field
                        type="text"
                        name="email"
                        className="block w-full px-3 py-2 border border-white/10 rounded-md bg-black/40 text-white"
                      />
                      <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Enrollment Number</label>
                      <Field
                        type="text"
                        name="identification"
                        className="block w-full px-3 py-2 border border-white/10 rounded-md bg-black/40 text-white"
                      />
                      <ErrorMessage name="identification" component="div" className="text-red-500 text-sm" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Name</label>
                      <Field
                        type="text"
                        name="name"
                        className="block w-full px-3 py-2 border border-white/10 rounded-md bg-black/40 text-white"
                      />
                      <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Lastname</label>
                      <Field
                        type="text"
                        name="lastname"
                        className="block w-full px-3 py-2 border border-white/10 rounded-md bg-black/40 text-white"
                      />
                      <ErrorMessage name="lastname" component="div" className="text-red-500 text-sm" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Birth Date</label>
                      <Field
                        type="date"
                        name="birth_date"
                        className="block w-full px-3 py-2 border border-white/10 rounded-md bg-black/40 text-white"
                      />
                      <ErrorMessage name="birth_date" component="div" className="text-red-500 text-sm" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Phone</label>
                      <Field
                        type="tel"
                        name="phone"
                        className="block w-full px-3 py-2 border border-white/10 rounded-md bg-black/40 text-white"
                      />
                      <ErrorMessage name="phone" component="div" className="text-red-500 text-sm" />
                    </div>

                    {/* Location Information */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Country</label>
                      <Field
                        type="text"
                        name="country"
                        className="block w-full px-3 py-2 border border-white/10 rounded-md bg-black/40 text-white"
                      />
                      <ErrorMessage name="country" component="div" className="text-red-500 text-sm" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">State</label>
                      <Field
                        type="text"
                        name="state"
                        className="block w-full px-3 py-2 border border-white/10 rounded-md bg-black/40 text-white"
                      />
                      <ErrorMessage name="state" component="div" className="text-red-500 text-sm" />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-gray-300">Address</label>
                      <Field
                        type="text"
                        name="address"
                        className="block w-full px-3 py-2 border border-white/10 rounded-md bg-black/40 text-white"
                      />
                      <ErrorMessage name="address" component="div" className="text-red-500 text-sm" />
                    </div>

                    {/* Academic Information */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">SGPI</label>
                      <Field
                        type="text"
                        name="sgpi"
                        className="block w-full px-3 py-2 border border-white/10 rounded-md bg-black/40 text-white"
                      />
                      <ErrorMessage name="sgpi" component="div" className="text-red-500 text-sm" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">CGPI</label>
                      <Field
                        type="text"
                        name="cgpi"
                        className="block w-full px-3 py-2 border border-white/10 rounded-md bg-black/40 text-white"
                      />
                      <ErrorMessage name="cgpi" component="div" className="text-red-500 text-sm" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Year</label>
                      <Field
                        type="text"
                        name="year"
                        className="block w-full px-3 py-2 border border-white/10 rounded-md bg-black/40 text-white"
                      />
                      <ErrorMessage name="year" component="div" className="text-red-500 text-sm" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Course</label>
                      <Field
                        as="select"
                        name="course"
                        className={`block w-full px-3 py-2 border border-white/10 rounded-md bg-black/40 text-white`}
                      >
                        <option value="">Select a course</option>
                        <option value="B.TECH">B.TECH</option>
                        <option value="M.TECH">M.TECH</option>
                        <option value="BCA">BCA</option>
                        <option value="MCA">MCA</option>
                      </Field>
                      <ErrorMessage name="course" component="div" className="text-red-500 text-sm" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {isSubmitting ? 'Updating...' : 'Update User'}
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
