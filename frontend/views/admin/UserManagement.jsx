import React, { useState, useEffect } from 'react';
import {
  X, User, Search, Mail, UserPlus, Shield, Settings, Loader2
} from 'lucide-react';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import AdminNavbar from "@/components/Navbars/AdminNavbar.jsx";

import { useAuth } from "@/context/authContext.jsx";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-[600px] bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-lg shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>
        {children}
      </div>
    </div>
  );
};

const EditUserModal = ({ isOpen, onClose, user }) => {
  if (!isOpen) return null;

  const { editUserProfile } = useAuth();

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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-[600px] bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-lg shadow-xl overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>
        <div className="p-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 text-transparent bg-clip-text mb-6">
            Edit User
          </h2>

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
                onClose();
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
                    <label className="text-sm font-medium text-gray-300">Enrollment</label>
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
                    <label className="text-sm font-medium text-gray-300">CGPI</label>
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
                <button
                  type="button"
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 w-32 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

const VerificationModal = ({ isOpen, onClose, user }) => {
  if (!isOpen) return null;

  const { verifiedId } = useAuth();

  const handleVerification = async () => {
    try {
      await verifiedId(user._id);
      onClose();
    } catch (error) {
      console.error('Error updating verification status:', error);
    }
  };

  const actionText = user.verified === "Verified" ? "Unverify" : "Verify";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-[600px] bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-lg shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>

        <div className="p-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 text-transparent bg-clip-text mb-6">
            User Verification
          </h2>

          <p className="text-gray-300 mb-6">
            Are you sure you want to {actionText.toLowerCase()} user: {user.name}?
          </p>

          <div className="flex gap-4">
            <button
              onClick={handleVerification}
              className={`flex items-center justify-center gap-2 w-32 px-4 py-2 
                text-white rounded-md font-medium transition-colors duration-200
                ${user.verified === "Verified"
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-blue-500 hover:bg-blue-600"
                }`}
            >
              {actionText}
            </button>
            <button
              onClick={onClose}
              className="flex items-center justify-center gap-2 w-32 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md font-medium transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


const StudentIdInput = ({ value, onChange }) => {
  const [inputValue, setInputValue] = useState('');
  const [studentIds, setStudentIds] = useState([]);


  const validateAndParseIds = (text) => {
    return text.split(',')
      .map(id => id.trim())
      .filter(id => {
        // Only allow digits and maximum 15 characters
        return /^\d{1,15}$/.test(id);
      });
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // If the input includes commas, process it immediately
    if (newValue.includes(',')) {
      const ids = validateAndParseIds(newValue);
      // Merge new valid IDs with existing ones
      const newIds = [...new Set([...value, ...ids])]; // Remove duplicates
      onChange(newIds);
      setInputValue('');
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const ids = validateAndParseIds(pastedText);
    // Merge new valid IDs with existing ones
    const newIds = [...new Set([...value, ...ids])]; // Remove duplicates
    onChange(newIds);
    setInputValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const ids = validateAndParseIds(inputValue);
      const newIds = [...new Set([...value, ...ids])]; // Remove duplicates
      onChange(newIds);
      setInputValue('');
    }
  };

  const removeId = (idToRemove) => {
    onChange(value.filter(id => id !== idToRemove));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 p-2 border border-white/10 rounded-md bg-black/40 backdrop-blur-xl max-h-32 overflow-y-auto">
        {value.map((id, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-purple-600/30 border border-purple-500/50 rounded-full flex items-center gap-2 text-sm"
          >
            {id}
            <button
              type="button"
              onClick={() => removeId(id)}
              className="text-purple-300 hover:text-white"
            >
              <X size={14} />
            </button>
          </span>
        ))}
      </div>
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          name="userIds"
          placeholder="Enter or paste student IDs (comma-separated)"
          className="block w-full px-3 py-2 border border-white/10 rounded-md bg-black/40 backdrop-blur-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <div className="absolute right-2 top-2 text-xs text-gray-400">
          {value.length} IDs
        </div>
      </div>
      <p className="text-sm text-gray-400">
        Numeric IDs up to 15 digits, separated by commas. You can paste multiple IDs at once.
      </p>
    </div>
  );
};

const BulkVerificationModal = ({ isOpen, onClose, onBulkVerify }) => {
  if (!isOpen) return null;

  const { bulkVerified } = useAuth();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-[600px] bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-lg shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>
        <div className="p-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 text-transparent bg-clip-text mb-6">
            Bulk Verification
          </h2>

          <Formik
            initialValues={{ studentIds: [] }}
            validationSchema={Yup.object({
              studentIds: Yup.array()
                .min(1, 'At least one ID is required')
                .of(Yup.string().matches(/^\d{1,15}$/, 'Invalid ID format'))
            })}
            onSubmit={async (values, actions) => {
              try {
                await bulkVerified(values);
                actions.setSubmitting(false);
                onClose();
              } catch (error) {
                console.error('Error in bulk verification:', error);
                actions.setSubmitting(false);
              }
            }}
          >
            {({ values, setFieldValue, isSubmitting }) => (
              <Form className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">User IDs</label>
                  <StudentIdInput
                    value={values.studentIds}
                    onChange={(newIds) => setFieldValue('studentIds', newIds)}
                  />
                  <ErrorMessage name="studentIds" component="div" className="text-red-500 text-sm" />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || values.studentIds.length === 0}
                  className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isSubmitting ? 'Verifying...' : 'Verify Users'}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

const ModalCreateUser = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    lastname: "",
    roles: "",
    userId: null,
  });

  const { createNewAdmin, user } = useAuth();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-[600px] bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-lg shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>
        <div className="p-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 text-transparent bg-clip-text mb-6">
            Create User
          </h2>

          <Formik
            initialValues={formData}
            enableReinitialize
            validationSchema={Yup.object({
              email: Yup.string().required("Email is required."),
              name: Yup.string().required("The name is required."),
              lastname: Yup.string().required("Last name is required."),
              roles: Yup.string().required("The role is required."),
            })}
            onSubmit={async (values, actions) => {
              try {
                values.userId = user._id;
                await createNewAdmin(values);
                actions.resetForm();
                actions.setSubmitting(false);
                onClose(); // Close the modal after a successful submission
              } catch (error) {
                console.error("Error creating admin:", error);
                actions.setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting, handleSubmit }) => (
              <Form>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User size={16} className="text-gray-400" />
                      </div>
                      <Field
                        type="text"
                        name="name"
                        autoComplete="off"
                        placeholder="John"
                        className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-md bg-black/40 backdrop-blur-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <ErrorMessage
                      component="p"
                      name="name"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Lastname</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User size={16} className="text-gray-400" />
                      </div>
                      <Field
                        type="text"
                        name="lastname"
                        autoComplete="off"
                        placeholder="Doe"
                        className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-md bg-black/40 backdrop-blur-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <ErrorMessage
                      component="p"
                      name="lastname"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Email</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail size={16} className="text-gray-400" />
                      </div>
                      <Field
                        type="email"
                        name="email"
                        autoComplete="off"
                        placeholder="john@example.com"
                        className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-md bg-black/40 backdrop-blur-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <ErrorMessage
                      component="p"
                      name="email"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Role</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Shield size={16} className="text-gray-400" />
                      </div>
                      <Field
                        as="select"
                        name="roles"
                        autoComplete="off"
                        className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-md bg-black/40 backdrop-blur-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">Select a role</option>
                        <option value="1">Student</option>
                        <option value="2">Teacher</option>
                        <option value="3">Admin</option>
                      </Field>
                    </div>
                    <ErrorMessage
                      component="p"
                      name="roles"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader2 className="animate-spin mx-auto h-5 w-5" />
                    ) : (
                      "Add User"
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

const UserManagement = () => {
  const {
    isAuthenticated,
    createNewAdmin,
    allAdmins,
    getAllAdmins,
    verifiedId,
  } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');

  const filteredAdmins = allAdmins.filter((user) => {
    if (!user) return false;

    const searchLower = searchTerm.toLowerCase();

    return (
      (user.name && user.name.toLowerCase().includes(searchLower)) ||
      (user.email && user.email.toLowerCase().includes(searchLower)) ||
      (user.roleNumbers &&
        (Array.isArray(user.roleNumbers)
          ? user.roleNumbers.some(role =>
            role && role.toLowerCase().includes(searchLower)
          )
          : user.roleNumbers.toLowerCase().includes(searchLower))
      ) ||
      (user.verified && user.verified.toLowerCase().includes(searchLower))
    );
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [activeTab, setActiveTab] = useState('single');
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.xlsx')) {
      setSelectedFile(file);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      getAllAdmins();
    }
  }, [isAuthenticated]);

  // In your UserManagement component, add these new state variables at the top:
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isModalCreateUser, setIsModalCreateUser] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [isBulkVerificationModalOpen, setIsBulkVerificationModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Add these handler functions:
  const handleUpdateUser = async (userId, userData) => {
    try {
      // Add your API call here
      console.log('Updating user:', userId, userData);
      // await updateUser(userId, userData);
      // Refresh user list after update
      await getAllAdmins();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleBulkVerify = async (userIds) => {
    try {
      // Add your API call here
      console.log('Bulk verifying users:', userIds);
      // await bulkVerifyUsers(userIds);
      // Refresh user list after bulk verification
      await getAllAdmins();
    } catch (error) {
      console.error('Error in bulk verification:', error);
    }
  };

  return (
    <>
      <AdminNavbar nav="User Management" />
      <main className="relative overflow-hidden">

        {/* Main Content */}
        <div className="relative container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-12 text-center relative">
            <div className="inline-block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl blur transform scale-110" />
                <div className="relative bg-black p-4 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl">
                  <User size={40} className="text-white" />
                </div>
              </div>
            </div>
            <h1 className="mt-6 text-4xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 text-transparent bg-clip-text">
              User Management
            </h1>
            <p className="mt-2 text-slate-400">
              Manage users, roles, and permissions
            </p>
          </div>

          {/* Control Panel */}
          <div className="container mx-auto mt-4 px-4 py-8 bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-teal-900/50 backdrop-blur-xl rounded-2xl shadow-2xl">
            {/* Search and Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-md bg-black/40 backdrop-blur-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Search users by name, email, role, or status..."
                />
              </div>
              <button
                type="button"
                onClick={() => setIsModalCreateUser(true)}
                className="flex items-center justify-center gap-2 w-32 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-medium transition-colors duration-200 disabled:opacity-50"
              >
                Add User
              </button>
              <button
                type="button"
                onClick={() => setIsBulkVerificationModalOpen(true)}
                className="flex items-center justify-center gap-2 w-32 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-medium transition-colors duration-200 disabled:opacity-50"
              >
                Bulk Verify
              </button>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-6 py-3 text-sm font-semibold text-gray-300">Name</th>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-300">Email</th>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-300">Role</th>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-300">Status</th>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAdmins.map((userAdmin) => (
                    <tr key={userAdmin.id} className="border-b border-white/10 hover:bg-white/5">
                      <td className="px-6 py-4 text-sm text-white">{userAdmin.name}</td>
                      <td className="px-6 py-4 text-sm text-white">{userAdmin.email}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex flex-wrap gap-2">
                          {Array.isArray(userAdmin.roleNumbers) ? (
                            userAdmin.roleNumbers.map((role, index) => (
                              <span
                                key={index}
                                className={`px-3 py-1 rounded-full text-xs ${role === 'admin' ? 'bg-purple-500/20 text-purple-300' :
                                  role === 'teacher' ? 'bg-cyan-500/20 text-cyan-300' :
                                    role === 'student' ? 'bg-green-500/20 text-green-300' :
                                      'bg-gray-500/20 text-gray-300'
                                  }`}
                              >
                                {role}
                              </span>
                            ))
                          ) : (
                            <span
                              className={`px-3 py-1 rounded-full text-xs ${userAdmin.roleNumbers === 'admin' ? 'bg-purple-500/20 text-purple-300' :
                                userAdmin.roleNumbers === 'teacher' ? 'bg-cyan-500/20 text-cyan-300' :
                                  userAdmin.roleNumbers === 'student' ? 'bg-green-500/20 text-green-300' :
                                    'bg-gray-500/20 text-gray-300'
                                }`}
                            >
                              {userAdmin.roleNumbers}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${userAdmin.verified === 'Verified' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                          {userAdmin.verified}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2">
                          <button
                            className="p-1 hover:bg-white/10 rounded"
                            onClick={() => {
                              setSelectedUser(userAdmin);
                              setIsEditModalOpen(true);
                            }}
                          >
                            <Settings size={16} className="text-gray-400" />
                          </button>
                          <button
                            className="p-1 hover:bg-white/10 rounded"
                            onClick={() => {
                              setSelectedUser(userAdmin);
                              setIsVerificationModalOpen(true);
                            }}
                          >
                            <Shield size={16} className="text-gray-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredAdmins.length === 0 && (
                <div className="text-center py-4 text-gray-400">
                  No users found matching your search
                </div>
              )}
            </div>
          </div>
        </div>
        <ModalCreateUser
          isOpen={isModalCreateUser}
          onClose={() => {
            setIsModalCreateUser(false);
          }}
        />
        <EditUserModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedUser(null);
          }}
          user={selectedUser}
        />

        <VerificationModal
          isOpen={isVerificationModalOpen}
          onClose={() => {
            setIsVerificationModalOpen(false);
            setSelectedUser(null);
          }}
          user={selectedUser}
        />

        <BulkVerificationModal
          isOpen={isBulkVerificationModalOpen}
          onClose={() => setIsBulkVerificationModalOpen(false)}
          onBulkVerify={handleBulkVerify}
        />
      </main >
    </>
  );
};

export default UserManagement;