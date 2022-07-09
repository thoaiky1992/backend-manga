import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SearchComicInput {
  @Field()
  imgSrc: string;

  @Field()
  title: string;

  @Field()
  views: string;

  @Field()
  likes: string;

  @Field()
  chapterIndexText: string;

  @Field()
  updatedAtText: string;

  @Field()
  slug: string;
}
