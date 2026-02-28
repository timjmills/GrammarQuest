let DATA = [];
let currentDay = 1;
let currentGrade = 'mixed';
let interactiveMode = false;
let reviewMode = false;

const GRADE_FILES = {
    'mixed': 'data/days.json',
    'prek': 'data/prek.json',
    'gradek': 'data/gradek.json',
    'grade1': 'data/grade1.json',
    'grade2': 'data/grade2.json',
    'grade3': 'data/grade3.json',
    'grade4': 'data/grade4.json',
    'grade5': 'data/grade5.json',
    'ufli': 'data/ufli.json'
};

const GRADE_LABELS = {
    'mixed': '5 Errors | POS: N\u2192V\u2192ADJ\u2192ADV\u2192PREP\u2192Other',
    'prek': '5 Errors | Pre-K ELL: Nouns \u2022 Verbs \u2022 Classroom Survival',
    'gradek': '5 Errors | Grade K: Nouns \u2022 Verbs \u2022 CVC Spelling \u2022 Sight Words',
    'grade1': '5 Errors | Grade 1: Nouns \u2022 Verbs \u2022 Sentences \u2022 Spelling',
    'grade2': '5 Errors | Grade 2: Irregular Plurals \u2022 Past Tense \u2022 Pronouns',
    'grade3': '5 Errors | Grade 3: Nouns \u2022 Verbs \u2022 Sentences \u2022 Roots',
    'grade4': '5 Errors | Grade 4: Progressive Tenses \u2022 Modals \u2022 Roots',
    'grade5': '5 Errors | Grade 5: Perfect Tenses \u2022 Clauses \u2022 Roots',
    'ufli': '5 Errors | UFLI Phonics: Systematic Phonics \u2022 Heart Words \u2022 Decodable Text'
};

const TAG_CONFIG = {
    'N': {abbr: 'N', name: 'Noun', css: 'noun'},
    'V': {abbr: 'V', name: 'Verb', css: 'verb'},
    'ADJ': {abbr: 'ADJ', name: 'Adj', css: 'adj'},
    'ADV': {abbr: 'ADV', name: 'Adv', css: 'adv'},
    'PRO': {abbr: 'PRO', name: 'Pronoun', css: 'pro'},
    'PREP': {abbr: 'PREP', name: 'Prep', css: 'prep'},
    'CONJ': {abbr: 'CONJ', name: 'Conj', css: 'noun'},
    'SUBCONJ': {abbr: 'SC', name: 'SubConj', css: 'prep'},
    'MODAL': {abbr: 'MV', name: 'Modal Verb', css: 'verb'},
    'PASS': {abbr: 'PV', name: 'Passive Verb', css: 'verb'},
    'PP': {abbr: 'PP', name: 'Past Part', css: 'verb'},
    'RELPRO': {abbr: 'RP', name: 'Rel Pro', css: 'pro'},
    'OBJPRO': {abbr: 'OP', name: 'Obj Pro', css: 'pro'},
    'POSS': {abbr: 'POSS', name: 'Poss', css: 'adj'},
    'ART': {abbr: 'ART', name: 'Article', css: 'noun'},
    'DEM': {abbr: 'DEM', name: 'Dem', css: 'adj'}
};
const DISPLAY_ORDER = ['N', 'V', 'MODAL', 'PASS', 'PP', 'ADJ', 'ADV', 'PRO', 'RELPRO', 'OBJPRO', 'PREP', 'SUBCONJ', 'CONJ', 'POSS', 'ART', 'DEM'];

function buildPOSTags(orderedPOS) {
    const counts = {};
    orderedPOS.forEach(p => {
        const t = p.t.toUpperCase();
        counts[t] = (counts[t] || 0) + 1;
    });
    let tags = '';
    DISPLAY_ORDER.forEach(type => {
        if (counts[type]) {
            const cfg = TAG_CONFIG[type] || {abbr: type, name: type, css: 'noun'};
            tags += `<span class="tag ${cfg.css}" title="${getPOSDesc(type)}">${counts[type]} ${cfg.abbr}</span>`;
        }
    });
    return tags;
}

// ========== LOCALSTORAGE PERSISTENCE ==========
const STORAGE_PREFIX = 'gq_';
function saveState() {
    try {
        localStorage.setItem(STORAGE_PREFIX + 'states_' + currentGrade, JSON.stringify(states));
        localStorage.setItem(STORAGE_PREFIX + 'day_' + currentGrade, currentDay);
        localStorage.setItem(STORAGE_PREFIX + 'grade', currentGrade);
        localStorage.setItem(STORAGE_PREFIX + 'mode', interactiveMode ? 'interactive' : 'presentation');
        localStorage.setItem(STORAGE_PREFIX + 'textSize', document.documentElement.style.getPropertyValue('--size') || '26px');
        // Save completed days
        const completed = JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'completed_' + currentGrade) || '[]');
        localStorage.setItem(STORAGE_PREFIX + 'completed_' + currentGrade, JSON.stringify(completed));
        // Save flagged sentences for review
        const flagged = JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'flagged_' + currentGrade) || '[]');
        localStorage.setItem(STORAGE_PREFIX + 'flagged_' + currentGrade, JSON.stringify(flagged));
        // Save writing responses
        const writing = JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'writing_' + currentGrade) || '{}');
        localStorage.setItem(STORAGE_PREFIX + 'writing_' + currentGrade, JSON.stringify(writing));
    } catch (e) { /* localStorage full or unavailable */ }
}

function loadSavedState() {
    try {
        const savedGrade = localStorage.getItem(STORAGE_PREFIX + 'grade');
        if (savedGrade && GRADE_FILES[savedGrade]) {
            currentGrade = savedGrade;
        }
        interactiveMode = localStorage.getItem(STORAGE_PREFIX + 'mode') === 'interactive';
        const savedSize = localStorage.getItem(STORAGE_PREFIX + 'textSize');
        if (savedSize) {
            document.documentElement.style.setProperty('--size', savedSize);
            const sizeNum = parseInt(savedSize);
            const slider = document.getElementById('sizeSlider');
            if (slider) slider.value = sizeNum;
            const sizeVal = document.getElementById('sizeVal');
            if (sizeVal) sizeVal.textContent = savedSize;
        }
        // Restore mode toggle UI
        const modeSwitch = document.getElementById('modeSwitch');
        if (modeSwitch) modeSwitch.checked = interactiveMode;
        const modeLabel = document.getElementById('modeLabel');
        if (modeLabel) modeLabel.textContent = interactiveMode ? 'Interactive' : 'Presentation';
        // Restore streak
        updateStreak();
    } catch (e) { /* localStorage unavailable */ }
}

function loadSavedStates() {
    try {
        const saved = localStorage.getItem(STORAGE_PREFIX + 'states_' + currentGrade);
        if (saved) states = JSON.parse(saved);
        const savedDay = localStorage.getItem(STORAGE_PREFIX + 'day_' + currentGrade);
        if (savedDay) currentDay = parseInt(savedDay);
    } catch (e) { /* localStorage unavailable */ }
}

function markDayCompleted(day) {
    try {
        const key = STORAGE_PREFIX + 'completed_' + currentGrade;
        const completed = JSON.parse(localStorage.getItem(key) || '[]');
        if (!completed.includes(day)) {
            completed.push(day);
            localStorage.setItem(key, JSON.stringify(completed));
        }
        updateStreak();
        updateDashboard();
    } catch (e) {}
}

function getCompletedDays() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'completed_' + currentGrade) || '[]');
    } catch (e) { return []; }
}

function flagForReview(day, sentIdx) {
    try {
        const key = STORAGE_PREFIX + 'flagged_' + currentGrade;
        const flagged = JSON.parse(localStorage.getItem(key) || '[]');
        const entry = `${day}-${sentIdx}`;
        if (!flagged.includes(entry)) {
            flagged.push(entry);
            localStorage.setItem(key, JSON.stringify(flagged));
        }
        updateDashboard();
    } catch (e) {}
}

function unflagForReview(day, sentIdx) {
    try {
        const key = STORAGE_PREFIX + 'flagged_' + currentGrade;
        const flagged = JSON.parse(localStorage.getItem(key) || '[]');
        const entry = `${day}-${sentIdx}`;
        const idx = flagged.indexOf(entry);
        if (idx !== -1) {
            flagged.splice(idx, 1);
            localStorage.setItem(key, JSON.stringify(flagged));
        }
        updateDashboard();
    } catch (e) {}
}

function getFlaggedSentences() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'flagged_' + currentGrade) || '[]');
    } catch (e) { return []; }
}

function saveWritingResponse(day, sentIdx, text) {
    try {
        const key = STORAGE_PREFIX + 'writing_' + currentGrade;
        const writing = JSON.parse(localStorage.getItem(key) || '{}');
        writing[`${day}-${sentIdx}`] = text;
        localStorage.setItem(key, JSON.stringify(writing));
    } catch (e) {}
}

function getWritingResponse(day, sentIdx) {
    try {
        const writing = JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'writing_' + currentGrade) || '{}');
        return writing[`${day}-${sentIdx}`] || '';
    } catch (e) { return ''; }
}

