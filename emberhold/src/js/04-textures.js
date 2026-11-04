/* =====================================================================
   PROCEDURAL TEXTURES & SHARED MATERIALS
   ===================================================================== */
function makeCanvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return [c, c.getContext('2d')]; }
function toTex(c, rx = 1, ry = 1, srgb = true) {
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rx, ry);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}
const hsl = (h, s, l, a = 1) => `hsla(${h},${s}%,${l}%,${a})`;
function speckle(g, w, h, n, colFn, size = [1, 3]) { for (let i = 0; i < n; i++) { g.fillStyle = colFn(); const s = rand(size[0], size[1]); g.fillRect(Math.random() * w, Math.random() * h, s, s); } }

function texPlanks(hue = 28, light = 30) {
  const [c, g] = makeCanvas(1024, 1024); const rows = 8, rh = 1024 / rows;
  for (let r = 0; r < rows; r++) {
    let x = -rand(0, 500);
    while (x < 1024) {
      const len = rand(320, 720), L = light + rand(-6, 5), H = hue + rand(-4, 4);
      g.fillStyle = hsl(H, 36, L); g.fillRect(x, r * rh, len, rh);
      for (let k = 0; k < 28; k++) {
        g.strokeStyle = hsl(H, 34, L - rand(4, 11), rand(.12, .4)); g.lineWidth = rand(.6, 2.2);
        g.beginPath(); const y0 = r * rh + rand(3, rh - 3); g.moveTo(x, y0);
        for (let s = 0; s <= len; s += 32) g.lineTo(x + s, y0 + Math.sin(s * .012 + k) * rand(.4, 2.4));
        g.stroke();
      }
      if (Math.random() < .4) { const kx = x + rand(30, len - 30), ky = r * rh + rand(20, rh - 20); g.fillStyle = hsl(H, 40, L - 13, .85); g.beginPath(); g.ellipse(kx, ky, rand(5, 11), rand(3, 6), 0, 0, Math.PI * 2); g.fill(); }
      g.fillStyle = 'rgba(0,0,0,.55)'; g.fillRect(x, r * rh, 3, rh);
      g.fillStyle = 'rgba(20,14,10,.8)'; g.fillRect(x + 10, r * rh + 14, 4, 4); g.fillRect(x + 10, r * rh + rh - 18, 4, 4);
      x += len;
    }
    g.fillStyle = 'rgba(0,0,0,.6)'; g.fillRect(0, r * rh, 1024, 3);
  }
  speckle(g, 1024, 1024, 3000, () => `rgba(0,0,0,${rand(.04, .12)})`);
  return c;
}
function texStone(hue = 30, sat = 8, light = 38) {
  const [c, g] = makeCanvas(512, 512);
  g.fillStyle = hsl(hue, sat, light - 18); g.fillRect(0, 0, 512, 512);
  const rows = 7, rh = 512 / rows;
  for (let r = 0; r < rows; r++) {
    let x = -rand(0, 60);
    while (x < 512) {
      const w = rand(55, 105), L = light + rand(-8, 8);
      g.fillStyle = hsl(hue + rand(-6, 6), sat + rand(-3, 4), L);
      const pad = 3;
      g.beginPath();
      if (g.roundRect) g.roundRect(x + pad, r * rh + pad, w - pad * 2, rh - pad * 2, 8); else g.rect(x + pad, r * rh + pad, w - pad * 2, rh - pad * 2);
      g.fill();
      const grd = g.createLinearGradient(0, r * rh, 0, r * rh + rh); grd.addColorStop(0, 'rgba(255,255,255,.08)'); grd.addColorStop(1, 'rgba(0,0,0,.18)');
      g.fillStyle = grd; g.fill();
      x += w;
    }
  }
  speckle(g, 512, 512, 4000, () => `rgba(${Math.random() < .5 ? '0,0,0' : '255,255,255'},${rand(.03, .09)})`);
  return c;
}
function texBrick() {
  const [c, g] = makeCanvas(512, 512);
  g.fillStyle = '#2a1a14'; g.fillRect(0, 0, 512, 512);
  const rows = 12, rh = 512 / rows, bw = 64;
  for (let r = 0; r < rows; r++) for (let i = -1; i < 9; i++) {
    const x = i * bw + (r % 2 ? bw / 2 : 0);
    g.fillStyle = hsl(rand(8, 18), rand(35, 50), rand(22, 34));
    g.fillRect(x + 2, r * rh + 2, bw - 4, rh - 4);
    g.fillStyle = `rgba(0,0,0,${rand(.05, .3)})`; g.fillRect(x + 2, r * rh + 2, bw - 4, rh - 4);
  }
  speckle(g, 512, 512, 2500, () => `rgba(0,0,0,${rand(.05, .2)})`);
  const grd = g.createLinearGradient(0, 0, 0, 512); grd.addColorStop(0, 'rgba(0,0,0,.35)'); grd.addColorStop(.5, 'rgba(0,0,0,0)');
  g.fillStyle = grd; g.fillRect(0, 0, 512, 512);
  return c;
}
function texPlaster() {
  const [c, g] = makeCanvas(512, 512);
  g.fillStyle = '#b8a688'; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 70; i++) { g.fillStyle = `rgba(${Math.random() < .5 ? '90,70,50' : '230,215,190'},${rand(.03, .08)})`; g.beginPath(); g.ellipse(rand(0, 512), rand(0, 512), rand(20, 90), rand(10, 50), rand(0, 3), 0, Math.PI * 2); g.fill(); }
  speckle(g, 512, 512, 5000, () => `rgba(60,40,20,${rand(.03, .1)})`);
  return c;
}
function texWood(hue = 26, light = 30) {
  const [c, g] = makeCanvas(256, 256);
  g.fillStyle = hsl(hue, 36, light); g.fillRect(0, 0, 256, 256);
  for (let k = 0; k < 60; k++) { g.strokeStyle = hsl(hue, 34, light - rand(3, 10), rand(.15, .45)); g.lineWidth = rand(.5, 2); g.beginPath(); const x0 = rand(0, 256); g.moveTo(x0, 0); for (let y = 0; y <= 256; y += 16) g.lineTo(x0 + Math.sin(y * .03 + k) * rand(1, 4), y); g.stroke(); }
  return c;
}
function texGround(base, alt, dots = 9000) {
  const [c, g] = makeCanvas(512, 512);
  const b = new THREE.Color(base), a = new THREE.Color(alt);
  g.fillStyle = '#' + b.getHexString(); g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 60; i++) { g.fillStyle = '#' + a.getHexString(); g.globalAlpha = rand(.1, .3); g.beginPath(); g.ellipse(rand(0, 512), rand(0, 512), rand(20, 80), rand(15, 60), rand(0, 3), 0, Math.PI * 2); g.fill(); }
  g.globalAlpha = 1;
  for (let i = 0; i < dots; i++) { const t = Math.random(); const col = b.clone().lerp(a, t).multiplyScalar(rand(.75, 1.2)); g.fillStyle = '#' + col.getHexString(); const x = rand(0, 512), y = rand(0, 512); g.fillRect(x, y, rand(1, 2), rand(2, 5)); }
  return c;
}
function texDot(soft = true) {
  const [c, g] = makeCanvas(64, 64);
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  if (soft) { grd.addColorStop(0, 'rgba(255,255,255,1)'); grd.addColorStop(.35, 'rgba(255,255,255,.55)'); grd.addColorStop(1, 'rgba(255,255,255,0)'); }
  else { grd.addColorStop(0, 'rgba(255,255,255,1)'); grd.addColorStop(.6, 'rgba(255,255,255,.9)'); grd.addColorStop(1, 'rgba(255,255,255,0)'); }
  g.fillStyle = grd; g.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
function texSmoke() {
  const [c, g] = makeCanvas(128, 128);
  for (let i = 0; i < 18; i++) {
    const x = 64 + rand(-22, 22), y = 64 + rand(-22, 22), r = rand(18, 40);
    const grd = g.createRadialGradient(x, y, 0, x, y, r); grd.addColorStop(0, 'rgba(255,255,255,.35)'); grd.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grd; g.fillRect(0, 0, 128, 128);
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
function texShaft() {
  const [c, g] = makeCanvas(64, 256);
  const grd = g.createLinearGradient(0, 0, 0, 256); grd.addColorStop(0, 'rgba(255,255,255,.9)'); grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd; g.fillRect(0, 0, 64, 256);
  const h = g.createLinearGradient(0, 0, 64, 0); h.addColorStop(0, 'rgba(0,0,0,1)'); h.addColorStop(.25, 'rgba(0,0,0,0)'); h.addColorStop(.75, 'rgba(0,0,0,0)'); h.addColorStop(1, 'rgba(0,0,0,1)');
  g.globalCompositeOperation = 'destination-out'; g.fillStyle = h; g.fillRect(0, 0, 64, 256);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
function texSign(text, w = 512, h = 128, opts = {}) {
  const [c, g] = makeCanvas(w, h);
  g.fillStyle = opts.bg || '#3a2516'; g.fillRect(0, 0, w, h);
  for (let k = 0; k < 30; k++) { g.strokeStyle = `rgba(0,0,0,${rand(.1, .25)})`; g.beginPath(); const y = rand(0, h); g.moveTo(0, y); g.lineTo(w, y + rand(-4, 4)); g.stroke(); }
  g.strokeStyle = opts.border || '#c8963e'; g.lineWidth = 6; g.strokeRect(8, 8, w - 16, h - 16);
  g.fillStyle = opts.fg || '#e9c37a'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = `${opts.weight || 700} ${opts.size || 64}px "Grenze Gotisch", Georgia, serif`;
  g.fillText(text, w / 2, h / 2 + 4);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}
function texPaper(lines) {
  const [c, g] = makeCanvas(256, 320);
  g.fillStyle = '#e6d6b2'; g.fillRect(0, 0, 256, 320);
  speckle(g, 256, 320, 1200, () => `rgba(120,90,50,${rand(.05, .15)})`);
  g.fillStyle = '#3a2614'; g.textAlign = 'center';
  g.font = '700 40px "Grenze Gotisch", Georgia, serif'; g.fillText(lines[0], 128, 60);
  g.font = '600 20px "Barlow Semi Condensed", Arial, sans-serif';
  lines.slice(1).forEach((l, i) => g.fillText(l, 128, 110 + i * 34));
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

/* ---------- material helpers ---------- */
const matCache = {};
function stdMat(key, p) { return matCache[key] || (matCache[key] = new THREE.MeshStandardMaterial(p)); }
function colMat(hex, rough = .8, metal = 0) { return stdMat(`c${hex}-${rough}-${metal}`, { color: hex, roughness: rough, metalness: metal }); }
function emissiveMat(hex, intensity = 2) { return stdMat(`e${hex}-${intensity}`, { color: 0x000000, emissive: hex, emissiveIntensity: intensity, roughness: 1 }); }
function metalMat(id, unique = false) {
  const m = METALS[id];
  const p = { color: m.color, metalness: .92, roughness: id === 'gold' ? .22 : id === 'copper' ? .3 : .34, envMapIntensity: 1.3 };
  if (m.glow) { p.emissive = new THREE.Color(m.glow); p.emissiveIntensity = .7; }
  return unique ? new THREE.MeshStandardMaterial(p) : stdMat('metal-' + id, p);
}
const TEX = {};
function initTextures() {
  TEX.planks = toTex(texPlanks(), 5, 4);
  TEX.ceiling = toTex(texPlanks(24, 18), 4, 3);
  TEX.stone = toTex(texStone(), 6, 1);
  TEX.stoneSide = toTex(texStone(), 5, 1);
  TEX.brick = toTex(texBrick(), 2, 1.5);
  TEX.plaster = toTex(texPlaster(), 4, 1);
  TEX.wood = toTex(texWood(), 1, 1);
  TEX.woodDark = toTex(texWood(22, 18), 1, 1);
  TEX.dot = texDot(true);
  TEX.dotHard = texDot(false);
  TEX.smoke = texSmoke();
  TEX.shaft = texShaft();
  TEX.rug = (() => {
    const [c, g] = makeCanvas(512, 320);
    g.fillStyle = '#6a2018'; g.fillRect(0, 0, 512, 320);
    g.strokeStyle = '#d6a957'; g.lineWidth = 10; g.strokeRect(18, 18, 476, 284);
    g.strokeStyle = '#2a1a3a'; g.lineWidth = 16; g.strokeRect(40, 40, 432, 240);
    g.fillStyle = '#d6a957';
    for (let i = 0; i < 5; i++) { g.save(); g.translate(96 + i * 80, 160); g.rotate(Math.PI / 4); g.fillRect(-18, -18, 36, 36); g.restore(); }
    speckle(g, 512, 320, 4000, () => `rgba(0,0,0,${rand(.05, .2)})`);
    return toTex(c);
  })();
}

/* ---------- tileable world textures (terrain, bark, roofs, clouds) ---------- */
// draw fn at (x,y) and at the wrapped copies so the texture tiles seamlessly
function wrapDraw(W, H, x, y, r, fn) { for (const ox of [-W, 0, W]) for (const oy of [-H, 0, H]) { const X = x + ox, Y = y + oy; if (X + r < 0 || X - r > W || Y + r < 0 || Y - r > H) continue; fn(X, Y); } }
function blobs(g, W, H, n, rr, colFn, alpha = [.08, .25]) {
  for (let i = 0; i < n; i++) {
    const x = rand(0, W), y = rand(0, H), r = rand(rr[0], rr[1]), col = colFn(), a = rand(alpha[0], alpha[1]), rot = rand(0, 3), sy = rand(.5, 1);
    wrapDraw(W, H, x, y, r, (X, Y) => { g.globalAlpha = a; g.fillStyle = col; g.beginPath(); g.ellipse(X, Y, r, r * sy, rot, 0, TAU); g.fill(); });
  }
  g.globalAlpha = 1;
}
function strokes(g, W, H, n, len, colFn, width = [.6, 1.6], angle = null) {
  for (let i = 0; i < n; i++) {
    const x = rand(0, W), y = rand(0, H), l = rand(len[0], len[1]), a = angle == null ? rand(0, TAU) : angle + rand(-.5, .5);
    g.strokeStyle = colFn(); g.lineWidth = rand(width[0], width[1]);
    wrapDraw(W, H, x, y, l, (X, Y) => { g.beginPath(); g.moveTo(X, Y); g.lineTo(X + Math.cos(a) * l, Y + Math.sin(a) * l); g.stroke(); });
  }
}
function texGrassW() {
  const W = 512, [c, g] = makeCanvas(W, W);
  g.fillStyle = hsl(96, 38, 30); g.fillRect(0, 0, W, W);
  blobs(g, W, W, 90, [30, 110], () => hsl(rand(80, 112), rand(30, 48), rand(22, 38)), [.12, .3]);
  strokes(g, W, W, 9000, [3, 9], () => hsl(rand(78, 118), rand(35, 60), rand(18, 46), rand(.35, .8)), [.7, 1.8], -Math.PI / 2);
  blobs(g, W, W, 40, [3, 8], () => hsl(rand(30, 45), 40, rand(25, 35)), [.2, .4]);
  return c;
}
function texDirtW() {
  const W = 512, [c, g] = makeCanvas(W, W);
  g.fillStyle = hsl(30, 30, 30); g.fillRect(0, 0, W, W);
  blobs(g, W, W, 120, [20, 80], () => hsl(rand(24, 36), rand(22, 36), rand(22, 38)), [.15, .35]);
  for (let i = 0; i < 700; i++) { const x = rand(0, W), y = rand(0, W), r = rand(1.5, 5), L = rand(30, 55); wrapDraw(W, W, x, y, r, (X, Y) => { g.fillStyle = hsl(rand(25, 40), 12, L * .6); g.beginPath(); g.ellipse(X + 1, Y + 1.5, r, r * .75, 0, 0, TAU); g.fill(); g.fillStyle = hsl(rand(25, 40), 14, L); g.beginPath(); g.ellipse(X, Y, r, r * .75, 0, 0, TAU); g.fill(); }); }
  speckle(g, W, W, 6000, () => `rgba(0,0,0,${rand(.05, .2)})`);
  return c;
}
function texRockW(h = 30, s = 6, l = 42) {
  const W = 512, [c, g] = makeCanvas(W, W);
  g.fillStyle = hsl(h, s, l); g.fillRect(0, 0, W, W);
  blobs(g, W, W, 160, [15, 90], () => hsl(h + rand(-10, 10), s + rand(-3, 6), l + rand(-14, 12)), [.15, .4]);
  for (let k = 0; k < 70; k++) { let x = rand(0, W), y = rand(0, W), a = rand(0, TAU); g.strokeStyle = `rgba(20,16,12,${rand(.25, .6)})`; g.lineWidth = rand(.8, 2.2); const pts = []; for (let i = 0; i < 14; i++) { pts.push([x, y]); a += rand(-.7, .7); x += Math.cos(a) * rand(6, 16); y += Math.sin(a) * rand(6, 16); } for (const [ox, oy] of [[0, 0], [-W, 0], [W, 0], [0, -W], [0, W]]) { g.beginPath(); pts.forEach(([px, py], i) => i ? g.lineTo(px + ox, py + oy) : g.moveTo(px + ox, py + oy)); g.stroke(); } }
  blobs(g, W, W, 60, [3, 10], () => hsl(rand(70, 100), 30, rand(30, 45)), [.12, .3]);
  speckle(g, W, W, 9000, () => `rgba(${Math.random() < .5 ? '0,0,0' : '255,255,255'},${rand(.03, .1)})`);
  return c;
}
function texSnowW() {
  const W = 512, [c, g] = makeCanvas(W, W);
  g.fillStyle = '#e8f0f8'; g.fillRect(0, 0, W, W);
  blobs(g, W, W, 120, [20, 100], () => Math.random() < .5 ? '#d2deec' : '#f8fbff', [.2, .5]);
  speckle(g, W, W, 3000, () => `rgba(255,255,255,${rand(.4, .9)})`, [1, 2]);
  speckle(g, W, W, 2000, () => `rgba(120,150,190,${rand(.05, .15)})`, [1, 3]);
  return c;
}
function texSandW() {
  const W = 512, [c, g] = makeCanvas(W, W);
  g.fillStyle = hsl(40, 38, 62); g.fillRect(0, 0, W, W);
  blobs(g, W, W, 80, [20, 90], () => hsl(rand(34, 46), rand(28, 42), rand(52, 70)), [.15, .35]);
  for (let y = 0; y < W; y += 9) { g.strokeStyle = `rgba(120,90,50,${rand(.05, .12)})`; g.lineWidth = 2; g.beginPath(); for (let x = 0; x <= W; x += 16) g.lineTo(x, y + Math.sin(x / W * TAU * 3 + y) * 3); g.stroke(); }
  speckle(g, W, W, 12000, () => `rgba(${Math.random() < .5 ? '80,60,30' : '255,250,230'},${rand(.06, .2)})`, [1, 2]);
  return c;
}
function texAshW() {
  const W = 512, [c, g] = makeCanvas(W, W);
  g.fillStyle = hsl(15, 6, 17); g.fillRect(0, 0, W, W);
  blobs(g, W, W, 140, [15, 90], () => hsl(rand(0, 30), rand(3, 10), rand(10, 26)), [.2, .45]);
  speckle(g, W, W, 8000, () => `rgba(${Math.random() < .7 ? '0,0,0' : '160,150,140'},${rand(.06, .2)})`, [1, 3]);
  return c;
}
function texCrackW() {
  const W = 512, [c, g] = makeCanvas(W, W);
  g.fillStyle = '#000'; g.fillRect(0, 0, W, W);
  g.lineCap = 'round';
  for (let k = 0; k < 46; k++) {
    let x = rand(0, W), y = rand(0, W), a = rand(0, TAU); const pts = [];
    for (let i = 0; i < 22; i++) { pts.push([x, y]); a += rand(-.6, .6); x += Math.cos(a) * rand(6, 14); y += Math.sin(a) * rand(6, 14); }
    for (const [lw, col] of [[7, 'rgba(255,255,255,.12)'], [3, 'rgba(255,255,255,.5)'], [1.2, '#fff']]) {
      g.strokeStyle = col; g.lineWidth = lw * rand(.6, 1.2);
      for (const [ox, oy] of [[0, 0], [-W, 0], [W, 0], [0, -W], [0, W]]) { g.beginPath(); pts.forEach(([px, py], i) => i ? g.lineTo(px + ox, py + oy) : g.moveTo(px + ox, py + oy)); g.stroke(); }
    }
  }
  return c;
}
function texBark(h = 26, l = 26) {
  const W = 256, [c, g] = makeCanvas(W, W);
  g.fillStyle = hsl(h, 28, l); g.fillRect(0, 0, W, W);
  for (let i = 0; i < 260; i++) { const x = rand(0, W), w = rand(1, 5); g.fillStyle = hsl(h + rand(-5, 5), 25, l + rand(-12, 8), rand(.3, .8)); const y = rand(0, W), len = rand(20, 90); wrapDraw(W, W, x, y, len, (X, Y) => g.fillRect(X, Y, w, len)); }
  speckle(g, W, W, 2500, () => `rgba(0,0,0,${rand(.06, .2)})`);
  return c;
}
function texShingles(hue = 12, sat = 35, light = 30) {
  const W = 256, [c, g] = makeCanvas(W, W); const rows = 8, rh = W / rows, cw = 32;
  g.fillStyle = hsl(hue, sat, light * .5); g.fillRect(0, 0, W, W);
  for (let r = 0; r < rows; r++) for (let i = -1; i < W / cw + 1; i++) {
    const x = i * cw + (r % 2 ? cw / 2 : 0), y = r * rh, L = light + rand(-7, 6);
    g.fillStyle = hsl(hue + rand(-5, 5), sat + rand(-6, 6), L); g.beginPath();
    if (g.roundRect) g.roundRect(x + 1, y + 1, cw - 2, rh + 4, [0, 0, 6, 6]); else g.rect(x + 1, y + 1, cw - 2, rh + 4); g.fill();
    const gr = g.createLinearGradient(0, y, 0, y + rh); gr.addColorStop(0, 'rgba(0,0,0,.35)'); gr.addColorStop(.3, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(255,255,255,.06)'); g.fillStyle = gr; g.fill();
  }
  speckle(g, W, W, 1500, () => `rgba(0,0,0,${rand(.05, .15)})`);
  return c;
}
function texCobble() {
  const W = 512, [c, g] = makeCanvas(W, W);
  g.fillStyle = '#2a2622'; g.fillRect(0, 0, W, W);
  for (let i = 0; i < 520; i++) { const x = rand(0, W), y = rand(0, W), r = rand(10, 20), L = rand(30, 48); wrapDraw(W, W, x, y, r, (X, Y) => { g.fillStyle = hsl(rand(20, 40), 8, L); g.beginPath(); g.ellipse(X, Y, r, r * rand(.7, .95), rand(0, 3), 0, TAU); g.fill(); g.fillStyle = 'rgba(255,255,255,.07)'; g.beginPath(); g.ellipse(X - r * .2, Y - r * .25, r * .6, r * .45, 0, 0, TAU); g.fill(); }); }
  speckle(g, W, W, 5000, () => `rgba(0,0,0,${rand(.05, .15)})`);
  return c;
}
function texCloud() {
  const W = 256, [c, g] = makeCanvas(W, W), img = g.createImageData(W, W), S = 4 / W;
  for (let y = 0; y < W; y++) for (let x = 0; x < W; x++) {
    // blend four shifted samples so the noise wraps seamlessly
    const u = x / W, v = y / W;
    const f = (X, Y) => Noise.fbm(Noise.c, X * S, Y * S, 5);
    const n = f(x, y) * (1 - u) * (1 - v) + f(x + W, y) * u * (1 - v) + f(x, y + W) * (1 - u) * v + f(x + W, y + W) * u * v;
    const k = (y * W + x) * 4, val = clamp((n * .5 + .5) * 255, 0, 255);
    img.data[k] = img.data[k + 1] = img.data[k + 2] = val; img.data[k + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  return c;
}
function worldTex(c, srgb = true) { const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; if (srgb) t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; }
function initWorldTextures() {
  TEX.grassW = worldTex(texGrassW()); TEX.dirtW = worldTex(texDirtW()); TEX.rockW = worldTex(texRockW());
  TEX.snowW = worldTex(texSnowW()); TEX.sandW = worldTex(texSandW()); TEX.ashW = worldTex(texAshW());
  TEX.crackW = worldTex(texCrackW(), false); TEX.bark = worldTex(texBark()); TEX.barkPale = worldTex(texBark(40, 70));
  TEX.roofRed = worldTex(texShingles(10, 38, 32)); TEX.roofSlate = worldTex(texShingles(215, 10, 30)); TEX.roofThatch = worldTex(texShingles(38, 40, 42));
  TEX.cobble = worldTex(texCobble()); TEX.cloud = worldTex(texCloud(), false);
  TEX.plasterW = worldTex(texPlaster()); TEX.stoneW = worldTex(texStone()); TEX.woodW = worldTex(texWood()); TEX.planksW = worldTex(texPlanks(28, 30));
}
