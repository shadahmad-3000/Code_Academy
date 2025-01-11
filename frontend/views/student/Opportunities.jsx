import React, { useState, useEffect } from 'react';
import AdminNavbar from "@/components/Navbars/AdminNavbar.jsx";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from "@/context/authContext.jsx";

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
  const [formErrors, setFormErrors] = useState({});

  const openModal = () => {
    setEditingOpportunity(null);
    setFormData({ title: '', description: '', link: '' });
    setFormErrors({});
    setIsModalOpen(true);
  };

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
              Opportunities
            </h1>
            <p className="mt-2 text-gray-400">
              Your opportunities
            </p>
          </div>

          <div className='mb-8'>
            {/* Opportunities List */}
            {opportunities?.map(opportunity => (
              <OpportunityItem
                key={opportunity._id}
                opportunity={opportunity}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageOpportunities;