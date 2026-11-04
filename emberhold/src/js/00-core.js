import * as THREE from 'three';

/* =====================================================================
   EMBERHOLD FORGE — core helpers, settings, renderer, post, tweens
   ===================================================================== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const TAU = Math.PI * 2;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const rand = (a, b) => a + Math.random() * (b - a);
const randi = (a, b) => Math.floor(a + Math.random() * (b - a + 1));
const pick = a => a[Math.floor(Math.random() * a.length)];
const smoothstep = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const easeInOut = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
const easeOut = t => 1 - Math.pow(1 - t, 3);
const easeIn = t => t * t * t;
const easeOutBack = t => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
const damp = (a, b, k, dt) => lerp(a, b, 1 - Math.exp(-k * dt));
const dampAngle = (a, b, k, dt) => { let d = ((b - a + Math.PI) % TAU + TAU) % TAU - Math.PI; return a + d * (1 - Math.exp(-k * dt)); };
const V3 = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const fmt = n => Math.round(n).toLocaleString('en-US');
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const AUTO = { on: false, speed: 1 };          // headless autoplay used for testing
const isTouch = matchMedia('(pointer: coarse)').matches;
const nextFrame = () => new Promise(r => setTimeout(r, 0));

// seeded random (trail generation must match the scout report)
function mulberry(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
// stable integer hash → [0,1)
function hash2(x, z, s = 0) { let h = Math.imul(x | 0, 374761393) + Math.imul(z | 0, 668265263) + Math.imul(s | 0, 1442695041) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); h ^= h >>> 16; return (h >>> 0) / 4294967296; }

/* ---------- settings ---------- */
const QUALITY = {
  ultra:  { label: 'Ultra',  pr: 2,    shadow: 4096, shadowSpan: 70, bloom: true,  grade: true,  grass: 1.0,  trees: 1.0,  seg: 40, treeShadow: true,  viewDist: 1.0 },
  high:   { label: 'High',   pr: 1.5,  shadow: 2048, shadowSpan: 60, bloom: true,  grade: true,  grass: .7,   trees: .85,  seg: 40, treeShadow: true,  viewDist: .9 },
  medium: { label: 'Medium', pr: 1.25, shadow: 2048, shadowSpan: 48, bloom: false, grade: false, grass: .38,  trees: .65,  seg: 28, treeShadow: false, viewDist: .75 },
  low:    { label: 'Low',    pr: 1,    shadow: 1024, shadowSpan: 40, bloom: false, grade: false, grass: .14,  trees: .45,  seg: 20, treeShadow: false, viewDist: .6 },
};
const settings = (() => {
  const d = { volume: 0.7, music: true, musicVol: 0.45, ambience: 0.8, quality: isTouch ? 'medium' : 'high', sens: 1, invertY: false, fov: 70, autoRes: true, showFps: false, minimap: true, camera: 'third' };
  try { const s = JSON.parse(localStorage.getItem('emberhold-settings-v2') || localStorage.getItem('emberhold-settings') || 'null'); if (s) Object.assign(d, s); } catch (e) { }
  if (!QUALITY[d.quality]) d.quality = 'high';
  return d;
})();
const Q = () => QUALITY[settings.quality];
function saveSettings() { try { localStorage.setItem('emberhold-settings-v2', JSON.stringify(settings)); } catch (e) { } }

/* ---------- renderer ---------- */
const canvas = $('#c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance', logarithmicDepthBuffer: false });
const RES = { scale: 1, ema: 16, t: 0 };
function applyPixelRatio() {
  const base = Math.min(window.devicePixelRatio || 1, Q().pr);
  renderer.setPixelRatio(Math.max(.5, base * RES.scale));
  if (post.ok) post.composer.setPixelRatio(renderer.getPixelRatio());
}
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.localClippingEnabled = true;

const camera = new THREE.PerspectiveCamera(60, 1, 0.03, 2600);
camera.rotation.order = 'YXZ';
const scene = new THREE.Scene();