// ========== STREAK TRACKING ==========
function updateStreak() {
    try {
        const streakData = JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'streak') || '{"count":0,"lastDate":""}');
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        if (streakData.lastDate === today) {
            // Already counted today
        } else if (streakData.lastDate === yesterday) {
            // Continue streak
            streakData.count++;
            streakData.lastDate = today;
        } else if (!streakData.lastDate) {
            // First time
            streakData.count = 1;
            streakData.lastDate = today;
        } else {
            // Streak broken
            streakData.count = 1;
            streakData.lastDate = today;
        }
        localStorage.setItem(STORAGE_PREFIX + 'streak', JSON.stringify(streakData));
        return streakData;
    } catch (e) { return { count: 0, lastDate: '' }; }
}

function getStreak() {
    try {
        const streakData = JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'streak') || '{"count":0,"lastDate":""}');
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        // If last activity was more than a day ago, streak is 0
        if (streakData.lastDate !== today && streakData.lastDate !== yesterday) {
            return 0;
        }
        return streakData.count;
    } catch (e) { return 0; }
}

// ========== DASHBOARD ==========
function updateDashboard() {
    const completed = getCompletedDays();
    const totalDays = DATA.length || 150;
    const pct = Math.round((completed.length / totalDays) * 100);
    const streak = getStreak();
    const flagged = getFlaggedSentences();

    const fill = document.getElementById('dashFill');
    const text = document.getElementById('dashText');
    const streakEl = document.getElementById('dashStreak');
    const reviewBtn = document.getElementById('dashReviewBtn');

    if (fill) fill.style.width = pct + '%';
    if (text) text.textContent = `${completed.length}/${totalDays} days done`;
    if (streakEl) {
        if (streak > 0) {
            streakEl.textContent = `\ud83d\udd25 ${streak} day streak!`;
            streakEl.style.display = '';
        } else {
            streakEl.style.display = 'none';
        }
    }
    if (reviewBtn) {
        if (flagged.length > 0) {
            reviewBtn.style.display = '';
            reviewBtn.textContent = `Review (${flagged.length})`;
            reviewBtn.classList.toggle('active', reviewMode);
        } else {
            reviewBtn.style.display = 'none';
            if (reviewMode) {
                reviewMode = false;
                renderDay();
            }
        }
    }
}

// ========== TEXT-TO-SPEECH ==========
function speakText(text, rate) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    // Slower for younger grades
    const youngGrades = ['prek', 'gradek', 'grade1', 'ufli'];
    utterance.rate = rate || (youngGrades.includes(currentGrade) ? 0.8 : 0.95);
    utterance.pitch = 1;

    // Update button state
    const btns = document.querySelectorAll('.tts-btn.speaking');
    btns.forEach(b => b.classList.remove('speaking'));

    utterance.onend = () => {
        document.querySelectorAll('.tts-btn.speaking').forEach(b => b.classList.remove('speaking'));
    };
    window.speechSynthesis.speak(utterance);
}

function speakSentence(idx) {
    const lesson = DATA.find(d => d.day === currentDay);
    if (!lesson) return;
    const sent = lesson.sentences[idx];
    const state = states[`${currentDay}-${idx}`];
    // Read the fixed sentence if corrections are done, otherwise the original
    const text = (state && state.phase >= 2) ? sent.fixed : sent.orig;
    // Clean HTML tags from text
    const clean = text.replace(/<[^>]+>/g, '');

    const btn = document.querySelector(`#tts-${idx}`);
    if (btn) btn.classList.add('speaking');
    speakText(clean);
}

function speakWord(word) {
    speakText(word, 0.7);
}

// ========== INIT ==========
document.addEventListener('DOMContentLoaded', () => {
    loadSavedState();
    // Update grade tab UI
    document.querySelectorAll('.grade-tab').forEach(t => t.classList.remove('active'));
    const tab = document.getElementById('tab-' + currentGrade);
    if (tab) tab.classList.add('active');
    document.getElementById('segmentBadge').textContent = GRADE_LABELS[currentGrade];
    loadGradeData(currentGrade);
});

function loadGradeData(grade) {
    fetch(GRADE_FILES[grade])
        .then(r => { if (!r.ok) throw new Error('Failed to load'); return r.json(); })
        .then(data => {
            DATA = data;
            states = {};
            loadSavedStates();
            // Validate saved day exists in data
            if (!DATA.find(d => d.day === currentDay)) {
                currentDay = data.length > 0 ? data[0].day : 1;
            }
            renderDay();
            updateDashboard();
        })
        .catch(() => {
            DATA = [];
            states = {};
            document.getElementById('content').innerHTML = '<div class="card" style="text-align:center;padding:40px"><p style="font-size:1.2rem;color:#e53935">Error loading data. Please refresh the page.</p></div>';
        });
}

function switchGrade(grade) {
    if (grade === currentGrade) return;
    if (popoutIdx !== null) closePopout();
    // Save current grade state before switching
    saveState();
    currentGrade = grade;

    // Update tab styling
    document.querySelectorAll('.grade-tab').forEach(t => t.classList.remove('active'));
    document.getElementById('tab-' + grade).classList.add('active');

    // Update segment badge
    document.getElementById('segmentBadge').textContent = GRADE_LABELS[grade];

    // Update help periods visibility
    const helpIds = ['mixed','prek','ufli','gradek','grade1','grade2','grade3','grade4','grade5'];
    helpIds.forEach(id => {
        const el = document.getElementById('help-' + id + '-periods');
        if (el) el.style.display = id === grade ? '' : 'none';
    });

    reviewMode = false;
    loadGradeData(grade);
}

// ========== MODE TOGGLE ==========
function toggleMode(checked) {
    interactiveMode = checked;
    const label = document.getElementById('modeLabel');
    if (label) label.textContent = interactiveMode ? 'Interactive' : 'Presentation';
    saveState();
    renderDay();
}

function toggleReviewMode() {
    reviewMode = !reviewMode;
    updateDashboard();
    renderDay();
}

// ========== APP STATE & FUNCTIONS ==========
let states = {};
let popoutIdx = null;

// RULE 1: EXACTLY 5 errors per sentence (hardcoded limit)
const MAX_ERRORS = 5;
const EXACT_ERRORS = 5;
function getCorrections(sent) {
    return sent.corr.slice(0, MAX_ERRORS);
}

// RULE 2: Sort POS by TYPE PRIORITY first, then left-to-right within each type
function getOrderedPOS(sent) {
    const fixed = sent.fixed.toLowerCase();
    const TYPE_PRIORITY = ['N', 'V', 'ADJ', 'ADV', 'PREP', 'PRO', 'OBJPRO', 'CONJ', 'SUBCONJ', 'ART', 'DEM', 'POSS', 'PP', 'RELPRO', 'PASS', 'MODAL'];

    const usedPositions = new Set();
    const posWithIndex = sent.pos.map((p, origIdx) => {
        const word = p.w.toLowerCase();
        let pos = -1;
        let searchFrom = 0;
        while (searchFrom < fixed.length) {
            const idx = fixed.indexOf(word, searchFrom);
            if (idx === -1) break;
            if (!usedPositions.has(idx)) { pos = idx; usedPositions.add(idx); break; }
            searchFrom = idx + 1;
        }
        return { ...p, position: pos >= 0 ? pos : 9999, origIdx };
    });

    posWithIndex.sort((a, b) => {
        const aTypeIdx = TYPE_PRIORITY.indexOf(a.t.toUpperCase());
        const bTypeIdx = TYPE_PRIORITY.indexOf(b.t.toUpperCase());
        const aPriority = aTypeIdx >= 0 ? aTypeIdx : 999;
        const bPriority = bTypeIdx >= 0 ? bTypeIdx : 999;
        if (aPriority !== bPriority) return aPriority - bPriority;
        return a.position - b.position;
    });

    const typeCounts = {};
    const typeCurrentNum = {};
    posWithIndex.forEach(p => {
        const t = p.t.toUpperCase();
        typeCounts[t] = (typeCounts[t] || 0) + 1;
    });

    return posWithIndex.map(p => {
        const t = p.t.toUpperCase();
        typeCurrentNum[t] = (typeCurrentNum[t] || 0) + 1;
        const total = typeCounts[t];
        const current = typeCurrentNum[t];
        const typeLabel = getTypeLabel(t);
        let question;
        if (total === 1) {
            question = `Find the ${typeLabel}`;
        } else {
            question = `Find ${typeLabel} ${current} of ${total}`;
        }
        return { ...p, q: question, typeNum: current, typeTotal: total };
    });
}

function getTypeLabel(t) {
    const labels = {
        'N': 'noun', 'V': 'verb', 'ADJ': 'adjective', 'PRO': 'pronoun',
        'PREP': 'preposition', 'ADV': 'adverb', 'CONJ': 'conjunction',
        'ART': 'article', 'SUBCONJ': 'subordinating conjunction',
        'OBJPRO': 'object pronoun', 'POSS': 'possessive', 'PP': 'past participle',
        'RELPRO': 'relative pronoun', 'PASS': 'passive verb', 'MODAL': 'modal verb',
        'DEM': 'demonstrative'
    };
    return labels[t] || t.toLowerCase();
}

function getTypeBadge(t) {
    const badges = {
        'N': 'NOUN', 'V': 'VERB', 'ADJ': 'ADJ', 'PRO': 'PRONOUN',
        'PREP': 'PREP', 'ADV': 'ADVERB', 'CONJ': 'CONJ',
        'ART': 'ARTICLE', 'SUBCONJ': 'SUB CONJ',
        'OBJPRO': 'OBJ PRO', 'POSS': 'POSS', 'PP': 'PAST PART',
        'RELPRO': 'REL PRO', 'PASS': 'PASSIVE', 'MODAL': 'MODAL VERB',
        'DEM': 'DEM'
    };
    return badges[t] || t;
}

