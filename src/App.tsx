import { useEffect, useState } from 'react';
import BakePlanner from './pages/BakePlanner';
import LoafCalculator from './pages/LoafCalculator';
import StarterBuilder from './pages/StarterBuilder';

/**
 * Hand-rolled hash navigation — ~20 lines instead of a router dependency
 * (docs/DECISIONS.md #9). The URL hash (#/calculator) is the single source of
 * truth: the browser back button works, and pages are bookmarkable.
 */
const PAGES = [
  { hash: '#/calculator', label: 'Calculator', Component: LoafCalculator },
  { hash: '#/starter', label: 'Starter', Component: StarterBuilder },
  { hash: '#/planner', label: 'Planner', Component: BakePlanner },
] as const;

function useHashPage() {
  const [hash, setHash] = useState(window.location.hash);
  useEffect(() => {
    const onChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return PAGES.find((p) => p.hash === hash) ?? PAGES[0];
}

export default function App() {
  const page = useHashPage();

  return (
    <div className="app">
      <header className="app-header">
        <h1>🍞 Sourdough Coach</h1>
        <p>Calculate, plan, bake, and learn from each loaf.</p>
      </header>
      <nav className="app-nav">
        {PAGES.map((p) => (
          <a key={p.hash} href={p.hash} className={p === page ? 'selected' : ''}>
            {p.label}
          </a>
        ))}
      </nav>
      <main>
        <page.Component />
      </main>
      <footer className="app-footer">
        <p>Times and amounts are guidance — your dough has the final say.</p>
      </footer>
    </div>
  );
}
