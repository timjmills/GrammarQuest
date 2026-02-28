const WORD_FAMILIES = {
    // ===== EARLY ALPHABET: Single Consonants =====
    "m /m/": {
        families: [
            { pattern: "-am", words: ["am", "ham", "jam", "yam", "ram", "dam"] },
            { pattern: "-um", words: ["gum", "hum", "bum", "sum", "mum", "rum"] },
            { pattern: "ma-", words: ["man", "map", "mat", "mad", "mas", "max"] }
        ]
    },
    "s /s/": {
        families: [
            { pattern: "-as", words: ["has", "gas", "was"] },
            { pattern: "-us", words: ["bus", "pus"] },
            { pattern: "sa-", words: ["sat", "sap", "sad", "sag", "Sam"] },
            { pattern: "-ss", words: ["miss", "hiss", "fuss", "mass", "mess"] }
        ]
    },
    "t /t/": {
        families: [
            { pattern: "-at", words: ["cat", "bat", "hat", "mat", "sat", "rat", "fat", "pat"] },
            { pattern: "-it", words: ["sit", "bit", "fit", "hit", "kit", "pit", "lit"] },
            { pattern: "-ot", words: ["hot", "got", "not", "pot", "dot", "lot", "cot"] }
        ]
    },
    "p /p/": {
        families: [
            { pattern: "-ap", words: ["cap", "map", "nap", "tap", "gap", "lap", "sap", "rap"] },
            { pattern: "-ip", words: ["dip", "hip", "lip", "rip", "sip", "tip", "zip"] },
            { pattern: "-op", words: ["hop", "mop", "pop", "top", "cop", "stop", "drop"] }
        ]
    },
    "f /f/": {
        families: [
            { pattern: "-if", words: ["if"] },
            { pattern: "fa-", words: ["fan", "fat", "far", "fast", "fad"] },
            { pattern: "-uf", words: ["puff", "huff", "buff", "cuff", "muff"] },
            { pattern: "fi-", words: ["fin", "fit", "fig", "fix", "fib", "fill"] }
        ]
    },
    "n /n/": {
        families: [
            { pattern: "-an", words: ["can", "fan", "man", "pan", "ran", "van", "tan", "ban"] },
            { pattern: "-in", words: ["bin", "din", "fin", "pin", "tin", "win", "kin"] },
            { pattern: "-un", words: ["bun", "fun", "gun", "nun", "pun", "run", "sun"] }
        ]
    },
    "d /d/": {
        families: [
            { pattern: "-ad", words: ["bad", "dad", "had", "lad", "mad", "pad", "sad"] },
            { pattern: "-id", words: ["bid", "did", "hid", "kid", "lid", "rid"] },
            { pattern: "-ud", words: ["bud", "dud", "mud", "stud"] }
        ]
    },
    "h /h/": {
        families: [
            { pattern: "ha-", words: ["had", "ham", "has", "hat", "hag", "hap"] },
            { pattern: "hi-", words: ["hid", "him", "hip", "his", "hit", "hill"] },
            { pattern: "ho-", words: ["hog", "hop", "hot", "hob"] },
            { pattern: "hu-", words: ["hub", "hug", "hum", "hut"] }
        ]
    },
    "g /g/": {
        families: [
            { pattern: "-ag", words: ["bag", "gag", "lag", "nag", "rag", "tag", "wag"] },
            { pattern: "-ig", words: ["big", "dig", "fig", "gig", "jig", "pig", "rig", "wig"] },
            { pattern: "-og", words: ["bog", "cog", "dog", "fog", "hog", "jog", "log"] },
            { pattern: "-ug", words: ["bug", "dug", "hug", "jug", "mug", "pug", "rug", "tug"] }
        ]
    },
    "l /l/": {
        families: [
            { pattern: "-al", words: ["gal", "pal"] },
            { pattern: "la-", words: ["lab", "lad", "lag", "lap", "last"] },
            { pattern: "-ill", words: ["bill", "fill", "hill", "mill", "pill", "will", "till"] },
            { pattern: "-ell", words: ["bell", "fell", "sell", "tell", "well", "yell", "spell"] }
        ]
    },
    "b /b/": {
        families: [
            { pattern: "-ab", words: ["cab", "dab", "fab", "grab", "jab", "lab", "nab", "tab"] },
            { pattern: "-ib", words: ["bib", "crib", "fib", "rib"] },
            { pattern: "-ob", words: ["bob", "cob", "gob", "job", "mob", "rob", "sob"] },
            { pattern: "-ub", words: ["club", "cub", "hub", "pub", "rub", "sub", "tub"] }
        ]
    },
    "r /r/": {
        families: [
            { pattern: "-am", words: ["ram", "tram", "gram"] },
            { pattern: "ra-", words: ["ran", "rap", "rat", "rag", "ram", "rib"] },
            { pattern: "-ip", words: ["rip", "trip", "drip", "grip"] },
            { pattern: "-un", words: ["run"] }
        ]
    },
    "c /k/": {
        families: [
            { pattern: "ca-", words: ["cab", "can", "cap", "cat", "cob", "cod", "cop", "cot", "cub", "cup", "cut"] },
            { pattern: "-ck", words: ["back", "deck", "kick", "lock", "duck", "pack", "pick"] }
        ]
    },
    "k /k/": {
        families: [
            { pattern: "ki-", words: ["kid", "kin", "kit", "king", "kiss"] },
            { pattern: "-ck", words: ["back", "deck", "kick", "lock", "duck", "pack", "pick", "rock"] },
            { pattern: "-ke", words: ["bike", "cake", "hike", "lake", "make"] }
        ]
    },
    "j /j/": {
        families: [
            { pattern: "ja-", words: ["jab", "jag", "jam", "jar", "jaw", "jay"] },
            { pattern: "ji-", words: ["jig", "jilt"] },
            { pattern: "jo-", words: ["job", "jog", "jot", "joy"] },
            { pattern: "ju-", words: ["jug", "jump", "just", "jut"] }
        ]
    },
    "w /w/": {
        families: [
            { pattern: "wa-", words: ["wag", "was", "wax", "way"] },
            { pattern: "wi-", words: ["wig", "win", "will", "wish", "with", "wit"] },
            { pattern: "we-", words: ["web", "wed", "well", "went", "wet"] }
        ]
    },
    "v /v/": {
        families: [
            { pattern: "va-", words: ["van", "vat", "vast"] },
            { pattern: "-ive", words: ["five", "dive", "give", "hive", "live"] },
            { pattern: "vi-", words: ["vim", "vin", "vet", "vest", "vine"] }
        ]
    },
    "x /ks/": {
        families: [
            { pattern: "-ax", words: ["ax", "max", "tax", "wax"] },
            { pattern: "-ix", words: ["fix", "mix", "six"] },
            { pattern: "-ox", words: ["box", "fox", "pox"] },
            { pattern: "-ex", words: ["hex", "Rex", "vex"] }
        ]
    },
    "y /y/": {
        families: [
            { pattern: "ya-", words: ["yak", "yam", "yap"] },
            { pattern: "ye-", words: ["yes", "yet", "yell", "yelp"] },
            { pattern: "-ay", words: ["bay", "day", "hay", "jay", "may", "pay", "ray", "say", "way"] }
        ]
    },
    "z /z/": {
        families: [
            { pattern: "za-", words: ["zap"] },
            { pattern: "-iz", words: ["fizz", "quiz", "whiz"] },
            { pattern: "-zz", words: ["buzz", "fuzz", "jazz", "fizz"] },
            { pattern: "zi-", words: ["zig", "zip", "zit"] }
        ]
    },
    "qu /kw/": {
        families: [
            { pattern: "qu-", words: ["quit", "quiz", "quill", "quick", "quack", "quest"] },
            { pattern: "-que", words: ["unique"] }
        ]
    },

    // ===== SHORT VOWELS =====
    "a /ă/": {
        families: [
            { pattern: "-at", words: ["cat", "bat", "hat", "mat", "sat", "rat", "fat", "pat"] },
            { pattern: "-am", words: ["ham", "jam", "ram", "yam", "dam", "clam"] },
            { pattern: "-an", words: ["can", "fan", "man", "pan", "ran", "van", "tan"] },
            { pattern: "-ap", words: ["cap", "map", "nap", "tap", "gap", "lap", "sap"] }
        ]
    },
    "i /ĭ/": {
        families: [
            { pattern: "-it", words: ["bit", "fit", "hit", "kit", "lit", "pit", "sit"] },
            { pattern: "-in", words: ["bin", "din", "fin", "pin", "tin", "win"] },
            { pattern: "-ig", words: ["big", "dig", "fig", "gig", "jig", "pig", "wig"] },
            { pattern: "-ip", words: ["dip", "hip", "lip", "rip", "sip", "tip", "zip"] }
        ]
    },
    "o /ŏ/": {
        families: [
            { pattern: "-ot", words: ["cot", "dot", "got", "hot", "lot", "not", "pot"] },
            { pattern: "-op", words: ["cop", "hop", "mop", "pop", "top"] },
            { pattern: "-og", words: ["bog", "dog", "fog", "hog", "jog", "log"] },
            { pattern: "-ob", words: ["bob", "cob", "gob", "job", "mob", "rob", "sob"] }
        ]
    },
    "u /ŭ/": {
        families: [
            { pattern: "-ug", words: ["bug", "dug", "hug", "jug", "mug", "pug", "rug", "tug"] },
            { pattern: "-un", words: ["bun", "fun", "gun", "nun", "pun", "run", "sun"] },
            { pattern: "-ut", words: ["but", "cut", "gut", "hut", "jut", "nut", "rut"] },
            { pattern: "-ub", words: ["cub", "hub", "pub", "rub", "sub", "tub"] }
        ]
    },
    "e /ĕ/": {
        families: [
            { pattern: "-et", words: ["bet", "get", "jet", "let", "met", "net", "pet", "set", "wet"] },
            { pattern: "-en", words: ["ben", "den", "hen", "men", "pen", "ten"] },
            { pattern: "-ed", words: ["bed", "fed", "led", "red", "wed"] },
            { pattern: "-ell", words: ["bell", "fell", "sell", "tell", "well", "yell"] }
        ]
    },

    // ===== REVIEWS (Early Alphabet / CVC) =====
    "Review (a, i with m, s, t, p, f, n)": {
        families: [
            { pattern: "-at", words: ["mat", "sat", "pat", "fat"] },
            { pattern: "-am", words: ["Sam", "ham", "jam"] },
            { pattern: "-an", words: ["man", "fan", "pan", "tan"] },
            { pattern: "-it", words: ["sit", "fit", "pit"] }
        ]
    },
    "Review/Assessment": {
        families: [
            { pattern: "-at", words: ["cat", "bat", "hat", "mat", "sat"] },
            { pattern: "-in", words: ["bin", "fin", "pin", "tin", "win"] },
            { pattern: "-am", words: ["ham", "jam", "yam", "dam"] }
        ]
    },
    "Review (all short vowels)": {
        families: [
            { pattern: "-at", words: ["cat", "hat", "bat", "sat"] },
            { pattern: "-it", words: ["bit", "hit", "sit", "fit"] },
            { pattern: "-ot", words: ["hot", "got", "pot", "dot"] },
            { pattern: "-ut", words: ["but", "cut", "hut", "nut"] }
        ]
    },
    "Review (all consonants)": {
        families: [
            { pattern: "-at", words: ["bat", "cat", "fat", "hat", "mat", "pat", "rat", "sat"] },
            { pattern: "-ig", words: ["big", "dig", "fig", "jig", "pig", "rig", "wig"] },
            { pattern: "-ug", words: ["bug", "dug", "hug", "jug", "mug", "rug", "tug"] }
        ]
    },
    "Review (CVC with short a)": {
        families: [
            { pattern: "-at", words: ["cat", "bat", "hat", "mat", "sat", "rat", "fat"] },
            { pattern: "-an", words: ["can", "fan", "man", "pan", "ran", "van", "tan"] },
            { pattern: "-ap", words: ["cap", "map", "nap", "tap", "gap", "lap"] },
            { pattern: "-ag", words: ["bag", "gag", "lag", "nag", "rag", "tag", "wag"] }
        ]
    },
    "Review (CVC with short i)": {
        families: [
            { pattern: "-it", words: ["bit", "fit", "hit", "kit", "lit", "pit", "sit"] },
            { pattern: "-in", words: ["bin", "din", "fin", "pin", "tin", "win"] },
            { pattern: "-ig", words: ["big", "dig", "fig", "jig", "pig", "wig"] },
            { pattern: "-ip", words: ["dip", "hip", "lip", "rip", "sip", "tip", "zip"] }
        ]
    },
    "Review (CVC with short o, u)": {
        families: [
            { pattern: "-ot", words: ["cot", "dot", "got", "hot", "lot", "not", "pot"] },
            { pattern: "-op", words: ["cop", "hop", "mop", "pop", "top"] },
            { pattern: "-ug", words: ["bug", "dug", "hug", "jug", "mug", "rug", "tug"] },
            { pattern: "-un", words: ["bun", "fun", "gun", "run", "sun"] }
        ]
    },
    "Review (CVC with short e, mixed)": {
        families: [
            { pattern: "-et", words: ["bet", "get", "jet", "let", "met", "net", "pet", "set", "wet"] },
            { pattern: "-en", words: ["den", "hen", "men", "pen", "ten"] },
            { pattern: "-ed", words: ["bed", "fed", "led", "red", "wed"] },
            { pattern: "-eg", words: ["beg", "keg", "leg", "peg"] }
        ]
    },

    // ===== DIGRAPHS =====
    "sh /sh/": {
        families: [
            { pattern: "sh-", words: ["shed", "shell", "shin", "ship", "shop", "shot", "shut", "shag"] },
            { pattern: "-ash", words: ["bash", "cash", "dash", "gash", "mash", "rash"] },
            { pattern: "-ish", words: ["dish", "fish", "wish"] },
            { pattern: "-ush", words: ["bush", "gush", "hush", "mush", "push", "rush"] }
        ]
    },
    "ch /ch/": {
        families: [
            { pattern: "ch-", words: ["chap", "chat", "check", "chess", "chin", "chip", "chop", "chug"] },
            { pattern: "-atch", words: ["batch", "catch", "hatch", "latch", "match", "patch"] },
            { pattern: "-uch", words: ["much", "such", "touch"] },
            { pattern: "-inch", words: ["inch", "pinch", "finch"] }
        ]
    },
    "th /th/ (unvoiced)": {
        families: [
            { pattern: "th-", words: ["thick", "thin", "thing", "think", "thud", "thump"] },
            { pattern: "-ath", words: ["bath", "math", "path"] },
            { pattern: "-ith", words: ["smith", "with"] },
            { pattern: "-oth", words: ["broth", "cloth", "moth"] }
        ]
    },
    "th /th/ (voiced)": {
        families: [
            { pattern: "th-", words: ["than", "that", "the", "them", "then", "this"] },
            { pattern: "-the", words: ["bathe"] },
            { pattern: "-ther", words: ["other", "mother", "father", "brother"] }
        ]
    },
    "wh /w/": {
        families: [
            { pattern: "wh-", words: ["what", "when", "which", "whip", "whisk", "whim", "whiz"] },
            { pattern: "whi-", words: ["whig", "while", "white", "whine"] }
        ]
    },
    "Digraph Review": {
        families: [
            { pattern: "sh-", words: ["ship", "shop", "shut", "shed"] },
            { pattern: "ch-", words: ["chop", "chip", "chat", "chin"] },
            { pattern: "th-", words: ["this", "that", "them", "thin", "thick"] },
            { pattern: "wh-", words: ["when", "what", "which", "whip"] }
        ]
    },

    // ===== ENDING PATTERNS =====
    "-ck /k/": {
        families: [
            { pattern: "-ack", words: ["back", "jack", "lack", "pack", "rack", "sack", "tack"] },
            { pattern: "-eck", words: ["deck", "neck", "peck", "check", "speck", "wreck"] },
            { pattern: "-ick", words: ["dick", "kick", "lick", "nick", "pick", "sick", "tick", "wick"] },
            { pattern: "-ock", words: ["dock", "knock", "lock", "mock", "rock", "sock", "clock"] }
        ]
    },
    "-ng /ng/": {
        families: [
            { pattern: "-ang", words: ["bang", "fang", "gang", "hang", "rang", "sang"] },
            { pattern: "-ing", words: ["bing", "ding", "king", "ping", "ring", "sing", "wing"] },
            { pattern: "-ong", words: ["bong", "gong", "long", "song", "tong"] },
            { pattern: "-ung", words: ["bung", "hung", "lung", "rung", "sung", "young"] }
        ]
    },
    "-nk /ngk/": {
        families: [
            { pattern: "-ank", words: ["bank", "dank", "rank", "sank", "tank", "yank"] },
            { pattern: "-ink", words: ["blink", "drink", "ink", "link", "pink", "rink", "sink", "think", "wink"] },
            { pattern: "-onk", words: ["bonk", "honk", "conk"] },
            { pattern: "-unk", words: ["bunk", "chunk", "dunk", "funk", "hunk", "junk", "sunk", "trunk"] }
        ]
    },
    "FLSZ Rule (ff, ll, ss, zz)": {
        families: [
            { pattern: "-ff", words: ["buff", "cuff", "huff", "muff", "puff", "off", "staff", "stiff", "stuff"] },
            { pattern: "-ll", words: ["bell", "bill", "bull", "doll", "dull", "fall", "fill", "full", "hall", "hill", "mill", "pill", "pull", "tall", "tell", "will"] },
            { pattern: "-ss", words: ["boss", "fuss", "hiss", "kiss", "less", "loss", "mass", "mess", "miss", "moss", "pass", "toss"] },
            { pattern: "-zz", words: ["buzz", "fizz", "fuzz", "jazz"] }
        ]
    },
    "Review (digraphs + ending patterns)": {
        families: [
            { pattern: "-ck", words: ["back", "deck", "kick", "lock", "duck"] },
            { pattern: "-ng", words: ["bang", "king", "long", "ring", "song"] },
            { pattern: "-nk", words: ["bank", "pink", "sink", "tank", "think"] },
            { pattern: "sh-/ch-", words: ["ship", "shop", "chip", "chop"] }
        ]
    },

    // ===== -all, -oll AND REVIEW =====
    "-all, -oll": {
        families: [
            { pattern: "-all", words: ["ball", "call", "fall", "hall", "mall", "tall", "wall"] },
            { pattern: "-oll", words: ["doll", "poll", "roll", "toll", "stroll"] }
        ]
    },
    "Review": {
        families: [
            { pattern: "-at", words: ["cat", "hat", "bat", "mat", "sat"] },
            { pattern: "-ack", words: ["back", "pack", "rack", "sack", "tack"] },
            { pattern: "-ing", words: ["king", "ring", "sing", "wing"] },
            { pattern: "-all", words: ["ball", "call", "fall", "tall", "wall"] }
        ]
    },

    // ===== INITIAL BLENDS =====
    "Initial blends with l (bl, cl, fl, gl, pl, sl)": {
        families: [
            { pattern: "bl-", words: ["black", "blank", "blast", "bled", "blend", "bless", "bliss", "block", "blog", "blot", "bluff", "blush"] },
            { pattern: "cl-", words: ["clam", "clap", "class", "click", "cliff", "clip", "clock", "clog", "clot", "club", "cluck", "clump"] },
            { pattern: "fl-", words: ["flag", "flap", "flash", "flat", "flesh", "flip", "flock", "flog", "flop", "floss", "flush", "fluff"] },
            { pattern: "gl-/pl-/sl-", words: ["glad", "glass", "glen", "glob", "gloss", "plug", "plan", "plop", "plot", "plum", "plus", "slam", "slap", "sled", "slid", "slim", "slip", "slob", "slot", "slug"] }
        ]
    },
    "Initial blends with r (br, cr, dr, fr, gr, pr, tr)": {
        families: [
            { pattern: "br-", words: ["brag", "brat", "brick", "brim", "bring", "brisk", "brush"] },
            { pattern: "cr-/dr-", words: ["crab", "crack", "craft", "cram", "crash", "crib", "crisp", "crop", "cross", "crush", "crust", "drag", "drip", "drop", "drum", "drug"] },
            { pattern: "fr-/gr-", words: ["frog", "fresh", "frill", "from", "grab", "gram", "grand", "grass", "grin", "grip", "grit", "grub"] },
            { pattern: "pr-/tr-", words: ["press", "prick", "prim", "print", "prop", "track", "trap", "trend", "trick", "trim", "trip", "trot", "truck", "trunk", "trust"] }
        ]
    },
    "Initial blends with s (sc, sk, sm, sn, sp, st, sw)": {
        families: [
            { pattern: "sc-/sk-", words: ["scab", "scam", "scan", "scat", "skill", "skim", "skin", "skip", "skit", "skull", "skunk"] },
            { pattern: "sm-/sn-", words: ["smack", "small", "smash", "smell", "smog", "snack", "snag", "snap", "sniff", "snip", "snob", "snug"] },
            { pattern: "sp-/st-", words: ["span", "spell", "spend", "spill", "spin", "spot", "spun", "stab", "staff", "stamp", "stand", "stem", "step", "stick", "still", "stop", "stuck", "stump", "stun", "stung"] },
            { pattern: "sw-", words: ["swam", "swan", "swap", "swell", "swept", "swim", "swing", "swung"] }
        ]
    },

    // ===== FINAL BLENDS =====
    "Final blends with n (-nd, -nt, -nk)": {
        families: [
            { pattern: "-and", words: ["and", "band", "hand", "land", "sand", "brand", "grand", "stand"] },
            { pattern: "-end", words: ["bend", "blend", "lend", "mend", "send", "spend", "tend"] },
            { pattern: "-ant/-ent", words: ["ant", "can't", "pant", "plant", "rant", "bent", "dent", "rent", "sent", "tent", "went"] },
            { pattern: "-int/-unt", words: ["hint", "mint", "print", "sprint", "bunt", "hunt", "punt", "runt", "stunt"] }
        ]
    },
    "Final blends with l (-ld, -lf, -lk, -lp, -lt)": {
        families: [
            { pattern: "-eld/-ild/-old", words: ["held", "meld", "weld", "build", "child", "mild", "wild", "bold", "cold", "fold", "gold", "hold", "mold", "old", "sold", "told"] },
            { pattern: "-elf/-alf", words: ["elf", "self", "shelf", "half", "calf"] },
            { pattern: "-ilk/-ulk/-alk", words: ["milk", "silk", "bulk", "hulk", "sulk", "talk", "walk", "chalk"] },
            { pattern: "-elt/-ilt/-ult", words: ["belt", "felt", "melt", "built", "guilt", "quilt", "tilt", "wilt", "cult", "jolt", "bolt"] }
        ]
    },
    "Final blends with s/t (-ft, -ct, -pt, -sk, -sp, -st)": {
        families: [
            { pattern: "-ft", words: ["craft", "draft", "drift", "gift", "left", "lift", "loft", "raft", "shift", "soft", "swift"] },
            { pattern: "-ct/-pt", words: ["act", "fact", "kept", "slept", "crept", "wept"] },
            { pattern: "-sk/-sp", words: ["ask", "desk", "disk", "dusk", "mask", "risk", "task", "tusk", "clasp", "crisp", "gasp", "grasp", "wisp"] },
            { pattern: "-st", words: ["best", "fast", "fist", "just", "last", "list", "lost", "mist", "must", "nest", "past", "rest", "test", "vest", "west"] }
        ]
    },

    // ===== THREE-LETTER BLENDS =====
    "Three-letter blends (str, spr, scr)": {
        families: [
            { pattern: "str-", words: ["strap", "stream", "street", "stress", "stretch", "strict", "string", "strip", "strong", "struck", "strung", "strut"] },
            { pattern: "spr-", words: ["sprang", "spray", "spread", "spring", "sprint", "sprout", "sprung", "spruce"] },
            { pattern: "scr-", words: ["scram", "scrap", "scrape", "scratch", "scream", "screen", "scrub", "scruff"] }
        ]
    },
    "Three-letter blends (spl, squ, thr, shr)": {
        families: [
            { pattern: "spl-", words: ["splash", "splat", "splend", "splice", "split", "splint"] },
            { pattern: "squ-", words: ["squad", "squash", "squat", "squeal", "squeeze", "squid", "squint", "squirm"] },
            { pattern: "thr-", words: ["thrash", "thread", "three", "threw", "thrill", "throat", "throne", "throb", "throng", "throw", "thrust"] },
            { pattern: "shr-", words: ["shrank", "shred", "shrew", "shriek", "shrimp", "shrink", "shrub", "shrug", "shrunk"] }
        ]
    },
    "Blend Review & Assessment": {
        families: [
            { pattern: "bl-/cl-/fl-", words: ["black", "clap", "flag", "flat", "flip", "club"] },
            { pattern: "br-/cr-/dr-", words: ["brag", "crab", "drip", "drop", "drum"] },
            { pattern: "sp-/st-/sw-", words: ["spin", "spot", "step", "stop", "swim", "swing"] },
            { pattern: "-nd/-nt/-st", words: ["band", "hand", "sand", "bent", "tent", "best", "fast", "just"] }
        ]
    },

    // ===== VCe (Magic E / Silent E) =====
    "VCe with a (a_e as in cake, make, lake)": {
        families: [
            { pattern: "-ake", words: ["bake", "cake", "fake", "lake", "make", "rake", "sake", "take", "wake"] },
            { pattern: "-ame", words: ["came", "fame", "game", "lame", "name", "same", "tame"] },
            { pattern: "-ane", words: ["cane", "Jane", "lane", "mane", "pane", "vane"] },
            { pattern: "-ate", words: ["date", "fate", "gate", "hate", "Kate", "late", "mate", "rate"] }
        ]
    },
    "VCe with i (i_e as in bike, time, like)": {
        families: [
            { pattern: "-ike", words: ["bike", "hike", "like", "Mike", "pike", "spike", "strike"] },
            { pattern: "-ime", words: ["dime", "lime", "mime", "time", "chime", "crime", "prime"] },
            { pattern: "-ine", words: ["dine", "fine", "line", "mine", "nine", "pine", "vine", "wine"] },
            { pattern: "-ite", words: ["bite", "kite", "mite", "quite", "site", "white", "write"] }
        ]
    },
    "VCe with o (o_e as in home, bone, hope)": {
        families: [
            { pattern: "-oke", words: ["broke", "joke", "poke", "smoke", "spoke", "woke"] },
            { pattern: "-one", words: ["bone", "cone", "done", "gone", "lone", "phone", "stone", "tone", "zone"] },
            { pattern: "-ope", words: ["cope", "hope", "mope", "pope", "rope", "scope", "slope"] },
            { pattern: "-ose", words: ["chose", "close", "hose", "nose", "pose", "rose", "those"] }
        ]
    },
    "VCe with u (u_e)": {
        families: [
            { pattern: "-ube", words: ["cube", "tube"] },
            { pattern: "-ude", words: ["crude", "dude", "rude"] },
            { pattern: "-ule", words: ["mule", "rule", "yule"] },
            { pattern: "-ute", words: ["brute", "cute", "flute", "mute"] }
        ]
    },
    "VCe with e (e_e)": {
        families: [
            { pattern: "-ete", words: ["Pete", "complete", "compete", "delete"] },
            { pattern: "-ere", words: ["here", "mere", "severe"] },
            { pattern: "-eve", words: ["eve", "Steve"] },
            { pattern: "-ese", words: ["these"] }
        ]
    },
    "VCe Review (a_e, i_e)": {
        families: [
            { pattern: "-ake/-ame", words: ["bake", "cake", "lake", "make", "came", "game", "name"] },
            { pattern: "-ate/-ane", words: ["date", "gate", "late", "cane", "lane", "mane"] },
            { pattern: "-ike/-ime", words: ["bike", "hike", "like", "dime", "lime", "time"] },
            { pattern: "-ine/-ite", words: ["fine", "line", "mine", "pine", "bite", "kite", "white"] }
        ]
    },
    "VCe Review (o_e, u_e)": {
        families: [
            { pattern: "-oke/-one", words: ["broke", "joke", "poke", "woke", "bone", "cone", "tone"] },
            { pattern: "-ope/-ose", words: ["hope", "rope", "scope", "close", "hose", "nose", "rose"] },
            { pattern: "-ube/-ute", words: ["cube", "tube", "cute", "flute", "mute"] },
            { pattern: "-ule/-ude", words: ["mule", "rule", "dude", "rude"] }
        ]
    },
    "VCe + blends": {
        families: [
            { pattern: "-ake (bl)", words: ["Blake", "brake", "flake", "snake", "stake"] },
            { pattern: "-ine (bl)", words: ["brine", "shrine", "spine", "swine", "twine", "whine"] },
            { pattern: "-oke (bl)", words: ["broke", "smoke", "spoke", "stroke"] },
            { pattern: "-ide (bl)", words: ["bride", "glide", "pride", "slide", "stride"] }
        ]
    },
    "VCe + digraphs": {
        families: [
            { pattern: "-ade (dg)", words: ["shade", "blade"] },
            { pattern: "-ake (dg)", words: ["shake"] },
            { pattern: "-ine (dg)", words: ["shine", "whine"] },
            { pattern: "-ose (dg)", words: ["chose", "those"] }
        ]
    },
    "Contrasting CVC vs VCe": {
        families: [
            { pattern: "CVC vs VCe (a)", words: ["can/cane", "cap/cape", "hat/hate", "man/mane", "mat/mate", "tap/tape"] },
            { pattern: "CVC vs VCe (i)", words: ["bit/bite", "dim/dime", "fin/fine", "hid/hide", "kit/kite", "pin/pine", "rip/ripe", "Tim/time", "win/wine"] },
            { pattern: "CVC vs VCe (o)", words: ["cod/code", "cop/cope", "hop/hope", "mop/mope", "not/note", "rob/robe", "rod/rode"] },
            { pattern: "CVC vs VCe (u)", words: ["cub/cube", "cut/cute", "tub/tube", "us/use"] }
        ]
    },
    "VCe Assessment & Review": {
        families: [
            { pattern: "-ake/-ate", words: ["bake", "cake", "lake", "make", "date", "gate", "late", "rate"] },
            { pattern: "-ike/-ite", words: ["bike", "hike", "like", "bite", "kite", "white"] },
            { pattern: "-one/-ope", words: ["bone", "cone", "tone", "hope", "rope", "scope"] },
            { pattern: "-ube/-ute", words: ["cube", "tube", "cute", "flute", "mute"] }
        ]
    },
    "Cumulative Review (CVC, blends, digraphs, VCe)": {
        families: [
            { pattern: "CVC", words: ["cat", "dog", "big", "run", "red", "hot", "sit", "fun"] },
            { pattern: "Blends", words: ["black", "clap", "flip", "grab", "spin", "stop", "swim"] },
            { pattern: "Digraphs", words: ["ship", "chip", "thin", "when", "much", "fish"] },
            { pattern: "VCe", words: ["cake", "bike", "home", "cute", "name", "time", "bone"] }
        ]
    },

    // ===== R-CONTROLLED VOWELS =====
    "ar /ar/": {
        families: [
            { pattern: "-ar", words: ["bar", "car", "far", "jar", "scar", "star", "tar"] },
            { pattern: "-ark", words: ["bark", "dark", "lark", "mark", "park", "shark", "spark"] },
            { pattern: "-arm", words: ["arm", "charm", "farm", "harm"] },
            { pattern: "-art", words: ["art", "cart", "dart", "heart", "part", "smart", "start"] }
        ]
    },
    "or /or/": {
        families: [
            { pattern: "-or", words: ["for", "or"] },
            { pattern: "-ork", words: ["cork", "fork", "pork", "stork", "work", "York"] },
            { pattern: "-orn", words: ["born", "corn", "horn", "morn", "torn", "worn"] },
            { pattern: "-ort", words: ["fort", "port", "short", "sort", "sport"] }
        ]
    },
    "er /er/": {
        families: [
            { pattern: "-er", words: ["her", "fern", "herd", "nerd", "term", "verb"] },
            { pattern: "-erk", words: ["clerk", "jerk", "perk"] },
            { pattern: "-erm", words: ["germ", "term"] },
            { pattern: "-ern", words: ["fern", "stern"] }
        ]
    },
    "ir /er/": {
        families: [
            { pattern: "-ird", words: ["bird", "third"] },
            { pattern: "-irl", words: ["girl", "swirl", "twirl", "whirl"] },
            { pattern: "-irt", words: ["dirt", "shirt", "skirt"] },
            { pattern: "-irm", words: ["firm", "squirm"] }
        ]
    },
    "ur /er/": {
        families: [
            { pattern: "-urn", words: ["burn", "turn", "churn"] },
            { pattern: "-urt", words: ["hurt", "blurt", "burst"] },
            { pattern: "-urb", words: ["curb", "herb"] },
            { pattern: "-url", words: ["curl", "furl", "hurl"] }
        ]
    },
    "R-Controlled Review (ar, or)": {
        families: [
            { pattern: "-ar", words: ["bar", "car", "far", "jar", "star"] },
            { pattern: "-ark/-arm", words: ["bark", "dark", "park", "arm", "farm", "harm"] },
            { pattern: "-orn/-ort", words: ["born", "corn", "horn", "torn", "fort", "port", "sort", "sport"] },
            { pattern: "-ork", words: ["cork", "fork", "pork", "stork"] }
        ]
    },
    "R-Controlled Review (er, ir, ur)": {
        families: [
            { pattern: "-er words", words: ["her", "fern", "herd", "nerd", "term", "verb"] },
            { pattern: "-ir words", words: ["bird", "dirt", "firm", "girl", "shirt", "skirt", "third"] },
            { pattern: "-ur words", words: ["burn", "curl", "fur", "hurt", "nurse", "purse", "turn"] }
        ]
    },
    "ar with blends/digraphs": {
        families: [
            { pattern: "-ark (bl)", words: ["shark", "spark"] },
            { pattern: "-arm (bl)", words: ["charm", "farm"] },
            { pattern: "-ard", words: ["card", "guard", "hard", "yard"] },
            { pattern: "-art (bl)", words: ["chart", "smart", "start"] }
        ]
    },
    "or with blends/digraphs": {
        families: [
            { pattern: "-ork (bl)", words: ["stork"] },
            { pattern: "-orn (bl)", words: ["scorn", "shorn", "thorn"] },
            { pattern: "-ort (bl)", words: ["short", "snort", "sport"] },
            { pattern: "-ore", words: ["chore", "shore", "store", "snore", "score"] }
        ]
    },
    "R-Controlled Review + Assessment": {
        families: [
            { pattern: "-ar family", words: ["bar", "car", "far", "star", "bark", "dark", "park", "farm", "art", "cart"] },
            { pattern: "-or family", words: ["for", "corn", "horn", "born", "fort", "sort", "fork", "pork"] },
            { pattern: "-er/-ir/-ur", words: ["her", "fern", "bird", "girl", "dirt", "shirt", "burn", "curl", "turn", "hurt"] }
        ]
    },

    // ===== VOWEL TEAMS =====
    "ai /ay/": {
        families: [
            { pattern: "-ail", words: ["bail", "fail", "hail", "jail", "mail", "nail", "pail", "rail", "sail", "tail", "trail"] },
            { pattern: "-ain", words: ["brain", "chain", "drain", "gain", "main", "pain", "plain", "rain", "train", "vain"] },
            { pattern: "-aid", words: ["braid", "maid", "paid", "raid"] },
            { pattern: "-ait", words: ["bait", "wait", "trait"] }
        ]
    },
    "ay /ay/": {
        families: [
            { pattern: "-ay", words: ["bay", "clay", "day", "gray", "hay", "jay", "lay", "may", "pay", "play", "pray", "ray", "say", "spray", "stay", "stray", "sway", "tray", "way"] }
        ]
    },
    "ee /ee/": {
        families: [
            { pattern: "-eed", words: ["bleed", "breed", "deed", "feed", "need", "seed", "speed", "weed"] },
            { pattern: "-eek", words: ["cheek", "creek", "geek", "meek", "peek", "reek", "seek", "sleek", "week"] },
            { pattern: "-eel", words: ["feel", "heel", "kneel", "peel", "reel", "steel", "wheel"] },
            { pattern: "-een/-eer", words: ["been", "green", "keen", "queen", "screen", "seen", "teen", "beer", "cheer", "deer", "peer", "steer"] }
        ]
    },
    "ea /ee/": {
        families: [
            { pattern: "-ead", words: ["bead", "lead", "plead", "read"] },
            { pattern: "-eak", words: ["beak", "leak", "peak", "sneak", "speak", "squeak", "weak"] },
            { pattern: "-eal", words: ["deal", "heal", "meal", "real", "seal", "steal", "veal"] },
            { pattern: "-eam/-ean", words: ["beam", "cream", "dream", "gleam", "steam", "stream", "team", "bean", "clean", "dean", "lean", "mean"] }
        ]
    },
    "oa /oh/": {
        families: [
            { pattern: "-oad", words: ["load", "road", "toad"] },
            { pattern: "-oak", words: ["cloak", "croak", "oak", "soak"] },
            { pattern: "-oal", words: ["coal", "foal", "goal"] },
            { pattern: "-oat", words: ["boat", "coat", "float", "goat", "moat"] }
        ]
    },
    "ow /oh/": {
        families: [
            { pattern: "-ow (long o)", words: ["blow", "bow", "crow", "flow", "glow", "grow", "know", "low", "mow", "row", "show", "slow", "snow", "stow", "throw", "tow"] },
            { pattern: "-own (long o)", words: ["blown", "brown", "flown", "grown", "known", "own", "shown", "sown", "thrown"] }
        ]
    },
    "Vowel Team Review (ai/ay, ee/ea)": {
        families: [
            { pattern: "ai/ay", words: ["bail", "chain", "main", "pain", "rain", "tail", "train", "day", "hay", "play", "say", "stay", "way"] },
            { pattern: "ee", words: ["bee", "feed", "feel", "green", "need", "seed", "see", "week"] },
            { pattern: "ea", words: ["bead", "bean", "clean", "dream", "heal", "mean", "read", "team"] }
        ]
    },
    "igh /eye/": {
        families: [
            { pattern: "-ight", words: ["bright", "fight", "flight", "fright", "knight", "light", "might", "night", "right", "sight", "slight", "tight"] },
            { pattern: "-igh", words: ["high", "sigh", "thigh"] }
        ]
    },
    "oo /oo/": {
        families: [
            { pattern: "-oom", words: ["bloom", "boom", "broom", "doom", "gloom", "room", "zoom"] },
            { pattern: "-oon", words: ["boon", "loon", "moon", "noon", "soon", "spoon"] },
            { pattern: "-ool", words: ["cool", "drool", "fool", "pool", "school", "spool", "tool"] },
            { pattern: "-oot", words: ["boot", "hoot", "loot", "root", "scoot", "shoot", "toot"] }
        ]
    },
    "oo /uh/": {
        families: [
            { pattern: "-ook", words: ["book", "brook", "cook", "hook", "look", "nook", "rook", "shook", "took"] },
            { pattern: "-ood", words: ["good", "hood", "stood", "wood"] },
            { pattern: "-oof/-oot", words: ["hoof", "proof", "roof", "foot", "soot"] }
        ]
    },
    "Vowel Team Review (oa/ow, igh, oo)": {
        families: [
            { pattern: "oa/ow", words: ["boat", "coat", "goat", "road", "blow", "grow", "know", "show", "slow", "snow"] },
            { pattern: "igh", words: ["bright", "fight", "high", "light", "might", "night", "right", "sight"] },
            { pattern: "oo (long)", words: ["cool", "moon", "room", "school", "soon", "tool", "zoo"] },
            { pattern: "oo (short)", words: ["book", "cook", "good", "hook", "look", "took", "wood"] }
        ]
    },
    "Vowel Team Assessment": {
        families: [
            { pattern: "ai/ay", words: ["brain", "chain", "mail", "rain", "train", "day", "play", "say"] },
            { pattern: "ee/ea", words: ["feed", "green", "seed", "week", "bean", "clean", "dream", "read"] },
            { pattern: "oa/ow", words: ["boat", "coat", "road", "blow", "grow", "show", "snow"] },
            { pattern: "igh/oo", words: ["fight", "light", "night", "right", "book", "cool", "moon", "room"] }
        ]
    },

    // ===== DIPHTHONGS =====
    "oi /oy/": {
        families: [
            { pattern: "-oil", words: ["boil", "coil", "foil", "oil", "soil", "spoil", "toil"] },
            { pattern: "-oin", words: ["coin", "join", "point"] },
            { pattern: "-oist/-oid", words: ["hoist", "joist", "moist", "void", "avoid"] }
        ]
    },
    "oy /oy/": {
        families: [
            { pattern: "-oy", words: ["boy", "coy", "joy", "ploy", "soy", "toy"] },
            { pattern: "-oyage", words: ["voyage"] },
            { pattern: "-oyal", words: ["loyal", "royal"] }
        ]
    },
    "ou /ow/": {
        families: [
            { pattern: "-ound", words: ["bound", "found", "ground", "hound", "mound", "pound", "round", "sound", "wound"] },
            { pattern: "-ouse", words: ["blouse", "grouse", "house", "louse", "mouse", "spouse"] },
            { pattern: "-out", words: ["bout", "clout", "pout", "scout", "shout", "snout", "spout", "trout"] },
            { pattern: "-oud/-our", words: ["cloud", "loud", "proud", "flour", "hour", "our", "sour"] }
        ]
    },
    "ow /ow/": {
        families: [
            { pattern: "-ow (ou)", words: ["bow", "brow", "cow", "how", "now", "plow", "pow", "row", "sow", "vow", "wow"] },
            { pattern: "-own (ou)", words: ["brown", "clown", "crown", "down", "drown", "frown", "gown", "town"] },
            { pattern: "-owl/-owd", words: ["fowl", "growl", "howl", "jowl", "owl", "prowl", "scowl", "crowd"] }
        ]
    },
    "ew /oo/": {
        families: [
            { pattern: "-ew", words: ["blew", "brew", "chew", "crew", "dew", "drew", "few", "flew", "grew", "knew", "new", "stew", "threw"] },
            { pattern: "-ewn", words: ["hewn", "sewn", "strewn"] }
        ]
    },
    "au /aw/": {
        families: [
            { pattern: "-aul", words: ["haul", "maul", "Paul"] },
            { pattern: "-ault", words: ["fault", "vault"] },
            { pattern: "-ause", words: ["cause", "pause"] },
            { pattern: "au-", words: ["auto", "sauce", "launch", "August"] }
        ]
    },
    "aw /aw/": {
        families: [
            { pattern: "-aw", words: ["caw", "claw", "draw", "gnaw", "jaw", "law", "paw", "raw", "saw", "straw", "thaw"] },
            { pattern: "-awn", words: ["dawn", "drawn", "fawn", "lawn", "prawn", "spawn", "yawn"] },
            { pattern: "-awl", words: ["bawl", "brawl", "crawl", "drawl", "shawl", "sprawl"] }
        ]
    },
    "Diphthong Review (oi/oy, ou/ow, ew, au/aw)": {
        families: [
            { pattern: "oi/oy", words: ["boil", "coin", "join", "oil", "soil", "boy", "joy", "toy"] },
            { pattern: "ou/ow", words: ["cloud", "found", "house", "loud", "round", "shout", "cow", "down", "how", "now", "town"] },
            { pattern: "ew", words: ["blew", "chew", "drew", "few", "flew", "grew", "knew", "new"] },
            { pattern: "au/aw", words: ["cause", "haul", "pause", "claw", "draw", "jaw", "paw", "saw"] }
        ]
    },

    // ===== SILENT LETTERS =====
    "kn /n/": {
        families: [
            { pattern: "kn-", words: ["knack", "knead", "knee", "kneel", "knew", "knife", "knight", "knit", "knob", "knock", "knot", "know", "knuckle"] }
        ]
    },
    "wr /r/": {
        families: [
            { pattern: "wr-", words: ["wrap", "wrack", "wrath", "wreath", "wreck", "wren", "wring", "wrist", "write", "wrong", "wrote"] }
        ]
    },
    "gn /n/": {
        families: [
            { pattern: "gn-", words: ["gnar", "gnash", "gnat", "gnaw", "gnome"] },
            { pattern: "-gn", words: ["align", "assign", "design", "reign", "sign"] }
        ]
    },
    "mb /m/": {
        families: [
            { pattern: "-mb", words: ["bomb", "climb", "comb", "crumb", "dumb", "lamb", "limb", "numb", "plumb", "thumb", "tomb"] }
        ]
    },
    "Silent Letter Review (kn, wr, gn, mb)": {
        families: [
            { pattern: "kn-", words: ["knee", "knew", "knife", "knight", "knit", "knob", "knock", "knot", "know"] },
            { pattern: "wr-", words: ["wrap", "wreck", "wring", "wrist", "write", "wrong", "wrote"] },
            { pattern: "gn", words: ["gnat", "gnaw", "gnome", "design", "sign"] },
            { pattern: "-mb", words: ["climb", "comb", "crumb", "dumb", "lamb", "limb", "numb", "thumb"] }
        ]
    },

    // ===== ADVANCED PATTERNS =====
    "Soft c /s/": {
        families: [
            { pattern: "ce-", words: ["cell", "cent", "center", "cedar", "cellar"] },
            { pattern: "-ce", words: ["ace", "dice", "face", "ice", "lace", "mice", "nice", "pace", "place", "price", "race", "rice", "slice", "space", "twice"] },
            { pattern: "ci-", words: ["circle", "circus", "city", "cider", "civil"] },
            { pattern: "cy-", words: ["cycle", "cymbal", "cypress"] }
        ]
    },
    "Soft g /j/": {
        families: [
            { pattern: "ge-", words: ["gem", "gene", "germ", "gentle", "general"] },
            { pattern: "-ge", words: ["age", "cage", "huge", "page", "rage", "sage", "stage", "wage"] },
            { pattern: "gi-", words: ["giant", "ginger", "giraffe"] },
            { pattern: "gy-", words: ["gym", "gypsy"] }
        ]
    },
    "-dge /j/": {
        families: [
            { pattern: "-adge", words: ["badge", "gadget"] },
            { pattern: "-edge", words: ["edge", "hedge", "ledge", "pledge", "wedge"] },
            { pattern: "-idge", words: ["bridge", "fridge", "ridge"] },
            { pattern: "-odge/-udge", words: ["dodge", "lodge", "budge", "fudge", "judge", "nudge", "smudge"] }
        ]
    },
    "-tch /ch/": {
        families: [
            { pattern: "-atch", words: ["batch", "catch", "hatch", "latch", "match", "patch", "scratch", "thatch", "watch"] },
            { pattern: "-etch", words: ["fetch", "sketch", "stretch"] },
            { pattern: "-itch", words: ["ditch", "hitch", "itch", "kitchen", "pitch", "stitch", "switch", "witch"] },
            { pattern: "-otch/-utch", words: ["botch", "notch", "scotch", "clutch", "crutch", "hutch"] }
        ]
    },
    "-tion /shun/": {
        families: [
            { pattern: "-tion", words: ["action", "fraction", "motion", "nation", "notion", "option", "potion", "section", "station", "vacation"] },
            { pattern: "-ation", words: ["creation", "education", "information", "location", "operation", "situation", "vacation"] }
        ]
    },
    "-sion /shun/": {
        families: [
            { pattern: "-sion", words: ["fusion", "mission", "passion", "session", "tension", "version", "vision"] },
            { pattern: "-ssion", words: ["admission", "commission", "expression", "impression", "permission", "possession", "profession"] }
        ]
    },
    "Advanced Patterns Review": {
        families: [
            { pattern: "soft c/g", words: ["ace", "cell", "cent", "city", "face", "ice", "age", "cage", "gem", "giant", "page", "stage"] },
            { pattern: "-dge/-tch", words: ["badge", "bridge", "edge", "fudge", "judge", "catch", "ditch", "match", "pitch", "watch"] },
            { pattern: "-tion/-sion", words: ["action", "motion", "nation", "station", "mission", "tension", "version", "vision"] }
        ]
    },

    // ===== PREFIXES =====
    "un-": {
        families: [
            { pattern: "un- (not)", words: ["unable", "unclear", "uncover", "undo", "unfair", "unhappy", "unkind", "unlock", "unlucky", "unpack", "unsafe", "untie"] },
            { pattern: "un- (opposite)", words: ["unbend", "unbutton", "undone", "unfold", "unplug", "unroll", "unseen", "unwrap", "unzip"] }
        ]
    },
    "re-": {
        families: [
            { pattern: "re- (again)", words: ["redo", "refill", "reheat", "reload", "reopen", "repaint", "replay", "reread", "restart", "retell", "reuse", "rewrite"] },
            { pattern: "re- (back)", words: ["recall", "reclaim", "recover", "reflect", "reform", "refresh", "regain", "regroup", "remind", "remove", "repair", "return"] }
        ]
    },
    "pre-": {
        families: [
            { pattern: "pre- (before)", words: ["preheat", "premix", "preschool", "preset", "pretest", "preview", "prewash"] },
            { pattern: "pre- (in advance)", words: ["precook", "predict", "prefix", "prepay", "prepare", "presort"] }
        ]
    },
    "dis-": {
        families: [
            { pattern: "dis- (not)", words: ["disable", "disagree", "disallow", "disappear", "disbelief", "disconnect", "dishonest", "dislike", "disobey", "disorder", "displease", "disrespect"] },
            { pattern: "dis- (apart)", words: ["discard", "discharge", "disclose", "discover", "discuss", "display", "dispose", "disrupt"] }
        ]
    },
    "mis-": {
        families: [
            { pattern: "mis- (wrongly)", words: ["misbehave", "miscount", "misguide", "mishear", "misjudge", "mislead", "mismatch", "misname", "misplace", "misprint", "misread", "misspell", "misstep", "mistake", "mistrust", "misuse"] }
        ]
    },
    "Prefix Review": {
        families: [
            { pattern: "un-", words: ["unfair", "unhappy", "unkind", "unlock", "unpack", "unsafe", "untie"] },
            { pattern: "re-", words: ["redo", "refill", "reheat", "repaint", "replay", "reread", "rewrite"] },
            { pattern: "pre-/dis-/mis-", words: ["preheat", "preview", "preschool", "disagree", "dislike", "disobey", "misbehave", "mislead", "misspell", "mistake"] }
        ]
    },

    // ===== SUFFIXES =====
    "-ful": {
        families: [
            { pattern: "-ful (full of)", words: ["careful", "cheerful", "colorful", "fearful", "graceful", "grateful", "handful", "harmful", "helpful", "hopeful", "joyful", "painful", "peaceful", "playful", "powerful", "thankful", "truthful", "useful", "wonderful"] }
        ]
    },
    "-less": {
        families: [
            { pattern: "-less (without)", words: ["careless", "endless", "fearless", "harmless", "helpless", "homeless", "hopeless", "jobless", "nameless", "painless", "restless", "sleepless", "useless", "wireless", "worthless"] }
        ]
    },
    "-ly": {
        families: [
            { pattern: "-ly (how)", words: ["badly", "bravely", "brightly", "calmly", "clearly", "coldly", "deeply", "fairly", "firmly", "freely", "gladly", "greatly", "hardly", "kindly", "loudly", "neatly", "nicely", "quickly", "quietly", "safely", "slowly", "softly", "sweetly", "warmly", "widely", "wisely"] }
        ]
    },
    "-er (comparative)": {
        families: [
            { pattern: "-er (more)", words: ["bigger", "brighter", "colder", "darker", "deeper", "faster", "harder", "higher", "kinder", "longer", "louder", "newer", "older", "quicker", "shorter", "slower", "smaller", "softer", "taller", "warmer", "wider", "younger"] }
        ]
    },
    "-est (superlative)": {
        families: [
            { pattern: "-est (most)", words: ["biggest", "brightest", "coldest", "darkest", "deepest", "fastest", "hardest", "highest", "kindest", "longest", "loudest", "newest", "oldest", "quickest", "shortest", "slowest", "smallest", "softest", "tallest", "warmest", "widest", "youngest"] }
        ]
    },
    "-ness": {
        families: [
            { pattern: "-ness (state of)", words: ["blindness", "boldness", "brightness", "calmness", "coldness", "coolness", "darkness", "fairness", "firmness", "fitness", "fondness", "gladness", "goodness", "happiness", "hardness", "illness", "kindness", "loudness", "madness", "neatness", "richness", "sadness", "sharpness", "sickness", "slowness", "softness", "stillness", "sweetness", "thickness", "weakness", "wellness", "wildness"] }
        ]
    },
    "-able/-ible": {
        families: [
            { pattern: "-able", words: ["adorable", "breakable", "comfortable", "doable", "enjoyable", "fixable", "lovable", "movable", "readable", "reachable", "teachable", "washable"] },
            { pattern: "-ible", words: ["edible", "flexible", "horrible", "possible", "terrible", "visible"] }
        ]
    },
    "-ment": {
        families: [
            { pattern: "-ment (result of)", words: ["agreement", "amazement", "argument", "arrangement", "basement", "enjoyment", "equipment", "excitement", "government", "improvement", "judgment", "movement", "payment", "placement", "punishment", "statement", "treatment"] }
        ]
    },
    "Suffix Review": {
        families: [
            { pattern: "-ful/-less", words: ["careful", "cheerful", "helpful", "hopeful", "thankful", "careless", "helpless", "hopeless", "useless", "wireless"] },
            { pattern: "-ly/-ness", words: ["badly", "kindly", "nicely", "quickly", "slowly", "darkness", "gladness", "goodness", "happiness", "kindness", "sadness"] },
            { pattern: "-er/-est", words: ["bigger", "faster", "longer", "taller", "biggest", "fastest", "longest", "tallest"] },
            { pattern: "-able/-ment", words: ["breakable", "lovable", "readable", "washable", "agreement", "enjoyment", "excitement", "movement"] }
        ]
    },

    // ===== COMPOUND WORDS & SYLLABLE DIVISION =====
    "Compound Words": {
        families: [
            { pattern: "sun-", words: ["sunburn", "sunflower", "sunlight", "sunrise", "sunset", "sunshine"] },
            { pattern: "-ball/-side", words: ["baseball", "basketball", "football", "snowball", "bedside", "hillside", "inside", "outside"] },
            { pattern: "any-/every-/some-", words: ["anybody", "anyone", "anything", "anywhere", "everybody", "everyone", "everything", "everywhere", "somebody", "someone", "something", "somewhere"] },
            { pattern: "common compounds", words: ["airplane", "backpack", "bathroom", "bedroom", "birthday", "breakfast", "classroom", "cupcake", "doorbell", "downtown", "eyelid", "fireman", "goldfish", "homework", "lunchbox", "moonlight", "newspaper", "notebook", "playground", "popcorn", "rainbow", "raindrop", "sailboat", "starfish", "toothbrush", "waterfall"] }
        ]
    },
    "Syllable Division Strategies (VC/CV, V/CV)": {
        families: [
            { pattern: "VC/CV (closed)", words: ["basket", "cactus", "candy", "dentist", "dinner", "happen", "kitten", "lesson", "magnet", "napkin", "picnic", "rabbit", "ribbon", "sunset", "supper", "tennis", "trumpet", "tunnel", "until", "winter"] },
            { pattern: "V/CV (open)", words: ["baby", "basic", "begin", "broken", "even", "fever", "final", "frozen", "human", "label", "later", "lazy", "moment", "music", "open", "over", "paper", "pilot", "robot", "silent", "spider", "student", "table", "tiger", "tiny", "total", "unit", "vocal"] }
        ]
    },

    // ===== UFLI FINAL REVIEW =====
    "UFLI Final Cumulative Review": {
        families: [
            { pattern: "CVC/blends", words: ["back", "best", "black", "cat", "clap", "drop", "fast", "grab", "just", "spin", "stop", "trip"] },
            { pattern: "VCe/vowel teams", words: ["bike", "boat", "brain", "cake", "day", "feel", "home", "light", "moon", "rain", "show", "time"] },
            { pattern: "r-controlled/diphthongs", words: ["bark", "bird", "born", "burn", "car", "coin", "cow", "farm", "girl", "house", "joy", "star"] },
            { pattern: "advanced", words: ["action", "bridge", "careful", "city", "enjoy", "judge", "knight", "motion", "quickly", "station", "unhappy", "write"] }
        ]
    }
};
