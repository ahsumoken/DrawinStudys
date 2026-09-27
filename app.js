(function () {
  const KEY = "blok";
  const D = window.BLOK;
  const $ = (id) => document.getElementById(id);

  const DEFAULT = {
    times: { warm: 15, dab: 25, pause: 5, loomis: 15, fun: 25 },
    activeTrack: 0, doneTracks: [], pool: D.TRACKS[0].warmupIds.slice(),
    focusIndex: 0, customFocus: "", sound: true, vib: true,
    sessions: [], lastDay: null, streak: 0, dayWarmup: null, dayWarmupDate: null,
    inkDone: [], hatchDone: [], inkPace: "dag"
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
    const pool = state.pool.length ? state.pool : D.TRACKS[0].warmupIds;
    const items = pool.slice(0, Math.min(pool.length, 3));
    if (!state.dayWarmup || state.dayWarmupDate !== t || !state.dayWarmup.items || state.dayWarmup.items[0] !== items[0]) {
      state.dayWarmup = { items: items };
      state.dayWarmupDate = t;
      save();
    }
    return state.dayWarmup;
  }

  function show(name) {
    document.querySelectorAll(".view").forEach((v) => v.classList.toggle("on", v.id === "v-" + name));
    document.querySelectorAll("nav.bottom button").forEach((b) => b.classList.toggle("on", b.dataset.v === name));
    if (name === "vandaag") renderToday();
    if (name === "tracks") renderTracks();
    if (name === "pool") renderPool();
    if (name === "bladen") renderBladen();
    if (name === "inkt") renderInkt();
    if (name === "stand") renderStand();
    if (name === "set") renderSet();
  }

  function renderToday() {
    const f = focus(), tr = track(), w = ensureWarmup();
    const first = warmupById(w.items[0]) || { naam: tr.naam, hoe: tr.kort, templateId: tr.dab.templateId };
    $("headerSub").textContent = "";
    $("dayTitle").textContent = first.naam;
    $("dayLine").textContent = first.hoe;
    $("btnFirstSheet").setAttribute("data-print", first.templateId);
    $("warmHead").textContent = "Ook in de " + state.times.warm + " min";
    $("dabHead").textContent = "Dozen · " + state.times.dab + " min";
    $("loomHead").textContent = "Kop · " + state.times.loomis + " min";
    $("afterLine").textContent = state.times.pause + " min niks, daarna " + state.times.fun + " min wat je zelf wilt.";
    $("focusTitle").textContent = f.titel;
    $("focusUitleg").textContent = f.uitleg;
    $("warmupToday").innerHTML = w.items.slice(1).map((id) => {
      const item = warmupById(id);
      if (!item) return "";
      return '<div class="subcard"><div class="rowline"><b>' + item.naam + '</b><button class="link" data-print="' + item.templateId + '">blad</button></div><p class="hint">' + item.hoe + "</p></div>";
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

  function renderInkt() {
    const HATCH = [
      ["1", "Eén richting", "Trek evenwijdige penlijnen. Zelfde afstand. Dat is je lichtste toon. Niet harder drukken."],
      ["2", "Kruis erover", "Zelfde lijnen, schuin eroverheen. Dat kruis is cross-hatching."],
      ["3", "Derde laag alleen in het donker", "Nog een richting, alleen waar het echt donker moet. De rest laat je met rust."],
      ["4", "Dichter = donkerder", "Donker maak je met meer lijnen, dichter op elkaar. Niet met een vette streep."],
      ["5", "Lijnen volgen de vorm", "Op een bal buigen ze mee. Op een doos blijft elke kant recht. Geen plat rooster over alles."],
      ["6", "Stop op de rand", "Elke lijn stopt op de omtrek. Niet eroverheen, niet in de achtergrond."],
      ["7", "Eén voorwerp", "Bol, cilinder of doos. Alleen pen, alleen deze arcering. Geen kleur, geen vegen."]
    ];
    const MONTHS = [
      ["Januari", ["Sneeuw","Handschoen","Thee","Lamp","Sleutel","Uil","Brug","IJs","Brief","Kaars","Laars","Ster","Raam","Soep","Muts","Trein","Boek","Schaats","Deur","Kom","Tak","Maan","Sjaal","Fles","Klok","Nest","Steen","Vos","Haard","Want","Bel"]],
      ["Februari", ["Hart","Roos","Lint","Vogel","Veer","Ring","Theepot","Knoop","Zaad","Wolk","Paraplu","Fiets","Poort","Pen","Inktpot","Spiegel","Masker","Kroon","Zwaard","Schild","Boot","Vuur","Envelop","Kopje","Stoel","Doos","Schaduw","Zegel"]],
      ["Maart", ["Knop","Regendruppel","Kikker","Lam","Tulp","Wind","Vlieger","Modder","Worm","Plas","Schep","Tuin","Hek","Emmer","Gieter","Zon","Pad","Haas","Bloesem","Bij","Mand","Schoffel","Laars","Ei","Blaadje","Prikker","Vogelhuis","Bruggetje","Steen","Windwijzer","Zaailing"]],
      ["April", ["Ei","Bloesem","Bij","Regenjas","Plas","Kikkerdril","Nest","Paraplu","Tulp","Lammetje","Gieter","Hek","Mand","Zonnestraal","Wolkbreuk","Modderpoot","Tak","Knop","Vogel","Draad","Schommel","Poort","Kruiwagen","Zaadje","Regenpijp","Bloembol","Schep","Laars","Wind","Eerste blad"]],
      ["Mei", ["Paardenbloem","Bij","Fiets","Picknick","Mand","Zon","Wolk","Boot","Brug","Sleutelbloem","Vlinder","Nest","Tak","Emmer","Hoed","Deur","Raam","Tuinbank","Gieter","Schelp","Vogel","Lint","Kaars","Fles","Kom","Steen","Pad","Hond","Poes","Ballon","Vlieger"]],
      ["Juni", ["Aardbei","IJsje","Zon","Boot","Golf","Schelp","Handdoek","Emmer","Zwemband","Parasol","Fiets","Brug","Picknickkleed","Meloen","Glas","Citroen","Bij","Bloem","Hoed","Sandaal","Sleutel","Deur","Raam","Vogel","Net","Vlot","Vuur","Ster","Maan","Kaars"]],
      ["Juli", ["IJs","Zee","Golf","Zandkasteel","Schelp","Krab","Vis","Boot","Zeil","Vuurtoren","Parasol","Watermeloen","Zonnebril","Handdoek","Emmer","Schep","Zwemband","Meeuw","Rots","Steiger","Net","Anker","Kompas","Fles","Glas","Citroen","Ster","Kampvuur","Tent","Slaapzak","Mus"]],
      ["Augustus", ["Perzik","Maïs","Fietspad","Brug","Meer","Kikker","Libelle","Boerderij","Hooibaal","Tractor","Emmer","Zonnebloem","Bij","Wesp","Appelboom","Ladder","Raam","Deur","Sleutel","Hoed","Laars","Schep","Nest","Vogel","Wind","Wolk","Onweer","Bliksem","Paddenstoel","Bes","Vuur"]],
      ["September", ["Schooltas","Potlood","Liniaal","Blad","Paddenstoel","Eikel","Kastanje","Trui","Sjaal","Paraplu","Fiets","Brug","Mist","Lantaarn","Deur","Raam","Sleutel","Boek","Kopje","Thee","Kaars","Spin","Web","Vogel","Tak","Appel","Peer","Mand","Hek","Laars"]],
      ["Oktober", ["Apple — Appel","Relic — Relikwie","Miniature — Miniatuur","Cactus — Cactus","Smack — Klap","Ogre — Oger","Panic — Paniek","Stinky — Stinkt","Ram — Ram","Mystical — Mystiek","Rescue — Redding","Toss — Gooien","Flimsy — Gammel","Lady — Dame","Hooray — Hoera","Gangly — Sprieterig","Contraption — Apparaat","Flightless — Kan niet vliegen","Confused — In de war","Lounge — Loungen","Hero — Held","Beacon — Baken","Dapper — Sjakie","Bake — Bakken","Fracture — Breuk","Zip — Rits","Dumb — Dom","Trophy — Trofee","Tusk — Slagtand","Cookie — Koekje","Flex — Spierbal"]],
      ["November", ["Mist","Lantaarn","Blad","Modder","Kraai","Tak","Kaars","Sjaal","Trui","Paraplu","Deur","Sleutel","Boek","Kopje","Soep","Haard","Steen","Brug","Raam","Uil","Vos","Paddenstoel","Web","Spin","Laars","Want","Muts","Fles","Klok","Brief"]],
      ["December", ["Kaars","Ster","Klok","Sneeuw","Want","Muts","Sjaal","Bel","Pakje","Lint","Sok","Haard","Kopje","Koekje","Slee","Rendier","Dennenappel","Tak","Raam","Deur","Sleutel","Boek","Lamp","IJs","Vogel","Nest","Vos","Maan","Brief","Ster","Vuist"]]
    ];
    const now = new Date();
    if (state.inkMonth == null) state.inkMonth = now.getMonth();
    const mi = ((state.inkMonth % 12) + 12) % 12;
    const year = 2026;
    const days = new Date(year, mi + 1, 0).getDate();
    const words = MONTHS[mi][1].slice(0, days);
    if (!state.inkMap) state.inkMap = {};
    const key = year + "-" + String(mi + 1).padStart(2, "0");
    if (mi === 9 && state.inkDone && state.inkDone.length && !state.inkMap[key]) state.inkMap[key] = state.inkDone.slice();
    const done = new Set(state.inkMap[key] || []);
    const hd = new Set(state.hatchDone || []);
    const pace = state.inkPace || "dag";
    const isThisMonth = now.getFullYear() === year && now.getMonth() === mi;
    const todayN = isThisMonth ? now.getDate() : 0;
    const word = todayN ? words[todayN - 1] : "";
    const official = mi === 9;
    const head = todayN
      ? "<p class='gold'>Vandaag " + todayN + " " + MONTHS[mi][0].toLowerCase() + ": " + word + "</p>"
      : "<p class='hint'>Kies een dag. Eén tekening in inkt.</p>";
    const onPace = (n) => pace === "dag" || (pace === "om" ? n % 2 === 1 : [1, 8, 15, 22, 29].indexOf(n) >= 0);
    $("inktRoot").innerHTML =
      "<div class='card'><h3>Pen en inkt: arceren</h3><p class='hint'>Pen, kruisende lijnen, geen vegen. Zeven stappen. Vink af als je hem gedaan hebt.</p>" +
      HATCH.map((h) => "<div class='subcard'><div class='rowline'><b>" + h[0] + ". " + h[1] + "</b><button class='link' data-hatch='" + h[0] + "'>" + (hd.has(h[0]) ? "gedaan" : "afvinken") + "</button></div><p class='hint'>" + h[2] + "</p></div>").join("") +
      "<button class='ghost wide' data-print='hatch'>Print oefenblad</button></div>" +
      "<div class='card'><h3>" + (official ? "Inktober 2026" : MONTHS[mi][0] + " — inkt") + "</h3>" +
      "<p class='hint'>" + (official
        ? "Officiële woorden van Inktober. Eén tekening in inkt. Potlood eronder mag. Deel hem als je wilt, met #inktober en #inktober2026."
        : "Zelfde afspraak als Inktober, de rest van het jaar: één inkttekening op de dag. Dit zijn woorden voor " + MONTHS[mi][0].toLowerCase() + ", niet de officiële oktoberlijst.") + "</p>" +
      "<div style='display:flex;flex-wrap:wrap;gap:6px;margin-top:10px'>" +
      MONTHS.map((m, i) => "<button class='" + (i === mi ? "" : "ghost") + "' data-month='" + i + "' style='min-height:36px;padding:8px 10px;font-size:13px'>" + m[0].slice(0, 3) + "</button>").join("") +
      "</div>" + head +
      "<div class='row' style='margin-top:8px'>" +
      ["dag","om","week"].map((p) => "<button class='" + (pace === p ? "" : "ghost") + "' data-pace='" + p + "'>" + (p === "dag" ? "Elke dag" : p === "om" ? "Om de dag" : "1× per week") + "</button>").join("") +
      "</div><p class='hint' style='margin-top:10px'>" + done.size + " van " + days + " af.</p>" +
      words.map((w, i) => {
        const n = i + 1, isDone = done.has(n), isNow = n === todayN, suggested = onPace(n);
        return "<button class='inkday" + (isNow ? " on" : "") + (isDone ? " done" : "") + "' data-inkday='" + n + "'><b>" + n + "</b><span>" + w + "<br><span class='hint'>" + (isDone ? "gedaan" : suggested ? "op jouw tempo" : "extra") + "</span></span></button>";
      }).join("") +
      "</div>";
    $("headerSub").textContent = "Inkt";
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
    const extra = id === "hatch" ? { titel: "Arceren met pen", printHint: "Voorbeeld links. Zelf de bol, cilinder en doos arceren." } : null;
    $("printTitle").textContent = extra ? extra.titel : (meta ? meta.titel : id);
    $("printHint").textContent = extra ? extra.printHint : (meta ? meta.printHint : "");
    $("printSheet").innerHTML = window.SHEETS.render(id);
    $("printView").classList.add("on");
  }

  document.body.addEventListener("click", (e) => {
    const nav = e.target.closest("nav.bottom button");
    if (nav) { show(nav.dataset.v); return; }
    const pr = e.target.closest("[data-print]");
    if (pr) { openPrint(pr.getAttribute("data-print")); return; }
    const hd = e.target.closest("[data-hatch]");
    if (hd) {
      const id = hd.getAttribute("data-hatch");
      state.hatchDone = state.hatchDone || [];
      const i = state.hatchDone.indexOf(id);
      if (i >= 0) state.hatchDone.splice(i, 1); else state.hatchDone.push(id);
      save(); renderInkt(); return;
    }
    const pace = e.target.closest("[data-pace]");
    if (pace) { state.inkPace = pace.getAttribute("data-pace"); save(); renderInkt(); return; }
    const mon = e.target.closest("[data-month]");
    if (mon) { state.inkMonth = Number(mon.getAttribute("data-month")); save(); renderInkt(); return; }
    const day = e.target.closest("[data-inkday]");
    if (day) {
      const n = Number(day.getAttribute("data-inkday"));
      const mi = state.inkMonth == null ? new Date().getMonth() : state.inkMonth;
      const key = "2026-" + String(mi + 1).padStart(2, "0");
      if (!state.inkMap) state.inkMap = {};
      const list = state.inkMap[key] ? state.inkMap[key].slice() : [];
      const i = list.indexOf(n);
      if (i >= 0) list.splice(i, 1); else list.push(n);
      state.inkMap[key] = list;
      if (mi === 9) state.inkDone = list.slice();
      save(); renderInkt(); return;
    }
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

  let steps = [], stepIndex = 0, remain = 0, total = 0, ticking = false, interval = null, wakeLock = null, sessionSec = 0;
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
    $("tSession").textContent = fmt(sessionSec);
    $("tBar").className = "bar" + (s.kind === "fun" ? " fun" : s.kind === "pause" ? " pause" : "");
    $("tBar").querySelector("span").style.width = (total ? ((total - remain) / total) * 100 : 0) + "%";
    $("tDots").innerHTML = steps.map((_, i) => "<i class='" + (i < stepIndex ? "done" : i === stepIndex ? "now" : "") + "'></i>").join("");
    $("btnPause").textContent = ticking ? "Pauze" : "Hervat";
  }
  function begin() { const s = steps[stepIndex]; remain = s.min * 60; total = remain; ticking = true; paint(); clearInterval(interval); interval = setInterval(tick, 1000); }
  function tick() {
    if (!ticking) return;
    sessionSec += 1;
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
  $("btnStart").onclick = () => { steps = buildSteps(); stepIndex = 0; sessionSec = 0; begin(); $("timerView").classList.add("on"); requestWake(); };
  $("btnPause").onclick = () => { ticking = !ticking; if (ticking) { clearInterval(interval); interval = setInterval(tick, 1000); requestWake(); } else releaseWake(); paint(); };
  $("btnSkip").onclick = () => next();
  $("btnStop").onclick = () => { if (!confirm("Stoppen zonder loggen?")) return; ticking = false; clearInterval(interval); releaseWake(); $("timerView").classList.remove("on"); };

  if ("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js").catch(() => {});
  show("vandaag");
})();
