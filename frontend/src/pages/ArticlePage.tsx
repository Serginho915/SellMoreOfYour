import type { Article } from '../domain';
import { ShareBar } from '../components/ShareBar';
import { navigate } from '../lib/navigation';

export function ArticlePage({ article }: { article?: Article }) {
  if (!article) {
    return (
      <main className="shell not-found">
        <div className="not-found-copy">
          <p className="not-found-overline">404</p>
          <h1>Article not found</h1>
          <p>The guide you requested is not available.</p>
          <div className="not-found-actions">
            <button className="btn primary" onClick={() => navigate('/articles')}>Back to archive</button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="shell article-page">
      <section className="article-hero">
        <p className="author-line">Andrey Nikoloff</p>
        <div className="tag-row">{article.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        <h1>{article.title}</h1>
        <p className="article-lead">{article.excerpt}</p>
      </section>
      <div className="article-cover">
        <img className="cover" src={article.cover} alt="" />
      </div>
      <ShareBar title={article.title} url={`/articles/${article.slug}`} />
      <article className="markdown" dangerouslySetInnerHTML={{ __html: article.contentHtml }} />
      <button className="btn secondary" onClick={() => navigate('/articles')}>Back to all articles</button>
    </main>
  );
}
