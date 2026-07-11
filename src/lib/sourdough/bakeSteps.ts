/**
 * bakeSteps.ts — the Guided Bake content (PRD page 5).
 *
 * Fifteen steps, each with the PRD's four fields: what to do, why it matters, what it
 * should look/feel like, and the common beginner mistake. This is coaching content,
 * not math — timings and temperatures trace to docs/SOURDOUGH_RULES.md (oven numbers
 * are §9, ⚠️ drafts).
 */

export interface GuidedStep {
  id: string;
  title: string;
  /** Short duration or timing hint shown next to the title. */
  timing: string;
  what: string;
  why: string;
  lookFeel: string;
  mistake: string;
}

export const GUIDED_BAKE_STEPS: readonly GuidedStep[] = [
  {
    id: 'build-starter',
    title: 'Build starter',
    timing: '3–12 hours, depends on temperature',
    what: 'Feed your starter using the Starter Builder plan — keep what you need, discard the rest, feed, and leave it somewhere you can see it.',
    why: 'The starter is the engine of the whole loaf. Active, peaked starter ferments predictably; sluggish starter makes everything after this slow and flat.',
    lookFeel: 'Doubled, bubbly, and domed — or just starting to flatten. It should smell pleasantly sour, like yoghurt, not like nail polish.',
    mistake: 'Using it too early (few bubbles, not risen) or way past peak (collapsed, smells sharp). Peak is a window of a few hours, not a moment.',
  },
  {
    id: 'mix',
    title: 'Mix dough',
    timing: '15 minutes',
    what: 'Dissolve the starter in the water, add the flour and salt (and malt if using), and mix with a wet hand until no dry flour remains. It will look rough — that is fine.',
    why: 'You are just combining and hydrating. Strength comes later from folds and fermentation, not from kneading now.',
    lookFeel: 'A shaggy, sticky mass with no dry pockets. It will not be smooth, and it should not be.',
    mistake: 'Kneading like a yeasted bread, or adding extra flour because it feels sticky. Sticky is correct at this stage.',
  },
  {
    id: 'rest',
    title: 'Rest',
    timing: '45 minutes',
    what: 'Cover the bowl (a shower cap or plate works) and walk away.',
    why: 'The flour absorbs the water and gluten starts forming on its own. This makes the first fold dramatically easier.',
    lookFeel: 'The dough relaxes into the bowl and looks smoother than when you left it.',
    mistake: 'Skipping it because nothing seems to be happening. Something is happening.',
  },
  {
    id: 'fold-1',
    title: 'Stretch & fold 1',
    timing: '2 minutes, then rest 30',
    what: 'With a wet hand, grab one side of the dough, stretch it up, and fold it over the middle. Turn the bowl a quarter and repeat, four sides in all. Cover again.',
    why: 'Each set of folds builds gluten strength gently — this is the kneading, spread over time.',
    lookFeel: 'The dough resists a little and holds its folded shape briefly. Still sticky — keep that hand wet.',
    mistake: 'Tearing the dough by yanking. Stretch until you feel resistance, then fold — never force it.',
  },
  {
    id: 'fold-2',
    title: 'Stretch & fold 2',
    timing: '2 minutes, then rest 30',
    what: 'Same again: stretch, fold, quarter-turn, four sides. Cover.',
    why: 'Strength builds progressively; the second set works because the first had time to relax.',
    lookFeel: 'Noticeably smoother and springier than the first set. It holds its shape a little longer.',
    mistake: 'Doing the folds back-to-back without the 30-minute rests. The waiting is part of the work.',
  },
  {
    id: 'fold-3',
    title: 'Stretch & fold 3',
    timing: '2 minutes, then leave it',
    what: 'One last set of four folds, gentler this time, then cover and leave the dough alone for the rest of bulk fermentation.',
    why: 'By now the gluten is mostly built. From here, fermentation does the work — handling it more would knock out gas.',
    lookFeel: 'Smooth, elastic, starting to feel airy. You may see small bubbles under the surface.',
    mistake: 'Continuing to fold every 30 minutes for hours. Three sets is enough; after this, hands off.',
  },
  {
    id: 'bulk',
    title: 'Bulk fermentation',
    timing: '3–12 hours, depends on temperature',
    what: 'Leave the covered dough at room temperature. Check occasionally, judge by the dough — the Bake Planner time is only an estimate.',
    why: 'This is where flavour and structure develop. Underdone means a dense loaf; overdone means a flat, sticky one. It is the step that matters most.',
    lookFeel: 'Shape when the dough has risen around 50–70%, looks puffy, has rounded edges, shows bubbles around the sides, and jiggles slightly.',
    mistake: 'Waiting for it to double. Sourdough should NOT double in bulk — 50–70% is the target, and cold kitchens need patience, not panic.',
  },
  {
    id: 'shape',
    title: 'Shape',
    timing: '15 minutes',
    what: 'Tip the dough onto a lightly floured bench. Fold it into a loose ball, let it sit 10 minutes, then shape: flip, fold the sides in, roll it up, and drag it toward you to build surface tension.',
    why: 'A tight skin on the outside holds the gas in and makes the loaf rise up instead of out.',
    lookFeel: 'A taut, smooth ball that holds its shape and slides reluctantly on the bench. Some stickiness underneath is normal.',
    mistake: 'Using so much bench flour the dough cannot grip the bench — tension comes from that gentle drag against friction.',
  },
  {
    id: 'banneton',
    title: 'Into the banneton & fridge',
    timing: '5 minutes, then 8–12 hours cold',
    what: 'Flour the banneton well (rice flour if you have it), place the dough in seam side up, cover, and put it in the fridge.',
    why: 'The cold proof firms the dough so it scores cleanly, deepens flavour, and lets you bake whenever it suits you tomorrow.',
    lookFeel: 'Seam side UP in the basket — the smooth side you built tension on faces down, and becomes the top when you flip it out to bake.',
    mistake: 'Under-flouring the basket. A stuck loaf at hour twenty is heartbreak; be generous.',
  },
  {
    id: 'preheat',
    title: 'Preheat oven, Dutch oven inside',
    timing: '45 minutes',
    what: 'Put the Dutch oven in with its lid on and preheat to 250°C. Give it the full time even after the oven says it is ready.',
    why: 'The loaf springs upward in its first minutes from stored heat in that heavy pot. Home oven dials routinely overshoot or undershoot — time at temperature is what actually heats the iron.',
    lookFeel: 'Genuinely, dangerously hot. Have thick oven gloves ready before you open anything.',
    mistake: 'Trusting the preheat beep. The air is hot; the pot is not. Wait the full 45 minutes.',
  },
  {
    id: 'score',
    title: 'Score',
    timing: '1 minute, work quickly',
    what: 'Flip the loaf out of the banneton onto baking paper, dust off excess flour, and slash it once with a razor or sharp knife — about 1cm deep at a shallow angle, one confident stroke.',
    why: 'The score is a controlled weak point: the loaf must expand somewhere, and you are choosing where.',
    lookFeel: 'A clean cut that opens slightly as you finish it. Cold dough from the fridge scores much more cleanly.',
    mistake: 'Shallow, hesitant scratches. Too timid and the loaf bursts wherever it likes — commit to the cut.',
  },
  {
    id: 'bake-lid-on',
    title: 'Bake, lid on',
    timing: '20 minutes at 230°C',
    what: 'Lower the loaf on its paper into the pot, lid on, into the oven, and turn the oven down to 230°C.',
    why: 'The sealed pot traps steam from the dough itself. Steam keeps the crust soft during the spring, letting the loaf rise fully before the crust sets.',
    lookFeel: 'You will see nothing — that is the point. Resist the peek; every lift of the lid lets the steam out.',
    mistake: 'Lifting the lid to check. Twenty minutes of faith.',
  },
  {
    id: 'bake-lid-off',
    title: 'Bake, lid off',
    timing: '20–25 minutes at 210°C',
    what: 'Remove the lid, drop the temperature to 210°C, and bake until the crust is deep brown — darker than feels polite.',
    why: 'Colour is flavour. The bold crust and the caramelised notes come from this uncovered stretch.',
    lookFeel: 'Deep chestnut brown with darker blisters, and the score edges well coloured. Pale bread is underbaked bread.',
    mistake: 'Pulling it out golden-blond because it "looks done". Give it the extra five minutes.',
  },
  {
    id: 'cool',
    title: 'Cool',
    timing: 'at least 1–2 hours',
    what: 'Move the loaf to a wire rack and do not cut it until it is properly cool — at least an hour, two is better.',
    why: 'The crumb is still setting; steam inside is finishing the bake. Cutting early smears the interior into gumminess no oven time can fix.',
    lookFeel: 'The crust crackles quietly as it cools. The base sounds hollow when tapped. The wait is genuinely the hardest step.',
    mistake: 'Cutting in while warm. Gummy crumb is almost never underbaking — it is impatience.',
  },
  {
    id: 'log',
    title: 'Log the result',
    timing: '5 minutes',
    what: 'Note what you did and how it turned out while it is fresh in your mind: timings, temperatures, and how the crumb looks when you finally cut it.',
    why: 'Sourdough improves loaf over loaf through feedback. The log turns each bake — good or bad — into the lesson for the next one.',
    lookFeel: 'A photo of the crumb tells you more later than you expect: even holes mean good fermentation; a dense band at the bottom usually means underproofed.',
    mistake: 'Skipping the log on a bad loaf. The disappointing ones teach the most.',
  },
];
