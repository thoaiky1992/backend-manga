import { Injectable } from '@nestjs/common';
import { ReccommendedComicInput } from '../dto/reccommended-comic.input';
import { config } from 'dotenv';
import { load } from 'cheerio';
import axios from 'axios';
import { ReccommendedComicModel } from '../models/reccommended-comic.model';
import { DEFAULT_REDIS_NAMESPACE, InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { REDIS_RECOMMENDED_COMIC_KEY, REDIS_RECOMMENDED_COMIC_KEY_EXPIRE } from 'src/const';

config();

@Injectable()
export class RecommendedComicService {
  constructor(@InjectRedis(DEFAULT_REDIS_NAMESPACE) private readonly redis: Redis) {}

  async getRecommendedComic(): Promise<Array<ReccommendedComicInput>> {
    if (await this.redis.exists(REDIS_RECOMMENDED_COMIC_KEY)) {
      return JSON.parse(await this.redis.get(REDIS_RECOMMENDED_COMIC_KEY));
    }

    const data: Array<ReccommendedComicInput> = [];

    const url = String(process.env.URL_NT);

    const html = (await axios.get(url)).data;

    const $ = load(html);

    $('.lazyOwl').each(function () {
      const dom = $(this).parent().parent();
      const imageSrc = 'https:' + dom.find('.item > a > img').attr('data-src');
      const href = dom.find('.item > a').attr('href');
      const slug = href.split('/')[href.split('/').length - 1];
      const title = dom.find('.slide-caption > h3 > a').text();
      const chapIndexText = dom.find('.slide-caption > a').text();
      const chapUpdatedAtText = dom
        .find('.slide-caption > .time')
        .text()
        .replace(/(<([^>]+)>)/gi, '')
        .replace(/(\r\n|\n|\r)/gm, '')
        .trim();
      const item: ReccommendedComicModel = {
        title,
        slug,
        imageSrc,
        chapIndexText,
        chapUpdatedAtText,
      };
      data.push(item);
    });
    await this.redis.setex(
      REDIS_RECOMMENDED_COMIC_KEY,
      REDIS_RECOMMENDED_COMIC_KEY_EXPIRE,
      JSON.stringify(data),
    );
    return data;
  }
}
