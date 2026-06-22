// Low-frequency engine rumble played while traffic cars are nearby.
// Simulates multiple idling / cruising V8s blending into one ambient texture.
export class TrafficAmbientHum {
  constructor(audioManager) {
    this.audio    = audioManager;
    this._gain    = null;
    this._nodes   = null;
    this._target  = 0;
  }

  start() {
    if (!this.audio.ctx || this._nodes) return;
    const ctx = this.audio.ctx;

    // Three slightly detuned oscillators create a "beating" chorus effect
    const freqs = [38, 43, 51];
    const oscs  = freqs.map(f => {
      const o = ctx.createOscillator();
      o.type = 'sawtooth';
      o.frequency.value = f;
      return o;
    });

    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 220;
    lp.Q.value = 0.8;

    const gain = ctx.createGain();
    gain.gain.value = 0;

    oscs.forEach(o => { o.connect(lp); o.start(); });
    lp.connect(gain);
    gain.connect(this.audio.masterGain);

    this._gain  = gain;
    this._nodes = oscs;
  }

  /**
   * Call every game frame.
   * @param {number} nearCount  how many traffic cars are within cull range
   */
  update(nearCount) {
    if (!this._gain) return;
    // Target volume: 0 = no cars, 0.055 = 6 + cars nearby
    this._target = Math.min(0.055, nearCount * 0.009);
    // Smooth transition to avoid pops
    const cur = this._gain.gain.value;
    this._gain.gain.value += (this._target - cur) * 0.04;
  }

  stop() {
    if (!this._nodes) return;
    this._nodes.forEach(o => { try { o.stop(); } catch (_) {} });
    this._nodes = null;
    this._gain  = null;
  }
}
