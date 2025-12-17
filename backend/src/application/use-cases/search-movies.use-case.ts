import { Injectable, Inject } from '@nestjs/common';
import type { IMovieRepository } from '../../domain/interfaces/movie.repository.interface';
import { Movie } from '../../presentation/dto/movie.dto';

@Injectable()
export class SearchMoviesUseCase {
  constructor(@Inject('IMovieRepository') private readonly movieRepository: IMovieRepository) {}

  async execute(query: string, page: number = 1): Promise<{ movies: Movie[]; totalPages: number; totalResults: number }> {
    if (!query || query.trim().length === 0) {
      return { movies: [], totalPages: 0, totalResults: 0 };
    }
    return this.movieRepository.searchMovies(query.trim(), page);
  }
}

