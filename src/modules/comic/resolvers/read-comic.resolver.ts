import { Args, Query, Resolver } from '@nestjs/graphql';
import { ReadComicService } from '../services/read-comic.service';
import { ReadComicModel } from '../models/read-comic.model';

@Resolver(() => ReadComicModel)
export class ReadComicResolver {
  constructor(private readonly ReadComicService: ReadComicService) {}

  @Query(() => ReadComicModel)
  async readComic(@Args('slug') slug: string): Promise<ReadComicModel> {
    return this.ReadComicService.readComic(slug);
  }
}