function getTypeAbbr(t) {
    const abbrs = {
        'N': 'N', 'V': 'V', 'ADJ': 'ADJ', 'PRO': 'PRO',
        'PREP': 'PREP', 'ADV': 'ADV', 'CONJ': 'CONJ',
        'ART': 'ART', 'SUBCONJ': 'SC',
        'OBJPRO': 'OP', 'POSS': 'POSS', 'PP': 'PP',
        'RELPRO': 'RP', 'PASS': 'PV', 'MODAL': 'MV',
        'DEM': 'DEM'
    };
    return abbrs[t] || t;
}

function getPOSDesc(t) {
    const descs = {
        'N': 'Noun \u2013 a person, place, thing, or idea',
        'V': 'Verb \u2013 an action or state of being',
        'ADJ': 'Adjective \u2013 describes a noun (size, color, kind)',
        'ADV': 'Adverb \u2013 describes a verb, adjective, or adverb (how, when, where)',
        'PREP': 'Preposition \u2013 shows relationship (in, on, at, with, to)',
        'PRO': 'Pronoun \u2013 replaces a noun (I, he, she, we, they)',
        'OBJPRO': 'Object Pronoun \u2013 receives the action (me, him, her, us, them)',
        'CONJ': 'Conjunction \u2013 connects words or clauses (and, but, or, so)',
        'SUBCONJ': 'Subordinating Conjunction \u2013 begins a dependent clause (because, when, if, although)',
        'ART': 'Article \u2013 introduces a noun (a, an, the)',
        'DEM': 'Demonstrative \u2013 points to a specific noun (this, that, these, those)',
        'POSS': 'Possessive \u2013 shows ownership (my, your, his, her, our, their)',
        'PP': 'Past Participle \u2013 verb form used as adjective (broken, written, frozen)',
        'RELPRO': 'Relative Pronoun \u2013 introduces a relative clause (who, whom, which, that)',
        'PASS': 'Passive Verb \u2013 subject receives the action (was eaten, is known)',
        'MODAL': 'Modal Verb \u2013 shows ability, possibility, or permission (can, may, must, should)'
    };
    return descs[t] || t;
}

function getCSSClass(t) {
    const classes = {
        'N': 'noun', 'V': 'verb', 'ADJ': 'adj', 'PRO': 'pro',
        'PREP': 'prep', 'ADV': 'adv', 'CONJ': 'noun',
        'ART': 'noun', 'SUBCONJ': 'noun',
        'OBJPRO': 'pro', 'POSS': 'adj', 'PP': 'verb',
        'RELPRO': 'pro', 'PASS': 'verb', 'MODAL': 'verb',
        'DEM': 'adj'
    };
    return classes[t] || 'noun';
}

function buildUfliPanel(sent) {
    const typeLabel = sent.sentenceType === 'intro' ? 'Intro' : 'Application';
    const typeClass = sent.sentenceType === 'intro' ? 'intro' : 'app';
    const phonicsChips = (sent.phonicsWords || []).map(w =>
        `<span class="ufli-word-chip clickable" onclick="speakWord('${w.replace(/'/g, "\\'")}')">${w}</span>`
    ).join('');
    const heartChips = (sent.heartWords || []).map(w =>
        `<span class="ufli-heart-chip clickable" onclick="speakWord('${w.replace(/'/g, "\\'")}')">${w}</span>`
    ).join('');

    // Word families
    let wordFamiliesHtml = '';
    if (typeof WORD_FAMILIES !== 'undefined' && sent.ufliSkill && WORD_FAMILIES[sent.ufliSkill]) {
        const families = WORD_FAMILIES[sent.ufliSkill].families;
        if (families && families.length > 0) {
            wordFamiliesHtml = '<div class="word-families"><div class="wf-label">Word Families</div>';
            families.forEach(f => {
                wordFamiliesHtml += '<div class="wf-group"><span class="wf-pattern">' + f.pattern + ':</span>';
                f.words.forEach(w => {
                    wordFamiliesHtml += `<span class="wf-word" onclick="speakWord('${w.replace(/'/g, "\\'")}')">${w}</span>`;
                });
                wordFamiliesHtml += '</div>';
            });
            wordFamiliesHtml += '</div>';
        }
    }

    return `<div class="ufli-panel">
        <div class="ufli-top-row">
            <span class="ufli-lesson-badge">Lesson ${sent.ufliLesson}: ${sent.ufliSkill}</span>
            <span class="ufli-section">${sent.ufliSection}</span>
            <span class="ufli-type-badge ${typeClass}">${typeLabel}</span>
        </div>
        <div class="ufli-words-row">
            <div class="ufli-words-section">
                <div class="ufli-word-label">Phonics Words (tap to hear)</div>
                <div class="ufli-word-list">${phonicsChips}</div>
            </div>
            <div class="ufli-words-section">
                <div class="ufli-word-label">Heart Words (tap to hear)</div>
                <div class="ufli-word-list">${heartChips}</div>
            </div>
        </div>
        ${wordFamiliesHtml}
    </div>`;
}

// ========== SENTENCE DIAGRAMMING (Grades 3-5) ==========
function buildDiagram(sent) {
    const diagramGrades = ['grade3', 'grade4', 'grade5', 'mixed'];
    if (!diagramGrades.includes(currentGrade)) return '';

    const orderedPOS = getOrderedPOS(sent);
    const words = sent.fixed.split(/\s+/);

    // Find main verb position
    let verbIdx = -1;
    const posMap = {};
    orderedPOS.forEach(p => {
        const word = p.w.toLowerCase();
        for (let i = 0; i < words.length; i++) {
            if (words[i].toLowerCase().replace(/[.,!?;:]/g, '') === word && !posMap[i]) {
                posMap[i] = p.t.toUpperCase();
                if (verbIdx === -1 && ['V', 'MODAL', 'PASS'].includes(p.t.toUpperCase())) {
                    verbIdx = i;
                }
                break;
            }
        }
    });

    if (verbIdx === -1) return '';

    const subject = words.slice(0, verbIdx).join(' ') || '(implied)';
    const verb = words[verbIdx];
    const rest = words.slice(verbIdx + 1).join(' ') || '\u2014';

    return `<div class="section diagram-section">
        <div class="diagram-title">Sentence Diagram</div>
        <table class="diagram-table">
            <tr><th>Subject</th><th>Verb</th><th>Rest of Sentence</th></tr>
            <tr><td>${subject}</td><td><strong>${verb}</strong></td><td>${rest}</td></tr>
        </table>
    </div>`;
}

// ========== RENDER DAY ==========
function renderDay() {
    const lesson = DATA.find(d => d.day === currentDay);
    if (!lesson) return;

    const maxDay = getMaxDay();
    document.getElementById('currentDay').textContent = currentDay;
    document.getElementById('dayNum').textContent = currentDay;
    document.getElementById('maxDayNum').textContent = maxDay;
    document.getElementById('dayInput').value = currentDay;
    document.getElementById('dayInput').max = maxDay;
    document.getElementById('prevBtn').disabled = currentDay <= 1;
    document.getElementById('nextBtn').disabled = currentDay >= getMaxDay();

    // Check if all sentences for this day are complete
    let allComplete = true;

    let html = '';

    // In review mode, show only flagged sentences
    const flagged = getFlaggedSentences();
    const sentencesToShow = reviewMode
        ? lesson.sentences.map((s, i) => ({ sent: s, idx: i })).filter(x => flagged.includes(`${currentDay}-${x.idx}`))
        : lesson.sentences.map((s, i) => ({ sent: s, idx: i }));

    if (reviewMode && sentencesToShow.length === 0) {
        html = '<div class="card" style="text-align:center;padding:40px"><p style="font-size:1.1rem;color:var(--muted)">No sentences to review on this day. Use the arrows to check other days.</p></div>';
    }

    sentencesToShow.forEach(({ sent, idx }) => {
        const key = `${currentDay}-${idx}`;
        if (!states[key]) states[key] = { phase: 0, step: 0 };
        const state = states[key];

        if (state.phase < 7) allComplete = false;

        const corrections = getCorrections(sent);
        const orderedPOS = getOrderedPOS(sent);
        const tags = buildPOSTags(orderedPOS);

        // Build UFLI panel if in UFLI mode
        let ufliPanel = '';
        if (currentGrade === 'ufli' && sent.ufliLesson) {
            ufliPanel = buildUfliPanel(sent);
        }

        html += `
        <div class="card">
            <div class="card-header">
                <span class="card-num">${idx + 1}</span>
                <span class="find-label">
                    Find <span class="tag err">${corrections.length} errors</span> and ${tags}
                </span>
                <button class="tts-btn" id="tts-${idx}" onclick="speakSentence(${idx})" title="Read aloud" aria-label="Read sentence aloud">\ud83d\udd0a</button>
                <button class="popout-btn" onclick="openPopout(${idx})" title="Open as individual lesson" aria-label="Open as individual lesson">&#x26F6;</button>
                <button class="print-btn" onclick="printWorksheet(${idx})" title="Print worksheet" aria-label="Print worksheet">&#x1F5A8;</button>
                <button class="print-btn" onclick="printWorksheet(${idx}, true)" title="Print answer key" aria-label="Print answer key" style="color:#e53935">&#x1F511;</button>
            </div>
            ${ufliPanel}
            <div class="sentence-display" id="sent-${idx}">${formatSentence(sent, state)}</div>
            <div class="btn-row">
                <button class="check-btn ${state.phase>=7?'complete':''}" id="btn-${idx}" onclick="advance(${idx})">${getBtnText(state, sent)}</button>
                <button class="reset-btn" onclick="resetSentence(${idx})">Reset</button>
            </div>
            <div id="interactive-${idx}"></div>
            <div id="vocab-${idx}"></div>
            <div id="manip-${idx}"></div>
            <div id="pos-${idx}"></div>
            <div id="diagram-${idx}"></div>
            <div id="corr-${idx}"></div>
        </div>`;
    });
    document.getElementById('content').innerHTML = html;

    sentencesToShow.forEach(({ sent, idx }) => restore(idx, sent));

    if (allComplete && sentencesToShow.length > 0 && !reviewMode) {
        markDayCompleted(currentDay);
    }

    saveState();
    updateDashboard();
}

