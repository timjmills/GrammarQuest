let DATA = [];
let currentDay = 1;
let currentGrade = 'mixed';

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

document.addEventListener('DOMContentLoaded', () => {
    loadGradeData(currentGrade);
});

function loadGradeData(grade) {
    fetch(GRADE_FILES[grade])
        .then(r => r.json())
        .then(data => {
            DATA = data;
            states = {};
            currentDay = 1;
            renderDay();
        });
}

function switchGrade(grade) {
    if (grade === currentGrade) return;
    currentGrade = grade;

    // Update tab styling
    document.querySelectorAll('.grade-tab').forEach(t => t.classList.remove('active'));
    document.getElementById('tab-' + grade).classList.add('active');

    // Update segment badge
    document.getElementById('segmentBadge').textContent = GRADE_LABELS[grade];

    // Update help periods visibility
    document.getElementById('help-mixed-periods').style.display = grade === 'mixed' ? '' : 'none';
    document.getElementById('help-prek-periods').style.display = grade === 'prek' ? '' : 'none';
    document.getElementById('help-ufli-periods').style.display = grade === 'ufli' ? '' : 'none';
    document.getElementById('help-gradek-periods').style.display = grade === 'gradek' ? '' : 'none';
    document.getElementById('help-grade1-periods').style.display = grade === 'grade1' ? '' : 'none';
    document.getElementById('help-grade2-periods').style.display = grade === 'grade2' ? '' : 'none';
    document.getElementById('help-grade3-periods').style.display = grade === 'grade3' ? '' : 'none';
    document.getElementById('help-grade4-periods').style.display = grade === 'grade4' ? '' : 'none';
    document.getElementById('help-grade5-periods').style.display = grade === 'grade5' ? '' : 'none';

    // Load new data
    loadGradeData(grade);
}

// ========== APP STATE & FUNCTIONS ==========
let states = {};
let popoutIdx = null;

// RULE 1: EXACTLY 5 errors per sentence (hardcoded limit)
const MAX_ERRORS = 5;
const EXACT_ERRORS = 5; // Sentences should have exactly this many errors
function getCorrections(sent) {
    // Enforce exactly 5 errors - take first 5 if more exist
    return sent.corr.slice(0, MAX_ERRORS);
}

