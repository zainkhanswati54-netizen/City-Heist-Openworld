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

export class ElderNPC extends NPC {
  constructor(x, z) {
    const skin = pick(PALETTE.skin);
    const cloth = pick(PALETTE.elderTones);
    const pants = pick(PALETTE.elderTones);
    super(x, z, skin, cloth, pants);

    // Grey hair
    const hairMat = standardMaterial(0xcccccc, { roughness: 0.9 });
    const hair = new THREE.Mesh(new THREE.BoxGeometry(0.47, 0.14, 0.47), hairMat);
    hair.position.y = 1.6;
    applyShadowCasting(hair, true, false);
    this.group.add(hair);

    // Cane
    const caneMat = standardMaterial(0x5a3a1a, { roughness: 0.8 });
    const cane = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.1, 6), caneMat);
    cane.position.set(0.42, 0.4, 0);
    applyShadowCasting(cane, true, false);
    this.group.add(cane);

    // Slightly hunched — tilt torso forward
    if (this.parts.torso) {
      this.parts.torso.rotation.x = 0.18;
    }

    this.animator = new NPCAnimator(this.parts);
    this.activity = new NPCActivity(ACTIVITY.IDLE);
    this.wanderAngle = Math.random() * Math.PI * 2;
    this.homeX = x;
    this.homeZ = z;
    this.wanderRadius = 6 + Math.random() * 5;

    this.isPanicking = false;
    this.panicTimer = 0;
    this.panicAngle = 0;
    this.active = true;
    this.npcType = 'elder';
  }

  panic(fromX, fromZ) {
    this.isPanicking = true;
    this.panicTimer = 180 + Math.random() * 100;
    const dx = this.group.position.x - fromX;
    const dz = this.group.position.z - fromZ;
    const len = Math.sqrt(dx * dx + dz * dz) || 1;
    this.panicAngle = Math.atan2(dx / len, dz / len) + (Math.random() - 0.5) * 0.4;
    this.group.visible = true;
  }

  applySchedule(period) {
    // Elders stay home at night
    if (period === TIME_PERIOD.NIGHT) {
      this.active = false;
    } else if (period === TIME_PERIOD.EVENING) {
      this.active = Math.random() < 0.45;
    } else if (period === TIME_PERIOD.MORNING) {
      this.active = Math.random() < 0.75;
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
        // Elders shuffle slowly when panicking
        const speed = SETTINGS.npc.wanderSpeed * 1.4;
        this.group.position.x += Math.sin(this.panicAngle) * speed * dt;
        this.group.position.z += Math.cos(this.panicAngle) * speed * dt;
        this.group.rotation.y = this.panicAngle;
        this.animator.update(dt, true);
        return;
      }
    }

    // Elders are very slow
    const speedMult = period === TIME_PERIOD.MORNING ? 0.5
                    : period === TIME_PERIOD.AFTERNOON ? 0.45
                    : 0.35;

    // Elders prefer idling over walking, with occasional eating (sitting with a snack)
    this.activity.update(dt, [ACTIVITY.IDLE, ACTIVITY.IDLE, ACTIVITY.EAT, ACTIVITY.WALK]);

    if (this.activity.is(ACTIVITY.WALK)) {
      const speed = SETTINGS.npc.wanderSpeed * speedMult;
      this.group.position.x += Math.sin(this.wanderAngle) * speed * dt;
      this.group.position.z += Math.cos(this.wanderAngle) * speed * dt;
      this.group.rotation.y = this.wanderAngle;

      if (Math.abs(this.group.position.x - this.homeX) > this.wanderRadius ||
          Math.abs(this.group.position.z - this.homeZ) > this.wanderRadius) {
        this.wanderAngle += Math.PI * (0.8 + Math.random() * 0.4);
      } else if (Math.random() < 0.004) {
        this.wanderAngle += (Math.random() - 0.5) * 0.7;
      }
      this.animator.update(dt, true);
    } else if (this.activity.is(ACTIVITY.EAT)) {
      this.animator.playEat(dt);
    } else {
      this.animator.playIdle(dt);
    }
  }
}
