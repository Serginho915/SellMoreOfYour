import { useEffect, useMemo, useState } from 'react';
import { Clock, Eye, FilePlus, RefreshCw, Save, Search, Trash2, Wand2 } from 'lucide-react';
import { getPost, getPosts, request, subscribe } from './api';
import type { AdminSettings, Article, Post } from './domain';

const covers = ['/covers/cover1.png', '/covers/cover2.png', '/covers/cover3.png', '/covers/cover4.png'];
const weekdays = [
  { value: 1, label: 'Mon' },
  { value: 2, label: 'Tue' },
  { value: 3, label: 'Wed' },
  { value: 4, label: 'Thu' },
  { value: 5, label: 'Fri' },
  { value: 6, label: 'Sat' },
  { value: 0, label: 'Sun' },
];

type DraftPost = {
  title: string;
  slug: string;
  excerpt: string;
  contentHtml: string;
  status: 'draft' | 'published';
  tags: string;
};

const emptyDraft: DraftPost = { title: '', slug: '', excerpt: '', contentHtml: '<h2>Introduction</h2><p></p>', status: 'published', tags: '' };

function pickCover(seed: string) {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }
  return covers[hash % covers.length];
}

function toArticle(post: Post, index = 0): Article {
  const tag = post.tags[0] || (post.source === 'ai' ? 'Sales Psychology' : 'Selling');
  return {
    ...post,
    cover: pickCover(post.slug || post.title),
    category: tag.replace(/\b\w/g, (letter) => letter.toUpperCase()),
    readingTime: Math.max(5, Math.ceil(post.contentHtml.replace(/<[^>]+>/g, '').split(/\s+/).length / 180)),
    views: 2400 + index * 420,
  };
}

function navigate(path: string) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new Event('app:navigate'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function Header() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <button className="brand" onClick={() => navigate('/')}>SellMoreOfYour</button>
        <nav className="nav">
          <button onClick={() => navigate('/articles')}>Articles</button>
          <button onClick={() => navigate('/about')}>About</button>
        </nav>
      </div>
    </header>
  );
}

function ArticleCard({ article }: { article: Article }) {
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

function ArticleGrid({ articles }: { articles: Article[] }) {
  return (
    <div className="article-grid">
      {articles.map((article) => <ArticleCard key={article.id} article={article} />)}
    </div>
  );
}

function Newsletter() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      await subscribe(email);
      setEmail('');
      setMessage('You are subscribed. The next sales field note is on the way.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not subscribe right now.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="newsletter-form" onSubmit={submit}>
      <div className="newsletter-input-row">
        <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="you@example.com" required disabled={busy} />
        <button disabled={busy}>{busy ? 'Subscribing...' : 'Subscribe'}</button>
      </div>
      {message && <p className={`newsletter-message ${message.includes('subscribed') ? 'success' : 'error'}`}>{message}</p>}
    </form>
  );
}

function HomePage({ articles }: { articles: Article[] }) {
  const featured = articles.slice(0, 6);

  return (
    <>
      <section className="hero">
        <div className="shell hero-grid">
          <div className="hero-copy">
            <p className="hero-overline">Andrey Nikoloff / SellMoreOfYour</p>
            <h1>Sell with psychology, not pressure.</h1>
            <p>
              Field notes on persuasion, trust, buying behavior, and the quiet human reasons
              people say yes. No fake scarcity, no motivational fog, just sharper sales thinking
              for people with something real to sell.
            </p>
            <div className="cta-row">
              <button className="btn primary" onClick={() => navigate('/articles')}>Enter The Archive</button>
            </div>
            <div className="newsletter-block">
              <p className="newsletter-kicker">Weekly sales field note</p>
              <Newsletter />
            </div>
            <div className="hero-tags">
              <span>Sales Psychology</span>
              <span>Trust</span>
              <span>Persuasion</span>
              <span>Buying Behavior</span>
            </div>
          </div>
          <aside className="hero-panel">
            <div className="hero-panel-top">
              <span className="hero-panel-label">Issue of the week</span>
              <h2>People buy the safest future.</h2>
            </div>
            <ul className="hero-points">
              <li>Turn hesitation into useful diagnostic information.</li>
              <li>Build offers buyers can explain without embarrassment.</li>
              <li>Use stories, questions, and proof to lower decision risk.</li>
            </ul>
            <div className="hero-quote">
              <p>"Most sales objections are requests for emotional insurance."</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="section-head">
            <h2>Latest Stories</h2>
            <button className="btn secondary" onClick={() => navigate('/articles')}>View All</button>
          </div>
          <ArticleGrid articles={featured} />
        </div>
      </section>
    </>
  );
}

