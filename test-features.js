// Comprehensive test for Grammar Quest pedagogical features
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const appDir = __dirname;
let errors = 0;
let passed = 0;

function assert(condition, msg) {
    if (condition) { passed++; }
    else { errors++; console.error('  FAIL: ' + msg); }
}

function section(name) { console.log('\n=== ' + name + ' ==='); }

// ---- TEST 1: All data files load and parse ----
section('Data Files');
const gradeFiles = ['days.json', 'prek.json', 'gradek.json', 'grade1.json', 'grade2.json',
    'grade3.json', 'grade4.json', 'grade5.json', 'ufli.json'];

gradeFiles.forEach(file => {
    const fp = path.join(appDir, 'data', file);
    try {
        const data = JSON.parse(fs.readFileSync(fp, 'utf8'));
        assert(Array.isArray(data) && data.length > 0, file + ' should be non-empty array');
        console.log('  OK: ' + file + ' (' + data.length + ' entries)');

        const first = data[0];
        assert(typeof first.day === 'number', file + ' entries should have numeric day');
        assert(Array.isArray(first.sentences), file + ' entries should have sentences array');
        assert(first.sentences.length >= 1, file + ' should have at least 1 sentence');

        const sent = first.sentences[0];
        assert(typeof sent.orig === 'string', file + ' sentence should have orig');
        assert(typeof sent.fixed === 'string', file + ' sentence should have fixed');
        assert(Array.isArray(sent.corr), file + ' sentence should have corr array');
        assert(Array.isArray(sent.pos), file + ' sentence should have pos array');
        assert(typeof sent.manip === 'object', file + ' sentence should have manip object');
        assert(typeof sent.vocab === 'object', file + ' sentence should have vocab object');

        sent.corr.forEach((c, i) => {
            assert(typeof c.w === 'string', file + ' corr[' + i + '] should have w');
            assert(typeof c.r === 'string', file + ' corr[' + i + '] should have r');
            assert(typeof c.t === 'string', file + ' corr[' + i + '] should have t');
            assert(typeof c.e === 'string', file + ' corr[' + i + '] should have e');
        });
    } catch (e) {
        errors++;
        console.error('  FAIL: Could not load ' + file + ': ' + e.message);
    }
});

// ---- TEST 2: Word families file ----
section('Word Families');
try {
    const wfContent = fs.readFileSync(path.join(appDir, 'data', 'word-families.js'), 'utf8');
    // Use Function constructor to evaluate const declarations (vm.runInNewContext can't expose const to sandbox)
    const wfFn = new Function(wfContent + '\nreturn WORD_FAMILIES;');
    const WORD_FAMILIES = wfFn();
    assert(typeof WORD_FAMILIES === 'object', 'WORD_FAMILIES should be defined');
    const keys = Object.keys(WORD_FAMILIES);
    console.log('  OK: WORD_FAMILIES has ' + keys.length + ' skill entries');
    assert(keys.length >= 50, 'Should have at least 50 skill entries');

    const first = WORD_FAMILIES[keys[0]];
    assert(Array.isArray(first.families), 'Each entry should have families array');
    assert(first.families[0].pattern, 'Each family should have a pattern');
    assert(Array.isArray(first.families[0].words), 'Each family should have words array');

    // Verify UFLI skills coverage
    const ufliData = JSON.parse(fs.readFileSync(path.join(appDir, 'data', 'ufli.json'), 'utf8'));
    const ufliSkills = new Set();
    ufliData.forEach(d => d.sentences.forEach(s => { if (s.ufliSkill) ufliSkills.add(s.ufliSkill); }));
    let matched = 0;
    ufliSkills.forEach(skill => { if (WORD_FAMILIES[skill]) matched++; });
    console.log('  OK: ' + matched + '/' + ufliSkills.size + ' UFLI skills have word families');
    assert(matched > ufliSkills.size * 0.7, 'At least 70% of UFLI skills should have word families');
} catch (e) {
    errors++;
    console.error('  FAIL: Word families: ' + e.message);
}

// ---- TEST 3: app.js functions and structure ----
section('App.js Structure');
const appJs = fs.readFileSync(path.join(appDir, 'js', 'app.js'), 'utf8');

const requiredFunctions = [
    'loadGradeData', 'switchGrade', 'setMode', 'toggleMode', 'updateModeButtons', 'toggleReviewMode',
    'saveState', 'loadSavedState', 'loadSavedStates',
    'markDayCompleted', 'getCompletedDays', 'flagForReview', 'unflagForReview',
    'getFlaggedSentences', 'saveWritingResponse', 'getWritingResponse',
    'updateStreak', 'getStreak', 'updateDashboard',
    'speakText', 'speakSentence', 'speakWord',
    'buildUfliPanel', 'buildDiagram', 'buildPOSTags',
    'renderDay', 'formatSentence', 'getBtnText', 'restore',
    'advance', 'resetSentence', 'checkAllComplete',
    'openPopout', 'closePopout', 'advancePopout', 'resetPopout', 'restorePopout',
    'openImmersive', 'closeImmersive', 'advanceImmersive', 'resetImmersive', 'restoreImmersive',
    'buildHelpHighlights', 'openImmersiveFirst', 'buildImmersiveStepBar',
    'checkGuess', 'checkPOSClick', 'buildInteractiveHint',
    'printWorksheet',
    'getMaxDay', 'prevDay', 'nextDay', 'goToDay', 'setSize',
    'showHelp', 'hideHelp',
    'getCorrections', 'getOrderedPOS', 'getTypeLabel', 'getTypeBadge',
    'getCSSClass', 'getPOSDesc', 'renderCorr'
];

