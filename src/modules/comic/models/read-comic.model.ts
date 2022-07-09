import { Field, ObjectType } from '@nestjs/graphql';
import { ComicDetailChapterModel } from './comic-detail.model';

@ObjectType()
export class ReadComicModel {
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

  @Field(() => [ComicDetailChapterModel])
  chapters: ComicDetailChapterModel[];
}
