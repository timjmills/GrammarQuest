let DATA = [];
let currentDay = 1;

document.addEventListener('DOMContentLoaded', () => {
    fetch('data/days.json')
        .then(r => r.json())
        .then(data => {
            DATA = data;
            renderDay();
        });
});

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

function renderDay() {
    const lesson = DATA.find(d => d.day === currentDay);
    if (!lesson) return;

    document.getElementById('currentDay').textContent = currentDay;
    document.getElementById('dayNum').textContent = currentDay;
    document.getElementById('dayInput').value = currentDay;
    document.getElementById('prevBtn').disabled = currentDay <= 1;
    document.getElementById('nextBtn').disabled = currentDay >= 150;

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
                tags += `<span class="tag ${cfg.css}" title="${cfg.name}">${counts[type]} ${cfg.abbr}</span>`;
            }
        });

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
        let text = sent.fixed;

        // Apply manipulation highlight if in manipulation phase (phases 3, 4, 5)
        if (state.phase >= 3 && state.phase <= 5) {
            const manipWord = sent.manip.word;
            const escaped = manipWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');
            const re = new RegExp(`(${escaped})`, 'i');
            text = text.replace(re, `<span class="manip-highlight">$1</span>`);
        }

        // Add POS labels if in POS phase or later - use ordered POS
        const posCount = Math.min(state.step - corrections.length, orderedPOS.length);
        const revealed = orderedPOS.slice(0, posCount);
        revealed.forEach(p => {
            if (!text.includes(`manip-highlight">${p.w}`) && !text.includes(`manip-highlight">${p.w.charAt(0).toUpperCase() + p.w.slice(1)}`)) {
                const re = new RegExp(`\\b(${p.w})\\b`, 'i');
                text = text.replace(re, `<span class="word"><span class="abbr ${p.t}">${p.t}</span>$1</span>`);
            }
        });

        return text;
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

        // Skip missing punctuation - handled at the end
        if (c.t === 'punctuation' && c.w === '(missing)') {
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
        const replacement = `<span class="inline-corr"><span class="inline-wrong">${corr.wrong}</span><span class="inline-right${pulseClass}">${corr.right}</span></span>`;
        result = before + replacement + after;
    }

    // Add punctuation at the end if that correction has been revealed
    for (let i = 0; i < corrCount; i++) {
        const c = corrections[i];
        if (c.t === 'punctuation' && c.w === '(missing)') {
            const isLatest = (i === corrCount - 1);
            const pulseClass = isLatest ? ' inline-pulse' : '';
            result = result.trim() + `<span class="inline-punct${pulseClass}">${c.r}</span>`;
            break;
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
                h += `<div class="pos-item"><span class="check">\u2713</span><span class="q">${p.q}</span><span class="ans"><span class="word-box ${cls}">${p.w}</span><span class="type-badge ${cls}">${badge}</span></span></div>`;
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
            tags += `<span class="tag ${cfg.css}" title="${cfg.name}">${counts[type]} ${cfg.abbr}</span>`;
        }
    });

    const state = states[key];

    const overlay = document.createElement('div');
    overlay.id = 'popout-overlay';
    overlay.onclick = function(e) { if (e.target === overlay) closePopout(); };
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
                h += `<div class="pos-item"><span class="check">\u2713</span><span class="q">${p.q}</span><span class="ans"><span class="word-box ${cls}">${p.w}</span><span class="type-badge ${cls}">${badge}</span></span></div>`;
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
'</style></head><body onload="setTimeout(function(){window.print()},300)">' +

'<div class="pg">' +
'<div class="hd"><div><h1>\ud83d\udcda Daily Oral Language</h1><div class="sb">Day ' + day + ' \u2022 Sentence ' + num + '</div></div>' +
'<div class="hdr"><div><span class="fl">Name:</span><span class="fn"></span></div><div><span class="fl">Date:</span><span class="fn fd"></span></div></div></div>' +

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
'<div class="tb">\u270f\ufe0f <strong>Task:</strong> ' + task + '</div>' +
'<div class="lb">Rewrite the sentence with your change:</div>' +
'<div class="wl"></div><div class="wl"></div><div class="wl"></div></div>' +

'<hr class="dv">' +

'<div class="sc"><div class="sh"><span class="nm">4</span><span class="st">\u2b50 Vocabulary Word</span></div>' +
'<div class="vr"><span class="vl">Word:</span><span class="vt"></span></div>' +
'<div class="vr"><span class="vl">Definition:</span><span class="vn"></span></div>' +
'<div class="wl"></div>' +
'<div class="vr"><span class="vl">Synonyms:</span><span class="vn"></span></div>' +
'<div class="vr"><span class="vl">Antonyms:</span><span class="vn"></span></div>' +
'<div class="wp">\u270f\ufe0f Write your own sentence using this word:</div>' +
'<div class="wl"></div><div class="wl"></div><div class="wl"></div></div>' +
'</div>' +

'</body></html>';

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank');
    if (!win) { alert('Please allow popups to print worksheets.'); return; }
}

function prevDay() { if (currentDay > 1) { currentDay--; renderDay(); } }
function nextDay() { if (currentDay < 150) { currentDay++; renderDay(); } }
function goToDay() {
    const v = parseInt(document.getElementById('dayInput').value);
    if (v >= 1 && v <= 150) { currentDay = v; renderDay(); }
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
