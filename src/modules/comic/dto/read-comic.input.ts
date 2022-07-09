import { Field, InputType } from '@nestjs/graphql';
import { ComicDetailChapterInput } from './comic-detail.input';

@InputType()
export class ReadComicInput {
  @Field(() => [String])
  imageSrcList: string[];

  @Field()
  currentChapterIndexText: string;

  @Field()
  currentChapterIndex: number;

  @Field()
  currentChapterHref: string;

  @Field()
  previousChapterHref: string;

  @Field()
  nextChapterHref: string;

  @Field(() => [ComicDetailChapterInput])
  chapters: ComicDetailChapterInput[];
}
