import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Article } from '../article/article.entity';

/**
 * This is the news source site entity used across langchao.org
 */
@Entity()
export class Site {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  domains: string[];

  @OneToMany(
    type => Article,
    article => article.siteId,
    { cascade: true }
  )
  articles: Article[];
}
