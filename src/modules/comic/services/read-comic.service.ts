import { Injectable } from '@nestjs/common';
import { config } from 'dotenv';
import { DEFAULT_REDIS_NAMESPACE, InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import axios from 'axios';
import { load } from 'cheerio';
import { DETAIL_COMIC, READ_COMIC } from '../../../const';
import { ReadComicInput } from '../dto/read-comic.input';
import { ComicDetailChapterInput } from '../dto/comic-detail.input';

config();

@Injectable()
export class ReadComicService {
  constructor(@InjectRedis(DEFAULT_REDIS_NAMESPACE) private readonly redis: Redis) {}

  public async readComic(slug: string) {
    const chapters: ComicDetailChapterInput[] = [];
    const data: ReadComicInput = {
      imageSrcList: [],
      currentChapterIndex: 1,
      currentChapterIndexText: '',
      currentChapterHref: '',
      previousChapterHref: 'asd',
      nextChapterHref: 'asd',
      chapters,
    };
    try {
      const url1 = process.env.URL_NT + READ_COMIC + '/' + slug;
      const url2 = process.env.URL_NT + DETAIL_COMIC + '/' + slug.split('/')[0];
      const html = (await axios.get(url1)).data;
      const html2 = (await axios.get(url2)).data;

      const $1 = load(html);
      const $2 = load(html2);

      $1('.reading-detail .page-chapter').each((i, el) => {
        data.imageSrcList.push('https:' + $1(el).find('img').attr('src'));
      });

      data.currentChapterIndexText = $1('.reading .top h1 span').text().split('-')[1].trim();
      data.currentChapterIndex = Number(
        $1('.reading .top h1 span').text().split('-')[1].trim().split(' ')[1],
      );

      $2('.list-chapter ul li').each((i, el) => {
        const chapter: ComicDetailChapterInput = {
          chapterIndexText: '',
          href: '',
          updatedAtText: '',
        };
        chapter.chapterIndexText = $2(el).find('.chapter a').text();
        chapter.href = $2(el).find('.chapter a').attr('href');
        chapter.updatedAtText = $2(el).find('div:nth-child(2)').text();
        chapters.push(chapter);
      });
      chapters.forEach((chapter, index) => {
        if (chapter.href === url1) {
          data.nextChapterHref = chapters[index - 1]?.href ?? '';
          data.previousChapterHref = chapters[index + 1]?.href ?? '';
        }
      });

      data.currentChapterHref = url1;

      return data;
    } catch (e) {
      return data;
    }
  }
}
