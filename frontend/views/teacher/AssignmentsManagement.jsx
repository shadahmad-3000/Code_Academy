import React, { useState, useEffect } from 'react';
import { ClipboardList, Calendar, Plus, X, Trash2, ExternalLink, ArrowUp } from 'lucide-react';
import AdminNavbar from "@/components/Navbars/AdminNavbar.jsx";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuth } from "@/context/authContext.jsx";

const Card = ({ children, className }) => (
  <div className={`bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-teal-900/50 backdrop-blur-xl rounded-2xl shadow-2xl ${className}`}>
    {children}
  </div>
);

const CreateAssignmentModal = ({ isOpen, onClose, onSubmit }) => {
  const { createAssignment, isAuthenticated, user, loading, error } = useAuth();

  // Validation schema
  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .required('Assignment title is required')
      .min(5, 'Title must be at least 5 characters'),
    course: Yup.string().required('Course selection is required'),
    dueDate: Yup.date()
      .required('Due date is required')
      .min(new Date(), 'Due date must be in the future'),
    description: Yup.string()
      .required('Description is required')
      .min(10, 'Description must be at least 10 characters'),
  });

  // Initial form values
  const initialValues = {
    title: '',
    course: '',
    dueDate: '',
    description: '',
  };

  // If modal is not open, return null
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-teal-900/50 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 text-transparent bg-clip-text">
            Create New Assignment
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            try {
              // Adds the user's _id to the values
              const userId = user?._id; // Make sure you have the _id available
              const updatedValues = { ...values, userId };
              // Call the onSubmit prop with the new assignment
              await createAssignment(updatedValues);

              // Reset the form and close the modal
              resetForm();
              onClose();
            } catch (error) {
              console.error('Error in creating assignment:', error);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className="p-6 space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                  Assignment Title
                </label>
                <Field
                  type="text"
                  name="title"
                  className={`w-full px-3 py-2 bg-gray-800 border rounded-lg ${touched.title && errors.title
                      ? 'border-red-500'
                      : 'border-white/10 focus:border-purple-500'
                    } text-white placeholder-gray-500 focus:outline-none`}
                  placeholder="Enter Assignment Title"
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label htmlFor="course" className="block text-sm font-medium text-gray-300 mb-2">
                  Course
                </label>
                <Field
                  as="select"
                  name="course"
                  className={`w-full px-3 py-2 bg-gray-800 border rounded-lg ${touched.course && errors.course
                      ? 'border-red-500'
                      : 'border-white/10 focus:border-purple-500'
                    } text-white`}
                >
                  <option value="">Select a course</option>
                  <option value="B.TECH">B.TECH</option>
                  <option value="M.TECH">M.TECH</option>
                  <option value="BCA">BCA</option>
                  <option value="MCA">MCA</option>
                </Field>
                <ErrorMessage
                  name="course"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-300 mb-2">
                  Due Date
                </label>
                <Field
                  type="date"
                  name="dueDate"
                  className={`w-full px-3 py-2 bg-gray-800 border rounded-lg ${touched.dueDate && errors.dueDate
                      ? 'border-red-500'
                      : 'border-white/10 focus:border-purple-500'
                    } text-white`}
                />
                <ErrorMessage
                  name="dueDate"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <Field
                  as="textarea"
                  name="description"
                  rows="4"
                  className={`w-full px-3 py-2 bg-gray-800 border rounded-lg ${touched.description && errors.description
                      ? 'border-red-500'
                      : 'border-white/10 focus:border-purple-500'
                    } text-white placeholder-gray-500 focus:outline-none`}
                  placeholder="Enter assignment description"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  <Plus size={20} className="text-white" />
                  <span>Create Assignment</span>
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Function to find links in text and convert them to clickable links
const parseDescription = (description) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return description.split(urlRegex).map((part, index) => 
    urlRegex.test(part) ? (
      <a 
        key={index} 
        href={part} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-blue-600 hover:underline inline-flex items-center"
      >
        {part}
        <ExternalLink size={12} className="ml-1" />
      </a>
    ) : part
  );
};

