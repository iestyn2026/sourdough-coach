import { useMemo, useState } from 'react';
import type { FeedRatioName, StarterFlour, TempBandId } from '../lib/sourdough/types';
import {
  STARTER_FLOUR_LABELS,
  STARTER_PEAK_NOTE,
  TEMP_BANDS,
  WHOLEGRAIN_STARTER_NOTE,
} from '../lib/sourdough/rules';
import { buildStarter } from '../lib/sourdough/calculations';
import { hasErrors, validateStarterBuildInput } from '../lib/sourdough/validation';

const RATIOS: readonly FeedRatioName[] = ['1:1:1', '1:2:2', '1:3:3', 'custom'];
const FLOURS: readonly StarterFlour[] = ['white', 'rye', 'spelt', 'mix'];

/** Parse a text field into a number; empty or junk becomes NaN so validation catches it. */
const num = (s: string) => (s.trim() === '' ? Number.NaN : Number(s));

/**
 * Starter Builder (PRD page 3). All math lives in src/lib/sourdough/ — this component
 * only collects input and displays the plan.
 */
export default function StarterBuilder() {
  const [have, setHave] = useState('80');
  const [need, setNeed] = useState('125');
  const [ratio, setRatio] = useState<FeedRatioName>('1:2:2');
  const [customPart, setCustomPart] = useState('2');
  const [flour, setFlour] = useState<StarterFlour>('white');
  const [tempBand, setTempBand] = useState<TempBandId>('moderate');

  const input = useMemo(
    () => ({
      haveGrams: num(have),
      needGrams: num(need),
      ratio,
      customRatioPart: ratio === 'custom' ? num(customPart) : undefined,
      starterFlour: flour,
      tempBand,
    }),
    [have, need, ratio, customPart, flour, tempBand],
  );

  const issues = useMemo(() => validateStarterBuildInput(input), [input]);
  const result = useMemo(
    () => (hasErrors(issues) ? null : buildStarter(input)),
    [issues, input],
  );

  const issuesFor = (fields: string[]) => issues.filter((i) => fields.includes(i.field));
  const wholegrainFeed = flour === 'rye' || flour === 'spelt';

  return (
    <div className="starter-builder">
      <section className="card">
        <h2>Your starter</h2>
        <div className="field">
          <label htmlFor="have">Starter in your jar</label>
          <div className="unit-row">
            <input
              id="have"
              type="number"
              inputMode="numeric"
              value={have}
              onChange={(e) => setHave(e.target.value)}
            />
            <span className="unit">g</span>
          </div>
        </div>
        <div className="field">
          <label htmlFor="need">Active starter your recipe needs</label>
          <div className="unit-row">
            <input
              id="need"
              type="number"
              inputMode="numeric"
              value={need}
              onChange={(e) => setNeed(e.target.value)}
            />
            <span className="unit">g</span>
          </div>
          <p className="hint">
            The Loaf Calculator shows this — the standard loaf needs 114g.
          </p>
        </div>
        {issuesFor(['haveGrams', 'needGrams']).map((issue) => (
          <p key={issue.message} className={`issue ${issue.severity}`}>{issue.message}</p>
        ))}
      </section>

      <section className="card">
        <h2>Feeding ratio</h2>
        <div className="segments four">
          {RATIOS.map((r) => (
            <button
              key={r}
              type="button"
              className={ratio === r ? 'selected' : ''}
              onClick={() => setRatio(r)}
            >
              {r === 'custom' ? 'Custom' : r}
            </button>
          ))}
        </div>
        {ratio === 'custom' && (
          <div className="field" style={{ marginTop: 12 }}>
            <label htmlFor="custom-ratio">Your ratio: 1 : X : X, where X is</label>
            <input
              id="custom-ratio"
              type="number"
              inputMode="decimal"
              value={customPart}
              onChange={(e) => setCustomPart(e.target.value)}
            />
          </div>
        )}
        <details>
          <summary>What does 1:2:2 mean?</summary>
          <p>
            One part of the starter you already have, two parts flour, two parts water —
            all by weight. So feeding 20g of starter at 1:2:2 means adding 40g flour and
            40g water, giving 100g total. Bigger ratios take longer to peak but go
            further from less starter.
          </p>
        </details>
        {issuesFor(['ratio']).map((issue) => (
          <p key={issue.message} className={`issue ${issue.severity}`}>{issue.message}</p>
        ))}
      </section>

      <section className="card">
        <h2>Starter flour</h2>
        <div className="segments four">
          {FLOURS.map((f) => (
            <button
              key={f}
              type="button"
              className={flour === f ? 'selected' : ''}
              onClick={() => setFlour(f)}
            >
              {STARTER_FLOUR_LABELS[f]}
            </button>
          ))}
        </div>
      </section>

      <section className="card">
        <h2>Room temperature</h2>
        <div className="segments four">
          {TEMP_BANDS.map((band) => (
            <button
              key={band.id}
              type="button"
              className={tempBand === band.id ? 'selected' : ''}
              onClick={() => setTempBand(band.id)}
            >
              {band.label}
              <small>{band.rangeLabel}</small>
            </button>
          ))}
        </div>
      </section>

      {result && result.kind === 'plan' && (
        <section className="card results">
          <h2>Your plan</h2>
          <p className="plan-sentence">{result.instructions}</p>
          <ul className="result-list">
            <li>
              <span>Keep</span>
              <span className="amount">{result.keepGrams} g</span>
            </li>
            {result.discardGrams > 0 && (
              <li>
                <span>
                  Discard
                  <span className="sub">or save for crackers and pancakes</span>
                </span>
                <span className="amount">{result.discardGrams} g</span>
              </li>
            )}
            <li>
              <span>Feed flour</span>
              <span className="amount">{result.feedFlourGrams} g</span>
            </li>
            <li>
              <span>Feed water</span>
              <span className="amount">{result.feedWaterGrams} g</span>
            </li>
            <li>
              <span>
                In the jar after feeding
                <span className="sub">
                  {result.leftoverGrams} g left over after baking — your next seed
                </span>
              </span>
              <span className="amount">{result.totalGrams} g</span>
            </li>
          </ul>
          <div className="dough-feel">
            <strong>Ready in about {result.peakHoursLabel}.</strong> {STARTER_PEAK_NOTE}
            {wholegrainFeed && ` ${WHOLEGRAIN_STARTER_NOTE}`}
          </div>
        </section>
      )}

      {result && result.kind === 'not-enough' && (
        <section className="card results">
          <h2>Not quite enough in the jar</h2>
          <p className="plan-sentence">{result.message}</p>
        </section>
      )}
    </div>
  );
}
