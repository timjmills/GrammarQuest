const fs = require('fs');

// === Category 1: Teaching Point Fixes (13 days) ===
// 4-word sentences where all words have corrections + a phantom grammar TP (w===r).
// Fix: Misspell the last word in orig, convert phantom TP to spelling correction.
// IMPORTANT: misspelling must NOT contain the correct word as a substring.
const TP_FIXES = {
  3:  { lastWord: 'big',   mis: 'bg',    exp: "Big needs an i: b-i-g." },
  6:  { lastWord: 'nice',  mis: 'nise',  exp: "Nice has a c: n-i-c-e." },
  7:  { lastWord: 'fun',   mis: 'fn',    exp: "Fun needs a u: f-u-n." },
  8:  { lastWord: 'run',   mis: 'rn',    exp: "Run needs a u: r-u-n." },
  16: { lastWord: 'pen',   mis: 'pn',    exp: "Pen needs an e: p-e-n." },
  26: { lastWord: 'big',   mis: 'bg',    exp: "Big needs an i: b-i-g." },
  27: { lastWord: 'big',   mis: 'bg',    exp: "Big needs an i: b-i-g." },
  28: { lastWord: 'clean', mis: 'cleen', exp: "Clean has an a: c-l-e-a-n." },
  29: { lastWord: 'long',  mis: 'lng',   exp: "Long needs an o: l-o-n-g." },
  30: { lastWord: 'long',  mis: 'lng',   exp: "Long needs an o: l-o-n-g." },
  31: { lastWord: 'see',   mis: 'se',    exp: "See has two e's: s-e-e." },
  32: { lastWord: 'hear',  mis: 'heer',  exp: "Hear is spelled h-e-a-r." },
  44: { lastWord: 'run',   mis: 'rn',    exp: "Run needs a u: r-u-n." },
};

// === Category 2: Broken Punctuation Fixes (5 days, excluding 61/62) ===
// Punct correction w has misspelled form; r doesn't startWith w.
// Fix: Change w to correctly-spelled last word.
const PUNCT_FIXES = {
  51: 'nice',
  59: 'table',
  70: 'soup',
  73: 'table',
  78: 'fly',
};

function fixTeachingPoint(day, fix) {
  var s = day.sentences[0];
  var words = s.orig.split(' ');
  var lastIdx = words.length - 1;

  if (words[lastIdx].toLowerCase() !== fix.lastWord.toLowerCase()) {
    console.log('  WARNING Day ' + day.day + ': expected "' + fix.lastWord + '" got "' + words[lastIdx] + '"');
    return false;
  }

  words[lastIdx] = fix.mis;
  s.orig = words.join(' ');

  for (var i = 0; i < s.corr.length; i++) {
    var c = s.corr[i];
    if (c.t !== 'capitalization' && c.t !== 'punctuation' && c.w.toLowerCase() === c.r.toLowerCase()) {
      c.t = 'spelling';
      c.w = fix.mis;
      c.r = fix.lastWord;
      c.e = fix.exp;
      console.log('  Day ' + day.day + ': TP -> spell(' + fix.mis + ' -> ' + fix.lastWord + ')');
      return true;
    }
  }
  console.log('  WARNING Day ' + day.day + ': no teaching point found');
  return false;
}

function fixBrokenPunct(day, correctWord) {
  var s = day.sentences[0];
  for (var i = 0; i < s.corr.length; i++) {
    var c = s.corr[i];
    if (c.t === 'punctuation' && !c.r.toLowerCase().startsWith(c.w.toLowerCase())) {
      var oldW = c.w;
      c.w = correctWord;
      console.log('  Day ' + day.day + ': punct w "' + oldW + '" -> "' + correctWord + '"');
      return true;
    }
  }
  return false;
}

