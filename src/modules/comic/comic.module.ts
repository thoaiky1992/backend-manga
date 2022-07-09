import { Module } from '@nestjs/common';
import { RecommendedComicService } from './services/recommended-comic.service';
import { RecommendedComicResolver } from './resolvers/recommended-comic.resolver';
import { NewComicResolver } from './resolvers/new-comic.resolver';
import { NewComicService } from './services/new-comic.service';
import { RankComicResolver } from './resolvers/rank-comic.resolver';
import { RankComicService } from './services/rank-comic.service';
import { GenreResolver } from './resolvers/genre.resolver';
import { GenreService } from './services/genre.service';
import { ComicDetailResolver } from './resolvers/comic-detail.resolver';
import { ComicDetailService } from './services/comic-detail.service';
import { ReadComicResolver } from './resolvers/read-comic.resolver';
import { ReadComicService } from './services/read-comic.service';
import { SearchComicResolver } from './resolvers/search-comic.resolver';
import { SearchComicService } from './services/search-comic.service';

@Module({
  providers: [
    RecommendedComicService,
    RecommendedComicResolver,
    NewComicResolver,
    NewComicService,
    RankComicResolver,
    RankComicService,
    GenreResolver,
    GenreService,
    ComicDetailResolver,
    ComicDetailService,
    ReadComicResolver,
    ReadComicService,
    SearchComicResolver,
    SearchComicService,
  ],
})
export class ComicModule {}
