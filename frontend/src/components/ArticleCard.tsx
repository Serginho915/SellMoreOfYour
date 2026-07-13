import { Clock, Eye } from 'lucide-react';
import type { Article } from '../domain';
import { navigate } from '../lib/navigation';

export function ArticleCard({ article }: { article: Article }) {
  return (
    <article
      className="article-card"
      role="link"
      tabIndex={0}
      onClick={() => navigate(`/articles/${article.slug}`)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          navigate(`/articles/${article.slug}`);
        }
      }}
    >
      <span className="image-wrap">
        <img className="cover" src={article.cover} alt="" />
      </span>
      <div className="card-body">
        <div className="tag-row">
          <span>{article.category}</span>
        </div>
        <h3>{article.title}</h3>
        <p>{article.excerpt}</p>
        <footer className="card-meta">
          <span><Clock size={14} /> {article.readingTime} min</span>
          <span><Eye size={14} /> {article.views.toLocaleString()}</span>
        </footer>
      </div>
    </article>
  );
}
