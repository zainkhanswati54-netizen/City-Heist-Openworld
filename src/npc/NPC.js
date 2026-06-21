import * as THREE from 'three';
import { PlayerLimb } from '../player/PlayerLimb.js';
import { SETTINGS } from '../config/settings.js';

export class NPC {
  constructor(x, z, skinColor, clothColor, pantsColor) {
    this.group = new THREE.Group();
    this.parts = PlayerLimb.buildBody(skinColor, clothColor, pantsColor);
    Object.values(this.parts).forEach(mesh => this.group.add(mesh));
    this.group.position.set(x, 0.75, z);
    this.hp = SETTINGS.npc.maxHealth;
    this.alive = true;
  }

  takeDamage(amount) {
    this.hp -= amount;
    if (this.hp <= 0) this.alive = false;
    return this.alive;
  }
}