function formatSentence(sent, state) {
    const corrections = getCorrections(sent);
    const orderedPOS = getOrderedPOS(sent);

    // Once corrections are complete (phase 2+), show clean fixed sentence
    if (state.phase >= 2) {
        const plainText = sent.fixed;
        const posCount = Math.min(state.step - corrections.length, orderedPOS.length);
        const revealed = orderedPOS.slice(0, posCount);

        const annotations = [];
        const usedPositions = new Set();

        // Manipulation highlight (takes priority)
        if (state.phase >= 3 && state.phase <= 5) {
            const manipWord = sent.manip.word;
            const escaped = manipWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');
            const re = new RegExp(escaped, 'i');
            const match = re.exec(plainText);
            if (match) {
                annotations.push({ pos: match.index, len: match[0].length, type: 'manip', word: match[0] });
                for (let j = match.index; j < match.index + match[0].length; j++) usedPositions.add(j);
            }
        }

        // POS labels
        revealed.forEach(p => {
            const escaped = p.w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const re = new RegExp(`\\b${escaped}\\b`, 'gi');
            let match;
            while ((match = re.exec(plainText)) !== null) {
                if (!usedPositions.has(match.index)) {
                    annotations.push({ pos: match.index, len: match[0].length, type: 'pos', posType: p.t, word: match[0] });
                    for (let j = match.index; j < match.index + match[0].length; j++) usedPositions.add(j);
                    break;
                }
            }
        });

        annotations.sort((a, b) => b.pos - a.pos);
        let result = plainText;
        annotations.forEach(a => {
            const before = result.substring(0, a.pos);
            const after = result.substring(a.pos + a.len);
            if (a.type === 'manip') {
                result = before + `<span class="manip-highlight">${a.word}</span>` + after;
            } else {
                result = before + `<span class="word"><span class="abbr ${a.posType}" title="${getPOSDesc(a.posType)}">${a.posType}</span>${a.word}</span>` + after;
            }
        });

        return result;
    }

    // During correction phase (step > 0), show inline corrections
    const corrCount = Math.min(state.step, corrections.length);
    if (corrCount === 0) {
        return sent.orig;
    }

    function findPosition(text, searchTerm) {
        const escaped = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const re = new RegExp(`(?:^|\\s)(${escaped})(?=\\s|$)`, 'gi');
        const match = re.exec(text);
        if (!match) return -1;
        return match.index + (match[0].length - match[1].length);
    }

    let correctionsList = [];
    for (let i = 0; i < corrCount; i++) {
        const c = corrections[i];
        const isLatest = (i === corrCount - 1);
        if (c.t === 'punctuation' && (c.w === '(missing)' || (c.r.length > c.w.length && c.r.toLowerCase().startsWith(c.w.toLowerCase())))) continue;
        if (c.t !== 'capitalization' && c.w.toLowerCase() === c.r.toLowerCase()) continue;

        const pos = findPosition(sent.orig.toLowerCase(), c.w.toLowerCase());
        if (pos !== -1) {
            correctionsList.push({ pos, len: c.w.length, wrong: sent.orig.substr(pos, c.w.length), right: c.r, isLatest, type: c.t });
        }
    }

    correctionsList.sort((a, b) => a.pos - b.pos);
    let toApply = [];
    let lastEnd = -1;
    for (const corr of correctionsList) {
        if (corr.pos >= lastEnd) {
            toApply.push(corr);
            lastEnd = corr.pos + corr.len;
        }
    }
    toApply.sort((a, b) => b.pos - a.pos);

    let result = sent.orig;
    for (const corr of toApply) {
        const pulseClass = corr.isLatest ? ' inline-pulse' : '';
        const before = result.substring(0, corr.pos);
        const after = result.substring(corr.pos + corr.len);
        let rightClass = 'inline-right';
        if (corr.type === 'capitalization') rightClass = 'inline-cap';
        else if (corr.type === 'punctuation') rightClass = 'inline-punct';
        const replacement = `<span class="inline-corr"><span class="inline-wrong">${corr.wrong}</span><span class="${rightClass}${pulseClass}">${corr.right}</span></span>`;
        result = before + replacement + after;
    }

    for (let i = 0; i < corrCount; i++) {
        const c = corrections[i];
        if (c.t === 'punctuation') {
            const isLatest = (i === corrCount - 1);
            const pulseClass = isLatest ? ' inline-pulse' : '';
            if (c.w === '(missing)') {
                result = result.trim() + `<span class="inline-punct${pulseClass}">${c.r}</span>`;
            } else if (c.r.length > c.w.length && c.r.toLowerCase().startsWith(c.w.toLowerCase())) {
                const punct = c.r.slice(c.w.length);
                const escaped = c.w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const re = new RegExp(`(${escaped})(?![^<]*>)`, 'i');
                result = result.replace(re, `$1<span class="inline-punct${pulseClass}">${punct}</span>`);
            }
        }
    }

    return result;
}

function getBtnText(state, sent) {
    const corrections = getCorrections(sent);
    const orderedPOS = getOrderedPOS(sent);
    const totalCorr = corrections.length;
    const totalPOS = orderedPOS.length;
    const totalManipEx = sent.manip.examples.length;

    if (state.phase === 0) return state.step === 0 ? 'Check Sentence' : `Correction ${state.step}/${totalCorr}`;
    if (state.phase === 2) {
        const posStep = state.step - totalCorr;
        if (posStep < totalPOS) return `Part of Speech ${posStep + 1}/${totalPOS}`;
        return 'Show Manipulation';
    }
    if (state.phase === 3) return 'Show Example 1';
    if (state.phase === 4) {
        if (totalManipEx > 1) return 'Show Example 2';
        return 'Show Vocabulary';
    }
    if (state.phase === 5) {
        const exShown = state.step - totalCorr - totalPOS - 1;
        if (exShown < totalManipEx) return `Show Example ${exShown + 1}`;
        return 'Show Vocabulary';
    }
    if (state.phase === 6) return 'Show Vocabulary';
    return '\u2713 Complete';
}

