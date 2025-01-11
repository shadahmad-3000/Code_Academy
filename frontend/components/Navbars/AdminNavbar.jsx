import React, { useState, useEffect, Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authContext.jsx";
import { useChats } from "@/context/chatContext.jsx";
import {
  Dialog,
  Disclosure,
  Menu,
  Transition,
  Popover,
} from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon, ChatBubbleOvalLeftIcon } from "@heroicons/react/24/outline";
import { Plus, X } from 'lucide-react';
import img1 from "@/assets/img/team-4.png";

import { ME_LOCALHOST_KEY } from "@/config.js";

export default function Navbar({ nav }) {
  const { logout, user: authUser, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showModalLogout, setShowModalLogout] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showMessagesModal, setShowMessagesModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);  // New variable to control the modal
  const navigate = useNavigate();

  const {
    chats,
    fetchChats
  } = useChats();

  // Simplified and more robust effects
  useEffect(() => {
    if (isAuthenticated) {
      fetchChats();
    }
  }, [isAuthenticated, fetchChats]); // Add fetch Chats to dependencies

  useEffect(() => {
    async function fetchData() {
      if (!localStorage.getItem(ME_LOCALHOST_KEY)) {
        navigate("/");
      } else {
        setCurrentUser(await JSON.parse(localStorage.getItem(ME_LOCALHOST_KEY)));
      }
    }
    fetchData();
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  const handleNotificationsModal = () => {
    setShowNotificationsModal(!showNotificationsModal);
  };

  const handleMessagesModal = () => {
    setShowMessagesModal(!showMessagesModal);
  };

  return (
    <>
      {/* Navbar */}
      <Disclosure as="nav" className="rounded-2xl shadow-2xl hidden md:block bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-teal-900/50 backdrop-blur-xl z-50 pt-0">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
              <div className="relative flex h-16 items-center justify-between">
                <div className="space-y-1 px-2 pb-2 pt-2 justify-start my-auto hidden md:block">
                  <Link
                    className={"text-white bg-gradient-to-r from-purple-400/50 to-cyan-400/50 hover:bg-gradient-to-r hover:from-purple-400 hover:to-cyan-400 block rounded-md px-3 py-2 text-base font-medium"}
                    to="/dashboard"
                  >
                    <i className="fa fa-home mr-2"></i>/ Admin / {nav}
                  </Link>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  {/* Display welcome message */}
                  {authUser && (
                    <div className="text-white mr-4 font-medium">
                      Welcome, {authUser.name}
                    </div>
                  )}

                  {/* Messaging Icon */}
                  <Link
                    to={"/messages"}
                    className="text-white px-3 py-2 rounded-md hover:bg-gradient-to-r hover:from-purple-400 hover:to-cyan-400"
                  >
                    <ChatBubbleOvalLeftIcon className="h-6 w-6" aria-hidden="true" />
                  </Link>

                  {/* Profile icon to open modal */}
                  <button
                    className="relative inline-flex items-center justify-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    onClick={() => setShowProfileModal(true)}  // Open the modal
                  >
                    <img
                      alt="User avatar"
                      src={img1}
                      className="h-8 w-8 rounded-full"
                    />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </Disclosure>

      {showProfileModal && (
        <div
          className="fixed inset-0 bg-black/30 z-50 backdrop-blur-md flex justify-center items-center"
          onClick={() => setShowProfileModal(false)}
        >
          <div
            className={`
             bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-teal-900/50 
             backdrop-blur-xl rounded-2xl shadow-2xl max-w-sm w-full
             transform transition-all duration-300 ease-in-out
             ${showProfileModal
                ? 'scale-100 opacity-100'
                : 'scale-95 opacity-0'}
           `}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 text-transparent bg-clip-text">
                User Profile
              </h3>
              <button
                className="text-gray-300 hover:text-white"
                onClick={() => setShowProfileModal(false)}
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <Link
                to="/profile"
                className="block px-4 py-2 text-sm text-gray-200 hover:bg-white/10 rounded-md transition-colors"
              >
                Profile
              </Link>
              <Link
                to="/account"
                className="block px-4 py-2 text-sm text-gray-200 hover:bg-white/10 rounded-md transition-colors"
              >
                Account Config
              </Link>
              <button
                onClick={() => setShowModalLogout(true)}
                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/10 rounded-md transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* End Navbar */}
      {showModalLogout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/30">
          <div className="bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-teal-900/50 backdrop-blur-xl rounded-2xl shadow-2xl max-w-sm w-full mx-4">
            <div className="p-8 text-center">
              <div className="mb-6">
                <i className="fas fa-right-from-bracket text-5xl p-8 bg-gradient-to-r from-red-500/30 to-red-400/30 rounded-full text-red-400"></i>
              </div>
              <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 text-transparent bg-clip-text">
                Sign Out
              </h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to sign out? You'll need to sign in again later.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:bg-white/10 rounded-lg transition-colors"
                  onClick={() => setShowModalLogout(false)}
                >
                  No, later
                </button>
                <button
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-400 hover:from-red-600 hover:to-red-500 rounded-lg transition-colors"
                  onClick={handleLogout}
                >
                  Yes, sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
