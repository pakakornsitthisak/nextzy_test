import { Controller, Get, Query, Param, ParseIntPipe, HttpException, HttpStatus } from '@nestjs/common';
import { GetMoviesUseCase, MovieCategory } from '../../application/use-cases/get-movies.use-case';
import { GetMovieDetailUseCase } from '../../application/use-cases/get-movie-detail.use-case';
import { SearchMoviesUseCase } from '../../application/use-cases/search-movies.use-case';
import { GetMoviesQueryDto, GetMovieDetailParamsDto, SearchMoviesQueryDto } from '../dto/movie.dto';

@Controller('api/movies')
export class MovieController {
  constructor(
    private readonly getMoviesUseCase: GetMoviesUseCase,
    private readonly getMovieDetailUseCase: GetMovieDetailUseCase,
    private readonly searchMoviesUseCase: SearchMoviesUseCase,
  ) {}

  @Get()
  async getMovies(@Query() query: GetMoviesQueryDto) {
    try {
      const category = (query.category as MovieCategory) || MovieCategory.POPULAR;
      const page = query.page || 1;

      if (!Object.values(MovieCategory).includes(category)) {
        throw new HttpException('Invalid category', HttpStatus.BAD_REQUEST);
      }

      return await this.getMoviesUseCase.execute(category, page);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to fetch movies', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('search')
  async searchMovies(@Query() query: SearchMoviesQueryDto) {
    try {
      const page = query.page || 1;
      return await this.searchMoviesUseCase.execute(query.query, page);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to search movies', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async getMovieDetail(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.getMovieDetailUseCase.execute(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(`Failed to fetch movie ${id}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

