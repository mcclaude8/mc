/* ---------- audio: everything is synthesized ---------- */
const Sfx = {
  ctx: null, out: null, sfxBus: null, musBus: null, ambBus: null, verb: null, nb: null, loops: {}, crackleT: 0, fireLevel: 0,
  amb: { wind: 0, rain: 0, lava: 0, water: 0, birds: 0, crickets: 0 }, birdT: 2, cricketT: 1,
  init() {
    if (this.ctx) { if (this.ctx.state === 'suspended') this.ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    try { this.ctx = new AC(); } catch (e) { return; }
    const c = this.ctx;
    this.out = c.createGain(); this.out.gain.value = settings.volume; this.out.connect(c.destination);
    const comp = c.createDynamicsCompressor(); comp.threshold.value = -14; comp.knee.value = 8; comp.ratio.value = 5; comp.attack.value = 0.003; comp.release.value = 0.2; comp.connect(this.out);
    // shared hall reverb: a generated decaying-noise impulse
    const irLen = c.sampleRate * 2.6, ir = c.createBuffer(2, irLen, c.sampleRate);
    for (let ch = 0; ch < 2; ch++) { const d = ir.getChannelData(ch); for (let i = 0; i < irLen; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / irLen, 3.2); }
    this.verb = c.createConvolver(); this.verb.buffer = ir;
    const verbOut = c.createGain(); verbOut.gain.value = .5; this.verb.connect(verbOut); verbOut.connect(comp);
    this.sfxBus = c.createGain(); this.sfxBus.gain.value = 1; this.sfxBus.connect(comp);
    const sfxSend = c.createGain(); sfxSend.gain.value = .12; this.sfxBus.connect(sfxSend); sfxSend.connect(this.verb);
    this.musBus = c.createGain(); this.musBus.gain.value = settings.music ? settings.musicVol * .5 : 0; this.musBus.connect(comp);
    const musSend = c.createGain(); musSend.gain.value = .55; this.musBus.connect(musSend); musSend.connect(this.verb);
    this.ambBus = c.createGain(); this.ambBus.gain.value = settings.ambience; this.ambBus.connect(comp);
    const len = c.sampleRate * 2, buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    this.nb = buf;
    this.loops.fire = this._loop('lowpass', 700, 0.6);
    this.loops.grind = this._loop('bandpass', 2400, 1.6);
    this.loops.sizzle = this._loop('highpass', 3800, 0.7);
    this.loops.hiss = this._loop('highpass', 2200, 0.5);
    this.loops.wind = this._loop('lowpass', 420, 0.5, this.ambBus);
    this.loops.rain = this._loop('highpass', 1300, 0.3, this.ambBus);
    this.loops.lava = this._loop('lowpass', 140, 0.9, this.ambBus);
    this.loops.water = this._loop('bandpass', 520, 0.7, this.ambBus);
    this.music.next = c.currentTime + 0.4;
  },
  _loop(type, freq, q, bus) {
    const c = this.ctx, s = c.createBufferSource(); s.buffer = this.nb; s.loop = true;
    const f = c.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
    const g = c.createGain(); g.gain.value = 0; s.connect(f); f.connect(g); g.connect(bus || this.sfxBus); s.start();
    return { s, f, g, base: freq };
  },
  loop(name, level) { const L = this.loops[name]; if (!L) return; L.g.gain.setTargetAtTime(Math.max(0, level), this.ctx.currentTime, 0.08); },
  stopLoops() { for (const k in this.loops) this.loop(k, 0); },
  setVolume(v) { if (this.out) this.out.gain.setTargetAtTime(v, this.ctx.currentTime, 0.05); },
  setMusic() { if (this.musBus) this.musBus.gain.setTargetAtTime(settings.music ? settings.musicVol * .5 : 0, this.ctx.currentTime, 0.3); },
  setAmbience(v) { if (this.ambBus) this.ambBus.gain.setTargetAtTime(v, this.ctx.currentTime, 0.2); },
  _t(o) { return o.at != null ? o.at : this.ctx.currentTime + (o.when || 0); },
  noise(dur, o = {}) {
    if (!this.ctx) return; const c = this.ctx, t = this._t(o);
    const s = c.createBufferSource(); s.buffer = this.nb; s.playbackRate.value = o.rate || 1;
    const f = c.createBiquadFilter(); f.type = o.type || 'bandpass'; f.frequency.setValueAtTime(o.freq || 1200, t);
    if (o.sweep) f.frequency.exponentialRampToValueAtTime(o.sweep, t + dur); f.Q.value = o.q || 0.8;
    const g = c.createGain(); const v = Math.max(0.0002, o.gain ?? 0.3);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + (o.attack || 0.004)); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(o.bus || this.sfxBus); s.start(t, Math.random() * 0.4); s.stop(t + dur + 0.05);
  },
  tone(freq, dur, o = {}) {
    if (!this.ctx) return; const c = this.ctx, t = this._t(o);
    const osc = c.createOscillator(); osc.type = o.type || 'sine'; osc.frequency.setValueAtTime(freq, t);
    if (o.detune) osc.detune.value = o.detune;
    if (o.slide) osc.frequency.exponentialRampToValueAtTime(o.slide, t + (o.slideT || dur));
    const g = c.createGain(); const v = Math.max(0.0002, o.gain ?? 0.2);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + (o.attack || 0.004)); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    let node = osc;
    if (o.lp) { const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = o.lp; f.Q.value = .5; osc.connect(f); node = f; }
    node.connect(g); g.connect(o.bus || this.sfxBus); osc.start(t); osc.stop(t + dur + 0.05);
  },
  clang(pitch = 1, vol = 1) {
    const f = 480 * pitch;
    [[1, .2, 1.2], [2.76, .12, .8], [5.4, .07, .5], [8.93, .035, .3], [1.51, .05, .6]].forEach(([m, g, d]) => this.tone(f * m * (1 + Math.random() * .005), d, { gain: g * vol, attack: .002 }));
    this.noise(.07, { type: 'highpass', freq: 2800, gain: .35 * vol });
    this.tone(95, .14, { gain: .28 * vol, slide: 48 });
  },
  whoosh(v = 1) { this.noise(.45, { type: 'lowpass', freq: 260, sweep: 1500, gain: .32 * v, attack: .08, q: .5 }); },
  thunk() { this.tone(150, .18, { gain: .32, slide: 70, type: 'triangle' }); this.noise(.08, { type: 'lowpass', freq: 900, gain: .22 }); },
  click() { this.tone(1500, .035, { gain: .05, type: 'square' }); },
  coin() { this.tone(1318, .12, { gain: .1, type: 'triangle' }); this.tone(1976, .25, { gain: .08, type: 'triangle', when: .07 }); },
  boom(big = 1) { this.noise(.9 * big, { type: 'lowpass', freq: 1000, sweep: 110, gain: .55, q: .3 }); this.tone(110, .5, { gain: .45, slide: 34 }); },
  hit(v = 1) { this.noise(.09, { type: 'bandpass', freq: 1700, gain: .22 * v, q: 1.2 }); this.tone(230, .08, { gain: .1 * v, slide: 120, type: 'square' }); },
  crit() { this.tone(1046, .16, { type: 'triangle', gain: .09 }); this.tone(1568, .2, { type: 'triangle', gain: .07, when: .05 }); },
  zap() { for (let i = 0; i < 4; i++) this.noise(.05, { type: 'highpass', freq: 4000, gain: .22, when: i * .04 }); this.tone(880, .25, { type: 'sawtooth', gain: .05, slide: 220 }); },
  steam() { this.noise(1.3, { type: 'highpass', freq: 2600, gain: .32, attack: .02 }); },
  splash() { this.noise(.25, { type: 'bandpass', freq: 900, gain: .22, q: .6 }); },
  pour() { this.noise(.4, { type: 'bandpass', freq: 600, gain: .15, q: .7 }); },
  door() { this.tone(180, .5, { type: 'sawtooth', gain: .03, slide: 140 }); this.noise(.2, { type: 'lowpass', freq: 400, gain: .1, when: .35 }); },
  bell() { [1, 2.4, 3.9].forEach((m, i) => this.tone(1180 * m, 1.1 - i * .3, { gain: .07 / (i + 1) })); },
  fanfare() { [523, 659, 784, 1047].forEach((f, i) => this.tone(f, .5, { type: 'triangle', gain: .11, when: i * .11 })); },
  fail() { [392, 330, 262].forEach((f, i) => this.tone(f, .35, { type: 'triangle', gain: .09, when: i * .14 })); },
  discover() { [587, 740, 880, 1175].forEach((f, i) => this.tone(f, 1.2, { type: 'sine', gain: .08, when: i * .16, attack: .03 })); this.tone(293, 2, { type: 'triangle', gain: .05, attack: .2 }); },
  pick(v = 1) { this.tone(1900 * rand(.95, 1.05), .09, { type: 'square', gain: .05 * v }); this.noise(.12, { type: 'highpass', freq: 3000, gain: .3 * v }); this.tone(320, .1, { gain: .12 * v, slide: 160, type: 'triangle' }); },
  crumble() { for (let i = 0; i < 5; i++) this.noise(.15, { type: 'lowpass', freq: rand(300, 900), gain: .18, when: i * .06 }); },
  chime() { this.tone(2093, .6, { type: 'sine', gain: .06 }); this.tone(2637, .8, { type: 'sine', gain: .05, when: .08 }); this.tone(3136, 1, { type: 'sine', gain: .04, when: .16 }); },
  chest() { this.tone(220, .3, { type: 'sawtooth', gain: .04, slide: 330, lp: 900 }); this.coin(); after(.25, () => this.chime()); },
  jump() { this.noise(.12, { type: 'lowpass', freq: 600, gain: .08 }); },
  land(v = 1) { this.noise(.14, { type: 'lowpass', freq: 380, gain: .16 * v }); this.tone(80, .12, { gain: .1 * v, slide: 50 }); },
  roar() { this.noise(1.6, { type: 'bandpass', freq: 300, sweep: 120, gain: .5, q: 1.2, attack: .15 }); this.tone(90, 1.5, { type: 'sawtooth', gain: .08, slide: 55, lp: 500, attack: .2 }); },
  breath() { this.noise(1.8, { type: 'lowpass', freq: 1800, sweep: 400, gain: .4, attack: .1 }); },
  thunder(dist = 1) { const w = .2 + dist * 1.2; this.noise(2.5, { type: 'lowpass', freq: 600 / (1 + dist), sweep: 60, gain: .5 / (1 + dist * .6), when: w, q: .3, attack: .03 }); },
  step(surface, v = 1) {
    if (!this.ctx) return; v *= .8;
    if (surface === 'wood') { this.tone(140 * rand(.9, 1.1), .07, { type: 'triangle', gain: .07 * v, slide: 90 }); this.noise(.05, { type: 'lowpass', freq: 900, gain: .05 * v }); }
    else if (surface === 'stone') { this.noise(.05, { type: 'bandpass', freq: rand(1800, 2600), gain: .09 * v, q: 1.5 }); this.tone(220, .04, { type: 'triangle', gain: .03 * v }); }
    else if (surface === 'snow') this.noise(.16, { type: 'bandpass', freq: rand(900, 1400), gain: .1 * v, q: .5, attack: .02 });
    else if (surface === 'sand' || surface === 'ash') this.noise(.12, { type: 'highpass', freq: rand(2200, 3200), gain: .05 * v, attack: .015 });
    else if (surface === 'water') this.noise(.2, { type: 'bandpass', freq: rand(500, 800), gain: .12 * v, q: .6 });
    else this.noise(.09, { type: 'bandpass', freq: rand(600, 1100), gain: .07 * v, q: .5, attack: .01 });
  },
  bird() {
    const base = rand(2400, 4200), n = randi(2, 6), bus = this.ambBus;
    for (let i = 0; i < n; i++) { const t = i * rand(.08, .16); this.tone(base * rand(.9, 1.2), .09, { when: t, slide: base * rand(.6, 1.5), gain: .02 * this.amb.birds, bus, attack: .01 }); }
  },
  cricket() {
    const f = rand(4000, 4800), bus = this.ambBus;
    for (let i = 0; i < 3; i++) this.tone(f, .03, { when: i * .045, gain: .012 * this.amb.crickets, bus, type: 'triangle' });
  },
  update(dt) {
    if (!this.ctx) return;
    this.crackleT -= dt;
    if (this.fireLevel > .02 && this.crackleT <= 0) {
      this.crackleT = rand(.03, .25) / (.3 + this.fireLevel);
      this.noise(.03, { type: 'highpass', freq: rand(2000, 5200), gain: .05 * this.fireLevel });
    }
    const A = this.amb;
    this.loop('wind', A.wind * .16); this.loop('rain', A.rain * .22); this.loop('lava', A.lava * .4); this.loop('water', A.water * .1);
    if (this.loops.water) this.loops.water.f.frequency.setTargetAtTime(420 + Math.sin(G.time * .7) * 180, this.ctx.currentTime, .3);
    if (this.loops.wind) this.loops.wind.f.frequency.setTargetAtTime(300 + Math.sin(G.time * .23) * 140 + A.wind * 200, this.ctx.currentTime, .5);
    if (A.birds > .05) { this.birdT -= dt; if (this.birdT <= 0) { this.birdT = rand(1.2, 5) / A.birds; this.bird(); } }
    if (A.crickets > .05) { this.cricketT -= dt; if (this.cricketT <= 0) { this.cricketT = rand(.25, .9); this.cricket(); } }
    this.music.update(this);
  },
  music: {
    next: 0, step: 0, mode: 'shop', want: 'shop',
    // chord roots in MIDI, each bar 8 steps
    MODES: {
      shop:    { bpm: 82,  prog: [[50, 57, 62, 65], [48, 55, 60, 64], [46, 53, 58, 62], [48, 55, 60, 67]], pat: [0, 1, 2, 3, 2, 1, 2, 3], lead: .07, pad: .03, drum: 0 },
      explore: { bpm: 70,  prog: [[52, 59, 64, 67], [48, 55, 60, 64], [50, 57, 62, 66], [47, 54, 59, 62]], pat: [0, 2, 3, 1, 2, 3, 1, 2], lead: .05, pad: .045, drum: 0, sparse: true },
      night:   { bpm: 56,  prog: [[45, 52, 57, 60], [41, 48, 53, 57], [43, 50, 55, 59], [40, 47, 52, 55]], pat: [0, 3, 2, 3, 1, 3, 2, 3], lead: .035, pad: .05, drum: 0, sparse: true },
      battle:  { bpm: 116, prog: [[50, 57, 62, 65], [48, 55, 60, 64], [46, 53, 58, 62], [45, 52, 57, 61]], pat: [0, 2, 1, 3, 0, 2, 1, 3], lead: .07, pad: .025, drum: 1 },
      boss:    { bpm: 132, prog: [[45, 52, 57, 60], [46, 53, 58, 61], [43, 50, 55, 58], [44, 51, 56, 59]], pat: [0, 3, 1, 3, 0, 2, 1, 3], lead: .075, pad: .03, drum: 2 },
    },
    update(S) {
      const c = S.ctx; if (!settings.music) { this.next = c.currentTime + .2; return; }
      const M = this.MODES[this.mode] || this.MODES.shop, spb = 60 / M.bpm / 2;
      if (this.next < c.currentTime) this.next = c.currentTime + .05;
      while (this.next < c.currentTime + .25) {
        if (this.step % 32 === 0 && this.want !== this.mode) { this.mode = this.want; }
        this.play(S, this.step, this.next); this.next += spb; this.step++;
      }
    },
    play(S, step, t) {
      const M = this.MODES[this.mode] || this.MODES.shop;
      const bar = Math.floor(step / 8) % 4, i = step % 8, ch = M.prog[bar];
      const hz = m => 440 * Math.pow(2, (m - 69) / 12);
      const bus = S.musBus;
      const skip = M.sparse ? ((step * 7 + bar) % 5 === 0 || (step * 3) % 7 === 0) : (i === 5 || i === 7) && ((step * 7) % 5 === 0);
      if (!skip) {
        const n = hz(ch[M.pat[i]] + 12);
        S.tone(n, M.sparse ? 1.3 : .7, { type: 'triangle', gain: M.lead, at: t, bus, lp: 2600 });
        S.tone(n * 2, .25, { type: 'sine', gain: M.lead * .25, at: t, bus });
      }
      if (i === 0) {
        S.tone(hz(ch[0] - 12), 2.4, { type: 'sine', gain: .12, at: t, attack: .03, bus });
        for (let k = 1; k < 4; k++) S.tone(hz(ch[k]), 2.6, { type: 'sawtooth', gain: M.pad * .35, at: t, attack: .6, bus, lp: 900, detune: (k - 2) * 7 });
      }
      if (M.drum) {
        if (i % 4 === 0) S.tone(120, .22, { gain: .35, slide: 42, at: t, bus });
        if (i % 4 === 2) S.noise(.12, { type: 'bandpass', freq: 1800, gain: .1, at: t, bus });
        if (M.drum > 1 && i % 2 === 1) S.noise(.05, { type: 'highpass', freq: 6000, gain: .05, at: t, bus });
        if (M.drum > 1 && i === 6) S.tone(hz(ch[0] - 24), .3, { type: 'sawtooth', gain: .06, at: t, bus, lp: 400 });
      }
    }
  }
};
