import { SETTINGS } from '../config/settings.js';

export class TrafficAI {
  constructor(route, startPos, baseSpeed, isAggressive = false) {
    this.route = route;
    this.pos = startPos;
    this.baseSpeed = baseSpeed;
    this.speed = baseSpeed;
    this.direction = Math.random() < 0.5 ? 1 : -1;
    this.isAggressive = isAggressive;

    this.isStopped = false;
    this.stopTimer = 0;
    this._nextStopOffset = this._randomInterval();
    this._stopCheckPos = this.pos + this._nextStopOffset * this.direction;
  }

  _randomInterval() {
    const cfg = SETTINGS.traffic;
    return cfg.redLightIntervalMin + Math.random() * (cfg.redLightIntervalMax - cfg.redLightIntervalMin);
  }

  _randomStopDuration() {
    const cfg = SETTINGS.traffic;
    return cfg.redLightStopMin + Math.random() * (cfg.redLightStopMax - cfg.redLightStopMin);
  }

  step(dt) {
    if (!this.isAggressive) {
      if (this.isStopped) {
        this.stopTimer -= dt;
        if (this.stopTimer <= 0) {
          this.isStopped = false;
          this._stopCheckPos = this.pos + this._randomInterval() * this.direction;
        }
        return this._makeResult();
      }

      const pastCheck = this.direction > 0
        ? this.pos >= this._stopCheckPos
        : this.pos <= this._stopCheckPos;

      if (pastCheck) {
        if (Math.random() < 0.65) {
          this.isStopped = true;
          this.stopTimer = this._randomStopDuration();
        } else {
          this._stopCheckPos = this.pos + this._randomInterval() * this.direction;
        }
        return this._makeResult();
      }
    }

    const targetSpeed = this.isAggressive
      ? SETTINGS.traffic.aggressiveBaseSpeed
      : SETTINGS.traffic.normalBaseSpeed;

    this.speed += (targetSpeed - this.speed) * 0.04;
    this.pos += this.direction * this.speed * dt;

    const { min, max } = this.route;
    if (this.pos > max) {
      this.pos = max;
      this.direction = -1;
      this._stopCheckPos = this.pos + this._randomInterval() * this.direction;
    }
    if (this.pos < min) {
      this.pos = min;
      this.direction = 1;
      this._stopCheckPos = this.pos + this._randomInterval() * this.direction;
    }

    return this._makeResult();
  }

  _makeResult() {
    if (this.route.axis === 'z') {
      return {
        x: this.route.fixed + this.route.lane,
        z: this.pos,
        angle: this.direction > 0 ? 0 : Math.PI,
        stopped: this.isStopped
      };
    }
    return {
      x: this.pos,
      z: this.route.fixed + this.route.lane,
      angle: this.direction > 0 ? Math.PI / 2 : -Math.PI / 2,
      stopped: this.isStopped
    };
  }
}
