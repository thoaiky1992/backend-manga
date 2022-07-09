import { Field, InputType } from '@nestjs/graphql';
import { ComicByAsPathInput } from './comic-by-as-path.input';

@InputType()
export class GenreByAsPathInput {
  @Field()
  comics: ComicByAsPathInput[];

  @Field()
  totalPage: number;
}
