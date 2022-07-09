import { Injectable } from '@nestjs/common';
import { config } from 'dotenv';
import { DEFAULT_REDIS_NAMESPACE, InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { ComicDetailChapterInput, ComicDetailInput } from '../dto/comic-detail.input';
import axios from 'axios';
import { load } from 'cheerio';
import { DETAIL_COMIC } from '../../../const';

config();

@Injectable()
export class ComicDetailService {
  constructor(@InjectRedis(DEFAULT_REDIS_NAMESPACE) private readonly redis: Redis) {}

  public async getComicDetailBySlug(slug: string, page = 1) {
    const chapters: ComicDetailChapterInput[] = [];
    const data: ComicDetailInput = {
      title: '',
      imageSrc: '',
      views: '',
      status: '',
      author: '',
      description: '',
      chapters,
    };
    try {
      const url = process.env.URL_NT + DETAIL_COMIC + '/' + slug;
      const html = (await axios.get(url)).data;

      const $ = load(html);

      const detailInfo = $('.detail-info');

      data.title = $('h1.title-detail').text();
      data.imageSrc = 'https:' + $(detailInfo).find('.col-image > img').attr('src');
      data.author = $(detailInfo).find('.col-info > ul .author > .col-xs-8').text();
      data.status = $(detailInfo).find('.col-info > ul .status > .col-xs-8').text();
      data.views = $(detailInfo).find('.col-info > ul li:last-child > .col-xs-8').text();
      data.description = $('.detail-content > p').text();

      $('.list-chapter ul li').each((i, el) => {
        const chapter: ComicDetailChapterInput = {
          chapterIndexText: '',
          href: '',
          updatedAtText: '',
        };
        chapter.chapterIndexText = $(el).find('.chapter a').text();
        chapter.href = $(el).find('.chapter a').attr('href');
        chapter.updatedAtText = $(el).find('div:nth-child(2)').text();
        data.chapters.push(chapter);
      });

      return data;
    } catch (e) {
      return data;
    }
  }
}
