// Lamborghini Urus-inspired V8 engine sound — 4.0L twin-turbo character.
// Three tonal layers: fundamental cylinder fire, 4th harmonic (dominant in V8s),
// 8th harmonic (exhaust bark), plus a turbo hiss that rises with RPM.
export class ProceduralEngineLayer {
  constructor(audioManager) {
    this.audio = audioManager;
    this.nodes = null;
  }

  start() {
    if (!this.audio.ctx || this.nodes) return;
    const ctx = this.audio.ctx;

    // ── Fundamental "cylinder fire" ───────────────────────────────────────
    // Urus idle ≈ 800 RPM → 800/60 × 4 cylinders = ~53 Hz
    const fund = ctx.createOscillator();
    fund.type = 'sawtooth';
    fund.frequency.value = 53;

    // ── 4th harmonic — the dominant V8 bark ──────────────────────────────
    const h4 = ctx.createOscillator();
    h4.type = 'sawtooth';
    h4.frequency.value = 212;
    const h4g = ctx.createGain();
    h4g.gain.value = 0.38;

    // ── 8th harmonic — exhaust note character ─────────────────────────────
    const h8 = ctx.createOscillator();
    h8.type = 'square';
    h8.frequency.value = 424;
    const h8g = ctx.createGain();
    h8g.gain.value = 0.14;

    // ── Body resonance / cabin rumble (low noise) ─────────────────────────
    const bufSize = ctx.sampleRate * 2;
    const noiseBuf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const nd = noiseBuf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) nd[i] = Math.random() * 2 - 1;

    const bodyNoise = ctx.createBufferSource();
    bodyNoise.buffer = noiseBuf;
    bodyNoise.loop = true;
    const bodyLp = ctx.createBiquadFilter();
    bodyLp.type = 'lowpass';
    bodyLp.frequency.value = 180;
    const bodyG = ctx.createGain();
    bodyG.gain.value = 0.035;

    // ── Turbo hiss — rises from 30 % throttle ─────────────────────────────
    const turboNoise = ctx.createBufferSource();
    turboNoise.buffer = noiseBuf;
    turboNoise.loop = true;
    const turboBp = ctx.createBiquadFilter();
    turboBp.type = 'bandpass';
    turboBp.frequency.value = 900;
    turboBp.Q.value = 0.7;
    const turboG = ctx.createGain();
    turboG.gain.value = 0;

    // ── Master gain ────────────────────────────────────────────────────────
    const masterGain = ctx.createGain();
    masterGain.gain.value = 0;

    fund.connect(masterGain);
    h4.connect(h4g);        h4g.connect(masterGain);
    h8.connect(h8g);        h8g.connect(masterGain);
    bodyNoise.connect(bodyLp); bodyLp.connect(bodyG); bodyG.connect(masterGain);
    turboNoise.connect(turboBp); turboBp.connect(turboG); turboG.connect(masterGain);
    masterGain.connect(this.audio.masterGain);

    fund.start(); h4.start(); h8.start(); bodyNoise.start(); turboNoise.start();

    this.nodes = { fund, h4, h8, turboBp, turboG, masterGain };
  }

  update(speedRatio) {
    if (!this.nodes) return;
    const { fund, h4, h8, turboBp, turboG, masterGain } = this.nodes;
    const sr = Math.max(0, Math.min(1, speedRatio));

    // RPM curve: idle 53 Hz → redline 165 Hz
    const base = 53 + sr * 112;
    fund.frequency.value = base;
    h4.frequency.value   = base * 4;
    h8.frequency.value   = base * 8;

    // Turbo: silent at low RPM, hiss from 35 % throttle
    turboBp.frequency.value = 700 + sr * 3800;
    turboG.gain.value       = Math.max(0, (sr - 0.35) * 0.22);

    // Volume: soft idle, full voice at high throttle
    masterGain.gain.value = Math.min(0.20, 0.025 + sr * 0.20);
  }

  stop() {
    if (!this.nodes) return;
    const { fund, h4, h8 } = this.nodes;
    try { fund.stop(); h4.stop(); h8.stop(); } catch (_) {}
    this.nodes = null;
  }
}
