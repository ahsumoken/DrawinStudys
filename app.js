(function () {
  const KEY = "blok";
  const D = window.BLOK;
  const $ = (id) => document.getElementById(id);

  const DEFAULT = {
    times: { warm: 15, dab: 25, pause: 5, loomis: 15, fun: 25 },
    activeTrack: 0, doneTracks: [], pool: D.TRACKS[0].warmupIds.slice(),
    focusIndex: 0, customFocus: "", sound: true, vib: true,
    sessions: [], lastDay: null, streak: 0, dayWarmup: null, dayWarmupDate: null,
    inkDone: [], hatchDone: [], inkPace: "dag", doneLessons: [], catDone: [], catLook: null, ghToken: "", gistId: ""
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
    if (name === "kat") renderKat();
    if (name === "stand") renderStand();
    if (name === "set") renderSet();
  }

  function renderToday() {
    const f = focus(), tr = track(), w = ensureWarmup();
    const first = warmupById(w.items[0]) || { naam: tr.naam, hoe: tr.kort, templateId: tr.dab.templateId };
    $("headerSub").textContent = "";
    $("dayTitle").textContent = first.naam;
    $("dayLine").textContent = first.hoe;
    const dayKey = "w:" + (first.id || ("t" + tr.id));
    $("dayCheck").setAttribute("data-check", dayKey);
    $("dayCheck").classList.toggle("on", isDone(dayKey));
    $("dayBody").hidden = isDone(dayKey);
    const dayLes = $("dayLes");
    const dayLesRow = $("dayLesRow");
    if (first.les) {
      dayLes.href = first.les;
      dayLesRow.hidden = false;
    } else {
      dayLes.removeAttribute("href");
      dayLesRow.hidden = true;
    }
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
      const on = isDone("w:" + item.id);
      return '<div class="subcard' + (on ? " collapsed" : "") + '"><div class="rowline"><button type="button" class="check' + (on ? " on" : "") + '" data-check="w:' + item.id + '">✓</button><b>' + item.naam + '</b>' + lesA(item.les) + '<button class="link" data-print="' + item.templateId + '">blad</button></div><div class="lesson-body"><p class="hint">' + item.hoe + "</p></div></div>";
    }).join("");
    $("dabBlock").innerHTML = hw(tr.dab, "dab:" + tr.id);
    $("loomisBlock").innerHTML = hw(tr.loomis, "loom:" + tr.id);
  }
  function lesA(les) {
    if (!les) return "";
    const list = Array.isArray(les) ? les : [{ t: "les", u: les }];
    return list.map((x) => '<a class="les" href="' + x.u + '" target="_blank" rel="noopener">' + x.t + "</a>").join("");
  }
  function isDone(id) { return (state.doneLessons || []).includes(id); }
  function hw(h, key) {
    const on = isDone(key);
    return '<div class="' + (on ? "collapsed" : "") + '"><p class="gold rowline"><span>' + h.titel + lesA(h.les) + '</span><button type="button" class="check' + (on ? " on" : "") + '" data-check="' + key + '">✓</button></p><div class="lesson-body"><p>' + h.taak + "</p><p class='hint'>" + h.voorbeeld + "</p><ol class='hint'>" +
      h.stappen.map((s) => "<li>" + s + "</li>").join("") + '</ol><button class="ghost wide" data-print="' + h.templateId + '">Print oefenblad</button></div></div>';
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

  function renderKat() {
    const days = D.CATS || [];
    const done = state.catDone || [];
    const next = days.find((d) => done.indexOf(d.id) < 0) || days[days.length - 1];
    const cur = days.find((d) => d.id === state.catLook) || next;
    const n = done.filter((id) => days.some((d) => d.id === id)).length;
    const list = days.map((d) => {
      const on = done.indexOf(d.id) >= 0;
      return '<button type="button" class="inkday' + (d.id === cur.id ? " on" : "") + (on ? " done" : "") + '" data-cat-look="' + d.id + '"><b>' + d.id + '</b><span>' + d.titel + '</span></button>';
    }).join("");
    $("katRoot").innerHTML =
      '<p class="hint">Eerst ogen en neus in potlood. Daarna één kat in kleur, met de naam eronder. ' + n + " van " + days.length + ".</p>" +
      '<div class="card"><p class="gold">' + cur.fase + " · dag " + cur.id + '</p><h2 style="font-size:36px;line-height:1.05;margin:6px 0">' + cur.titel + '</h2><p>' + cur.taak + '</p>' +
      '<button type="button" class="wide" data-cat="' + cur.id + '">' + (done.indexOf(cur.id) >= 0 ? "Afgevinkt" : "Klaar") + "</button></div>" +
      '<details style="margin-top:12px"><summary class="hint" style="cursor:pointer;min-height:44px">Alle dagen</summary>' + list + "</details>";
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
    $("ghStatus").textContent = state.ghToken ? "Gekoppeld." : "Niet gekoppeld.";
  }

  function ghHeaders() {
    return { Authorization: "Bearer " + state.ghToken, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" };
  }
  async function pullGist(create) {
    if (!state.ghToken) return false;
    const headers = ghHeaders();
    try {
      if (!state.gistId) {
        const listRes = await fetch("https://api.github.com/gists?per_page=100", { headers });
        if (!listRes.ok) return false;
        const list = await listRes.json();
        const found = Array.isArray(list) && list.find((g) => g.description === "BLOK afgevinkt");
        if (found) state.gistId = found.id;
        else if (create) {
          const made = await fetch("https://api.github.com/gists", {
            method: "POST",
            headers: Object.assign({ "Content-Type": "application/json" }, headers),
            body: JSON.stringify({
              description: "BLOK afgevinkt",
              public: false,
              files: { "blok.json": { content: JSON.stringify({ doneLessons: state.doneLessons || [], catDone: state.catDone || [] }) } }
            })
          });
          if (!made.ok) return false;
          const madeJson = await made.json();
          state.gistId = madeJson.id;
          save();
          return true;
        } else return false;
      }
      const res = await fetch("https://api.github.com/gists/" + state.gistId, { headers });
      if (!res.ok) return false;
      const g = await res.json();
      const file = g.files && g.files["blok.json"];
      if (file && file.content) {
        const data = JSON.parse(file.content);
        if (Array.isArray(data.doneLessons)) state.doneLessons = data.doneLessons;
        if (Array.isArray(data.catDone)) state.catDone = data.catDone;
      }
      save();
      return true;
    } catch (e) { return false; }
  }
  function pushGist() {
    if (!state.ghToken || !state.gistId) return;
    fetch("https://api.github.com/gists/" + state.gistId, {
      method: "PATCH",
      headers: Object.assign({ "Content-Type": "application/json" }, ghHeaders()),
      body: JSON.stringify({ files: { "blok.json": { content: JSON.stringify({ doneLessons: state.doneLessons || [], catDone: state.catDone || [] }) } } })
    }).catch(() => {});
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
    const look = e.target.closest("[data-cat-look]");
    if (look) { state.catLook = Number(look.getAttribute("data-cat-look")); renderKat(); return; }
    const cat = e.target.closest("[data-cat]");
    if (cat) {
      const id = Number(cat.getAttribute("data-cat"));
      state.catDone = state.catDone || [];
      const i = state.catDone.indexOf(id);
      if (i >= 0) state.catDone.splice(i, 1);
      else { state.catDone.push(id); state.catLook = null; }
      save();
      renderKat();
      pushGist();
      return;
    }
    const chk = e.target.closest("[data-check]");
    if (chk) {
      const id = chk.getAttribute("data-check");
      state.doneLessons = state.doneLessons || [];
      const i = state.doneLessons.indexOf(id);
      if (i >= 0) state.doneLessons.splice(i, 1); else state.doneLessons.push(id);
      save();
      renderToday();
      pushGist();
      return;
    }
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
  $("btnGh").onclick = async () => {
    const token = $("ghToken").value.trim();
    if (!token) return;
    state.ghToken = token;
    state.gistId = "";
    $("ghToken").value = "";
    $("ghStatus").textContent = "…";
    const ok = await pullGist(true);
    if (!ok) { state.ghToken = ""; state.gistId = ""; }
    save();
    $("ghStatus").textContent = ok ? "Gekoppeld." : "Token werkt niet.";
    renderToday();
  };
  $("btnExport").onclick = () => {
    const copy = Object.assign({}, state);
    delete copy.ghToken;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify(copy, null, 2)], { type: "application/json" }));
    a.download = "blok-export.json"; a.click();
  };
  $("btnReset").onclick = () => {
    if (!confirm("Stats en afgevinkte lessen wissen? Tracks en pool blijven.")) return;
    state.sessions = []; state.streak = 0; state.lastDay = null; state.doneLessons = []; state.catDone = []; state.catLook = null; save(); pushGist(); renderStand(); renderToday();
  };
  $("btnPrintBack").onclick = () => $("printView").classList.remove("on");
  $("btnDoPrint").onclick = () => window.print();

  let sessionSec = 0, ticking = false, interval = null, wakeLock = null;
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
  function paintSession() {
    const on = ticking || sessionSec > 0;
    $("tSession").textContent = fmt(sessionSec);
    $("btnPause").textContent = ticking ? "Pauze" : "Verder";
    $("sessionBar").classList.toggle("on", on);
    document.body.classList.toggle("session-on", on);
  }
  $("btnStart").onclick = () => {
    if (ticking) return;
    ticking = true;
    paintSession();
    clearInterval(interval);
    interval = setInterval(() => { if (!ticking) return; sessionSec += 1; paintSession(); }, 1000);
    requestWake();
  };
  $("btnPause").onclick = () => {
    ticking = !ticking;
    if (ticking) { clearInterval(interval); interval = setInterval(() => { if (!ticking) return; sessionSec += 1; paintSession(); }, 1000); requestWake(); }
    else releaseWake();
    paintSession();
  };
  $("btnStop").onclick = () => {
    if (!confirm("Sessie stoppen?")) return;
    const ran = sessionSec;
    ticking = false;
    clearInterval(interval);
    releaseWake();
    if (ran > 0) {
      const day = todayISO();
      state.sessions.push({ dag: day, track: state.activeTrack, minuten: Math.max(1, Math.round(ran / 60)) });
      if (state.lastDay !== day) state.streak = state.lastDay === yesterdayISO() ? (state.streak || 0) + 1 : 1;
      state.lastDay = day;
      save();
      beep();
      vibrate();
    }
    sessionSec = 0;
    paintSession();
  };

  if ("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js").catch(() => {});
  pullGist(false).then(() => { renderToday(); });
  show("vandaag");
})();
