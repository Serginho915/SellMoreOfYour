export function AboutPage() {
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
