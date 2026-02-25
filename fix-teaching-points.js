const fs = require('fs');

// Comprehensive word → [misspelling, explanation] mapping
const MISSPELLINGS = {
  // Verbs
  'see': ['se', "See has two e's: s-e-e."],
  'like': ['lik', "Like has a silent e: l-i-k-e."],
  'can': ['kan', "Can starts with c, not k."],
  'run': ['runn', "Run has only one n."],
  'go': ['gow', "Go is spelled g-o."],
  'sit': ['stt', "Sit needs an i: s-i-t."],
  'has': ['haz', "Has ends with s, not z."],
  'am': ['em', "Am is spelled a-m."],
  'eat': ['eet', "Eat is spelled e-a-t."],
  'drink': ['drnk', "Drink needs an i: d-r-i-n-k."],
  'hear': ['heer', "Hear is spelled h-e-a-r."],
  'stand': ['stnd', "Stand needs an a: s-t-a-n-d."],
  'play': ['pla', "Play ends with y: p-l-a-y."],
  'hop': ['hopp', "Hop has only one p."],
  'hops': ['hopps', "Hops has only one p."],
  'runs': ['runns', "Runs has only one n."],
  'grows': ['groes', "Grows is spelled g-r-o-w-s."],
  'rides': ['ridez', "Rides ends with s, not z."],
  'swim': ['swm', "Swim needs an i: s-w-i-m."],
  'ran': ['rann', "Ran has only one n."],
  'ride': ['ried', "Ride is spelled r-i-d-e."],
  'cook': ['kook', "Cook starts with c, not k."],
  'wash': ['wosh', "Wash has an a: w-a-s-h."],
  'sleep': ['slep', "Sleep has two e's: s-l-e-e-p."],
  'love': ['luv', "Love is spelled l-o-v-e."],
  'build': ['bild', "Build has a u: b-u-i-l-d."],
  'share': ['sher', "Share is spelled s-h-a-r-e."],
  'learn': ['lern', "Learn has an a: l-e-a-r-n."],
  // Nouns
  'bag': ['bg', "Bag needs an a: b-a-g."],
  'ball': ['bal', "Ball has two l's: b-a-l-l."],
  'baby': ['bayb', "Baby is spelled b-a-b-y."],
  'bed': ['bedd', "Bed has only one d."],
  'bike': ['bik', "Bike has a silent e."],
  'block': ['blok', "Block ends with c-k."],
  'boy': ['boi', "Boy ends with y: b-o-y."],
  'bug': ['bugg', "Bug has only one g."],
  'bus': ['buss', "Bus has only one s."],
  'car': ['kar', "Car starts with c, not k."],
  'cat': ['kat', "Cat starts with c, not k."],
  'circle': ['sirkl', "Circle is spelled c-i-r-c-l-e."],
  'class': ['klass', "Class starts with c, not k."],
  'cups': ['kupps', "Cups starts with c: c-u-p-s."],
  'dad': ['dadd', "Dad has only one d at the end."],
  'dog': ['dg', "Dog needs an o: d-o-g."],
  'doll': ['dol', "Doll has two l's: d-o-l-l."],
  'frog': ['frig', "Frog has an o: f-r-o-g."],
  'girl': ['grl', "Girl needs an i: g-i-r-l."],
  'hands': ['hndz', "Hands needs an a: h-a-n-d-s."],
  'hat': ['hatt', "Hat has only one t."],
  'heart': ['hart', "Heart has an e: h-e-a-r-t."],
  'home': ['hom', "Home has a silent e."],
  'milk': ['melk', "Milk has an i, not e."],
  'mom': ['momm', "Mom has only one m at the end."],
  'rice': ['ris', "Rice has a silent e: r-i-c-e."],
  'school': ['skool', "School starts with s-c-h."],
  'park': ['prk', "Park needs an a: p-a-r-k."],
  'store': ['stor', "Store has a silent e."],
  'shapes': ['shapez', "Shapes ends with s, not z."],
  'shirt': ['shert', "Shirt has an i: s-h-i-r-t."],
  'shoe': ['shoo', "Shoe is spelled s-h-o-e."],
  'square': ['sqare', "Square has a u: s-q-u-a-r-e."],
  'star': ['starr', "Star has only one r."],
  'tower': ['towr', "Tower needs an e: t-o-w-e-r."],
  'toy': ['toi', "Toy ends with y: t-o-y."],
  'animals': ['animuls', "Animals has an a: a-n-i-m-a-l-s."],
  // Adjectives
  'big': ['bige', "Big does not have an e."],
  'red': ['rede', "Red does not have an e."],
  'blue': ['bloo', "Blue is spelled b-l-u-e."],
  'tall': ['tawl', "Tall has two l's: t-a-l-l."],
  'small': ['smal', "Small has two l's."],
  'hot': ['hott', "Hot has only one t."],
  'wet': ['wett', "Wet has only one t."],
  'cold': ['kold', "Cold starts with c, not k."],
  'mad': ['madd', "Mad has only one d."],
  'fast': ['fasst', "Fast has only one s."],
  'fat': ['fatt', "Fat has only one t."],
  'tired': ['tierd', "Tired is spelled t-i-r-e-d."],
  'funny': ['funy', "Funny has two n's: f-u-n-n-y."],
  'smart': ['smrt', "Smart needs an a: s-m-a-r-t."],
  'new': ['nw', "New needs an e: n-e-w."],
  'warm': ['worm', "Warm has an a, not o."],
  'far': ['farr', "Far has only one r."],
  'fun': ['funn', "Fun has only one n."],
  // Prepositions & small words
  'from': ['frum', "From has an o: f-r-o-m."],
  'with': ['wif', "With ends in t-h: w-i-t-h."],
  'on': ['onn', "On has only one n."],
  'at': ['att', "At has only one t."],
  'to': ['tew', "To is spelled t-o."],
  'in': ['inn', "In has only one n."],
  'up': ['upp', "Up has only one p."],
  'by': ['biy', "By is spelled b-y."],
  'and': ['annd', "And has only one n."],
  'today': ['tooday', "Today starts with t-o."],
  'together': ['togethr', "Together needs an e at the end."],
  'our': ['owr', "Our is spelled o-u-r."],
  // Articles
  'a': ['uh', "The word 'a' is just the letter a."],
  'the': ['teh', "The is spelled t-h-e."],
  'an': ['en', "An is spelled a-n."],
  'my': ['mi', "My is spelled m-y."],
  'is': ['iz', "Is is spelled i-s, not i-z."],
  'it': ['itt', "It has only one t."],
};

