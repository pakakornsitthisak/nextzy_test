import { Movie, MovieDetail } from '../../presentation/dto/movie.dto';

export interface IMovieRepository {
  getPopularMovies(page?: number): Promise<{ movies: Movie[]; totalPages: number; totalResults: number }>;
  getTopRatedMovies(page?: number): Promise<{ movies: Movie[]; totalPages: number; totalResults: number }>;
  getNowPlayingMovies(page?: number): Promise<{ movies: Movie[]; totalPages: number; totalResults: number }>;
  getUpcomingMovies(page?: number): Promise<{ movies: Movie[]; totalPages: number; totalResults: number }>;
  getMovieById(id: number): Promise<MovieDetail>;
  searchMovies(query: string, page?: number): Promise<{ movies: Movie[]; totalPages: number; totalResults: number }>;
}

