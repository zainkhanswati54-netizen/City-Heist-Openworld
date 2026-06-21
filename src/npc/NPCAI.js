import { distance2D, angleTo } from '../utils/MathUtils.js';
import { SETTINGS } from '../config/settings.js';

export class NPCAI {
  constructor() {
    this.fireTimer = 0;
    this.alertTimer = 0;
    this.state = 'idle'; // 'idle' | 'patrol' | 'chase' | 'attack'
  }

  // wantedLevel: current player wanted stars (0-5)
  update(npcGroup, targetPos, dt, wantedLevel = 0) {
    const dist = distance2D(npcGroup.position.x, npcGroup.position.z, targetPos.x, targetPos.z);
    const cfg = SETTINGS.npc;
    let moving = false;
    let shouldFire = false;

    // Police ONLY engage when player is wanted (wantedLevel >= 1)
    const shouldEngage = wantedLevel >= 1;

    if (!shouldEngage) {
      // Idle patrol: slowly wander nearby position
      this.state = 'idle';
      this.alertTimer = 0;
      this.fireTimer = 0;
      return { moving: false, shouldFire: false, dist };
    }

    // Scale aggression by wanted level
    const chaseRadius = cfg.detectRadius * (0.6 + wantedLevel * 0.1);
    const attackRadius = cfg.attackRadius * (0.7 + wantedLevel * 0.06);
    const fireCooldown = Math.max(30, cfg.fireCooldown - wantedLevel * 10);
    const chaseSpeedMult = 0.8 + wantedLevel * 0.1;

    if (dist < chaseRadius && dist > attackRadius * 0.4) {
      const angle = angleTo(npcGroup.position.x, npcGroup.position.z, targetPos.x, targetPos.z);
      npcGroup.rotation.y = angle;
      npcGroup.position.x += Math.sin(angle) * cfg.chaseSpeed * chaseSpeedMult * dt;
      npcGroup.position.z += Math.cos(angle) * cfg.chaseSpeed * chaseSpeedMult * dt;
      moving = true;
      this.state = 'chase';
    } else if (dist <= attackRadius * 0.4) {
      const angle = angleTo(npcGroup.position.x, npcGroup.position.z, targetPos.x, targetPos.z);
      npcGroup.rotation.y = angle;
      this.state = 'attack';
    }

    this.fireTimer += dt;
    if (dist < attackRadius && this.fireTimer > fireCooldown && shouldEngage) {
      this.fireTimer = 0;
      shouldFire = true;
    }

    return { moving, shouldFire, dist };
  }
}
