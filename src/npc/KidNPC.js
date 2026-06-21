import * as THREE from 'three';
import { NPC } from './NPC.js';
import { NPCAnimator } from './NPCAnimator.js';
import { NPCActivity, ACTIVITY } from './NPCActivity.js';
import { PALETTE } from '../config/colors.js';
import { pick } from '../utils/RandomUtils.js';
import { SETTINGS } from '../config/settings.js';
import { standardMaterial } from '../utils/MaterialFactory.js';
import { applyShadowCasting } from '../lighting/ShadowConfig.js';
import { TIME_PERIOD } from './DaySchedule.js';

export class KidNPC extends NPC {
  constructor(x, z) {
    const skin = pick(PALETTE.skin);
    const cloth = pick(PALETTE.kidTones);
    const pants = pick(PALETTE.kidTones);
    super(x, z, skin, cloth, pants);

    // Kids are small — scale the whole group down
    this.group.scale.setScalar(0.6);

    // Add hair
    const hairMat = standardMaterial(pick(PALETTE.hair), { roughness: 0.85 });
    const hair = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.18, 0.5), hairMat);
    hair.position.y = 1.55;
    applyShadowCasting(hair, true, false);
    this.group.add(hair);

    this.animator = new NPCAnimator(this.parts);
    this.activity = new NPCActivity(ACTIVITY.WALK);
    this.wanderAngle = Math.random() * Math.PI * 2;
    this.homeX = x;
    this.homeZ = z;
    this.wanderRadius = 8 + Math.random() * 7;

    this.isPanicking = false;
    this.panicTimer = 0;
    this.panicAngle = 0;
    this.active = true;
    this.npcType = 'kid';
  }

  panic(fromX, fromZ) {
    this.isPanicking = true;
    this.panicTimer = 300 + Math.random() * 200;
    const dx = this.group.position.x - fromX;
    const dz = this.group.position.z - fromZ;
    const len = Math.sqrt(dx * dx + dz * dz) || 1;
    this.panicAngle = Math.atan2(dx / len, dz / len) + (Math.random() - 0.5);
    this.group.visible = true;
  }

  applySchedule(period) {
    // Kids are out during day, home at night/evening
    if (period === TIME_PERIOD.NIGHT) {
      this.active = false;
    } else if (period === TIME_PERIOD.EVENING) {
      this.active = Math.random() < 0.3;
    } else {
      this.active = true;
    }
    if (!this.isPanicking) this.group.visible = this.active;
  }

  update(dt, period) {
    if (!this.active && !this.isPanicking) return;
    if (this.isTalking) return;

    if (this.isPanicking) {
      this.panicTimer -= dt;
      if (this.panicTimer <= 0) {
        this.isPanicking = false;
        if (!this.active) { this.group.visible = false; return; }
      } else {
        // Kids run faster and more erratically
        const speed = SETTINGS.npc.wanderSpeed * 3.2;
        this.group.position.x += Math.sin(this.panicAngle) * speed * dt;
        this.group.position.z += Math.cos(this.panicAngle) * speed * dt;
        this.group.rotation.y = this.panicAngle;
        this.panicAngle += (Math.random() - 0.5) * 0.55;
        this.animator.update(dt, true);
        return;
      }
    }

    // Kids move faster and more randomly
    const speedMult = period === TIME_PERIOD.MORNING ? 1.5
                    : period === TIME_PERIOD.AFTERNOON ? 1.8
                    : 1.2;

    this.activity.update(dt, [ACTIVITY.WALK, ACTIVITY.WALK, ACTIVITY.IDLE]);

    if (this.activity.is(ACTIVITY.WALK)) {
      const speed = SETTINGS.npc.wanderSpeed * speedMult;
      this.group.position.x += Math.sin(this.wanderAngle) * speed * dt;
      this.group.position.z += Math.cos(this.wanderAngle) * speed * dt;
      this.group.rotation.y = this.wanderAngle;

      if (Math.abs(this.group.position.x - this.homeX) > this.wanderRadius ||
          Math.abs(this.group.position.z - this.homeZ) > this.wanderRadius) {
        this.wanderAngle += Math.PI * (0.6 + Math.random() * 0.8);
      } else if (Math.random() < 0.018) {
        this.wanderAngle += (Math.random() - 0.5) * 1.6;
      }
      this.animator.update(dt, true);
    } else {
      this.animator.playIdle(dt);
    }
  }
}
