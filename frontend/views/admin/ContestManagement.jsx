import React, { useState, useEffect } from 'react';
import {
  Code,
  Clock,
  Users,
  Plus,
  X
} from 'lucide-react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import AdminNavbar from "@/components/Navbars/AdminNavbar.jsx";
import { useAuth } from "@/context/authContext.jsx";

const ContestCategory = ({ title, children }) => (
  <div className="mb-6">
    <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 p-3 rounded-t-lg border-b border-white/10">
      <h2 className="text-lg font-bold text-white">{title}</h2>
    </div>
    <div className="space-y-1">
      {children}
    </div>
  </div>
);

const ContestItem = ({ title, link, description, _id, ...rest }) => {
  const { deleteContest, isAuthenticated, user, loading, error } = useAuth();

  const handleDelete = () => {
    if (isAuthenticated && !loading && _id) {
      deleteContest(_id);
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-900/30 via-blue-900/30 to-teal-900/30 hover:from-purple-900/40 hover:via-blue-900/40 hover:to-teal-900/40 transition-all duration-200">
      <div className="p-4 flex items-center gap-4">
        <div className="flex-grow">
          <div className="flex items-center gap-2">
            <h3 className="text-white hover:text-cyan-400 transition-colors cursor-pointer font-medium">
              {title}
            </h3>
            {link}
          </div>
          <div className="text-sm text-gray-400 mt-1">
            <span className="text-purple-400 hover:text-purple-300 cursor-pointer">{description}</span>
          </div>
        </div>

        <div className="flex-shrink-0 text-right text-sm">
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleDelete}
              disabled={!isAuthenticated || loading}
              className={`
                text-white px-3 py-1 rounded text-xs 
                ${!isAuthenticated || loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-red-500 hover:bg-red-600 transition-colors'
                }
              `}
            >
              {loading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const AddContestModal = ({ isModalOpen, setIsModalOpen, onAddContest }) => {
  const { createContest, isAuthenticated, user, loading, error } = useAuth();

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Contest title is required'),
    platformName: Yup.string().required('Platform name is required'),
    startDate: Yup.date().required('Start date is required'),
    endDate: Yup.date()
      .required('End date is required')
      .min(Yup.ref('startDate'), 'End date must be after start date'),
    link: Yup.string().url('Invalid URL').required('Contest link is required'),
    description: Yup.string().required('Description is required')
  });

  // Initial Values
  const initialValues = {
    title: '',
    platformName: '',
    startDate: '',
    endDate: '',
    link: '',
    description: ''
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-gray-900 rounded-lg w-full max-w-md mx-4 p-6 relative border border-white/10">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            try {
              // Adds the user's _id to the values
              const userId = user?._id; // Make sure you have the _id available
              const updatedValues = { ...values, userId };

              // Call the function to create the contest with the updated values
              await createContest(updatedValues);

              // Reset the form and close the modal
              resetForm();
              setIsModalOpen(false);
            } catch (error) {
              console.error('Error adding contest:', error);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-white hover:text-red-500 transition-colors"
              >
                <X size={24} />
              </button>
              <h2 className="text-2xl font-bold text-white mb-6">Add New Contest</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Title</label>
                  <Field
                    type="text"
                    name="title"
                    placeholder="Enter contest title"
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  <ErrorMessage name="title" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Platform Name</label>
                  <Field
                    type="text"
                    name="platformName"
                    placeholder="Enter platform name"
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  <ErrorMessage name="platformName" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Start Date</label>
                    <Field
                      type="date"
                      name="startDate"
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                    <ErrorMessage name="startDate" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">End Date</label>
                    <Field
                      type="date"
                      name="endDate"
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                    <ErrorMessage name="endDate" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Contest Link</label>
                  <Field
                    type="url"
                    name="link"
                    placeholder="Paste contest URL"
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  <ErrorMessage name="link" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Description</label>
                  <Field
                    as="textarea"
                    name="description"
                    placeholder="Enter contest description"
                    rows="4"
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600 transition-colors disabled:opacity-50"
                  >
                    Add Contest
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

const ContestManagement = () => {
  const { contests, getContest, isAuthenticated, user, loading, error } = useAuth();
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newContest, setNewContest] = useState({
    title: '',
    platformName: '',
    startDate: '',
    endDate: '',
    link: '',
    description: ''
  });

  useEffect(() => {
    if (isAuthenticated) {
      getContest();
    }
  }, [isAuthenticated]);

  return (
    <>
      <AdminNavbar nav="Contest Management" />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-12 text-center relative">
          <div className="inline-block">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl blur transform scale-110" />
              <div className="relative bg-black p-4 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl">
                <Code size={40} className="text-white" />
              </div>
            </div>
          </div>
          <h1 className="mt-6 text-4xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 text-transparent bg-clip-text">
            Contest Management
          </h1>
          <p className="mt-2 text-slate-400">
            Manage coding contest platform links
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 p-4 rounded-lg">
            <div className="text-gray-400">Total Contests</div>
            <div className="text-2xl font-bold text-white">{contests?.length}</div>
          </div>
          <div className="flex items-end">
            <div className="flex gap-2 w-full">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-cyan-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-cyan-600 transition-colors"
              >
                <Plus size={16} />
                Add
              </button>
            </div>
          </div>
        </div>

        <ContestCategory title="🏆 Contest Management">
          {contests && contests.length > 0 ? (
            contests.map((contest, index) => (
              <ContestItem
                key={contest._id}
                _id={contest._id}
                {...contest}
              />
            ))
          ) : (
            <p>No contests available.</p>
          )}
        </ContestCategory>
      </div>

      {/* Modal for Adding Contest */}
      {isModalOpen && (
        <AddContestModal setIsModalOpen={setIsModalOpen} />
      )}
    </>
  );
};

export default ContestManagement;