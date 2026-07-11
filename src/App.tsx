import LoafCalculator from './pages/LoafCalculator';

/**
 * App shell. Milestone 1 has a single page, so no router yet — one gets added
 * when a second page exists (see docs/DECISIONS.md #8).
 */
export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>🍞 Sourdough Coach</h1>
        <p>Calculate, plan, bake, and learn from each loaf.</p>
      </header>
      <main>
        <LoafCalculator />
      </main>
      <footer className="app-footer">
        <p>Times and amounts are guidance — your dough has the final say.</p>
      </footer>
    </div>
  );
}
