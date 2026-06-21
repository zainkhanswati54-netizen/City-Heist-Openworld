import { PoliceNPC } from './PoliceNPC.js';
import { Pool } from '../utils/Pool.js';
import { SETTINGS } from '../config/settings.js';

export class PoliceNPCPool {
  constructor(scene, initialSize = 6) {
    this.scene = scene;
    this.pool = new Pool(
      () => this._create(),
      (npc) => this._reset(npc),
      initialSize
    );
  }

  _create() {
    const npc = new PoliceNPC(0, 0);
    npc.group.visible = false;
    this.scene.add(npc.group); // added once, toggled visible thereafter
    return npc;
  }

  _reset(npc) {
    npc.group.visible = false;
    npc.hp = SETTINGS.npc.maxHealth;
    npc.alive = true;
    npc.ai.fireTimer = 0;
  }

  spawn(x, z) {
    const npc = this.pool.acquire();
    npc.group.position.set(x, 0, z);
    npc.group.visible = true;
    npc.hp = SETTINGS.npc.maxHealth;
    npc.alive = true;
    return npc;
  }

  despawn(npc) {
    this.pool.release(npc);
  }

  get activeOfficers() {
    return this.pool.active;
  }
}
