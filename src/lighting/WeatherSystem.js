export const WEATHER_TYPE = {
  CLEAR: 'clear',
  OVERCAST: 'overcast',
  RAIN: 'rain',
  STORM: 'storm'
};

const TRANSITIONS = {
  [WEATHER_TYPE.CLEAR]: [WEATHER_TYPE.CLEAR, WEATHER_TYPE.CLEAR, WEATHER_TYPE.OVERCAST],
  [WEATHER_TYPE.OVERCAST]: [WEATHER_TYPE.CLEAR, WEATHER_TYPE.RAIN, WEATHER_TYPE.OVERCAST],
  [WEATHER_TYPE.RAIN]: [WEATHER_TYPE.OVERCAST, WEATHER_TYPE.STORM, WEATHER_TYPE.RAIN],
  [WEATHER_TYPE.STORM]: [WEATHER_TYPE.RAIN, WEATHER_TYPE.RAIN]
};

export class WeatherSystem {
  constructor() {
    this.current = WEATHER_TYPE.CLEAR;
    this.timer = 0;
    this.duration = 600 + Math.random() * 600;
    this.transitionProgress = 1; // 0 = just started transitioning, 1 = fully settled
    this.transitionSpeed = 0.004;
  }

  update(dt) {
    this.timer += dt;
    if (this.transitionProgress < 1) {
      this.transitionProgress = Math.min(1, this.transitionProgress + this.transitionSpeed * dt);
    }
    if (this.timer > this.duration) {
      this.timer = 0;
      this.duration = 500 + Math.random() * 700;
      const options = TRANSITIONS[this.current];
      this.current = options[Math.floor(Math.random() * options.length)];
      this.transitionProgress = 0;
    }
  }

  // 0 = clear sky, 1 = full storm darkness/intensity — used to blend lighting, fog, particles.
  get intensity() {
    const base = this.current === WEATHER_TYPE.CLEAR ? 0
      : this.current === WEATHER_TYPE.OVERCAST ? 0.35
      : this.current === WEATHER_TYPE.RAIN ? 0.7
      : 1;
    return base * this.transitionProgress + (this.current === WEATHER_TYPE.CLEAR ? 0 : base * (1 - this.transitionProgress) * 0.3);
  }

  get isRaining() {
    return this.current === WEATHER_TYPE.RAIN || this.current === WEATHER_TYPE.STORM;
  }

  get isStorm() {
    return this.current === WEATHER_TYPE.STORM;
  }

  forceWeather(type) {
    if (!WEATHER_TYPE[type.toUpperCase()] && !Object.values(WEATHER_TYPE).includes(type)) return;
    this.current = type;
    this.transitionProgress = 0;
    this.timer = 0;
  }
}
