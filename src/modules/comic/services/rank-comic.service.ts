import { Injectable } from '@nestjs/common';
import { config } from 'dotenv';
import { load } from 'cheerio';
import axios from 'axios';
import { DEFAULT_REDIS_NAMESPACE, InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { NewComicInput } from '../dto/new-comic.input';
import {
  REDIS_TOP_MONTH_COMIC_KEY_EXPIRE,
  TOP_MOTH_PARAMETERS,
  REDIS_TOP_MONTH_KEY,
  REDIS_TOP_WEEK_KEY,
  TOP_WEEK_PARAMETERS,
  REDIS_TOP_DAY_KEY,
  TOP_DAY_PARAMETERS,
  REDIS_TOP_DAY_COMIC_KEY_EXPIRE,
  REDIS_TOP_WEEK_COMIC_KEY_EXPIRE,
} from 'src/const';
import { RankComicInput } from '../dto/rank-comic.input';

config();

@Injectable()
export class RankComicService {
  constructor(@InjectRedis(DEFAULT_REDIS_NAMESPACE) private readonly redis: Redis) {}

  async getTopMonthComic(page: number = null): Promise<Array<NewComicInput>> {
    const KEY_MONTH = REDIS_TOP_MONTH_KEY + '_' + (page ?? 1);

    if (await this.redis.exists(KEY_MONTH)) {
      return JSON.parse(await this.redis.get(KEY_MONTH));
    }

    let url = process.env.URL_NT + TOP_MOTH_PARAMETERS;

    if (page && page > 1) url += '?page=' + page;

    const topMonthComics: RankComicInput[] = await this.getComicWithParameters<RankComicInput>(url);

    await this.redis.setex(
      KEY_MONTH,
      REDIS_TOP_MONTH_COMIC_KEY_EXPIRE,
      JSON.stringify(topMonthComics),
    );

    return topMonthComics;
  }

  async getTopWeekComic(page = 1): Promise<Array<NewComicInput>> {
    const KEY_WEEK = REDIS_TOP_WEEK_KEY + '_' + (page ?? 1);

    if (await this.redis.exists(KEY_WEEK)) {
      return JSON.parse(await this.redis.get(KEY_WEEK));
    }

    let url = process.env.URL_NT + TOP_WEEK_PARAMETERS;

    if (page > 1) url += '?page=' + page;

    const topWeekComics: RankComicInput[] = await this.getComicWithParameters<RankComicInput>(url);

    await this.redis.setex(
      KEY_WEEK,
      REDIS_TOP_WEEK_COMIC_KEY_EXPIRE,
      JSON.stringify(topWeekComics),
    );

    return topWeekComics;
  }

  async getTopDayComic(page = 1): Promise<Array<NewComicInput>> {
    const KEY_DAY = REDIS_TOP_DAY_KEY + '_' + (page ?? 1);

    if (await this.redis.exists(KEY_DAY)) {
      return JSON.parse(await this.redis.get(KEY_DAY));
    }

    let url = process.env.URL_NT + TOP_DAY_PARAMETERS;

    if (page > 1) url += '?page=' + page;

    const topDayComics: RankComicInput[] = await this.getComicWithParameters<RankComicInput>(url);

    await this.redis.setex(KEY_DAY, REDIS_TOP_DAY_COMIC_KEY_EXPIRE, JSON.stringify(topDayComics));

    return topDayComics;
  }

  public async getComicWithParameters<T>(url: string): Promise<T[]> {
    const rankComics: T[] = [];

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
      const item: any = {
        title,
        imageSrc,
        slug,
        views,
        likes,
        chapIndexText,
        chapUpdatedAtText,
      };
      rankComics.push(item);
    });
    return rankComics;
  }
}
