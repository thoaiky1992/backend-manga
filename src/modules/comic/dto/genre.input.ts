import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GenreInput {
  @Field()
  title: string;

  @Field()
  slug: string;
}
