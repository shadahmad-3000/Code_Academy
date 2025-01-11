import React, { useState, useEffect, Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authContext.jsx";
import {
  Dialog,
  Menu,
  Transition,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { ME_LOCALHOST_KEY } from "@/config.js";
import img1 from "@/assets/img/team-4.png";
import {
  Users,
  Shield,
  Code,
  ClipboardCheck,
  FileDigit,
  BriefcaseBusiness
} from "lucide-react";

export default function Sidebar() {
  const { logout, user: authUser } = useAuth();
  const [currentUser, setCurrentUser] = useState(undefined);
  const [showModalLogout, setShowModalLogout] = React.useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      if (!localStorage.getItem(ME_LOCALHOST_KEY)) {
        navigate("/signin");
      } else {
        setCurrentUser(await JSON.parse(localStorage.getItem(ME_LOCALHOST_KEY)));
      }
    }
    fetchData();
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  const MenuSection = ({ title, children, showDivider = true }) => (
    <>
      {showDivider && <hr className="border-t border-white/20 rounded-full my-6 mx-4" />}
      <h6 className="md:min-w-full text-white/70 text-xs uppercase font-bold block pt-1 pb-4 no-underline px-4">
        {title}
      </h6>
      <ul className="md:flex-col md:min-w-full flex flex-col list-none px-2">
        {children}
      </ul>
    </>
  );

  const MenuItem = ({ icon: Icon, title, to, description }) => (
    <li className="items-center mt-2">
      <Link
        className={
          "flex items-center py-3 px-4 rounded-lg " +
          (window.location.href.indexOf(to) !== -1
            ? "bg-gradient-to-r from-purple-500 to-cyan-500 text-white"
            : "text-white/70 hover:bg-gradient-to-r hover:from-purple-400/30 hover:to-cyan-400/30")
        }
        to={to}
      >
        <div className="p-2 rounded-xl bg-white/5 border border-white/10 mr-3">
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <div className="text-xs uppercase font-bold">{title}</div>
          {description && (
            <div className="text-xs text-white/50 mt-1">{description}</div>
          )}
        </div>
      </Link>
    </li>
  );
  return (
    <>
      <nav className="left-0 block md:fixed flex-col md:top-0 md:bottom-0 md:overflow-y-hidden shadow-2xl flex flex-wrap items-center justify-between relative md:w-64 z-10 m-3 rounded-2xl bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-teal-900/50 backdrop-blur-xl md:h-screen">
        <div className="flex flex-row flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex-wrap items-center justify-between w-full mx-auto rounded-2xl">
          {/* Header Section - Fixed */}
          <div className="sticky top-0 z-10 w-full bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-teal-900/50 backdrop-blur-xl rounded-2xl">
            {/* Mobile Header Container */}
            <div className="flex items-center justify-between px-4 py-4 md:py-6 md:block rounded-2xl">
              {/* Left section: Toggler */}
              <button
                className="cursor-pointer text-white md:hidden text-xl leading-none rounded-lg bg-gradient-to-r from-purple-500/30 to-cyan-500/30 hover:from-purple-500/50 hover:to-cyan-500/50 transition-all duration-300"
                type="button"
                onClick={() => setOpen(true)}
              >
                <Bars3Icon className="h-6 w-6" />
              </button>

              {/* Middle section: Brand */}
              <Link to="/dashboard" className="md:px-4 md:py-4">
                <div className="text-2xl font-bold text-white text-center bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  CodeAcademy
                </div>
              </Link>

              {/* Right section: User Dropdown (Mobile) */}
              <Menu as="div" className="relative md:hidden">
                <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                  <img alt="profile" src={img1} className="h-8 w-8 rounded-full" />
                </Menu.Button>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-xl bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-teal-900/50 backdrop-blur-xl py-1 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Menu.Item>
                      <Link to="/profile"
                        className="block px-4 py-2 text-sm text-white hover:bg-gradient-to-r hover:from-purple-400 hover:to-cyan-400 rounded-lg mx-2"
                      >
                        Profile
                      </Link>
                    </Menu.Item>
                    <Menu.Item>
                      <Link to="/account"
                        className="block px-4 py-2 text-sm text-white hover:bg-gradient-to-r hover:from-purple-400 hover:to-cyan-400 rounded-lg mx-2"
                      >
                        Account
                      </Link>
                    </Menu.Item>
                    <Menu.Item>
                      <Link to={"/messages"}
                        className="block px-4 py-2 text-sm text-white hover:bg-gradient-to-r hover:from-purple-400 hover:to-cyan-400 rounded-lg mx-2"
                      >
                        Messages
                      </Link>
                    </Menu.Item>
                    <Menu.Item>
                      <button
                        type="button"
                        onClick={() => setShowModalLogout(true)}
                        className="block w-full px-4 py-2 text-sm text-white hover:bg-gradient-to-r hover:from-purple-400 hover:to-cyan-400 rounded-lg mx-2 text-left"
                      >
                        Sign Out
                      </button>
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>

          {/* Scrollable Content Section */}
          <div className="relative w-full flex-grow">
            <div className="max-h-[calc(100vh-120px)] overflow-y-auto">

              {/* Sidebar Content - Scrollable */}
              <div className="flex-1 px-2 py-4 hidden md:block">
                {currentUser && currentUser.roles.some((role) => role.name === "1") && (
                  <MenuSection title="Student Resources" showDivider={false}>
                    <MenuItem
                      icon={ClipboardCheck}
                      title="Assignments"
                      description="View and submit course assignments"
                      to="/student/assignments"
                    />
                    <MenuItem
                      icon={Code}
                      title="Coding Contests"
                      description="Access coding competition platforms"
                      to="/student/contests"
                    />
                    <MenuItem
                      icon={BriefcaseBusiness}
                      title="Opportunity"
                      description="Opt for job opportunities"
                      to="/student/opportunities"
                    />
                  </MenuSection>
                )}

                {currentUser && currentUser.roles.some((role) => role.name === "2") && (
                  <>
                    <MenuSection title="Teacher Controls">
                      <MenuItem
                        icon={ClipboardCheck}
                        title="Assignments"
                        description="Create and grade assignments"
                        to="/teacher/assignments"
                      />
                    </MenuSection>
                  </>
                )}

                {currentUser && currentUser.roles.some((role) => role.name === "3") && (
                  <>
                    <MenuSection title="Administration">
                      <MenuItem
                        icon={Users}
                        title="User Management"
                        description="Manage users, roles and enrollments"
                        to="/admin/users"
                      />
                      <MenuItem
                        icon={Code}
                        title="Contest Management"
                        description="Manage coding contest platform links"
                        to="/admin/contests"
                      />
                      <MenuItem
                        icon={BriefcaseBusiness}
                        title="Opportunity Administration"
                        description="Managing opportunities"
                        to="/admin/opportunities"
                      />
                    </MenuSection>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Modal */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 z-50 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-teal-900/50 backdrop-blur-xl pb-12 shadow-2xl">
                <div className="flex items-center justify-between px-4 py-4">
                  <Link to="/dashboard" className="text-2xl font-bold text-white bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    CodeAcademy
                  </Link>
                  <button
                    type="button"
                    className="-mr-2 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-purple-500/30 to-cyan-500/30 hover:from-purple-500/50 hover:to-cyan-500/50"
                    onClick={() => setOpen(false)}
                  >
                    <XMarkIcon className="h-6 w-6 text-white" />
                  </button>
                </div>

                <div className="mt-8 px-4">
                  {currentUser && currentUser.roles.some((role) => role.name === "1") && (
                    <MenuSection title="Student Resources" showDivider={false}>
                      <MenuItem
                        icon={ClipboardCheck}
                        title="Assignments"
                        description="View and submit course assignments"
                        to="/student/assignments"
                      />
                      <MenuItem
                        icon={Code}
                        title="Coding Contests"
                        description="Access Coding Competition Platforms"
                        to="/student/contests"
                      />
                      <MenuItem
                        icon={BriefcaseBusiness}
                        title="Opportunity"
                        description="Opt for job opportunities"
                        to="/student/opportunities"
                      />
                    </MenuSection>
                  )}


                  {currentUser && currentUser.roles.some((role) => role.name === "2") && (
                    <>
                      <MenuSection title="Teacher Controls">
                        <MenuItem
                          icon={ClipboardCheck}
                          title="Assignments"
                          description="Create and grade assignments"
                          to="/teacher/assignments"
                        />
                      </MenuSection>
                    </>
                  )}

                  {currentUser && currentUser.roles.some((role) => role.name === "3") && (
                    <>
                      <MenuSection title="Administration">
                        <MenuItem
                          icon={Users}
                          title="User Management"
                          description="Manage users, roles and enrollments"
                          to="/admin/users"
                        />
                        <MenuItem
                          icon={Code}
                          title="Contest Management"
                          description="Manage coding contest platform links"
                          to="/admin/contests"
                        />
                        <MenuItem
                          icon={BriefcaseBusiness}
                          title="Opportunity Administration"
                          description="Managing opportunities"
                          to="/admin/opportunities"
                        />
                      </MenuSection>
                    </>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Logout Modal */}
      {showModalLogout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/30">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4">
            <div className="text-center">
              <div className="mb-4">
                <i className="fas fa-right-from-bracket text-5xl p-8 bg-gradient-to-r from-red-500/30 to-red-400/30 rounded-full text-red-500"></i>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Sign Out</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to sign out? You'll need to sign in again later.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
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