import { Injectable } from '@nestjs/common';
import { config } from 'dotenv';
import { DEFAULT_REDIS_NAMESPACE, InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { ComicDetailChapterInput, ComicDetailInput } from '../dto/comic-detail.input';
import axios from 'axios';
import { load } from 'cheerio';
import { DETAIL_COMIC, SEARCH_COMIC } from '../../../const';
import { SearchComicInput } from '../dto/search-comic.input';

config();

@Injectable()
export class SearchComicService {
  constructor(@InjectRedis(DEFAULT_REDIS_NAMESPACE) private readonly redis: Redis) {}

  public async searchComic(keySearch: string, page = 1) {
    const data: SearchComicInput[] = [];
    try {
      const url = process.env.URL_NT + SEARCH_COMIC + '?keyword=' + keySearch;
      const html = (await axios.get(url)).data;

      const $ = load(html);

      $('.ModuleContent .items .item').each((i, el) => {
        const item: SearchComicInput = new SearchComicInput();
        item.slug = $(el).find('.image > a').attr('href').split('truyen-tranh/')[1];
        item.imgSrc = 'https:' + $(el).find('.image > a img').attr('src');
        item.title = $(el).find('figcaption h3 > a').text();
        const rate = $(el)
          .find('.image .view span.pull-left')
          .text()
          .replace(/(<([^>]+)>)/gi, '')
          .replace(/(\r\n|\n|\r)/gm, '')
          .trim()
          .split(' ');
        item.views = rate[0] || '0';
        item.likes = rate[4] || '0';
        item.chapterIndexText = $(el).find('ul  li:first-child > a').text();
        item.updatedAtText = $(el).find('ul  li:first-child > i').text();
        data.push(item);
      });

      return data;
    } catch (e) {
      return data;
    }
  }
}
