import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ComicDetailChapterModel {
  @Field()
  chapterIndexText: string;

  @Field()
  updatedAtText: string;

  @Field()
  href: string;
}

@ObjectType()
export class ComicDetailModel {
  @Field()
  imageSrc: string;

  @Field()
  title: string;

  @Field()
  author: string;

  @Field()
  status: string;

  @Field()
  views: string;

  @Field()
  description: string;

  @Field(() => [ComicDetailChapterModel])
  chapters: ComicDetailChapterModel[];
}
