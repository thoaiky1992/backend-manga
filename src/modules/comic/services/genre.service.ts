import { Injectable } from '@nestjs/common';
import { config } from 'dotenv';
import { load } from 'cheerio';
import axios from 'axios';
import { DEFAULT_REDIS_NAMESPACE, InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { SEARCH_COMIC } from 'src/const';
import { GenreInput } from '../dto/genre.input';
import { ComicByAsPathInput } from '../dto/comic-by-as-path.input';
import { GenreByAsPathInput } from '../dto/genre-by-as-path.input';
import { ComicByAsPathModel } from '../models/comic-by-as-path.model';
import { GenreByAsPathModel } from '../models/genre-by-as-path.model';

config();

@Injectable()
export class GenreService {
  constructor(@InjectRedis(DEFAULT_REDIS_NAMESPACE) private readonly redis: Redis) {}

  async getGenre(): Promise<Array<GenreInput>> {
    const data: Array<GenreInput> = [
      { title: 'Action', slug: 'action-95' },
      { title: 'Anime', slug: 'anime' },
      { title: 'Comic', slug: 'comic' },
      { title: 'Drama', slug: 'drama-103' },
      { title: 'Đam mỹ', slug: 'dam-my' },
      { title: 'Horror', slug: 'horror' },
      { title: 'Live action', slug: 'live-action' },
      { title: 'Manga', slug: 'manga-112' },
      { title: 'Ngôn tình', slug: 'ngon-tinh' },
      { title: 'Comic', slug: 'comic' },
      { title: 'School life', slug: 'school-life' },
      { title: 'Tạp chí truyện tranh', slug: 'tap-chi-truyen-tranh' },
      { title: 'Thiếu nhi', slug: 'thieu-nhi' },
      { title: 'Trinh thám', slug: 'trinh-tham' },
      { title: 'Truyện màu', slug: 'truyen-mau' },
      { title: 'Xuyên không', slug: 'xuyen-khong-205' },
    ];
    return data;
  }

  async getComicByAsPath(asPath: string, page = 1): Promise<GenreByAsPathInput> {
    let url = process.env.URL_NT + SEARCH_COMIC + '/' + asPath;

    if (page && page > 1) url += '?page=' + page;

    const data: GenreByAsPathInput = await this.getGenreDetailComicWithParams(url);

    return data;
  }

  public async getGenreDetailComicWithParams(url: string): Promise<GenreByAsPathInput> {
    const data: GenreByAsPathInput = {
      totalPage: 1,
      comics: [],
    };

    try {
      const html = (await axios.get(url)).data;

      if (html.status === 404) return data;

      const $ = load(html);

      $('#ctl00_divCenter .items .item').each((i, el) => {
        const title = $(el).find('figcaption > h3 > a').text();
        const href = $(el).find('figcaption > h3 > a').attr('href');
        const slug = href.split('/')[href.split('/').length - 1];
        const imageSrc = 'http:' + $(el).find('.image > a > img').attr('data-original');
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
        const item: ComicByAsPathInput = {
          title,
          imageSrc,
          slug,
          views,
          likes,
          chapIndexText,
          chapUpdatedAtText,
        };
        data.comics.push(item);
      });
      const existPage = $('.pagination li:last-child a').attr('href');
      if (existPage) {
        data.totalPage = Number(
          existPage
            .match(/page=(.*)/gm)[0]
            .split('&')[0]
            .split('=')[1],
        );
      }
      return data;
    } catch (e) {
      return data;
    }
  }
}
