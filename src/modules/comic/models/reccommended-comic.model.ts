import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ReccommendedComicModel {
  @Field()
  title: string;

  @Field()
  chapIndexText: string;

  @Field()
  imageSrc: string;

  @Field()
  slug: string;

  @Field()
  chapUpdatedAtText: string;
}
