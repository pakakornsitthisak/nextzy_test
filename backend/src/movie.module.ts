import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { MovieController } from './presentation/controllers/movie.controller';
import { MovieRepository } from './data/repositories/movie.repository';
import { OMDbDataSource } from './data/datasources/omdb.datasource';
import { GetMoviesUseCase } from './application/use-cases/get-movies.use-case';
import { GetMovieDetailUseCase } from './application/use-cases/get-movie-detail.use-case';
import { SearchMoviesUseCase } from './application/use-cases/search-movies.use-case';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [MovieController],
  providers: [
    OMDbDataSource,
    {
      provide: 'IMovieRepository',
      useClass: MovieRepository,
    },
    MovieRepository,
    GetMoviesUseCase,
    GetMovieDetailUseCase,
    SearchMoviesUseCase,
  ],
})
export class MovieModule {}