function restore(idx, sent) {
    const state = states[`${currentDay}-${idx}`];
    if (!state) return;

    const corrections = getCorrections(sent);
    const orderedPOS = getOrderedPOS(sent);
    const totalCorr = corrections.length;
    const totalPOS = orderedPOS.length;
    const totalManipEx = sent.manip.examples.length;

    document.getElementById(`sent-${idx}`).innerHTML = formatSentence(sent, state);

    // Corrections panel
    if (state.step > 0) {
        const count = Math.min(state.step, totalCorr);
        if (count > 0) {
            let h = '<div class="section corr-section">';
            for (let i = count - 1; i >= 0; i--) {
                h += renderCorr(corrections[i], i, totalCorr);
            }
            h += '</div>';
            document.getElementById(`corr-${idx}`).innerHTML = h;
        }
    } else {
        document.getElementById(`corr-${idx}`).innerHTML = '';
    }

    // POS panel
    if (state.phase >= 2) {
        const posCount = Math.min(state.step - totalCorr, totalPOS);
        if (posCount > 0) {
            let h = '<div class="section pos-section"><div class="pos-title">Parts of Speech</div>';
            for (let i = posCount - 1; i >= 0; i--) {
                const p = orderedPOS[i];
                const t = p.t.toUpperCase();
                const cls = getCSSClass(t);
                const badge = getTypeBadge(t);
                h += `<div class="pos-item"><span class="check">\u2713</span><span class="q">${p.q}</span><span class="ans"><span class="word-box ${cls}" title="${getPOSDesc(t)}">${p.w}</span><span class="type-badge ${cls}" title="${getPOSDesc(t)}">${badge}</span></span></div>`;
            }
            h += '</div>';
            document.getElementById(`pos-${idx}`).innerHTML = h;
        }
    } else {
        document.getElementById(`pos-${idx}`).innerHTML = '';
    }

    // Manipulation
    if (state.phase >= 3) {
        const m = sent.manip;
        let examplesHtml = '';
        let exCount = 0;
        if (state.phase >= 4) exCount = 1;
        if (state.phase >= 5) {
            exCount = state.step - totalCorr - totalPOS - 1;
            exCount = Math.min(exCount, totalManipEx);
        }
        if (exCount > 0) {
            for (let i = exCount - 1; i >= 0; i--) {
                examplesHtml += `<div class="manip-example">${m.examples[i]}</div>`;
            }
        }
        document.getElementById(`manip-${idx}`).innerHTML = `
        <div class="section manip-section">
            <div class="manip-title">Sentence Manipulation</div>
            <div class="manip-box">
                <div class="manip-task">\ud83d\udcdd ${m.task}</div>
                ${examplesHtml ? `<div class="manip-examples">${examplesHtml}</div>` : ''}
            </div>
        </div>`;
    } else {
        document.getElementById(`manip-${idx}`).innerHTML = '';
    }

    // Vocabulary with sentence starter input
    if (state.phase >= 6) {
        const v = sent.vocab;
        const savedWriting = getWritingResponse(currentDay, idx);
        document.getElementById(`vocab-${idx}`).innerHTML = `
        <div class="section vocab-section">
            <div class="vocab-header">Vocabulary Word</div>
            <div class="vocab-word-row">
                <span class="vocab-star">\u2b50</span>
                <span class="vocab-word">${v.w}</span>
                <span class="vocab-type">${v.type}</span>
                <button class="tts-btn" onclick="speakWord('${v.w.replace(/'/g, "\\'")}')" title="Hear this word" aria-label="Hear vocabulary word">\ud83d\udd0a</button>
            </div>
            <div class="vocab-row">
                <div class="vocab-label">\ud83d\udcd8 Definition:</div>
                <div class="vocab-text">${v.def}</div>
            </div>
            <div class="vocab-simple">
                <div class="vocab-label">\ud83d\udcac In simple words:</div>
                <div class="vocab-text">${v.simple}</div>
            </div>
            <div class="vocab-row">
                <div class="vocab-label">\ud83d\udccc Examples:</div>
                <div class="vocab-chips examples">${v.examples.map(s=>`<span>${s}</span>`).join('')}</div>
            </div>
            <div class="vocab-row">
                <div class="vocab-label">\u2705 Similar words (synonyms):</div>
                <div class="vocab-chips similar">${v.similar.map(s=>`<span>${s}</span>`).join('')}</div>
            </div>
            <div class="vocab-row">
                <div class="vocab-label">\u274c Opposite words (antonyms):</div>
                <div class="vocab-chips antonym">${v.antonyms.map(s=>`<span>${s}</span>`).join('')}</div>
            </div>
            <div class="vocab-row">
                <div class="vocab-label">\ud83d\udeab Non-examples:</div>
                <div class="vocab-chips nonex">${v.nonex.map(s=>`<span>${s}</span>`).join('')}</div>
            </div>
            <div class="vocab-row">
                <div class="vocab-label">\ud83d\udcdd Example sentence:</div>
                <div class="vocab-example">"${v.example}"</div>
            </div>
            <div class="vocab-starter">
                <div class="vocab-starter-label">ELL Sentence Starter - Try it!</div>
                <div class="vocab-starter-text">${v.starter}</div>
                <textarea class="vocab-starter-input" placeholder="Type your sentence here..." oninput="saveWritingResponse(${currentDay}, ${idx}, this.value)">${savedWriting}</textarea>
                <div class="vocab-starter-count">${savedWriting.length} characters</div>
            </div>
            <div class="vocab-why">
                <span class="vocab-why-icon">\ud83d\udca1</span>
                <div>
                    <div class="vocab-why-label">Why learn this word?</div>
                    <div class="vocab-why-text">${v.why}</div>
                </div>
            </div>
        </div>`;
    } else {
        document.getElementById(`vocab-${idx}`).innerHTML = '';
    }

    // Sentence diagram (grades 3-5, after corrections)
    if (state.phase >= 2) {
        document.getElementById(`diagram-${idx}`).innerHTML = buildDiagram(sent);
    } else {
        document.getElementById(`diagram-${idx}`).innerHTML = '';
    }

    // Interactive mode hint
    const interactiveEl = document.getElementById(`interactive-${idx}`);
    if (interactiveEl) {
        if (interactiveMode && state.phase < 7) {
            interactiveEl.innerHTML = buildInteractiveHint(sent, state, idx);
        } else {
            interactiveEl.innerHTML = '';
        }
    }

    const btn = document.getElementById(`btn-${idx}`);
    btn.textContent = getBtnText(state, sent);
    btn.classList.toggle('complete', state.phase >= 7);
    btn.disabled = state.phase >= 7;
}

// ========== INTERACTIVE MODE ==========
function buildInteractiveHint(sent, state, idx) {
    const corrections = getCorrections(sent);
    const orderedPOS = getOrderedPOS(sent);
    const totalCorr = corrections.length;

    // During correction phase - show error type hint
    if (state.phase === 0 && state.step < totalCorr) {
        const nextCorr = corrections[state.step];
        const typeEmoji = {
            'capitalization': '\ud83d\udd20',
            'spelling': '\ud83d\udcdd',
            'punctuation': '\u2753',
            'grammar': '\ud83d\udcd6'
        };
        const typeNames = {
            'capitalization': 'capital letter',
            'spelling': 'spelling',
            'punctuation': 'punctuation',
            'grammar': 'grammar'
        };
        const emoji = typeEmoji[nextCorr.t] || '\ud83d\udd0d';
        const typeName = typeNames[nextCorr.t] || nextCorr.t;

        const idxArg = typeof idx === 'string' ? `'${idx}'` : idx;
        return `<div class="interactive-hint">
            <span class="hint-icon">${emoji}</span>
            <div>
                <div class="hint-text">Hint: Look for a ${typeName} mistake!</div>
                <div class="interactive-input-row">
                    <input class="interactive-input" id="guess-${idx}" placeholder="Type the correct word..." onkeydown="if(event.key==='Enter')checkGuess(${idxArg})">
                    <button class="interactive-submit" onclick="checkGuess(${idxArg})">Check</button>
                </div>
                <div id="feedback-${idx}"></div>
            </div>
        </div>`;
    }

    // During POS phase - show clickable words
    if (state.phase === 2) {
        const posStep = state.step - totalCorr;
        if (posStep < orderedPOS.length) {
            const nextPOS = orderedPOS[posStep];
            const words = sent.fixed.split(/\s+/);
            const idxArg2 = typeof idx === 'string' ? `'${idx}'` : idx;
            const wordBtns = words.map((w, i) =>
                `<span class="pos-clickable" onclick="checkPOSClick(${idxArg2}, '${w.replace(/'/g, "\\'")}', ${i})">${w}</span>`
            ).join(' ');

            return `<div class="interactive-hint">
                <span class="hint-icon">\ud83c\udfaf</span>
                <div>
                    <div class="hint-text">${nextPOS.q} \u2014 tap the right word!</div>
                    <div style="font-family:'Crimson Pro',Georgia,serif;font-size:calc(var(--size) * 0.8);line-height:2.2;margin-top:8px">${wordBtns}</div>
                    <div id="feedback-${idx}"></div>
                </div>
            </div>`;
        }
    }

    return '';
}

let _interactivePending = false;
function checkGuess(idx) {
    if (_interactivePending) return;
    const isPopout = idx === 'popout';
    const realIdx = isPopout ? popoutIdx : idx;

    const input = document.getElementById(`guess-${idx}`);
    const feedback = document.getElementById(`feedback-${idx}`);
    if (!input || !feedback) return;

    const guess = input.value.trim();
    if (!guess) return;

    const lesson = DATA.find(d => d.day === currentDay);
    const sent = lesson.sentences[realIdx];
    const state = states[`${currentDay}-${realIdx}`];
    const corrections = getCorrections(sent);
    const nextCorr = corrections[state.step];

    const isCorrect = guess.toLowerCase() === nextCorr.r.toLowerCase();

    if (isCorrect) {
        feedback.innerHTML = `<div class="interactive-feedback correct">\u2705 Correct! "${nextCorr.r}"</div>`;
    } else {
        feedback.innerHTML = `<div class="interactive-feedback incorrect">\u274c Not quite. The answer is: "${nextCorr.r}"</div>`;
    }

    _interactivePending = true;
    setTimeout(() => {
        _interactivePending = false;
        if (isPopout) advancePopout(); else advance(realIdx);
    }, 1200);
}

function checkPOSClick(idx, clickedWord, wordIdx) {
    if (_interactivePending) return;
    const isPopout = idx === 'popout';
    const realIdx = isPopout ? popoutIdx : idx;

    const lesson = DATA.find(d => d.day === currentDay);
    const sent = lesson.sentences[realIdx];
    const state = states[`${currentDay}-${realIdx}`];
    const corrections = getCorrections(sent);
    const orderedPOS = getOrderedPOS(sent);
    const totalCorr = corrections.length;
    const posStep = state.step - totalCorr;
    const nextPOS = orderedPOS[posStep];

    const feedback = document.getElementById(`feedback-${idx}`);
    const cleanClicked = clickedWord.replace(/[.,!?;:]/g, '').toLowerCase();
    const isCorrect = cleanClicked === nextPOS.w.toLowerCase();

    const containerId = isPopout ? 'popout-interactive' : `interactive-${idx}`;
    const clickables = document.querySelectorAll(`#${containerId} .pos-clickable`);
    clickables.forEach((el, i) => {
        if (i === wordIdx) {
            el.classList.add(isCorrect ? 'correct-pick' : 'wrong-pick');
        }
    });

    if (isCorrect) {
        if (feedback) feedback.innerHTML = `<div class="interactive-feedback correct">\u2705 Yes! "${nextPOS.w}" is a ${getTypeLabel(nextPOS.t.toUpperCase())}!</div>`;
    } else {
        if (feedback) feedback.innerHTML = `<div class="interactive-feedback incorrect">\u274c The ${getTypeLabel(nextPOS.t.toUpperCase())} is "${nextPOS.w}"</div>`;
    }

    _interactivePending = true;
    setTimeout(() => {
        _interactivePending = false;
        if (isPopout) advancePopout(); else advance(realIdx);
    }, 1200);
}