function ArticlesPage({ articles, initialQuery = '' }: { articles: Article[]; initialQuery?: string }) {
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

function ArticlePage({ article }: { article?: Article }) {
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
      <article className="markdown" dangerouslySetInnerHTML={{ __html: article.contentHtml }} />
      <button className="btn secondary" onClick={() => navigate('/articles')}>Back to all articles</button>
    </main>
  );
}

function AboutPage() {
  return (
    <main className="shell about-page">
      <section className="about-hero">
        <div className="about-copy">
          <p className="hero-overline">About the author</p>
          <h1>Andrey Nikoloff writes for people who sell useful things.</h1>
          <p>
            SellMoreOfYour is an editorial notebook about persuasion, communication, trust,
            and buying behavior. The point is not to manipulate people. The point is to understand
            them well enough to help them make better decisions.
          </p>
        </div>
        <aside className="author-card">
          <span className="author-initials">AN</span>
          <h2>Andrey Nikoloff</h2>
          <p>Sales strategist, entrepreneur, and student of human behavior focused on persuasion, communication, and practical trust.</p>
        </aside>
      </section>

      <section className="about-grid">
        <article>
          <span>01</span>
          <h2>What this site covers</h2>
          <p>Sales psychology, offer clarity, objections, persuasion, buyer motivation, ethical influence, and the conversations that turn trust into revenue.</p>
        </article>
        <article>
          <span>02</span>
          <h2>The editorial rule</h2>
          <p>No fake urgency theater. Every essay should give the reader a cleaner model, a sharper question, or a script they can test in a real conversation.</p>
        </article>
        <article>
          <span>03</span>
          <h2>Why SellMoreOfYour</h2>
          <p>Because good people with useful offers lose too many deals to vague language, weak positioning, and fear disguised as politeness.</p>
        </article>
      </section>
    </main>
  );
}

