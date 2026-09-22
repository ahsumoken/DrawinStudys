(function () {
  const KEY = "blok";
  const D = window.BLOK;
  const $ = (id) => document.getElementById(id);

  const DEFAULT = {
    times: { warm: 15, dab: 25, pause: 5, loomis: 15, fun: 25 },
    activeTrack: 0, doneTracks: [], pool: D.TRACKS[0].warmupIds.slice(),
    focusIndex: 0, customFocus: "", sound: true, vib: true,
    sessions: [], lastDay: null, streak: 0, dayWarmup: null, dayWarmupDate: null
  };

  function load() {
    try { return Object.assign(JSON.parse(JSON.stringify(DEFAULT)), JSON.parse(localStorage.getItem(KEY) || "null") || {}); }
    catch { return JSON.parse(JSON.stringify(DEFAULT)); }
  }
  function save() { localStorage.setItem(KEY, JSON.stringify(state)); }
  let state = load();

  function todayISO() {
    const d = new Date(), z = (n) => String(n).padStart(2, "0");
    return d.getFullYear() + "-" + z(d.getMonth() + 1) + "-" + z(d.getDate());
  }
  function yesterdayISO() {
    const d = new Date(); d.setDate(d.getDate() - 1);
    const z = (n) => String(n).padStart(2, "0");
    return d.getFullYear() + "-" + z(d.getMonth() + 1) + "-" + z(d.getDate());
  }
  function clamp(n) { n = Number(n); return Number.isNaN(n) ? 15 : Math.min(40, Math.max(3, Math.round(n))); }
  function focus() {
    if (state.customFocus && state.customFocus.trim()) return { titel: state.customFocus.trim(), uitleg: "Je eigen aandachtspunt." };
    return D.FOCI[state.focusIndex % D.FOCI.length];
  }
  function track() { return D.TRACKS.find((t) => t.id === state.activeTrack) || D.TRACKS[0]; }
  function warmupById(id) { return D.WARMUPS.find((w) => w.id === id); }
  function ensureWarmup() {
    const t = todayISO();
    if (state.dayWarmup && state.dayWarmupDate === t) return state.dayWarmup;
    const pool = state.pool.length ? state.pool : D.TRACKS[0].warmupIds;
    const copy = pool.slice();
    for (let i = copy.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [copy[i], copy[j]] = [copy[j], copy[i]]; }
    const n = Math.min(copy.length, copy.length >= 3 ? 3 : Math.max(2, copy.length));
    state.dayWarmup = { items: copy.slice(0, n) };
    state.dayWarmupDate = t;
    save();
    return state.dayWarmup;
  }

  function show(name) {
    document.querySelectorAll(".view").forEach((v) => v.classList.toggle("on", v.id === "v-" + name));
    document.querySelectorAll("nav.bottom button").forEach((b) => b.classList.toggle("on", b.dataset.v === name));
    if (name === "vandaag") renderToday();
    if (name === "tracks") renderTracks();
    if (name === "pool") renderPool();
    if (name === "bladen") renderBladen();
    if (name === "stand") renderStand();
    if (name === "set") renderSet();
  }

  function renderToday() {
    const f = focus(), tr = track(), w = ensureWarmup();
    $("headerSub").textContent = tr.naam;
    $("focusTitle").textContent = f.titel;
    $("focusUitleg").textContent = f.uitleg;
    $("sessionPreview").innerHTML = [
      "Opwarmen " + state.times.warm + " min",
      "Drawabox " + state.times.dab + " min",
      "Pauze " + state.times.pause + " min",
      "Loomis " + state.times.loomis + " min",
      "Vrij " + state.times.fun + " min"
    ].map((s, i) => "<li>" + (i + 1) + ". " + s + "</li>").join("");
    $("warmupToday").innerHTML = w.items.map((id) => {
      const item = warmupById(id);
      if (!item) return "";
      return '<div class="subcard"><div class="rowline"><b>' + item.naam + '</b><button class="link" data-print="' + item.templateId + '">printblad</button></div><p class="hint">' + item.hoe + "</p></div>";
    }).join("");
    $("dabBlock").innerHTML = hw(tr.dab);
    $("loomisBlock").innerHTML = hw(tr.loomis);
  }
  function hw(h) {
    return "<p class='gold'>" + h.titel + "</p><p>" + h.taak + "</p><p class='hint'>" + h.voorbeeld + "</p><ol class='hint'>" +
      h.stappen.map((s) => "<li>" + s + "</li>").join("") + '</ol><button class="ghost wide" data-print="' + h.templateId + '">Print oefenblad</button>';
  }

  function renderTracks() {
    $("trackList").innerHTML = D.TRACKS.map((t) => {
      const done = state.doneTracks.includes(t.id);
      const unlocked = t.id === 0 || state.doneTracks.includes(t.id - 1) || state.activeTrack >= t.id;
      const cls = "card" + (unlocked ? "" : " dim") + (t.id === state.activeTrack ? " active" : "");
      let btn = "";
      if (unlocked && !done) {
        btn = '<button class="wide" data-act="done" data-id="' + t.id + '">Markeer track af</button>' +
          (t.id !== state.activeTrack ? '<button class="ghost wide" data-act="use" data-id="' + t.id + '">Maak actief</button>' : "");
      } else if (done) btn = '<p class="hint">Afgerond. Warmup zit in de pool.</p>';
      else btn = '<p class="hint">Nog op slot.</p>';
      return '<div class="' + cls + '"><h3>' + t.id + " · " + t.naam + "</h3><p class='hint'>" + t.kort + "</p>" +
        (unlocked ? "<p>" + t.waarom + "</p><p class='hint'><span class='gold'>Drawabox.</span> " + t.dab.taak + "</p><p class='hint'><span class='gold'>Loomis.</span> " + t.loomis.taak + "</p>" : "") + btn + "</div>";
    }).join("");
  }

  function renderPool() {
    $("poolList").innerHTML = state.pool.map((id) => {
      const w = warmupById(id);
      return "<li><b>" + (w ? w.naam : id) + "</b><br><span class='hint'>" + (w ? w.hoe : "") + "</span></li>";
    }).join("");
  }

  function renderBladen() {
    const groepen = ["Warmup", "Dozen", "Kop", "Figuur"];
    $("bladenList").innerHTML = groepen.map((g) => {
      const items = D.TEMPLATES.filter((t) => t.groep === g);
      return "<h3>" + (g === "Warmup" ? "Opwarming" : g) + "</h3>" + items.map((t) =>
        '<button class="cardbtn" data-print="' + t.id + '"><b>' + t.titel + "</b><span class='hint'>" + t.blurb + "</span></button>"
      ).join("");
    }).join("");
  }

  function renderStand() {
    const mins = state.sessions.reduce((a, s) => a + (s.minuten || 0), 0);
    $("stStreak").textContent = state.streak;
    $("stSess").textContent = state.sessions.length;
    $("stMin").textContent = mins;
    $("stTracks").textContent = state.doneTracks.length;
    const logs = state.sessions.slice().reverse().slice(0, 20);
    $("logList").innerHTML = logs.length
      ? logs.map((s) => "<li>" + s.dag + " · track " + s.track + " · " + s.minuten + " min</li>").join("")
      : "<li>Nog geen sessies</li>";
  }

  function renderSet() {
    $("tWarm").value = state.times.warm;
    $("tDab").value = state.times.dab;
    $("tPause").value = state.times.pause;
    $("tLoomis").value = state.times.loomis;
    $("tFun").value = state.times.fun;
    $("customFocus").value = state.customFocus || "";
    $("optSound").checked = !!state.sound;
    $("optVib").checked = !!state.vib;
  }

  function openPrint(id) {
    const meta = D.TEMPLATES.find((t) => t.id === id);
    $("printTitle").textContent = meta ? meta.titel : id;
    $("printHint").textContent = meta ? meta.printHint : "";
    $("printSheet").innerHTML = window.SHEETS.render(id);
    $("printView").classList.add("on");
  }

  document.body.addEventListener("click", (e) => {
    const nav = e.target.closest("nav.bottom button");
    if (nav) { show(nav.dataset.v); return; }
    const pr = e.target.closest("[data-print]");
    if (pr) { openPrint(pr.getAttribute("data-print")); return; }
    const act = e.target.closest("[data-act]");
    if (act) {
      const id = Number(act.dataset.id);
      if (act.dataset.act === "done") {
        const t = D.TRACKS.find((x) => x.id === id);
        if (t) {
          if (!state.doneTracks.includes(id)) state.doneTracks.push(id);
          t.warmupIds.forEach((w) => { if (!state.pool.includes(w)) state.pool.push(w); });
          const next = D.TRACKS.find((x) => x.id === id + 1);
          if (next) state.activeTrack = next.id;
          save(); renderTracks();
        }
      }
      if (act.dataset.act === "use") { state.activeTrack = id; save(); renderTracks(); }
    }
  });

  $("btnRotateFocus").onclick = () => {
    state.customFocus = "";
    state.focusIndex = (state.focusIndex + 1) % D.FOCI.length;
    state.dayWarmup = null;
    save(); renderToday();
  };
  $("btnSaveSet").onclick = () => {
    state.times = {
      warm: clamp($("tWarm").value), dab: clamp($("tDab").value), pause: clamp($("tPause").value),
      loomis: clamp($("tLoomis").value), fun: clamp($("tFun").value)
    };
    state.customFocus = $("customFocus").value.trim();
    state.sound = $("optSound").checked;
    state.vib = $("optVib").checked;
    save();
  };
  $("btnExport").onclick = () => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify(state, null, 2)], { type: "application/json" }));
    a.download = "blok-export.json"; a.click();
  };
  $("btnReset").onclick = () => {
    if (!confirm("Stats wissen? Tracks en pool blijven.")) return;
    state.sessions = []; state.streak = 0; state.lastDay = null; save(); renderStand();
  };
  $("btnPrintBack").onclick = () => $("printView").classList.remove("on");
  $("btnDoPrint").onclick = () => window.print();

  let steps = [], stepIndex = 0, remain = 0, total = 0, ticking = false, interval = null, wakeLock = null;
  function beep() {
    if (!state.sound) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = "sine"; o.frequency.value = 880; g.gain.value = 0.08;
      o.connect(g); g.connect(ctx.destination); o.start();
      setTimeout(() => { o.stop(); ctx.close(); }, 160);
    } catch (e) {}
  }
  function vibrate() { if (state.vib && navigator.vibrate) navigator.vibrate([80, 40, 80]); }
  function fmt(sec) { return String(Math.floor(sec / 60)).padStart(2, "0") + ":" + String(sec % 60).padStart(2, "0"); }
  async function requestWake() { try { if ("wakeLock" in navigator) wakeLock = await navigator.wakeLock.request("screen"); } catch (e) {} }
  function releaseWake() { if (wakeLock) { wakeLock.release().catch(() => {}); wakeLock = null; } }
  function buildSteps() {
    const tr = track(), w = ensureWarmup(), f = focus();
    const names = w.items.map((id) => (warmupById(id) || { naam: id }).naam).join(" · ");
    return [
      { kind: "warm", label: "Opwarmen", name: names, hint: "Let alleen op: " + f.titel + ". " + f.uitleg + " Doe twee of drie oefeningen. Maak ze af.", min: state.times.warm },
      { kind: "dab", label: "Drawabox", name: tr.dab.titel, hint: tr.dab.taak, min: state.times.dab },
      { kind: "pause", label: "Pauze", name: "Weg van het papier", hint: "Kijk ver weg. Schouders los.", min: state.times.pause },
      { kind: "loomis", label: "Loomis", name: tr.loomis.titel, hint: tr.loomis.taak, min: state.times.loomis },
      { kind: "fun", label: "Vrije tekening", name: "Teken wat je wilt", hint: "Geen extra drill.", min: state.times.fun }
    ];
  }
  function paint() {
    const s = steps[stepIndex]; if (!s) return;
    $("tKind").textContent = s.label; $("tName").textContent = s.name; $("tHint").textContent = s.hint;
    $("tClock").textContent = fmt(remain);
    $("tBar").className = "bar" + (s.kind === "fun" ? " fun" : s.kind === "pause" ? " pause" : "");
    $("tBar").querySelector("span").style.width = (total ? ((total - remain) / total) * 100 : 0) + "%";
    $("tDots").innerHTML = steps.map((_, i) => "<i class='" + (i < stepIndex ? "done" : i === stepIndex ? "now" : "") + "'></i>").join("");
    $("btnPause").textContent = ticking ? "Pauze" : "Hervat";
  }
  function begin() { const s = steps[stepIndex]; remain = s.min * 60; total = remain; ticking = true; paint(); clearInterval(interval); interval = setInterval(tick, 1000); }
  function tick() {
    if (!ticking) return;
    remain -= 1;
    if (remain <= 0) { remain = 0; paint(); beep(); vibrate(); next(); return; }
    paint();
  }
  function next() {
    clearInterval(interval);
    if (stepIndex >= steps.length - 1) { finish(); return; }
    stepIndex += 1; begin();
  }
  function finish() {
    ticking = false; clearInterval(interval); releaseWake(); $("timerView").classList.remove("on");
    const mins = steps.reduce((a, s) => a + s.min, 0), day = todayISO();
    state.sessions.push({ dag: day, track: state.activeTrack, minuten: mins });
    if (state.lastDay !== day) state.streak = state.lastDay === yesterdayISO() ? (state.streak || 0) + 1 : 1;
    state.lastDay = day; save(); beep(); vibrate();
  }
  $("btnStart").onclick = () => { steps = buildSteps(); stepIndex = 0; begin(); $("timerView").classList.add("on"); requestWake(); };
  $("btnPause").onclick = () => { ticking = !ticking; if (ticking) { clearInterval(interval); interval = setInterval(tick, 1000); requestWake(); } else releaseWake(); paint(); };
  $("btnSkip").onclick = () => next();
  $("btnStop").onclick = () => { if (!confirm("Stoppen zonder loggen?")) return; ticking = false; clearInterval(interval); releaseWake(); $("timerView").classList.remove("on"); };

  if ("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js").catch(() => {});
  show("vandaag");
})();
