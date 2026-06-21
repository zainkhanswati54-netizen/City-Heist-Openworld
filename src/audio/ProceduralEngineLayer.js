export class ProceduralEngineLayer {
  constructor(audioManager) {
    this.audio = audioManager;
    this.nodes = null;
  }

  start() {
    if (!this.audio.ctx || this.nodes) return;
    const ctx = this.audio.ctx;

    const fundamental = ctx.createOscillator();
    fundamental.type = 'sawtooth';
    fundamental.frequency.value = 55;

    const harmonic = ctx.createOscillator();
    harmonic.type = 'square';
    harmonic.frequency.value = 110;

    const harmonicGain = ctx.createGain();
    harmonicGain.gain.value = 0.18;

    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.value = 180;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.05;

    const masterEngineGain = ctx.createGain();
    masterEngineGain.gain.value = 0;

    fundamental.connect(masterEngineGain);
    harmonic.connect(harmonicGain);
    harmonicGain.connect(masterEngineGain);
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(masterEngineGain);
    masterEngineGain.connect(this.audio.masterGain);

    fundamental.start();
    harmonic.start();
    noise.start();

    this.nodes = { fundamental, harmonic, harmonicGain, noiseFilter, noiseGain, masterEngineGain };
  }

  update(speedRatio) {
    if (!this.nodes) return;
    const { fundamental, harmonic, noiseFilter, masterEngineGain } = this.nodes;
    fundamental.frequency.value = 50 + speedRatio * 260;
    harmonic.frequency.value = 100 + speedRatio * 420;
    noiseFilter.frequency.value = 150 + speedRatio * 600;
    masterEngineGain.gain.value = Math.min(0.14, 0.02 + speedRatio * 0.16);
  }

  stop() {
    if (!this.nodes) return;
    this.nodes.fundamental.stop();
    this.nodes.harmonic.stop();
    this.nodes = null;
  }
}
