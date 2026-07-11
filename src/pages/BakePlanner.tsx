import { useMemo, useState } from 'react';
import type { BakeGoal, TempBandId } from '../lib/sourdough/types';
import { DEFAULT_STARTER_PERCENT, TEMP_BANDS } from '../lib/sourdough/rules';
import { planBake } from '../lib/sourdough/calculations';
import { hasErrors, validatePlannerInput } from '../lib/sourdough/validation';

const GOALS: ReadonlyArray<{ id: BakeGoal; label: string; sub: string }> = [
  { id: 'now', label: 'Start now', sub: 'work forward' },
  { id: 'tomorrow-morning', label: 'Bake tomorrow', sub: 'morning, ~8am' },
  { id: 'tomorrow-evening', label: 'Bake tomorrow', sub: 'evening, ~6pm' },
];

/** Parse a text field into a number; empty or junk becomes NaN so validation catches it. */
const num = (s: string) => (s.trim() === '' ? Number.NaN : Number(s));

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

/** "2:30 pm today" / "7:30 am tomorrow" / "9:00 am Monday". */
function formatWhen(at: Date, now: Date): string {
  const time = at
    .toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })
    .toLowerCase();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (sameDay(at, now)) return `${time} today`;
  if (sameDay(at, tomorrow)) return `${time} tomorrow`;
  return `${time} ${at.toLocaleDateString([], { weekday: 'long' })}`;
}

/**
 * Bake Planner (PRD page 4). All timing math lives in src/lib/sourdough/ — this
 * component collects input, calls planBake with the current clock, and renders
 * the timeline.
 */
export default function BakePlanner() {
  const [tempBand, setTempBand] = useState<TempBandId>('moderate');
  const [goal, setGoal] = useState<BakeGoal>('now');
  const [starterPct, setStarterPct] = useState(String(DEFAULT_STARTER_PERCENT));
  const [fridgeProof, setFridgeProof] = useState(true);

  const input = useMemo(
    () => ({
      tempBand,
      goal,
      starterPercent: num(starterPct),
      fridgeProof,
    }),
    [tempBand, goal, starterPct, fridgeProof],
  );

  const issues = useMemo(() => validatePlannerInput(input), [input]);
  // `now` is captured per render — fine for a page you use then leave.
  const now = useMemo(() => new Date(), [input]); // eslint-disable-line react-hooks/exhaustive-deps
  const plan = useMemo(
    () => (hasErrors(issues) ? null : planBake(input, now)),
    [issues, input, now],
  );

  return (
    <div className="bake-planner">
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

      <section className="card">
        <h2>When do you want to bake?</h2>
        <div className="segments">
          {GOALS.map((g) => (
            <button
              key={g.id}
              type="button"
              className={goal === g.id ? 'selected' : ''}
              onClick={() => setGoal(g.id)}
            >
              {g.label}
              <small>{g.sub}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="card">
        <h2>Dough details</h2>
        <div className="field">
          <label htmlFor="planner-starter">Starter (% of flour, from your calculator)</label>
          <div className="unit-row">
            <input
              id="planner-starter"
              type="number"
              inputMode="numeric"
              value={starterPct}
              onChange={(e) => setStarterPct(e.target.value)}
            />
            <span className="unit">%</span>
          </div>
        </div>
        <div className="field">
          <label>Fridge proof overnight?</label>
          <div className="segments two">
            <button
              type="button"
              className={fridgeProof ? 'selected' : ''}
              onClick={() => setFridgeProof(true)}
            >
              Yes<small>easier + better crust</small>
            </button>
            <button
              type="button"
              className={!fridgeProof ? 'selected' : ''}
              onClick={() => setFridgeProof(false)}
            >
              No<small>bake same day</small>
            </button>
          </div>
        </div>
        {issues.map((issue) => (
          <p key={issue.message} className={`issue ${issue.severity}`}>{issue.message}</p>
        ))}
      </section>

      {plan && (
        <section className="card results">
          <h2>Your timeline</h2>
          {plan.warnings.map((w) => (
            <p key={w} className="issue warning">{w}</p>
          ))}
          <ol className="timeline">
            {plan.steps.map((step) => (
              <li key={step.id}>
                <span className="when">{formatWhen(step.at, now)}</span>
                <span className="what">
                  <strong>{step.label}</strong>
                  <span className="sub">{step.durationLabel}</span>
                  {step.note && <span className="note">{step.note}</span>}
                </span>
              </li>
            ))}
          </ol>
          <div className="dough-feel">
            <strong>Fresh loaf at about {formatWhen(plan.doneAt, now)}.</strong> Clock
            times are estimates to plan your day around — the dough's look and feel
            decide when to move on.
          </div>
        </section>
      )}
    </div>
  );
}
