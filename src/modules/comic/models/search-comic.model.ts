import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SearchComicModel {
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