function getMisspelling(word) {
  const lower = word.toLowerCase();
  if (MISSPELLINGS[lower]) {
    return { mis: MISSPELLINGS[lower][0], exp: MISSPELLINGS[lower][1] };
  }
  // Generic fallback: double last consonant or drop a vowel
  const vowels = 'aeiou';
  if (lower.length >= 3) {
    // Try dropping a vowel
    for (let i = 1; i < lower.length - 1; i++) {
      if (vowels.includes(lower[i])) {
        const mis = lower.slice(0, i) + lower.slice(i + 1);
        return { mis, exp: `${word} is spelled ${lower.split('').join('-')}.` };
      }
    }
    // Double last consonant
    return { mis: lower + lower[lower.length - 1], exp: `${word} has only one '${lower[lower.length-1]}' at the end.` };
  }
  // 2-letter word: double last char
  return { mis: lower + lower[lower.length - 1], exp: `${word} is spelled ${lower.split('').join('-')}.` };
}

function processDay(day) {
  const s = day.sentences[0];
  const words = s.orig.split(' ');
  const fixedWords = s.fixed.replace(/[.,!?]/g, '').split(/\s+/);

  // Step 1: Map each correction to a word position in orig
  const claimed = new Set();
  const corrPositions = [];

  s.corr.forEach((c, ci) => {
    const target = c.w.toLowerCase();
    let found = -1;
    for (let i = 0; i < words.length; i++) {
      if (!claimed.has(i) && words[i].toLowerCase() === target) {
        found = i;
        claimed.add(i);
        break;
      }
    }
    corrPositions.push(found);
  });

  // Step 2: Find uncorrected word positions
  const uncorrected = [];
  for (let i = 0; i < words.length; i++) {
    if (!claimed.has(i)) uncorrected.push(i);
  }

  let uncorrectedPtr = 0;
  let fixes = 0;

  // Step 3: Process each teaching point
  s.corr.forEach((c, ci) => {
    if (c.t === 'capitalization' || c.t === 'punctuation') return;
    if (c.w.toLowerCase() !== c.r.toLowerCase()) return; // real correction, skip

    const pos = corrPositions[ci];

    if (pos >= 0) {
      // Teaching point has a mapped position - misspell that word directly
      const word = words[pos].toLowerCase();
      const entry = getMisspelling(word);
      words[pos] = entry.mis;
      c.t = 'spelling';
      c.w = entry.mis;
      // c.r stays the same (correct spelling from fixed)
      c.e = entry.exp;
      fixes++;
    } else {
      // Teaching point couldn't be mapped (e.g., pronoun = first word conflict)
      // Redirect to an uncorrected word
      if (uncorrectedPtr < uncorrected.length) {
        const newPos = uncorrected[uncorrectedPtr++];
        const origWord = words[newPos].toLowerCase();
        const correctWord = fixedWords[newPos] || origWord;
        const entry = getMisspelling(origWord);
        words[newPos] = entry.mis;
        c.t = 'spelling';
        c.w = entry.mis;
        c.r = correctWord;
        c.e = entry.exp;
        fixes++;
      } else {
        console.log('  WARNING Day ' + day.day + ': no uncorrected word for teaching point "' + c.w + '"');
      }
    }
  });

  if (fixes > 0) {
    s.orig = words.join(' ');
  }

  return fixes;
}

// Process each unit file
let totalFixes = 0;
let totalWarnings = 0;

for (let unit = 1; unit <= 6; unit++) {
  const filePath = `data/prek-unit${unit}.json`;
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let unitFixes = 0;

  data.forEach(day => {
    unitFixes += processDay(day);
  });

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`Unit ${unit}: ${unitFixes} teaching points fixed`);
  totalFixes += unitFixes;
}

// Rebuild combined prek.json
let all = [];
for (let i = 1; i <= 6; i++) {
  const d = JSON.parse(fs.readFileSync(`data/prek-unit${i}.json`, 'utf8'));
  all = all.concat(d);
}
fs.writeFileSync('data/prek.json', JSON.stringify(all, null, 2));

console.log(`\nTotal: ${totalFixes} teaching points converted to real corrections`);
console.log(`Combined prek.json rebuilt: ${all.length} days`);

// Verify no teaching points remain
let remaining = 0;
all.forEach(day => {
  day.sentences[0].corr.forEach(c => {
    if (c.t !== 'capitalization' && c.t !== 'punctuation' && c.w.toLowerCase() === c.r.toLowerCase()) {
      remaining++;
      console.log(`  REMAINING: Day ${day.day} "${c.w}" → "${c.r}"`);
    }
  });
});
console.log(`Remaining teaching points: ${remaining}`);
