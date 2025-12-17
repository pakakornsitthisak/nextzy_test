import { create } from 'zustand';
import { Movie, MovieDetail, MovieCategory, MoviesResponse } from '../types/movie.types';
import { movieApi } from '../api/movie.api';

interface MovieState {
  // State
  movies: Movie[];
  selectedMovie: MovieDetail | null;
  category: MovieCategory;
  searchQuery: string;
  currentPage: number;
  totalPages: number;
  totalResults: number;
  
  // Loading states
  isLoading: boolean;
  isLoadingMore: boolean;
  isLoadingDetail: boolean;
  
  // Error states
  error: string | null;
  detailError: string | null;
  
  // Actions
  fetchMovies: (category: MovieCategory, page?: number) => Promise<void>;
  loadMoreMovies: () => Promise<void>;
  fetchMovieDetail: (id: number) => Promise<void>;
  searchMovies: (query: string, page?: number) => Promise<void>;
  setCategory: (category: MovieCategory) => void;
  setSearchQuery: (query: string) => void;
  clearError: () => void;
  clearDetailError: () => void;
  reset: () => void;
}

const initialState = {
  movies: [],
  selectedMovie: null,
  category: 'popular' as MovieCategory,
  searchQuery: '',
  currentPage: 1,
  totalPages: 0,
  totalResults: 0,
  isLoading: false,
  isLoadingMore: false,
  isLoadingDetail: false,
  error: null,
  detailError: null,
};

export const useMovieStore = create<MovieState>((set, get) => ({
  ...initialState,

  fetchMovies: async (category: MovieCategory, page: number = 1) => {
    set({ isLoading: true, error: null, category });
    
    try {
      const response: MoviesResponse = await movieApi.getMovies(category, page);
      set({
        movies: response.movies,
        currentPage: page,
        totalPages: response.totalPages,
        totalResults: response.totalResults,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch movies',
        movies: [],
      });
    }
  },

  loadMoreMovies: async () => {
    const { category, currentPage, totalPages, movies, searchQuery } = get();
    
    if (currentPage >= totalPages || get().isLoadingMore) return;
    
    set({ isLoadingMore: true, error: null });
    
    try {
      const nextPage = currentPage + 1;
      let response: MoviesResponse;
      
      if (searchQuery) {
        response = await movieApi.searchMovies(searchQuery, nextPage);
      } else {
        response = await movieApi.getMovies(category, nextPage);
      }
      
      set({
        movies: [...movies, ...response.movies],
        currentPage: nextPage,
        isLoadingMore: false,
      });
    } catch (error: any) {
      set({
        isLoadingMore: false,
        error: error.response?.data?.message || error.message || 'Failed to load more movies',
      });
    }
  },

  fetchMovieDetail: async (id: number) => {
    set({ isLoadingDetail: true, detailError: null, selectedMovie: null });
    
    try {
      const movie = await movieApi.getMovieById(id);
      set({
        selectedMovie: movie,
        isLoadingDetail: false,
        detailError: null,
      });
    } catch (error: any) {
      set({
        isLoadingDetail: false,
        detailError: error.response?.data?.message || error.message || 'Failed to fetch movie details',
      });
    }
  },

  searchMovies: async (query: string, page: number = 1) => {
    set({ isLoading: true, error: null, searchQuery: query });
    
    try {
      const response: MoviesResponse = await movieApi.searchMovies(query, page);
      set({
        movies: response.movies,
        currentPage: page,
        totalPages: response.totalPages,
        totalResults: response.totalResults,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || error.message || 'Failed to search movies',
        movies: [],
      });
    }
  },

  setCategory: (category: MovieCategory) => {
    set({ category, searchQuery: '' });
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  clearError: () => {
    set({ error: null });
  },

  clearDetailError: () => {
    set({ detailError: null });
  },

  reset: () => {
    set(initialState);
  },
}));

