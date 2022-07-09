import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ReccommendedComicInput {
  @Field()
  title: string;

  @Field()
  imageSrc: string;

  @Field()
  chapIndexText: string;

  @Field()
  slug: string;

  @Field()
  chapUpdatedAtText: string;
}