// RULE 2: Sort POS by TYPE PRIORITY first, then left-to-right within each type
// Priority Order: 1) Nouns 2) Verbs 3) Adjectives 4) Adverbs 5) Prepositions 6) Others
function getOrderedPOS(sent) {
    const fixed = sent.fixed.toLowerCase();

    // HARDCODED POS TYPE PRIORITY ORDER
    const TYPE_PRIORITY = ['N', 'V', 'ADJ', 'ADV', 'PREP', 'PRO', 'OBJPRO', 'CONJ', 'SUBCONJ', 'ART', 'DEM', 'POSS', 'PP', 'RELPRO', 'PASS', 'MODAL'];

    // Find position of each word in the fixed sentence
    const posWithIndex = sent.pos.map((p, origIdx) => {
        const word = p.w.toLowerCase();
        const pos = fixed.indexOf(word);
        return { ...p, position: pos >= 0 ? pos : 9999, origIdx };
    });

    // SORT BY: 1) Type priority, then 2) Left-to-right position within each type
    posWithIndex.sort((a, b) => {
        const aTypeIdx = TYPE_PRIORITY.indexOf(a.t.toUpperCase());
        const bTypeIdx = TYPE_PRIORITY.indexOf(b.t.toUpperCase());
        const aPriority = aTypeIdx >= 0 ? aTypeIdx : 999;
        const bPriority = bTypeIdx >= 0 ? bTypeIdx : 999;

        // First sort by type priority
        if (aPriority !== bPriority) return aPriority - bPriority;
        // Then sort left-to-right within same type
        return a.position - b.position;
    });

    // Group by type and add numbering
    const typeCounts = {};
    const typeCurrentNum = {};

    // First pass: count each type
    posWithIndex.forEach(p => {
        const t = p.t.toUpperCase();
        typeCounts[t] = (typeCounts[t] || 0) + 1;
    });

    // Second pass: add numbering with left-to-right questions
    return posWithIndex.map(p => {
        const t = p.t.toUpperCase();
        typeCurrentNum[t] = (typeCurrentNum[t] || 0) + 1;
        const total = typeCounts[t];
        const current = typeCurrentNum[t];

        // Generate question based on type and count using proper label
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

// Get the badge label for display (uppercase)
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

// Get the short abbreviation for header display
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

// Brief descriptions for POS tooltips on hover
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
    const phonicsChips = (sent.phonicsWords || []).map(w => `<span class="ufli-word-chip">${w}</span>`).join('');
    const heartChips = (sent.heartWords || []).map(w => `<span class="ufli-heart-chip">${w}</span>`).join('');

    return `<div class="ufli-panel">
        <div class="ufli-top-row">
            <span class="ufli-lesson-badge">Lesson ${sent.ufliLesson}: ${sent.ufliSkill}</span>
            <span class="ufli-section">${sent.ufliSection}</span>
            <span class="ufli-type-badge ${typeClass}">${typeLabel}</span>
        </div>
        <div class="ufli-words-row">
            <div class="ufli-words-section">
                <div class="ufli-word-label">Phonics Words</div>
                <div class="ufli-word-list">${phonicsChips}</div>
            </div>
            <div class="ufli-words-section">
                <div class="ufli-word-label">Heart Words</div>
                <div class="ufli-word-list">${heartChips}</div>
            </div>
        </div>
    </div>`;
}

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

    let html = '';
    lesson.sentences.forEach((sent, idx) => {
        const key = `${currentDay}-${idx}`;
        if (!states[key]) states[key] = { phase: 0, step: 0 };
        const state = states[key];

        // Use helper functions for corrections and POS
        const corrections = getCorrections(sent);
        const orderedPOS = getOrderedPOS(sent);

        // Count all POS types SPECIFICALLY - don't group them
        const counts = {};
        orderedPOS.forEach(p => {
            const t = p.t.toUpperCase();
            counts[t] = (counts[t] || 0) + 1;
        });

        // Build tags with specific abbreviations and full names
        const tagConfig = {
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

        // Order for display (most common first)
        const displayOrder = ['N', 'V', 'MODAL', 'PASS', 'PP', 'ADJ', 'ADV', 'PRO', 'RELPRO', 'OBJPRO', 'PREP', 'SUBCONJ', 'CONJ', 'POSS', 'ART', 'DEM'];

        let tags = '';
        displayOrder.forEach(type => {
            if (counts[type]) {
                const cfg = tagConfig[type] || {abbr: type, name: type, css: 'noun'};
                tags += `<span class="tag ${cfg.css}" title="${getPOSDesc(type)}">${counts[type]} ${cfg.abbr}</span>`;
            }
        });

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
                <button class="popout-btn" onclick="openPopout(${idx})" title="Open as individual lesson">&#x26F6;</button>
                <button class="print-btn" onclick="printWorksheet(${idx})" title="Print worksheet">&#x1F5A8;</button>
            </div>
            ${ufliPanel}
            <div class="sentence-display" id="sent-${idx}">${formatSentence(sent, state)}</div>
            <div class="btn-row">
                <button class="check-btn ${state.phase>=7?'complete':''}" id="btn-${idx}" onclick="advance(${idx})">${getBtnText(state, sent)}</button>
                <button class="reset-btn" onclick="reset(${idx})">Reset</button>
            </div>
            <div id="vocab-${idx}"></div>
            <div id="manip-${idx}"></div>
            <div id="pos-${idx}"></div>
            <div id="corr-${idx}"></div>
        </div>`;
    });
    document.getElementById('content').innerHTML = html;

    lesson.sentences.forEach((sent, idx) => restore(idx, sent));
}

function formatSentence(sent, state) {
    // Get limited corrections and ordered POS
    const corrections = getCorrections(sent);
    const orderedPOS = getOrderedPOS(sent);

    // Once corrections are complete (phase 2+), show clean fixed sentence
    if (state.phase >= 2) {
        const plainText = sent.fixed;
        const posCount = Math.min(state.step - corrections.length, orderedPOS.length);
        const revealed = orderedPOS.slice(0, posCount);

        // Collect all annotations on plain text BEFORE building any HTML
        // This prevents regex from matching inside HTML attributes/tags
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

        // POS labels - match on plain text so we never corrupt HTML
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

        // Apply all annotations from end to start so positions stay valid
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

    // Helper function to find word/phrase position with word boundaries
    function findPosition(text, searchTerm) {
        // Escape special regex characters but keep spaces
        const escaped = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        // Use word boundary at start and end
        const re = new RegExp(`(?:^|(?<=[\\s]))${escaped}(?=[\\s]|$)`, 'gi');
        const match = re.exec(text);
        return match ? match.index : -1;
    }

    // Build a list of corrections with their positions in the original text
    let correctionsList = [];

    for (let i = 0; i < corrCount; i++) {
        const c = corrections[i];
        const isLatest = (i === corrCount - 1);

        // Skip ALL punctuation corrections - handled after the main loop
        // This covers both "(missing)" format AND "word+punct" format (e.g. yesterday -> yesterday.)
        if (c.t === 'punctuation' && (c.w === '(missing)' || (c.r.length > c.w.length && c.r.toLowerCase().startsWith(c.w.toLowerCase())))) {
            continue;
        }

        // Skip if wrong and right are identical (but NOT for capitalization - those differ only in case)
        if (c.t !== 'capitalization' && c.w.toLowerCase() === c.r.toLowerCase()) {
            continue;
        }

        // Find position using word boundary matching
        const pos = findPosition(sent.orig.toLowerCase(), c.w.toLowerCase());

        if (pos !== -1) {
            correctionsList.push({
                pos: pos,
                len: c.w.length,
                wrong: sent.orig.substr(pos, c.w.length),
                right: c.r,
                isLatest: isLatest,
                type: c.t
            });
        }
    }

    // Sort by position for overlap detection
    correctionsList.sort((a, b) => a.pos - b.pos);

    // Remove overlapping corrections (keep the first one)
    let toApply = [];
    let lastEnd = -1;
    for (const corr of correctionsList) {
        if (corr.pos >= lastEnd) {
            toApply.push(corr);
            lastEnd = corr.pos + corr.len;
        }
    }

    // Sort by position descending for string replacement (end to beginning)
    toApply.sort((a, b) => b.pos - a.pos);

    // Apply corrections from end to beginning
    let result = sent.orig;
    for (const corr of toApply) {
        const pulseClass = corr.isLatest ? ' inline-pulse' : '';
        const before = result.substring(0, corr.pos);
        const after = result.substring(corr.pos + corr.len);
        // Use different color classes based on correction type
        let rightClass = 'inline-right'; // default green for spelling/grammar
        if (corr.type === 'capitalization') rightClass = 'inline-cap';
        else if (corr.type === 'punctuation') rightClass = 'inline-punct';
        const replacement = `<span class="inline-corr"><span class="inline-wrong">${corr.wrong}</span><span class="${rightClass}${pulseClass}">${corr.right}</span></span>`;
        result = before + replacement + after;
    }

    // Add punctuation if that correction has been revealed
    for (let i = 0; i < corrCount; i++) {
        const c = corrections[i];
        if (c.t === 'punctuation') {
            const isLatest = (i === corrCount - 1);
            const pulseClass = isLatest ? ' inline-pulse' : '';
            if (c.w === '(missing)') {
                // Mixed grade format: append to end
                result = result.trim() + `<span class="inline-punct${pulseClass}">${c.r}</span>`;
            } else if (c.r.length > c.w.length && c.r.toLowerCase().startsWith(c.w.toLowerCase())) {
                // Grade 4/5 format: word + punctuation mark
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

    // Use helper functions for corrections and POS
    const corrections = getCorrections(sent);
    const orderedPOS = getOrderedPOS(sent);
    const totalCorr = corrections.length;
    const totalPOS = orderedPOS.length;
    const totalManipEx = sent.manip.examples.length;

    // Update sentence display
    document.getElementById(`sent-${idx}`).innerHTML = formatSentence(sent, state);

    // Corrections - newest on top (use limited corrections)
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

    // POS - use ordered POS (left to right), newest revealed on top for display
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

    // Manipulation - show task first, then examples one at a time
    if (state.phase >= 3) {
        const m = sent.manip;
        let examplesHtml = '';

        // Calculate how many examples to show
        let exCount = 0;
        if (state.phase >= 4) {
            exCount = 1; // First example
        }
        if (state.phase >= 5) {
            // Additional examples
            exCount = state.step - totalCorr - totalPOS - 1;
            exCount = Math.min(exCount, totalManipEx);
        }

        // Build examples HTML - newest on top
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

    // Vocabulary
    if (state.phase >= 6) {
        const v = sent.vocab;
        document.getElementById(`vocab-${idx}`).innerHTML = `
        <div class="section vocab-section">
            <div class="vocab-header">Vocabulary Word</div>
            <div class="vocab-word-row">
                <span class="vocab-star">\u2b50</span>
                <span class="vocab-word">${v.w}</span>
                <span class="vocab-type">${v.type}</span>
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

    const btn = document.getElementById(`btn-${idx}`);
    btn.textContent = getBtnText(state, sent);
    btn.classList.toggle('complete', state.phase >= 7);
    btn.disabled = state.phase >= 7;
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

    // Use helper functions for consistent limits
    const corrections = getCorrections(sent);
    const orderedPOS = getOrderedPOS(sent);
    const totalCorr = corrections.length;
    const totalPOS = orderedPOS.length;
    const totalManipEx = sent.manip.examples.length;

    state.step++;

    // Phase logic:
    // 0 = corrections
    // 2 = POS reveal
    // 3 = manipulation highlight + task
    // 4 = first example
    // 5 = remaining examples (one at a time)
    // 6 = vocabulary
    // 7 = complete

    if (state.step <= totalCorr) {
        state.phase = 0;
    } else if (state.step <= totalCorr + totalPOS) {
        state.phase = 2;
    } else if (state.step === totalCorr + totalPOS + 1) {
        state.phase = 3; // Show manipulation highlight + task
    } else if (state.step === totalCorr + totalPOS + 2) {
        state.phase = 4; // Show first example
    } else if (state.step <= totalCorr + totalPOS + 1 + totalManipEx) {
        state.phase = 5; // Show remaining examples
    } else if (state.step === totalCorr + totalPOS + 2 + totalManipEx) {
        state.phase = 6; // Show vocabulary
    } else {
        state.phase = 7; // Complete
    }

    restore(idx, sent);
}

function reset(idx) {
    const lesson = DATA.find(d => d.day === currentDay);
    const sent = lesson.sentences[idx];
    states[`${currentDay}-${idx}`] = { phase: 0, step: 0 };

    document.getElementById(`sent-${idx}`).innerHTML = sent.orig;
    document.getElementById(`corr-${idx}`).innerHTML = '';
    document.getElementById(`pos-${idx}`).innerHTML = '';
    document.getElementById(`manip-${idx}`).innerHTML = '';
    document.getElementById(`vocab-${idx}`).innerHTML = '';

    const btn = document.getElementById(`btn-${idx}`);
    btn.textContent = 'Check Sentence';
    btn.classList.remove('complete');
    btn.disabled = false;
}

function openPopout(idx) {
    popoutIdx = idx;
    const lesson = DATA.find(d => d.day === currentDay);
    const sent = lesson.sentences[idx];
    const key = `${currentDay}-${idx}`;
    if (!states[key]) states[key] = { phase: 0, step: 0 };

    const corrections = getCorrections(sent);
    const orderedPOS = getOrderedPOS(sent);
    const counts = {};
    orderedPOS.forEach(p => {
        const t = p.t.toUpperCase();
        counts[t] = (counts[t] || 0) + 1;
    });

    const tagConfig = {
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
    const displayOrder = ['N', 'V', 'MODAL', 'PASS', 'PP', 'ADJ', 'ADV', 'PRO', 'RELPRO', 'OBJPRO', 'PREP', 'SUBCONJ', 'CONJ', 'POSS', 'ART', 'DEM'];
    let tags = '';
    displayOrder.forEach(type => {
        if (counts[type]) {
            const cfg = tagConfig[type] || {abbr: type, name: type, css: 'noun'};
            tags += `<span class="tag ${cfg.css}" title="${getPOSDesc(type)}">${counts[type]} ${cfg.abbr}</span>`;
        }
    });

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
                <button class="popout-header-print" onclick="printWorksheet(${idx})" title="Print worksheet">&#x1F5A8;</button>
                <button class="popout-close" onclick="closePopout()">\u2715</button>
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
            <div id="popout-vocab"></div>
            <div id="popout-manip"></div>
            <div id="popout-pos"></div>
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
    }

    restorePopout();
}

function resetPopout() {
    const lesson = DATA.find(d => d.day === currentDay);
    const sent = lesson.sentences[popoutIdx];
    states[`${currentDay}-${popoutIdx}`] = { phase: 0, step: 0 };

    document.getElementById('popout-sent').innerHTML = sent.orig;
    document.getElementById('popout-corr').innerHTML = '';
    document.getElementById('popout-pos').innerHTML = '';
    document.getElementById('popout-manip').innerHTML = '';
    document.getElementById('popout-vocab').innerHTML = '';

    const btn = document.getElementById('popout-advance-btn');
    btn.textContent = 'Check Sentence';
    btn.classList.remove('complete');
    btn.disabled = false;
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

    // Vocabulary
    if (state.phase >= 6) {
        const v = sent.vocab;
        document.getElementById('popout-vocab').innerHTML = `
        <div class="section vocab-section">
            <div class="vocab-header">Vocabulary Word</div>
            <div class="vocab-word-row">
                <span class="vocab-star">\u2b50</span>
                <span class="vocab-word">${v.w}</span>
                <span class="vocab-type">${v.type}</span>
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

    const btn = document.getElementById('popout-advance-btn');
    btn.textContent = getBtnText(state, sent);
    btn.classList.toggle('complete', state.phase >= 7);
    btn.disabled = state.phase >= 7;
}

function printWorksheet(idx) {
    const lesson = DATA.find(d => d.day === currentDay);
    const sent = lesson.sentences[idx];
    const orderedPOS = getOrderedPOS(sent);

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

    let posRows = '';
    posOrder.forEach(type => {
        if (posCounts[type]) {
            posRows += '<div class="pr"><span class="pl">' + posLabels[type] + ' (' + posCounts[type] + '):</span><span class="pn"></span></div>';
        }
    });

    const day = currentDay;
    const num = idx + 1;
    const task = sent.manip.task;

    // Build UFLI phonics section for print if in UFLI mode
    let ufliPrintSection = '';
    if (currentGrade === 'ufli' && sent.ufliLesson) {
        const phonicsWordsPrint = (sent.phonicsWords || []).map(w => '<span class="pw">' + w + '</span>').join('');
        const heartWordsPrint = (sent.heartWords || []).map(w => '<span class="hw">' + w + '</span>').join('');
        ufliPrintSection = '<div class="ub"><div class="ul">Lesson ' + sent.ufliLesson + ': ' + sent.ufliSkill + '</div>' +
            '<div class="us">' + sent.ufliSection + ' &bull; ' + (sent.sentenceType === 'intro' ? 'Introduction' : 'Application') + '</div>' +
            '<div class="uw"><span class="uwl">Phonics Words:</span>' + phonicsWordsPrint + '</div>' +
            '<div class="uw"><span class="uwl">Heart Words:</span>' + heartWordsPrint + '</div></div>';
    }

    const html = '<!DOCTYPE html><html><head><title>DOL Day ' + day + ' - Sentence ' + num + '</title>' +
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
'.pn{flex:1;border-bottom:1.5pt solid #b2bec3;height:0.34in}' +
'.tb{border-left:3pt solid #e17055;padding:10pt 14pt;margin-bottom:16pt;font-size:10.5pt;background:#fafafa;border-radius:0 6pt 6pt 0}' +
'.vr{display:flex;align-items:flex-end;gap:6pt;margin-bottom:5pt}' +
'.vl{font-size:10pt;font-weight:700;min-width:1.35in;flex-shrink:0;text-transform:uppercase;padding-bottom:3pt}' +
'.vn{flex:1;border-bottom:1.5pt solid #b2bec3;height:0.32in}' +
'.vt{flex:1;border-bottom:2.5pt solid #2d3436;height:0.32in}' +
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
'<div class="hd"><div><h1>Daily Oral Language</h1><div class="sb">Day ' + day + ' \u2022 Sentence ' + num + '</div></div>' +
'<div class="hdr"><div><span class="fl">Name:</span><span class="fn"></span></div><div><span class="fl">Date:</span><span class="fn fd"></span></div></div></div>' +

ufliPrintSection +

'<div class="sc"><div class="sh"><span class="nm">1</span><span class="st">Sentence Correction</span></div>' +
'<div class="lb">Copy the sentence from the board:</div>' +
'<div class="cb"><div class="cl"></div><div class="cl"></div></div>' +
'<div class="lb">Write the corrected sentence:</div>' +
'<div class="wl"></div><div class="wl"></div><div class="wl"></div></div>' +

'<hr class="dv">' +

'<div class="sc"><div class="sh"><span class="nm">2</span><span class="st">Parts of Speech</span></div>' +
'<div class="lb" style="margin-bottom:12pt">In your corrected sentence, find and write:</div>' +
'<div class="pg2">' + posRows + '</div></div>' +
'</div>' +

'<div class="pg">' +
'<div class="p2">Day ' + day + ' \u2022 Sentence ' + num + ' \u2014 continued</div>' +

'<div class="sc"><div class="sh"><span class="nm">3</span><span class="st">Sentence Manipulation</span></div>' +
'<div class="tb"><strong>Task:</strong> ' + task + '</div>' +
'<div class="lb">Rewrite the sentence with your change:</div>' +
'<div class="wl"></div><div class="wl"></div><div class="wl"></div></div>' +

'<hr class="dv">' +

'<div class="sc"><div class="sh"><span class="nm">4</span><span class="st">Vocabulary Word</span></div>' +
'<div class="vr"><span class="vl">Word:</span><span class="vt"></span></div>' +
'<div class="vr"><span class="vl">Definition:</span><span class="vn"></span></div>' +
'<div class="wl"></div>' +
'<div class="vr"><span class="vl">Synonyms:</span><span class="vn"></span></div>' +
'<div class="vr"><span class="vl">Antonyms:</span><span class="vn"></span></div>' +
'<div class="wp">Write your own sentence using this word:</div>' +
'<div class="wl"></div><div class="wl"></div><div class="wl"></div></div>' +
'</div>' +

'</body></html>';

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank');
    if (!win) { alert('Please allow popups to print worksheets.'); return; }
}

function getMaxDay() { return DATA.length > 0 ? DATA[DATA.length - 1].day : 150; }
function prevDay() { if (currentDay > 1) { currentDay--; renderDay(); } }
function nextDay() { if (currentDay < getMaxDay()) { currentDay++; renderDay(); } }
function goToDay() {
    const v = parseInt(document.getElementById('dayInput').value);
    const max = getMaxDay();
    if (v >= 1 && v <= max) { currentDay = v; renderDay(); }
}

function setSize(v) {
    document.documentElement.style.setProperty('--size', v + 'px');
    document.getElementById('sizeVal').textContent = v + 'px';
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
    if (e.key === 'ArrowLeft') prevDay();
    if (e.key === 'ArrowRight') nextDay();
});
