import { Injectable, Inject } from '@nestjs/common';
import type { IMovieRepository } from '../../domain/interfaces/movie.repository.interface';
import { MovieDetail } from '../../presentation/dto/movie.dto';

@Injectable()
export class GetMovieDetailUseCase {
  constructor(@Inject('IMovieRepository') private readonly movieRepository: IMovieRepository) {}

  async execute(id: number): Promise<MovieDetail> {
    return this.movieRepository.getMovieById(id);
  }
}

