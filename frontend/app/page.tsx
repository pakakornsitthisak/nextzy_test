"use client";

import React, { useEffect, useCallback, useRef, useState } from "react";
import { useMovieStore } from "@/lib/store/movie.store";
import { MovieGrid } from "@/components/movies/MovieGrid";
import { FeaturedMovie } from "@/components/movies/FeaturedMovie";
import { SearchBar, SearchBarRef } from "@/components/movies/SearchBar";
import { Navigation } from "@/components/layout/Navigation";
import { UserPanel } from "@/components/layout/UserPanel";
import { usePathname } from "next/navigation";

export default function Home() {
  const pathname = usePathname();
  const searchBarRef = useRef<SearchBarRef>(null);
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(false);
  const {
    movies,
    searchQuery,
    isLoading,
    isLoadingMore,
    error,
    totalPages,
    currentPage,
    fetchMovies,
    loadMoreMovies,
    searchMovies,
    clearError,
  } = useMovieStore();

  // Keep search bar visible when there's a search query
  useEffect(() => {
    if (searchQuery) {
      setIsSearchBarVisible(true);
    }
  }, [searchQuery]);

  // Fetch movies on mount or when search is cleared
  useEffect(() => {
    if (!searchQuery) {
      fetchMovies("popular");
    }
  }, [fetchMovies, searchQuery]);

  const handleSearch = useCallback(
    (query: string) => {
      if (query.trim()) {
        searchMovies(query);
      } else {
        fetchMovies("popular");
        setIsSearchBarVisible(false);
      }
    },
    [searchMovies, fetchMovies]
  );

  const toggleSearchBar = useCallback(() => {
    setIsSearchBarVisible((prev) => {
      const newState = !prev;
      if (newState) {
        // Focus search bar after it becomes visible
        setTimeout(() => searchBarRef.current?.focus(), 100);
      }
      return newState;
    });
  }, []);

  const hasMore = currentPage < totalPages;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-black/90 backdrop-blur-sm shadow-sm sticky top-0 z-50 transition-colors duration-200 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 md:py-6">
          <div className="flex flex-col gap-4 md:gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 md:gap-8">
                <h1 className="text-2xl md:text-3xl font-bold text-red-600">
                  Nextflix
                </h1>
                <Navigation currentPath={pathname} />
              </div>
              <UserPanel userName="John Doe" onSearchClick={toggleSearchBar} />
            </div>

            {/* Search Bar - Collapsible */}
            {(isSearchBarVisible || searchQuery) && (
              <div className="overflow-hidden transition-all duration-300 ease-in-out max-h-32 opacity-100">
                <SearchBar ref={searchBarRef} onSearch={handleSearch} />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {/* Featured Movie Section */}
        {!searchQuery && movies.length > 0 && <FeaturedMovie movies={movies} />}

        <div className="container mx-auto px-4 pt-2 md:pt-4">
          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg">
              <div className="flex items-center justify-between">
                <p className="text-red-200">{error}</p>
                <button
                  onClick={clearError}
                  className="text-red-400 hover:text-red-200"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>

        <MovieGrid movies={movies} isLoading={isLoading} />
      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-400">
          <p>© 2024 Nextflix. Built with Next.js and NestJS.</p>
        </div>
      </footer>
    </div>
  );
}
