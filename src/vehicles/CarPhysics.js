import { SETTINGS } from '../config/settings.js';

export class CarPhysics {
  constructor() {
    this.vx = 0;
    this.vz = 0;
    this.angle = 0;
    this.speed = 0;
  }

  step(input, collisionCheck, currentX, currentZ, dt = 1) {
    const cfg = SETTINGS.car;
    let accel = 0;
    if (input.forward) accel = cfg.accel;
    if (input.backward) accel = -cfg.reverseAccel;

    this.speed = Math.sqrt(this.vx * this.vx + this.vz * this.vz);

    // Determine if we're currently moving forward or backward relative to facing angle,
    // so steering feels correct in reverse (turning the wheel left while reversing
    // should swing the rear the opposite way visually, same as real driving).
    const facingX = Math.sin(this.angle);
    const facingZ = Math.cos(this.angle);
    const movingForward = (this.vx * facingX + this.vz * facingZ) >= 0;
    const steerDirection = movingForward ? 1 : -1;

    const steerFactor = Math.min(this.speed / cfg.minSteerSpeed, 1);
    if (input.left) this.angle += cfg.steerRate * steerFactor * steerDirection * dt;
    if (input.right) this.angle -= cfg.steerRate * steerFactor * steerDirection * dt;

    this.vx += Math.sin(this.angle) * accel * dt;
    this.vz += Math.cos(this.angle) * accel * dt;

    let frictionFactor = cfg.friction;
    if (input.handbrake) frictionFactor = cfg.handbrakeFriction;
    else if (!input.forward && !input.backward && this.speed > 0.01) frictionFactor = cfg.brakeFriction;

    // Friction is a per-nominal-frame multiplicative decay (e.g. 0.93 = keep 93% of speed
    // each 16.67ms). Raising it to the power of dt (rather than just multiplying) keeps the
    // *total* decay over one real second consistent regardless of how many frames dt spans —
    // naive `*= frictionFactor` would make cars decelerate faster on high-refresh displays.
    const frameFriction = Math.pow(frictionFactor, dt);
    this.vx *= frameFriction;
    this.vz *= frameFriction;

    const newSpeed = Math.sqrt(this.vx * this.vx + this.vz * this.vz);
    if (newSpeed > cfg.maxSpeed) {
      const scale = cfg.maxSpeed / newSpeed;
      this.vx *= scale;
      this.vz *= scale;
    }

    // Handbrake adds a touch of lateral slide for a more arcade drift feel.
    if (input.handbrake && this.speed > 0.15) {
      const lateralX = Math.cos(this.angle);
      const lateralZ = -Math.sin(this.angle);
      const slideAmount = this.speed * 0.06 * (input.left ? -1 : input.right ? 1 : 0) * dt;
      this.vx += lateralX * slideAmount;
      this.vz += lateralZ * slideAmount;
    }

    const nx = currentX + this.vx * dt;
    const nz = currentZ + this.vz * dt;

    if (collisionCheck(nx, nz, cfg.collisionRadius)) {
      this.vx *= -0.25;
      this.vz *= -0.25;
      return { x: currentX, z: currentZ, collided: true };
    }

    return { x: nx, z: nz, collided: false };
  }
}
