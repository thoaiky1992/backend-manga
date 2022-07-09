import { Args, Query, Resolver } from '@nestjs/graphql';
import { GenreByAsPathModel } from '../models/genre-by-as-path.model';
import { ComicDetailModel } from '../models/comic-detail.model';
import { ComicDetailService } from '../services/comic-detail.service';

@Resolver(() => ComicDetailModel)
export class ComicDetailResolver {
  constructor(private readonly comicDetailService: ComicDetailService) {}

  @Query(() => ComicDetailModel)
  async getComicDetailBySlug(
    @Args('slug') slug: string,
    @Args('page', { defaultValue: 1 }) page: number,
  ): Promise<ComicDetailModel> {
    return this.comicDetailService.getComicDetailBySlug(slug, page);
  }
}
