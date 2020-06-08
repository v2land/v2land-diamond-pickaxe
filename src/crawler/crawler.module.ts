import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ArticleModule } from '../article/article.module';
import { EnqueueUrlModule } from '../enqueue-url/enqueue-url.module';
import { SiteModule } from '../site/site.module';
import { CrawlerProcessor } from './crawler.processor';
import { CrawlerService } from './crawler.service';

@Module({
  providers: [CrawlerService, CrawlerProcessor],
  imports: [
    ConfigModule,
    SiteModule,
    EnqueueUrlModule,
    ArticleModule,
    BullModule.registerQueueAsync({
      name: 'crawler',
    }),
  ],
})
export class CrawlerModule {}
