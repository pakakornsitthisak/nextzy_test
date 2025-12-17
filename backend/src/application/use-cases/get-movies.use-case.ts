import { Injectable, Inject } from '@nestjs/common';
import type { IMovieRepository } from '../../domain/interfaces/movie.repository.interface';
import { Movie } from '../../presentation/dto/movie.dto';

export enum MovieCategory {
  POPULAR = 'popular',
  TOP_RATED = 'top_rated',
  NOW_PLAYING = 'now_playing',
  UPCOMING = 'upcoming',
}

@Injectable()
export class GetMoviesUseCase {
  constructor(@Inject('IMovieRepository') private readonly movieRepository: IMovieRepository) {}

  async execute(category: MovieCategory, page: number = 1): Promise<{ movies: Movie[]; totalPages: number; totalResults: number }> {
    switch (category) {
      case MovieCategory.POPULAR:
        return this.movieRepository.getPopularMovies(page);
      case MovieCategory.TOP_RATED:
        return this.movieRepository.getTopRatedMovies(page);
      case MovieCategory.NOW_PLAYING:
        return this.movieRepository.getNowPlayingMovies(page);
      case MovieCategory.UPCOMING:
        return this.movieRepository.getUpcomingMovies(page);
      default:
        return this.movieRepository.getPopularMovies(page);
    }
  }
}

