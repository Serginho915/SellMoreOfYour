import type { Article } from '../domain';
import { ArticleGrid } from '../components/ArticleGrid';
import { Newsletter } from '../components/Newsletter';
import { navigate } from '../lib/navigation';

export function HomePage({ articles }: { articles: Article[] }) {
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
