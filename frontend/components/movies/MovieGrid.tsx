"use client";

import React from "react";
import { MovieCard } from "./MovieCard";
import { Movie } from "@/lib/types/movie.types";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import Image from "next/image";
import Link from "next/link";

interface MovieGridProps {
  movies: Movie[];
  isLoading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
}

export const MovieGrid: React.FC<MovieGridProps> = ({
  movies,
  isLoading = false,
}) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).getFullYear();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <svg
          className="w-16 h-16 text-gray-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
        <h3 className="text-lg font-semibold text-white mb-2">
          No movies found
        </h3>
        <p className="text-gray-400">Try searching for something else</p>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
        Popular on Netflix
      </h2>
      <ul className="flex gap-4 md:gap-6 overflow-x-auto pb-4 scrollbar-hide">
        {movies.map((movie) => (
          <li
            key={movie.id}
            className="flex-shrink-0 w-48 sm:w-56 md:w-64 lg:w-72 xl:w-80"
          >
            <MovieCard movie={movie} />
          </li>
        ))}
      </ul>
    </>
  );
};
