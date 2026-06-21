// Procedural city ambient sounds: distant traffic hum, occasional horn, crowd murmur.

export class CityAmbientSounds {
  constructor(audioManager) {
    this.audio = audioManager;
    this._nodes = [];
    this._hornTimer = null;
    this._active = false;
  }

  start() {
    if (this._active || !this.audio.ctx) return;
    this._active = true;
    const ctx = this.audio.ctx;

    // ── Low traffic rumble (filtered noise) ──────────────────────────────
    const bufSize = ctx.sampleRate * 4;
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) d[i] = Math.random() * 2 - 1;

    const rumbleSrc = ctx.createBufferSource();
    rumbleSrc.buffer = buf;
    rumbleSrc.loop = true;

    const rumbleFilter = ctx.createBiquadFilter();
    rumbleFilter.type = 'lowpass';
    rumbleFilter.frequency.value = 220;

    const rumbleGain = ctx.createGain();
    rumbleGain.gain.value = 0.014;

    rumbleSrc.connect(rumbleFilter);
    rumbleFilter.connect(rumbleGain);
    rumbleGain.connect(this.audio.masterGain);
    rumbleSrc.start();
    this._nodes.push(rumbleSrc);

    // ── Mid city hiss (bandpass, like distant crowd) ──────────────────────
    const hissSrc = ctx.createBufferSource();
    const hissBuf = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate);
    const hd = hissBuf.getChannelData(0);
    for (let i = 0; i < hd.length; i++) hd[i] = Math.random() * 2 - 1;
    hissSrc.buffer = hissBuf;
    hissSrc.loop = true;

    const hissBP = ctx.createBiquadFilter();
    hissBP.type = 'bandpass';
    hissBP.frequency.value = 1200;
    hissBP.Q.value = 0.4;

    const hissGain = ctx.createGain();
    hissGain.gain.value = 0.006;

    hissSrc.connect(hissBP);
    hissBP.connect(hissGain);
    hissGain.connect(this.audio.masterGain);
    hissSrc.start();
    this._nodes.push(hissSrc);

    // ── Random car horns ──────────────────────────────────────────────────
    this._scheduleHorn();
  }

  _scheduleHorn() {
    if (!this._active) return;
    const delay = 6000 + Math.random() * 18000; // 6-24 seconds
    this._hornTimer = setTimeout(() => {
      if (!this._active || !this.audio.ctx) return;
      this._playHorn();
      this._scheduleHorn();
    }, delay);
  }

  _playHorn() {
    const ctx = this.audio.ctx;
    const t = ctx.currentTime;

    // Two-tone car horn (like a real car)
    const tones = [
      { freq: 440, delay: 0,   dur: 0.22 },
      { freq: 554, delay: 0.01, dur: 0.18 }
    ];

    tones.forEach(({ freq, delay, dur }) => {
      const osc = ctx.createOscillator();
      osc.type = 'square';
      osc.frequency.value = freq;

      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 1200;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, t + delay);
      gain.gain.linearRampToValueAtTime(0.08, t + delay + 0.015);
      gain.gain.setValueAtTime(0.08, t + delay + dur - 0.03);
      gain.gain.linearRampToValueAtTime(0, t + delay + dur);

      osc.connect(lp);
      lp.connect(gain);
      gain.connect(this.audio.masterGain);
      osc.start(t + delay);
      osc.stop(t + delay + dur + 0.05);
    });
  }

  stop() {
    this._active = false;
    clearTimeout(this._hornTimer);
    this._nodes.forEach(n => { try { n.stop(); } catch (_) {} });
    this._nodes = [];
  }
}