// === Category 3: Days 61 & 62 (3-word sentences needing extension to 4 words) ===
function fixDay61(data) {
  var day = data.find(function(d) { return d.day === 61; });
  if (!day) return;
  var s = day.sentences[0];

  s.orig = "i drnk mi melk";
  s.fixed = "I drink my milk.";

  s.corr = [
    { t: "capitalization", w: "i", r: "I", e: "The first word in a sentence starts with a big letter." },
    { t: "spelling", w: "drnk", r: "drink", e: "Drink needs an i: d-r-i-n-k." },
    { t: "spelling", w: "mi", r: "my", e: "My is spelled m-y." },
    { t: "spelling", w: "melk", r: "milk", e: "Milk has an i, not e." },
    { t: "punctuation", w: "milk", r: "milk.", e: "A sentence ends with a period." }
  ];

  s.pos = [
    { w: "I", p: "PRO" },
    { w: "drink", p: "V" },
    { w: "my", p: "ART" },
    { w: "milk", p: "N" }
  ];

  // Update manip examples to reference new sentence
  if (s.manip && s.manip.examples) {
    s.manip.examples.forEach(function(ex) {
      if (ex.orig) ex.orig = ex.orig.replace(/I drink milk/g, "I drink my milk");
      if (ex.changed) ex.changed = ex.changed.replace(/I drink milk/g, "I drink my milk");
    });
  }

  console.log("  Day 61: Rebuilt as 'I drink my milk.'");
}

function fixDay62(data) {
  var day = data.find(function(d) { return d.day === 62; });
  if (!day) return;
  var s = day.sentences[0];

  s.orig = "i ete teh bred";
  s.fixed = "I eat the bread.";

  s.corr = [
    { t: "capitalization", w: "i", r: "I", e: "The first word in a sentence starts with a big letter." },
    { t: "spelling", w: "ete", r: "eat", e: "Eat is spelled e-a-t." },
    { t: "spelling", w: "teh", r: "the", e: "The is spelled t-h-e." },
    { t: "spelling", w: "bred", r: "bread", e: "Bread has an a: b-r-e-a-d." },
    { t: "punctuation", w: "bread", r: "bread.", e: "A sentence ends with a period." }
  ];

  s.pos = [
    { w: "I", p: "PRO" },
    { w: "eat", p: "V" },
    { w: "the", p: "ART" },
    { w: "bread", p: "N" }
  ];

  if (s.manip && s.manip.examples) {
    s.manip.examples.forEach(function(ex) {
      if (ex.orig) ex.orig = ex.orig.replace(/I eat bread/g, "I eat the bread");
      if (ex.changed) ex.changed = ex.changed.replace(/I eat bread/g, "I eat the bread");
    });
  }

  console.log("  Day 62: Rebuilt as 'I eat the bread.'");
}

// === Main Processing ===
var totalFixes = 0;

for (var unit = 1; unit <= 6; unit++) {
  var filePath = 'data/prek-unit' + unit + '.json';
  var data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  var unitFixes = 0;

  data.forEach(function(day) {
    var dayNum = day.day;

    if (TP_FIXES[dayNum]) {
      if (fixTeachingPoint(day, TP_FIXES[dayNum])) unitFixes++;
    }

    if (PUNCT_FIXES[dayNum]) {
      if (fixBrokenPunct(day, PUNCT_FIXES[dayNum])) unitFixes++;
    }
  });

  // Special fixes for days 61, 62 (Unit 3)
  if (unit === 3) {
    fixDay61(data);
    fixDay62(data);
    unitFixes += 2;
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log('Unit ' + unit + ': ' + unitFixes + ' fixes');
  totalFixes += unitFixes;
}

// Rebuild prek.json
var all = [];
for (var i = 1; i <= 6; i++) {
  var d = JSON.parse(fs.readFileSync('data/prek-unit' + i + '.json', 'utf8'));
  all = all.concat(d);
}
fs.writeFileSync('data/prek.json', JSON.stringify(all, null, 2));

console.log('\nTotal: ' + totalFixes + ' fixes applied');
console.log('Combined prek.json rebuilt: ' + all.length + ' days');

// === Verification ===
var tpRemaining = 0;
var punctBroken = 0;
all.forEach(function(day) {
  day.sentences[0].corr.forEach(function(c) {
    if (c.t !== 'capitalization' && c.t !== 'punctuation' && c.w.toLowerCase() === c.r.toLowerCase()) {
      tpRemaining++;
      console.log('  TP REMAINING: Day ' + day.day + ' "' + c.w + '" -> "' + c.r + '" (' + c.t + ')');
    }
    if (c.t === 'punctuation' && !c.r.toLowerCase().startsWith(c.w.toLowerCase())) {
      punctBroken++;
      console.log('  PUNCT BROKEN: Day ' + day.day + ' w="' + c.w + '" r="' + c.r + '"');
    }
  });
});
console.log('\nRemaining teaching points: ' + tpRemaining);
console.log('Remaining broken puncts: ' + punctBroken);