function renderCorr(c, i, total) {
    const content = c.w === '(missing)' ? `<span class="wrong">{missing}</span> <span class="arrow">\u2192</span> <span class="right">${c.r}</span>` : `<span class="wrong">${c.w}</span> <span class="arrow">\u2192</span> <span class="right">${c.r}</span>`;
    return `<div class="corr-item ${c.t}"><div class="corr-head"><span class="corr-type ${c.t}">${c.t}</span><span class="corr-num">Correction ${i+1} of ${total}</span></div><div class="corr-change">${content}</div><div class="corr-explain">${c.e}</div></div>`;
}

function advance(idx) {
    const lesson = DATA.find(d => d.day === currentDay);
    const sent = lesson.sentences[idx];
    const key = `${currentDay}-${idx}`;
    const state = states[key];

    const corrections = getCorrections(sent);
    const orderedPOS = getOrderedPOS(sent);
    const totalCorr = corrections.length;
    const totalPOS = orderedPOS.length;
    const totalManipEx = sent.manip.examples.length;

    state.step++;

    if (state.step <= totalCorr) {
        state.phase = 0;
    } else if (state.step <= totalCorr + totalPOS) {
        state.phase = 2;
    } else if (state.step === totalCorr + totalPOS + 1) {
        state.phase = 3;
    } else if (state.step === totalCorr + totalPOS + 2) {
        state.phase = 4;
    } else if (state.step <= totalCorr + totalPOS + 1 + totalManipEx) {
        state.phase = 5;
    } else if (state.step === totalCorr + totalPOS + 2 + totalManipEx) {
        state.phase = 6;
    } else {
        state.phase = 7;
        unflagForReview(currentDay, idx);
        checkAllComplete();
    }

    saveState();
    restore(idx, sent);
}

function checkAllComplete() {
    const lesson = DATA.find(d => d.day === currentDay);
    if (!lesson) return;
    let allDone = true;
    lesson.sentences.forEach((s, i) => {
        const st = states[`${currentDay}-${i}`];
        if (!st || st.phase < 7) allDone = false;
    });
    if (allDone) {
        markDayCompleted(currentDay);
        updateStreak();
    }
}

function resetSentence(idx) {
    const lesson = DATA.find(d => d.day === currentDay);
    const sent = lesson.sentences[idx];
    states[`${currentDay}-${idx}`] = { phase: 0, step: 0 };

    // Flag for review when reset
    flagForReview(currentDay, idx);

    document.getElementById(`sent-${idx}`).innerHTML = sent.orig;
    document.getElementById(`corr-${idx}`).innerHTML = '';
    document.getElementById(`pos-${idx}`).innerHTML = '';
    document.getElementById(`manip-${idx}`).innerHTML = '';
    document.getElementById(`vocab-${idx}`).innerHTML = '';
    document.getElementById(`diagram-${idx}`).innerHTML = '';
    const interactiveEl = document.getElementById(`interactive-${idx}`);
    if (interactiveEl) interactiveEl.innerHTML = '';

    const btn = document.getElementById(`btn-${idx}`);
    btn.textContent = 'Check Sentence';
    btn.classList.remove('complete');
    btn.disabled = false;

    saveState();
    updateDashboard();
}

// Keep old name for backward compat
function reset(idx) { resetSentence(idx); }

function openPopout(idx) {
    popoutIdx = idx;
    const lesson = DATA.find(d => d.day === currentDay);
    const sent = lesson.sentences[idx];
    const key = `${currentDay}-${idx}`;
    if (!states[key]) states[key] = { phase: 0, step: 0 };

    const corrections = getCorrections(sent);
    const orderedPOS = getOrderedPOS(sent);
    const tags = buildPOSTags(orderedPOS);

    const state = states[key];

    const overlay = document.createElement('div');
    overlay.id = 'popout-overlay';
    overlay.onclick = function(e) { if (e.target === overlay) closePopout(); };
    const popoutUfliPanel = (currentGrade === 'ufli' && sent.ufliLesson) ? buildUfliPanel(sent) : '';

    overlay.innerHTML = `
        <div class="popout-container">
            <div class="popout-header">
                <div class="popout-header-left">
                    <span class="popout-day-badge">Day ${currentDay}</span>
                    <span class="popout-sentence-label">Sentence ${idx + 1} \u2014 Individual Lesson</span>
                </div>
                <button class="tts-btn" onclick="speakSentence(${idx})" title="Read aloud" aria-label="Read sentence aloud">\ud83d\udd0a</button>
                <button class="popout-header-print" onclick="printWorksheet(${idx})" title="Print worksheet" aria-label="Print worksheet">&#x1F5A8;</button>
                <button class="popout-header-print" onclick="printWorksheet(${idx}, true)" title="Print answer key" aria-label="Print answer key" style="color:#e53935">&#x1F511;</button>
                <button class="popout-close" onclick="closePopout()" aria-label="Close popout">\u2715</button>
            </div>
            <div class="popout-task-bar">
                Find <span class="tag err">${corrections.length} errors</span> and ${tags}
            </div>
            ${popoutUfliPanel}
            <div class="popout-sentence" id="popout-sent"></div>
            <div class="popout-btn-row">
                <button class="check-btn popout-advance-btn ${state.phase>=7?'complete':''}" id="popout-advance-btn" onclick="advancePopout()">${getBtnText(state, sent)}</button>
                <button class="reset-btn" onclick="resetPopout()">Reset</button>
            </div>
            <div id="popout-interactive"></div>
            <div id="popout-vocab"></div>
            <div id="popout-manip"></div>
            <div id="popout-pos"></div>
            <div id="popout-diagram"></div>
            <div id="popout-corr"></div>
        </div>
    `;
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
    restorePopout();
}

function closePopout() {
    const overlay = document.getElementById('popout-overlay');
    if (overlay) overlay.remove();
    popoutIdx = null;
    document.body.style.overflow = '';
    renderDay();
}

function advancePopout() {
    const lesson = DATA.find(d => d.day === currentDay);
    const sent = lesson.sentences[popoutIdx];
    const key = `${currentDay}-${popoutIdx}`;
    const state = states[key];

    const corrections = getCorrections(sent);
    const orderedPOS = getOrderedPOS(sent);
    const totalCorr = corrections.length;
    const totalPOS = orderedPOS.length;
    const totalManipEx = sent.manip.examples.length;

    state.step++;

    if (state.step <= totalCorr) {
        state.phase = 0;
    } else if (state.step <= totalCorr + totalPOS) {
        state.phase = 2;
    } else if (state.step === totalCorr + totalPOS + 1) {
        state.phase = 3;
    } else if (state.step === totalCorr + totalPOS + 2) {
        state.phase = 4;
    } else if (state.step <= totalCorr + totalPOS + 1 + totalManipEx) {
        state.phase = 5;
    } else if (state.step === totalCorr + totalPOS + 2 + totalManipEx) {
        state.phase = 6;
    } else {
        state.phase = 7;
        unflagForReview(currentDay, popoutIdx);
        checkAllComplete();
    }

    saveState();
    restorePopout();
}

function resetPopout() {
    const lesson = DATA.find(d => d.day === currentDay);
    const sent = lesson.sentences[popoutIdx];
    states[`${currentDay}-${popoutIdx}`] = { phase: 0, step: 0 };
    flagForReview(currentDay, popoutIdx);

    document.getElementById('popout-sent').innerHTML = sent.orig;
    document.getElementById('popout-corr').innerHTML = '';
    document.getElementById('popout-pos').innerHTML = '';
    document.getElementById('popout-manip').innerHTML = '';
    document.getElementById('popout-vocab').innerHTML = '';
    const diag = document.getElementById('popout-diagram');
    if (diag) diag.innerHTML = '';
    const inter = document.getElementById('popout-interactive');
    if (inter) inter.innerHTML = '';

    const btn = document.getElementById('popout-advance-btn');
    btn.textContent = 'Check Sentence';
    btn.classList.remove('complete');
    btn.disabled = false;

    saveState();
    updateDashboard();
}

