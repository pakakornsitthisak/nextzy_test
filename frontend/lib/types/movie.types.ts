export interface Movie {
  id: number;
  title: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string;
  voteAverage: number;
  voteCount: number;
  popularity: number;
  genreIds?: number[];
  genres?: Genre[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface MovieDetail extends Movie {
  runtime: number;
  budget: number;
  revenue: number;
  tagline: string;
  homepage: string;
  productionCompanies: ProductionCompany[];
  spokenLanguages: SpokenLanguage[];
  status: string;
}

export interface ProductionCompany {
  id: number;
  name: string;
  logoPath: string | null;
  originCountry: string;
}

export interface SpokenLanguage {
  englishName: string;
  iso6391: string;
  name: string;
}

export type MovieCategory = 'popular' | 'top_rated' | 'now_playing' | 'upcoming';

export interface MoviesResponse {
  movies: Movie[];
  totalPages: number;
  totalResults: number;
}