const AssignmentCard = ({
  title,
  description,
  course,
  dueDate,
  onDelete,
  _id
}) => {
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    setShowScrollTop(scrollTop > 100);
  };

  const scrollToTop = (e) => {
    e.currentTarget.closest('.description-scroll-container').scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 dark:border-gray-700 relative"
      >
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Assignment Details Column */}
            <div className="lg:col-span-3" onClick={() => setShowDescriptionModal(true)}>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white cursor-pointer">{title}</h3>
              <div className="mt-2 text-gray-500 dark:text-gray-400 text-sm">{course}</div>
              
              {/* Due Date */}
              <div className="flex items-center gap-2 mt-3">
                <Calendar size={16} className="text-gray-400 dark:text-gray-500" />
                <span className="text-gray-500 dark:text-gray-400 text-sm">
                  {formatDate(dueDate)}
                </span>
              </div>
            </div>
            
            {/* Delete Button */}
            <div className="lg:col-span-1 flex lg:justify-end">
              <button 
                onClick={() => onDelete(_id)}
                className="text-red-500 hover:bg-red-100 p-2 rounded-full transition-colors"
                aria-label="Delete Assignment"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Description Modal */}
      {showDescriptionModal && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowDescriptionModal(false)}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h3>
                  <div className="text-gray-500 dark:text-gray-400">{course}</div>
                </div>
                <button 
                  onClick={() => setShowDescriptionModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-white"
                >
                  ✕
                </button>
              </div>
              <div className="flex items-center gap-2 mt-2 text-gray-500 dark:text-gray-400">
                <Calendar size={16} />
                <span>{formatDate(dueDate)}</span>
              </div>
            </div>

            <div 
              className="description-scroll-container overflow-y-auto max-h-[60vh] relative p-6"
              onScroll={handleScroll}
            >
              <div className="text-gray-600 dark:text-gray-300 space-y-4">
                <p>{parseDescription(description)}</p>
              </div>

              {showScrollTop && (
                <button 
                  onClick={scrollToTop}
                  className="fixed bottom-10 right-10 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
                  aria-label="Scroll to Top"
                >
                  <ArrowUp size={24} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const AssignmentsManagement = () => {
  const { fetchAssignmentById, deleteAssignment, currentAssignment, isAuthenticated, user, loading, error } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchAssignmentById(user._id);
    }
  }, [isAuthenticated]);

  const handleDelete = (id) => {
    console.log(id)
    deleteAssignment(id);
  };

  // State to control the opening of the modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modified handler to use createAssignment
  const handleCreateAssignment = async (newAssignment) => {
    try {
      // Use the createAssignment function instead of directly updating state
      await createAssignment({
        ...newAssignment,
        submitted: 0,
        status: 'active'
      });

      // Close the modal
      setIsModalOpen(false);
    } catch (err) {
      // Handle any errors (you might want to show an error message to the user)
      console.error('Failed to create assignment:', err);
    }
  };

  return (
    <>
      {/* Show the create assignment modal */}
      <CreateAssignmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateAssignment}
      />

      <AdminNavbar nav="Assignments" />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-12 text-center relative">
          <div className="inline-block">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl blur transform scale-110" />
              <div className="relative bg-black p-4 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl">
                <ClipboardList size={40} className="text-white" />
              </div>
            </div>
          </div>
          <h1 className="mt-6 text-4xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 text-transparent bg-clip-text">
            Assignments
          </h1>
          <p className="mt-2 text-slate-400">
            Create and Grade Assignments
          </p>
        </div>

        <div className="mb-8 flex justify-between items-center">
          <div className="grid grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{currentAssignment?.totalAssignments}</div>
                <div className="text-gray-400 text-sm">Total</div>
              </div>
            </Card>
          </div>
          {/* Modify the button to open the modal*/}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus size={20} className="text-white" />
            <span className="text-white">Create Assignment</span>
          </button>
        </div>

        <div className="space-y-6">
          {currentAssignment?.assignments && currentAssignment?.assignments.length > 0 ? (
            currentAssignment?.assignments.map((assignment, index) => (
              <AssignmentCard
                key={index}
                title={assignment.title}
                course={assignment.course}
                description={assignment.description}
                dueDate={assignment.dueDate}
                onDelete={handleDelete}
                _id={assignment._id}
              />
            ))
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p>No Assignments Available</p>
              <div className="mt-4">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-4 py-2 rounded-lg"
                >
                  Create First Assignment
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AssignmentsManagement;