export class WeaponSoundKit {
  constructor(audioManager) {
    this.audio = audioManager;
  }

  _burst(duration, filterFreq, gainValue, pitchDrop = 1) {
    const ctx = this.audio.ctx;
    if (!ctx) return;
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, pitchDrop);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.value = gainValue;
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = filterFreq;
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.audio.masterGain);
    noise.start();
  }

  play(soundType) {
    if (soundType === 'shotgun') {
      this._burst(0.16, 400, 0.5, 1.4);
      setTimeout(() => this._burst(0.1, 600, 0.25, 1.2), 18);
    } else if (soundType === 'rifle') {
      this._burst(0.05, 1000, 0.32, 0.8);
    } else {
      this._burst(0.08, 800, 0.4, 1);
    }
  }
}
