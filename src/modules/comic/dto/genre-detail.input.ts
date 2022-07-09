import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GenreDetailInput {
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
