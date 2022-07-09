import { Args, Query, Resolver } from '@nestjs/graphql';
import { RankComicModel } from '../models/rank-comic.model';
import { RankComicService } from '../services/rank-comic.service';

@Resolver(() => RankComicModel)
export class RankComicResolver {
  constructor(private readonly rankComicService: RankComicService) {}

  @Query(() => [RankComicModel])
  async getTopMonthComic(
    @Args('page', { defaultValue: 1 }) page: number,
  ): Promise<Array<RankComicModel>> {
    return this.rankComicService.getTopMonthComic(page);
  }

  @Query(() => [RankComicModel])
  async getTopWeekComic(
    @Args('page', { defaultValue: 1 }) page: number,
  ): Promise<Array<RankComicModel>> {
    return this.rankComicService.getTopWeekComic(page);
  }

  @Query(() => [RankComicModel])
  async getTopDayComic(
    @Args('page', { defaultValue: 1 }) page: number,
  ): Promise<Array<RankComicModel>> {
    return this.rankComicService.getTopDayComic(page);
  }
}
