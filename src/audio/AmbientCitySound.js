export class AmbientCitySound {
  constructor(audioManager) {
    this.audio = audioManager;
    this.osc = null;
    this.gain = null;
  }

  start() {
    if (!this.audio.ctx || this.osc) return;
    this.osc = this.audio.ctx.createOscillator();
    this.gain = this.audio.ctx.createGain();
    this.osc.type = 'sine';
    this.osc.frequency.value = 90;
    this.gain.gain.value = 0.02;
    this.osc.connect(this.gain);
    this.gain.connect(this.audio.masterGain);
    this.osc.start();
  }

  stop() {
    if (!this.osc) return;
    this.osc.stop();
    this.osc = null;
  }
}
