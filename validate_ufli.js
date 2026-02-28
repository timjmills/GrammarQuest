const d = require('./data/ufli-part1.json');
console.log(d.length + ' days');
let errs = [];
d.forEach((x, i) => {
  if (x.day !== i + 1) errs.push('bad day num ' + x.day);
  if (!x.sentences || x.sentences.length !== 2)
    errs.push('d' + x.day + ' sents=' + (x.sentences ? x.sentences.length : 0));
  else x.sentences.forEach((s, j) => {
    if (!s.corr || s.corr.length !== 5)
      errs.push('d' + x.day + 's' + (j+1) + ' corr=' + (s.corr ? s.corr.length : 0));
  });
});
console.log(errs.length === 0 ? 'ALL PASS' : errs.join('\n'));
