import { NPC } from './NPC.js';
import { NPCAnimator } from './NPCAnimator.js';
import { NPCActivity, ACTIVITY } from './NPCActivity.js';
import { PALETTE } from '../config/colors.js';
import { pick } from '../utils/RandomUtils.js';
import { SETTINGS } from '../config/settings.js';
import { TIME_PERIOD } from './DaySchedule.js';

export class PedestrianNPC extends NPC {
  constructor(x, z) {
    super(x, z, pick(PALETTE.skin), pick(PALETTE.pedestrianTones), 0x2a2a2a);
    this.animator = new NPCAnimator(this.parts);
    this.activity = new NPCActivity(ACTIVITY.WALK);
    this.wanderAngle = Math.random() * Math.PI * 2;
    this.homeX = x;
    this.homeZ = z;
    this.wanderRadius = 14 + Math.random() * 12;

    this.isPanicking = false;
    this.panicTimer = 0;
    this.panicAngle = 0;

    this.scheduleType = Math.random() < 0.55 ? 'worker' : 'casual';
    this.active = true;

    this._period = TIME_PERIOD.MORNING;
  }

  panic(fromX, fromZ) {
    this.isPanicking = true;
    this.panicTimer = 200 + Math.random() * 140;
    const dx = this.group.position.x - fromX;
    const dz = this.group.position.z - fromZ;
    const len = Math.sqrt(dx * dx + dz * dz) || 1;
    this.panicAngle = Math.atan2(dx / len, dz / len) + (Math.random() - 0.5) * 0.8;
    this.activity.force(ACTIVITY.PANIC, this.panicTimer);
    this.group.visible = true;
  }

  applySchedule(period) {
    this._period = period;
    if (period === TIME_PERIOD.NIGHT) {
      this.active = this.scheduleType === 'casual' && Math.random() < 0.18;
    } else if (period === TIME_PERIOD.EVENING) {
      this.active = Math.random() < 0.62;
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
        const speed = SETTINGS.npc.wanderSpeed * 2.8;
        this.group.position.x += Math.sin(this.panicAngle) * speed * dt;
        this.group.position.z += Math.cos(this.panicAngle) * speed * dt;
        this.group.rotation.y = this.panicAngle;
        this.panicAngle += (Math.random() - 0.5) * 0.25;
        this.animator.update(dt, true);
        return;
      }
    }

    const speedMult = period === TIME_PERIOD.MORNING  ? 1.3
                    : period === TIME_PERIOD.EVENING   ? 0.72
                    : period === TIME_PERIOD.NIGHT     ? 0.45
                    : 1.0;

    const allowed = period === TIME_PERIOD.MORNING
      ? [ACTIVITY.WALK, ACTIVITY.WALK, ACTIVITY.IDLE]
      : period === TIME_PERIOD.EVENING
        ? [ACTIVITY.WALK, ACTIVITY.IDLE, ACTIVITY.IDLE]
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
        this.wanderAngle += (Math.random() - 0.5) * 1.1;
      }

      this.animator.update(dt, true);
    } else {
      this.animator.playIdle(dt);
    }
  }
}
