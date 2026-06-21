export class NPCAnimator {
  constructor(parts) {
    this.parts = parts;
    this.phase = Math.random() * 10;
    this._sittingApplied = false;
  }

  update(dt, moving) {
    if (!moving) return;
    this.phase += 0.18 * dt;
    const swing = Math.sin(this.phase) * 0.5;
    this.parts.leftLeg.rotation.x = swing;
    this.parts.rightLeg.rotation.x = -swing;
    this.parts.leftArm.rotation.x = -swing * 0.7;
    this.parts.rightArm.rotation.x = swing * 0.7;
  }

  playIdle(dt) {
    this.phase += 0.04 * dt;
    const sway = Math.sin(this.phase) * 0.06;
    this.parts.torso.rotation.z = sway * 0.3;
    this.parts.head.rotation.y = Math.sin(this.phase * 0.5) * 0.25;
    this.parts.leftLeg.rotation.x = 0;
    this.parts.rightLeg.rotation.x = 0;
    this.parts.leftArm.rotation.x = sway;
    this.parts.rightArm.rotation.x = -sway;
  }

  playTalk(dt) {
    this.phase += 0.16 * dt;
    const gesture = Math.sin(this.phase) * 0.35;
    this.parts.rightArm.rotation.x = -0.9 + gesture * 0.4;
    this.parts.rightArm.rotation.z = gesture * 0.3;
    this.parts.leftArm.rotation.x = Math.sin(this.phase * 1.3) * 0.15;
    this.parts.head.rotation.y = Math.sin(this.phase * 0.4) * 0.15;
    this.parts.leftLeg.rotation.x = 0;
    this.parts.rightLeg.rotation.x = 0;
  }

  playSit() {
    if (this._sittingApplied) return;
    this.parts.leftLeg.rotation.x = -Math.PI / 2;
    this.parts.rightLeg.rotation.x = -Math.PI / 2;
    this.parts.leftLeg.position.z = 0.32;
    this.parts.rightLeg.position.z = 0.32;
    this.parts.torso.position.y -= 0.18;
    this.parts.head.position.y -= 0.18;
    this.parts.leftArm.position.y -= 0.1;
    this.parts.rightArm.position.y -= 0.1;
    this._sittingApplied = true;
  }

  resetPose() {
    if (!this._sittingApplied) return;
    this.parts.leftLeg.rotation.x = 0;
    this.parts.rightLeg.rotation.x = 0;
    this.parts.leftLeg.position.z = 0;
    this.parts.rightLeg.position.z = 0;
    this.parts.torso.position.y += 0.18;
    this.parts.head.position.y += 0.18;
    this.parts.leftArm.position.y += 0.1;
    this.parts.rightArm.position.y += 0.1;
    this._sittingApplied = false;
  }
}
