import { RainParticles } from './RainParticles.js';
import { LightningFlash } from './LightningFlash.js';

const WEATHER_STATES = {
  CLEAR: 'clear',
  CLOUDY: 'cloudy',
  RAIN: 'rain',
  STORM: 'storm'
};

const STATE_INTENSITY = {
  [WEATHER_STATES.CLEAR]: 0,
  [WEATHER_STATES.CLOUDY]: 0,
  [WEATHER_STATES.RAIN]: 0.55,
  [WEATHER_STATES.STORM]: 1
};

export class WeatherSystem {
  constructor(scene, roadMaterial, onThunder) {
    this.scene = scene;
    this.roadMaterial = roadMaterial;
    this._dryRoughness = roadMaterial ? roadMaterial.roughness : 0.95;
    this._dryMetalness = roadMaterial ? roadMaterial.metalness : 0.02;

    this.rain = new RainParticles();
    this.rain.addToScene(scene);
    this.lightning = new LightningFlash(scene, onThunder);

    this.state = WEATHER_STATES.CLEAR;
    this.targetIntensity = 0;
    this.currentIntensity = 0;
    this.changeTimer = 0;
    this.nextChangeIn = 90 + Math.random() * 120;
  }

  setState(state) {
    if (!STATE_INTENSITY.hasOwnProperty(state)) return;
    this.state = state;
    this.targetIntensity = STATE_INTENSITY[state];
  }

  _maybeChangeWeather(dt) {
    this.changeTimer += dt;
    if (this.changeTimer < this.nextChangeIn) return;
    this.changeTimer = 0;
    this.nextChangeIn = 200 + Math.random() * 300;

    // Weighted toward staying clear most of the time — rain/storms are an occasional
    // event rather than a constant downpour, which would get monotonous quickly.
    const roll = Math.random();
    if (roll < 0.55) this.setState(WEATHER_STATES.CLEAR);
    else if (roll < 0.75) this.setState(WEATHER_STATES.CLOUDY);
    else if (roll < 0.93) this.setState(WEATHER_STATES.RAIN);
    else this.setState(WEATHER_STATES.STORM);
  }

  update(dt, viewerX, viewerZ) {
    this._maybeChangeWeather(dt);

    // Smooth transition toward the target intensity rather than snapping instantly,
    // so rain fades in/out instead of switching on like a light switch.
    const transitionSpeed = 0.0025;
    this.currentIntensity += (this.targetIntensity - this.currentIntensity) * Math.min(1, transitionSpeed * dt);

    this.rain.setIntensity(this.currentIntensity);
    this.rain.update(dt, viewerX, viewerZ);
    this.lightning.update(dt, this.currentIntensity, viewerX, viewerZ);

    if (this.roadMaterial) {
      // Wet roads: lower roughness + slight metalness bump reads as a glossy/reflective sheen.
      this.roadMaterial.roughness = this._dryRoughness - this.currentIntensity * 0.55;
      this.roadMaterial.metalness = this._dryMetalness + this.currentIntensity * 0.25;
    }
  }

  get rainIntensity() {
    return this.currentIntensity;
  }
}
