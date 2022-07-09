import { Field, ObjectType } from '@nestjs/graphql';
import { ComicByAsPathModel } from '../models/comic-by-as-path.model';

@ObjectType()
export class GenreByAsPathModel {
  @Field((type) => [ComicByAsPathModel])
  comics: ComicByAsPathModel[];

  @Field()
  totalPage: number;
}
