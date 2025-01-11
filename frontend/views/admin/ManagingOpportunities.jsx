import React, { useState, useEffect } from 'react';
import AdminNavbar from "@/components/Navbars/AdminNavbar.jsx";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from "@/context/authContext.jsx";

// Validation function
const validateOpportunity = (opportunity) => {
  const errors = {};

  if (!opportunity.title) {
    errors.title = 'Title is required';
  } else if (opportunity.title.length > 100) {
    errors.title = 'Title must be at most 100 characters';
  }

  if (!opportunity.description) {
    errors.description = 'Description is required';
  } else if (opportunity.description.length > 500) {
    errors.description = 'Description must be at most 500 characters';
  }

  if (!opportunity.link) {
    errors.link = 'Link is required';
  } else {
    try {
      new URL(opportunity.link);
    } catch {
      errors.link = 'Invalid URL';
    }
  }

  return errors;
};

// Opportunity Item Component
const OpportunityItem = ({ opportunity, onDelete }) => (
  <div className="bg-gray-800 p-4 rounded-lg mb-4 flex justify-between items-center">
    <div>
      <h3 className="text-white font-semibold text-lg">{opportunity.title}</h3>
      <p className="text-gray-400 text-sm mb-2">{opportunity.description}</p>
      <a
        href={opportunity.link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline inline-flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" x2="3" y1="12" y2="12" />
        </svg>
        Apply From Here
      </a>
    </div>
    <div className="flex space-x-2">
      <button
        onClick={() => onDelete(opportunity._id)}
        className="text-red-500 hover:bg-red-500/20 p-2 rounded"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" />
        </svg>
      </button>
    </div>
  </div>
);

// Main Opportunities Management Component
const ManageOpportunities = () => {
  const { deleteOpportunities, opportunities, getOpportunities, createOpportunities, isAuthenticated, user, loading, error } = useAuth();

  useEffect(() => {
      if (isAuthenticated) {
        getOpportunities();
      }
    }, [isAuthenticated]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: ''
  });
  const [formErrors, setFormErrors] = useState({});

  const handleDelete = (id) => {
    console.log(id)
    deleteOpportunities(id);
  };

  const handleEdit = (opportunity) => {
    setEditingOpportunity(opportunity);
    setFormData({
      title: opportunity.title,
      description: opportunity.description,
      link: opportunity.link
    });
    setIsModalOpen(true);
  };

  const openModal = () => {
    setEditingOpportunity(null);
    setFormData({ title: '', description: '', link: '' });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Validation schema using Yup
  const validationSchema = Yup.object({
    title: Yup.string()
      .required('Title is required')
      .min(3, 'Title must be at least 3 characters'),
    description: Yup.string()
      .required('Description is required')
      .min(10, 'Description must be at least 10 characters'),
    link: Yup.string()
      .url('Must be a valid URL')
      .required('Link is required')
  });

  // Formik hook
  const formik = useFormik({
    initialValues: {
      title: editingOpportunity?.title || '',
      description: editingOpportunity?.description || '',
      link: editingOpportunity?.link || ''
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      // Adds the user's _id to the values
      const userId = user?._id; // Make sure you have the _id available
      const updatedValues = { ...values, userId };
      createOpportunities(updatedValues);
      resetForm();
      setIsModalOpen(false);
    }
  });

  return (
    <>
      <AdminNavbar nav="Contest Management" />
      <div className="min-h-screen text-white">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="inline-block mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              Managing Opportunities
            </h1>
            <p className="mt-2 text-gray-400">
              Create, edit, and manage your posted opportunities
            </p>
          </div>

          {/* Create New Opportunity Button */}
          <div className="mb-8">
            <button
              onClick={openModal}
              className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-4 py-2 rounded-lg mb-6 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Create New Opportunity
            </button>

            {/* Opportunities List */}
            {opportunities?.map(opportunity => (
              <OpportunityItem
                key={opportunity._id}
                opportunity={opportunity}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl text-white mb-4">
                  {editingOpportunity ? 'Edit Opportunity' : 'Create New Opportunity'}
                </h2>

                <form onSubmit={formik.handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="title" className="block text-white mb-2">Title</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formik.values.title}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                      placeholder="Enter opportunity title"
                    />
                    {formik.touched.title && formik.errors.title && (
                      <p className="text-red-500 text-sm mt-1">{formik.errors.title}</p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label htmlFor="description" className="block text-white mb-2">Description</label>
                    <textarea
                      id="description"
                      name="description"
                      value={formik.values.description}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                      placeholder="Enter opportunity description"
                      rows={4}
                    />
                    {formik.touched.description && formik.errors.description && (
                      <p className="text-red-500 text-sm mt-1">{formik.errors.description}</p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label htmlFor="link" className="block text-white mb-2">Link</label>
                    <input
                      type="text"
                      id="link"
                      name="link"
                      value={formik.values.link}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                      placeholder="Enter opportunity link"
                    />
                    {formik.touched.link && formik.errors.link && (
                      <p className="text-red-500 text-sm mt-1">{formik.errors.link}</p>
                    )}
                  </div>

                  <div className="flex justify-end space-x-4 mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        formik.resetForm();
                        setIsModalOpen(false);
                      }}
                      className="bg-gray-700 text-white px-4 py-2 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-4 py-2 rounded"
                    >
                      {editingOpportunity ? 'Update' : 'Create'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ManageOpportunities;