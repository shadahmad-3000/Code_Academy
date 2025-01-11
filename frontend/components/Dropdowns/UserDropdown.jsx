import React, { useState, useEffect, useRef, Fragment } from "react";
import { useAuth } from "@/context/authContext.jsx";
import { Link } from "react-router-dom";
import { createPopper } from "@popperjs/core";

import img0 from "@/assets/img/team-4.png";

import { Menu, Transition } from '@headlessui/react'

const UserDropdown = () => {

  const { logout } = useAuth();
  const [showModalLogout, setShowModalLogout] = React.useState(false);
  const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
  const btnDropdownRef = useRef(null);
  const popoverDropdownRef = useRef(null);
  const openDropdownPopover = () => {
    if (!dropdownPopoverShow) {
      createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
        placement: 'left-start',
        strategy: 'fixed',
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, 8],
            },
          },
        ],
        });
      setDropdownPopoverShow(true);
    } else {
      setDropdownPopoverShow(false);
    }
  };
  const closeDropdownPopover = () => {
    setDropdownPopoverShow(false);
  };
  const handleLogout = async () => {
    await logout();
    window.location.href = "/signin";
  };

  useEffect(() => {
    const handleDocumentClick = (e) => {
      if (dropdownPopoverShow && !popoverDropdownRef.current.contains(e.target) && !btnDropdownRef.current.contains(e.target)) {
        setDropdownPopoverShow(false);
      }
    };

    // Add event handler only if popover is open
    if (dropdownPopoverShow) {
      document.addEventListener("click", handleDocumentClick);
    } else {
      document.removeEventListener("click", handleDocumentClick);
    }

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [dropdownPopoverShow]);
  return (
    <>
      <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button>
        <div className="items-center flex">
          <span className="w-12 h-12 text-sm text-white bg-blueGray-200 inline-flex items-center justify-center rounded-full">
            <img
              alt="..."
              src={img0}
              className="w-full rounded-full align-middle border-none shadow-lg"
            />
          </span>
        </div>
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <Link
                to="/profile"
                className={
                  "text-sm py-2 px-4 text-left font-semibold block w-full whitespace-nowrap bg-transparent text-blueGray-700"
                }
              >
                <i
                className={
                "fas fa-user mr-2 text-sm text-lightBlue-500"
                }
                ></i>{" "}
                      Perfil
              </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link
                to="/mybusiness"
                className={
                  "text-sm py-2 px-4 text-left font-semibold block w-full whitespace-nowrap bg-transparent text-blueGray-700"
                }
              >
                <i
                className={
                "fas fa-briefcase mr-2 text-sm text-emerald-500"
                }
                ></i>{" "}
                      My business
              </Link>
              )}
            </Menu.Item>
          </div>
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <Link
                to="/billing"
                className={
                  "text-sm py-2 px-4 text-left font-semibold block w-full whitespace-nowrap bg-transparent text-blueGray-700"
                }
              >
                <i
                className={
                "fas fa-wallet mr-2 text-sm text-amber-400"
                }
                ></i>{" "}
                      Billing
              </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                className={
                  "text-sm py-2 px-4 text-left border-t font-semibold block w-full whitespace-nowrap bg-transparent text-blueGray-700"
                }
                type="button"
                onClick={() => setShowModalLogout(true)}
              >
              <i
                className={
                "fas fa-right-from-bracket mr-2 text-sm text-red-500"
                }
                ></i>{" "}
                      Log out
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
    {showModalLogout ? (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            onClick={() => setShowModalLogout(false)}
          >
            <div className="relative w-auto my-6 mx-auto max-w-sm">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-4 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-2xl text-blueGray-700 font-semibold">
                    Log out
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModalLogout(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto text-center">
                <i class="fas fa-right-from-bracket mr-2 text-5xl p-8 bg-red-200 rounded-full mb-2 text-red-500"></i>
                  <p className="my-1 text-blueGray-500 text-lg leading-relaxed">
                  Are you sure you want to log out? You will need to log in later.
                  </p>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-4 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-blueGray-700 background-transparent font-bold uppercase px-6 py-2 text-xs outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModalLogout(false)}
                  >
                    No, later
                  </button>
                  <button
                    className="bg-red-500 text-white active:bg-emerald-600 font-bold uppercase text-xs px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    onClick={handleLogout}
                  >
                    Yes, log out
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
};

export default UserDropdown;
