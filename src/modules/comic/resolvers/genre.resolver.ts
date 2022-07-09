import { Args, Query, Resolver } from '@nestjs/graphql';
import { GenreModel } from '../models/genre.model';
import { GenreService } from '../services/genre.service';
import { GenreByAsPathModel } from '../models/genre-by-as-path.model';

@Resolver(() => GenreModel)
export class GenreResolver {
  constructor(private readonly genreService: GenreService) {}

  @Query(() => [GenreModel])
  async getGenre(): Promise<Array<GenreModel>> {
    return this.genreService.getGenre();
  }

  @Query(() => GenreByAsPathModel)
  async getComicByAsPath(
    @Args('asPath') asPath: string,
    @Args('page', { defaultValue: 1 }) page: number,
  ): Promise<GenreByAsPathModel> {
    return this.genreService.getComicByAsPath(asPath, page);
  }
}
