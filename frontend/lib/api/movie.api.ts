import axios from 'axios';
import { Movie, MovieDetail, MovieCategory, MoviesResponse } from '../types/movie.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const movieApi = {
  getMovies: async (category: MovieCategory = 'popular', page: number = 1): Promise<MoviesResponse> => {
    const response = await apiClient.get<MoviesResponse>('/api/movies', {
      params: { category, page },
    });
    return response.data;
  },

  getMovieById: async (id: number): Promise<MovieDetail> => {
    const response = await apiClient.get<MovieDetail>(`/api/movies/${id}`);
    return response.data;
  },

  searchMovies: async (query: string, page: number = 1): Promise<MoviesResponse> => {
    const response = await apiClient.get<MoviesResponse>('/api/movies/search', {
      params: { query, page },
    });
    return response.data;
  },
};

