import { Link, useLocation } from 'react-router-dom';

export default function Layout({ children }) {
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  return (
    <div className="min-h-screen bg-dark">
      {!isHome && (
        <header className="sticky top-4 z-20 flex justify-center px-4">
          <div
            className="glass glow-inset w-full max-w-2xl rounded-full px-5 h-12 flex items-center justify-between"
            style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12), 0 4px 24px rgba(0,0,0,0.4)' }}
          >
            <Link to="/" className="flex items-center gap-2 text-text-primary hover:text-white transition-colors">
              <span>🎋</span>
              <span className="font-semibold text-sm tracking-tight">Bamboo Forest</span>
            </Link>
          </div>
        </header>
      )}

      <main className={isHome ? '' : 'relative z-10 max-w-2xl mx-auto px-4 pt-8 pb-20'}>
        {children}
      </main>

      {!isHome && (
        <footer className="max-w-2xl mx-auto px-4 py-10 text-center">
          <p className="text-xs text-text-faint tracking-tight">All posts are anonymous. Be kind.</p>
        </footer>
      )}
    </div>
  );
}
