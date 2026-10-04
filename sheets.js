(function (g) {
  const ink = "#1a1a1a", faint = "#c8c4bc", mid = "#8a8680";
  function frame(title, hint, inner) {
    return `<svg viewBox="0 0 210 297" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;background:#fff">
      <rect width="210" height="297" fill="#fff"/>
      <text x="12" y="12" font-family="Georgia,serif" font-size="7" fill="${ink}">BLOK | drawingstudys</text>
      <text x="12" y="22" font-family="Georgia,serif" font-size="11" fill="${ink}">${title}</text>
      <text x="12" y="30" font-family="sans-serif" font-size="4.2" fill="${mid}">${hint}</text>
      <line x1="12" y1="33" x2="198" y2="33" stroke="${faint}" stroke-width="0.3"/>
      ${inner}
      <text x="12" y="292" font-family="sans-serif" font-size="3.6" fill="${mid}">Niet gummen. Eén lijn per poging. Print op A4, 100% schaal.</text>
    </svg>`;
  }
  function superimposed() {
    let inner = "";
    for (let i = 0; i < 14; i++) {
      const y = 42 + i * 17;
      inner += `<circle cx="18" cy="${y}" r="1.1" fill="${ink}"/><circle cx="192" cy="${y}" r="1.1" fill="${ink}"/>
        <line x1="20" y1="${y}" x2="190" y2="${y}" stroke="${faint}" stroke-width="0.15" stroke-dasharray="1 2"/>`;
    }
    return frame("Lijnen over elkaar", "Begin op de linker stip, stop op de rechter. Trek 8 keer dezelfde lijn.", inner);
  }
  function ghosted() {
    let seed = 7, inner = "";
    const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed % 1000) / 1000; };
    for (let i = 0; i < 28; i++) {
      const x1 = 16 + rnd() * 70, y1 = 42 + rnd() * 240;
      const x2 = Math.min(196, x1 + 30 + rnd() * 70), y2 = Math.max(40, Math.min(285, y1 + (rnd() - 0.5) * 50));
      inner += `<circle cx="${x1}" cy="${y1}" r="0.9" fill="${ink}"/><circle cx="${x2}" cy="${y2}" r="0.9" fill="${ink}"/>`;
    }
    return frame("Ghosted lijnen", "Ghost in de lucht, daarna één lijn. Niet bijwerken.", inner);
  }
  function planes(cross) {
    let inner = "";
    for (let r = 0; r < 5; r++) for (let c = 0; c < 3; c++) {
      const x = 14 + c * 64, y = 40 + r * 48, w = 56, h = 40;
      inner += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${ink}" stroke-width="0.35"/>`;
      if (cross) inner += `<line x1="${x}" y1="${y}" x2="${x+w}" y2="${y+h}" stroke="${faint}" stroke-width="0.25"/>
        <line x1="${x+w}" y1="${y}" x2="${x}" y2="${y+h}" stroke="${faint}" stroke-width="0.25"/>
        <line x1="${x+w/2}" y1="${y}" x2="${x+w/2}" y2="${y+h}" stroke="${faint}" stroke-width="0.2"/>
        <line x1="${x}" y1="${y+h/2}" x2="${x+w}" y2="${y+h/2}" stroke="${faint}" stroke-width="0.2"/>`;
    }
    return frame(cross ? "Ellips in het vlak" : "Vlakken",
      cross ? "Eén ellips per vlak, alle vier de zijden raken." : "Zet zelf kruis en diagonalen.", inner);
  }
  function tableEllipses() {
    let y = 40, inner = "";
    [12, 18, 26].forEach((h) => {
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) inner += `<rect x="${14+c*48}" y="${y}" width="46" height="${h}" fill="none" stroke="${ink}" stroke-width="0.3"/>`;
        y += h + 2;
      }
      y += 6;
    });
    return frame("Tabel met ellipsen", "2–3 ellipsen per vak, randen raken.", inner);
  }
  function funnels() {
    const fs = [
      { x: 40, top: 22, bot: 10, y: 42 }, { x: 105, top: 18, bot: 8, y: 42 }, { x: 170, top: 26, bot: 7, y: 42 },
      { x: 40, top: 16, bot: 16, y: 165 }, { x: 105, top: 24, bot: 9, y: 165 }, { x: 170, top: 14, bot: 20, y: 165 }
    ];
    let inner = "";
    fs.forEach((f) => {
      const y1 = f.y + 110;
      inner += `<line x1="${f.x}" y1="${f.y}" x2="${f.x}" y2="${y1}" stroke="${mid}" stroke-width="0.25" stroke-dasharray="1.2 1.2"/>
        <path d="M${f.x-f.top} ${f.y} Q${f.x-(f.top+f.bot)/2-4} ${(f.y+y1)/2} ${f.x-f.bot} ${y1}" fill="none" stroke="${ink}" stroke-width="0.35"/>
        <path d="M${f.x+f.top} ${f.y} Q${f.x+(f.top+f.bot)/2+4} ${(f.y+y1)/2} ${f.x+f.bot} ${y1}" fill="none" stroke="${ink}" stroke-width="0.35"/>`;
    });
    return frame("Trechters", "Ellipsen haaks op de as. Dichterbij ronder.", inner);
  }
  function boxesY() {
    let seed = 13, inner = "";
    const rnd = () => { seed = (seed * 48271) % 2147483647; return (seed % 1000) / 1000; };
    for (let r = 0; r < 5; r++) for (let c = 0; c < 3; c++) {
      const x = 36 + c * 62 + rnd() * 6, y = 52 + r * 46 + rnd() * 6;
      const a = -50 - rnd() * 40, b = 20 + rnd() * 40, cdeg = 110 + rnd() * 50, len = 14;
      const p = (d) => [x + Math.cos(d * Math.PI / 180) * len, y + Math.sin(d * Math.PI / 180) * len];
      const A = p(a), B = p(b), C = p(cdeg);
      inner += `<line x1="${x}" y1="${y}" x2="${A[0]}" y2="${A[1]}" stroke="${ink}" stroke-width="0.45"/>
        <line x1="${x}" y1="${y}" x2="${B[0]}" y2="${B[1]}" stroke="${ink}" stroke-width="0.45"/>
        <line x1="${x}" y1="${y}" x2="${C[0]}" y2="${C[1]}" stroke="${ink}" stroke-width="0.45"/>
        <circle cx="${x}" cy="${y}" r="0.7" fill="${ink}"/>`;
    }
    return frame("Dozen — Y-methode", "Elke Y is een hoek. Maak er een doos van.", inner);
  }
  function boxesGrid() {
    const vp = { x: 105, y: 48 };
    const fronts = [
      [20,70,28,22],[22,130,22,30],[18,200,32,18],[160,75,26,24],[166,140,24,20],[150,205,34,28],[78,160,36,16],[70,220,20,26]
    ];
    let inner = `<line x1="12" y1="${vp.y}" x2="198" y2="${vp.y}" stroke="${mid}" stroke-width="0.3"/>
      <path d="M${vp.x-3} ${vp.y} L${vp.x+3} ${vp.y} M${vp.x} ${vp.y-3} L${vp.x} ${vp.y+3}" stroke="${ink}" stroke-width="0.6"/>`;
    fronts.forEach(([x,y,w,h]) => { inner += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${ink}" stroke-width="0.4"/>`; });
    return frame("Dozen — 1 verdwijnpunt", "Dieptelijnen naar het kruis.", inner);
  }
  function cylBoxes() {
    let inner = "";
    for (let i = 0; i < 8; i++) {
      const x = 20 + (i % 2) * 95, y = 42 + Math.floor(i / 2) * 60;
      inner += `<path d="M${x} ${y+12} L${x+40} ${y} L${x+70} ${y+10} L${x+30} ${y+22} Z M${x} ${y+12} L${x} ${y+40} L${x+30} ${y+50} L${x+30} ${y+22} M${x+70} ${y+10} L${x+70} ${y+38} L${x+30} ${y+50}" fill="none" stroke="${faint}" stroke-width="0.35"/>`;
    }
    return frame("Cilinders in dozen", "As, dan ellipsen op de kapjes.", inner);
  }
  function intersections() {
    let inner = "";
    for (let i = 0; i < 6; i++) {
      const x = 14 + (i % 2) * 96, y = 42 + Math.floor(i / 2) * 80;
      inner += `<rect x="${x}" y="${y}" width="88" height="72" fill="none" stroke="${faint}" stroke-width="0.3"/>`;
    }
    return frame("Snijvormen", "Twee volumes per vak. Teken de snijlijn.", inner);
  }
  function arrows() {
    const paths = ["M20 60 C60 20 90 110 140 50 S190 40 196 70","M24 130 C70 170 110 90 160 140 S190 170 196 150","M20 210 C50 180 80 250 130 200 S180 180 196 220","M20 260 C80 280 120 230 170 260"];
    return frame("Pijlen in de ruimte", "Bouw een lint om de as. Dikker naar je toe.", paths.map((d) => `<path d="${d}" fill="none" stroke="${mid}" stroke-width="0.35" stroke-dasharray="1.5 1.5"/>`).join(""));
  }
  function sausages() {
    const axes = [[24,70,90,50],[120,46,186,80],[30,130,70,190],[110,140,190,130],[24,230,100,250],[130,210,180,270]];
    return frame("Worstvormen", "Ellipsen haaks op de as, dan verbinden.", axes.map((a) => `<line x1="${a[0]}" y1="${a[1]}" x2="${a[2]}" y2="${a[3]}" stroke="${mid}" stroke-width="0.35" stroke-dasharray="1.4 1.4"/>`).join(""));
  }
  function loomisBall() {
    let inner = "";
    for (let i = 0; i < 12; i++) {
      const x = 28 + (i % 3) * 62, y = 58 + Math.floor(i / 3) * 56;
      inner += `<circle cx="${x}" cy="${y}" r="22" fill="none" stroke="${ink}" stroke-width="0.35"/><line x1="${x}" y1="${y-22}" x2="${x}" y2="${y+22}" stroke="${faint}" stroke-width="0.2" stroke-dasharray="1 1"/>`;
    }
    return frame("Loomis-bal", "Draai-ellips, middenlijn, kaakvlak. Geen ogen.", inner);
  }
  function loomisGrid() {
    const labels = ["profiel L","3/4 L","vooraan","3/4 R","profiel R","van onder"];
    let inner = "";
    labels.forEach((label, i) => {
      const x = 40 + (i % 3) * 62, y = 80 + Math.floor(i / 3) * 100;
      inner += `<circle cx="${x}" cy="${y}" r="28" fill="none" stroke="${ink}" stroke-width="0.35"/><text x="${x}" y="${y+42}" text-anchor="middle" font-size="4" fill="${mid}" font-family="sans-serif">${label}</text>`;
    });
    return frame("Kopdraaiingen", "Zes standen. Alleen constructie.", inner);
  }
  function empty(n) {
    let inner = "";
    const cols = 2;
    for (let i = 0; i < n; i++) {
      const x = 16 + (i % cols) * 92;
      const y = 40 + Math.floor(i / cols) * 62;
      inner += `<rect x="${x}" y="${y}" width="84" height="54" fill="none" stroke="${faint}" stroke-width="0.3"/>`;
    }
    return inner;
  }
  function asaro() { return frame("Gezichts-vlakken", "Hak grote platte vlakken. Geen features.", empty(8)); }
  function manikin() { return frame("Manikin-poses", "Ribbenkorf, bekken, ledematen. 2 min per pose.", empty(6)); }
  function landmarks() { return frame("Landmerken", "Alleen botpunten.", empty(6)); }
  function plants() { return frame("Plant-masses", "Pot, stengel, blad. Zelf tekenen.", empty(6)); }
  function insects() { return frame("Insect-masses", "Kop, borst, achterlijf. Zelf tekenen.", empty(8)); }
  function texture() {
    let inner = "";
    for (let i = 0; i < 3; i++) {
      const y = 42 + i * 80;
      inner += `<rect x="14" y="${y}" width="182" height="70" fill="none" stroke="${ink}" stroke-width="0.35"/>
        <line x1="70" y1="${y}" x2="70" y2="${y+70}" stroke="${faint}" stroke-width="0.2"/>
        <line x1="140" y1="${y}" x2="140" y2="${y+70}" stroke="${faint}" stroke-width="0.2"/>
        <text x="20" y="${y+10}" font-size="3.5" fill="${mid}" font-family="sans-serif">dichtbij</text>
        <text x="160" y="${y+10}" font-size="3.5" fill="${mid}" font-family="sans-serif">verder</text>`;
    }
    return frame("Textuur-overgang", "Links compact, rechts open.", inner);
  }
  function values() {
    return frame("Drie tonen", "Licht, midden, schaduw. Rechts één onderwerp.",
      `<rect x="14" y="42" width="56" height="70" fill="#f2f2f2" stroke="${ink}" stroke-width="0.3"/>
       <rect x="76" y="42" width="56" height="70" fill="#9a9a9a" stroke="${ink}" stroke-width="0.3"/>
       <rect x="138" y="42" width="56" height="70" fill="#2a2a2a" stroke="${ink}" stroke-width="0.3"/>
       <rect x="14" y="130" width="182" height="150" fill="none" stroke="${ink}" stroke-width="0.35"/>`);
  }
  function folds() {
    let inner = "";
    for (let i = 0; i < 3; i++) {
      const y = 70 + i * 70;
      inner += `<circle cx="40" cy="${y}" r="1.6" fill="${ink}"/><circle cx="170" cy="${y+10}" r="1.6" fill="${ink}"/>
        <path d="M40 ${y} Q105 ${y+40} 170 ${y+10}" fill="none" stroke="${faint}" stroke-width="0.3" stroke-dasharray="1.5 1.5"/>`;
    }
    return frame("Plooigroepen", "Twee ophangpunten. Grote dalen eerst.", inner);
  }
  function hatch() {
    function lines(x, y, w, h, gap, angle) {
      let s = "", rad = angle * Math.PI / 180, dx = Math.cos(rad), dy = Math.sin(rad);
      const span = w + h;
      for (let i = -span; i < span; i += gap) {
        const x0 = x + w / 2 + (-dy) * i, y0 = y + h / 2 + dx * i;
        s += `<line x1="${x0 - dx * span}" y1="${y0 - dy * span}" x2="${x0 + dx * span}" y2="${y0 + dy * span}" stroke="${ink}" stroke-width="0.25"/>`;
      }
      return `<clipPath id="c${x}${y}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath><g clip-path="url(#c${x}${y})">${s}</g>`;
    }
    const boxes = [
      [16, 42, 40, 36, 4, 0],
      [62, 42, 40, 36, 2.4, 0],
      [108, 42, 40, 36, 3.2, 35],
      [154, 42, 40, 36, 2.2, 35]
    ];
    let inner = boxes.map((b) => `<rect x="${b[0]}" y="${b[1]}" width="${b[2]}" height="${b[3]}" fill="none" stroke="${mid}" stroke-width="0.3"/>` + lines(b[0], b[1], b[2], b[3], b[4], b[5])).join("");
    inner += lines(108, 42, 40, 36, 3.2, -40) + lines(154, 42, 40, 36, 2.2, -50) + lines(154, 42, 40, 36, 2.2, 90);
    inner += `<text x="16" y="90" font-size="3.4" fill="${mid}" font-family="sans-serif">licht</text><text x="154" y="90" font-size="3.4" fill="${mid}" font-family="sans-serif">donker</text>`;
    inner += `<circle cx="55" cy="160" r="36" fill="none" stroke="${ink}" stroke-width="0.4"/>
      <ellipse cx="140" cy="175" rx="28" ry="48" fill="none" stroke="${ink}" stroke-width="0.4"/>
      <rect x="20" y="220" width="50" height="40" fill="none" stroke="${ink}" stroke-width="0.4"/>`;
    return frame("Arceren met pen", "Links voorbeeld. Rechts zelf: bol, cilinder, doos. Lijnen, geen vegen.", inner);
  }
  const MAP = {
    superimposed, ghosted, planes: () => planes(false), "table-ellipses": tableEllipses,
    "ellipses-planes": () => planes(true), funnels, "boxes-y": boxesY, "boxes-grid": boxesGrid,
    "cyl-boxes": cylBoxes, intersections, arrows, sausages, "loomis-ball": loomisBall,
    "loomis-grid": loomisGrid, asaro, manikin, landmarks, plants, insects, texture, values, folds, hatch
  };
  g.SHEETS = { render(id) { return (MAP[id] || superimposed)(); } };
})(window);