function AdminPanel() {
  const [email, setEmail] = useState('admin@sellmoreofyour.local');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [csrfToken, setCsrfToken] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [draft, setDraft] = useState(emptyDraft);
  const [editingSlug, setEditingSlug] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [generatingCount, setGeneratingCount] = useState<1 | 3 | null>(null);

  async function load(nextToken = token) {
    const [loadedPosts, loadedSettings] = await Promise.all([
      request<Post[]>('/api/admin/posts', {}, nextToken),
      request<AdminSettings>('/api/admin/settings', {}, nextToken),
    ]);
    setPosts(loadedPosts);
    setSettings(loadedSettings);
  }

  async function signIn(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      const data = await request<{ accessToken: string; csrfToken: string }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setToken(data.accessToken);
      setCsrfToken(data.csrfToken);
      await load(data.accessToken);
      setMessage('Signed in.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Login failed.');
    } finally {
      setBusy(false);
    }
  }

  async function savePost(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      const body = { ...draft, tags: draft.tags.split(',').map((tag) => tag.trim()).filter(Boolean) };
      await request<Post>(editingSlug ? `/api/admin/posts/${editingSlug}` : '/api/admin/posts', {
        method: editingSlug ? 'PUT' : 'POST',
        body: JSON.stringify(body),
      }, token);
      setDraft(emptyDraft);
      setEditingSlug('');
      await load();
      setMessage('Article saved.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not save article.');
    } finally {
      setBusy(false);
    }
  }

  async function removePost(slug: string) {
    await request(`/api/admin/posts/${slug}`, { method: 'DELETE' }, token);
    await load();
  }

  async function generateNow(count: 1 | 3) {
    setBusy(true);
    setGeneratingCount(count);
    setMessage(`Generating ${count} article${count === 1 ? '' : 's'} with OpenRouter. This can take 20-90 seconds...`);
    try {
      let nextToken = token;
      if (csrfToken) {
        try {
          const refreshed = await request<{ accessToken: string }>('/api/auth/refresh', { method: 'POST' }, undefined, csrfToken);
          nextToken = refreshed.accessToken;
          setToken(refreshed.accessToken);
        } catch {
          nextToken = token;
        }
      }
      const generated = await request<Post[]>('/api/ai/generate-article', { method: 'POST', body: JSON.stringify({ count }) }, nextToken);
      await load();
      setMessage(`${generated.length || 0} generated article${generated.length === 1 ? '' : 's'} saved.`);
    } catch (error) {
      const text = error instanceof Error ? error.message : 'Generation failed.';
      if (text.toLowerCase().includes('session') || text.toLowerCase().includes('admin session')) {
        setToken('');
        setMessage('Session expired. Please sign in again.');
      } else {
        setMessage(text);
      }
    } finally {
      setBusy(false);
      setGeneratingCount(null);
    }
  }

  async function refreshSession() {
    const data = await request<{ accessToken: string }>('/api/auth/refresh', { method: 'POST' }, undefined, csrfToken);
    setToken(data.accessToken);
    await load(data.accessToken);
  }

  async function saveSettings() {
    if (!settings) return;
    await request<AdminSettings>('/api/admin/settings', { method: 'PUT', body: JSON.stringify(settings) }, token);
    setMessage('Settings saved.');
  }

  function updateGenerationCount(count: number) {
    if (!settings) return;
    const safeCount = Math.min(12, Math.max(1, count || 1));
    const currentTimes = settings.generationTimes?.length ? settings.generationTimes : [settings.generationTime || '08:00'];
    const nextTimes = Array.from({ length: safeCount }, (_, index) => currentTimes[index] || currentTimes[currentTimes.length - 1] || '08:00');
    setSettings({ ...settings, generationCount: safeCount, generationTimes: nextTimes, generationTime: nextTimes[0] });
  }

  function updateGenerationTime(index: number, value: string) {
    if (!settings) return;
    const nextTimes = [...(settings.generationTimes?.length ? settings.generationTimes : [settings.generationTime || '08:00'])];
    nextTimes[index] = value;
    setSettings({ ...settings, generationTimes: nextTimes, generationTime: nextTimes[0], generationCount: nextTimes.length });
  }

  function toggleWeekday(day: number) {
    if (!settings) return;
    const current = settings.generationWeekdays || [];
    const next = current.includes(day) ? current.filter((value) => value !== day) : [...current, day];
    setSettings({ ...settings, generationWeekdays: next.length ? next.sort() : [1] });
  }

  if (!token) {
    return (
      <main className="admin-page">
        <form className="admin-login" onSubmit={signIn}>
          <h1>Admin sign in</h1>
          <label><span>Email</span><input value={email} onChange={(event) => setEmail(event.target.value)} /></label>
          <label><span>Password</span><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
          <button disabled={busy}>Sign in</button>
          {message && <p className="form-message">{message}</p>}
        </form>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <header className="admin-toolbar">
        <h1>Publishing admin</h1>
        <button onClick={refreshSession}><RefreshCw size={16} /> Refresh</button>
        <button onClick={() => generateNow(1)} disabled={busy}><Wand2 size={16} /> {generatingCount === 1 ? 'Generating 1...' : 'Generate 1 now'}</button>
        <button onClick={() => generateNow(3)} disabled={busy}><Wand2 size={16} /> {generatingCount === 3 ? 'Generating 3...' : 'Generate 3 now'}</button>
      </header>
      {message && <p className="form-message">{message}</p>}
      <section className="admin-grid">
        <form className="editor-panel" onSubmit={savePost}>
          <h2>{editingSlug ? 'Edit article' : 'Create article'}</h2>
          <label><span>Title</span><input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} required /></label>
          <label><span>Slug</span><input value={draft.slug} onChange={(event) => setDraft({ ...draft, slug: event.target.value })} /></label>
          <label><span>Excerpt</span><textarea value={draft.excerpt} onChange={(event) => setDraft({ ...draft, excerpt: event.target.value })} required /></label>
          <label><span>HTML content</span><textarea rows={10} value={draft.contentHtml} onChange={(event) => setDraft({ ...draft, contentHtml: event.target.value })} required /></label>
          <label><span>Tags</span><input value={draft.tags} onChange={(event) => setDraft({ ...draft, tags: event.target.value })} placeholder="sales psychology, objections, trust" /></label>
          <button disabled={busy}><Save size={16} /> Save article</button>
        </form>
        <section className="admin-list">
          <h2>Articles</h2>
          {posts.map((post) => (
            <article key={post.id}>
              <div><strong>{post.title}</strong><small>{post.slug}</small></div>
              <button onClick={() => {
                setEditingSlug(post.slug);
                setDraft({ title: post.title, slug: post.slug, excerpt: post.excerpt, contentHtml: post.contentHtml, status: post.status, tags: post.tags.join(', ') });
              }}><FilePlus size={16} /> Edit</button>
              <button onClick={() => removePost(post.slug)}><Trash2 size={16} /> Delete</button>
            </article>
          ))}
        </section>
      </section>
      {settings && (
        <section className="settings-panel">
          <h2>AI generation settings</h2>
          <label><span>Master prompt</span><textarea rows={7} value={settings.masterPrompt} onChange={(event) => setSettings({ ...settings, masterPrompt: event.target.value })} /></label>
          <div className="settings-row">
            <label>
              <span>Schedule mode</span>
              <select value={settings.generationMode || settings.generationFrequency} onChange={(event) => setSettings({ ...settings, generationMode: event.target.value as 'daily' | 'weekly', generationFrequency: event.target.value as 'daily' | 'weekly' })}>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </label>
            <label>
              <span>How many times</span>
              <input type="number" min={1} max={12} value={settings.generationCount || 1} onChange={(event) => updateGenerationCount(Number(event.target.value))} />
            </label>
          </div>
          <div>
            <span className="field-title">Generation times</span>
            <div className="time-grid">
              {(settings.generationTimes?.length ? settings.generationTimes : [settings.generationTime || '08:00']).slice(0, settings.generationCount || 1).map((time, index) => (
                <label key={`${index}-${time}`}>
                  <span>Run {index + 1}</span>
                  <input type="time" value={time} onChange={(event) => updateGenerationTime(index, event.target.value)} />
                </label>
              ))}
            </div>
          </div>
          {(settings.generationMode || settings.generationFrequency) === 'weekly' && (
            <div>
              <span className="field-title">Weekdays</span>
              <div className="weekday-grid">
                {weekdays.map((day) => (
                  <label key={day.value} className="weekday-option">
                    <input type="checkbox" checked={(settings.generationWeekdays || [1]).includes(day.value)} onChange={() => toggleWeekday(day.value)} />
                    {day.label}
                  </label>
                ))}
              </div>
            </div>
          )}
          <label className="checkbox"><input type="checkbox" checked={settings.autoGenerationEnabled} onChange={(event) => setSettings({ ...settings, autoGenerationEnabled: event.target.checked })} /> Auto generation enabled</label>
          <button onClick={saveSettings}><Save size={16} /> Save settings</button>
        </section>
      )}
    </main>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell footer-inner">
        <span>SellMoreOfYour</span>
        <span>Sharp essays by Andrey Nikoloff</span>
      </div>
    </footer>
  );
}

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
    getPost(slug).then((post) => setPosts((current) => current.some((item) => item.slug === post.slug) ? current : [post, ...current])).catch(() => undefined);
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
