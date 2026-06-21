export class PlayerAnimator {
  constructor(parts) {
    this.parts = parts;
    this.phase = 0;
  }

  update(dt, moving, running) {
    if (!moving) {
      this.parts.leftLeg.rotation.x *= 0.8;
      this.parts.rightLeg.rotation.x *= 0.8;
      this.parts.leftArm.rotation.x *= 0.8;
      this.parts.rightArm.rotation.x *= 0.8;
      return;
    }
    const speed = running ? 0.32 : 0.2;
    this.phase += speed * dt;
    const swing = Math.sin(this.phase) * 0.55;
    this.parts.leftLeg.rotation.x = swing;
    this.parts.rightLeg.rotation.x = -swing;
    this.parts.leftArm.rotation.x = -swing * 0.8;
    this.parts.rightArm.rotation.x = swing * 0.8;
  }
}
