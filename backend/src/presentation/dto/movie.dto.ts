import { IsOptional, IsNumber, IsString, Min, Max } from 'class-validator';

export class GetMoviesQueryDto {
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;
}

export class GetMovieDetailParamsDto {
  @IsNumber()
  id: number;
}

export class SearchMoviesQueryDto {
  @IsString()
  query: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;
}

export class Movie {
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

  constructor(partial: Partial<Movie>) {
    Object.assign(this, partial);
  }
}
export class Genre {
  id: number;
  name: string;

  constructor(partial: Partial<Genre>) {
    Object.assign(this, partial);
  }
}

export class MovieDetail extends Movie {
  runtime: number;
  budget: number;
  revenue: number;
  tagline: string;
  homepage: string;
  productionCompanies: ProductionCompany[];
  spokenLanguages: SpokenLanguage[];
  status: string;

  constructor(partial: Partial<MovieDetail>) {
    super(partial);
    Object.assign(this, partial);
  }
}

export class ProductionCompany {
  id: number;
  name: string;
  logoPath: string | null;
  originCountry: string;

  constructor(partial: Partial<ProductionCompany>) {
    Object.assign(this, partial);
  }
}

export class SpokenLanguage {
  englishName: string;
  iso6391: string;
  name: string;

  constructor(partial: Partial<SpokenLanguage>) {
    Object.assign(this, partial);
  }
}


