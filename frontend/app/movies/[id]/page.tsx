"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useMovieStore } from "@/lib/store/movie.store";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function MovieDetailPage() {
  const params = useParams();
  const router = useRouter();
  const movieId = parseInt(params.id as string);

  const {
    selectedMovie,
    isLoadingDetail,
    detailError,
    fetchMovieDetail,
    clearDetailError,
  } = useMovieStore();

  useEffect(() => {
    if (movieId) {
      fetchMovieDetail(movieId);
    }
  }, [movieId, fetchMovieDetail]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (isLoadingDetail) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (detailError) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Error</h2>
          <p className="text-gray-300 mb-6">{detailError}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!selectedMovie) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Backdrop */}
      {selectedMovie.backdropPath && (
        <div className="relative h-[40vh] md:h-[60vh] w-full overflow-hidden">
          <Image
            src={selectedMovie.backdropPath}
            alt={selectedMovie.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />
        </div>
      )}

      {/* Header */}
      <header className="bg-black/90 backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-300 hover:text-red-600 transition-colors"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Poster */}
          <div className="flex-shrink-0 w-full md:w-80">
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-2xl">
              {selectedMovie.posterPath ? (
                <Image
                  src={selectedMovie.posterPath}
                  alt={selectedMovie.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 320px"
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-800 text-gray-500">
                  <span>No Image</span>
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {selectedMovie.title}
            </h1>

            {selectedMovie.tagline && (
              <p className="text-lg text-gray-300 italic mb-4">
                {selectedMovie.tagline}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 fill-yellow-400" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
                <span className="font-semibold text-white">
                  {selectedMovie.voteAverage.toFixed(1)}
                </span>
                <span className="text-gray-300">
                  ({selectedMovie.voteCount.toLocaleString()} votes)
                </span>
              </div>

              {selectedMovie.releaseDate && (
                <span className="text-gray-300">
                  {new Date(selectedMovie.releaseDate).getFullYear()}
                </span>
              )}

              {selectedMovie.runtime > 0 && (
                <span className="text-gray-300">
                  {formatRuntime(selectedMovie.runtime)}
                </span>
              )}
            </div>

            {/* Genres */}
            {selectedMovie.genres && selectedMovie.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedMovie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-3 py-1 bg-red-900/30 text-red-200 rounded-full text-sm font-medium"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {/* Overview */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-2">
                Overview
              </h2>
              <p className="text-gray-300 leading-relaxed">
                {selectedMovie.overview || "No overview available."}
              </p>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {selectedMovie.budget > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 mb-1">
                    Budget
                  </h3>
                  <p className="text-white">
                    {formatCurrency(selectedMovie.budget)}
                  </p>
                </div>
              )}

              {selectedMovie.revenue > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 mb-1">
                    Revenue
                  </h3>
                  <p className="text-white">
                    {formatCurrency(selectedMovie.revenue)}
                  </p>
                </div>
              )}

              {selectedMovie.status && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 mb-1">
                    Status
                  </h3>
                  <p className="text-white">{selectedMovie.status}</p>
                </div>
              )}

              {selectedMovie.spokenLanguages &&
                selectedMovie.spokenLanguages.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 mb-1">
                      Languages
                    </h3>
                    <p className="text-white">
                      {selectedMovie.spokenLanguages
                        .map((lang) => lang.englishName)
                        .join(", ")}
                    </p>
                  </div>
                )}
            </div>

            {/* Production Companies */}
            {selectedMovie.productionCompanies &&
              selectedMovie.productionCompanies.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-400 mb-2">
                    Production Companies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedMovie.productionCompanies.map((company) => (
                      <span
                        key={company.id}
                        className="px-3 py-1 bg-gray-700 text-gray-200 rounded-full text-sm"
                      >
                        {company.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            {/* Homepage Link */}
            {selectedMovie.homepage && (
              <a
                href={selectedMovie.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Visit Official Website
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
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
