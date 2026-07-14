import { useMemo, useRef, useState } from 'react';
import type { LoafEntry, PhotoSlot } from '../lib/sourdough/types';
import { GUIDED_BAKE_STEPS } from '../lib/sourdough/bakeSteps';
import { loadProgress } from '../storage/guidedBake';
import { addEntry, deleteEntry, loadEntries } from '../storage/loafLog';
import { downscalePhoto } from '../storage/photos';

const PHOTO_SLOTS: ReadonlyArray<{ id: PhotoSlot; label: string }> = [
  { id: 'after-mix', label: 'After mix' },
  { id: 'before-shaping', label: 'Before shaping' },
  { id: 'shaped', label: 'Shaped' },
  { id: 'baked', label: 'Baked loaf' },
  { id: 'crumb', label: 'Crumb' },
];

const TEXT_FIELDS: ReadonlyArray<{ id: keyof FormText; label: string; placeholder: string }> = [
  { id: 'flourMix', label: 'Flour mix', placeholder: 'e.g. 80% white, 20% wholemeal' },
  { id: 'water', label: 'Water', placeholder: 'e.g. 376g' },
  { id: 'starter', label: 'Starter', placeholder: 'e.g. 114g' },
  { id: 'salt', label: 'Salt', placeholder: 'e.g. 12.5g' },
  { id: 'roomTemp', label: 'Room temperature', placeholder: 'e.g. about 22°C' },
  { id: 'bulkDuration', label: 'Bulk time', placeholder: 'e.g. 5 hours' },
  { id: 'fridgeDuration', label: 'Fridge time', placeholder: 'e.g. overnight' },
  { id: 'bakeTime', label: 'Bake time', placeholder: 'e.g. 20 + 22 min' },
];

interface FormText {
  flourMix: string;
  water: string;
  starter: string;
  salt: string;
  roomTemp: string;
  bulkDuration: string;
  fridgeDuration: string;
  bakeTime: string;
  notes: string;
}

const EMPTY_FORM: FormText = {
  flourMix: '', water: '', starter: '', salt: '', roomTemp: '',
  bulkDuration: '', fridgeDuration: '', bakeTime: '', notes: '',
};

const todayISO = () => new Date().toISOString().slice(0, 10);

/**
 * Loaf Log (PRD page 7). Entries persist via src/storage/loafLog.ts; photos are
 * downscaled in src/storage/photos.ts before saving so they fit in localStorage.
 * If a finished Guided Bake is waiting, the form pre-fills its date.
 */
