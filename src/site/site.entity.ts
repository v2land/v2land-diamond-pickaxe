import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Article } from '../article/article.entity';

/**
 * This is the news source site entity used across langchao.org
 * Each Site bounds to a specific rule describing the necessary pre-processing before a new article of that site is added
 */
@Entity()
export class Site {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * URLs to RSS endpoint of the site.
   * Should be unique, but it is not the primary key.
   */
  @Column('text', { array: true })
  rssUrls: string[];

  @Column()
  name: string;

  /**
   * Domain site uses.
   */
  @Column('text', { array: true })
  domains?: string[];

  /**
   * Whether articles in this site should go through fulltext extraction module
   */
  @Column({ default: true })
  shouldParseFulltext: boolean;

  /**
   * Whether articles are dynamically loaded.
   * If so, they should be passed through puppeteer to get loaded HTML before enter fulltext extraction module
   */
  @Column({ default: false })
  dynamicLoading: boolean;

  @OneToMany(
    () => Article,
    article => article.site,
    { cascade: true }
  )
  articles: Article[];

  // TODO: @CreateDateColumn @UpdateDateColumn @VersionColumn

  constructor(
    name?: string,
    url?: string[],
    shouldParseFulltext?: boolean,
    dynamicLoading?: boolean
  ) {
    this.rssUrls = url || [];
    this.name = name || '';
    this.shouldParseFulltext = shouldParseFulltext || false;
    this.dynamicLoading = dynamicLoading || false;
  }
}
