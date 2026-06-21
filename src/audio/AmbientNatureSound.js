export class AmbientNatureSound {
  constructor(audioManager) {
    this.audio = audioManager;
    this.nodes = null;
  }

  start() {
    if (!this.audio.ctx || this.nodes) return;
    const ctx = this.audio.ctx;

    const wind = ctx.createOscillator();
    wind.type = 'sine';
    wind.frequency.value = 70;
    const windGain = ctx.createGain();
    windGain.gain.value = 0.015;

    const bufferSize = ctx.sampleRate * 3;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const breeze = ctx.createBufferSource();
    breeze.buffer = buffer;
    breeze.loop = true;
    const breezeFilter = ctx.createBiquadFilter();
    breezeFilter.type = 'bandpass';
    breezeFilter.frequency.value = 900;
    breezeFilter.Q.value = 0.6;
    const breezeGain = ctx.createGain();
    breezeGain.gain.value = 0.012;

    wind.connect(windGain);
    windGain.connect(this.audio.masterGain);
    breeze.connect(breezeFilter);
    breezeFilter.connect(breezeGain);
    breezeGain.connect(this.audio.masterGain);

    wind.start();
    breeze.start();

    this.nodes = { wind, breeze };
  }

  stop() {
    if (!this.nodes) return;
    this.nodes.wind.stop();
    this.nodes.breeze.stop();
    this.nodes = null;
  }
}
