import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Movie, MovieDetail, Genre, ProductionCompany, SpokenLanguage } from '../../presentation/dto/movie.dto';

export interface OMDbMovieResponse {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: Array<{ Source: string; Value: string }>;
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
  Error?: string;
}

export interface OMDbSearchResponse {
  Search: Array<{
    Title: string;
    Year: string;
    imdbID: string;
    Type: string;
    Poster: string;
  }>;
  totalResults: string;
  Response: string;
  Error?: string;
}

@Injectable()
export class OMDbDataSource {
  private readonly logger = new Logger(OMDbDataSource.name);
  private readonly baseUrl = 'http://www.omdbapi.com';
  private readonly apiKey: string;

  // Popular movie titles for category browsing (since OMDb doesn't have category endpoints)
  private readonly popularMovieTitles = [
    'The Dark Knight', 'Inception', 'Pulp Fiction', 'The Matrix', 'Interstellar',
    'The Godfather', 'Fight Club', 'Forrest Gump', 'The Shawshank Redemption', 'Goodfellas',
    'The Lord of the Rings', 'Star Wars', 'Avatar', 'Titanic', 'Jurassic Park',
    'The Avengers', 'Iron Man', 'Spider-Man', 'Batman', 'Superman',
    'Gladiator', 'Braveheart', 'Saving Private Ryan', 'The Departed', 'Django Unchained'
  ];

