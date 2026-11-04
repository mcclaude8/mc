/* =====================================================================
   NOISE — seeded 2D simplex, fractal sums, ridges, domain warp
   ===================================================================== */
const Noise = (() => {
  const F2 = .5 * (Math.sqrt(3) - 1), G2 = (3 - Math.sqrt(3)) / 6;
  const grad = new Float32Array([1, 1, -1, 1, 1, -1, -1, -1, 1, 0, -1, 0, 0, 1, 0, -1]);
  function make(seed) {
    const r = mulberry(seed), p = new Uint8Array(256);
    for (let i = 0; i < 256; i++) p[i] = i;
    for (let i = 255; i > 0; i--) { const j = Math.floor(r() * (i + 1)); const t = p[i]; p[i] = p[j]; p[j] = t; }
    const perm = new Uint8Array(512), pm8 = new Uint8Array(512);
    for (let i = 0; i < 512; i++) { perm[i] = p[i & 255]; pm8[i] = (perm[i] & 7) * 2; }
    return function (x, y) {
      const s = (x + y) * F2, i = Math.floor(x + s), j = Math.floor(y + s);
      const t = (i + j) * G2, x0 = x - (i - t), y0 = y - (j - t);
      const i1 = x0 > y0 ? 1 : 0, j1 = 1 - i1;
      const x1 = x0 - i1 + G2, y1 = y0 - j1 + G2, x2 = x0 - 1 + 2 * G2, y2 = y0 - 1 + 2 * G2;
      const ii = i & 255, jj = j & 255;
      let n = 0, tt, g;
      tt = .5 - x0 * x0 - y0 * y0; if (tt > 0) { g = pm8[ii + perm[jj]]; tt *= tt; n += tt * tt * (grad[g] * x0 + grad[g + 1] * y0); }
      tt = .5 - x1 * x1 - y1 * y1; if (tt > 0) { g = pm8[ii + i1 + perm[jj + j1]]; tt *= tt; n += tt * tt * (grad[g] * x1 + grad[g + 1] * y1); }
      tt = .5 - x2 * x2 - y2 * y2; if (tt > 0) { g = pm8[ii + 1 + perm[jj + 1]]; tt *= tt; n += tt * tt * (grad[g] * x2 + grad[g + 1] * y2); }
      return 70 * n; // ≈ [-1, 1]
    };
  }
  const a = make(1337), b = make(4242), c = make(9001);
  function fbm(fn, x, y, oct = 4, lac = 2, gain = .5) { let s = 0, amp = 1, f = 1, norm = 0; for (let i = 0; i < oct; i++) { s += fn(x * f, y * f) * amp; norm += amp; amp *= gain; f *= lac; } return s / norm; }
  function ridged(fn, x, y, oct = 4) { let s = 0, amp = .5, f = 1, prev = 1; for (let i = 0; i < oct; i++) { let n = 1 - Math.abs(fn(x * f, y * f)); n *= n; s += n * amp * prev; prev = n; amp *= .5; f *= 2.1; } return s; }
  return { make, a, b, c, fbm, ridged };
})();
