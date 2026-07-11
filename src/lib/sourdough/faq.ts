/**
 * faq.ts — Troubleshooting / Common Questions content (PRD page 6).
 *
 * All 25 questions come straight from the PRD; the answers are app-drafted (⚠️
 * pending Iestyn's review) and kept consistent with docs/SOURDOUGH_RULES.md — same
 * ratios, percentages, and temperatures. Keep answers short, practical, and
 * beginner-friendly (PRD requirement).
 */

export interface FaqEntry {
  id: string;
  question: string;
  answer: string;
}

export interface FaqCategory {
  id: string;
  title: string;
  entries: FaqEntry[];
}

export const FAQ_CATEGORIES: readonly FaqCategory[] = [
  {
    id: 'starter',
    title: 'Starter',
    entries: [
      {
        id: 'ratio-meaning',
        question: 'What does 1:1:1 mean?',
        answer:
          'One part existing starter, one part flour, one part water — all by weight. So 20g starter + 20g flour + 20g water. The Starter Builder page does this math for you, and 1:2:2 is the everyday recommendation.',
      },
      {
        id: 'why-discard',
        question: 'Why discard starter?',
        answer:
          'Without discarding, every feed would need more and more flour to keep the same ratio, and you\'d drown in starter within a week. Keeping a small amount and feeding it well beats keeping a lot and feeding it thinly. Discard isn\'t waste — it makes great crackers and pancakes.',
      },
      {
        id: 'peaked-early',
        question: 'What if my starter peaked too early?',
        answer:
          'Within an hour or two of peak it\'s still fine to use. Longer than that, give it a small fresh feed (1:1:1) and catch the next peak. Next time, use a bigger ratio like 1:3:3 or a cooler spot to slow it down.',
      },
      {
        id: 'revive-travel',
        question: 'How do I revive starter after travel?',
        answer:
          'Feed it 1:1:1 at room temperature, twice a day, for two or three days. It may smell sharp and look lifeless at first — keep going until it reliably doubles within a feed. It\'s remarkably hard to kill.',
      },
      {
        id: 'feed-rye-spelt',
        question: 'Can I feed starter rye or spelt?',
        answer:
          'Yes — whole-grain flours like rye bring more nutrients and wild microbes, and starters usually love them. Expect a faster, sooner peak. Many bakers keep a white starter and add a spoonful of rye when it needs a boost.',
      },
      {
        id: 'storage',
        question: 'How do I store starter for 1 week, 2 weeks, or 4 weeks?',
        answer:
          '1 week: feed it, let it get going for an hour, then fridge — no feeds needed. 2 weeks: same, and expect it to need one or two revival feeds when you\'re back. 4 weeks: fridge works but it\'ll be sluggish — feed it well first, and plan on two or three days of feeds to revive. For long gaps, smear some on baking paper, dry it, and keep the flakes as a backup.',
      },
    ],
  },
  {
    id: 'dough',
    title: 'Dough',
    entries: [
      {
        id: 'sticky',
        question: 'Why is my dough sticky?',
        answer:
          'Early on, sticky is normal — gluten hasn\'t developed yet. Work with wet hands instead of adding flour. If it turns very sticky and slack late in bulk after being manageable, it\'s likely over-fermented: shape it gently, expect a rustic loaf, and shorten bulk next time.',
      },
      {
        id: 'no-rise',
        question: 'Why did it not rise?',
        answer:
          'Almost always one of three: the starter wasn\'t at peak when you mixed, the room was colder than you thought, or it simply needed more time. Trust the dough, not the clock — at 18°C bulk can take 8–12 hours. Check the starter passes the doubled-bubbly-domed test before mixing next time.',
      },
      {
        id: 'should-double',
        question: 'Should dough double?',
        answer:
          'No — that advice is for yeasted bread. Shape sourdough when it has risen around 50–70%, looks puffy, has rounded edges, shows bubbles around the sides, and jiggles slightly. Waiting for a full double usually means over-fermented.',
      },
      {
        id: 'overnight',
        question: 'Can I leave dough overnight?',
        answer:
          'In the fridge, absolutely — that\'s the fridge proof, and it improves the loaf. At room temperature, only in a genuinely cold room (15–18°C) where the dough has risen just 20–40% after several hours. In a normal kitchen, overnight on the bench means over-fermented by morning.',
      },
      {
        id: 'fridge-when',
        question: 'Should I fridge before or after shaping?',
        answer:
          'After. Finish bulk at room temperature, shape, then into the banneton and fridge. Cold dough holds its shape, scores cleanly, and bakes on your schedule the next day.',
      },
      {
        id: 'seam-side-up',
        question: 'What is seam side up?',
        answer:
          'When you shape, the smooth stretched surface is on top and the gathered fold — the seam — is underneath. In the banneton, the dough goes seam side UP, smooth side down. When you flip it out to bake, the smooth side becomes the top of the loaf.',
      },
      {
        id: 'stuck-banneton',
        question: 'Why did it stick to the banneton?',
        answer:
          'Too little flour in the basket, dough on the wet side, or a very long proof. Flour the banneton generously — right up the sides — and use rice flour if you have it. A cloth liner also helps while you\'re learning.',
      },
      {
        id: 'rice-flour',
        question: 'Do I need rice flour?',
        answer:
          'Not essential, but it\'s the best banneton flour there is: no gluten, so it never hydrates into the dough surface and glues it to the basket. A small bag lasts months.',
      },
    ],
  },
  {
    id: 'baking',
    title: 'Baking',
    entries: [
      {
        id: 'soft-crust',
        question: 'Why is my crust soft?',
        answer:
          'Usually the oven wasn\'t as hot as the dial claimed, or the loaf came out too pale. Preheat the Dutch oven a full 45 minutes, bake the lid-off stage until deep brown — darker than feels polite — and cool on a wire rack, never wrapped or covered.',
      },
      {
        id: 'flat-loaf',
        question: 'Why is my loaf flat?',
        answer:
          'The most common cause is over-fermented bulk (it doubled or more). Also possible: weak surface tension at shaping, or a starter past its best. Check bulk against the 50–70% guidance first — that fixes most flat loaves.',
      },
      {
        id: 'gummy-crumb',
        question: 'Why is my crumb gummy?',
        answer:
          'Ninety percent of the time: it was cut while still warm. The crumb sets during cooling — wait at least an hour, ideally two. If it\'s gummy even when fully cool, it was under-fermented or under-baked.',
      },
      {
        id: 'random-burst',
        question: 'Why did it burst randomly?',
        answer:
          'The loaf had spring but nowhere planned to go — the score was too shallow or too timid. Slash about 1cm deep in one confident stroke. A random burst is actually a good sign: the fermentation was right, only the scoring needs work.',
      },
      {
        id: 'score-depth',
        question: 'How deep should I score?',
        answer:
          'About 1cm, at a shallow angle, in one decisive stroke. Cold dough straight from the fridge scores far more cleanly than room-temperature dough.',
      },
      {
        id: 'oven-temp',
        question: 'Why does my oven temperature matter?',
        answer:
          'Home oven dials routinely miss by 20°C or more, and the first minutes of heat drive the rise and set the crust. The Dutch oven\'s stored heat is your insurance — give it the full 45-minute preheat. A cheap oven thermometer tells you what your dial is really doing.',
      },
    ],
  },
  {
    id: 'ingredients',
    title: 'Ingredients',
    entries: [
      {
        id: 'rye',
        question: 'What does rye do?',
        answer:
          'Rye ferments fast and adds deep, slightly earthy flavour, but it has very little gluten strength — dough gets stickier and the crumb denser as you add more. 10–20% of the flour is the beginner-friendly zone.',
      },
      {
        id: 'spelt',
        question: 'What does spelt do?',
        answer:
          'Spelt brings a sweet, nutty flavour and makes dough stretchy — but its gluten is weaker, so loaves spread if you use a lot. Keep it to 10–20% and expect a slightly softer dough.',
      },
      {
        id: 'pearl-barley',
        question: 'What does pearl barley flour do?',
        answer:
          'A gentle sweetness and a tender, moist crumb — and no gluten strength at all. Keep it to 10–15% of the flour so the loaf still holds its shape.',
      },
      {
        id: 'diastatic-malt',
        question: 'What is diastatic malt?',
        answer:
          'Sprouted, dried, ground grain with active enzymes that turn starch into sugar. A little (about 0.5% of flour) feeds fermentation and gives better browning and rise. Entirely optional — a nice-to-have, not a need.',
      },
      {
        id: 'olives-seeds',
        question: 'Should I add olives or seeds?',
        answer:
          'Once your plain loaf is coming out well, absolutely. Fold them in at the first stretch and fold: roughly 15% of flour weight for olives (drained well), 10% for seeds. Inclusions make dough slightly harder to read, so nail the basic loaf first.',
      },
    ],
  },
];