  private readonly topRatedMovieTitles = [
    'The Shawshank Redemption', 'The Godfather', 'The Dark Knight', 'The Godfather Part II',
    '12 Angry Men', "Schindler's List", 'The Lord of the Rings: The Return of the King',
    'Pulp Fiction', 'The Lord of the Rings: The Fellowship of the Ring', 'The Good, the Bad and the Ugly',
    'Forrest Gump', 'Fight Club', 'Inception', 'The Lord of the Rings: The Two Towers',
    'Star Wars: Episode V - The Empire Strikes Back', 'The Matrix', 'Goodfellas',
    'One Flew Over the Cuckoo\'s Nest', 'Se7en', 'Seven Samurai', 'City of God',
    'Life Is Beautiful', 'The Silence of the Lambs', 'It\'s a Wonderful Life', 'Modern Times'
  ];

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('OMDB_API_KEY') || '';
    if (!this.apiKey) {
      this.logger.warn('OMDB_API_KEY is not set.');
    }
  }

  private parseRuntime(runtime: string): number {
    if (!runtime || runtime === 'N/A') return 0;
    const match = runtime.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  private parseBoxOffice(boxOffice: string): number {
    if (!boxOffice || boxOffice === 'N/A') return 0;
    const cleaned = boxOffice.replace(/[^0-9]/g, '');
    return cleaned ? parseInt(cleaned, 10) : 0;
  }

  private parseRating(imdbRating: string): number {
    if (!imdbRating || imdbRating === 'N/A') return 0;
    return parseFloat(imdbRating) || 0;
  }

  private parseVotes(votes: string): number {
    if (!votes || votes === 'N/A') return 0;
    const cleaned = votes.replace(/,/g, '');
    return parseInt(cleaned, 10) || 0;
  }

  private parseGenres(genreString: string): Genre[] {
    if (!genreString || genreString === 'N/A') return [];
    return genreString.split(',').map((g, index) => ({
      id: index + 1,
      name: g.trim(),
    })).map(g => new Genre(g));
  }

  private transformMovie(movie: OMDbMovieResponse, imdbID?: string): Movie {
    const releaseYear = movie.Year ? movie.Year.split('–')[0] : '';
    const releaseDate = movie.Released && movie.Released !== 'N/A' 
      ? movie.Released 
      : releaseYear ? `${releaseYear}-01-01` : '';

    return new Movie({
      id: this.imdbIdToNumber(imdbID || movie.imdbID),
      title: movie.Title || 'Unknown',
      overview: movie.Plot || '',
      posterPath: movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : null,
      backdropPath: null, // OMDb doesn't provide backdrop images
      releaseDate: releaseDate,
      voteAverage: this.parseRating(movie.imdbRating) * 10, // Convert IMDB 0-10 scale to 0-100 scale
      voteCount: this.parseVotes(movie.imdbVotes),
      popularity: this.parseVotes(movie.imdbVotes) * 0.1, // Use vote count as popularity proxy
      genres: this.parseGenres(movie.Genre),
    });
  }

  private transformMovieDetail(movie: OMDbMovieResponse): MovieDetail {
    const baseMovie = this.transformMovie(movie);
    const runtime = this.parseRuntime(movie.Runtime);
    const boxOffice = this.parseBoxOffice(movie.BoxOffice);

    return new MovieDetail({
      ...baseMovie,
      runtime,
      budget: 0, // OMDb doesn't provide budget
      revenue: boxOffice,
      tagline: '', // OMDb doesn't provide tagline
      homepage: movie.Website && movie.Website !== 'N/A' ? movie.Website : '',
      productionCompanies: movie.Production && movie.Production !== 'N/A'
        ? [new ProductionCompany({
            id: 1,
            name: movie.Production,
            logoPath: null,
            originCountry: movie.Country && movie.Country !== 'N/A' ? movie.Country.split(',')[0] : '',
          })]
        : [],
      spokenLanguages: movie.Language && movie.Language !== 'N/A'
        ? movie.Language.split(',').map((lang, index) => new SpokenLanguage({
            englishName: lang.trim(),
            iso6391: lang.trim().substring(0, 2).toLowerCase(),
            name: lang.trim(),
          }))
        : [],
      status: movie.Released && movie.Released !== 'N/A' ? 'Released' : 'Unknown',
    });
  }

  // Convert IMDB ID (tt1234567) to number for compatibility
  private imdbIdToNumber(imdbID: string): number {
    if (!imdbID) return 0;
    const match = imdbID.match(/tt(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  // Convert number back to IMDB ID
  private numberToImdbId(id: number): string {
    return `tt${id.toString().padStart(7, '0')}`;
  }

  async getMovieByTitle(title: string): Promise<MovieDetail | null> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<OMDbMovieResponse>(this.baseUrl, {
          params: {
            apikey: this.apiKey,
            t: title,
            plot: 'full',
          },
        })
      );

      if (response.data.Response === 'False' || response.data.Error) {
        this.logger.warn(`Movie not found: ${title}`);
        return null;
      }

      return this.transformMovieDetail(response.data);
    } catch (error) {
      this.logger.error(`Error fetching movie: ${title}`, error);
      return null;
    }
  }

  async getMovieById(id: number): Promise<MovieDetail> {
    try {
      const imdbID = this.numberToImdbId(id);
      const response = await firstValueFrom(
        this.httpService.get<OMDbMovieResponse>(this.baseUrl, {
          params: {
            apikey: this.apiKey,
            i: imdbID,
            plot: 'full',
          },
        })
      );

      if (response.data.Response === 'False' || response.data.Error) {
        throw new Error(`Movie not found: ${imdbID}`);
      }

      return this.transformMovieDetail(response.data);
    } catch (error) {
      this.logger.error(`Error fetching movie ${id}`, error);
      throw new Error(`Failed to fetch movie ${id}`);
    }
  }

  async searchMovies(query: string, page: number = 1): Promise<{ movies: Movie[]; totalPages: number; totalResults: number }> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<OMDbSearchResponse>(this.baseUrl, {
          params: {
            apikey: this.apiKey,
            s: query,
            page,
            type: 'movie',
          },
        })
      );

      if (response.data.Response === 'False' || response.data.Error || !response.data.Search) {
        return { movies: [], totalPages: 0, totalResults: 0 };
      }

      // Fetch full details for each movie
      const moviePromises = response.data.Search.slice(0, 10).map(async (item) => {
        try {
          const detailResponse = await firstValueFrom(
            this.httpService.get<OMDbMovieResponse>(this.baseUrl, {
              params: {
                apikey: this.apiKey,
                i: item.imdbID,
              },
            })
          );

          if (detailResponse.data.Response === 'True' && !detailResponse.data.Error) {
            return this.transformMovie(detailResponse.data, item.imdbID);
          }
          return null;
        } catch (error) {
          this.logger.warn(`Error fetching details for ${item.imdbID}`, error);
          return null;
        }
      });

      const movies = (await Promise.all(moviePromises)).filter((m): m is Movie => m !== null);
      const totalResults = parseInt(response.data.totalResults || '0', 10);
      const totalPages = Math.ceil(totalResults / 10);

      return {
        movies,
        totalPages,
        totalResults,
      };
    } catch (error) {
      this.logger.error('Error searching movies', error);
      throw new Error('Failed to search movies');
    }
  }

  async getMoviesByTitles(titles: string[], page: number = 1): Promise<{ movies: Movie[]; totalPages: number; totalResults: number }> {
    const pageSize = 10;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const titlesPage = titles.slice(startIndex, endIndex);

    const moviePromises = titlesPage.map(title => this.getMovieByTitle(title));
    const movieDetails = (await Promise.all(moviePromises)).filter((m): m is MovieDetail => m !== null);

    // Convert MovieDetail to Movie (extract only Movie properties)
    const movies: Movie[] = movieDetails.map(detail => {
      const movie = new Movie({
        id: detail.id,
        title: detail.title,
        overview: detail.overview,
        posterPath: detail.posterPath,
        backdropPath: detail.backdropPath,
        releaseDate: detail.releaseDate,
        voteAverage: detail.voteAverage,
        voteCount: detail.voteCount,
        popularity: detail.popularity,
        genres: detail.genres,
      });
      return movie;
    });

    const totalResults = titles.length;
    const totalPages = Math.ceil(totalResults / pageSize);

    return {
      movies,
      totalPages,
      totalResults,
    };
  }

  async getPopularMovies(page: number = 1): Promise<{ movies: Movie[]; totalPages: number; totalResults: number }> {
    return this.getMoviesByTitles(this.popularMovieTitles, page);
  }

  async getTopRatedMovies(page: number = 1): Promise<{ movies: Movie[]; totalPages: number; totalResults: number }> {
    return this.getMoviesByTitles(this.topRatedMovieTitles, page);
  }

  async getNowPlayingMovies(page: number = 1): Promise<{ movies: Movie[]; totalPages: number; totalResults: number }> {
    // For now playing, search for recent year movies
    const currentYear = new Date().getFullYear();
    try {
      return await this.searchMovies(currentYear.toString(), page);
    } catch (error) {
      // Fallback to popular movies if search fails
      this.logger.warn('Failed to fetch now playing movies, falling back to popular', error);
      return this.getPopularMovies(page);
    }
  }

  async getUpcomingMovies(page: number = 1): Promise<{ movies: Movie[]; totalPages: number; totalResults: number }> {
    // For upcoming, search for next year movies
    const nextYear = new Date().getFullYear() + 1;
    try {
      return await this.searchMovies(nextYear.toString(), page);
    } catch (error) {
      // Fallback to popular movies if search fails
      this.logger.warn('Failed to fetch upcoming movies, falling back to popular', error);
      return this.getPopularMovies(page);
    }
  }
}

