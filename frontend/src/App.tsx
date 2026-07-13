import { useEffect, useState } from 'react';
import { getPost, getPosts } from './api';
import type { Post } from './domain';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { AboutPage } from './pages/AboutPage';
import { AdminPanel } from './pages/AdminPanel';
import { ArticlePage } from './pages/ArticlePage';
import { ArticlesPage } from './pages/ArticlesPage';
import { HomePage } from './pages/HomePage';
import { toArticle } from './lib/articles';

export default function App() {
  const [route, setRoute] = useState(() => `${window.location.pathname}${window.location.search}`);
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const syncRoute = () => setRoute(`${window.location.pathname}${window.location.search}`);
    window.addEventListener('popstate', syncRoute);
    window.addEventListener('app:navigate', syncRoute);
    return () => {
      window.removeEventListener('popstate', syncRoute);
      window.removeEventListener('app:navigate', syncRoute);
    };
  }, []);

  useEffect(() => {
    getPosts().then(setPosts).catch((err) => setError(err instanceof Error ? err.message : 'Could not load articles.'));
  }, []);

  const articles = posts.map(toArticle);
  const [path] = route.split('?');
  const searchParams = new URLSearchParams(route.includes('?') ? route.slice(route.indexOf('?')) : '');
  const initialSearch = searchParams.get('search') || '';
  const slug = path.startsWith('/articles/') ? decodeURIComponent(path.replace('/articles/', '')) : '';
  const article = slug ? articles.find((item) => item.slug === slug) : undefined;

  useEffect(() => {
    if (!slug || article || posts.length === 0) return;
    getPost(slug)
      .then((post) => setPosts((current) => current.some((item) => item.slug === post.slug) ? current : [post, ...current]))
      .catch(() => undefined);
  }, [slug, article, posts.length]);

  return (
    <>
      <Header />
      {error && <div className="load-error">{error}</div>}
      {path === '/admin' ? <AdminPanel /> : path === '/about' ? <AboutPage /> : path === '/articles' ? <ArticlesPage articles={articles} initialQuery={initialSearch} /> : slug ? <ArticlePage article={article} /> : <HomePage articles={articles} />}
      {path !== '/admin' && <Footer />}
    </>
  );
}
