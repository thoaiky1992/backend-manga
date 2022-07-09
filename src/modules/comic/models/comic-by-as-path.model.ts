import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ComicByAsPathModel {
  @Field()
  imageSrc: string;

  @Field()
  views: string;

  @Field()
  likes: string;

  @Field()
  title: string;

  @Field()
  chapIndexText: string;

  @Field()
  chapUpdatedAtText: string;

  @Field()
  slug: string;
}
