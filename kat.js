"use strict";
window.KAT = (function () {
  function svg(inner) {
    return '<svg viewBox="0 0 360 480" xmlns="http://www.w3.org/2000/svg">' +
      '<rect width="360" height="480" fill="#f3efe6"/>' + inner + "</svg>";
  }
  function P(d, w, o) {
    return '<path d="' + d + '" fill="none" stroke="#1c1c1c" stroke-width="' + (w || 3) +
      '" stroke-linecap="round" stroke-linejoin="round" opacity="' + (o == null ? 0.92 : o) + '"/>';
  }
  function E(x, y, rx, ry, rot) {
    return '<ellipse cx="' + x + '" cy="' + y + '" rx="' + rx + '" ry="' + ry + '"' +
      (rot ? ' transform="rotate(' + rot + ' ' + x + ' ' + y + ')"' : "") +
      ' fill="none" stroke="#1c1c1c" stroke-width="1.6"/>';
  }
  function eye(x, y, s, kind) {
    var h = kind === "spleet" ? 2.2 : kind === "half" ? 5 : kind === "rond" ? 11 : kind === "smal" ? 4 : 8;
    var w = kind === "rond" ? 11 : 13;
    return '<ellipse cx="' + x + '" cy="' + y + '" rx="' + (w * s) + '" ry="' + (h * s) + '" fill="#1c1c1c"/>' +
      '<circle cx="' + (x + 3 * s) + '" cy="' + (y - 2 * s) + '" r="' + (2.2 * s) + '" fill="#f3efe6"/>';
  }
  function ears(x, y, s, back) {
    if (back) {
      return P("M" + (x - 28 * s) + " " + (y - 6 * s) + " l" + (-18 * s) + " " + (6 * s), 2.4) +
        P("M" + (x + 28 * s) + " " + (y - 6 * s) + " l" + (18 * s) + " " + (6 * s), 2.4);
    }
    return P("M" + (x - 22 * s) + " " + (y - 8 * s) + " l" + (-8 * s) + " " + (-28 * s) + " l" + (16 * s) + " " + (22 * s), 2.2) +
      P("M" + (x + 22 * s) + " " + (y - 8 * s) + " l" + (8 * s) + " " + (-28 * s) + " l" + (-16 * s) + " " + (22 * s), 2.2);
  }
  function face(x, y, s, mood) {
    var lid = "open", mouth = "M" + (x - 6 * s) + " " + (y + 22 * s) + " q" + (6 * s) + " " + (6 * s) + " " + (12 * s) + " 0";
    var back = false, dy = 0;
    if (mood === "tevreden") { lid = "half"; mouth = "M" + (x - 8 * s) + " " + (y + 24 * s) + " q" + (8 * s) + " " + (8 * s) + " " + (16 * s) + " 0"; }
    if (mood === "boos") { lid = "smal"; back = true; mouth = "M" + (x - 8 * s) + " " + (y + 26 * s) + " l" + (16 * s) + " 0"; }
    if (mood === "bang") { lid = "rond"; back = true; }
    if (mood === "nieuw") { lid = "open"; }
    if (mood === "slaap") { lid = "spleet"; dy = 8 * s; }
    var y2 = y + dy;
    var fur = P("M" + (x - 40 * s) + " " + y2 + " q 20 " + (-30 * s) + " 40 0 q 20 " + (30 * s) + " 40 0", 7 * s, 0.35) +
      P("M" + (x - 36 * s) + " " + (y2 + 8 * s) + " q 18 " + (-18 * s) + " 36 0 q 16 " + (22 * s) + " 34 2", 5 * s, 0.28);
    var eyes = eye(x - 14 * s, y2 - 2 * s, s, lid) + eye(x + 14 * s, y2 - 2 * s, s, mood === "nieuw" ? "rond" : lid);
    var nose = '<polygon points="' + x + "," + (y2 + 12 * s) + " " + (x - 5 * s) + "," + (y2 + 18 * s) + " " + (x + 5 * s) + "," + (y2 + 18 * s) + '" fill="#1c1c1c"/>';
    return fur + ears(x, y2, s, back) + eyes + nose + P(mouth, 1.8);
  }
  function repeat(n, fn) {
    var o = "", i;
    for (i = 0; i < n; i++) o += fn(i);
    return o;
  }
  function pose(x, y, kind, mood) {
    mood = mood || "neutraal";
    if (kind === "zit") {
      return P("M" + x + " " + (y + 70) + " q -10 -40 10 -70 q 30 -20 20 10", 16, 0.85) +
        P("M" + (x + 8) + " " + (y + 20) + " q 8 30 4 50", 8, 0.7) +
        face(x + 6, y - 10, 0.55, mood) +
        P("M" + (x + 20) + " " + (y + 40) + " q 40 -30 70 -10", 6, 0.6);
    }
    if (kind === "loaf") {
      return P("M" + (x - 50) + " " + (y + 30) + " q 40 -28 120 -8 q 40 10 20 18 q -60 20 -140 0 z", 1, 0) +
        '<path d="M' + (x - 50) + " " + (y + 30) + ' q 40 -28 120 -8 q 40 10 20 18 q -60 20 -140 0 z" fill="#1c1c1c" opacity="0.78"/>' +
        face(x + 70, y - 8, 0.5, "tevreden") +
        P("M" + (x - 40) + " " + (y + 36) + " q 20 16 10 8", 5);
    }
    if (kind === "rek") {
      return P("M" + (x - 70) + " " + (y + 40) + " q 40 -50 90 -20 q 50 10 80 36", 18, 0.88) +
        P("M" + (x - 60) + " " + (y + 55) + " l 30 20 M" + (x + 70) + " " + (y + 50) + " l 10 28", 7) +
        P("M" + (x + 90) + " " + (y + 10) + " q 20 -40 10 -70 q 16 20 8 50", 10, 0.75) +
        face(x - 55, y + 10, 0.48, "tevreden");
    }
    if (kind === "hurk") {
      return P("M" + (x - 40) + " " + (y + 40) + " q 20 -46 70 -30 q 10 20 -10 36", 16, 0.86) +
        P("M" + (x + 20) + " " + (y + 30) + " q 16 10 8 28", 8) +
        face(x + 36, y - 8, 0.5, "nieuw") +
        P("M" + (x - 30) + " " + (y + 20) + " q -20 -10 -10 20", 6);
    }
    if (kind === "rug") {
      return P("M" + x + " " + y + " q -30 20 -10 50 q 40 10 70 -10 q 10 -30 -20 -40", 16, 0.8) +
        P("M" + (x - 10) + " " + (y + 10) + " l -16 -20 M" + (x + 20) + " " + (y + 6) + " l 10 -24 M" + (x + 40) + " " + (y + 20) + " l 18 -16", 5) +
        face(x + 10, y + 28, 0.42, "tevreden");
    }
    return P("M" + (x - 60) + " " + (y + 20) + " q 40 -30 80 -8 q 40 16 70 4", 14, 0.85) +
      P("M" + (x - 40) + " " + (y + 28) + " l 6 26 M" + (x + 10) + " " + (y + 24) + " l -4 30 M" + (x + 50) + " " + (y + 22) + " l 8 28", 6) +
      face(x + 78, y - 6, 0.45, mood) +
      P("M" + (x - 55) + " " + (y + 16) + " q -20 10 -10 24", 5);
  }
  function sheet(n) {
    var g = "", i, x, y;
    if (n === 1) {
      g = repeat(20, function (i) {
        x = 40 + (i % 5) * 64; y = 50 + Math.floor(i / 5) * 70;
        return i < 10 ? E(x, y, 22, 22) : E(x, y, 28, 16, (i * 17) % 40 - 20);
      });
    } else if (n === 2) {
      g = repeat(8, function (i) {
        x = 70 + (i % 4) * 75; y = 90 + Math.floor(i / 4) * 180;
        return '<defs><radialGradient id="b' + i + '" cx="35%" cy="40%"><stop offset="0%" stop-color="#f7f4ee"/><stop offset="70%" stop-color="#8d8982"/><stop offset="100%" stop-color="#2a2a2a"/></radialGradient></defs>' +
          '<circle cx="' + x + '" cy="' + y + '" r="32" fill="url(#b' + i + ')"/>';
      });
    } else if (n === 3) {
      g = repeat(10, function (i) {
        x = 70 + (i % 2) * 160; y = 50 + Math.floor(i / 2) * 85;
        return E(x, y, 46, 26) + E(x + 52, y - 8, 18, 18);
      });
    } else if (n === 4) {
      g = repeat(12, function (i) {
        x = 60 + (i % 3) * 110; y = 70 + Math.floor(i / 3) * 110;
        return E(x, y, 28, 26) + ears(x, y - 8, 0.7 + (i % 3) * 0.15, i % 5 === 0);
      });
    } else if (n === 5) {
      g = repeat(8, function (i) {
        x = 90 + (i % 2) * 160; y = 60 + Math.floor(i / 2) * 105;
        return E(x, y, 36, 34) + E(x, y + 16, 16, 12);
      });
    } else if (n === 6) {
      g = repeat(8, function (i) {
        x = 90 + (i % 2) * 160; y = 70 + Math.floor(i / 2) * 100;
        return face(x, y, 0.85, "neutraal");
      });
    } else if (n === 7) {
      var kinds = ["open", "half", "spleet", "rond", "smal", "open", "half", "rond"];
      g = repeat(8, function (i) {
        x = 90 + (i % 2) * 160; y = 60 + Math.floor(i / 2) * 105;
        return face(x, y, 0.8, kinds[i] === "rond" ? "bang" : kinds[i] === "spleet" ? "slaap" : kinds[i] === "smal" ? "boos" : kinds[i] === "half" ? "tevreden" : "neutraal");
      });
    } else if (n === 8) {
      g = repeat(6, function (i) {
        y = 50 + i * 70; var tilt = (i % 2 ? 8 : -6);
        return '<g transform="rotate(' + tilt + ' 180 ' + y + ')">' + eye(120, y, 1, "open") + eye(210, y, 1, "open") + P("M70 " + y + " L290 " + y, 1, 0.35) + "</g>";
      });
    } else if (n >= 9 && n <= 14) {
      var moods = ["neutraal", "tevreden", "boos", "bang", "nieuw", "slaap"];
      g = face(180, 210, 2.1, moods[n - 9]);
    } else if (n === 15) {
      var ms = ["neutraal", "tevreden", "boos", "bang", "nieuw", "slaap"];
      g = repeat(6, function (i) {
        return face(70 + (i % 3) * 110, 110 + Math.floor(i / 3) * 200, 0.85, ms[i]);
      });
    } else if (n === 16) {
      g = repeat(15, function (i) {
        y = 36 + i * 30;
        return P("M40 " + y + " q " + (40 + (i % 5) * 12) + " " + ((i % 2 ? -18 : 16)) + " 260 4", 2.2, 0.8);
      });
    } else if (n === 17) {
      g = repeat(8, function (i) {
        x = 50; y = 40 + i * 55;
        return P("M" + x + " " + (y + 10) + " q 80 -16 200 6", 2) + E(x + 70, y, 36, 18) + E(x + 150, y + 4, 22, 14);
      });
    } else if (n === 18) {
      g = repeat(10, function (i) {
        x = 40 + (i % 2) * 170; y = 40 + Math.floor(i / 2) * 88;
        return E(x + 20, y + 16, 16, 22, -20) + E(x + 48, y + 36, 14, 18, 15) + E(x + 70, y + 52, 12, 8);
      });
    } else if (n === 19) {
      g = repeat(8, function (i) {
        x = 70 + (i % 4) * 75; y = 100 + Math.floor(i / 4) * 200;
        return E(x, y, 28, 22) + E(x - 16, y - 8, 7, 8) + E(x - 4, y - 14, 7, 8) + E(x + 10, y - 14, 7, 8) + E(x + 20, y - 6, 7, 8);
      });
    } else if (n === 20) {
      g = repeat(6, function (i) {
        x = 80; y = 50 + i * 70;
        return P("M" + x + " " + y + " q 30 10 50 0 l 16 8 q -10 10 -20 6 l -8 10 q -16 4 -28 -6 z", 2) +
          E(x + 18, y + 16, 8, 5);
      });
    } else if (n === 21) {
      g = repeat(10, function (i) {
        y = 40 + i * 44;
        return P("M40 " + y + " q " + (50 + i * 6) + " " + (i % 2 ? -30 : 24) + " 240 " + (i % 3 * 8), 6 - i * 0.3, 0.85);
      });
    } else if (n === 22) {
      g = repeat(6, function (i) {
        x = 70 + (i % 2) * 150; y = 70 + Math.floor(i / 2) * 140;
        return E(x, y, 26, 24) + ears(x, y, 0.6, false) + P("M" + x + " " + (y + 24) + " q 6 16 0 28", 8, 0.55) + E(x, y + 62, 34, 22);
      });
    } else if (n === 23) g = pose(80, 80, "zit") + pose(200, 200, "zit") + pose(90, 320, "zit");
    else if (n === 24) g = pose(80, 70, "loaf") + pose(60, 210, "loaf") + pose(70, 340, "loaf");
    else if (n === 25) g = pose(180, 80, "rek") + pose(180, 230, "rek") + pose(180, 370, "rek");
    else if (n === 26) g = pose(120, 70, "hurk") + pose(140, 220, "hurk") + pose(100, 360, "hurk");
    else if (n === 27) g = pose(140, 60, "rug") + pose(150, 210, "rug") + pose(130, 350, "rug");
    else if (n === 28) g = pose(160, 70, "loop") + pose(160, 220, "loop") + pose(160, 360, "loop");
    else if (n === 29) {
      g = pose(100, 80, "zit") + '<g opacity="0.9">' + E(230, 200, 30, 28) + E(250, 250, 40, 26) + E(210, 290, 22, 16) + ears(230, 190, 0.6, false) + "</g>";
    } else if (n === 30) g = pose(160, 160, "zit");
    else if (n === 31) g = P("M150 180 q -20 40 10 80", 14, 0.8) + eye(168, 150, 0.7, "open") + P("M160 168 l 8 8 l -10 4", 2);
    else if (n === 32) g = face(170, 150, 1.5, "neutraal") + P("M120 250 q 40 20 90 10 q 20 30 -10 40", 8, 0.45);
    else if (n === 33) g = pose(150, 150, "zit", "boos");
    else if (n === 34) g = pose(180, 180, "rek");
    else if (n === 35) g = pose(70, 40, "zit") + pose(40, 180, "loaf") + pose(180, 340, "rek");
    else if (n === 36) g = pose(80, 30, "hurk") + pose(200, 40, "rek") + pose(70, 180, "loop") + pose(200, 200, "rug") + pose(120, 340, "zit");
    else if (n === 37) {
      g = face(180, 180, 1.8, "neutraal") + P("M80 176 L280 176", 1, 0.45) + P("M180 60 L180 340", 1, 0.45) + P("M130 250 L230 250", 1, 0.45);
    } else if (n === 38) g = face(180, 200, 2.2, "neutraal") + P("M90 250 q 40 30 90 10 q 30 16 70 -8", 6, 0.35);
    else if (n === 39) {
      g = '<path d="M110 120 q 40 -40 80 10 q 30 40 -10 70 q -50 20 -70 -20 z" fill="#f4d7a8"/>' +
        '<path d="M150 150 q 30 -10 50 20 q 10 30 -20 28 q -30 -8 -30 -48 z" fill="#e07a2f"/>' +
        '<path d="M168 130 l 18 40 l -8 8 l -16 -36 z" fill="#c2410c"/>' +
        '<ellipse cx="180" cy="210" rx="10" ry="7" fill="#e8a0b0"/>';
    } else if (n === 40) {
      g = face(180, 200, 1.6, "neutraal").replace(/fill="#1c1c1c"/g, 'fill="#1c1c1c"') +
        '<ellipse cx="156" cy="196" rx="16" ry="12" fill="#7dbe4a"/>' +
        '<ellipse cx="204" cy="196" rx="16" ry="12" fill="#7dbe4a"/>' +
        '<circle cx="162" cy="192" r="3" fill="#f3efe6"/><circle cx="210" cy="192" r="3" fill="#f3efe6"/>';
    } else if (n === 41) {
      g = '<path d="M100 140 q 50 -50 120 0 q 40 60 10 120 q -70 30 -120 -10 q -30 -50 -10 -110 z" fill="#f6d7a8"/>' +
        '<path d="M140 150 q 20 10 10 40 q -16 8 -24 -10 z" fill="#e07a2f"/>' +
        '<path d="M180 130 q 16 20 4 46 q -14 6 -18 -16 z" fill="#c2410c"/>' +
        '<path d="M150 220 q 30 16 60 4 q 8 20 -16 22 q -36 2 -44 -26 z" fill="#f3e2c4"/>' +
        face(180, 190, 0.2, "neutraal");
    } else {
      g = '<rect x="40" y="40" width="280" height="400" rx="8" fill="#8aa4c8"/>' +
        '<path d="M110 150 q 40 -50 100 8 q 36 50 0 110 q -60 24 -96 -8 q -24 -48 -4 -110 z" fill="#f0c48a"/>' +
        '<path d="M150 160 q 18 8 8 36 q -12 6 -18 -8 z" fill="#e07a2f"/>' +
        '<path d="M186 146 q 14 16 2 40 q -12 4 -14 -14 z" fill="#c2410c"/>' +
        face(175, 200, 1.15, "tevreden") +
        '<ellipse cx="175" cy="248" rx="12" ry="8" fill="#e8a0b0"/>';
    }
    return svg(g);
  }
  return { sheet: sheet };
})();
