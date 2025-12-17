"use client";

import React, { useState, useRef, useEffect } from "react";

interface UserPanelProps {
  userName?: string;
  onSearchClick?: () => void;
}

export const UserPanel: React.FC<UserPanelProps> = ({
  userName = "User",
  onSearchClick,
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isProfileOpen]);

  return (
    <div className="flex items-center gap-4">
      {/* Search Icon */}
      <button
        onClick={onSearchClick}
        className="text-white hover:text-gray-300 transition-colors"
        aria-label="Search"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>

      {/* User Name */}
      <span className="text-sm text-white hidden lg:block">{userName}</span>

      {/* Notification Icon */}
      <button
        className="text-white hover:text-gray-300 transition-colors relative"
        aria-label="Notifications"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
      </button>

      {/* Profile Dropdown */}
      <div className="relative" ref={profileRef}>
        <button
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
          aria-label="Profile"
        >
          <div className="w-8 h-8 rounded bg-red-600 flex items-center justify-center text-white font-semibold">
            {userName.charAt(0).toUpperCase()}
          </div>
          <svg
            className={`w-4 h-4 transition-transform ${
              isProfileOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {isProfileOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-sm rounded-md shadow-lg py-1 z-50 border border-gray-700">
            <a
              href="#"
              className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors"
            >
              Account
            </a>
            <a
              href="#"
              className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors"
            >
              Settings
            </a>
            <a
              href="#"
              className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors"
            >
              Help
            </a>
            <div className="border-t border-gray-700 my-1"></div>
            <a
              href="#"
              className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors"
            >
              Sign out
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
