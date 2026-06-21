// Procedural urban background music — no external files, 100% Web Audio API.
// Generates a looping hip-hop/city groove with kick, snare, hi-hats, bass synth, and pad chords.

const NOTE = {
  C1: 32.70, D1: 36.71, Eb1: 38.89, F1: 43.65, G1: 49.00, Bb1: 58.27, C2: 65.41,
  D2: 73.42, Eb2: 77.78, F2: 87.31, G2: 98.00, Bb2: 116.54, C3: 130.81,
  D3: 146.83, F3: 174.61, G3: 196.00
};

// 16-step patterns (1=hit, 0=rest)
const KICK_PAT  = [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0];
const SNARE_PAT = [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0];
const HIHAT_PAT = [1,0,1,0, 1,0,1,1, 1,0,1,0, 1,0,1,0];
const OPEN_PAT  = [0,0,0,0, 0,0,0,1, 0,0,0,0, 0,0,0,0];

// 16-step bass line (null = rest)
const BASS_PAT = [
  NOTE.C2, null, NOTE.C2, null,
  NOTE.G1, null, NOTE.Bb1, null,
  NOTE.C2, null, NOTE.F1, null,
  NOTE.G1, null, null,    null
];

// Pad chord roots (played every 8 steps, minor triad)
const PAD_ROOTS = [NOTE.C3, NOTE.Bb2, NOTE.F3, NOTE.G3];

export class CityMusicPlayer {
  constructor(audioManager) {
    this.audio = audioManager;
    this._playing = false;
    this._step = 0;
    this._nextTime = 0;
    this._rafId = null;
    this._padIdx = 0;
    this._bpm = 92;
    this._stepDur = (60 / this._bpm) / 4; // 16th note in seconds
    this._masterGain = null;
    this._lookahead = 0.12; // schedule this far ahead
  }

  start() {
    if (this._playing || !this.audio.ctx) return;
    const ctx = this.audio.ctx;

    this._masterGain = ctx.createGain();
    this._masterGain.gain.setValueAtTime(0, ctx.currentTime);
    this._masterGain.gain.linearRampToValueAtTime(0.38, ctx.currentTime + 3.0);
    this._masterGain.connect(this.audio.masterGain);

    this._playing = true;
    this._nextTime = ctx.currentTime + 0.05;
    this._step = 0;
    this._padIdx = 0;
    this._schedule();
  }

  stop() {
    if (!this._playing) return;
    this._playing = false;
    if (this._rafId) cancelAnimationFrame(this._rafId);
    if (this._masterGain) {
      const ctx = this.audio.ctx;
      this._masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);
    }
  }

  _schedule() {
    if (!this._playing) return;
    const ctx = this.audio.ctx;

    while (this._nextTime < ctx.currentTime + this._lookahead) {
      this._scheduleStep(this._step, this._nextTime);
      this._step = (this._step + 1) % 16;
      this._nextTime += this._stepDur;
    }

    this._rafId = requestAnimationFrame(() => this._schedule());
  }

  _scheduleStep(step, t) {
    if (KICK_PAT[step])  this._kick(t);
    if (SNARE_PAT[step]) this._snare(t);
    if (HIHAT_PAT[step]) this._hihat(t, true);
    if (OPEN_PAT[step])  this._hihat(t, false);

    const bassNote = BASS_PAT[step];
    if (bassNote) this._bass(t, bassNote);

    // Play pad chord every 8 steps (2 beats)
    if (step % 8 === 0) {
      const root = PAD_ROOTS[this._padIdx % PAD_ROOTS.length];
      if (step === 0) this._padIdx++;
      this._pad(t, [root, root * 1.189, root * 1.498]); // minor triad ratios
    }
  }

  // ── Kick drum: sine sweep from 160Hz → 40Hz ───────────────────────────
  _kick(t) {
    const ctx = this.audio.ctx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(160, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.08);
    gain.gain.setValueAtTime(1.0, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
    osc.connect(gain);
    gain.connect(this._masterGain);
    osc.start(t);
    osc.stop(t + 0.25);
  }

  // ── Snare: noise burst bandpass ───────────────────────────────────────
  _snare(t) {
    const ctx = this.audio.ctx;
    const bufLen = ctx.sampleRate * 0.18;
    const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;

    const src = ctx.createBufferSource();
    src.buffer = buf;

    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 1800;
    bp.Q.value = 0.7;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.55, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

    // Add a quick tonal click for the body
    const body = ctx.createOscillator();
    body.type = 'triangle';
    body.frequency.setValueAtTime(220, t);
    body.frequency.exponentialRampToValueAtTime(110, t + 0.06);
    const bodyGain = ctx.createGain();
    bodyGain.gain.setValueAtTime(0.3, t);
    bodyGain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
    body.connect(bodyGain);
    bodyGain.connect(this._masterGain);
    body.start(t); body.stop(t + 0.08);

    src.connect(bp);
    bp.connect(gain);
    gain.connect(this._masterGain);
    src.start(t);
  }

  // ── Hi-hat: short noise, highpass ─────────────────────────────────────
  _hihat(t, closed = true) {
    const ctx = this.audio.ctx;
    const dur = closed ? 0.045 : 0.18;
    const bufLen = Math.ceil(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;

    const src = ctx.createBufferSource();
    src.buffer = buf;

    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = closed ? 9000 : 6000;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(closed ? 0.22 : 0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    src.connect(hp);
    hp.connect(gain);
    gain.connect(this._masterGain);
    src.start(t);
  }

  // ── Bass synth: sawtooth + lowpass ────────────────────────────────────
  _bass(t, freq) {
    const ctx = this.audio.ctx;
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, t);

    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 400;
    lp.Q.value = 2.5;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0, t);
    gain.gain.linearRampToValueAtTime(0.7, t + 0.01);
    gain.gain.setValueAtTime(0.7, t + this._stepDur * 1.5);
    gain.gain.linearRampToValueAtTime(0.0, t + this._stepDur * 2.0);

    osc.connect(lp);
    lp.connect(gain);
    gain.connect(this._masterGain);
    osc.start(t);
    osc.stop(t + this._stepDur * 2.2);
  }

  // ── Pad chord: slow attack sine triad ─────────────────────────────────
  _pad(t, freqs) {
    const ctx = this.audio.ctx;
    const dur = this._stepDur * 8;

    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = i === 0 ? 'sine' : 'triangle';
      osc.frequency.value = freq;

      const detune = (Math.random() - 0.5) * 6;
      osc.detune.value = detune;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0, t);
      gain.gain.linearRampToValueAtTime(0.06, t + 0.3);
      gain.gain.setValueAtTime(0.06, t + dur - 0.3);
      gain.gain.linearRampToValueAtTime(0.0, t + dur);

      osc.connect(gain);
      gain.connect(this._masterGain);
      osc.start(t);
      osc.stop(t + dur + 0.05);
    });
  }
}
