"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface NavigationProps {
  currentPath?: string;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentPath = "/",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const allNavItems = [
    { label: "Home", path: "/" },
    { label: "TV Shows", path: "/tv-shows" },
    { label: "Movies", path: "/movies" },
    { label: "New & Popular", path: "/new-popular" },
    { label: "My List", path: "/my-list" },
    { label: "Browse by Language", path: "/languages" },
  ];

  // On mobile: show first 3 items, rest in dropdown
  // On desktop: show all items
  const mobileVisibleItems = allNavItems.slice(0, 3);
  const mobileDropdownItems = allNavItems.slice(3);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close dropdown on route change
  useEffect(() => {
    setIsOpen(false);
  }, [currentPath]);

  return (
    <>
      {/* Desktop Navigation - Show all items */}
      <nav className="hidden lg:flex items-center gap-6">
        {allNavItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
              currentPath === item.path
                ? "text-white font-semibold"
                : "text-gray-300 hover:text-white"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Mobile Navigation - Show 3 items + dropdown with rest */}
      <div className="lg:hidden flex items-center gap-4">
        {/* First 2 visible items */}
        <nav className="flex items-center gap-4">
          {mobileVisibleItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                currentPath === item.path
                  ? "text-white font-semibold"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Dropdown for remaining items */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`text-sm font-medium transition-colors duration-200 whitespace-nowrap flex items-center gap-1 ${
              mobileDropdownItems.some((item) => item.path === currentPath)
                ? "text-white font-semibold"
                : "text-gray-300 hover:text-white"
            }`}
            aria-label="More menu"
            aria-expanded={isOpen}
          >
            <span>More</span>
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
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
          {isOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-black/95 backdrop-blur-sm rounded-md shadow-lg py-2 z-50 border border-gray-800">
              {mobileDropdownItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-2 text-sm transition-colors duration-200 ${
                    currentPath === item.path
                      ? "text-white font-semibold bg-red-600/20 border-l-2 border-red-600"
                      : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
