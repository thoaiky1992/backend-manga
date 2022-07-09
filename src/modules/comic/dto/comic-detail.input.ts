import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ComicDetailChapterInput {
  @Field()
  chapterIndexText: string;

  @Field()
  updatedAtText: string;

  @Field()
  href: string;
}

@InputType()
export class ComicDetailInput {
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

  @Field(() => [ComicDetailChapterInput])
  chapters: ComicDetailChapterInput[];
}
