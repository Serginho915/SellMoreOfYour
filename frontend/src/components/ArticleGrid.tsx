import type { Article } from '../domain';
import { ArticleCard } from './ArticleCard';

export function ArticleGrid({ articles }: { articles: Article[] }) {
  return (
    <div className="article-grid">
      {articles.map((article) => <ArticleCard key={article.id} article={article} />)}
    </div>
  );
}
