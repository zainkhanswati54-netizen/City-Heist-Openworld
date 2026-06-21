export class EngineSound {
  constructor(audioManager) {
    this.audio = audioManager;
    this.osc = null;
    this.gain = null;
  }

  start() {
    if (!this.audio.ctx || this.osc) return;
    this.osc = this.audio.ctx.createOscillator();
    this.gain = this.audio.ctx.createGain();
    this.osc.type = 'sawtooth';
    this.osc.frequency.value = 60;
    this.gain.gain.value = 0;
    this.osc.connect(this.gain);
    this.gain.connect(this.audio.masterGain);
    this.osc.start();
  }

  update(speed) {
    if (!this.osc) return;
    this.osc.frequency.value = 55 + speed * 220;
    this.gain.gain.value = Math.min(0.12, 0.02 + speed * 0.2);
  }

  stop() {
    if (!this.osc) return;
    this.osc.stop();
    this.osc = null;
  }
}
