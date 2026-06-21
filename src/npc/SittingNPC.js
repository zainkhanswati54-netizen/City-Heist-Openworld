import { PedestrianNPC } from './PedestrianNPC.js';

export class SittingNPC extends PedestrianNPC {
  constructor(x, z, facingAngle = 0) {
    super(x, z);
    this.group.rotation.y = facingAngle;
    this.group.position.y = -0.05;
    this.isSitting = true;
  }

  update(dt) {
    this.animator.playSit();
    this.animator.playIdle(dt * 0.3);
  }
}