let fnCount = 0;
requiredFunctions.forEach(fn => {
    const regex = new RegExp('function\\s+' + fn + '\\s*\\(');
    if (regex.test(appJs)) fnCount++;
    else { errors++; console.error('  FAIL: Function ' + fn + ' not found'); }
});
console.log('  OK: ' + fnCount + '/' + requiredFunctions.length + ' required functions found');
passed += fnCount;

// Constants
['TAG_CONFIG', 'DISPLAY_ORDER', 'GRADE_FILES', 'GRADE_LABELS', 'STORAGE_PREFIX'].forEach(c => {
    assert(appJs.includes('const ' + c), c + ' constant should exist');
});
console.log('  OK: All required constants found');

// Bug fixes
assert(appJs.includes('_interactivePending'), 'Debounce guard present');
assert(appJs.includes("idx === 'popout'"), 'Popout interactive fix present');
assert(appJs.includes('checkAllComplete'), 'checkAllComplete extracted');
console.log('  OK: All bug fixes present');

// ---- TEST 4: CSS styles ----
section('CSS Styles');
const css = fs.readFileSync(path.join(appDir, 'css', 'style.css'), 'utf8');

const requiredCSS = [
    '.mode-selector', '.mode-btn',
    '.dashboard', '.dash-progress', '.dash-progress-fill', '.dash-streak', '.dash-review-btn',
    '.tts-btn', '.tts-btn.speaking',
    '.interactive-hint', '.interactive-input', '.interactive-feedback',
    '.pos-clickable', '.pos-clickable.correct-pick',
    '.vocab-starter-input',
    '.diagram-section', '.diagram-table',
    '.word-families', '.wf-word',
    '.ufli-word-chip.clickable',
    '.help-highlight', '.help-banner',
    '.immersive-overlay', '.immersive-sentence'
];

let cssCount = 0;
requiredCSS.forEach(sel => {
    if (css.includes(sel)) cssCount++;
    else { errors++; console.error('  FAIL: CSS missing ' + sel); }
});
passed += cssCount;
console.log('  OK: ' + cssCount + '/' + requiredCSS.length + ' CSS selectors found');

// ---- TEST 5: HTML structure ----
section('HTML Structure');
const html = fs.readFileSync(path.join(appDir, 'index.html'), 'utf8');

const requiredHTML = [
    'id="modeShow"', 'id="modeHelp"', 'id="modePractice"', 'id="dashboard"',
    'id="dashFill"', 'id="dashStreak"', 'id="dashReviewBtn"',
    'setMode(', 'toggleReviewMode()', 'id="sizeSlider"',
    'word-families.js', 'app.js'
];

let htmlCount = 0;
requiredHTML.forEach(el => {
    if (html.includes(el)) htmlCount++;
    else { errors++; console.error('  FAIL: HTML missing ' + el); }
});
passed += htmlCount;
console.log('  OK: ' + htmlCount + '/' + requiredHTML.length + ' HTML elements found');

// ---- TEST 6: UFLI data quality ----
section('UFLI Data Quality');
const ufliData = JSON.parse(fs.readFileSync(path.join(appDir, 'data', 'ufli.json'), 'utf8'));
console.log('  UFLI has ' + ufliData.length + ' lessons');

let ufliIssues = 0;
ufliData.forEach(d => {
    d.sentences.forEach(s => {
        if (!s.ufliLesson) ufliIssues++;
        if (!s.ufliSkill) ufliIssues++;
        if (!s.ufliSection) ufliIssues++;
        if (!s.sentenceType) ufliIssues++;
        if (!Array.isArray(s.phonicsWords)) ufliIssues++;
        if (!Array.isArray(s.heartWords)) ufliIssues++;
    });
});
assert(ufliIssues === 0, 'All UFLI sentences should have required fields (' + ufliIssues + ' issues)');
console.log('  OK: UFLI field validation passed');

// ---- TEST 7: Feature-specific checks ----
section('Feature Specifics');
assert(appJs.includes('showAnswers'), 'Teacher answer key param');
assert(appJs.includes('ANSWER KEY'), 'Answer key banner');
assert(appJs.includes('Teacher Copy'), 'Teacher copy label');
assert(appJs.includes('printWorksheet(${idx}, true)'), 'Answer key button');
console.log('  OK: Teacher answer key');

assert(appJs.includes('buildDiagram'), 'Sentence diagramming function');
assert(appJs.includes('Subject'), 'Diagram shows Subject');
console.log('  OK: Sentence diagramming');

assert(appJs.includes('speechSynthesis'), 'TTS API used');
assert(appJs.includes('speakWord'), 'Word pronunciation function');
console.log('  OK: Text-to-Speech');

assert(appJs.includes('vocab-starter-input'), 'Writing textarea');
assert(appJs.includes('saveWritingResponse'), 'Writing saves');
console.log('  OK: Sentence starter input');

assert(appJs.includes('flagForReview'), 'Review flagging');
assert(appJs.includes('reviewMode'), 'Review mode');
console.log('  OK: Spaced review');

assert(appJs.includes('localStorage'), 'localStorage used');
assert(appJs.includes('gq_'), 'Storage prefix');
console.log('  OK: Persistence');

assert(appJs.includes('appMode'), 'App mode var');
assert(appJs.includes('buildInteractiveHint'), 'Interactive hints');
assert(appJs.includes('checkGuess'), 'Correction self-check');
assert(appJs.includes('checkPOSClick'), 'POS click game');
assert(appJs.includes('openImmersive'), 'Immersive practice');
assert(appJs.includes('buildHelpHighlights'), 'Help mode highlights');
console.log('  OK: Interactive mode');

// ---- SUMMARY ----
console.log('\n========================================');
console.log('RESULTS: ' + passed + ' passed, ' + errors + ' failed');
console.log('========================================');

process.exit(errors > 0 ? 1 : 0);
