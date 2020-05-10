import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Queue } from 'bull';
import { SiteService } from '../site/site.service';

/**
 * Crawler working with RSS sources. Should never be directly revoked.
 */
@Injectable()
export class CrawlerService {
  private readonly logger = new Logger(CrawlerService.name);
  constructor(
    private readonly siteService: SiteService,
    @InjectQueue('crawler') private crawlerQueue: Queue
  ) {}

  /**
   * Periodically add all recorded sites to the crawler queue.
   */
  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    this.logger.debug('Corn task of Crawler started');
    const siteList = await this.siteService.getAll();
    for (const site of siteList) {
      // Only updates those subscribed
      if (site.url != undefined) {
        this.crawlerQueue.add(site);
      }
    }
  }
}