const post = { composer: null, renderPass: null, bloom: null, grade: null, ok: false };
const GradeShader = {
  uniforms: { tDiffuse: { value: null }, vig: { value: .32 }, warm: { value: .03 }, sat: { value: 1.08 }, flash: { value: 0 }, hurt: { value: 0 } },
  vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
  fragmentShader: `uniform sampler2D tDiffuse; uniform float vig, warm, sat, flash, hurt; varying vec2 vUv;
    void main(){ vec4 c = texture2D(tDiffuse, vUv); vec3 col = c.rgb;
      float l = dot(col, vec3(.2126,.7152,.0722)); col = mix(vec3(l), col, sat);
      col *= vec3(1.0 + warm, 1.0 + warm * .35, 1.0 - warm * .6);
      vec2 d = vUv - .5; float v = 1.0 - dot(d, d) * vig * 2.2; col *= clamp(v, 0.0, 1.0);
      col += flash * vec3(.9,.92,1.0);
      col = mix(col, col * vec3(1.25,.55,.5), hurt * smoothstep(.15,.75,length(d)));
      gl_FragColor = vec4(col, c.a); }`,
};
async function setupPost() {
  try {
    const [a, b, c, d, e] = await Promise.all([
      import('three/addons/postprocessing/EffectComposer.js'),
      import('three/addons/postprocessing/RenderPass.js'),
      import('three/addons/postprocessing/UnrealBloomPass.js'),
      import('three/addons/postprocessing/OutputPass.js'),
      import('three/addons/postprocessing/ShaderPass.js')]);
    post.composer = new a.EffectComposer(renderer);
    post.renderPass = new b.RenderPass(scene, camera);
    post.composer.addPass(post.renderPass);
    post.bloom = new c.UnrealBloomPass(new THREE.Vector2(512, 512), 0.5, 0.55, 0.88);
    post.composer.addPass(post.bloom);
    post.grade = new e.ShaderPass(GradeShader);
    post.composer.addPass(post.grade);
    post.composer.addPass(new d.OutputPass());
    post.ok = true;
    onResize();
  } catch (err) { console.warn('Post-processing unavailable:', err && err.message); }
}
function renderFrame() {
  const q = Q();
  if (post.ok && (q.bloom || q.grade)) {
    post.bloom.enabled = q.bloom; post.grade.enabled = true;
    post.composer.render();
  } else renderer.render(scene, camera);
}
function onResize() {
  const w = canvas.clientWidth || innerWidth, h = canvas.clientHeight || innerHeight;
  applyPixelRatio();
  renderer.setSize(w, h, false);
  camera.aspect = w / h; camera.updateProjectionMatrix();
  if (post.ok) { post.composer.setPixelRatio(renderer.getPixelRatio()); post.composer.setSize(w, h); }
}
addEventListener('resize', onResize);
// adaptive resolution keeps the frame rate smooth on slower GPUs
function updateAutoRes(dtMs) {
  RES.ema = lerp(RES.ema, dtMs, .05); RES.t += dtMs;
  if (!settings.autoRes || RES.t < 2500) return;
  RES.t = 0;
  let s = RES.scale;
  if (RES.ema > 24 && s > .55) s = Math.max(.55, s - .1);
  else if (RES.ema < 15 && s < 1) s = Math.min(1, s + .05);
  if (s !== RES.scale) { RES.scale = s; onResize(); }
}

/* ---------- tweens & timers (paused with the game loop) ---------- */
const tweens = [];
function tween(dur, fn, done, ease = easeInOut) { const tw = { t: 0, dur: Math.max(0.0001, dur), fn, done, ease, dead: false }; tweens.push(tw); return tw; }
function killTween(tw) { if (tw) tw.dead = true; }
function updateTweens(dt) {
  const list = tweens.splice(0);
  for (const tw of list) {
    if (tw.dead) continue;
    tw.t += dt; const k = clamp(tw.t / tw.dur, 0, 1);
    tw.fn(tw.ease(k), k);
    if (k >= 1) { tw.dead = true; tw.done && tw.done(); } else tweens.push(tw);
  }
}
const timers = [];
function after(sec, fn) { const t = { t: sec, fn, dead: false }; timers.push(t); return t; }
function updateTimers(dt) {
  const list = timers.splice(0);
  for (const t of list) { if (t.dead) continue; t.t -= dt; if (t.t <= 0) { t.dead = true; t.fn(); } else timers.push(t); }
}
function fadeOut(cb, dur = .45) { const f = $('#fade'); f.classList.add('on'); setTimeout(() => { cb && cb(); }, dur * 1000 + 30); }
function fadeIn() { $('#fade').classList.remove('on'); }
function setLoad(frac, step) { const f = $('#loadFill'); if (f) f.style.width = Math.round(frac * 100) + '%'; const s = $('#loadStep'); if (s && step) s.textContent = step; }