function restorePopout() {
    if (popoutIdx === null) return;
    const lesson = DATA.find(d => d.day === currentDay);
    const sent = lesson.sentences[popoutIdx];
    const state = states[`${currentDay}-${popoutIdx}`];
    if (!state) return;

    const corrections = getCorrections(sent);
    const orderedPOS = getOrderedPOS(sent);
    const totalCorr = corrections.length;
    const totalPOS = orderedPOS.length;
    const totalManipEx = sent.manip.examples.length;

    document.getElementById('popout-sent').innerHTML = formatSentence(sent, state);

    // Corrections
    if (state.step > 0) {
        const count = Math.min(state.step, totalCorr);
        if (count > 0) {
            let h = '<div class="section corr-section">';
            for (let i = count - 1; i >= 0; i--) {
                h += renderCorr(corrections[i], i, totalCorr);
            }
            h += '</div>';
            document.getElementById('popout-corr').innerHTML = h;
        }
    } else {
        document.getElementById('popout-corr').innerHTML = '';
    }

    // POS
    if (state.phase >= 2) {
        const posCount = Math.min(state.step - totalCorr, totalPOS);
        if (posCount > 0) {
            let h = '<div class="section pos-section"><div class="pos-title">Parts of Speech</div>';
            for (let i = posCount - 1; i >= 0; i--) {
                const p = orderedPOS[i];
                const t = p.t.toUpperCase();
                const cls = getCSSClass(t);
                const badge = getTypeBadge(t);
                h += `<div class="pos-item"><span class="check">\u2713</span><span class="q">${p.q}</span><span class="ans"><span class="word-box ${cls}" title="${getPOSDesc(t)}">${p.w}</span><span class="type-badge ${cls}" title="${getPOSDesc(t)}">${badge}</span></span></div>`;
            }
            h += '</div>';
            document.getElementById('popout-pos').innerHTML = h;
        }
    } else {
        document.getElementById('popout-pos').innerHTML = '';
    }

    // Manipulation
    if (state.phase >= 3) {
        const m = sent.manip;
        let examplesHtml = '';
        let exCount = 0;
        if (state.phase >= 4) exCount = 1;
        if (state.phase >= 5) {
            exCount = state.step - totalCorr - totalPOS - 1;
            exCount = Math.min(exCount, totalManipEx);
        }
        if (exCount > 0) {
            for (let i = exCount - 1; i >= 0; i--) {
                examplesHtml += `<div class="manip-example">${m.examples[i]}</div>`;
            }
        }
        document.getElementById('popout-manip').innerHTML = `
        <div class="section manip-section">
            <div class="manip-title">Sentence Manipulation</div>
            <div class="manip-box">
                <div class="manip-task">\ud83d\udcdd ${m.task}</div>
                ${examplesHtml ? `<div class="manip-examples">${examplesHtml}</div>` : ''}
            </div>
        </div>`;
    } else {
        document.getElementById('popout-manip').innerHTML = '';
    }

    // Vocabulary with writing prompt
    if (state.phase >= 6) {
        const v = sent.vocab;
        const savedWriting = getWritingResponse(currentDay, popoutIdx);
        document.getElementById('popout-vocab').innerHTML = `
        <div class="section vocab-section">
            <div class="vocab-header">Vocabulary Word</div>
            <div class="vocab-word-row">
                <span class="vocab-star">\u2b50</span>
                <span class="vocab-word">${v.w}</span>
                <span class="vocab-type">${v.type}</span>
                <button class="tts-btn" onclick="speakWord('${v.w.replace(/'/g, "\\'")}')" title="Hear this word" aria-label="Hear vocabulary word">\ud83d\udd0a</button>
            </div>
            <div class="vocab-row">
                <div class="vocab-label">\ud83d\udcd8 Definition:</div>
                <div class="vocab-text">${v.def}</div>
            </div>
            <div class="vocab-simple">
                <div class="vocab-label">\ud83d\udcac In simple words:</div>
                <div class="vocab-text">${v.simple}</div>
            </div>
            <div class="vocab-row">
                <div class="vocab-label">\ud83d\udccc Examples:</div>
                <div class="vocab-chips examples">${v.examples.map(s=>`<span>${s}</span>`).join('')}</div>
            </div>
            <div class="vocab-row">
                <div class="vocab-label">\u2705 Similar words (synonyms):</div>
                <div class="vocab-chips similar">${v.similar.map(s=>`<span>${s}</span>`).join('')}</div>
            </div>
            <div class="vocab-row">
                <div class="vocab-label">\u274c Opposite words (antonyms):</div>
                <div class="vocab-chips antonym">${v.antonyms.map(s=>`<span>${s}</span>`).join('')}</div>
            </div>
            <div class="vocab-row">
                <div class="vocab-label">\ud83d\udeab Non-examples:</div>
                <div class="vocab-chips nonex">${v.nonex.map(s=>`<span>${s}</span>`).join('')}</div>
            </div>
            <div class="vocab-row">
                <div class="vocab-label">\ud83d\udcdd Example sentence:</div>
                <div class="vocab-example">"${v.example}"</div>
            </div>
            <div class="vocab-starter">
                <div class="vocab-starter-label">ELL Sentence Starter - Try it!</div>
                <div class="vocab-starter-text">${v.starter}</div>
                <textarea class="vocab-starter-input" placeholder="Type your sentence here..." oninput="saveWritingResponse(${currentDay}, ${popoutIdx}, this.value)">${savedWriting}</textarea>
                <div class="vocab-starter-count">${savedWriting.length} characters</div>
            </div>
            <div class="vocab-why">
                <span class="vocab-why-icon">\ud83d\udca1</span>
                <div>
                    <div class="vocab-why-label">Why learn this word?</div>
                    <div class="vocab-why-text">${v.why}</div>
                </div>
            </div>
        </div>`;
    } else {
        document.getElementById('popout-vocab').innerHTML = '';
    }

    // Diagram
    const diagEl = document.getElementById('popout-diagram');
    if (diagEl) {
        diagEl.innerHTML = state.phase >= 2 ? buildDiagram(sent) : '';
    }

    // Interactive hint
    const interEl = document.getElementById('popout-interactive');
    if (interEl) {
        if (interactiveMode && state.phase < 7) {
            interEl.innerHTML = buildInteractiveHint(sent, state, 'popout');
        } else {
            interEl.innerHTML = '';
        }
    }

    const btn = document.getElementById('popout-advance-btn');
    btn.textContent = getBtnText(state, sent);
    btn.classList.toggle('complete', state.phase >= 7);
    btn.disabled = state.phase >= 7;
}

