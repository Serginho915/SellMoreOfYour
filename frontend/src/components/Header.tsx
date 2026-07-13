import { navigate } from '../lib/navigation';

export function Header() {
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
