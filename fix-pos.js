const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');

// ── Definite mappings (no ambiguity) ──────────────────────────────────────────

const ADV_WORDS = new Set([
  'now', 'today', 'here', 'there', 'very', 'not', 'together', 'too',
  'always', 'never', 'outside', 'inside', 'slowly', 'quickly', 'then',
  'again', 'also', 'really', 'just', 'still', 'already', 'soon',
  'often', 'sometimes', 'away', 'much', 'more', 'less', 'how',
  'far', 'hard'
]);

const CONJ_WORDS = new Set(['and', 'but', 'or', 'because', 'if']);

const VERB_WORDS = new Set([
  'is', 'am', 'are', 'was', 'were', 'can', 'will', 'do', 'does',
  'did', 'has', 'have', 'had', 'may', 'might', 'must', 'should',
  'would', 'could', 'shall'
]);

const PREP_WORDS = new Set([
  'in', 'on', 'at', 'to', 'by', 'with', 'from', 'up', 'of', 'for',
  'about', 'over', 'under', 'into', 'out', 'off', 'down', 'through',
  'between', 'around', 'near', 'behind', 'before', 'after', 'during',
  'until', 'across', 'along', 'toward', 'against', 'among', 'within',
  'without', 'upon', 'beside', 'beneath', 'above', 'below'
]);

const ART_WORDS = new Set([
  'a', 'an', 'the', 'my', 'your', 'his', 'its', 'our', 'their',
  'this', 'these', 'those'
]);

const PRO_WORDS = new Set([
  'i', 'me', 'you', 'he', 'him', 'she', 'it', 'we', 'us', 'they',
  'them', 'who', 'what', 'which', 'myself', 'yourself', 'himself',
  'herself', 'itself', 'ourselves', 'themselves'
]);

// ── Ambiguous words resolved by context ───────────────────────────────────────

function resolveAmbiguous(word, posArray, index) {
  const lower = word.toLowerCase();

  // "her": ART when followed by a noun (possessive), PRO otherwise
  if (lower === 'her') {
    const next = posArray[index + 1];
    if (next && (next.t === 'N' || next.t === 'ADJ')) return 'ART';
    return 'PRO';
  }

  // "that": ART when followed by N/ADJ, PRO otherwise
  if (lower === 'that') {
    const next = posArray[index + 1];
    if (next && (next.t === 'N' || next.t === 'ADJ')) return 'ART';
    return 'PRO';
  }

  // "fast": ADV when preceded by a verb, ADJ otherwise
  if (lower === 'fast') {
    const prev = posArray[index - 1];
    if (prev && prev.t === 'V') return 'ADV';
    return 'ADJ';
  }

  // "high": ADV when preceded by a verb, ADJ otherwise
  if (lower === 'high') {
    const prev = posArray[index - 1];
    if (prev && prev.t === 'V') return 'ADV';
    return 'ADJ';
  }

  // "well": ADV in most cases; ADJ only after "am/is/are/feel/look"
  if (lower === 'well') {
    const prev = posArray[index - 1];
    if (prev && ['am', 'is', 'are', 'feel', 'look'].includes(prev.w.toLowerCase())) return 'ADJ';
    return 'ADV';
  }

  // "so": CONJ when followed by a pronoun/noun (subject), ADV otherwise
  if (lower === 'so') {
    const next = posArray[index + 1];
    if (next && (next.t === 'PRO' || next.t === 'N')) return 'CONJ';
    return 'ADV';
  }

  // "when": CONJ in these Pre-K sentences (subordinating conjunction)
  if (lower === 'when') {
    return 'CONJ';
  }

  return null; // no resolution
}

// ── Main ──────────────────────────────────────────────────────────────────────

const changes = [];
let totalFixed = 0;

for (let unit = 1; unit <= 6; unit++) {
  const filePath = path.join(DATA_DIR, `prek-unit${unit}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  for (const day of data) {
    if (!day.sentences || !day.sentences[0] || !day.sentences[0].pos) continue;

    const posArray = day.sentences[0].pos;
    for (let i = 0; i < posArray.length; i++) {
      const entry = posArray[i];
      const lower = entry.w.toLowerCase();
      const oldTag = entry.t;
      let correctTag = null;

      // Check definite mappings first
      if (ADV_WORDS.has(lower) && oldTag !== 'ADV') {
        correctTag = 'ADV';
      } else if (CONJ_WORDS.has(lower) && oldTag !== 'CONJ') {
        correctTag = 'CONJ';
      } else if (VERB_WORDS.has(lower) && oldTag !== 'V') {
        correctTag = 'V';
      } else if (PREP_WORDS.has(lower) && oldTag !== 'PREP') {
        correctTag = 'PREP';
      } else if (ART_WORDS.has(lower) && oldTag !== 'ART') {
        correctTag = 'ART';
      } else if (PRO_WORDS.has(lower) && oldTag !== 'PRO') {
        correctTag = 'PRO';
      }

      // Check ambiguous words (these override the above if needed)
      const ambiguous = resolveAmbiguous(entry.w, posArray, i);
      if (ambiguous !== null && ambiguous !== oldTag) {
        correctTag = ambiguous;
      } else if (ambiguous !== null && ambiguous === oldTag) {
        // Ambiguous word already correct
        correctTag = null;
      }

      if (correctTag && correctTag !== oldTag) {
        changes.push({
          unit,
          day: day.day,
          word: entry.w,
          oldTag,
          newTag: correctTag,
          sentence: day.sentences[0].fixed
        });
        entry.t = correctTag;
        totalFixed++;
      }
    }
  }

  // Write fixed unit file
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`Saved ${filePath}`);
}

// Rebuild prek.json from all 6 unit files
const allDays = [];
for (let unit = 1; unit <= 6; unit++) {
  const filePath = path.join(DATA_DIR, `prek-unit${unit}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  allDays.push(...data);
}
allDays.sort((a, b) => a.day - b.day);
const prekPath = path.join(DATA_DIR, 'prek.json');
fs.writeFileSync(prekPath, JSON.stringify(allDays, null, 2) + '\n', 'utf8');
console.log(`Saved ${prekPath}`);

// Print change log
console.log(`\n=== POS FIX SUMMARY ===`);
console.log(`Total fixes: ${totalFixed}\n`);

// Group by tag change
const tagChanges = {};
for (const c of changes) {
  const key = `${c.oldTag} -> ${c.newTag}`;
  if (!tagChanges[key]) tagChanges[key] = [];
  tagChanges[key].push(c);
}

for (const [key, items] of Object.entries(tagChanges)) {
  console.log(`${key} (${items.length} fixes):`);
  for (const item of items) {
    console.log(`  Unit ${item.unit}, Day ${item.day}: "${item.word}" in "${item.sentence}"`);
  }
  console.log();
}