// ========== PRINT WORKSHEET (with optional answer key) ==========
function printWorksheet(idx, showAnswers) {
    const lesson = DATA.find(d => d.day === currentDay);
    const sent = lesson.sentences[idx];
    const orderedPOS = getOrderedPOS(sent);
    const corrections = getCorrections(sent);

    const posCounts = {};
    orderedPOS.forEach(p => {
        const t = p.t.toUpperCase();
        posCounts[t] = (posCounts[t] || 0) + 1;
    });

    const posLabels = {
        'N':'Nouns','V':'Verbs','ADJ':'Adjectives','ADV':'Adverbs',
        'PREP':'Prepositions','PRO':'Pronouns','CONJ':'Conjunctions',
        'ART':'Articles','SUBCONJ':'Sub. Conjunctions',
        'OBJPRO':'Object Pronouns','POSS':'Possessives','PP':'Past Participles',
        'RELPRO':'Relative Pronouns','PASS':'Passive Verbs','MODAL':'Modal Verbs',
        'DEM':'Demonstratives'
    };
    const posOrder = ['N','V','MODAL','PASS','PP','ADJ','ADV','PRO','RELPRO','OBJPRO','PREP','SUBCONJ','CONJ','POSS','ART','DEM'];

    // Build POS rows - with answers if teacher mode
    let posRows = '';
    const posGrouped = {};
    orderedPOS.forEach(p => {
        const t = p.t.toUpperCase();
        if (!posGrouped[t]) posGrouped[t] = [];
        posGrouped[t].push(p.w);
    });

    posOrder.forEach(type => {
        if (posCounts[type]) {
            const answerText = showAnswers ? `<span style="color:#2e7d32;font-weight:700">${posGrouped[type].join(', ')}</span>` : '';
            posRows += '<div class="pr"><span class="pl">' + posLabels[type] + ' (' + posCounts[type] + '):</span><span class="pn">' + answerText + '</span></div>';
        }
    });

    const day = currentDay;
    const num = idx + 1;
    const task = sent.manip.task;

    // Answer key header
    const answerKeyBanner = showAnswers ? '<div style="background:#e53935;color:#fff;padding:8pt 14pt;border-radius:6pt;text-align:center;font-size:12pt;font-weight:700;margin-bottom:16pt">ANSWER KEY \u2014 Teacher Copy</div>' : '';

    // Correction answers
    let corrAnswers = '';
    if (showAnswers) {
        corrAnswers = '<div style="margin-top:10pt">';
        corrections.forEach((c, i) => {
            corrAnswers += `<div style="font-size:9.5pt;color:#2e7d32;margin-bottom:3pt"><strong>${i+1}.</strong> ${c.w} \u2192 ${c.r} <em style="color:#666">(${c.t})</em></div>`;
        });
        corrAnswers += `<div style="font-size:9.5pt;color:#2e7d32;margin-top:6pt;font-style:italic"><strong>Corrected:</strong> ${sent.fixed}</div></div>`;
    }

    // Manipulation answer
    const manipAnswer = showAnswers ? `<div style="margin-top:8pt;color:#2e7d32;font-size:9.5pt"><strong>Example:</strong> ${sent.manip.examples[0].replace(/<[^>]+>/g, '')}</div>` : '';

    // Vocabulary answers
    const vocabAnswers = showAnswers ? `
        <div style="margin-top:8pt">
            <div class="vr"><span class="vl">Word:</span><span class="vt" style="color:#2e7d32;font-weight:700;border:none">${sent.vocab.w}</span></div>
            <div class="vr"><span class="vl">Definition:</span><span class="vn" style="color:#2e7d32;font-size:9pt;border:none">${sent.vocab.def}</span></div>
            <div class="vr"><span class="vl">Synonyms:</span><span class="vn" style="color:#2e7d32;font-size:9pt;border:none">${sent.vocab.similar.join(', ')}</span></div>
            <div class="vr"><span class="vl">Antonyms:</span><span class="vn" style="color:#2e7d32;font-size:9pt;border:none">${sent.vocab.antonyms.join(', ')}</span></div>
        </div>` : '';

    // UFLI section
    let ufliPrintSection = '';
    if (currentGrade === 'ufli' && sent.ufliLesson) {
        const phonicsWordsPrint = (sent.phonicsWords || []).map(w => '<span class="pw">' + w + '</span>').join('');
        const heartWordsPrint = (sent.heartWords || []).map(w => '<span class="hw">' + w + '</span>').join('');
        ufliPrintSection = '<div class="ub"><div class="ul">Lesson ' + sent.ufliLesson + ': ' + sent.ufliSkill + '</div>' +
            '<div class="us">' + sent.ufliSection + ' &bull; ' + (sent.sentenceType === 'intro' ? 'Introduction' : 'Application') + '</div>' +
            '<div class="uw"><span class="uwl">Phonics Words:</span>' + phonicsWordsPrint + '</div>' +
            '<div class="uw"><span class="uwl">Heart Words:</span>' + heartWordsPrint + '</div></div>';
    }

    const html = '<!DOCTYPE html><html><head><title>DOL Day ' + day + ' - Sentence ' + num + (showAnswers ? ' (ANSWER KEY)' : '') + '</title>' +
'<style>' +
'@page{size:letter;margin:0.6in 0.75in}' +
'*{margin:0;padding:0;box-sizing:border-box}' +
'body{font-family:"Segoe UI",-apple-system,Arial,sans-serif;color:#2d3436;font-size:10.5pt;line-height:1.35}' +
'.pg{page-break-after:always}.pg:last-child{page-break-after:auto}' +
'.hd{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:2.5pt solid #2d3436;padding-bottom:8pt;margin-bottom:22pt}' +
'.hd h1{font-size:14pt;margin-bottom:1pt}.hd .sb{font-size:9.5pt;color:#636e72}' +
'.hdr{display:flex;gap:18pt;align-items:flex-end}' +
'.fl{font-size:9pt;color:#636e72;font-weight:600}' +
'.fn{display:inline-block;border-bottom:1.5pt solid #2d3436;width:1.7in;vertical-align:bottom;margin-left:3pt}' +
'.fd{width:1.1in}' +
'.sc{margin-bottom:22pt}' +
'.sh{display:flex;align-items:center;gap:8pt;margin-bottom:12pt}' +
'.nm{display:inline-flex;align-items:center;justify-content:center;width:24pt;height:24pt;background:#2d3436;color:#fff;border-radius:50%;font-size:10.5pt;font-weight:700;flex-shrink:0}' +
'.st{font-size:11pt;font-weight:700;text-transform:uppercase;letter-spacing:0.4pt}' +
'.lb{font-size:9.5pt;font-weight:600;color:#636e72;margin-bottom:8pt;text-transform:uppercase}' +
'.cb{border:2.5pt solid #e17055;border-radius:8pt;padding:10pt 14pt;margin-bottom:18pt}' +
'.cl{border-bottom:1.5pt solid #e17055;height:0.45in}' +
'.wl{border-bottom:1.5pt solid #b2bec3;height:0.45in}' +
'.dv{border:none;border-top:1pt solid #dfe6e9;margin:18pt 0}' +
'.pg2{display:flex;flex-direction:column;gap:4pt}' +
'.pr{display:flex;align-items:flex-end;gap:6pt}' +
'.pl{font-size:10pt;font-weight:600;min-width:1.8in;flex-shrink:0;padding-bottom:3pt}' +
'.pn{flex:1;border-bottom:1.5pt solid #b2bec3;height:0.34in;display:flex;align-items:flex-end;padding-bottom:3pt}' +
'.tb{border-left:3pt solid #e17055;padding:10pt 14pt;margin-bottom:16pt;font-size:10.5pt;background:#fafafa;border-radius:0 6pt 6pt 0}' +
'.vr{display:flex;align-items:flex-end;gap:6pt;margin-bottom:5pt}' +
'.vl{font-size:10pt;font-weight:700;min-width:1.35in;flex-shrink:0;text-transform:uppercase;padding-bottom:3pt}' +
'.vn{flex:1;border-bottom:1.5pt solid #b2bec3;height:0.32in;display:flex;align-items:flex-end;padding-bottom:3pt}' +
'.vt{flex:1;border-bottom:2.5pt solid #2d3436;height:0.32in;display:flex;align-items:flex-end;padding-bottom:3pt}' +
'.wp{font-size:9.5pt;font-weight:600;color:#636e72;margin-top:16pt;margin-bottom:8pt}' +
'.p2{font-size:8.5pt;color:#b2bec3;text-align:right;margin-bottom:16pt;padding-bottom:4pt;border-bottom:0.5pt solid #dfe6e9}' +
'.ub{background:#f0faf8;border:1.5pt solid #00897b;border-radius:8pt;padding:10pt 14pt;margin-bottom:18pt}' +
'.ul{font-size:11pt;font-weight:700;color:#00897b}' +
'.us{font-size:9pt;color:#636e72;margin-bottom:6pt}' +
'.uw{display:flex;align-items:center;flex-wrap:wrap;gap:4pt;margin-top:4pt}' +
'.uwl{font-size:9pt;font-weight:700;color:#2d3436;margin-right:4pt}' +
'.pw{font-size:9pt;background:#e3f2fd;color:#1565c0;padding:2pt 8pt;border-radius:10pt;font-weight:600}' +
'.hw{font-size:9pt;background:#fce4ec;color:#c2185b;padding:2pt 8pt;border-radius:10pt;font-weight:600}' +
'</style></head><body onload="setTimeout(function(){window.print()},300)">' +

'<div class="pg">' +
answerKeyBanner +
'<div class="hd"><div><h1>Daily Oral Language</h1><div class="sb">Day ' + day + ' \u2022 Sentence ' + num + '</div></div>' +
'<div class="hdr"><div><span class="fl">Name:</span><span class="fn"></span></div><div><span class="fl">Date:</span><span class="fn fd"></span></div></div></div>' +

ufliPrintSection +

'<div class="sc"><div class="sh"><span class="nm">1</span><span class="st">Sentence Correction</span></div>' +
'<div class="lb">Copy the sentence from the board:</div>' +
'<div class="cb"><div class="cl"></div><div class="cl"></div></div>' +
'<div class="lb">Write the corrected sentence:</div>' +
'<div class="wl"></div><div class="wl"></div><div class="wl"></div>' +
corrAnswers + '</div>' +

'<hr class="dv">' +

'<div class="sc"><div class="sh"><span class="nm">2</span><span class="st">Parts of Speech</span></div>' +
'<div class="lb" style="margin-bottom:12pt">In your corrected sentence, find and write:</div>' +
'<div class="pg2">' + posRows + '</div></div>' +
'</div>' +

'<div class="pg">' +
(showAnswers ? answerKeyBanner : '') +
'<div class="p2">Day ' + day + ' \u2022 Sentence ' + num + ' \u2014 continued</div>' +

'<div class="sc"><div class="sh"><span class="nm">3</span><span class="st">Sentence Manipulation</span></div>' +
'<div class="tb"><strong>Task:</strong> ' + task + '</div>' +
'<div class="lb">Rewrite the sentence with your change:</div>' +
'<div class="wl"></div><div class="wl"></div><div class="wl"></div>' +
manipAnswer + '</div>' +

'<hr class="dv">' +

'<div class="sc"><div class="sh"><span class="nm">4</span><span class="st">Vocabulary Word</span></div>' +
(showAnswers ? vocabAnswers :
'<div class="vr"><span class="vl">Word:</span><span class="vt"></span></div>' +
'<div class="vr"><span class="vl">Definition:</span><span class="vn"></span></div>' +
'<div class="wl"></div>' +
'<div class="vr"><span class="vl">Synonyms:</span><span class="vn"></span></div>' +
'<div class="vr"><span class="vl">Antonyms:</span><span class="vn"></span></div>') +
'<div class="wp">Write your own sentence using this word:</div>' +
'<div class="wl"></div><div class="wl"></div><div class="wl"></div></div>' +
'</div>' +

'</body></html>';

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank');
    if (!win) { alert('Please allow popups to print worksheets.'); URL.revokeObjectURL(url); return; }
    setTimeout(() => URL.revokeObjectURL(url), 60000);
}

// ========== NAVIGATION ==========
function getMaxDay() { return DATA.length > 0 ? DATA[DATA.length - 1].day : 1; }
function prevDay() {
    const idx = DATA.findIndex(d => d.day === currentDay);
    if (idx > 0) { currentDay = DATA[idx - 1].day; saveState(); renderDay(); }
}
function nextDay() {
    const idx = DATA.findIndex(d => d.day === currentDay);
    if (idx < DATA.length - 1) { currentDay = DATA[idx + 1].day; saveState(); renderDay(); }
}
function goToDay() {
    const v = parseInt(document.getElementById('dayInput').value);
    const match = DATA.find(d => d.day === v);
    if (match) { currentDay = v; saveState(); renderDay(); }
}

function setSize(v) {
    document.documentElement.style.setProperty('--size', v + 'px');
    document.getElementById('sizeVal').textContent = v + 'px';
    saveState();
}

function showHelp() { document.getElementById('helpOverlay').classList.add('show'); }
function hideHelp() { document.getElementById('helpOverlay').classList.remove('show'); }

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        if (popoutIdx !== null) { closePopout(); return; }
        hideHelp();
        return;
    }
    if (popoutIdx !== null) return;
    if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) return;
    if (e.key === 'ArrowLeft') prevDay();
    if (e.key === 'ArrowRight') nextDay();
});
