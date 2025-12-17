import { Injectable } from '@nestjs/common';
import { IMovieRepository } from '../../domain/interfaces/movie.repository.interface';
import { Movie, MovieDetail } from '../../presentation/dto/movie.dto';
import { OMDbDataSource } from '../datasources/omdb.datasource';

@Injectable()
export class MovieRepository implements IMovieRepository {
  constructor(private readonly dataSource: OMDbDataSource) {}

  async getPopularMovies(page: number = 1): Promise<{ movies: Movie[]; totalPages: number; totalResults: number }> {
    return this.dataSource.getPopularMovies(page);
  }

  async getTopRatedMovies(page: number = 1): Promise<{ movies: Movie[]; totalPages: number; totalResults: number }> {
    return this.dataSource.getTopRatedMovies(page);
  }

  async getNowPlayingMovies(page: number = 1): Promise<{ movies: Movie[]; totalPages: number; totalResults: number }> {
    return this.dataSource.getNowPlayingMovies(page);
  }

  async getUpcomingMovies(page: number = 1): Promise<{ movies: Movie[]; totalPages: number; totalResults: number }> {
    return this.dataSource.getUpcomingMovies(page);
  }

  async getMovieById(id: number): Promise<MovieDetail> {
    return this.dataSource.getMovieById(id);
  }

  async searchMovies(query: string, page: number = 1): Promise<{ movies: Movie[]; totalPages: number; totalResults: number }> {
    return this.dataSource.searchMovies(query, page);
  }
}

