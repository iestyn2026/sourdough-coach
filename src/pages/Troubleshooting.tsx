import { FAQ_CATEGORIES } from '../lib/sourdough/faq';

/**
 * Troubleshooting / Common Questions (PRD page 6). Pure content page — the Q&A lives
 * in src/lib/sourdough/faq.ts; this component only renders it as expandable cards.
 */
export default function Troubleshooting() {
  return (
    <div className="troubleshooting">
      {FAQ_CATEGORIES.map((category) => (
        <section key={category.id} className="card">
          <h2>{category.title}</h2>
          <div className="faq-list">
            {category.entries.map((entry) => (
              <details key={entry.id} className="faq-entry">
                <summary>{entry.question}</summary>
                <p>{entry.answer}</p>
              </details>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
