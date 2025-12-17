"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Movie } from "@/lib/types/movie.types";

interface MovieCardProps {
  movie: Movie;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).getFullYear();
  };

  return (
    <Link href={`/movies/${movie.id}`} className="group block">
      <div className="relative w-full aspect-[2/3] sm:aspect-[16/9] overflow-hidden rounded-lg bg-gray-900 transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl transform-gpu">
        {/* Red N Logo */}
        <div className="absolute top-2 left-2 z-10 w-8 h-8 flex items-center justify-center">
          <span className="text-red-600 font-bold text-2xl">N</span>
        </div>

        {movie.posterPath ? (
          <img
            src={movie.posterPath}
            alt={movie.title}
            className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-80"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-800 text-gray-500">
            <span className="text-sm">No Image</span>
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">
              {movie.title}
            </h3>
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <span>{formatDate(movie.releaseDate)}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3 fill-yellow-400" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
                {movie.voteAverage.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: Show title below */}
      <div className="mt-2 md:hidden">
        <h3 className="text-sm font-semibold text-white line-clamp-1">
          {movie.title}
        </h3>
        <p className="text-xs text-gray-400 mt-1">
          {formatDate(movie.releaseDate)} • ⭐ {movie.voteAverage.toFixed(1)}
        </p>
      </div>
    </Link>
  );
};
