import { Car } from './Car.js';
import { TrafficAI } from './TrafficAI.js';
import { SETTINGS } from '../config/settings.js';

export class TrafficCar extends Car {
  constructor(x, z, color, route, isAggressive = false) {
    super(x, z, color);
    this.isAggressive = isAggressive;

    const baseSpeed = isAggressive
      ? SETTINGS.traffic.aggressiveBaseSpeed * (0.8 + Math.random() * 0.4)
      : SETTINGS.traffic.normalBaseSpeed   * (0.8 + Math.random() * 0.4);

    this.ai = new TrafficAI(route, route.axis === 'z' ? z : x, baseSpeed, isAggressive);
    this.group.position.set(x, 0.3, z);

    if (isAggressive) {
      this._tintAggressive();
    }
  }

  _tintAggressive() {
    this.group.traverse(child => {
      if (child.isMesh && child.material && child.material.color) {
        child.material = child.material.clone();
        child.material.emissive && child.material.emissive.setHex(0x220000);
        child.material.emissiveIntensity = 0.12;
      }
    });
  }

  updateTraffic(dt, trafficMultiplier = 1.0) {
    const result = this.ai.step(dt * trafficMultiplier);
    this.group.position.x = result.x;
    this.group.position.z = result.z;
    this.group.rotation.y = result.angle;

    const wheelSpin = result.stopped ? 0 : this.ai.speed * 2.2 * dt;
    this.wheels.forEach(w => w.spin(wheelSpin));
    this.exhaust.update(dt, !result.stopped);
  }
}
