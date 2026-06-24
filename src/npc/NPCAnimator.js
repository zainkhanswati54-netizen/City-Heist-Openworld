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
    // Reset any forward-lean/tilt left over from WORK/EAT/SHOP poses, which set
    // torso/head rotation.x directly — without this, an NPC could walk away from
    // a shop or work spot still visibly hunched forward.
    this.parts.torso.rotation.x = 0;
    this.parts.head.rotation.x = 0;
  }

  playIdle(dt) {
    this.phase += 0.04 * dt;
    const sway = Math.sin(this.phase) * 0.06;
    this.parts.torso.rotation.z = sway * 0.3;
    this.parts.torso.rotation.x = 0;
    this.parts.head.rotation.y = Math.sin(this.phase * 0.5) * 0.25;
    this.parts.head.rotation.x = 0;
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
    this.parts.head.rotation.x = 0;
    this.parts.torso.rotation.x = 0;
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

  // Hand-to-mouth eating gesture: one arm raised, head tilted down slightly, occasional
  // chewing-like head bob. Legs stay still since the NPC is standing/sitting at a food spot.
  playEat(dt) {
    this.phase += 0.1 * dt;
    const bite = Math.max(0, Math.sin(this.phase * 1.8)) * 0.5;
    this.parts.rightArm.rotation.x = -1.7 + bite * 0.3;
    this.parts.rightArm.rotation.z = 0.25;
    this.parts.leftArm.rotation.x = -0.1;
    this.parts.head.rotation.x = 0.12 - bite * 0.08;
    this.parts.leftLeg.rotation.x = 0;
    this.parts.rightLeg.rotation.x = 0;
  }

  // Browsing/shopping gesture: torso leaning slightly forward as if looking at a stall,
  // head tracking side to side, occasional arm reach as if picking something up.
  playShop(dt) {
    this.phase += 0.06 * dt;
    this.parts.torso.rotation.x = 0.1;
    this.parts.head.rotation.y = Math.sin(this.phase * 0.7) * 0.4;
    const reach = Math.max(0, Math.sin(this.phase * 0.9 + 1)) * 0.6;
    this.parts.leftArm.rotation.x = -reach;
    this.parts.rightArm.rotation.x = Math.sin(this.phase * 0.5) * 0.1;
    this.parts.leftLeg.rotation.x = 0;
    this.parts.rightLeg.rotation.x = 0;
  }

  // Repetitive work gesture (stocking shelves, sweeping, manual labor) — a steady
  // bent-forward stance with a repeating arm motion, distinct from idle's gentle sway.
  playWork(dt) {
    this.phase += 0.22 * dt;
    const motion = Math.sin(this.phase) * 0.55;
    this.parts.torso.rotation.x = 0.18;
    this.parts.rightArm.rotation.x = -0.6 + motion * 0.5;
    this.parts.leftArm.rotation.x = -0.4 - motion * 0.3;
    this.parts.head.rotation.x = 0.1;
    this.parts.leftLeg.rotation.x = 0;
    this.parts.rightLeg.rotation.x = 0;
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
