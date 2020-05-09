import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Job, Queue } from 'bull';
import { parse as parseUrl } from 'url';
import { ArticleService } from '../article/article.service';
import { CreateArticleDto } from '../article/dto/create-article.dto';
import { DynamicPageArchivingService } from '../dynamic-page-archiving/dynamic-page-archiving.service';

@Injectable()
export class FulltextExtractionService {
  constructor(
    @InjectQueue('fulltext-extration') private fulltextExtractionQueue: Queue,
    private readonly articleService: ArticleService,
    private readonly dynamicPageArchivingService: DynamicPageArchivingService
  ) {}
  async extractAndSave(candidateArticle: CreateArticleDto) {
    // The source doesn't provide fulltext
    if (candidateArticle.site.dynamicLoading) {
      candidateArticle.html = await this.dynamicPageArchivingService.archive(
        parseUrl(candidateArticle.url)
      );
    }

    // Parse Article
    let job: Job<CreateArticleDto> = await this.fulltextExtractionQueue.add(
      'parse',
      candidateArticle
    );

    let parsedArticle = job.data;
    this.articleService.create(parsedArticle);
  }
}