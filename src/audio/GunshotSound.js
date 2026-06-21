export class GunshotSound {
  constructor(audioManager) {
    this.audio = audioManager;
  }

  play() {
    const ctx = this.audio.ctx;
    if (!ctx) return;
    const bufferSize = ctx.sampleRate * 0.08;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.value = 0.4;
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 800;
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.audio.masterGain);
    noise.start();
  }
}
