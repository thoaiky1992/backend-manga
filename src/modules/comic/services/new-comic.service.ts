import { Injectable } from '@nestjs/common';
import { config } from 'dotenv';
import { load } from 'cheerio';
import axios from 'axios';
import { DEFAULT_REDIS_NAMESPACE, InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { NewComicInput } from '../dto/new-comic.input';
import { REDIS_NEW_COMIC_KEY, REDIS_NEW_COMIC_KEY_EXPIRE } from 'src/const';

config();

@Injectable()
export class NewComicService {
  constructor(@InjectRedis(DEFAULT_REDIS_NAMESPACE) private readonly redis: Redis) {}

  async getNewComic(page = 1): Promise<Array<NewComicInput>> {
    const REDIS_KEY = REDIS_NEW_COMIC_KEY + '_' + page;
    if (await this.redis.exists(REDIS_KEY)) {
      return JSON.parse(await this.redis.get(REDIS_KEY));
    }

    const data: Array<NewComicInput> = [];

    let url = process.env.URL_NT;

    if (page > 1) url += '/?page=' + page;

    const html = (await axios.get(url)).data;

    const $ = load(html);

    $('#ctl00_divCenter .items .item').each((i, el) => {
      const title = $(el).find('figcaption > h3 > a').text();
      const href = $(el).find('figcaption > h3 > a').attr('href');
      const slug = href.split('/')[href.split('/').length - 1];
      const imageSrc = 'https:' + $(el).find('.image > a > img').attr('data-original');
      const rate = $(el)
        .find('.image .view span')
        .text()
        .replace(/(<([^>]+)>)/gi, '')
        .replace(/(\r\n|\n|\r)/gm, '')
        .trim()
        .split(' ');
      const views = rate[0] || '0';
      const likes = rate[4] || '0';

      const chapterLatest = $(el).find('figcaption ul li')[0];
      const chapIndexText = $(chapterLatest).find('a').text();
      const chapUpdatedAtText = $(chapterLatest).find('i').text();
      const item: NewComicInput = {
        title,
        imageSrc,
        slug,
        views,
        likes,
        chapIndexText,
        chapUpdatedAtText,
      };
      data.push(item);
    });

    await this.redis.setex(REDIS_KEY, REDIS_NEW_COMIC_KEY_EXPIRE, JSON.stringify(data));

    return data;
  }
}
