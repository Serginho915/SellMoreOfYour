import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import type { Article } from '../domain';
import { ArticleGrid } from '../components/ArticleGrid';

export function ArticlesPage({ articles, initialQuery = '' }: { articles: Article[]; initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return articles;
    return articles.filter((article) => [article.title, article.excerpt, article.category, ...article.tags].join(' ').toLowerCase().includes(q));
  }, [articles, query]);

  return (
    <main className="shell archive-page">
      <section className="article-hero">
        <p className="hero-overline">All articles</p>
        <h1>The archive</h1>
        <p className="article-lead">Browse essays on sales psychology, persuasion, trust, communication, and the odd little rituals buyers use to feel safe.</p>
      </section>
      <div className="filters">
        <label className="search-input-wrap">
          <Search size={18} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search objections, trust, closing, persuasion..." />
        </label>
      </div>
      <ArticleGrid articles={filtered} />
    </main>
  );
}
