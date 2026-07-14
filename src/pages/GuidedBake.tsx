import { useEffect, useState } from 'react';
import { GUIDED_BAKE_STEPS } from '../lib/sourdough/bakeSteps';
import {
  clearProgress,
  loadProgress,
  saveProgress,
} from '../storage/guidedBake';

/**
 * Guided Bake (PRD page 5) — interactive bake mode. One step is expanded at a time;
 * marking it complete advances to the next. Progress lives in localStorage so a bake
 * survives page reloads (they span a day or more). Step content lives in
 * src/lib/sourdough/bakeSteps.ts; this component only renders and tracks progress.
 */
export default function GuidedBake() {
  const [completed, setCompleted] = useState<string[]>(() => loadProgress().completedIds);
  const [startedAt, setStartedAt] = useState<string | null>(() => loadProgress().startedAt);
  // Which step card is open. null = follow the current (first incomplete) step.
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    saveProgress({ completedIds: completed, startedAt });
  }, [completed, startedAt]);

  const isDone = (id: string) => completed.includes(id);
  const currentStep = GUIDED_BAKE_STEPS.find((s) => !isDone(s.id));
  const openStepId = openId ?? currentStep?.id ?? null;
  const allDone = !currentStep;

  const markComplete = (id: string) => {
    if (!isDone(id)) setCompleted([...completed, id]);
    if (!startedAt) setStartedAt(new Date().toISOString());
    setOpenId(null); // follow the flow to the next incomplete step
  };

  const markNotDone = (id: string) => {
    setCompleted(completed.filter((c) => c !== id));
    setOpenId(id);
  };

  const startFresh = () => {
    if (completed.length === 0 || window.confirm('Start a new bake? Current progress will be cleared.')) {
      clearProgress();
      setCompleted([]);
      setStartedAt(null);
      setOpenId(null);
    }
  };

  return (
    <div className="guided-bake">
      <section className="card">
        <div className="bake-progress">
          <div>
            <h2>Bake mode</h2>
            <p className="hint">
              {allDone
                ? 'All fifteen steps done — that\'s a loaf. 🎉'
                : `Step ${completed.length + 1} of ${GUIDED_BAKE_STEPS.length}`}
            </p>
          </div>
          <button type="button" className="ghost-button" onClick={startFresh}>
            Start new bake
          </button>
        </div>
        <div className="progress-track" role="progressbar"
          aria-valuenow={completed.length} aria-valuemin={0}
          aria-valuemax={GUIDED_BAKE_STEPS.length}>
          <div
            className="progress-fill"
            style={{ width: `${(completed.length / GUIDED_BAKE_STEPS.length) * 100}%` }}
          />
        </div>
      </section>

      {GUIDED_BAKE_STEPS.map((step, index) => {
        const done = isDone(step.id);
        const open = step.id === openStepId;
        const isCurrent = step.id === currentStep?.id;
        return (
          <section
            key={step.id}
            className={`card step-card ${done ? 'done' : ''} ${isCurrent ? 'current' : ''}`}
          >
            <button
              type="button"
              className="step-header"
              onClick={() => setOpenId(open ? (done || !isCurrent ? currentStep?.id ?? null : null) : step.id)}
            >
              <span className={`step-tick ${done ? 'ticked' : ''}`} aria-hidden>
                {done ? '✓' : index + 1}
              </span>
              <span className="step-title">
                <strong>{step.title}</strong>
                <span className="sub">{step.timing}</span>
              </span>
              <span className="step-chevron" aria-hidden>{open ? '▾' : '▸'}</span>
            </button>

            {open && (
              <div className="step-body">
                <p>{step.what}</p>
                <p><strong>Why it matters:</strong> {step.why}</p>
                <p><strong>Look &amp; feel:</strong> {step.lookFeel}</p>
                <p className="issue warning"><strong>Watch out:</strong> {step.mistake}</p>
                {done ? (
                  <button type="button" className="ghost-button" onClick={() => markNotDone(step.id)}>
                    Mark as not done
                  </button>
                ) : (
                  <button type="button" className="big-button" onClick={() => markComplete(step.id)}>
                    Mark complete ✓
                  </button>
                )}
              </div>
            )}
          </section>
        );
      })}

      {allDone && (
        <section className="card results">
          <h2>Loaf complete 🍞</h2>
          <p className="plan-sentence">
            Well baked! Note down how it went while it&apos;s fresh in your mind — good
            and bad, the log is where each loaf teaches the next one.
          </p>
          <button
            type="button"
            className="big-button"
            onClick={() => {
              window.location.hash = '#/log';
            }}
          >
            Log this bake
          </button>
          <button
            type="button"
            className="ghost-button"
            style={{ width: '100%', marginTop: 8 }}
            onClick={startFresh}
          >
            Start a new bake
          </button>
        </section>
      )}
    </div>
  );
}
