import { useMemo, useState } from 'react';
import type { FlourMix, HydrationMode, Inclusion } from '../lib/sourdough/types';
import {
  DEFAULT_ADDED_FLOUR_GRAMS,
  DEFAULT_SALT_PERCENT,
  DEFAULT_STARTER_PERCENT,
  FLOUR_LABELS,
  FLOUR_TYPES,
  HYDRATION_EASY_PERCENT,
  HYDRATION_STANDARD_PERCENT,
  INCLUSION_GUIDANCE,
} from '../lib/sourdough/rules';
import { calculateLoaf } from '../lib/sourdough/calculations';
import { hasErrors, validateCalculatorInput } from '../lib/sourdough/validation';

const INCLUSIONS: readonly Inclusion[] = ['olives', 'seeds', 'rosemary'];

/** Parse a text field into a number; empty or junk becomes NaN so validation catches it. */
const num = (s: string) => (s.trim() === '' ? Number.NaN : Number(s));

/**
 * Loaf Calculator (PRD page 2). All math lives in src/lib/sourdough/ — this component
 * only collects input and displays results.
 */
export default function LoafCalculator() {
  const [flour, setFlour] = useState(String(DEFAULT_ADDED_FLOUR_GRAMS));
  const [mix, setMix] = useState<FlourMix>({ 'high-grade-white': 100 });
  const [mode, setMode] = useState<HydrationMode>('standard');
  const [customHydration, setCustomHydration] = useState('72');
  const [starterPct, setStarterPct] = useState(String(DEFAULT_STARTER_PERCENT));
  const [saltPct, setSaltPct] = useState(String(DEFAULT_SALT_PERCENT));
  const [malt, setMalt] = useState(false);
  const [inclusions, setInclusions] = useState<Inclusion[]>([]);

  const input = useMemo(
    () => ({
      addedFlourGrams: num(flour),
      flourMix: mix,
      hydrationMode: mode,
      customHydrationPercent: mode === 'custom' ? num(customHydration) : undefined,
      starterPercent: num(starterPct),
      saltPercent: num(saltPct),
      diastaticMalt: malt,
      inclusions,
    }),
    [flour, mix, mode, customHydration, starterPct, saltPct, malt, inclusions],
  );

  const issues = useMemo(() => validateCalculatorInput(input), [input]);
  const result = useMemo(
    () => (hasErrors(issues) ? null : calculateLoaf(input)),
    [issues, input],
  );

  const setMixPercent = (flourType: (typeof FLOUR_TYPES)[number], value: string) =>
    setMix((prev) => ({ ...prev, [flourType]: value.trim() === '' ? 0 : Number(value) }));

  const toggleInclusion = (inclusion: Inclusion) =>
    setInclusions((prev) =>
      prev.includes(inclusion) ? prev.filter((i) => i !== inclusion) : [...prev, inclusion],
    );

  const mixTotal = Object.values(mix).reduce((sum, p) => sum + (p || 0), 0);
  const issuesFor = (fields: string[]) => issues.filter((i) => fields.includes(i.field));

  return (
    <div className="loaf-calculator">
      <section className="card">
        <h2>Flour</h2>
        <div className="field">
          <label htmlFor="flour">Flour to add (not counting starter)</label>
          <div className="unit-row">
            <input
              id="flour"
              type="number"
              inputMode="numeric"
              value={flour}
              onChange={(e) => setFlour(e.target.value)}
            />
            <span className="unit">g</span>
          </div>
        </div>
        {issuesFor(['addedFlourGrams']).map((issue) => (
          <p key={issue.message} className={`issue ${issue.severity}`}>{issue.message}</p>
        ))}
      </section>

      <section className="card">
        <h2>Flour mix</h2>
        <div className="mix-grid">
          {FLOUR_TYPES.map((flourType) => (
            <div key={flourType} style={{ display: 'contents' }}>
              <label className="mix-label" htmlFor={`mix-${flourType}`}>
                {FLOUR_LABELS[flourType]}
              </label>
              <div className="unit-row">
                <input
                  id={`mix-${flourType}`}
                  type="number"
                  inputMode="numeric"
                  value={mix[flourType] ?? 0}
                  onChange={(e) => setMixPercent(flourType, e.target.value)}
                />
                <span className="unit">%</span>
              </div>
            </div>
          ))}
        </div>
        <p className={`mix-total ${Math.abs(mixTotal - 100) > 0.5 ? 'off' : ''}`}>
          Mix total: {mixTotal}%
        </p>
        {result?.suggestedHydration && (
          <p className="hint">
            Suggested hydration for this mix: {result.suggestedHydration} — guidance only,
            your water amount never changes automatically.
          </p>
        )}
        {issuesFor(['flourMix']).map((issue) => (
          <p key={issue.message} className={`issue ${issue.severity}`}>{issue.message}</p>
        ))}
      </section>

      <section className="card">
        <h2>Hydration</h2>
        <div className="segments">
          <button
            type="button"
            className={mode === 'easy' ? 'selected' : ''}
            onClick={() => setMode('easy')}
          >
            Easy<small>{HYDRATION_EASY_PERCENT}%</small>
          </button>
          <button
            type="button"
            className={mode === 'standard' ? 'selected' : ''}
            onClick={() => setMode('standard')}
          >
            Standard<small>{HYDRATION_STANDARD_PERCENT}%</small>
          </button>
          <button
            type="button"
            className={mode === 'custom' ? 'selected' : ''}
            onClick={() => setMode('custom')}
          >
            Custom<small>you choose</small>
          </button>
        </div>
        {mode === 'custom' && (
          <div className="field" style={{ marginTop: 12 }}>
            <label htmlFor="custom-hydration">Custom hydration</label>
            <div className="unit-row">
              <input
                id="custom-hydration"
                type="number"
                inputMode="numeric"
                value={customHydration}
                onChange={(e) => setCustomHydration(e.target.value)}
              />
              <span className="unit">%</span>
            </div>
          </div>
        )}
        {issuesFor(['hydration']).map((issue) => (
          <p key={issue.message} className={`issue ${issue.severity}`}>{issue.message}</p>
        ))}
      </section>

      <section className="card">
        <h2>Starter &amp; salt</h2>
        <div className="field">
          <label htmlFor="starter">Starter (% of flour, 100% hydration starter)</label>
          <div className="unit-row">
            <input
              id="starter"
              type="number"
              inputMode="numeric"
              value={starterPct}
              onChange={(e) => setStarterPct(e.target.value)}
            />
            <span className="unit">%</span>
          </div>
        </div>
        <div className="field">
          <label htmlFor="salt">Salt (% of total flour)</label>
          <div className="unit-row">
            <input
              id="salt"
              type="number"
              inputMode="decimal"
              value={saltPct}
              onChange={(e) => setSaltPct(e.target.value)}
            />
            <span className="unit">%</span>
          </div>
        </div>
        {issuesFor(['starterPercent', 'saltPercent']).map((issue) => (
          <p key={issue.message} className={`issue ${issue.severity}`}>{issue.message}</p>
        ))}
      </section>

      <section className="card">
        <h2>Extras</h2>
        <label className="check-row">
          <input type="checkbox" checked={malt} onChange={(e) => setMalt(e.target.checked)} />
          Diastatic malt
        </label>
        {INCLUSIONS.map((inclusion) => (
          <label key={inclusion} className="check-row">
            <input
              type="checkbox"
              checked={inclusions.includes(inclusion)}
              onChange={() => toggleInclusion(inclusion)}
            />
            {INCLUSION_GUIDANCE[inclusion].label}
          </label>
        ))}
      </section>

      {result && (
        <section className="card results">
          <h2>Your loaf</h2>
          <ul className="result-list">
            {result.flourBreakdown.map((line) => (
              <li key={line.flour}>
                <span>{FLOUR_LABELS[line.flour]}</span>
                <span className="amount">{line.grams} g</span>
              </li>
            ))}
            <li>
              <span>
                Water to add
                <span className="sub">{result.hydrationPercent}% true hydration</span>
              </span>
              <span className="amount">{result.waterToAddGrams} g</span>
            </li>
            <li>
              <span>
                Active starter
                <span className="sub">
                  brings {result.starterFlourGrams} g flour + {result.starterWaterGrams} g water
                </span>
              </span>
              <span className="amount">{result.starterGrams} g</span>
            </li>
            <li>
              <span>Salt</span>
              <span className="amount">{result.saltGrams} g</span>
            </li>
            {result.maltGrams !== null && (
              <li>
                <span>Diastatic malt</span>
                <span className="amount">{result.maltGrams} g</span>
              </li>
            )}
            <li>
              <span>Total dough weight</span>
              <span className="amount">{result.totalDoughWeightGrams} g</span>
            </li>
          </ul>

          <div className="dough-feel">
            <strong>How it will feel:</strong> {result.doughFeel}
          </div>

          {result.inclusionGuidance.length > 0 && (
            <div className="dough-feel">
              {result.inclusionGuidance.map((line) => (
                <p key={line} style={{ margin: '4px 0' }}>{line}</p>
              ))}
            </div>
          )}

          <details>
            <summary>Why isn&apos;t water just {result.hydrationPercent}% of my flour?</summary>
            <p>
              Your starter already contains flour and water — {result.starterGrams} g of
              starter brings {result.starterFlourGrams} g flour and {result.starterWaterGrams} g
              water. So your real flour total is {result.totalFlourGrams} g, and the water
              already in the starter counts toward hydration. Ignoring this makes dough
              wetter than intended — it&apos;s the most common beginner calculation mistake.
            </p>
          </details>
        </section>
      )}
    </div>
  );
}
