export class RainAmbientSound {
  constructor(audioManager) {
    this.audio = audioManager;
    this.nodes = null;
  }

  start() {
    if (!this.audio.ctx || this.nodes) return;
    const ctx = this.audio.ctx;

    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 3200;
    filter.Q.value = 0.5;

    const gain = ctx.createGain();
    gain.gain.value = 0;

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.audio.masterGain);
    noise.start();

    this.nodes = { noise, filter, gain };
  }

  setIntensity(value) {
    if (!this.nodes) return;
    this.nodes.gain.gain.value = Math.max(0, Math.min(1, value)) * 0.1;
  }

  stop() {
    if (!this.nodes) return;
    this.nodes.noise.stop();
    this.nodes = null;
  }
}
