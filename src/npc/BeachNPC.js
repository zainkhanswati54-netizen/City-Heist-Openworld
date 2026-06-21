import { NPC } from './NPC.js';
import { NPCAnimator } from './NPCAnimator.js';
import { NPCActivity, ACTIVITY } from './NPCActivity.js';
import { PALETTE } from '../config/colors.js';
import { pick } from '../utils/RandomUtils.js';
import { SETTINGS } from '../config/settings.js';

const BEACHWEAR_COLORS = [0xff6b4a, 0x4ab5ff, 0xffd24a, 0x4aff9e, 0xff4ab0];

export class BeachNPC extends NPC {
  constructor(x, z) {
    super(x, z, pick(PALETTE.skin), pick(BEACHWEAR_COLORS), pick(BEACHWEAR_COLORS));
    this.animator = new NPCAnimator(this.parts);
    this.activity = new NPCActivity(ACTIVITY.IDLE);
    this.wanderAngle = Math.random() * Math.PI * 2;
    this.homeX = x;
    this.homeZ = z;
    this.wanderRadius = 6 + Math.random() * 5;
    this.lounging = Math.random() > 0.5;
  }

  update(dt) {
    if (this.lounging) {
      this.animator.playSit();
      this.animator.playIdle(dt * 0.25);
      return;
    }

    this.activity.update(dt, [ACTIVITY.WALK, ACTIVITY.IDLE]);
    if (this.activity.is(ACTIVITY.WALK)) {
      const speed = SETTINGS.npc.wanderSpeed * 0.8;
      this.group.position.x += Math.sin(this.wanderAngle) * speed * dt;
      this.group.position.z += Math.cos(this.wanderAngle) * speed * dt;
      this.group.rotation.y = this.wanderAngle;
      if (Math.abs(this.group.position.x - this.homeX) > this.wanderRadius ||
          Math.abs(this.group.position.z - this.homeZ) > this.wanderRadius) {
        this.wanderAngle += Math.PI * (0.7 + Math.random() * 0.6);
      }
      this.animator.update(dt, true);
    } else {
      this.animator.playIdle(dt);
    }
  }
}
