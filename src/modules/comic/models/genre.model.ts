import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GenreModel {
  @Field()
  slug: string;

  @Field()
  title: string;
}
