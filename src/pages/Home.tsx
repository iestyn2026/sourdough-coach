import { GUIDED_BAKE_STEPS } from '../lib/sourdough/bakeSteps';
import { loadProgress } from '../storage/guidedBake';
import { loadEntries } from '../storage/loafLog';

/**
 * Home (PRD page 1): the intro line and one card per feature. The starter card is
 * an addition beyond the PRD's five (DECISIONS.md #14) — every page deserves a door.
 * The two status hints (bake in progress, loaves logged) read existing storage.
 */
export default function Home() {
  const progress = loadProgress();
  const bakeUnderway =
    progress.completedIds.length > 0 &&
    progress.completedIds.length < GUIDED_BAKE_STEPS.length;
  const loafCount = loadEntries().length;

  const cards = [
    { hash: '#/calculator', title: 'Calculate a loaf', sub: 'Flour, water, starter, and salt amounts' },
    { hash: '#/starter', title: 'Build starter', sub: 'What to keep, discard, and feed' },
    { hash: '#/planner', title: 'Plan a bake', sub: 'A timeline that fits your day' },
    {
      hash: '#/bake',
      title: 'Follow guided bake',
      sub: bakeUnderway
        ? `Resume — step ${progress.completedIds.length + 1} of ${GUIDED_BAKE_STEPS.length}`
        : 'Step-by-step bake mode',
    },
    { hash: '#/help', title: 'Troubleshooting', sub: 'Quick answers to common problems' },
    {
      hash: '#/log',
      title: 'Loaf log',
      sub: loafCount > 0
        ? `${loafCount} ${loafCount === 1 ? 'loaf' : 'loaves'} logged`
        : 'Notes, ratings, and photos',
    },
  ];

  return (
    <div className="home">
      <p className="home-intro">
        Sourdough Coach helps you calculate, plan, bake, and learn from each loaf.
      </p>
      <div className="home-grid">
        {cards.map((card) => (
          <a key={card.hash} href={card.hash} className="home-card">
            <span>
              <strong>{card.title}</strong>
              <span className="sub">{card.sub}</span>
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
