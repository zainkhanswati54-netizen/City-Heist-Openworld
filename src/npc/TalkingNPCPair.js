import { PedestrianNPC } from './PedestrianNPC.js';
import { ACTIVITY } from './NPCActivity.js';

export class TalkingNPCPair {
  constructor(x, z, facingAngle = 0) {
    const offset = 0.55;
    const dx = Math.sin(facingAngle) * offset;
    const dz = Math.cos(facingAngle) * offset;

    this.npcA = new PedestrianNPC(x - dx, z - dz);
    this.npcB = new PedestrianNPC(x + dx, z + dz);

    this.npcA.group.rotation.y = facingAngle;
    this.npcB.group.rotation.y = facingAngle + Math.PI;

    this.npcA.activity.current = ACTIVITY.TALK;
    this.npcB.activity.current = ACTIVITY.TALK;
    this.npcA.isTalking = true;
    this.npcB.isTalking = true;
    this.isActive = true;
    this.conversationTimer = 0;
    this.conversationDuration = this.npcA.activity.duration * 2;
  }

  get npcs() {
    return [this.npcA, this.npcB];
  }

  update(dt) {
    if (!this.isActive) return;
    this.npcA.animator.playTalk(dt);
    this.npcB.animator.playTalk(dt);
    this.conversationTimer += dt;
    if (this.conversationTimer > this.conversationDuration) {
      this.npcA.isTalking = false;
      this.npcB.isTalking = false;
      this.isActive = false;
    }
  }
}
