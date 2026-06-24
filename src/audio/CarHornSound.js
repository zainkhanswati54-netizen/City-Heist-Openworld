export class CarHornSound {
  constructor(audioManager) {
    this.audio = audioManager;
  }

  play() {
    const ctx = this.audio.ctx;
    if (!ctx) return;

    // Classic car horns are two close, slightly dissonant tones played together
    // (commonly around 400-500Hz), not a single pure pitch.
    [415, 466].forEach(freq => {
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.value = freq;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.02);
      gain.gain.setValueAtTime(0.18, ctx.currentTime + 0.32);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.42);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 1800;

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.audio.masterGain);
      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    });
  }
}
