import { Args, Query, Resolver } from '@nestjs/graphql';
import { RecommendedComicService } from '../services/recommended-comic.service';
import { ReccommendedComicModel } from '../models/reccommended-comic.model';

@Resolver(() => ReccommendedComicModel)
export class RecommendedComicResolver {
  constructor(private readonly recommendedComicService: RecommendedComicService) {}

  @Query(() => [ReccommendedComicModel])
  async getRecommendedComic(): Promise<ReccommendedComicModel[]> {
    return this.recommendedComicService.getRecommendedComic();
  }
}
