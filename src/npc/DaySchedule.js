export const TIME_PERIOD = {
  MORNING: 'morning',
  AFTERNOON: 'afternoon',
  EVENING: 'evening',
  NIGHT: 'night'
};

export class DaySchedule {
  constructor() {
    this.period = TIME_PERIOD.MORNING;
    this._lastPeriod = null;
    this.t = 0;
  }

  update(dayNightT) {
    this.t = dayNightT;
    const cycle = ((dayNightT % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    this._lastPeriod = this.period;
    if (cycle < Math.PI * 0.5) this.period = TIME_PERIOD.MORNING;
    else if (cycle < Math.PI) this.period = TIME_PERIOD.AFTERNOON;
    else if (cycle < Math.PI * 1.5) this.period = TIME_PERIOD.EVENING;
    else this.period = TIME_PERIOD.NIGHT;
  }

  get periodChanged() {
    return this.period !== this._lastPeriod;
  }

  is(period) {
    return this.period === period;
  }

  get isBusy() {
    return this.period === TIME_PERIOD.MORNING || this.period === TIME_PERIOD.AFTERNOON;
  }

  get isActive() {
    return this.period !== TIME_PERIOD.NIGHT;
  }

  get speedMultiplier() {
    switch (this.period) {
      case TIME_PERIOD.MORNING:   return 1.35;
      case TIME_PERIOD.AFTERNOON: return 1.0;
      case TIME_PERIOD.EVENING:   return 0.72;
      case TIME_PERIOD.NIGHT:     return 0.45;
      default: return 1.0;
    }
  }

  get crowdMultiplier() {
    switch (this.period) {
      case TIME_PERIOD.MORNING:   return 1.0;
      case TIME_PERIOD.AFTERNOON: return 1.0;
      case TIME_PERIOD.EVENING:   return 0.6;
      case TIME_PERIOD.NIGHT:     return 0.12;
      default: return 1.0;
    }
  }

  get trafficMultiplier() {
    switch (this.period) {
      case TIME_PERIOD.MORNING:   return 1.2;
      case TIME_PERIOD.AFTERNOON: return 1.0;
      case TIME_PERIOD.EVENING:   return 1.1;
      case TIME_PERIOD.NIGHT:     return 0.3;
      default: return 1.0;
    }
  }
}
