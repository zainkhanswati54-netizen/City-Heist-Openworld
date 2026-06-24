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

export class WomanNPC extends NPC {
  constructor(x, z) {
    const skin = pick(PALETTE.skin);
    const cloth = pick(PALETTE.femaleTones);
    const pants = pick(PALETTE.femaleTones);
    super(x, z, skin, cloth, pants);

    // Slim the torso slightly
    this.parts.torso.scale.x = 0.82;

    // Add hair
    const hairColor = pick(PALETTE.hair);
    const hairMat = standardMaterial(hairColor, { roughness: 0.85 });
    const hair = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.28, 0.5), hairMat);
    hair.position.y = 1.6;
    applyShadowCasting(hair, true, false);
    this.group.add(hair);

    // Skirt/dress extension below torso
    const skirtMat = standardMaterial(cloth, { roughness: 0.9 });
    const skirt = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.32, 0.4, 8), skirtMat);
    skirt.position.y = 0.28;
    applyShadowCasting(skirt, true, false);
    this.group.add(skirt);

    this.animator = new NPCAnimator(this.parts);
    this.activity = new NPCActivity(ACTIVITY.WALK);
    this.wanderAngle = Math.random() * Math.PI * 2;
    this.homeX = x;
    this.homeZ = z;
    this.wanderRadius = 13 + Math.random() * 10;

    this.isPanicking = false;
    this.panicTimer = 0;
    this.panicAngle = 0;
    this.active = true;
    this.npcType = 'woman';
  }

  panic(fromX, fromZ) {
    this.isPanicking = true;
    this.panicTimer = 220 + Math.random() * 150;
    const dx = this.group.position.x - fromX;
    const dz = this.group.position.z - fromZ;
    const len = Math.sqrt(dx * dx + dz * dz) || 1;
    this.panicAngle = Math.atan2(dx / len, dz / len) + (Math.random() - 0.5) * 0.6;
    this.group.visible = true;
  }

  applySchedule(period) {
    if (period === TIME_PERIOD.NIGHT) {
      this.active = Math.random() < 0.15;
    } else if (period === TIME_PERIOD.EVENING) {
      this.active = Math.random() < 0.65;
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
        const speed = SETTINGS.npc.wanderSpeed * 2.5;
        this.group.position.x += Math.sin(this.panicAngle) * speed * dt;
        this.group.position.z += Math.cos(this.panicAngle) * speed * dt;
        this.group.rotation.y = this.panicAngle;
        this.panicAngle += (Math.random() - 0.5) * 0.22;
        this.animator.update(dt, true);
        return;
      }
    }

    const speedMult = period === TIME_PERIOD.MORNING  ? 1.2
                    : period === TIME_PERIOD.EVENING   ? 0.68
                    : period === TIME_PERIOD.NIGHT     ? 0.4
                    : 0.9;

    const isDaytime = period === TIME_PERIOD.MORNING || period === TIME_PERIOD.AFTERNOON;
    const allowed = isDaytime
      ? [ACTIVITY.WALK, ACTIVITY.SHOP, ACTIVITY.SHOP, ACTIVITY.EAT, ACTIVITY.IDLE]
      : [ACTIVITY.WALK, ACTIVITY.IDLE, ACTIVITY.IDLE];

    this.activity.update(dt, allowed);

    if (this.activity.is(ACTIVITY.WALK)) {
      const speed = SETTINGS.npc.wanderSpeed * speedMult;
      this.group.position.x += Math.sin(this.wanderAngle) * speed * dt;
      this.group.position.z += Math.cos(this.wanderAngle) * speed * dt;
      this.group.rotation.y = this.wanderAngle;

      if (Math.abs(this.group.position.x - this.homeX) > this.wanderRadius ||
          Math.abs(this.group.position.z - this.homeZ) > this.wanderRadius) {
        this.wanderAngle += Math.PI * (0.7 + Math.random() * 0.6);
      } else if (Math.random() < 0.007) {
        this.wanderAngle += (Math.random() - 0.5) * 1.0;
      }
      this.animator.update(dt, true);
    } else if (this.activity.is(ACTIVITY.SHOP)) {
      this.animator.playShop(dt);
    } else if (this.activity.is(ACTIVITY.EAT)) {
      this.animator.playEat(dt);
    } else {
      this.animator.playIdle(dt);
    }
  }
}
