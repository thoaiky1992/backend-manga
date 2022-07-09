import { Args, Query, Resolver } from '@nestjs/graphql';
import { SearchComicModel } from '../models/search-comic.model';
import { SearchComicService } from '../services/search-comic.service';

@Resolver(() => SearchComicModel)
export class SearchComicResolver {
  constructor(private readonly searchComicService: SearchComicService) {}

  @Query(() => [SearchComicModel])
  async searchComic(
    @Args('keySearch') keySearch: string,
    @Args('page', { defaultValue: 1 }) page: number,
  ): Promise<SearchComicModel[]> {
    return this.searchComicService.searchComic(keySearch, page);
  }
}
