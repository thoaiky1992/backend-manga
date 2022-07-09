import { Args, Query, Resolver } from '@nestjs/graphql';
import { NewComicModel } from '../models/new-comic.model';
import { NewComicService } from '../services/new-comic.service';

@Resolver(() => NewComicModel)
export class NewComicResolver {
  constructor(private readonly newComicService: NewComicService) {}

  @Query(() => [NewComicModel])
  async getNewComic(
    @Args('page', { defaultValue: 1 }) page: number,
  ): Promise<Array<NewComicModel>> {
    return this.newComicService.getNewComic(page);
  }
}