export default function LoafLog() {
  // A completed guided bake pre-fills the bake date (PRD: "Log this bake").
  const finishedBake = useMemo(() => {
    const progress = loadProgress();
    const allDone = GUIDED_BAKE_STEPS.every((s) => progress.completedIds.includes(s.id));
    return allDone && progress.startedAt ? progress.startedAt.slice(0, 10) : null;
  }, []);

  const [entries, setEntries] = useState<LoafEntry[]>(loadEntries);
  const [showForm, setShowForm] = useState(entries.length === 0 || finishedBake !== null);
  const [date, setDate] = useState(finishedBake ?? todayISO());
  const [text, setText] = useState<FormText>(EMPTY_FORM);
  const [rating, setRating] = useState<number | null>(null);
  const [photos, setPhotos] = useState<Partial<Record<PhotoSlot, string>>>({});
  const [photoBusy, setPhotoBusy] = useState<PhotoSlot | null>(null);
  const [saveError, setSaveError] = useState(false);
  const fileInputs = useRef<Partial<Record<PhotoSlot, HTMLInputElement | null>>>({});

  const setField = (id: keyof FormText, value: string) =>
    setText((prev) => ({ ...prev, [id]: value }));

  const handlePhoto = async (slot: PhotoSlot, file: File | undefined) => {
    if (!file) return;
    setPhotoBusy(slot);
    try {
      const dataUrl = await downscalePhoto(file);
      setPhotos((prev) => ({ ...prev, [slot]: dataUrl }));
    } catch {
      window.alert('That image could not be read — try a different photo.');
    } finally {
      setPhotoBusy(null);
    }
  };

  const removePhoto = (slot: PhotoSlot) =>
    setPhotos((prev) => {
      const next = { ...prev };
      delete next[slot];
      return next;
    });

  const saveLoaf = () => {
    const entry: LoafEntry = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      date,
      ...text,
      rating,
      photos,
    };
    if (addEntry(entry)) {
      setEntries(loadEntries());
      setText(EMPTY_FORM);
      setRating(null);
      setPhotos({});
      setDate(todayISO());
      setSaveError(false);
      setShowForm(false);
    } else {
      setSaveError(true);
    }
  };

  const removeEntry = (entry: LoafEntry) => {
    if (window.confirm(`Delete the loaf from ${entry.date}? This cannot be undone.`)) {
      deleteEntry(entry.id);
      setEntries(loadEntries());
    }
  };

  return (
    <div className="loaf-log">
      {finishedBake && showForm && (
        <section className="card">
          <p className="plan-sentence">
            🍞 Logging the bake you finished in Bake mode (started {finishedBake}) —
            the date is pre-filled below.
          </p>
        </section>
      )}

      {!showForm && (
        <section className="card">
          <button type="button" className="big-button" onClick={() => setShowForm(true)}>
            Log a loaf +
          </button>
        </section>
      )}

      {showForm && (
        <section className="card">
          <h2>New loaf</h2>
          <p className="hint">Everything is optional — note what you remember.</p>

          <div className="field" style={{ marginTop: 12 }}>
            <label htmlFor="log-date">Bake date</label>
            <input
              id="log-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="log-grid">
            {TEXT_FIELDS.map((f) => (
              <div key={f.id} className="field">
                <label htmlFor={`log-${f.id}`}>{f.label}</label>
                <input
                  id={`log-${f.id}`}
                  type="text"
                  placeholder={f.placeholder}
                  value={text[f.id]}
                  onChange={(e) => setField(f.id, e.target.value)}
                />
              </div>
            ))}
          </div>

          <div className="field">
            <label htmlFor="log-notes">Notes</label>
            <textarea
              id="log-notes"
              rows={3}
              placeholder="What went well? What would you change next time?"
              value={text.notes}
              onChange={(e) => setField('notes', e.target.value)}
            />
          </div>

          <div className="field">
            <label>Rating</label>
            <div className="rating-row">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  className={`rating-button ${rating === n ? 'selected' : ''}`}
                  onClick={() => setRating(rating === n ? null : n)}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <label>Photos</label>
            <div className="photo-grid">
              {PHOTO_SLOTS.map((slot) => (
                <div key={slot.id} className="photo-slot">
                  {photos[slot.id] ? (
                    <>
                      <img src={photos[slot.id]} alt={slot.label} />
                      <button
                        type="button"
                        className="photo-remove"
                        aria-label={`Remove ${slot.label} photo`}
                        onClick={() => removePhoto(slot.id)}
                      >
                        ✕
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className="photo-add"
                      onClick={() => fileInputs.current[slot.id]?.click()}
                    >
                      {photoBusy === slot.id ? '…' : '📷'}
                    </button>
                  )}
                  <span className="photo-label">{slot.label}</span>
                  <input
                    ref={(el) => {
                      fileInputs.current[slot.id] = el;
                    }}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => handlePhoto(slot.id, e.target.files?.[0])}
                  />
                </div>
              ))}
            </div>
            <p className="hint">
              Photos are shrunk to fit the browser&apos;s storage — originals stay on
              your device untouched.
            </p>
          </div>

          {saveError && (
            <p className="issue error">
              Couldn&apos;t save — the browser&apos;s storage is full. Delete an old
              entry (or its photos) and try again.
            </p>
          )}

          <button type="button" className="big-button" onClick={saveLoaf}>
            Save loaf
          </button>
        </section>
      )}

      {entries.length > 0 && (
        <section className="card">
          <h2>Your loaves ({entries.length})</h2>
          <div className="log-entries">
            {entries.map((entry) => (
              <details key={entry.id} className="log-entry">
                <summary>
                  <span className="log-entry-date">{entry.date}</span>
                  <span className="log-entry-summary">
                    {entry.rating !== null && <strong>{entry.rating}/10</strong>}
                    {entry.flourMix && ` · ${entry.flourMix}`}
                  </span>
                </summary>
                <div className="log-entry-body">
                  {Object.values(entry.photos).length > 0 && (
                    <div className="photo-strip">
                      {PHOTO_SLOTS.filter((s) => entry.photos[s.id]).map((s) => (
                        <figure key={s.id}>
                          <img src={entry.photos[s.id]} alt={s.label} />
                          <figcaption>{s.label}</figcaption>
                        </figure>
                      ))}
                    </div>
                  )}
                  <dl className="log-facts">
                    {TEXT_FIELDS.filter((f) => entry[f.id]).map((f) => (
                      <div key={f.id}>
                        <dt>{f.label}</dt>
                        <dd>{entry[f.id]}</dd>
                      </div>
                    ))}
                  </dl>
                  {entry.notes && <p className="log-notes">{entry.notes}</p>}
                  <button
                    type="button"
                    className="ghost-button"
                    onClick={() => removeEntry(entry)}
                  >
                    Delete entry
                  </button>
                </div>
              </details>
            ))}
          </div>
        </section>
      )}

      {entries.length === 0 && !showForm && (
        <section className="card">
          <p className="hint">No loaves logged yet — your first one starts the story.</p>
        </section>
      )}
    </div>
  );
}
