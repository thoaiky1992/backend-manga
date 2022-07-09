import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphqlModule } from './modules/graphql/graphql.module';
import { ComicModule } from './modules/comic/comic.module';
import { RedisCliModule } from './modules/redis/redis.module';

@Module({
  imports: [GraphqlModule, RedisCliModule, ComicModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
