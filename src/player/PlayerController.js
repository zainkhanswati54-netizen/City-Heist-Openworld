import { SETTINGS } from '../config/settings.js';

export class PlayerController {
  constructor(playerGroup, input) {
    this.playerGroup = playerGroup;
    this.input = input;
    this.yaw = 0;
  }

  update(dt, collisionCheck, worldHalf) {
    const cfg = SETTINGS.player;
    const running = this.input.isDown('run');
    const speed = (running ? cfg.runSpeed : cfg.walkSpeed) * dt;

    // Computed directly as scalars rather than allocating THREE.Vector3 instances —
    // this runs every frame the player is on foot, so avoiding the allocation matters.
    const forwardX = -Math.sin(this.yaw), forwardZ = -Math.cos(this.yaw);
    const rightX = Math.cos(this.yaw), rightZ = -Math.sin(this.yaw);

    let nx = this.playerGroup.position.x;
    let nz = this.playerGroup.position.z;
    let moved = false;

    if (this.input.isDown('forward')) { nx += forwardX * speed; nz += forwardZ * speed; moved = true; }
    if (this.input.isDown('backward')) { nx -= forwardX * speed; nz -= forwardZ * speed; moved = true; }
    if (this.input.isDown('left')) { nx -= rightX * speed; nz -= rightZ * speed; moved = true; }
    if (this.input.isDown('right')) { nx += rightX * speed; nz += rightZ * speed; moved = true; }

    nx = Math.max(-worldHalf + 2, Math.min(worldHalf - 2, nx));
    nz = Math.max(-worldHalf + 2, Math.min(worldHalf - 2, nz));

    if (!collisionCheck(nx, nz, cfg.collisionRadius)) {
      this.playerGroup.position.x = nx;
      this.playerGroup.position.z = nz;
    }

    this.playerGroup.rotation.y = this.yaw;
    return { moved, running };
  }
}
