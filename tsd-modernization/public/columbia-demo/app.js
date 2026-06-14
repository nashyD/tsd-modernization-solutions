/* =====================================================================
   IBC Assistant — demo engine
   - Offline RAG: keyword retrieval over the program corpus + grounded,
     cited, extractive answers (works with zero backend / no API key).
   - Optional "live" mode: bring your own Anthropic key (stored only in
     this browser) to have Claude generate the answer from the same
     retrieved passages. Off by default.
   This mirrors how TSD's production RAG behaves: retrieve from the
   client's own documents, then answer ONLY from what was retrieved,
   with citations and safe escalation.
   ===================================================================== */
(function () {
  "use strict";
  const CORPUS = window.IBC_CORPUS || [];
  const SOURCES = [...new Set(CORPUS.map(d => d.source.split("—")[0].trim()))];

  /* ----------------------- retrieval engine ---------------------- */
  const STOP = new Set("the a an is are do you i my of for to and or what how much on in with your me we can it this that at be have does any about please need so when who where which whats im a's our us as if not no my their them they he she his her are's there here will would should could someone something anything somebody everyone really just whens wheres hows".split(" "));
  // Light intent/synonym expansion so everyday phrasing finds the right passage.
  const SYN = {
    curfew: ["inbuilding", "inroom", "9pm", "10pm", "11pm", "midnight", "night", "bed"],
    late: ["tracker", "incident", "30"],
    sick: ["health", "services", "ill", "doctor", "nurse"],
    ill: ["health", "services", "sick"],
    hurt: ["medical", "emergency", "injury", "hospital"],
    injured: ["medical", "emergency", "hospital"],
    bleeding: ["medical", "emergency", "public", "safety", "hospital"],
    bleed: ["medical", "emergency", "hospital"],
    choking: ["medical", "emergency", "public", "safety"],
    unconscious: ["medical", "emergency", "public", "safety"],
    seizure: ["medical", "emergency", "public", "safety"],
    fainted: ["medical", "emergency", "heat", "health"],
    faint: ["heat", "health", "medical"],
    overdose: ["emergency", "intoxicated", "public", "safety"],
    allergic: ["allergy", "allergies", "health"],
    vomiting: ["health", "sick", "services"],
    emergency: ["public", "safety", "911"],
    fired: ["dismissal", "dismissed", "fireable", "terminated"],
    fire: ["dismissal", "dismissed"],
    drunk: ["alcohol", "dismissal", "intoxicated"],
    alcohol: ["dismissal", "behavioral"],
    drugs: ["dismissal", "behavioral"],
    lockout: ["master", "key", "housing", "coordinator"],
    "locked": ["master", "key", "lockout"],
    suicide: ["suicidal", "distress", "wellness", "ideation"],
    suicidal: ["distress", "wellness"],
    depressed: ["distress", "emotional", "wellness"],
    panic: ["distress", "wellness", "emotional", "anxiety"],
    anxious: ["anxiety", "distress", "wellness"],
    anxiety: ["distress", "wellness"],
    crying: ["distress", "emotional", "wellness"],
    homesick: ["distress", "wellness", "emotional"],
    overwhelmed: ["distress", "wellness", "thrive"],
    abuse: ["minors", "protection", "maltreatment", "hotline"],
    leave: ["offcampus", "boundaries", "pass", "guests"],
    pay: ["hr", "payroll", "escalation"],
    payroll: ["hr", "escalation"],
    schedule: ["shifts", "structure", "dates", "session"],
    dates: ["structure", "session", "movein", "moveout"],
    training: ["bcd", "cpr", "aed", "seminar", "group"],
    cpr: ["aed", "training", "group"],
    bcd: ["training", "scenario", "group"],
    program: ["programming", "event", "activity"],
    contact: ["escalation", "leadership", "email"],
    money: ["pcard", "receipt", "budget", "finance"],
    food: ["dining", "ferris", "meals"],
    tired: ["selfcare", "sleep", "burnout"],
    bishop: ["switzer", "group", "scenario"],
    // Spanish aliases — the production model speaks 95+ languages; the offline
    // demo maps a handful of common Spanish terms so multilingual questions work.
    toque: ["curfew"], queda: ["curfew"], hora: ["time", "curfew"], horario: ["schedule", "shifts"],
    cuando: ["when", "dates", "session"], emergencia: ["emergency", "public", "safety"],
    seguridad: ["public", "safety"], enfermo: ["health", "sick"], enferma: ["health", "sick"],
    salud: ["health", "services"], mudanza: ["moveout"], droga: ["drugs", "dismissal"],
    despedido: ["dismissal", "fired"], deberes: ["duty", "rounds"],
  };

  // Light plural stemmer so "rounds"↔"round", "shifts"↔"shift", "keys"↔"key",
  // "dates"↔"date" all match (guards -ss/-us/-is words like "campus", "address").
  function stem(w) {
    if (w.length <= 3) return w;
    if (w.endsWith("ies")) return w.slice(0, -3) + "y";
    if (/(sses|shes|ches|xes)$/.test(w)) return w.slice(0, -2);
    if (w.endsWith("s") && !/(ss|us|is)$/.test(w)) return w.slice(0, -1);
    return w;
  }
  // Lowercase, strip diacritics ("¿cuándo?"→"cuando"), drop stopwords, stem.
  function tokenize(s) {
    const raw = (s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").match(/[\p{L}\p{N}]+/gu)) || [];
    const out = [];
    for (const t of raw) { if (t.length <= 1 || STOP.has(t)) continue; const k = stem(t); if (!STOP.has(k)) out.push(k); }
    return out;
  }
  // Normalize the synonym map to stemmed keys/values so lookups stay consistent.
  for (const key of Object.keys(SYN)) { const sk = stem(key), sv = SYN[key].map(stem); if (sk !== key) delete SYN[key]; SYN[sk] = sv; }
  function expand(tokens) {
    const out = new Set(tokens);
    for (const t of tokens) (SYN[t] || []).forEach(x => out.add(x));
    return out;
  }

  // IDF — rare, specific terms (plagiarism, curfew, hamster) carry far more
  // weight than common ones (report, student, dorm), so the right passage
  // ranks first and off-topic words don't drag in the wrong document.
  const N = CORPUS.length;
  const DF = new Map();
  for (const d of CORPUS)
    for (const t of new Set(tokenize(d.title + " " + d.body + " " + (d.tags || []).join(" "))))
      DF.set(t, (DF.get(t) || 0) + 1);
  function idf(t) { return Math.log((N + 1) / ((DF.get(t) || 0) + 0.5)); }

  function retrieve(query, k = 6) {
    const t0 = performance.now();
    const qTokens = [...new Set(tokenize(query))];
    const qset = expand(qTokens);
    const ql = query.toLowerCase();
    const denom = qTokens.reduce((a, t) => a + idf(t), 0) * 2.2 + 3;
    const scored = CORPUS.map(d => {
      const tt = new Set(tokenize(d.title)), bb = new Set(tokenize(d.body)), gg = (d.tags || []);
      let hits = 0; const matched = new Set();
      for (const t of qset) {
        let w = 0;
        if (tt.has(t)) w = 2.6; else if (bb.has(t)) w = 1;
        if (gg.includes(t)) w = Math.max(w, 2.0);   // exact single-word tag
        if (w > 0) { hits += w * idf(t); matched.add(t); }
      }
      for (const tag of gg) if (tag.length > 4 && ql.includes(tag)) hits += 1.4; // phrase tag
      const raw = hits / denom;
      const score = Math.min(0.985, raw);     // clamped for display/thresholds
      return { doc: d, score, raw, matched: matched.size, hits };
    }).filter(r => r.hits > 0);
    scored.sort((a, b) => b.raw - a.raw);      // sort on the unclamped score so near-ceiling ties resolve correctly
    const took = performance.now() - t0;
    return { results: scored.slice(0, k), ms: took, qTokens };
  }

  /* --------------- offline grounded answer composer -------------- */
  function splitSentences(text) {
    return text.split(/(?<=[.!?])\s+(?=[A-Z(0-9])/).map(s => s.trim()).filter(Boolean);
  }
  function bestSentences(doc, qset, n) {
    const sents = splitSentences(doc.body);
    if (sents.length <= n) return sents;
    const scored = sents.map((s, i) => {
      const toks = tokenize(s);
      let h = 0; for (const t of toks) if (qset.has(t)) h++;
      return { s, h, i };
    });
    const top = scored.filter(x => x.h > 0).sort((a, b) => b.h - a.h).slice(0, n);
    if (!top.length) return sents.slice(0, n);
    return top.sort((a, b) => a.i - b.i).map(x => x.s); // keep original order
  }

  // Queries that should always surface emergency guidance (safety guardrail).
  const SAFETY_RE = /\b(emergenc|911|suicid|self.?harm|hurt|injur|bleed|unconscious|seizure|overdose|abuse|danger|shooter|assault|dying|kill)/i;
  // Tokens too common across the corpus to signal real topical relevance.
  const GENERIC = new Set("student students ra ras intern interns program programs columbia university staff hall building day time campus people".split(" "));

  function docTokens(doc) {
    if (!doc._tok) doc._tok = new Set(tokenize(doc.title + " " + doc.body + " " + (doc.tags || []).join(" ")));
    return doc._tok;
  }
  // Distinct, meaningful query tokens that actually appear in a document
  // (length >= 3 and not generic — so noise like "re" from "they're" doesn't
  // read as topical relevance).
  function hitTokens(doc, qset) {
    const dt = docTokens(doc), out = new Set();
    for (const t of qset) if (t.length >= 3 && !GENERIC.has(t) && dt.has(t)) out.add(t);
    return out;
  }

  function fallbackAns() {
    return {
      text: "I can't find that in the IBC materials I have, so I don't want to guess. For something not covered in the handbook, your best move is to ask your **SRA** first, or email the program office at **ibc@columbia.edu**. If it's urgent or a safety concern, call **Columbia Public Safety at 212-854-5555**.",
      cites: [], unknown: true
    };
  }

  function composeOffline(query, results) {
    const qTokens = [...new Set(tokenize(query))];
    const qset = expand(qTokens);
    const ql = query.toLowerCase().trim();

    if (/^(hi|hey|hello|yo|sup|good (morning|afternoon|evening))\b/.test(ql) && ql.length < 22)
      return { text: "Hi! I'm the IBC Assistant. Ask me anything about the Residential Life Handbook — curfew, shifts and duty, emergencies, reporting, student policies, dates, or who to contact.", cites: [] };
    if (/(what can you|who are you|how (do|does) (you|this)|help)\b/.test(ql) && ql.length < 40)
      return { text: "I answer questions from the IBC's own training materials — the Residential Life Handbook and your training-group rosters — and I always show you the exact passage I'm drawing from. Try asking about curfew times, what to do if a student is late, emergency numbers, the duty-round schedule, move-in/out dates, or your CPR/BCD training group.", cites: [] };

    const strong = results.filter(r => r.score >= 0.1);
    if (!strong.length) return fallbackAns();

    // Honesty gate (IDF coverage): answer only if the top passage covers a
    // real share of the question's *salient* meaning. If the rare, important
    // words (e.g. "wifi", "hamster") matched nothing and only a common word
    // overlapped, fall back to escalation instead of answering confidently-wrong.
    const top = strong[0].doc;
    const cTokens = qTokens.filter(t => t.length >= 3 && !GENERIC.has(t));
    const totalIdf = cTokens.reduce((a, t) => a + idf(t), 0) || 1;
    const dt = docTokens(top);
    // A term counts as covered if it — or one of its synonyms (e.g. "toque"→
    // "curfew", "fired"→"dismissal") — appears in the passage, so cross-language
    // and paraphrased questions are credited, not just literal word matches.
    const covered = t => dt.has(t) || (SYN[t] || []).some(s => dt.has(s));
    const matchedIdf = cTokens.filter(covered).reduce((a, t) => a + idf(t), 0);
    // Answer when the top passage is either a strong overall match OR covers a
    // real share of the salient terms. Fall back only when both are weak — that
    // is the genuinely-out-of-scope case, where guessing would be dishonest.
    if (strong[0].score < 0.3 && matchedIdf / totalIdf < 0.42) return fallbackAns();

    const lead = bestSentences(top, qset, top.body.split(" ").length < 55 ? 5 : 3);
    let text = lead.join(" ");

    // Pull one complementary sentence from the next-best passage — when it is
    // nearly as relevant as the top one (relative to it) AND shares a real
    // original-question term. Relative scoring keeps genuinely co-relevant
    // passages (e.g. curfew-times + the late-curfew procedure) while dropping
    // weak homograph matches (e.g. "duty rounds" vs "duty to report").
    const qOrig = new Set(qTokens);
    const second = strong.slice(1).find(r =>
      r.raw >= strong[0].raw * 0.55 && hitTokens(r.doc, qOrig).size >= 1);
    const cites = [top];
    if (second) {
      const s2 = bestSentences(second.doc, qset, 1);
      if (s2[0] && !text.includes(s2[0])) { text += "\n\n" + s2[0]; cites.push(second.doc); }
    }

    // Safety banner is driven by the QUESTION, not the document — so an
    // emergency question always surfaces the call-first guidance, but a routine
    // question that happens to retrieve a passage mentioning "danger" does not.
    let safety = "";
    if (SAFETY_RE.test(ql)) {
      safety = "⚠️ **If anyone is in immediate danger, call Columbia Public Safety at 212-854-5555 (or 911) first.**\n\n";
    }
    return { text: safety + text, cites };
  }

  /* --------------------- optional live (Claude) ------------------ */
  function getKey() { try { return localStorage.getItem("ibc_anthropic_key") || ""; } catch { return ""; } }
  function setKey(v) { try { v ? localStorage.setItem("ibc_anthropic_key", v) : localStorage.removeItem("ibc_anthropic_key"); } catch {} }

  async function composeLive(query, results) {
    const key = getKey();
    const context = results.map((r, i) => `[Source ${i + 1}] ${r.doc.title} (${r.doc.source})\n${r.doc.body}`).join("\n\n");
    const system =
      "You are the IBC Assistant for Columbia University's Internship in Building Community (Pre-College Programs). " +
      "Answer the staff member's question using ONLY the numbered sources provided. Be concise, warm, and practical. " +
      "Quote exact figures (times, phone numbers, ratios, dates) when present. " +
      "If the sources do not contain the answer, say you don't have it and tell them to ask their SRA or email ibc@columbia.edu — never invent policy. " +
      "For any emergency, safety, medical, or self-harm topic, lead with calling Columbia Public Safety at 212-854-5555 or 911. " +
      "Do not give clinical, legal, or Title IX adjudication advice — defer to the documented reporting protocol and the right office.";
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 600,
        system,
        messages: [{ role: "user", content: `Sources:\n${context}\n\nQuestion: ${query}` }],
      }),
    });
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      throw new Error(`Anthropic API ${res.status}: ${t.slice(0, 140)}`);
    }
    const data = await res.json();
    const text = (data.content || []).filter(c => c.type === "text").map(c => c.text).join("").trim();
    const usage = data.usage || {};
    return { text, cites: results.slice(0, 3).map(r => r.doc), tokens: (usage.input_tokens || 0) + (usage.output_tokens || 0) };
  }

  /* ------------------------------ UI ----------------------------- */
  const $ = s => document.querySelector(s);
  const msgs = $("#msgs"), hood = $("#hoodBody"), ta = $("#ta"), send = $("#send");
  const STARTERS = [
    "What time is curfew on Friday?",
    "A student is 40 minutes late for curfew — what do I do?",
    "What's the emergency number for Public Safety?",
    "When are the duty rounds?",
    "A student tells me they're feeling really depressed.",
    "When is Session B move-out?",
    "When is my CPR training?",
    "¿A qué hora es el toque de queda?",
  ];

  function esc(s) { return s.replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c])); }
  function mdInline(s) {
    return esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  }
  function renderText(t) {
    return t.split(/\n\n+/).map(p => `<p>${mdInline(p).replace(/\n/g, "<br>")}</p>`).join("");
  }

  function addUser(text) {
    const row = document.createElement("div");
    row.className = "row user";
    row.innerHTML = `<div class="av user">You</div><div class="bubble">${renderText(text)}</div>`;
    msgs.appendChild(row); scroll();
  }
  function addTyping() {
    const row = document.createElement("div");
    row.className = "row"; row.id = "typing";
    row.innerHTML = `<div class="av bot">IBC</div><div class="bubble"><span class="typing"><i></i><i></i><i></i></span></div>`;
    msgs.appendChild(row); scroll();
  }
  function citeCard(doc, n) {
    return `<button class="cite" data-id="${doc.id}">
      <span class="nch">${n}</span>
      <span class="c-body"><span class="c-title">${esc(doc.title)}</span>
      <span class="c-src">${esc(doc.source)}</span><br><span class="c-cat">${esc(doc.category)}</span></span></button>`;
  }
  function addBot(ans, mode) {
    const row = document.createElement("div");
    row.className = "row";
    let cites = "";
    if (ans.cites && ans.cites.length) {
      cites = `<div class="cites">${ans.cites.map((d, i) => citeCard(d, i + 1)).join("")}</div>`;
    }
    const tag = ans.unknown
      ? `<span class="disclaim">↪ Honest fallback — the assistant won't answer what isn't in the documents.</span>`
      : `<span class="disclaim">🔎 Grounded in the IBC documents above · ${mode === "live" ? "generated by Claude" : "demo answer engine"}</span>`;
    row.innerHTML = `<div class="av bot">IBC</div><div class="bubble">${renderText(ans.text)}${cites}${tag}</div>`;
    msgs.appendChild(row); scroll();
  }
  function scroll() { msgs.scrollTop = msgs.scrollHeight; }

  function renderHood(query, retr, citedIds, mode, totalMs, tokens) {
    const cset = new Set(citedIds);
    const ctxTokens = tokens || Math.round(retr.results.reduce((a, r) => a + r.doc.body.length, 0) / 4);
    const method = mode === "live" ? "keyword retrieval → Claude (Sonnet 4.6)" : "keyword retrieval → grounded extract";
    let html = `
      <div class="stats">
        <div class="stat"><div class="k">Retrieved</div><div class="v">${retr.results.length} <small>/ ${CORPUS.length}</small></div></div>
        <div class="stat"><div class="k">Latency</div><div class="v">${Math.max(1, Math.round(totalMs))}<small> ms</small></div></div>
        <div class="stat"><div class="k">Context</div><div class="v">${ctxTokens}<small> tok</small></div></div>
      </div>
      <div class="pipeline"><span>Question</span><span class="arrow">→</span><span><b>Embed / match</b></span><span class="arrow">→</span><span>Top ${retr.results.length} passages</span><span class="arrow">→</span><span><b>${mode === "live" ? "Claude" : "Grounded answer"}</b></span><span class="arrow">→</span><span>Cited reply</span></div>
      <p class="hood-label">Retrieved passages · method: ${method}</p>
      <div class="retr">`;
    if (!retr.results.length) {
      html += `</div><div class="hood-empty">No passage matched — the assistant will decline rather than guess.</div>`;
    } else {
      for (const r of retr.results) {
        const used = cset.has(r.doc.id);
        html += `<div class="rdoc ${used ? "cited" : ""}">
          <div class="rtop"><span class="rtitle">${esc(r.doc.title)}</span>${used ? '<span class="rused">USED</span>' : ""}</div>
          <div class="rsnip">${esc(r.doc.body)}</div>
          <div class="scorebar"><i style="width:${Math.round(r.score * 100)}%"></i></div>
          <div class="rscore">relevance ${r.score.toFixed(3)} · ${r.doc.category}</div></div>`;
      }
      html += `</div>`;
    }
    hood.innerHTML = html;
  }

  let busy = false;
  async function ask(query) {
    query = query.trim();
    if (!query || busy) return;
    busy = true; send.disabled = true;
    addUser(query);
    ta.value = ""; autosize();
    addTyping();

    const retr = retrieve(query, 6);
    const mode = getKey() ? "live" : "offline";
    const t0 = performance.now();
    let ans, err = null;
    try {
      ans = mode === "live" ? await composeLive(query, retr.results) : composeOffline(query, retr.results);
    } catch (e) {
      err = e; ans = composeOffline(query, retr.results);
      ans.text = `*(Live AI unavailable — showing the grounded demo answer. ${esc(String(e.message || e))})*\n\n` + ans.text;
    }
    const totalMs = (mode === "live" && !err) ? (performance.now() - t0) : retr.ms;
    // small delay so the typing indicator reads naturally in offline mode
    if (mode === "offline") await new Promise(r => setTimeout(r, 280));
    document.getElementById("typing")?.remove();
    addBot(ans, err ? "offline" : mode);
    renderHood(query, retr, (ans.cites || []).map(d => d.id), err ? "offline" : mode, totalMs, ans.tokens);
    busy = false; send.disabled = false; ta.focus();
  }

  /* source viewer + settings modal */
  function openModal(html, title) { $("#modalTitle").textContent = title || "Source"; $("#modalBody").innerHTML = html; $("#modalBg").classList.add("open"); }
  function closeModal() { $("#modalBg").classList.remove("open"); }
  document.addEventListener("click", e => {
    const cite = e.target.closest(".cite");
    if (cite) {
      const d = CORPUS.find(x => x.id === cite.dataset.id);
      if (d) openModal(`<label>${esc(d.category)}</label><h3 style="font-family:var(--serif);margin:.2em 0 .4em">${esc(d.title)}</h3>
        <div class="note">Source: ${esc(d.source)}</div><div class="srcfull">${esc(d.body)}</div>
        <p class="note">In production this opens the exact location in the original document (handbook page, Canvas file, or form).</p>`);
    }
    if (e.target.id === "modalBg" || e.target.closest(".x")) closeModal();
  });

  function openSettings() {
    const k = getKey();
    openModal(`
      <label>Optional — connect live AI (your own Anthropic API key)</label>
      <input id="keyInput" type="password" placeholder="sk-ant-..." value="${k ? "••••••••••••••••" : ""}">
      <p class="note">Status: <span class="mode-tag ${k ? "live" : "offline"}">${k ? "LIVE — Claude is answering" : "OFFLINE — grounded demo engine"}</span></p>
      <p class="note">Your key is stored <b>only in this browser</b> (localStorage), is sent directly to Anthropic, and never touches any TSD server. Leave this blank to run the fully self-contained demo — it works with no key at all. In a real deployment the key lives safely on the server, never in the browser.</p>
      <button class="btn-primary" id="saveKey">Save</button>
      <button class="btn-ghost" id="clearKey">Use offline demo</button>`, "Live AI (optional)");
    $("#saveKey").onclick = () => { const v = $("#keyInput").value.trim(); if (v && !v.startsWith("•")) setKey(v); closeModal(); refreshMode(); };
    $("#clearKey").onclick = () => { setKey(""); closeModal(); refreshMode(); };
  }
  function refreshMode() {
    const live = !!getKey();
    $("#modeTag").textContent = live ? "Live · Claude" : "Demo engine";
    $("#modeTag").className = "mode-tag " + (live ? "live" : "offline");
  }

  /* theme (dark spatial glass ⇄ light frosted) */
  function setupTheme() {
    const root = document.documentElement, btn = $("#themeBtn");
    let t; try { t = localStorage.getItem("ibc_theme"); } catch {}
    if (!t) t = (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) ? "light" : "dark";
    const apply = theme => { root.setAttribute("data-theme", theme); if (btn) btn.textContent = theme === "dark" ? "☀" : "☾"; };
    apply(t);
    btn?.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      try { localStorage.setItem("ibc_theme", next); } catch {}
      apply(next);
    });
  }

  /* pointer-tracking sheen on glass cards (no-op without a hover pointer) */
  function setupSheen() {
    if (!(window.matchMedia && window.matchMedia("(hover: hover)").matches)) return;
    const SEL = ".frame, .cite, .rdoc, .stat";
    document.addEventListener("pointermove", e => {
      const el = e.target.closest(SEL); if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100) + "%");
      el.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100) + "%");
      el.style.setProperty("--sheen-o", "1");
    }, { passive: true });
    document.addEventListener("pointerout", e => {
      const el = e.target.closest(SEL); if (!el) return;
      if (!e.relatedTarget || !el.contains(e.relatedTarget)) el.style.setProperty("--sheen-o", "0");
    }, { passive: true });
  }

  /* boot */
  function autosize() { ta.style.height = "auto"; ta.style.height = Math.min(130, ta.scrollHeight) + "px"; }
  function boot() {
    $("#srcCount").textContent = `${CORPUS.length} passages · ${SOURCES.length} source documents`;
    $("#chips").innerHTML = STARTERS.map(s => `<button class="chip">${esc(s)}</button>`).join("");
    $("#chips").addEventListener("click", e => { const c = e.target.closest(".chip"); if (c) ask(c.textContent); });
    send.addEventListener("click", () => ask(ta.value));
    ta.addEventListener("input", autosize);
    ta.addEventListener("keydown", e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); ask(ta.value); } });
    $("#settingsBtn").addEventListener("click", openSettings);
    // greeting
    addBot({ text: "👋 Welcome — I'm the **IBC Assistant**, a demo trained on Columbia's Internship in Building Community materials. Ask me anything an RA might need on the floor, and I'll answer from the handbook and show you the exact passage. Try a question below.", cites: [] }, "offline");
    hood.innerHTML = `<div class="hood-empty">Ask a question to watch the retrieval step — the assistant pulls the most relevant passages from the IBC documents, then answers only from those.</div>`;
    refreshMode();
    setupTheme();
    setupSheen();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
